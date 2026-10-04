// Data-path measurement only; no browser UI, download, storage or phone simulation.
import assert from 'node:assert/strict';
import {performance} from 'node:perf_hooks';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {sealCase,openCase} from '../dist/privacy.js';
import {restoreWorkspace} from '../dist/tracker.js';
import {scaleWorkspace} from '../tests/workspace-scale-fixture.mjs';
const output=resolve(process.argv[2]||'../docs/audits/2026-10-04-workspace-scale/measurement.json');
const sources={};for(const file of ['privacy.js','tracker.js','languages.js','institutions.js'])sources[file]=createHash('sha256').update(await readFile(new URL(`../dist/${file}`,import.meta.url))).digest('hex');
const workspace=scaleWorkspace(),expected=restoreWorkspace(workspace),runs=[];
for(let i=0;i<3;i++){
 const start=performance.now(),sealed=await sealCase(workspace,'synthetic workspace password 2026'),sealMs=performance.now()-start;
 const unlockStart=performance.now(),plain=await openCase(sealed,'synthetic workspace password 2026'),unlockMs=performance.now()-unlockStart;
 const validateStart=performance.now(),restored=restoreWorkspace(plain),validateMs=performance.now()-validateStart;
 assert.deepEqual(restored,expected);
 runs.push({iteration:i+1,sealMs,unlockMs,validateMs,envelopeBytes:Buffer.byteLength(sealed)});
}
await mkdir(resolve(output,'..'),{recursive:true});
await writeFile(output,JSON.stringify({date:new Date().toISOString(),runtime:process.version,platform:process.platform,architecture:process.arch,sources,accounts:50,eventsPerAccount:20,plaintextBytes:Buffer.byteLength(JSON.stringify(workspace)),runs,notes:['Synthetic records only; exact decrypted workspace compared with validated original.','Node WebCrypto timings on the desktop host, three sequential runs; not browser or physical 2 GB Android evidence.','No file download/import UI, browser storage, eviction, tab termination, typing latency, network or traffic capacity measured.']},null,2)+'\n');
console.log(output);
