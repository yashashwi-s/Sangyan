import {test} from 'node:test';
import assert from 'node:assert/strict';
import {sealCase,openCase} from '../dist/privacy.js';
import {restoreWorkspace,validateTracker} from '../dist/tracker.js';
import {scaleWorkspace} from './workspace-scale-fixture.mjs';
const password='synthetic workspace password 2026';
test('maximum 50-account encrypted workspace retains completed records, unfinished draft and partial editor',async()=>{
 const workspace=scaleWorkspace(),sealed=await sealCase(workspace,password);
 assert.ok(!sealed.includes('Synthetic Institution'));
 assert.ok(!sealed.includes('अधूरा'));
 assert.deepEqual(restoreWorkspace(await openCase(sealed,password)),restoreWorkspace(workspace));
 assert.equal(restoreWorkspace(workspace).tracker.accounts.length,50);
 assert.throws(()=>validateTracker({...workspace.tracker,accounts:[...workspace.tracker.accounts,{...workspace.tracker.accounts[0],id:'synthetic-51'}]}),/invalidSave/);
});
test('corrupt imported workspace fails authentication or schema and leaves its source fixture unchanged',async()=>{
 const workspace=scaleWorkspace(),before=structuredClone(workspace),sealed=await sealCase(workspace,password);
 await assert.rejects(openCase(sealed.slice(0,-1),password),/invalidSave/);
 const envelope=JSON.parse(sealed);envelope.ciphertext=envelope.ciphertext.slice(0,-8);
 await assert.rejects(openCase(JSON.stringify(envelope),password),/cannotUnlock/);
 // Authentic encryption is insufficient: imported plaintext must pass workspace validation.
 for(const corrupt of [{...workspace,language:'invalid'},{...workspace,tracker:{...workspace.tracker,accounts:workspace.tracker.accounts.map((a,i)=>i===49?workspace.tracker.accounts[0]:a)}}]){
  const decrypted=await openCase(await sealCase(corrupt,password),password);
  assert.throws(()=>restoreWorkspace(decrypted),/invalidSave/);
 }
 assert.deepEqual(workspace,before);
});
