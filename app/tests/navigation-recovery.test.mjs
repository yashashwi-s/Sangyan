import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {createSessionNavigation} from '../dist/session-navigation.js';
import {createJourneyEntry} from '../dist/journey-entry.js';
import {createSupport} from '../dist/resilience.js';
import {createNominationCoach} from '../dist/nomination-coach.js';
import {emptyAccount} from '../dist/tracker.js';
const source=await readFile(new URL('../dist/main.js',import.meta.url),'utf8');
const extract=(start,end)=>source.slice(source.indexOf(start),source.indexOf(end,source.indexOf(start)));
const act=(surface,prefix,action,value='')=>surface.handle({closest:()=>({dataset:{[prefix+'Action']:action,[prefix+'Value']:value}})});
test('Back/Forward keeps context in memory while history contains only an opaque token and counter',()=>{
 const writes=[],restores=[],history={replaceState:(...a)=>writes.push(a),pushState:(...a)=>writes.push(a)};
 const nav=createSessionNavigation(history,r=>restores.push(r),{token:'fictional-session'}),route={view:'form',selected:'fictional-private-id',step:2,contextStep:1};
 nav.sync({view:'home'});nav.sync(route);nav.sync(route);assert.equal(writes.length,2);
 assert.deepEqual(writes[1],[{virasatNavigation:'fictional-session',id:2},'']);assert.ok(!JSON.stringify(writes).includes('fictional-private-id'));
 route.step=3;nav.restore(writes[1][0]);assert.equal(restores[0].step,2);restores[0].step=0;nav.restore(writes[1][0]);assert.equal(restores[1].step,2);nav.sync({...route,step:2});assert.equal(writes.length,2);
});
test('cleared, evicted and foreign history routes cannot resurrect a private route',()=>{
 const writes=[],restores=[],history={replaceState:s=>writes.push(s),pushState:s=>writes.push(s)},nav=createSessionNavigation(history,r=>restores.push(r),{token:'test',limit:2});
 for(const view of ['home','entry','form'])nav.sync({view,selected:'fictional-private-id'});
 nav.restore(writes[0]);assert.deepEqual(restores.pop(),{view:'home'});nav.restore({virasatNavigation:'foreign',id:2});assert.deepEqual(restores.pop(),{view:'home'});nav.reset();nav.restore(writes[2]);assert.deepEqual(restores.pop(),{view:'home'});
});
test('denied history does not block in-app navigation',()=>{
 const nav=createSessionNavigation({replaceState(){throw Error('denied');},pushState(){throw Error('denied');}},()=>{});assert.doesNotThrow(()=>{nav.sync({view:'home'});nav.sync({view:'form'});});
});
test('orientation and coach cursors return to the same decision without altering nomination',()=>{
 const entry=createJourneyEntry();act(entry,'entry','living');act(entry,'entry','kind','unknown');const route=entry.snapshot();entry.reset();entry.restore(route);assert.match(entry.render(),/You can begin without knowing/);entry.restore({mode:'malicious'});assert.equal(entry.snapshot().mode,'start');
 const support=createSupport();support.start('unclaimed');act(support,'support','kind','mf');const search=support.snapshot();support.reset();support.restore(search);assert.equal(support.snapshot().kind,'mf');
 const coach=createNominationCoach(),a={...emptyAccount(),type:'mf',institution:'Fictional fund',holding:'sole',mfMode:'folio',nomination:'missing'};coach.render(a);act(coach,'coach','next');const checkpoint=coach.snapshot([a]);act(coach,'coach','next');coach.navigate(checkpoint,a);assert.equal(coach.snapshot([a])[0].step,1);assert.equal(a.nomination,'missing');
 const b={...a,id:'second-fictional-account'};coach.render(b);act(coach,'coach','next');coach.navigate(checkpoint,a);assert.equal(coach.snapshot([a,b]).length,2);
});
function saveSurface({keep=false,storageDenied=false,downloadFails=false}={}){
 const status={},submit={disabled:false,isConnected:true},checkbox={checked:false,focus(){}},again={},controls={'#password':{value:'fictional passphrase only'},'#password-repeat':{value:'fictional passphrase only'},'#keep-device':{checked:keep},'#vault-status':status};
 const next={querySelector:s=>s==='#saved-file-kept'?checkbox:again},downloads=[],errors=[];
 const ui={generation:2,view:'save',dirty:true,savedFile:false,lastSavedOn:'',deviceCopy:false,deviceKey:'fictional-only',current:{accounts:[]},unfinished:null,pendingEditor:null,lang:'en',coach:{snapshot:()=>[]},today:()=> '2026-10-04',saveWorkspace:()=>({savedOn:'2026-10-04'}),sealCase:async()=> 'fictional encrypted envelope',clearErrors(){},showError:(id,key)=>errors.push({id,key}),$:s=>controls[s],t:k=>k,esc:s=>s,copy:()=>'',button:()=>'',download:(...a)=>{if(downloadFails)throw Error('blocked');downloads.push(a);},localStorage:{setItem(){if(storageDenied)throw Error('denied');}},document:{createElement:()=>next},form:{querySelector:s=>s==='[type=submit]'?submit:null,append(){}}};
 vm.createContext(ui);vm.runInContext(extract('async function handleVault(form){',"main.addEventListener('input'"),ui);return {ui,checkbox,again,status,submit,errors,downloads};
}
test('a requested download keeps the leave warning until the user confirms that the file was kept',async()=>{
 const s=saveSurface();await s.ui.handleVault(s.ui.form);assert.equal(s.downloads.length,1);assert.equal(s.ui.dirty,true);assert.equal(s.ui.savedFile,false);assert.equal(s.status.textContent,'saveTip');assert.equal(s.submit.disabled,false);
 s.again.onclick();assert.equal(s.downloads.length,2);s.checkbox.checked=true;s.checkbox.onchange({target:s.checkbox});assert.equal(s.ui.dirty,false);assert.equal(s.ui.savedFile,true);s.checkbox.checked=false;s.checkbox.onchange({target:s.checkbox});assert.equal(s.ui.dirty,true);assert.equal(s.ui.savedFile,false);s.ui.generation++;s.checkbox.checked=true;s.checkbox.onchange({target:s.checkbox});assert.equal(s.ui.dirty,true);
});
test('an explicit device envelope protects progress; denied storage or blocked download never claims success',async()=>{
 const kept=saveSurface({keep:true});await kept.ui.handleVault(kept.ui.form);assert.equal(kept.ui.dirty,false);assert.equal(kept.ui.deviceCopy,true);assert.equal(kept.status.textContent,'deviceSaved');
 const denied=saveSurface({keep:true,storageDenied:true});await denied.ui.handleVault(denied.ui.form);assert.equal(denied.ui.dirty,true);assert.equal(denied.ui.savedFile,false);assert.equal(denied.status.textContent,'deviceUnavailable');
 const blocked=saveSurface({downloadFails:true});await blocked.ui.handleVault(blocked.ui.form);assert.equal(blocked.ui.dirty,true);assert.deepEqual(blocked.errors,[{id:'vault-error',key:'saveUnavailable'}]);assert.equal(blocked.submit.disabled,false);
});
test('downloads use an attached anchor and a delayed URL release for slower browsers',async()=>{
 const privacy=await readFile(new URL('../dist/privacy.js',import.meta.url),'utf8'),steps=[],ui={Blob,URL:{createObjectURL:()=> 'blob:fictional',revokeObjectURL:u=>steps.push(['revoke',u])},document:{body:{append:()=>steps.push('attach')},createElement:()=>({click:()=>steps.push('click'),remove:()=>steps.push('remove')})},setTimeout:(f,ms)=>{steps.push(['delay',ms]);ui.finish=f;}};
 vm.createContext(ui);vm.runInContext(privacy.slice(privacy.indexOf('export function download(')).replace('export ',''),ui);ui.download('fictional','fictional.txt');assert.deepEqual(steps,['attach','click','remove',['delay',60000]]);ui.finish();assert.equal(steps.at(-1)[0],'revoke');
});
