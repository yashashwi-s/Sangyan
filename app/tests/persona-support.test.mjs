import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createSupport,SUPPORT_SOURCES,annualReviewDate} from '../dist/resilience.js';
import {dictionaries} from '../scripts/dictionaries.mjs';
import {emptyAccount,emptyTracker,validateAccount,validateTracker,familySummary,transition,saveWorkspace,restoreWorkspace} from '../dist/tracker.js';
const account=()=>({...emptyAccount(),institution:'Fictional bank',type:'bank'});
const choose=(s,action,value)=>s.handle({closest:()=>({dataset:{supportAction:action,supportValue:value}})});
test('all persona routes render fully translated fixed copy in every released language',()=>{
 for(const [lang,d] of Object.entries(dictionaries)){
  const s=createSupport(),t=k=>{assert.ok(Object.hasOwn(d,k),`${lang}/${k}`);return d[k];};
  for(const mode of ['protect','unclaimed','complaint','inventory']){
   s.start(mode);assert.ok(s.render(t).includes(d.supportBoundary));
   for(const kind of ['bank','demat','shares','mf','unknown']){choose(s,'kind',kind);assert.ok(s.render(t));}
   for(const offer of ['tips','scheme','paid']){choose(s,'offer',offer);for(const answer of ['pause','pay']){choose(s,'practice',answer);assert.ok(s.render(t));}}
  }
 }
});
test('Praveen and Kavita receive risk warnings, practice feedback and an honest uncertainty boundary',()=>{
 const s=createSupport(),t=k=>dictionaries.en[k];s.start('protect');choose(s,'offer','tips');choose(s,'practice','pay');let html=s.render(t);assert.ok(html.includes(t('tipsHelp'))&&html.includes(t('riskIncorrect'))&&html.includes(t('riskUnknown')));
 choose(s,'offer','scheme');html=s.render(t);assert.ok(html.includes(SUPPORT_SOURCES.ipo));assert.ok(!html.includes(t('riskIncorrect')));
 choose(s,'offer','paid');html=s.render(t);assert.ok(html.includes(SUPPORT_SOURCES.cyber));assert.ok(!html.includes(t('riskPractice')));
 assert.equal(choose(s,'offer','anything-private'),false);s.reset();assert.ok(!s.render(t).includes(t('tipsHelp')));
});
test('Babulal receives different old-holding routes and bank complaints never route to SCORES',()=>{
 const s=createSupport(),t=k=>dictionaries.en[k];s.start('unclaimed');choose(s,'kind','shares');assert.ok(s.render(t).includes(SUPPORT_SOURCES.iepf));assert.ok(s.render(t).includes(t('oldSharesKind')));choose(s,'kind','mf');assert.ok(s.render(t).includes(SUPPORT_SOURCES.mitra)&&!s.render(t).includes(SUPPORT_SOURCES.iepf));
 s.start('complaint');choose(s,'kind','bank');assert.ok(s.render(t).includes(SUPPORT_SOURCES.bank)&&!s.render(t).includes(SUPPORT_SOURCES.scores));choose(s,'kind','mf');assert.ok(s.render(t).includes(SUPPORT_SOURCES.scores)&&!s.render(t).includes(SUPPORT_SOURCES.bank));
});
test('private follow-up survives saved work but never changes nomination or enters the family summary',()=>{
 const a=account();a.supportEvents=[{kind:'resolved',on:'2026-10-01',note:'Fictional private complaint',location:'Fictional private folder'}];const c={...emptyTracker(),accounts:[validateAccount(a)]};
 const restored=restoreWorkspace(saveWorkspace(c,null,null,'ur','2026-10-04'));assert.deepEqual(restored.tracker.accounts[0].supportEvents,a.supportEvents);assert.equal(restored.tracker.accounts[0].review,'reported');assert.equal(restored.savedOn,'2026-10-04');assert.ok(!JSON.stringify(familySummary(c)).includes('Fictional private'));
});
test('interrupted follow-up retains partial local dates and notes without committing them',()=>{
 const a=account(),pending={view:'support-record',mode:'edit',step:0,account:{...a,_support:{kind:'correction',on:'',note:'Fictional draft',location:''},_dateParts:{supportOn:{day:'3',month:'',year:'2026'}}}};
 const restored=restoreWorkspace(saveWorkspace({...emptyTracker(),accounts:[a]},null,pending,'hi'));
 assert.equal(restored.editor.account._support.note,'Fictional draft');assert.equal(restored.editor.account._dateParts.supportOn.month,'');assert.equal(restored.tracker.accounts[0].supportEvents.length,0);
});
test('follow-up storage rejects oversized, future, malformed and unsupported event records',()=>{
 for(const event of [{kind:'filed-automatically',on:'2026-10-01'},{kind:'contact',on:'2999-01-01'},{kind:'contact',on:'2026-02-30'},{kind:'contact',on:'2026-10-01',note:'x'.repeat(161)}])assert.throws(()=>validateAccount({...account(),supportEvents:[event]}));
 assert.throws(()=>validateAccount({...account(),supportEvents:Array(21).fill({kind:'contact',on:'2026-10-01'})}));
 assert.throws(()=>saveWorkspace(emptyTracker(),null,null,'en','2999-01-01'));
});
test('older saves receive safe defaults and handoff completion requires all checks and family review',()=>{
 const old=account();delete old.handoff;delete old.supportEvents;const a=validateAccount(old);assert.deepEqual(a.supportEvents,[]);assert.equal(a.handoff.on,'');
 a.handoff={find:true,next:true,access:false,on:'2026-10-01'};a.familyReviewedOn='2026-10-01';assert.equal(validateAccount(a).handoff.on,'');a.handoff.access=true;assert.equal(validateAccount(a).handoff.on,'2026-10-01');assert.equal(transition(a,'recheck').handoff.on,'');
});
test('annual review handles leap years and cannot alter nomination confirmation',()=>{
 assert.equal(annualReviewDate('2024-02-29'),'2025-02-28');assert.equal(annualReviewDate('2026-10-04'),'2027-10-04');
 const a=account();a.followupOn=annualReviewDate('2026-10-04');assert.equal(validateAccount(a).review,'reported');
});
test('the maximum family workspace stays bounded with maximum private follow-up records',()=>{
 const accounts=Array.from({length:50},()=>({...account(),supportEvents:Array.from({length:20},()=>({kind:'contact',on:'2026-10-01',note:'a'.repeat(160),location:'b'.repeat(160)}))}));
 const c=validateTracker({...emptyTracker(),accounts});assert.ok(Buffer.byteLength(JSON.stringify(saveWorkspace(c,null,null,'en')))<600000);assert.throws(()=>validateTracker({...c,accounts:[...accounts,account()]}));
});

test('a structured problem and requested fix survive encrypted-workspace preparation but never enter a family handoff',()=>{const a=account();a.supportCase={issue:'Fictional wrong nominee name',request:'Please correct the name and confirm it in writing'};const c={...emptyTracker(),accounts:[validateAccount(a)]};const restored=restoreWorkspace(saveWorkspace(c));assert.deepEqual(restored.tracker.accounts[0].supportCase,{...a.supportCase,field:'',reason:'',supplied:'',next:''});assert.ok(!JSON.stringify(familySummary(c)).includes('Fictional wrong'));const old={...a};delete old.supportCase;assert.deepEqual(validateAccount(old).supportCase,{issue:'',request:'',field:'',reason:'',supplied:'',next:''});for(const supportCase of [null,{issue:'x'.repeat(161),request:''},{issue:4,request:''}])if(supportCase!==null)assert.throws(()=>validateAccount({...a,supportCase}));});
