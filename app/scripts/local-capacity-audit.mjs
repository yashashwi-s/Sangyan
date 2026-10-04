// Loopback-only synthetic asset fanout. This cannot certify Vercel/CDN or real-user capacity.
import http from 'node:http';
import {spawn,execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
import {performance} from 'node:perf_hooks';
import {sourceManifest} from './performance-network.mjs';
import {localeCatalog} from '../dist/locale-catalog.js';
import {supportAudioCatalog} from '../dist/audio-support-catalog.js';
const exec=promisify(execFile),root=resolve(process.argv[4]||'app/dist'),output=resolve(process.argv[2]||'docs/audits/2026-10-04-capacity/local-capacity.json');
const port=4198,host='127.0.0.1',language='hi',fanout=4,repeats=3,admissionMs=5000,maxRequests=20000,maxWireBytes=128*1024*1024,timeoutMs=3000,runDrainMs=5000,globalLimitMs=120000;
const inventory=JSON.parse(await readFile(resolve(process.argv[3]||'docs/audits/2026-10-04-privacy-recovery/delivery-scale.json'),'utf8'));
const manifest=await sourceManifest(root);if(manifest.sha256!==inventory.sourceSha256)throw Error('Rebuild the current delivery inventory before benchmarking');
// The preview serves app/dist. Verify every frozen public file still matches it.
for(const file of manifest.files)if(createHash('sha256').update(await readFile(resolve('app/dist',file.path))).digest('hex')!==file.sha256)throw Error('Frozen public release differs from preview: '+file.path);
const moduleFiles=inventory.eagerModules;
const resource=(path,kind,range=null)=>({path,kind,range});
const documentResource=resource('/hi','document');
const assets=['/styles.css','/favicon.svg',...moduleFiles.map(f=>'/'+f),localeCatalog[language]].map(path=>resource(path,path.startsWith('/locales/')?'dictionary':'asset'));
const clips=['plainHomeTitle','plainHomeIntro','plainNomineeMeaning'].map(key=>resource(`/audio/${language}/${supportAudioCatalog[language].revision}/${key}.mp3`,'fullAudio'));
const range=resource(clips[0].path,'audioRange','bytes=0-1023'),workload=[documentResource,...assets,...clips,range];
const durations=[];for(const clip of clips){const {stdout}=await exec('/opt/homebrew/bin/ffprobe',['-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',resolve(root,clip.path.slice(1))]);durations.push({path:clip.path,seconds:Number(stdout.trim())});}
const agent=new http.Agent({keepAlive:true,maxSockets:24,maxTotalSockets:24}),server=spawn(process.execPath,[resolve('app/server.mjs')],{env:{...process.env,PORT:String(port)},stdio:['ignore','pipe','pipe']});
let serverOutput='',serverErrors='',globalExpired=false;server.stdout.on('data',data=>serverOutput+=data);server.stderr.on('data',data=>serverErrors+=data);
const globalTimer=setTimeout(()=>{globalExpired=true;server.kill('SIGTERM');agent.destroy();},globalLimitMs);
function request(item,verify=false){return new Promise(resolveRequest=>{
 const start=performance.now();let wireBytes=0,status=null,contentLength=null,contentRange=null,encoding='',chunks=[];
 const req=http.request({host,port,path:item.path,method:'GET',agent,headers:{'Accept-Encoding':'gzip',...(item.range?{Range:item.range}:{})}},response=>{
  status=response.statusCode;contentLength=Number(response.headers['content-length']);contentRange=response.headers['content-range']||null;encoding=response.headers['content-encoding']||'';
  response.on('data',chunk=>{wireBytes+=chunk.length;if(verify)chunks.push(chunk);});
  response.on('end',()=>{let error=status!==(item.range?206:200)?`status ${status}`:wireBytes!==contentLength?'content-length mismatch':item.range&&contentRange!==`bytes 0-1023/${item.sourceBytes}`?'content-range mismatch':null;
   if(verify&&!error){try{const wire=Buffer.concat(chunks),body=encoding==='gzip'?gunzipSync(wire):wire;const expected=item.range?item.source.subarray(0,1024):item.source;if(!body.equals(expected))error='source bytes mismatch';}catch(e){error=String(e);}}
   resolveRequest({kind:item.kind,path:item.path,status,wireBytes,latencyMs:performance.now()-start,error});});
  response.on('error',e=>resolveRequest({kind:item.kind,path:item.path,status,wireBytes,latencyMs:performance.now()-start,error:String(e)}));
 });req.setTimeout(timeoutMs,()=>req.destroy(Error('request timeout')));req.on('error',e=>resolveRequest({kind:item.kind,path:item.path,status,wireBytes,latencyMs:performance.now()-start,error:String(e)}));req.end();
 });}
function quantile(values,p){if(!values.length)return null;const a=[...values].sort((a,b)=>a-b);return a[Math.min(a.length-1,Math.ceil(a.length*p)-1)];}
function stats(values){return {count:values.length,p50Ms:quantile(values,.5),p95Ms:quantile(values,.95),p99Ms:quantile(values,.99),maxMs:values.length?Math.max(...values):null};}
function cpuSeconds(value){const fields=value.trim().split(':').map(Number);return fields.reduce((n,v)=>n*60+v,0);}
async function sample(){try{const {stdout}=await exec('ps',['-p',String(server.pid),'-o','rss=,pcpu=,time=']);const match=stdout.trim().match(/^(\d+)\s+([\d.]+)\s+(\S+)$/);return match?{atMs:performance.now(),rssKiB:Number(match[1]),sampledCpuPercent:Number(match[2]),cumulativeCpuSeconds:cpuSeconds(match[3]),clientRssBytes:process.memoryUsage().rss}:null;}catch{return null;}}
const runs=[];
try{
 for(let i=0;i<100&&!serverOutput.includes('preview ready');i++){if(server.exitCode!==null)throw Error(serverErrors||'Preview failed');await new Promise(r=>setTimeout(r,50));}
 if(!serverOutput.includes('preview ready'))throw Error('Preview startup timeout');
 for(const item of workload){const path=item.path==='/hi'?'entry/hi.html':item.path.slice(1);item.source=await readFile(resolve(root,path));item.sourceBytes=item.source.length;const check=await request(item,true);if(check.error)throw Error(`Preflight ${item.path}: ${check.error}`);item.expectedWireBytes=check.wireBytes;}
 for(let repetition=1;repetition<=repeats;repetition++)for(const journeyConcurrency of [[1,3,6],[3,6,1],[6,1,3]][repetition-1]){
  if(globalExpired)throw Error('Global benchmark cap reached');
  const samples=[],requests=[],journeyLatencies=[],start=performance.now(),cpuBefore=await sample(),clientCpu=process.cpuUsage();let admitted=0,wireBytes=0,reservedWireBytes=0,active=0,peakActive=0,finishedJourneys=0,partialJourneys=0,sampling=false,capReason='';
  const timer=setInterval(async()=>{if(sampling)return;sampling=true;try{const row=await sample();if(row)samples.push(row);}finally{sampling=false;}},250);
  const send=async item=>{if(admitted>=maxRequests){capReason='request cap';return false;}if(reservedWireBytes+item.expectedWireBytes>maxWireBytes){capReason='wire cap';return false;}if(performance.now()-start>=admissionMs||globalExpired)return false;admitted++;reservedWireBytes+=item.expectedWireBytes;active++;peakActive=Math.max(peakActive,active);const result=await request(item);active--;requests.push(result);wireBytes+=result.wireBytes;return !result.error;};
  const worker=async()=>{while(!capReason&&performance.now()-start<admissionMs&&admitted<maxRequests&&reservedWireBytes<maxWireBytes&&!globalExpired){const before=performance.now();let complete=await send(documentResource);for(let i=0;i<assets.length&&complete;i+=fanout){const chunk=assets.slice(i,i+fanout);const results=await Promise.all(chunk.map(send));complete=results.every(Boolean);}for(const clip of [...clips,range])if(complete)complete=await send(clip);if(complete){finishedJourneys++;journeyLatencies.push(performance.now()-before);}else partialJourneys++;}};
  let drainExpired=false;const drain=setTimeout(()=>{drainExpired=true;agent.destroy();},admissionMs+runDrainMs);
  try{await Promise.all(Array.from({length:journeyConcurrency},worker));}finally{clearTimeout(drain);clearInterval(timer);}
  const end=performance.now(),cpuAfter=await sample();if(cpuAfter)samples.push(cpuAfter);const clientUsed=process.cpuUsage(clientCpu),errors=requests.filter(r=>r.error);
  runs.push({repetition,journeyConcurrency,maxRequestConcurrency:journeyConcurrency*fanout,observedPeakRequests:peakActive,elapsedMs:end-start,finishedJourneys,partialJourneys,admissionWindowMs:admissionMs,drainMs:Math.max(0,end-start-admissionMs),reservedWireBytes,admittedRequests:admitted,completedRequests:requests.length,wireBytes,requestsPerSecond:requests.length/((end-start)/1000),completeSyntheticJourneysPerSecond:finishedJourneys/((end-start)/1000),latency:stats(requests.map(r=>r.latencyMs)),completeJourneyLatency:stats(journeyLatencies),byKind:Object.fromEntries([...new Set(requests.map(r=>r.kind))].map(kind=>[kind,{...stats(requests.filter(r=>r.kind===kind).map(r=>r.latencyMs)),wireBytes:requests.filter(r=>r.kind===kind).reduce((n,r)=>n+r.wireBytes,0)}])),errors:errors.map(r=>({path:r.path,status:r.status,error:r.error})),stopReason:drainExpired?'drain cap':capReason|| (admitted>=maxRequests?'request cap':'admission window'),serverCpuSeconds:cpuBefore&&cpuAfter?cpuAfter.cumulativeCpuSeconds-cpuBefore.cumulativeCpuSeconds:null,clientCpuMs:(clientUsed.user+clientUsed.system)/1000,peakSampledServerRssKiB:samples.length?Math.max(...samples.map(s=>s.rssKiB)):null,samples});
  console.log(JSON.stringify({repetition,journeyConcurrency,requests:requests.length,finishedJourneys,p95Ms:runs.at(-1).latency.p95Ms,errors:errors.length,stopReason:runs.at(-1).stopReason}));
  await new Promise(r=>setTimeout(r,200));
 }
 const result={date:new Date().toISOString(),runtime:process.version,platform:process.platform,architecture:process.arch,sourceSha256:manifest.sha256,publicSha256:inventory.publicSha256,server:'current app/server.mjs local preview, not production Vercel server',transport:'loopback HTTP/1.1, persistent connections, no TLS or radio',limits:{port,fanout,repeats,admissionMs,maxRequests,maxWireBytes,timeoutMs,runDrainMs,globalLimitMs},workload:workload.map(({path,kind,range,sourceBytes,expectedWireBytes})=>({path,kind,range,sourceBytes,expectedWireBytes})),clipDurations:durations,requestsPerCompleteJourney:workload.length,runs,notes:['Synthetic cold asset journeys fetch document, eager assets in fanout batches of four, then three full public clips and one range. No client asset cache or playback-duration waits.','Journey concurrency and request concurrency are separately reported; these are not human users or measured financial-task sessions.','Server and load client share the same desktop host; client CPU, loopback and synchronous preview gzip can constrain results. Server/disk caches remain warm across runs.','This benchmark does not establish Vercel/CDN throughput, autoscaling, regional latency, hosting quotas, internet outages, user completion, Android memory or listening performance.','RSS is sampled for the single Node server only, includes runtime/buffers, and is not browser or physical-device memory.']};
 await mkdir(dirname(output),{recursive:true});await writeFile(output,JSON.stringify(result,null,2)+'\n');
 if(runs.some(r=>r.errors.length||r.stopReason==='drain cap'))process.exitCode=1;
}finally{clearTimeout(globalTimer);agent.destroy();server.kill('SIGTERM');}
