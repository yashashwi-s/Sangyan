import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const source=await readFile(new URL('../dist/main.js',import.meta.url),'utf8');
const worker=await readFile(new URL('../dist/sw.js',import.meta.url),'utf8');
assert.equal(source.match(/const SHELL_VERSION='([^']+)'/)[1],worker.match(/const SHELL='([^']+)'/)[1]);
const start=source.lastIndexOf("const SHELL_VERSION=");
const end=source.indexOf('if(chosen)chooseLanguage',start);
assert.ok(start>=0&&end>start);
function bind(overrides={}){
 const handlers={},registrations=[];let reloads=0;
 const context={chosen:false,dirty:false,draft:null,unfinished:null,pendingEditor:null,current:{accounts:[]},view:'home',languageRequest:0,...overrides,
  document:{addEventListener(type,fn){handlers[type]=fn;}},
  location:{reload(){reloads++;}},
  navigator:{serviceWorker:{ready:Promise.resolve({active:{postMessage(){}}}),controller:overrides.controller===false?null:{postMessage(){}},addEventListener(type,fn){handlers[type]=fn;},register(...args){registrations.push(args);return Promise.resolve();}}}};
 vm.runInNewContext(source.slice(start,end),context);
 return {handlers,context,registrations,get reloads(){return reloads;}};
}
test('a waiting upgrade refreshes only an untouched previously controlled language gate',()=>{
 const gate=bind();gate.handlers.controllerchange();assert.equal(gate.reloads,1);
 assert.equal(gate.registrations[0][0],'/sw.js');assert.equal(gate.registrations[0][1].updateViaCache,'none');
 const first=bind({controller:false});first.handlers.controllerchange();assert.equal(first.reloads,0);
 const searching=bind();searching.handlers.input();searching.handlers.controllerchange();assert.equal(searching.reloads,0);
});
test('worker activation never reloads a chosen language, draft, account or saved workspace',()=>{
 for(const state of [{chosen:true},{languageRequest:1},{dirty:true},{draft:{}},{unfinished:{}},{pendingEditor:{}},{current:{accounts:[{}]}},{view:'resume'},{view:'save'}]){
  const env=bind(state);env.handlers.controllerchange();assert.equal(env.reloads,0,JSON.stringify(state));
 }
 const entering=bind();entering.context.chosen=true;entering.context.draft={institution:'Synthetic bank'};entering.handlers.controllerchange();assert.equal(entering.reloads,0);assert.equal(entering.context.draft.institution,'Synthetic bank');
});
