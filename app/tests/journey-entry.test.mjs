import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createJourneyEntry as createEntry,LEGAL_HELP} from '../dist/journey-entry.js';
const plain=JSON.parse(await readFile(new URL('../translations/resilience-en.json',import.meta.url)));
const createJourneyEntry=()=>{const c=createEntry(),render=c.render;return {...c,render:()=>render(k=>plain[k]||k)};};
const act=(c,action,value='')=>c.handle({closest:()=>({dataset:{entryAction:action,entryValue:value}})});
test('claim orientation covers every account route and assistance context without tracker intents',()=>{
 for(const kind of ['bank','demat','mf','unknown'])for(const age of ['adult','minor','unsure']){
  const c=createJourneyEntry();c.startClaim();assert.equal(act(c,'kind',kind),true);assert.equal(act(c,'age',age),true);
  const html=c.render();assert.match(html,/written checklist/);assert.match(html,/receipt is not claim approval/);assert.ok(html.includes(LEGAL_HELP));
  if(age!=='adult')assert.match(html,/not automatically authorised/);
  if(kind==='demat')assert.match(html,/depository participant/);
  if(kind==='mf')assert.match(html,/record-service provider/);
  assert.equal(act(c,'continue'),false);assert.equal(act(c,'submit'),false);assert.equal(act(c,'confirm'),false);
 }
});
test('living holder can identify account without storing details and unknown route never guesses',()=>{
 for(const kind of ['bank','demat','mf','unknown']){const c=createJourneyEntry();act(c,'living');act(c,'kind',kind);assert.equal(act(c,'continue'),kind==='unknown'?false:'setup-'+kind);}
});
test('paper shares lead to old-holding identification instead of being treated as demat',()=>{
 const c=createJourneyEntry();act(c,'living');assert.equal(act(c,'kind','paper-shares'),'old-shares');c.reset();assert.equal(act(c,'kind','paper-shares'),false);
});
test('back and reset remove choices and switching situation cannot carry claim authority',()=>{
 const c=createJourneyEntry();c.startClaim();act(c,'kind','bank');act(c,'age','minor');act(c,'back');assert.match(c.render(),/child or an adult/);act(c,'back');assert.match(c.render(),/Choose the paper/);assert.equal(act(c,'age','adult'),false);c.reset();assert.match(c.render(),/Who is this account/);assert.equal(act(c,'kind','malicious'),false);assert.equal(c.handle(null),false);
});
test('orientation has no personal-input or persistence/network sinks and app clears its state',async()=>{
 const source=await readFile(new URL('../dist/journey-entry.js',import.meta.url),'utf8');
 assert.doesNotMatch(source,/<input|<textarea|fetch\(|localStorage|sessionStorage|indexedDB|sendBeacon|document\.cookie/);
 const main=await readFile(new URL('../dist/main.js',import.meta.url),'utf8');assert.match(main,/function clearSession\(\)[\s\S]*?entry\.reset\(\)/);assert.match(main,/entry:entryPage/);
});
