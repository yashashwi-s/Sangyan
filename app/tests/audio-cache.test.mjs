import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {audioLanguages,languageInfo} from '../dist/languages.js';
const source=await readFile(new URL('../dist/sw.js',import.meta.url),'utf8');
function setup(audioBytes=8,network=null){
 const stores=new Map(),handlers={},calls=[];let cacheReads=0;let online=true,storageAvailable=true;let clients=[],activations=0;
 const caches={async keys(){return [...stores.keys()];},async delete(k){return stores.delete(k);},async open(name){if(!storageAvailable)throw Error('storage denied');if(!stores.has(name))stores.set(name,new Map());const store=stores.get(name);return {async addAll(files){for(const f of files)store.set(f,new Response('shell'));},async put(key,response){store.set(typeof key==='string'?key:key.url,response.clone());},async match(key){cacheReads++;return store.get(typeof key==='string'?key:key.url)?.clone();},async keys(){return [...store.keys()].map(url=>({url}));},async delete(key){return store.delete(typeof key==='string'?key:key.url);}};}};
 const context={caches,URL,Request,Response,Headers,Uint8Array,self:{location:{origin:'https://virasat.test'},clients:{async claim(){},async matchAll(){return clients;}},async skipWaiting(){activations++;},addEventListener(name,handler){handlers[name]=handler;}},fetch:async request=>{calls.push(request);if(!online)throw Error('offline');if(network)return network(request);return new Response(Uint8Array.from({length:audioBytes},(_,i)=>i%256),{headers:{'Content-Type':'audio/mpeg','Content-Length':String(audioBytes)}});}};
 vm.runInNewContext(source,context);
 const waits=[];
 return {handlers,stores,calls,get activations(){return activations;},setClients(values){clients=values.map(id=>({id,postMessage(){}}));},get cacheReads(){return cacheReads;},denyStorage(){storageAvailable=false;},setOffline(){online=false;},async install(){handlers.install({waitUntil:p=>waits.push(p)});await Promise.all(waits);},async request(path,options={}){let response;const pending=[];handlers.fetch({request:new Request('https://virasat.test'+path,options),respondWith:p=>response=p,waitUntil:p=>pending.push(p)});const result=await response;await Promise.all(pending);return result;}};
}
test('installation caches the public shell without preloading any audio or user values',async()=>{
 const env=setup();await env.install();const shell=[...env.stores.values()][0];assert.ok(shell.has('/index.html'));assert.ok(shell.has('/audio-catalog.js'));assert.ok([...shell.keys()].every(k=>!k.includes('.mp3')));assert.equal(env.calls.length,0);
});
test('the chosen paper fallback is retained offline without downloading every language or intercepting private URLs',async()=>{
 const env=setup();await env.install();const pending=[];env.handlers.message({data:{type:'cache-language',language:'hi'},waitUntil:p=>pending.push(p)});await Promise.all(pending);assert.ok(env.calls.some(r=>new URL(r.url).pathname==='/paper/hi.html'));assert.ok(!env.calls.some(r=>new URL(r.url).pathname==='/paper/en.html'));
 env.setOffline();assert.ok(await env.request('/paper/hi.html'));assert.equal(await env.request('/paper/xx.html'),undefined);assert.equal(await env.request('/paper/hi.html?private=value'),undefined);
});
test('played audio is available offline, with valid media byte ranges',async()=>{
 const env=setup();const path='/audio/hi/012345abcdef/homeTitle.mp3';const first=await env.request(path);assert.equal(first.status,200);assert.equal(env.calls.length,1);env.setOffline();const again=await env.request(path,{headers:{Range:'bytes=2-5'}});assert.equal(again.status,206);assert.equal(again.headers.get('Content-Range'),'bytes 2-5/8');assert.deepEqual([...new Uint8Array(await again.arrayBuffer())],[2,3,4,5]);assert.equal(env.calls.length,1);
 const suffix=await env.request(path,{headers:{Range:'bytes=-2'}});assert.deepEqual([...new Uint8Array(await suffix.arrayBuffer())],[6,7]);const invalid=await env.request(path,{headers:{Range:'bytes=99-100'}});assert.equal(invalid.status,416);
});
test('offline audio support follows the checked release registry and excludes text-only languages',async()=>{
 const env=setup();
 for(const language of audioLanguages){
  const path=`/audio/${language}/012345abcdef/homeTitle.mp3`;
  assert.equal((await env.request(path)).status,200,language);
 }
 env.setOffline();
 for(const language of audioLanguages)assert.equal((await env.request(`/audio/${language}/012345abcdef/homeTitle.mp3`)).status,200,language);
 for(const [language] of languageInfo)if(!audioLanguages.includes(language))assert.equal(await env.request(`/audio/${language}/012345abcdef/homeTitle.mp3`),undefined,language);
});
test('cached shell supports all language entry routes without intercepting private or external requests',async()=>{
 const env=setup();await env.install();env.setOffline();assert.ok(await env.request('/main.js'));
 for(const path of ['/account?name=Private','/audio/hi/012345abcdef/homeTitle.mp3?name=Private','/private-file.virasat'])assert.equal(await env.request(path),undefined);
 assert.equal(await env.request('/upload',{method:'POST',body:'private'}),undefined);
});
test('recent audio cache stays bounded by entry count',async()=>{
 const env=setup();for(let i=0;i<260;i++)await env.request(`/audio/en/012345abcdef/part${i}.mp3`);const cache=env.stores.get('virasat-audio-v1');assert.equal(cache.size,256);assert.equal(cache.has('https://virasat.test/audio/en/012345abcdef/part0.mp3'),false);
});

