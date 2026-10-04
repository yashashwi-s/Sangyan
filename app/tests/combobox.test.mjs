import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {searchInstitutions} from '../dist/institutions.js';
const source=await readFile(new URL('../dist/main.js',import.meta.url),'utf8');
// Execute the actual public handler with a minimal event/option surface. This
// verifies selection state, not browser layout or assistive-technology output.
const binding=source.slice(source.indexOf('function bindInstitution(){'),source.indexOf('function updateSpeech('));
function picker(value='hdf'){
 const handlers={},attributes=new Map(),input={value,addEventListener:(name,fn)=>handlers[name]=fn,setAttribute:(name,value)=>attributes.set(name,value),removeAttribute:name=>attributes.delete(name),focus(){}};
 const list={hidden:true,children:[],addEventListener(){},set innerHTML(html){this.children=[...html.matchAll(/id="(institution-option-\d+)"/g)].map(match=>({id:match[1],attributes:new Map(),setAttribute(name,value){this.attributes.set(name,value);},scrollIntoView(){}}));}};
 const announcement={},draft={type:'bank',institution:value,institutionId:''};let dirty=0;
 vm.runInNewContext(binding+'\nbindInstitution();',{$:selector=>({'#account-institution':input,'#institution-results':list,'#institution-announcement':announcement})[selector],draft,searchInstitutions,esc:value=>String(value).replaceAll('"','&quot;'),t:key=>key,number:String,markDirty:()=>dirty++});
 const key=(key,extra={})=>{const event={key,prevented:false,preventDefault(){this.prevented=true;},...extra};handlers.keydown(event);return event;};
 handlers.focus();return {input,list,draft,attributes,handlers,key,get dirty(){return dirty;}};
}
test('first Up selects the last available option and Enter keeps an explicitly typed custom institution',()=>{
 const p=picker();assert.ok(p.list.children.length>=2);p.key('ArrowUp');assert.equal(p.attributes.get('aria-activedescendant'),p.list.children.at(-1).id);p.key('Enter');assert.equal(p.draft.institution,'hdf');assert.equal(p.draft.institutionId,'');assert.equal(p.dirty,1);assert.equal(p.list.hidden,true);assert.equal(p.attributes.has('aria-activedescendant'),false);
});
test('Down selects the first suggestion; IME Enter never commits it until composition finishes',()=>{
 const p=picker();p.key('ArrowDown');assert.equal(p.attributes.get('aria-activedescendant'),p.list.children[0].id);
 for(const composition of [{isComposing:true},{keyCode:229}]){assert.equal(p.key('Enter',composition).prevented,false);assert.equal(p.draft.institution,'hdf');assert.equal(p.dirty,0);assert.equal(p.list.hidden,false);}
 assert.equal(p.key('Enter').prevented,true);assert.equal(p.draft.institution,'HDFC Bank');assert.equal(p.draft.institutionId,'hdfc-bank');assert.equal(p.dirty,1);
});
test('Escape and Tab close suggestions without committing or clearing typed text',()=>{
 for(const key of ['Escape','Tab']){const p=picker();p.key('ArrowDown');p.key(key);assert.equal(p.list.hidden,true);assert.equal(p.input.value,'hdf');assert.equal(p.draft.institutionId,'');assert.equal(p.dirty,0);assert.equal(p.attributes.has('aria-activedescendant'),false);}
});
