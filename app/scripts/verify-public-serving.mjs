// Read-only public HTTP checks, independent of browser fluency/usability claims.
// node app/scripts/verify-public-serving.mjs BASE_URL OUTPUT_JSON
import {writeFile,mkdir,readFile} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {sourceManifest} from './performance-network.mjs';
import {languageInfo} from '../dist/languages.js';
import {localeCatalog} from '../dist/locale-catalog.js';
import {audioCatalog} from '../dist/audio-catalog.js';
const [baseArg,outputArg]=process.argv.slice(2);
if(!baseArg||!outputArg)throw Error('Supply a public origin and evidence path');
const root=resolve(new URL('../dist/',import.meta.url).pathname),manifest=await sourceManifest(root);
// Hosting configuration is applied by Vercel, not published as a static asset.
manifest.files=manifest.files.filter(file=>file.path!=='_headers');
manifest.sha256=createHash('sha256').update(JSON.stringify(manifest.files)).digest('hex');
const expectedKeys=Object.keys(JSON.parse(await readFile(resolve(root,'.'+localeCatalog.en),'utf8'))).sort();
const base=new URL(baseArg),result={date:new Date().toISOString(),origin:base.origin,sourceSha256:manifest.sha256,pages:[],audio:[],assets:[],excludedPaths:[],errors:[],note:'Public HTTP integrity checks only; all non-MP3 public assets and one complete homeTitle MP3 per audio language are compared with local SHA-256. Remaining MP3s have local full-pack integrity/decode validation, not individual live download verification. No account inputs, browser interaction, pronunciation or real-device assessment.'};
if(!['http:','https:'].includes(base.protocol)||base.username||base.password||base.search)throw Error('Supply an origin without credentials/query');
const request=path=>fetch(new URL(path,base),{credentials:'omit',signal:AbortSignal.timeout(20000)});
const require=(condition,message)=>{if(!condition)throw Error(message);};
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
function privacy(response){
 require(!response.headers.get('set-cookie'),'Unexpected cookie');
 require(response.headers.get('referrer-policy')==='no-referrer','Referrer privacy header');
 require(response.headers.get('x-content-type-options')==='nosniff','Missing nosniff');
 const policy=response.headers.get('content-security-policy')||'';
 require(policy.includes("default-src 'none'")&&policy.includes("connect-src 'self'")&&policy.includes("form-action 'none'")&&policy.includes("frame-ancestors 'none'"),'Content security policy');
 require(response.headers.get('permissions-policy')?.includes('microphone=()'),'Microphone policy');
}
for(const [language] of languageInfo)try{
 const response=await request('/'+language),page=await response.text();
 require(response.status===200&&response.headers.get('content-type')?.includes('text/html'),'Entry response/format');
 require(page.includes(`<html lang="${language}">`)&&page.includes('startup-retry')&&page.includes('aria-busy="true"'),'Native startup and retry');
 privacy(response);
 const localPage=await readFile(resolve(root,'entry',language+'.html'));
 require(hash(Buffer.from(page))===hash(localPage),'Entry source differs from local release');
 const pack=await request(localeCatalog[language]),packBytes=Buffer.from(await pack.arrayBuffer()),dictionary=JSON.parse(packBytes);
 require(pack.status===200&&JSON.stringify(Object.keys(dictionary).sort())===JSON.stringify(expectedKeys)&&dictionary.translationDraft&&dictionary.textOnly&&dictionary.audioAvailable,'Incomplete public dictionary');
 require(pack.headers.get('cache-control')?.includes('immutable'),'Locale not immutable');
 privacy(pack);
 require(hash(packBytes)===hash(await readFile(resolve(root,'.'+localeCatalog[language]))),'Locale source differs from local release');
 result.pages.push({language,status:response.status,localeKeys:Object.keys(dictionary).length,entrySha256:hash(localPage),dictionarySha256:hash(packBytes)});
}catch(error){result.errors.push({language,error:String(error)});}
for(const language of ['brx','ks'])try{require((await request('/'+language)).status===404,'Excluded language remains served');}catch(error){result.errors.push({language,error:String(error)});}
for(const [language,release] of Object.entries(audioCatalog))try{
 const path=`/audio/${language}/${release.revision}/homeTitle.mp3`;
 const response=await fetch(new URL(path,base),{headers:{Range:'bytes=0-63'},credentials:'omit',signal:AbortSignal.timeout(20000)}),body=await response.arrayBuffer();
 require(response.status===206&&response.headers.get('content-type')?.includes('audio/mpeg')&&body.byteLength===64,'Media MIME/range');
 require(/^bytes 0-63\/\d+$/.test(response.headers.get('content-range')||''),'Invalid media range');
 require(response.headers.get('cache-control')?.includes('immutable'),'Media not immutable');
 require(response.headers.get('referrer-policy')==='no-referrer'&&!response.headers.get('set-cookie'),'Media privacy headers');
 privacy(response);
 const local=await readFile(resolve(root,'.'+path)),full=await request(path),bytes=Buffer.from(await full.arrayBuffer());
 require(full.status===200&&hash(bytes)===hash(local),'Complete sample MP3 differs from local release');
 require(Buffer.from(body).equals(local.subarray(0,64)),'MP3 range differs from local release');
 result.audio.push({language,revision:release.revision,clips:release.keys.length,rangeStatus:response.status,sampleBytes:bytes.length,sampleSha256:hash(bytes)});
}catch(error){result.errors.push({language,error:String(error)});}
// Four bounded workers avoid a burst of requests while comparing the entire public shell,
// language dictionaries, fonts and attribution. Audio checks above deliberately sample clips.
const assets=manifest.files.filter(file=>file.path!=='_headers'&&!file.path.endsWith('.mp3'));
let cursor=0;
await Promise.all(Array.from({length:4},async()=>{
 while(cursor<assets.length){const file=assets[cursor++];try{
  const response=await request('/'+file.path),bytes=Buffer.from(await response.arrayBuffer());
  require(response.status===200&&hash(bytes)===file.sha256,'Public asset source differs from local release');
  privacy(response);result.assets.push({path:file.path,bytes:bytes.length,sha256:file.sha256});
 }catch(error){result.errors.push({path:file.path,error:String(error)});}}
}));
result.assets.sort((a,b)=>a.path.localeCompare(b.path));
for(const path of ['/audio/public-text.json','/audio/candidates.json','/audio/piper-ne-model-source.json','/audio/recordings-ne.json','/audio/piper-requirements-lock.txt','/translations/en.json','/translation-handoff/README.md','/scripts/build-audio.mjs','/scripts/generate-piper-ne.py','/tests/locales.test.mjs','/.vercel/project.json','/vercel.json','/server.mjs','/_headers','/package.json'])try{
 const response=await request(path);require(response.status===404,'Build-only or hosting metadata is publicly served');result.excludedPaths.push({path,status:response.status});
}catch(error){result.errors.push({path,error:String(error)});}
const out=resolve(outputArg);await mkdir(dirname(out),{recursive:true});await writeFile(out,JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({pages:result.pages.length,audioLanguages:result.audio.length,sourceAssets:result.assets.length,excludedPaths:result.excludedPaths.length,errors:result.errors}));
if(result.errors.length)process.exitCode=1;
