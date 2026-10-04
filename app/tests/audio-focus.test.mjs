import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const source=await readFile(new URL('../dist/main.js',import.meta.url),'utf8');
const start=source.indexOf('function updateSpeech('),end=source.indexOf('function readPage(',start);
assert.ok(start>=0&&end>start);
function surface(prefix=''){
 const body={id:'document'},document={activeElement:body,querySelectorAll(){return [];}};
 const controls=new Map();let focuses=0;
 const make=id=>{const element={id:prefix+id,querySelector(){return {textContent:''};},focus(){document.activeElement=element;focuses++;}};controls.set('#'+element.id,element);return element;};
 const listen=make('listen'),stop=make('speech-stop');
 for(const id of ['speech-status','speech-previous','speech-repeat','speech-next','speech-sentence','speech-position'])make(id);
 Object.defineProperty(stop,'hidden',{set(value){if(value&&document.activeElement===stop)document.activeElement=body;}});
 const along=make('read-along');Object.defineProperty(along,'hidden',{set(value){if(value&&['speech-previous','speech-repeat','speech-next'].some(id=>document.activeElement===controls.get('#'+prefix+id)))document.activeElement=body;}});
 const main={querySelector:key=>controls.get(key)},speechScope=prefix?{id:prefix.slice(0,-1),querySelector:key=>controls.get(key)}:main;
 const context={document,main,speechScope,t:key=>key,number:n=>String(n)};vm.runInNewContext(source.slice(start,end),context);
 return {document,listen,stop,controls,get focuses(){return focuses;},update:()=>context.updateSpeech({state:'idle',index:0,total:0,text:'',source:null})};
}
test('stopping audio restores Listen before native hiding loses the focused Stop button',()=>{
 for(const prefix of ['', 'settings-dialog-']){
  const ui=surface(prefix);ui.document.activeElement=ui.stop;ui.update();assert.equal(ui.document.activeElement,ui.listen);assert.equal(ui.focuses,1);
 }
});
test('audio completion restores a hidden sentence control but does not steal form focus',()=>{
 const sentence=surface();sentence.document.activeElement=sentence.controls.get('#speech-next');sentence.update();assert.equal(sentence.document.activeElement,sentence.listen);
 const form=surface();const input={id:'account-last4'};form.document.activeElement=input;form.update();assert.equal(form.document.activeElement,input);assert.equal(form.focuses,0);
});
