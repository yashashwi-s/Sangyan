import {test} from 'node:test';
import assert from 'node:assert/strict';
import {emptyAccount,emptyTracker,validateAccount,transition,saveWorkspace,restoreWorkspace,attention,today} from '../dist/tracker.js';
import {searchInstitutions,matchInstitution,INSTITUTIONS} from '../dist/institutions.js';
import {guideFor} from '../dist/guides.js';
import {dictionaries} from '../scripts/dictionaries.mjs';
const account=()=>({...emptyAccount(),type:'bank',institution:'HDFC Bank',institutionId:'hdfc-bank',holding:'sole',product:'savings'});
test('institution search separates related companies and permits a custom bank',()=>{
 assert.equal(searchInstitutions('bank','hdf')[0].id,'hdfc-bank');
 assert.equal(searchInstitutions('mf','hdfc')[0].id,'hdfc-mf');
 assert.equal(searchInstitutions('bank','एसबीआई')[0].id,'sbi');
 assert.equal(matchInstitution('bank','SBI').id,'sbi');
 assert.equal(validateAccount({...account(),institution:'Local Cooperative',institutionId:''}).institution,'Local Cooperative');
 assert.throws(()=>validateAccount({...account(),institution:'ICICI Bank'}),/invalidSave/);
 assert.equal(new Set(INSTITUTIONS.map(i=>i.id)).size,INSTITUTIONS.length);
});
test('guide routing distinguishes deposit, joint, fund folio and demat',()=>{
 assert.ok(guideFor(account()).check.includes('hdfcSavings'));
 assert.ok(guideFor({...account(),product:'deposit'}).check.includes('hdfcDeposit'));
 assert.ok(guideFor({...account(),holding:'joint'}).action.includes('jointGuide'));
 assert.ok(!guideFor({...account(),holding:'joint'}).action.includes('hdfcAction'));
 assert.equal(guideFor({...account(),institutionId:'',institution:'Custom'}).specific,false);
 assert.deepEqual(guideFor({...account(),type:'mf',mfMode:'demat'}).check,['mfDematHelp']);
 assert.ok(guideFor({...account(),type:'mf',institutionId:'hdfc-mf',mfMode:'folio'}).action.includes('hdfcMfGuide'));
});
test('correction invalidates prior confirmation and logs the transition',()=>{
 const a=transition(account(),'confirmed',{confirmationOn:today(),recordKind:'statement',confirmationChecked:true,evidenceScope:'details'});
 assert.equal(attention(a),'confirmed');
 for(const state of ['change','missing','unknown','recheck','optout']){const next=transition(a,state);assert.equal(next.review,'reported');assert.equal(next.confirmationOn,'');assert.equal(next.confirmationChecked,false);assert.equal(next.recordKind,'');assert.equal(next.events.at(-1).kind,state);}
 assert.equal(attention(transition(account(),'submitted',{submittedOn:today()})),'awaiting');
});
test('old files migrate; unfinished forms never become confirmed accounts',()=>{
 const c={...emptyTracker(),accounts:[account()]};assert.equal(restoreWorkspace({...c,schema:2}).tracker.schema,3);
 const raw={...c.accounts[0],last4:'12',recordKind:'statement',confirmationChecked:false,_dateParts:{confirmationOn:{day:'3',month:'10',year:'20'}}};
 const saved=saveWorkspace(c,null,{view:'confirm',mode:'edit',step:0,account:raw},'hi');
 const restored=restoreWorkspace(saved);assert.equal(restored.language,'hi');assert.equal(restored.tracker.accounts[0].review,'reported');assert.equal(restored.editor.account.last4,'12');assert.equal(restored.editor.account._dateParts.confirmationOn.year,'20');assert.equal(restored.editor.account.recordKind,'statement');
 assert.throws(()=>restoreWorkspace({...saved,editor:{...saved.editor,account:{...raw,id:'not-present'}}}),/invalidSave/);
});
test('saving a family edit preserves existing confirmation, without committing the edit',()=>{
 const confirmed=transition(account(),'confirmed',{confirmationOn:today(),recordKind:'statement',confirmationChecked:true,evidenceScope:'details'});
 const c={...emptyTracker(),accounts:[confirmed]};const restore=restoreWorkspace(saveWorkspace(c,null,{view:'family',mode:'edit',step:0,account:{...confirmed,recordLocation:'Blue folder'}},'en'));
 assert.equal(restore.editor.account.review,'confirmed');assert.equal(restore.editor.account.evidenceScope,'details');assert.equal(restore.tracker.accounts[0].recordLocation,'');assert.equal(validateAccount(restore.editor.account).recordLocation,'Blue folder');
});
test('drafts can be encrypted before any account type or institution is chosen',()=>{const raw={...emptyAccount(),type:''};const data=restoreWorkspace(saveWorkspace(emptyTracker(),{account:raw,step:0},null,'ur'));assert.equal(data.draft.type,'');assert.equal(data.draft.institution,'');assert.equal(data.step,0);});


