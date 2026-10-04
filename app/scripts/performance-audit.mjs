// Navigation-only Lighthouse audit; no automated form interaction or direct CDP commands.
// Usage: node app/scripts/performance-audit.mjs SNAPSHOT OUTPUT [LANGUAGE=hi] [RUNS=3] [PROFILES=steady,changing,recovered]
import {resolve} from 'node:path';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {gzipSync} from 'node:zlib';
import {createAuditServers,sourceManifest,profiles} from './performance-network.mjs';
const exec=promisify(execFile);
const [snapshotArg,outArg,language='hi',runsArg='3',profileArg='steady,changing,recovered']=process.argv.slice(2);
const selectedProfiles=profileArg.split(',');
if(!selectedProfiles.length||new Set(selectedProfiles).size!==selectedProfiles.length||selectedProfiles.some(p=>!['steady','changing','recovered'].includes(p)))throw Error('Select defined steady, changing or recovered profiles');
if(!Number.isInteger(Number(runsArg))||Number(runsArg)<1||Number(runsArg)>3)throw Error('Use one to three bounded repetitions');
if(!snapshotArg||!outArg)throw Error('Supply a frozen public snapshot and output directory');
const snapshot=resolve(snapshotArg),out=resolve(outArg),runtime=process.env.VIRASAT_AUDIT_TOOLS||'/private/tmp/virasat-audit-tools';
const {default:lighthouse}=await import(pathToFileURL(resolve(runtime,'node_modules/lighthouse/core/index.js')));
const chromeLauncher=await import(pathToFileURL(resolve(runtime,'node_modules/chrome-launcher/dist/index.js')));
const version=JSON.parse(await readFile(resolve(runtime,'node_modules/lighthouse/package.json'),'utf8')).version;
await mkdir(out,{recursive:true});
const manifest=await sourceManifest(snapshot);await writeFile(resolve(out,'source-manifest.json'),JSON.stringify(manifest,null,2));
const servers=await createAuditServers(snapshot),summaries=[];
const flags=['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--js-flags=--max-old-space-size=64'];
const processSamples=[];let sampling=false;
async function sampleTree(rootPid,label){if(sampling)return;sampling=true;try{
  const {stdout}=await exec('ps',['-axo','pid=,ppid=,rss=,command=']);
  const rows=stdout.split('\n').map(line=>/^\s*(\d+)\s+(\d+)\s+(\d+)\s+(.*)$/.exec(line)).filter(Boolean).map(m=>({pid:+m[1],ppid:+m[2],rssKiB:+m[3],command:m[4]}));
  const ids=new Set([rootPid]);let changed=true;while(changed){changed=false;for(const row of rows)if(ids.has(row.ppid)&&!ids.has(row.pid)){ids.add(row.pid);changed=true;}}
  const tree=rows.filter(r=>ids.has(r.pid));processSamples.push({run:label,at:new Date().toISOString(),processCount:tree.length,rssKiBSum:tree.reduce((n,r)=>n+r.rssKiB,0),processes:tree.map(r=>({pid:r.pid,ppid:r.ppid,rssKiB:r.rssKiB,type:r.command.includes('--type=renderer')?'renderer':r.command.includes('--type=gpu-process')?'gpu':r.pid===rootPid?'browser':'other'}))});
}catch(error){processSamples.push({run:label,error:String(error)});}finally{sampling=false;}}
try{
  for(const profile of selectedProfiles)for(let iteration=1;iteration<=Number(runsArg);iteration++){
    const id=`${profile}-${iteration}`;
    // A new Chrome process and user directory give every navigation a cold browser.
    const chrome=await chromeLauncher.launch({chromeFlags:flags,logLevel:'silent'});
    servers.reset(profile,id);
    const timer=setInterval(()=>sampleTree(chrome.pid,id),500);await sampleTree(chrome.pid,id);
    try{
      const result=await lighthouse(`${servers.url}/${language}`,{port:chrome.port,logLevel:'error',onlyCategories:['performance','accessibility','best-practices','seo'],throttlingMethod:'devtools',maxWaitForLoad:45000,maxWaitForFcp:45000,extraTraceCategories:'disabled-by-default-v8.gc'}, {extends:'lighthouse:default',settings:{throttlingMethod:'devtools',throttling:{cpuSlowdownMultiplier:8,requestLatencyMs:0,downloadThroughputKbps:0,uploadThroughputKbps:0},formFactor:'mobile',screenEmulation:{mobile:true,width:360,height:800,deviceScaleFactor:1,disabled:false}}});
      const lhr=result.lhr,a=lhr.audits;
      await writeFile(resolve(out,`${id}.lhr.json`),JSON.stringify(lhr,null,2));
      await writeFile(resolve(out,`${id}.trace.json.gz`),gzipSync(JSON.stringify(result.artifacts.Trace)));
      await writeFile(resolve(out,`${id}.devtools.json.gz`),gzipSync(JSON.stringify(result.artifacts.DevtoolsLog)));
      const trace=result.artifacts.Trace?.traceEvents||[];
      const heapSamples=trace.filter(e=>typeof e.args?.data?.jsHeapSizeUsed==='number').map(e=>({traceTimestampUs:e.ts,pid:e.pid,usedBytes:e.args.data.jsHeapSizeUsed}));
      const ready=trace.filter(e=>e.name==='virasat-ready').map(e=>({traceTimestampUs:e.ts,category:e.cat}));
      const summary={id,profile,iteration,url:lhr.finalDisplayedUrl,lighthouseVersion:lhr.lighthouseVersion,chromeVersion:lhr.environment?.hostUserAgent,runtimeError:lhr.runtimeError||null,warnings:lhr.runWarnings,scores:Object.fromEntries(Object.entries(lhr.categories).map(([k,v])=>[k,v.score])),lcpMs:a['largest-contentful-paint']?.numericValue,fcpMs:a['first-contentful-paint']?.numericValue,tbtMs:a['total-blocking-time']?.numericValue,cls:a['cumulative-layout-shift']?.numericValue,navigationTransferBytes:a['total-byte-weight']?.numericValue,controlsReadyMs:a['user-timings']?.details?.items?.find(item=>item.name==='virasat-ready')?.startTime??null,readyMarks:ready,heap:{v8OldSpaceCapMiB:64,traceSampleCount:heapSamples.length,maxObservedUsedBytes:heapSamples.length?Math.max(...heapSamples.map(s=>s.usedBytes)):null,samples:heapSamples}};
      summaries.push(summary);console.log(JSON.stringify({id,lcpMs:summary.lcpMs,tbtMs:summary.tbtMs,scores:summary.scores,runtimeError:summary.runtimeError}));
    }catch(error){summaries.push({id,profile,iteration,error:String(error)});console.log(JSON.stringify({id,error:String(error)}));}
    finally{clearInterval(timer);await sampleTree(chrome.pid,id);await chrome.kill();await new Promise(r=>setTimeout(r,500));}
    await writeFile(resolve(out,'summary.json'),JSON.stringify({date:new Date().toISOString(),sourceSha256:manifest.sha256,lighthouseVersion:version,language,selectedProfiles,chromeFlags:flags,cpuSlowdownMultiplier:8,profiles,notes:['Proxy shapes aggregate response bodies only; upload shaping, radio/DNS/TLS behaviour are not emulated.','64MiB V8 old-space cap is not a 64MiB total heap or physical phone RAM constraint.','RSS sums double-count some shared pages and include Chrome, not just app memory.','Fresh-browser recovered runs prove cold navigation after availability returns, not recovery of the same failed page.'],runs:summaries},null,2));
    await writeFile(resolve(out,'network.json'),JSON.stringify(servers.log,null,2));
    await writeFile(resolve(out,'process-memory.json'),JSON.stringify(processSamples,null,2));
  }
}finally{await servers.close();}
