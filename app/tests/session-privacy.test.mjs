import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {sealCase,openCase} from '../dist/privacy.js';
import {restoreWorkspace} from '../dist/tracker.js';
import {scaleWorkspace} from './workspace-scale-fixture.mjs';
const source=await readFile(new URL('../dist/main.js',import.meta.url),'utf8');
const extract=(start,end)=>source.slice(source.indexOf(start),source.indexOf(end,source.indexOf(start)));
const deferred=()=>{let resolve,reject;const promise=new Promise((yes,no)=>{resolve=yes;reject=no;});return {promise,resolve,reject};};
function exportSurface(){
 const font=deferred(),downloads=[],live={};
 const ui={generation:4,shareNames:false,shareLocation:false,lang:'ur',view:'summary',sheetBody:()=>'<p>Fictional private record</p>',esc:x=>x,t:x=>x,date:x=>x,today:()=>'',exportFont:()=>font.promise,download:(...args)=>downloads.push(args),isRTL:()=>true,live,retryText:{ur:'retry'}};
 vm.createContext(ui);vm.runInContext(extract('async function readableFile(){','function returnFromVault(){'),ui);
 return {ui,font,downloads};
}
test('delayed plaintext family export is cancelled after clear/navigation or privacy-choice changes',async()=>{
 for(const change of [ui=>ui.generation++,ui=>ui.view='home',ui=>ui.lang='hi',ui=>ui.shareNames=true,ui=>ui.shareLocation=true]){
  const {ui,font,downloads}=exportSurface(),pending=ui.readableFile();change(ui);font.resolve('');await pending;assert.equal(downloads.length,0);
 }
 const valid=exportSurface(),pending=valid.ui.readableFile();valid.font.resolve('');await pending;assert.equal(valid.downloads.length,1);assert.match(valid.downloads[0][0],/lang="ur"/);
});
test('cancelled family export failure does not write a stale retry message into a cleared session',async()=>{
 const {ui,font}=exportSurface(),pending=ui.readableFile();ui.generation++;font.reject(Error('offline'));await pending;assert.equal(ui.live.textContent,undefined);
});
function sessionSurface(storageFails=false){
 const dialogs=[{open:true,innerHTML:'Fictional private institution',close(){this.open=false;}},{open:false,innerHTML:'Fictional private nominee'}],controls={},messages=[];
 const main={removeAttribute(){},focus(){}};
 const ui={generation:5,languageRequest:2,coach:{reset(){}},entry:{reset(){}},reader:{stop(){}},current:{accounts:[{institution:'Fictional private institution'}]},selected:'private-account',unfinished:{account:{owner:'Fictional owner'}},pendingEditor:{account:{recordNote:'Fictional note'}},pendingDematSource:'private-account',draft:{last4:'1234'},step:3,editorMode:'edit',returnView:'confirm',routeMode:'offline',dirty:true,savedFile:true,shareNames:true,shareLocation:true,dialogOrigin:{},live:{textContent:'Fictional private message'},main,view:'detail',deviceCopy:true,deviceKey:'test-device',emptyTracker:()=>({accounts:[]}),document:{querySelectorAll:()=>dialogs},draw(){},announce:k=>messages.push(k),openDialog(){return dialogs[0];},dialogHead:()=>'',copy:()=>'',button:()=>'',t:x=>x,$:key=>controls[key],localStorage:{removeItem(){if(storageFails)throw Error('denied');ui.removed=true;}}};
 vm.createContext(ui);vm.runInContext(extract('function clearSession(){',"$('#clear').onclick="),ui);
 return {ui,dialogs,controls,messages};
}
test('session clearing erases decrypted records, drafts, selected IDs and all dialog DOM, resetting sharing choices',()=>{
 const {ui,dialogs}=sessionSurface();ui.clearSession();
 for(const key of ['draft','unfinished','pendingEditor','dialogOrigin'])assert.equal(ui[key],null);
 assert.equal(ui.current.accounts.length,0);assert.equal(ui.selected,'');assert.equal(ui.pendingDematSource,'');assert.equal(ui.live.textContent,'');assert.equal(ui.view,'home');assert.equal(ui.dirty,false);assert.equal(ui.savedFile,false);assert.equal(ui.shareNames,false);assert.equal(ui.shareLocation,false);assert.equal(ui.generation,6);assert.equal(ui.languageRequest,3);assert.equal(ui.deviceCopy,true);
 assert.ok(dialogs.every(d=>!d.open&&d.innerHTML===''));
 assert.match(source,/window\.addEventListener\('pagehide',leaveSession\)/);
 assert.match(source,/savedFile=false,shareNames=false,shareLocation=false/);
});
test('clear confirmation removes a device envelope only by explicit choice and reports denied storage honestly',()=>{
 for(const [choice,fails] of [[false,false],[true,false],[true,true]]){
  const {ui,controls,messages}=sessionSurface(fails);for(const id of ['#confirm-cancel','#confirm-action'])controls[id]={focus(){}};controls['#clear-device']={checked:choice};ui.clearSessionDialog();controls['#confirm-action'].onclick();
  assert.equal(ui.current.accounts.length,0);assert.equal(ui.removed===true,choice&&!fails);assert.equal(ui.deviceCopy,!(choice&&!fails));assert.deepEqual(messages,[fails?'deviceUnavailable':'clearDone']);
 }
});
function vaultSurface(){
 const crypto=deferred(),submit={disabled:false,isConnected:true},status={},controls={'#password':{value:'fictional password long enough'},'#password-repeat':{value:'fictional password long enough'},'#vault-status':status};let seals=0;
 const ui={generation:3,view:'save',clearErrors(){},$:key=>controls[key],showError(){},t:x=>x,current:{accounts:[]},unfinished:null,pendingEditor:null,lang:'en',saveWorkspace:()=>({synthetic:true}),sealCase(){seals++;return crypto.promise;},document:{},form:{querySelector:()=>submit}};
 vm.createContext(ui);vm.runInContext(extract('async function handleVault(form){',"main.addEventListener('input'"),ui);
 return {ui,crypto,submit,status,get seals(){return seals;}};
}
test('vault admits one encryption operation and discards a stale failure after a new generation',async()=>{
 const ui=vaultSurface(),first=ui.ui.handleVault(ui.ui.form);await ui.ui.handleVault(ui.ui.form);assert.equal(ui.seals,1);assert.equal(ui.submit.disabled,true);ui.ui.generation++;ui.status.textContent='new session status';ui.crypto.reject(Error('cannotUnlock'));await first;assert.equal(ui.status.textContent,'new session status');assert.equal(ui.submit.disabled,false);
});

