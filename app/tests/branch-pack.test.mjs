import {test} from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';import vm from 'node:vm';
import {branchPackBody,branchPackDocument} from '../dist/branch-pack.js';import {guideFor} from '../dist/guides.js';import {dictionaries} from '../scripts/dictionaries.mjs';
const fixture={id:'fictional',type:'bank',institution:'Fictional bank',institutionId:'sbi',holding:'sole',product:'savings',last4:'1234',owner:'PRIVATE OWNER',nominees:['PRIVATE NOMINEE'],recordNote:'PRIVATE NOTE',supportCase:{issue:'PRIVATE ISSUE'},recordLocation:'PRIVATE LOCATION'};
const options=(account=fixture,language='en')=>({account,guide:guideFor(account),dictionary:dictionaries[language],language,generatedOn:'4 October 2026'});
test('four branch preparation outputs render in all 21 languages without private notes or executable content',()=>{
 for(const lang of Object.keys(dictionaries)){const before=JSON.stringify(fixture),html=branchPackDocument(options(fixture,lang));assert.equal((html.match(/class="branch-pack-section"/g)||[]).length,4);assert.ok(html.includes(dictionaries[lang].branchPack));assert.ok(html.includes('•••• 1234'));assert.ok(!html.includes('PRIVATE'));assert.ok(!/<script|<input|<iframe|<form\b/i.test(html));assert.equal(JSON.stringify(fixture),before);assert.ok(html.includes("default-src 'none'"));assert.ok(!/<(?:link|img)\b/i.test(html));}
});
test('bank, joint securities, uncertain funds, demat funds and deceased-holder preparations keep their routes separate',()=>{
 const en=dictionaries.en,bank=branchPackBody(options());assert.ok(!bank.includes(en.offlineSignatureHelp));assert.ok(bank.includes('https://sbi.bank.in/web/personal-banking/nomination-facility'));
 const joint=branchPackBody(options({...fixture,type:'demat',institutionId:'zerodha',holding:'joint'}));assert.ok(joint.includes(en.plainJoint));assert.ok(joint.includes(en.offlineSignatureHelp));assert.ok(joint.includes(en.plainReceiptMeaning));
 for(const mode of ['unknown','demat']){const html=branchPackBody(options({...fixture,type:'mf',mfMode:mode,institutionId:'hdfc-mf'}));assert.ok(html.includes(mode==='demat'?en.mfDematHelp:en.identifyText));assert.ok(!html.includes(en.offlineSignatureHelp));assert.ok(html.includes(en.plainOldAsk));}
 const deceased=branchPackBody(options({...fixture,holderDeceased:true}));assert.ok(deceased.includes(en.plainClaimAsk));assert.ok(deceased.includes(en.plainClaimReceipt));assert.ok(!deceased.includes(en.askText));assert.ok(!deceased.includes('https://sbi.bank.in/web/personal-banking/nomination-facility'));
});
test('untrusted labels and unsafe URLs cannot inject HTML or a full reference into the pack',()=>{
 const html=branchPackBody({...options({...fixture,institution:'<script>alert(1)</script>',last4:'123456789012'}),guide:{specific:true,url:'javascript:alert(1)'}});assert.ok(html.includes('&lt;script&gt;'));assert.ok(!html.includes('<script>'));assert.ok(!html.includes('javascript:'));assert.ok(!html.includes('123456789012'));assert.throws(()=>branchPackBody({...options(),account:{type:'unknown'}}));
});
test('delayed branch downloads cancel after clearing, navigation, language or account changes, and failures stay retriable',async()=>{
 const source=await readFile(new URL('../dist/main.js',import.meta.url),'utf8'),fn=source.slice(source.indexOf('async function downloadBranchPack(){'),source.indexOf('function dateParts'));
 for(const change of [u=>u.generation++,u=>u.view='home',u=>u.lang='hi',u=>u.selected='other',()=>{}]){
  let resolve;const downloads=[],control={isConnected:true},status={},ui={generation:1,selected:'fictional',view:'branch-pack',lang:'en',branchPackOptions:()=>options(),exportFont:()=>new Promise(r=>resolve=r),branchPackDocument,download:(...args)=>downloads.push(args),today:()=> '2026-10-04',t:k=>k,$:id=>id==='#download-branch-pack'?control:status};vm.createContext(ui);vm.runInContext(fn,ui);const pending=ui.downloadBranchPack();change(ui);resolve('');await pending;assert.equal(downloads.length,ui.generation===1&&ui.view==='branch-pack'&&ui.lang==='en'&&ui.selected==='fictional'?1:0);assert.equal(control.disabled,false);
 }
 const status={},control={isConnected:true},ui={generation:1,selected:'fictional',view:'branch-pack',lang:'en',branchPackOptions:()=>options(),exportFont:async()=>'',branchPackDocument,download:()=>{throw Error('denied');},today:()=>'',t:k=>k,$:id=>id==='#download-branch-pack'?control:status};vm.createContext(ui);vm.runInContext(fn,ui);await ui.downloadBranchPack();assert.equal(status.textContent,'saveUnavailable');assert.equal(control.disabled,false);
});
test('a downloaded example pack retains its fictional-data label',()=>{
 const html=branchPackDocument({...options(),sample:true});assert.ok(html.includes(dictionaries.en.sample));
});