test('audio cache evicts old files at the byte budget even below its entry limit',async()=>{
 const env=setup(5*1024*1024);for(let i=0;i<3;i++)await env.request(`/audio/en/012345abcdef/large${i}.mp3`);const cache=env.stores.get('virasat-audio-v1');assert.equal(cache.size,2);assert.equal(cache.has('https://virasat.test/audio/en/012345abcdef/large0.mp3'),false);
});

test('a cold media range starts streaming before its complete body arrives',async()=>{
 let finish;const env=setup(8,request=>{assert.equal(request.headers.get('Range'),'bytes=0-');return new Response(new ReadableStream({start(c){c.enqueue(new Uint8Array([0,1]));finish=()=>{c.enqueue(new Uint8Array([2,3]));c.close();};}}),{status:206,headers:{'Content-Type':'audio/mpeg','Content-Range':'bytes 0-3/4'}});});
 let response;const pending=[];env.handlers.fetch({request:new Request('https://virasat.test/audio/hi/012345abcdef/homeTitle.mp3',{headers:{Range:'bytes=0-'}}),respondWith:p=>response=p,waitUntil:p=>pending.push(p)});
 // Returning headers must not depend on the end of the slow body.
 const first=await Promise.race([response,new Promise((_,reject)=>setTimeout(()=>reject(Error('Buffered the whole clip')),500))]);assert.equal(first.status,206);
 finish();assert.equal((await first.arrayBuffer()).byteLength,4);await Promise.all(pending);env.setOffline();const saved=await env.request('/audio/hi/012345abcdef/homeTitle.mp3');assert.equal(saved.status,200);assert.equal((await saved.arrayBuffer()).byteLength,4);
});
test('a short media probe is not cached as if it were a complete playable clip',async()=>{
 const env=setup(8,()=>new Response(new Uint8Array([0,1]),{status:206,headers:{'Content-Range':'bytes 0-1/8'}}));await env.request('/audio/en/012345abcdef/homeTitle.mp3',{headers:{Range:'bytes=0-1'}});assert.equal(env.stores.get('virasat-audio-v1').size,0);
});
test('audio cache bookkeeping does not reread every stored response for every new clip',async()=>{
 const env=setup();for(let i=0;i<260;i++)await env.request(`/audio/en/012345abcdef/part${i}.mp3`);assert.ok(env.cacheReads<=260,`unexpected cache reads: ${env.cacheReads}`);
});
test('only a selected language is prepared for offline use',async()=>{
 const env=setup();await env.install();const shell=[...env.stores.values()][0];assert.ok(![...shell.keys()].some(k=>k.startsWith('/locales/')));assert.ok(!shell.has('/journey-copy.js'));assert.ok(!shell.has('/'));
 const waits=[];env.handlers.message({data:{type:'cache-language',language:'hi'},waitUntil:p=>waits.push(p)});await Promise.all(waits);assert.equal([...shell.keys()].filter(k=>k.startsWith('/locales/')).length,1);assert.ok([...shell.keys()].some(k=>k.startsWith('/locales/hi-')));
});
test('denied cache storage does not block the app or network audio',async()=>{
 const env=setup();env.denyStorage();const shell=await env.request('/main.js');assert.equal(shell.status,200);const audio=await env.request('/audio/en/012345abcdef/homeTitle.mp3',{headers:{Range:'bytes=0-'}});assert.equal(audio.status,200);assert.equal(env.calls.length,2);assert.equal(env.calls[1].headers.get('Range'),'bytes=0-');
});
test('selected uncommon-script fonts remain available offline without preloading other languages',async()=>{
 const env=setup();await env.install();const shell=[...env.stores.values()][0];
 assert.ok(![...shell.keys()].some(path=>path.endsWith('.woff2')));
 const waits=[];env.handlers.message({data:{type:'cache-language',language:'mni'},waitUntil:p=>waits.push(p)});await Promise.all(waits);
 assert.ok(shell.has('/fonts/noto-sans-meetei-mayek.woff2'));
 assert.ok(!shell.has('/fonts/noto-sans-ol-chiki.woff2'));
 env.setOffline();assert.equal((await env.request('/fonts/noto-sans-meetei-mayek.woff2')).status,200);
 assert.equal((await env.request('/mni')).status,200);
});
test('an app update preserves unchanged selected language and script assets, excluding obsolete copy',async()=>{
 const env=setup();await env.install();const current=[...env.stores.values()][0];
 const {localeCatalog}=await import('../dist/locale-catalog.js');
 const old=new Map([[localeCatalog.mni,new Response('current translated text')],['/fonts/noto-sans-meetei-mayek.woff2',new Response('font')],['/locales/mni-obsolete.json',new Response('old text')]]);
 env.stores.set('virasat-shell-old',old);env.setOffline();
 const waits=[];env.handlers.activate({waitUntil:p=>waits.push(p)});await Promise.all(waits);
 assert.equal(await current.get(localeCatalog.mni).text(),'current translated text');
 assert.ok(current.has('/fonts/noto-sans-meetei-mayek.woff2'));
 assert.ok(!current.has('/locales/mni-obsolete.json'));assert.ok(!env.stores.has('virasat-shell-old'));
});

