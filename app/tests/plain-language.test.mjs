import {test} from 'node:test';import assert from 'node:assert/strict';
import {createNominationCoach} from '../dist/nomination-coach.js';
import {createJourneyEntry} from '../dist/journey-entry.js';
import {guidanceSource} from '../dist/guidance-copy.js';
import {dictionaries} from '../scripts/dictionaries.mjs';
test('every deep-journey public fragment has a released translation key across all branches',()=>{
const en=dictionaries.en, known=new Set(Object.values(en)),missing=new Set();
const decode=s=>s.replaceAll('&amp;','&').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&quot;','"').replaceAll('&#39;',"'");
const inspect=html=>{for(const m of html.matchAll(/>([^<>]+)</g)){const s=decode(m[1].trim());if(s&&!known.has(s)&&!guidanceSource[s]&&!/^Step [1-6] of 6$/.test(s)&&s!=='15100')missing.add(s);}};
const act=(c,action,value='')=>c.handle({closest:()=>({dataset:{coachAction:action,coachValue:value}})});
for(const type of ['bank','demat','mf'])for(const holding of ['sole','joint','unknown'])for(const mfMode of ['folio','demat','unknown']){
 const c=createNominationCoach(),a={type,holding,mfMode,institution:'',id:'example',nomination:'missing',review:'reported'};inspect(c.render(a,{},k=>en[k]));
 for(let step=0;step<6;step++){for(const action of [['help'],['channel','branch'],['example','holder'],['example','nominee'],['rights','yes'],['rights','no'],['minor','unsure'],['minor','yes'],['minor','no'],['response','unsure'],['response','blocked'],['correction','missing'],['correction','wrong'],['correction','unexplained']]){act(c,...action);inspect(c.render(a,{},k=>en[k]));}act(c,'next');inspect(c.render(a,{},k=>en[k]));}
 act(c,'deceased');inspect(c.render(a,{},k=>en[k]));
}
const entryAct=(c,action,value='')=>c.handle({closest:()=>({dataset:{entryAction:action,entryValue:value}})});
for(const mode of ['living','claim'])for(const kind of ['bank','demat','mf','unknown'])for(const age of ['adult','minor','unsure']){const c=createJourneyEntry();inspect(c.render(k=>en[k]));entryAct(c,mode);inspect(c.render(k=>en[k]));entryAct(c,'kind',kind);inspect(c.render(k=>en[k]));entryAct(c,'age',age);inspect(c.render(k=>en[k]));}
assert.deepEqual([...missing],[]);
for(const [language,d] of Object.entries(dictionaries))for(const key of Object.values(guidanceSource))assert.equal(typeof d[key],'string',language+'/'+key);
});