test('every guide step and important interaction exists in all released dictionaries',()=>{
 const keys=['openDevice','keepDevice','seeNext','unfinishedChanges','chooseFile','validFollowup','foundYes','hdfcDeposit','hdfcMfGuide','zerodhaAction'];
 for(const d of Object.values(dictionaries))for(const k of keys)assert.ok(d[k]?.trim(),k);
});
test('fund units linked to a demat account do not create a second nomination task',()=>{
 const demat={...emptyAccount(),institution:'Zerodha',institutionId:'zerodha',nomination:'missing'};
 const fund={...emptyAccount(),type:'mf',institution:'HDFC Mutual Fund',institutionId:'hdfc-mf',mfMode:'demat',linkedDematId:demat.id};
 const c={...emptyTracker(),accounts:[demat,fund]};assert.equal(attention(fund),'linked');assert.equal(restoreWorkspace(saveWorkspace(c,null,null,'en')).tracker.accounts[1].linkedDematId,demat.id);
 assert.throws(()=>saveWorkspace({...c,accounts:[fund]},null,null,'en'),/invalidSave/);
 assert.throws(()=>validateAccount({...fund,mfMode:'folio'}),/invalidSave/);
});
test('provider guidance keeps product limits and separates first addition from correction',()=>{
 const base=account();
 assert.equal(guideFor({...base,institutionId:'axis-bank'}).id,'axis');
 assert.equal(guideFor({...base,institutionId:'axis-bank',product:'deposit'}).specific,false);
 assert.equal(guideFor({...base,institutionId:'sbi'}).id,'sbi');
 const z={...base,type:'demat',institutionId:'zerodha'};
 assert.equal(guideFor(z).id,'zerodha');
 assert.equal(guideFor({...z,nomination:'change'}).id,'zerodhaChange');
 assert.ok(guideFor({...z,nomination:'change'}).action.includes('zerodhaChangeForms'));
 assert.ok(!guideFor({...z,holding:'joint'}).action.includes('zerodhaAction'));
 assert.equal(guideFor({...z,institutionId:'groww'}).id,'groww');
 assert.equal(guideFor({...z,type:'mf',mfMode:'folio',institutionId:'groww'}).specific,false);
});
test('family review is separate from nomination and is invalidated by a correction',()=>{
 const confirmed=transition(account(),'confirmed',{recordKind:'statement',confirmationOn:today(),confirmationChecked:true});
 assert.equal(confirmed.familyReviewedOn,'');
 const family=validateAccount({...confirmed,familyReviewedOn:today()});
 assert.equal(family.nominees.length,0); // intentionally omitted identities remain valid
 assert.equal(transition(family,'change').familyReviewedOn,'');
 assert.throws(()=>validateAccount({...family,familyReviewedOn:'2099-01-01'}),/invalidDate/);
 const restored=restoreWorkspace(saveWorkspace({...emptyTracker(),accounts:[family]},null,null,'en'));
 assert.equal(restored.tracker.accounts[0].familyReviewedOn,today());
});
test('saving an unfinished demat account preserves the originating fund without linking early',()=>{
 const fund={...emptyAccount(),type:'mf',institution:'HDFC Mutual Fund',institutionId:'hdfc-mf',mfMode:'demat'};
 const draft={...emptyAccount(),institution:'Zerodha',institutionId:'zerodha'};
 const c={...emptyTracker(),accounts:[fund]};
 const saved=saveWorkspace(c,{account:draft,step:2,sourceId:fund.id},null,'bn');
 const restored=restoreWorkspace(saved);
 assert.equal(restored.linkFrom,fund.id);assert.equal(restored.tracker.accounts[0].linkedDematId,'');
 assert.throws(()=>restoreWorkspace({...saved,linkFrom:'missing-account'}),/invalidSave/);
 assert.throws(()=>saveWorkspace(c,{account:{...draft,type:'bank',institutionId:'',institution:'Custom'},step:2,sourceId:fund.id},null,'en'),/invalidSave/);
});


test('all guide routes and fallback steps exist in every language',()=>{
 const values=[];for(const institution of INSTITUTIONS)for(const holding of ['sole','joint','unknown'])for(const product of ['savings','deposit','unknown'])for(const mfMode of ['folio','demat','unknown'])for(const nomination of ['unknown','missing','change'])values.push(guideFor({...account(),...institution,institutionId:institution.id,holding,product,mfMode,nomination}));
 const keys=new Set(values.flatMap(g=>[...g.check,...g.action,...g.offline,g.scope,g.label]));
 for(const [language,d] of Object.entries(dictionaries))for(const key of keys)assert.ok(d[key]?.trim(),`${language}: ${key}`);
});
