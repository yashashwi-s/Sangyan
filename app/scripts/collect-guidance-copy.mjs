// Collect fixed public copy by exercising all rendering branches, never user records.
import {createNominationCoach} from '../dist/nomination-coach.js';
import {createJourneyEntry} from '../dist/journey-entry.js';
import {readFile} from 'node:fs/promises';
import {readFileSync} from 'node:fs';
const usability=JSON.parse(readFileSync(new URL('../translations/usability-en.json',import.meta.url)));
const plain={...usability,...JSON.parse(readFileSync(new URL('../translations/en.json',import.meta.url))),...JSON.parse(readFileSync(new URL('../translations/resilience-en.json',import.meta.url)))},plainValues=new Set(Object.values(plain)),t=key=>plain[key]||key;
export function collectGuidanceRenderings(){
const texts=new Set(),markup=[];
const collect=html=>{markup.push(html);for(const match of html.matchAll(/>([^<>]+)</g)){const text=match[1].trim();if(text&&!/^\d+$/.test(text)&&!plainValues.has(text))texts.add(text);}};
const act=(c,action,value='')=>c.handle({closest:()=>({dataset:{coachAction:action,coachValue:value}})});
for(const type of ['bank','demat','mf'])for(const holding of ['sole','joint','unknown'])for(const mfMode of ['folio','demat','unknown']){
 const a={id:'public-fixture',type,holding,mfMode,nomination:'missing',review:'reported'};
 for(const channel of ['online','branch'])for(const minor of ['yes','no','unsure'])for(const example of ['','holder','nominee']){
  const c=createNominationCoach();collect(c.render(a,{url:'https://example.org'},t));collect(c.render(a,{specific:true,url:'https://example.org',action:[],offline:[],scope:''},t));act(c,'channel',channel);collect(c.render(a,{},t));
  for(let step=0;step<6;step++){if(step===2&&example)act(c,'example',example);if(step===3)act(c,'minor',minor);collect(c.render(a,{},t));act(c,'help');collect(c.render(a,{},t));act(c,'next');collect(c.render(a,{},t));}
  c.startResponse(a);collect(c.render(a,{},t));for(const response of ['unsure','blocked','not-submitted']){act(c,'response',response);collect(c.render(a,{},t));for(const reason of ['missing','wrong','unexplained']){act(c,'correction',reason);collect(c.render(a,{},t));}}
  act(c,'deceased');collect(c.render(a,{},t));
 }
}
const action=(e,action,value='')=>e.handle({closest:()=>({dataset:{entryAction:action,entryValue:value}})});
for(const mode of ['living','claim'])for(const kind of ['bank','demat','mf','unknown'])for(const age of ['adult','minor','unsure']){
 const e=createJourneyEntry();collect(e.render(t));action(e,mode);collect(e.render(t));action(e,'kind',kind);collect(e.render(t));action(e,'age',age);collect(e.render(t));
}
return {texts:[...texts].sort(),markup};
}
if(process.argv[1]&&new URL(import.meta.url).pathname===process.argv[1]){
const {texts:sorted,markup}=collectGuidanceRenderings(),dictionary=JSON.parse(await readFile(new URL('../translations/guidance-en.json',import.meta.url),'utf8'));
const missing=sorted.filter(text=>!Object.values(dictionary).includes(text));if(missing.length)throw Error('Untranslated public guidance: '+missing.join('; '));
console.log(JSON.stringify({keys:sorted.length,renderings:markup.length}));
}