test('page departure clears saved decrypted state but preserves unsaved work and its leave warning',()=>{
 for(const dirty of [false,true]){const {ui}=sessionSurface();ui.dirty=dirty;vm.runInContext(extract('function leaveSession(){',"window.addEventListener('pagehide'"),ui);ui.leaveSession();assert.equal(ui.current.accounts.length,dirty?1:0);assert.equal(Boolean(ui.pendingEditor),dirty);}
 assert.match(source,/if\(dirty&&\(current.accounts.length\|\|draft\|\|unfinished\|\|pendingEditor\)\)/);
});

test('actual vault import retains live work on corrupt input and restores 50 accounts despite unavailable saved language',async()=>{
 const {ui,status}=vaultSurface(),original={accounts:[{id:'existing-fictional-record'}]},editor={account:{id:'existing-fictional-record',last4:'12'}};
 Object.assign(ui,{view:'resume',current:original,pendingEditor:editor,restoreWorkspace,openCase,loadLanguage:async()=>{throw Error('offline');},keepLanguageOffline(){},draw(){},announce(){},savedFile:false,pendingDematSource:'',draft:null,shareNames:true,shareLocation:true});
 const controls={};ui.$=key=>controls[key];controls['#password']={value:'fictional password long enough'};controls['#vault-status']=status;controls['#saved-file']={files:[{size:4,text:async()=>'oops'}]};
 await ui.handleVault(ui.form);assert.equal(status.textContent,'invalidSave');assert.equal(ui.current,original);assert.equal(ui.pendingEditor,editor);assert.equal(ui.view,'resume');
 const workspace=scaleWorkspace(),sealed=await sealCase(workspace,controls['#password'].value);controls['#saved-file'].files=[{size:sealed.length,text:async()=>sealed}];
 await ui.handleVault(ui.form);assert.equal(ui.current.accounts.length,50);assert.equal(ui.lang,'en');assert.equal(ui.unfinished.account.owner,workspace.draft.owner);assert.equal(ui.pendingEditor.account.last4,'12');assert.equal(ui.view,'home');assert.equal(ui.savedFile,true);assert.equal(ui.shareNames,false);assert.equal(ui.shareLocation,false);
});
