// Local manual UI review through the normal browser tool; no scripted DOM actions.
import {writeFile,mkdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {createAuditServers,sourceManifest} from './performance-network.mjs';
const [rootArg,outArg]=process.argv.slice(2);if(!rootArg||!outArg)throw Error('Supply frozen public snapshot and evidence output');
const root=resolve(rootArg),out=resolve(outArg),manifest=await sourceManifest(root),servers=await createAuditServers(root);servers.reset('umts3g','manual-ui');
await mkdir(dirname(out),{recursive:true});const save=()=>writeFile(out,JSON.stringify({date:new Date().toISOString(),sourceSha256:manifest.sha256,url:servers.url,profile:{downKbps:384,fixedRequestLatencyMs:200},scope:'Manual rendered-UI review using the in-app desktop browser. No device RAM or CPU age emulation. Response-body-only network shaping.',log:servers.log},null,2));
const timer=setInterval(()=>save(),2000);await save();console.log(servers.url);process.on('SIGTERM',async()=>{clearInterval(timer);await save();await servers.close();process.exit();});
