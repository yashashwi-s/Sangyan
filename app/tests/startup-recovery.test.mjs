import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {createLocaleStore} from '../dist/locale.js';
import {localeCatalog} from '../dist/locale-catalog.js';
import {dictionaries} from '../scripts/dictionaries.mjs';
const source=await readFile(new URL('../scripts/startup-inline.js',import.meta.url),'utf8');
const flush=()=>new Promise(resolve=>setImmediate(resolve));
function boot(store=new Map(),{storageDenied=false,ready=false,form=false,online=true,path='/hi',probeFails=false}={}){
 const timers=new Map(),events={},state={reloads:0,ready,form},location={pathname:path,reload:()=>state.reloads++};let script,serial=0;
 const context={location,navigator:{onLine:online},performance:{getEntriesByName:()=>state.ready?[{}]:[]},sessionStorage:{getItem:k=>{if(storageDenied)throw Error('denied');return store.get(k);},setItem:(k,v)=>{if(storageDenied)throw Error('denied');store.set(k,v);},removeItem:k=>{if(storageDenied)throw Error('denied');store.delete(k);}},document:{readyState:'complete',querySelector:()=>state.form?{}:null,createElement:()=>({}),head:{append:s=>script=s}},window:{addEventListener:(k,f)=>events[k]=f,removeEventListener:(k,f)=>{if(events[k]===f)delete events[k];}},setTimeout:(f,ms)=>{timers.set(++serial,{f,ms});return serial;},clearTimeout:id=>timers.delete(id)};
 context.AbortSignal=AbortSignal;context.fetch=async(url,options)=>{assert.equal(url,'/main.js');assert.equal(options.cache,'no-store');if(probeFails)throw TypeError('network');return {ok:true};};
 vm.runInNewContext(source,context);
 return {state,script,location,events,timers,runTimer(){const [id,{f,ms}]=timers.entries().next().value;timers.delete(id);f();return ms;}};
}
test('startup module failures retry twice across reloads and retain the native manual fallback',async()=>{
 const store=new Map();let page=boot(store);page.script.onerror();assert.equal(page.runTimer(),2000);await flush();assert.equal(page.state.reloads,1);
 page=boot(store);page.script.onerror();assert.equal(page.runTimer(),4000);await flush();assert.equal(page.state.reloads,1);
 page=boot(store);page.script.onerror();assert.equal(page.timers.size,0);assert.equal(page.state.reloads,0);
 page.script.onload();assert.equal(store.size,0);
 const html=await readFile(new URL('../dist/entry/hi.html',import.meta.url),'utf8');assert.ok(html.includes('class="startup-retry" href="/hi"'));
});
test('startup never reloads a ready app, entered form, changed route or denied session storage',()=>{
 for(const options of [{ready:true},{form:true},{storageDenied:true}]){const page=boot(new Map(),options);page.script.onerror();assert.equal(page.timers.size,0);assert.equal(page.state.reloads,0);}
 for(const mutation of [p=>p.state.form=true,p=>p.state.ready=true,p=>p.location.pathname='/gu']){const page=boot();page.script.onerror();mutation(page);page.runTimer();assert.equal(page.state.reloads,0);}
});
test('offline startup waits for online only within its bounded recovery window',async()=>{
 let page=boot(new Map(),{online:false});page.script.onerror();page.runTimer();assert.equal(page.state.reloads,0);assert.ok(page.events.online);page.events.online();await flush();assert.equal(page.state.reloads,1);assert.equal(page.timers.size,0);
 page=boot(new Map(),{online:false});page.script.onerror();page.runTimer();assert.equal(page.runTimer(),30000);assert.equal(page.events.online,undefined);assert.equal(page.state.reloads,0);
});
test('unreachable public-module probes exhaust bounded retries without navigating to a browser error',async()=>{
 const page=boot(new Map(),{probeFails:true});page.script.onerror();assert.equal(page.runTimer(),2000);await flush();assert.equal(page.runTimer(),4000);await flush();assert.equal(page.timers.size,0);assert.equal(page.state.reloads,0);
});
test('the precise bootstrap CSP hash is shared by every generated entry and hosting policy',async()=>{
 const token="'sha256-"+createHash('sha256').update(source).digest('base64')+"'";
 const config=JSON.parse(await readFile(new URL('../vercel.json',import.meta.url),'utf8'));
 assert.ok(config.headers[0].headers.find(h=>h.key==='Content-Security-Policy').value.includes(token));
 for(const language of Object.keys(localeCatalog)){const html=await readFile(new URL(`../dist/entry/${language}.html`,import.meta.url),'utf8');assert.ok(html.includes(token));assert.ok(html.includes('<script id="startup-bootstrap">'+source+'</script>'));assert.ok(!html.includes("'unsafe-inline'"));}
});
test('public language fetches recover from transient interruptions without replacing loaded text',async()=>{
 const calls=[],delays=[];let attempts=0;
 const store=createLocaleStore(async path=>{calls.push(path);if(path===localeCatalog.hi&&++attempts<3)throw TypeError('network');return Response.json(path===localeCatalog.hi?dictionaries.hi:dictionaries.en);},{sleep:async ms=>{delays.push(ms);assert.equal(store.get('en').homeTitle,dictionaries.en.homeTitle);}});
 await store.load('en');await store.load('hi');assert.deepEqual(delays,[1000,2000]);assert.equal(calls.filter(p=>p===localeCatalog.hi).length,3);assert.equal(store.get('hi').homeTitle,dictionaries.hi.homeTitle);
});
test('retry bounds leave failed languages retriable and do not retry corrupt or missing assets',async()=>{
 for(const response of [new Response('not found',{status:404}),Response.json({homeTitle:17})]){let calls=0;const store=createLocaleStore(async()=>{calls++;return response.clone();},{sleep:async()=>{throw Error('Should not retry');}});await assert.rejects(store.load('hi'));assert.equal(calls,1);assert.equal(store.get('hi'),undefined);}
 let calls=0,fail=true;const store=createLocaleStore(async()=>{calls++;if(fail)throw TypeError('network');return Response.json(dictionaries.hi);},{sleep:async()=>{}});
 await assert.rejects(store.load('hi'));assert.equal(calls,3);fail=false;await store.load('hi');assert.equal(calls,4);
});
