import {isKnownLanguage} from './dist/languages.js';
import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {gzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const root=resolve(import.meta.dirname,'dist');
// Preview the same privacy/security policy as the production static host.
const config=JSON.parse(await readFile(new URL('./vercel.json',import.meta.url),'utf8'));
const baselineHeaders=Object.fromEntries(config.headers.find(rule=>rule.source==='/(.*)').headers.map(({key,value})=>[key,value]));
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.json':'application/json','.mp3':'audio/mpeg','.woff2':'font/woff2'};
http.createServer(async(req,res)=>{try{
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname),locale=isKnownLanguage(pathname.replace(/^\/|\/$/g,'')),file=resolve(root,'.'+(locale?'/entry/'+pathname.replaceAll('/','')+'.html':pathname==='/'?'/index.html':pathname));
 if(!file.startsWith(root+'/')||pathname==='/_headers')throw new Error();
 const data=await readFile(file),audio=extname(file)==='.mp3',compressed=!audio&&extname(file)!=='.woff2'&&/\bgzip\b/.test(req.headers['accept-encoding']||'')&&data.length>512&&Boolean(types[extname(file)]);
 const headers={...baselineHeaders,'Content-Type':types[extname(file)]||'application/octet-stream',...(compressed?{'Content-Encoding':'gzip'}:{}),'Vary':'Accept-Encoding','Cache-Control':audio||pathname.startsWith('/locales/')?'public, max-age=31536000, immutable':'public, max-age=0, must-revalidate'};
 if(audio&&req.headers.range){const match=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);if(!match){res.writeHead(416,{'Content-Range':`bytes */${data.length}`});res.end();return;}const start=match[1]?Number(match[1]):Math.max(0,data.length-Number(match[2])),end=match[1]&&match[2]?Math.min(Number(match[2]),data.length-1):data.length-1;if(start>end||start>=data.length){res.writeHead(416,{'Content-Range':`bytes */${data.length}`});res.end();return;}res.writeHead(206,{...headers,'Accept-Ranges':'bytes','Content-Range':`bytes ${start}-${end}/${data.length}`,'Content-Length':end-start+1});res.end(data.subarray(start,end+1));return;}
 const body=compressed?gzipSync(data):data;headers.ETag='"'+createHash('sha256').update(body).digest('hex').slice(0,20)+'"';if(req.headers['if-none-match']===headers.ETag){res.writeHead(304,headers);res.end();return;}res.writeHead(200,{...headers,'Content-Length':body.length,...(audio?{'Accept-Ranges':'bytes'}:{})});res.end(req.method==='HEAD'?undefined:body);
 }catch{res.writeHead(404,{...baselineHeaders,'Content-Type':'text/plain'});res.end('Not found');}
}).listen(Number(process.env.PORT)||4173,'127.0.0.1',()=>process.stdout.write('Virasat preview ready\n'));
