// Static delivery inventory and arithmetic scenarios; no simulated traffic/load claim.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,dirname,posix} from 'node:path';
import {gzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {sourceManifest} from './performance-network.mjs';
import {localeCatalog} from '../dist/locale-catalog.js';
const root=resolve('app/dist'),output=resolve(process.argv[2]||'docs/audits/2026-10-04-privacy-recovery/delivery-scale.json');
const manifest=await sourceManifest(root),modules=new Set();
async function imports(file){if(modules.has(file))return;modules.add(file);const source=await readFile(resolve(root,file),'utf8');for(const match of source.matchAll(/import\s+[\s\S]*?from\s+['"]([^'"]+)['"]/g))if(match[1].startsWith('.'))await imports(posix.normalize(posix.join(posix.dirname(file),match[1])));}
await imports('main.js');
const routes=[];
for(const [language,locale] of Object.entries(localeCatalog)){
 const files=[`entry/${language}.html`,'styles.css','favicon.svg',...modules,locale.slice(1)];
 if(language==='mni')files.push('fonts/noto-sans-meetei-mayek.woff2');if(language==='sat')files.push('fonts/noto-sans-ol-chiki.woff2');
 let bytes=0,gzipBytes=0;for(const file of files){const body=await readFile(resolve(root,file));bytes+=body.byteLength;gzipBytes+=gzipSync(body).byteLength;}
 routes.push({language,fileCount:files.length,bodyBytes:bytes,perFileGzipBytes:gzipBytes});
}
const publicFiles=manifest.files.filter(f=>f.path!=='_headers');
const audio=manifest.files.filter(f=>f.path.endsWith('.mp3')),hi=routes.find(r=>r.language==='hi');
const scenarios=[1000,100000,1000000].map(sessions=>({coldSessions:sessions,hindiAppGzipGB:sessions*hi.perFileGzipBytes/1e9,oneMiBAudioEachGB:sessions*1024*1024/1e9,tenMiBAudioEachGB:sessions*10*1024*1024/1e9}));
const result={date:new Date().toISOString(),sourceSha256:manifest.sha256,publicSha256:createHash('sha256').update(JSON.stringify(publicFiles)).digest('hex'),publicFiles:publicFiles.length,publicBytes:publicFiles.reduce((sum,f)=>sum+f.bytes,0),audioFiles:audio.length,audioBytes:audio.reduce((sum,f)=>sum+f.bytes,0),eagerModules:[...modules].sort(),routes,scenarios,browserBounds:{accounts:50,eventsPerAccount:20,plaintextSaveBytes:1048576,importBytes:2097152,publicShellCacheBodyBytes:8388608,audioCacheBodyBytes:12582912,audioCacheEntries:256},notes:['Body/gzip inventory only: not browser network transfer or timing; no throughput/load test performed.','App bodies include one selected dictionary/font and static eager modules, excluding service-worker installation, headers, TLS, retries and compression negotiation.','Scenario arithmetic assumes independent cold sessions and zero browser-cache reuse; optional audio volume is an explicit assumption, not measured behavior.','CDN cache hits can reduce origin work but do not imply zero delivery cost. Provider rates/quotas and request counts must be applied separately.','Browser cache response-body ceilings exclude metadata, browser memory and retained unsaved drafts.']};
await mkdir(dirname(output),{recursive:true});await writeFile(output,JSON.stringify(result,null,2)+'\n');console.log(output);
