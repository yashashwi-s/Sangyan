// Audit-only local network proxy. Never included in the public app.
import http from 'node:http';
import {readFile, readdir} from 'node:fs/promises';
import {resolve, extname} from 'node:path';
import {gzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {performance} from 'node:perf_hooks';

export const profiles = {
  steady: [{atMs:0,downKbps:160,latencyMs:800,online:true}],
  changing: [
    {atMs:0,downKbps:256,latencyMs:600,online:true},
    {atMs:1000,downKbps:96,latencyMs:1000,online:true},
    {atMs:3000,downKbps:0,latencyMs:0,online:false},
    {atMs:6000,downKbps:128,latencyMs:900,online:true},
    {atMs:12000,downKbps:256,latencyMs:600,online:true}
  ],
  recovered: [{atMs:0,downKbps:256,latencyMs:600,online:true}],
  offline: [{atMs:0,downKbps:0,latencyMs:0,online:false}]
};
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.json':'application/json','.mp3':'audio/mpeg','.woff2':'font/woff2','.txt':'text/plain; charset=utf-8'};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const listen=server=>new Promise(r=>server.listen(0,'127.0.0.1',()=>r(server.address().port)));

export async function sourceManifest(root){
  const entries=[];
  async function walk(dir){for(const entry of (await readdir(dir,{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name))){const file=resolve(dir,entry.name);if(entry.isDirectory())await walk(file);else {const body=await readFile(file);entries.push({path:file.slice(root.length+1),bytes:body.length,sha256:createHash('sha256').update(body).digest('hex')});}}}
  await walk(root);
  return {sha256:createHash('sha256').update(JSON.stringify(entries)).digest('hex'),files:entries};
}

export async function createAuditServers(root){
  root=resolve(root);
  const log=[],queue=[];
  let start=performance.now(),phases=profiles.steady,run='unassigned',lastPhase=-1,pendingStart=true;
  const phase=()=>{const elapsed=performance.now()-start;let n=0;for(let i=0;i<phases.length;i++)if(phases[i].atMs<=elapsed)n=i;return {n,...phases[n]};};
  const reset=(name,id=name)=>{if(!profiles[name])throw Error('Unknown profile');if(queue.length)throw Error('Cannot reset active responses');phases=profiles[name];start=performance.now();pendingStart=true;lastPhase=-1;run=id;log.push({event:'reset',run,profile:name,phases});};
  const origin=http.createServer(async(req,res)=>{
    try{
      const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
      const route=/^\/([a-z]{2,3})\/?$/.exec(pathname);
      const file=resolve(root,'.'+(route?`/entry/${route[1]}.html`:pathname==='/'?'/index.html':pathname));
      if(!file.startsWith(root+'/'))throw Error('Path outside snapshot');
      const data=await readFile(file),audio=extname(file)==='.mp3';
      const compressed=['.html','.js','.css','.json','.svg','.txt'].includes(extname(file))&&/\bgzip\b/.test(req.headers['accept-encoding']||'')&&data.length>512&&Boolean(types[extname(file)]);
      let body=compressed?gzipSync(data):data;
      const headers={'Content-Type':types[extname(file)]||'application/octet-stream',...(compressed?{'Content-Encoding':'gzip'}:{}),'Vary':'Accept-Encoding','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Cache-Control':audio||pathname.startsWith('/locales/')?'public, max-age=31536000, immutable':'public, max-age=0, must-revalidate'};
      headers.ETag='"'+createHash('sha256').update(body).digest('hex').slice(0,20)+'"';
      if(req.headers['if-none-match']===headers.ETag){res.writeHead(304,headers);res.end();return;}
      if(audio&&req.headers.range){const m=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);if(!m)throw Error('Invalid range');const first=m[1]?Number(m[1]):Math.max(0,body.length-Number(m[2]));const last=m[1]&&m[2]?Math.min(Number(m[2]),body.length-1):body.length-1;if(first>last||first>=body.length){res.writeHead(416,{'Content-Range':`bytes */${body.length}`});res.end();return;}headers['Content-Range']=`bytes ${first}-${last}/${body.length}`;body=body.subarray(first,last+1);res.writeHead(206,{...headers,'Accept-Ranges':'bytes','Content-Length':body.length});}
      else res.writeHead(200,{...headers,'Content-Length':body.length,...(audio?{'Accept-Ranges':'bytes'}:{})});
      res.end(req.method==='HEAD'?undefined:body);
    }catch{res.writeHead(404,{'Content-Type':'text/plain'});res.end('Not found');}
  });
  const originPort=await listen(origin);
  const proxy=http.createServer(async(req,res)=>{
    if(pendingStart){start=performance.now();pendingStart=false;log.push({event:'navigation-start',run});}
    const record={event:'request',run,path:req.url,atMs:Math.round(performance.now()-start),bytes:0,status:null,outcome:null};log.push(record);
    const state=phase();
    if(!state.online){record.outcome='offline-before-request';req.socket.destroy();return;}
    await sleep(state.latencyMs);
    if(res.destroyed){record.outcome='client-aborted-during-latency';return;}
    if(!phase().online){record.outcome='offline-after-latency';res.destroy();return;}
    const upstream=http.request({host:'127.0.0.1',port:originPort,path:req.url,method:req.method,headers:req.headers},up=>{
      const chunks=[];up.on('data',chunk=>chunks.push(chunk));up.on('end',()=>{
        if(res.destroyed){record.outcome='client-aborted-before-body';return;}
        record.status=up.statusCode;res.writeHead(up.statusCode,up.headers);
        const body=Buffer.concat(chunks);
        if(!body.length){record.outcome='complete';record.endMs=Math.round(performance.now()-start);res.end();return;}
        queue.push({res,body,offset:0,record});
      });
    });
    upstream.on('error',()=>{record.outcome='upstream-error';res.destroy();});upstream.end();
  });
  const proxyPort=await listen(proxy);
  // One shared token budget for all response bodies; parallel connections cannot multiply bandwidth.
  let tokens=0,lastTick=performance.now();
  const tick=setInterval(()=>{
    const now=performance.now(),elapsed=now-lastTick;lastTick=now;if(pendingStart)return;const p=phase();
    if(p.n!==lastPhase){lastPhase=p.n;log.push({event:'phase',run,atMs:Math.round(now-start),...p});}
    if(!p.online){tokens=0;for(const job of queue.splice(0)){job.record.outcome='outage-interrupted-response';job.record.endMs=Math.round(now-start);job.res.destroy();}return;}
    tokens=Math.min(tokens+p.downKbps*1000/8*elapsed/1000,p.downKbps*1000/8*.1);
    let rounds=queue.length;
    while(tokens>=1&&queue.length&&rounds-->0){const job=queue.shift();if(job.res.destroyed){job.record.outcome='client-aborted';continue;}const amount=Math.min(Math.floor(tokens),1024,job.body.length-job.offset);job.res.write(job.body.subarray(job.offset,job.offset+amount));job.offset+=amount;job.record.bytes+=amount;tokens-=amount;if(job.offset===job.body.length){job.record.outcome='complete';job.record.endMs=Math.round(now-start);job.res.end();}else queue.push(job);}
  },20);
  return {url:`http://127.0.0.1:${proxyPort}`,originUrl:`http://127.0.0.1:${originPort}`,reset,log,
    close:async()=>{clearInterval(tick);for(const job of queue.splice(0))job.res.destroy();proxy.closeAllConnections();origin.closeAllConnections();await Promise.all([new Promise(r=>proxy.close(r)),new Promise(r=>origin.close(r))]);}};
}
