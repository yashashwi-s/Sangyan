import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {reviewReminder,intendedDetailsChecked} from '../dist/complaint-review.js';
import {emptyAccount,validateAccount,transition,familySummary,emptyTracker,saveWorkspace,restoreWorkspace,today} from '../dist/tracker.js';
import {dictionaries} from '../scripts/dictionaries.mjs';
const a=()=>({...emptyAccount(),type:'mf',institution:'Fictional fund',mfMode:'folio'});
test('review reminders require the correct report event, distinguish both stages and respect the inclusive final day',()=>{
 const account=a();account.supportEvents=[{kind:'response',on:'2026-10-01'}];assert.deepEqual(reviewReminder(account,'2026-10-04'),{state:'unknown'});
 account.supportEvents.push({kind:'entity-atr',on:'2026-10-01'});assert.deepEqual(reviewReminder(account,'2026-10-16'),{state:'available',stage:'first',received:'2026-10-01',due:'2026-10-16'});assert.equal(reviewReminder(account,'2026-10-17').state,'expired');
 account.supportEvents.push({kind:'first-review',on:'2026-10-02'});assert.equal(reviewReminder(account,'2026-10-04').state,'waiting');
 account.supportEvents.push({kind:'body-atr',on:'2026-10-03'});assert.equal(reviewReminder(account,'2026-10-04').stage,'second');account.supportEvents.push({kind:'closed',on:'2026-10-04'});assert.equal(reviewReminder(account,'2026-10-04').state,'closed');
 assert.equal(reviewReminder({...account,type:'bank'},'2026-10-04'),null);assert.equal(reviewReminder({...a(),supportEvents:[{kind:'entity-atr',on:'2026-02-30'}]},'2026-10-04').state,'unknown');
});
test('a legacy confirmation cannot claim intended details were checked; all three explicit checks are required',()=>{
 const legacy=transition(a(),'confirmed',{recordKind:'statement',confirmationOn:today(),confirmationChecked:true,evidenceScope:'details'});assert.equal(legacy.evidenceScope,'status');assert.equal(intendedDetailsChecked(legacy),false);
 const checked=transition(a(),'confirmed',{recordKind:'statement',confirmationOn:today(),confirmationChecked:true,evidenceScope:'details',intendedChecks:{account:true,names:true,other:true},evidenceLocation:'Fictional evidence drawer'});assert.equal(checked.evidenceScope,'details');
 const c={...emptyTracker(),accounts:[checked]},restored=restoreWorkspace(saveWorkspace(c));assert.equal(restored.tracker.accounts[0].evidenceLocation,'Fictional evidence drawer');assert.equal(restored.tracker.accounts[0].evidenceScope,'details');assert.ok(!JSON.stringify(familySummary(c)).includes('Fictional evidence drawer'));
 assert.equal(transition(checked,'recheck').evidenceLocation,'');assert.equal(intendedDetailsChecked(transition(checked,'recheck')),false);
 for(const key of ['account','names','other'])assert.equal(validateAccount({...checked,intendedChecks:{...checked.intendedChecks,[key]:false}}).evidenceScope,'status');
});
test('structured correction details survive a save and remain excluded from family sharing',()=>{
 const account=a();account.supportCase={issue:'Fictional issue',request:'Fictional requested fix',field:'Fictional name field',reason:'Fictional mismatch',supplied:'Fictional evidence description',next:'Fictional next visit'};const c={...emptyTracker(),accounts:[account]};assert.deepEqual(restoreWorkspace(saveWorkspace(c)).tracker.accounts[0].supportCase,account.supportCase);assert.ok(!JSON.stringify(familySummary(c)).includes('Fictional mismatch'));
 assert.throws(()=>validateAccount({...account,supportCase:{...account.supportCase,reason:'x'.repeat(321)}}));
});
test('every released paper fallback has useful written steps and no executable scripts or data collection',async()=>{
 for(const [lang,d] of Object.entries(dictionaries)){const html=await readFile(new URL('../dist/paper/'+lang+'.html',import.meta.url),'utf8');assert.ok(html.includes(d.paperNoScript.replace(/&/g,'&amp;')));assert.ok(html.includes('https://scores.sebi.gov.in/'));assert.ok(!/<script|<input|<form\b/i.test(html));assert.ok(html.includes('form-action'));
 }
});
