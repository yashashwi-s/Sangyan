// A loopback-only controller for CUA browser checks. It changes the audit proxy,
// never browser settings or application data. Usage: node ... SNAPSHOT LOG-DIRECTORY
import http from 'node:http';
import {resolve} from 'node:path';
import {mkdir,writeFile} from 'node:fs/promises';
import {createAuditServers,sourceManifest} from './performance-network.mjs';
const [rootArg,outArg]=process.argv.slice(2);
if(!rootArg||!outArg)throw Error('Supply snapshot and log directory');
const root=resolve(rootArg),out=resolve(outArg);await mkdir(out,{recursive:true});
const servers=await createAuditServers(root);
await writeFile(resolve(out,'source-manifest.json'),JSON.stringify(await sourceManifest(root),null,2));
const control=http.createServer(async(req,res)=>{
  try{const url=new URL(req.url,'http://localhost');
    if(url.pathname==='/reset')servers.reset(url.searchParams.get('profile')||'recovered',url.searchParams.get('run')||'cua');
    await writeFile(resolve(out,'network.json'),JSON.stringify(servers.log,null,2));
    res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify({url:servers.url,events:servers.log.length}));
  }catch(error){res.writeHead(409);res.end(String(error));}
});
await new Promise(r=>control.listen(0,'127.0.0.1',r));
console.log(JSON.stringify({preview:servers.url,control:`http://127.0.0.1:${control.address().port}`}));
async function finish(){await writeFile(resolve(out,'network.json'),JSON.stringify(servers.log,null,2));control.closeAllConnections();control.close();await servers.close();process.exit(0);}
process.on('SIGINT',finish);process.on('SIGTERM',finish);
