// Local technical QA only. Never included in the public release.
// Interact through the browser UI using fictional data on this isolated origin.
import http from 'node:http';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
const root=resolve(import.meta.dirname,'../dist'),out=resolve(process.argv[2]||'/private/tmp/virasat-babulal-qa');
await mkdir(out,{recursive:true});let n=0;
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.mp3':'audio/mpeg','.svg':'image/svg+xml','.woff2':'font/woff2'};
const audit=`const panel=document.createElement('footer');panel.id='__qa';panel.style.cssText='display:block;min-width:0;overflow-wrap:anywhere';panel.innerHTML='<button type="button" id="__qa-run">Run local accessibility check</button><pre id="__qa-result" style="white-space:pre-wrap;overflow-wrap:anywhere;min-width:0;width:100%;max-width:100%"></pre>';document.body.append(panel);const output=panel.querySelector('pre');output.style.whiteSpace='pre-wrap';output.style.overflowWrap='anywhere';output.style.maxWidth='100%';output.style.overflow='auto';document.querySelector('#__qa-run').onclick=async()=>{const r=await axe.run({exclude:[['#__qa']]},{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}});const result={date:new Date().toISOString(),title:document.title,heading:document.querySelector('main h1')?.textContent,version:axe.version,viewport:{width:innerWidth,height:innerHeight,documentWidth:document.documentElement.scrollWidth,mainWidth:document.querySelector('main')?.clientWidth,mainScrollWidth:document.querySelector('main')?.scrollWidth},violations:r.violations,incomplete:r.incomplete,passedRules:r.passes.map(p=>p.id)};document.querySelector('#__qa-result').textContent=JSON.stringify(result,null,2);await fetch('/__qa/result',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(result)});};`;
http.createServer(async(req,res)=>{try{
 const path=new URL(req.url,'http://localhost').pathname;
 if(path==='/__qa/result'&&req.method==='POST'){let body='';for await(const chunk of req){body+=chunk;if(body.length>2000000)throw Error('QA result too large');}const data=JSON.parse(body);await writeFile(resolve(out,String(++n).padStart(2,'0')+'.json'),JSON.stringify(data,null,2));res.end('Saved');return;}
 if(req.method!=='GET'&&req.method!=='HEAD')throw Error('Read-only app');
 let data,type;
 if(path==='/__qa/axe.js'){data=await readFile('/private/tmp/virasat-audit-tools/node_modules/axe-core/axe.min.js');type=types['.js'];}
 else if(path==='/__qa/audit.js'){data=Buffer.from(audit);type=types['.js'];}
 else {const lang=/^\/([a-z]{2,3})\/?$/.exec(path),file=resolve(root,'.'+(lang?'/entry/'+lang[1]+'.html':path==='/'?'/index.html':path));if(!file.startsWith(root+'/'))throw Error('Path');data=await readFile(file);type=types[extname(file)]||'application/octet-stream';if(extname(file)==='.html'&&!path.startsWith('/paper/'))data=Buffer.from(data.toString().replace('</body>','<script src="/__qa/axe.js"></script><script type="module" src="/__qa/audit.js"></script></body>'));}
 res.writeHead(200,{'Content-Type':type,'Cache-Control':'no-store','Referrer-Policy':'no-referrer'});res.end(req.method==='HEAD'?undefined:data);
 }catch{res.writeHead(404);res.end('Not found');}}).listen(Number(process.env.PORT)||4390,'127.0.0.1',()=>console.log('Isolated fictional-data accessibility review ready on port '+(Number(process.env.PORT)||4390)+''));