test('complete installation activates a waiting update without navigating any page',async()=>{
 const env=setup();await env.install();assert.equal(env.activations,1);
 const broken=setup();broken.denyStorage();await assert.rejects(broken.install());assert.equal(broken.activations,0);
});
test('an open older client retains its public assets and exact immutable copy until it leaves',async()=>{
 const env=setup();await env.install();env.setClients(['older-form']);
 const oldPath='/locales/hi-012345abcdef.json';
 const old=new Map([[oldPath,new Response('older translation')],['/main.js',new Response('older loaded modules')]]);
 env.stores.set('virasat-shell-old',old);
 const waits=[];env.handlers.activate({waitUntil:p=>waits.push(p)});await Promise.all(waits);
 assert.ok(env.stores.has('virasat-shell-old'));env.setOffline();
 assert.equal(await(await env.request(oldPath)).text(),'older translation');
 assert.equal(await env.request(oldPath+'?account=private'),undefined);
 assert.equal(await env.request('/locales/brx-012345abcdef.json'),undefined);
 const {localeCatalog}=await import('../dist/locale-catalog.js');
 assert.notEqual(localeCatalog.hi,oldPath);
 // New app copy remains separate; a current locale is not replaced by old text.
 assert.ok(![...env.stores.values()][0].has(oldPath));
 env.setClients(['new-page']);const cleanup=[];
 env.handlers.message({data:{type:'public-release-ready',version:source.match(/const SHELL='([^']+)'/)[1]},source:{id:'new-page'},waitUntil:p=>cleanup.push(p)});await Promise.all(cleanup);
 assert.ok(!env.stores.has('virasat-shell-old'));
});

test('a restarted worker retains old dependencies until all pages attest the exact current release',async()=>{
 const env=setup();await env.install();env.setClients(['fresh','older']);
 env.stores.set('virasat-shell-prior',new Map([['/main.js',new Response('old dependency')]]));
 const version=source.match(/const SHELL='([^']+)'/)[1];
 async function ready(id,build){const waits=[];env.handlers.message({data:{type:'public-release-ready',version:build},source:{id},waitUntil:p=>waits.push(p)});await Promise.all(waits);}
 await ready('fresh',version);assert.ok(env.stores.has('virasat-shell-prior'));
 await ready('older','virasat-shell-outdated');assert.ok(env.stores.has('virasat-shell-prior'));
 await ready('older',version);assert.ok(!env.stores.has('virasat-shell-prior'));
});
test('the public-shell byte ceiling defers an upgrade rather than deleting a live predecessor',async()=>{
 const env=setup();const previous=new Map([['/main.js',new Response(new Uint8Array(8*1024*1024))]]);
 env.stores.set('virasat-shell-live-predecessor',previous);env.setClients(['unfinished-form']);
 await assert.rejects(env.install(),/upgrade deferred/);assert.equal(env.activations,0);
 assert.ok(env.stores.has('virasat-shell-live-predecessor'));assert.equal(env.stores.size,1);
});
test('fixed supplemental guidance clips share the same bounded offline cache and range handling',async()=>{
 const env=setup(),path='/audio/hi/support-012345abcdef/tipsHelp.mp3';
 assert.equal((await env.request(path)).status,200);env.setOffline();const range=await env.request(path,{headers:{Range:'bytes=2-5'}});assert.equal(range.status,206);assert.equal(range.headers.get('Content-Range'),'bytes 2-5/8');
 assert.equal(await env.request(path+'?note=Fictional'),undefined);assert.equal(await env.request('/audio/kok/support-012345abcdef/tipsHelp.mp3'),undefined);
});
