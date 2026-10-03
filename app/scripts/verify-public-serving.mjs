// Read-only public HTTP checks, independent of browser fluency/usability claims.
// node app/scripts/verify-public-serving.mjs BASE_URL OUTPUT_JSON
import {writeFile,mkdir} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';
import {languageInfo} from '../dist/languages.js';
import {localeCatalog} from '../dist/locale-catalog.js';
import {audioCatalog} from '../dist/audio-catalog.js';
const [baseArg,outputArg]=process.argv.slice(2);
if(!baseArg||!outputArg)throw Error('Supply a public origin and evidence path');
const base=new URL(baseArg),result={date:new Date().toISOString(),origin:base.origin,pages:[],audio:[],errors:[],note:'Public HTTP integrity checks only; no account inputs, browser interaction, pronunciation or real-device assessment.'};
if(!['http:','https:'].includes(base.protocol)||base.username||base.password||base.search)throw Error('Supply an origin without credentials/query');
const request=path=>fetch(new URL(path,base),{credentials:'omit',signal:AbortSignal.timeout(20000)});
const require=(condition,message)=>{if(!condition)throw Error(message);};
for(const [language] of languageInfo)try{
 const response=await request('/'+language),page=await response.text();
 require(response.status===200&&response.headers.get('content-type')?.includes('text/html'),'Entry response/format');
 require(page.includes(`<html lang="${language}">`)&&page.includes('startup-retry')&&page.includes('aria-busy="true"'),'Native startup and retry');
 require(!response.headers.get('set-cookie'),'Unexpected cookie');
 const pack=await request(localeCatalog[language]),dictionary=await pack.json();
 require(pack.status===200&&Object.keys(dictionary).length===369&&dictionary.translationDraft&&dictionary.textOnly&&dictionary.audioAvailable,'Incomplete public dictionary');
 require(pack.headers.get('cache-control')?.includes('immutable'),'Locale not immutable');
 result.pages.push({language,status:response.status,localeKeys:Object.keys(dictionary).length});
}catch(error){result.errors.push({language,error:String(error)});}
for(const language of ['brx','ks'])try{require((await request('/'+language)).status===404,'Excluded language remains served');}catch(error){result.errors.push({language,error:String(error)});}
for(const [language,release] of Object.entries(audioCatalog))try{
 const path=`/audio/${language}/${release.revision}/homeTitle.mp3`;
 const response=await fetch(new URL(path,base),{headers:{Range:'bytes=0-63'},credentials:'omit',signal:AbortSignal.timeout(20000)}),body=await response.arrayBuffer();
 require(response.status===206&&response.headers.get('content-type')?.includes('audio/mpeg')&&body.byteLength===64,'Media MIME/range');
 require(/^bytes 0-63\/\d+$/.test(response.headers.get('content-range')||''),'Invalid media range');
 require(response.headers.get('cache-control')?.includes('immutable'),'Media not immutable');
 require(response.headers.get('referrer-policy')==='no-referrer'&&!response.headers.get('set-cookie'),'Media privacy headers');
 result.audio.push({language,revision:release.revision,clips:release.keys.length,rangeStatus:response.status});
}catch(error){result.errors.push({language,error:String(error)});}
const out=resolve(outputArg);await mkdir(dirname(out),{recursive:true});await writeFile(out,JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({pages:result.pages.length,audioLanguages:result.audio.length,errors:result.errors}));
if(result.errors.length)process.exitCode=1;
