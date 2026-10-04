// Exercise the audit apparatus with synthetic public fixture bytes, outside a browser.
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {performance} from 'node:perf_hooks';
import {createAuditServers} from './performance-network.mjs';
const root=await mkdtemp(join(tmpdir(),'virasat-proxy-check-'));
await writeFile(join(root,'small.mp3'),Buffer.alloc(20000,1));
await writeFile(join(root,'large.mp3'),Buffer.alloc(128000,2));
const servers=await createAuditServers(root);
try{
  servers.reset('steady','aggregate-cap-check');const start=performance.now();
  const data=await Promise.all([fetch(`${servers.url}/small.mp3`).then(r=>r.arrayBuffer()),fetch(`${servers.url}/small.mp3`).then(r=>r.arrayBuffer())]);
  const elapsedMs=performance.now()-start;assert.deepEqual(data.map(d=>d.byteLength),[20000,20000]);
  // 40KB at shared160kbps needs2s bodytime +800ms latency; individual caps would be too fast.
  assert(elapsedMs>=2650,`Unexpectedly fast shared transfer: ${elapsedMs}ms`);
  servers.reset('changing','outage-check');let failed=false;
  try{await fetch(`${servers.url}/large.mp3`).then(r=>r.arrayBuffer());}catch{failed=true;}
  assert(failed,'The scheduled outage must break the long transfer');
  assert(servers.log.some(e=>e.outcome==='outage-interrupted-response'));
  await new Promise(r=>setTimeout(r,3300));
  const recovered=await fetch(`${servers.url}/small.mp3`,{headers:{Range:'bytes=0-99'}});
  assert.equal(recovered.status,206);assert.equal((await recovered.arrayBuffer()).byteLength,100);
  assert.equal(recovered.headers.get('content-range'),'bytes 0-99/20000');
  console.log(JSON.stringify({passed:true,aggregateElapsedMs:Math.round(elapsedMs),outageInterrupted:true,recoveryRangeBytes:100,network:servers.log}));
}finally{await servers.close();await rm(root,{recursive:true,force:true});}
