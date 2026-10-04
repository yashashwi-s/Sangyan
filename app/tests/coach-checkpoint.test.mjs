import {test} from 'node:test';import assert from 'node:assert/strict';
import {createNominationCoach,validateCoachCheckpoint} from '../dist/nomination-coach.js';
import {emptyAccount,emptyTracker,saveWorkspace,restoreWorkspace,familySummary,validateDraft} from '../dist/tracker.js';
import {sealCase,openCase} from '../dist/privacy.js';
const act=(c,a,v='')=>c.handle({closest:()=>({dataset:{coachAction:a,coachValue:v}})});
const account=()=>({...emptyAccount(),type:'demat',holding:'sole',institution:'Fictional service',nomination:'missing'});
test('encrypted guidance resumes the same step without turning learning into registration evidence',async()=>{
 const a=account(),c=createNominationCoach();c.render(a);act(c,'channel','branch');act(c,'next');act(c,'next');act(c,'example','nominee');act(c,'rights','no');
 const payload=saveWorkspace({...emptyTracker(),accounts:[a]},null,null,'hi','2026-10-04',c.snapshot([a]));
 const opened=restoreWorkspace(await openCase(await sealCase(payload,'fictional long password'),'fictional long password'));
 const resumed=createNominationCoach();resumed.restore(opened.learning,opened.tracker.accounts);assert.match(resumed.render(opened.tracker.accounts[0]),/Step 3 of 6/);act(resumed,'next');assert.match(resumed.render(opened.tracker.accounts[0]),/Step 4 of 6/);
 assert.equal(opened.tracker.accounts[0].review,'reported');assert.equal(opened.tracker.accounts[0].nomination,'missing');assert.equal(JSON.stringify(familySummary(opened.tracker)).includes('learning'),false);
});
test('changed account context drops its old checkpoint and older saves start with no learning',()=>{
 const a=account(),c=createNominationCoach();c.render(a);act(c,'next');const checkpoint=c.snapshot([a]);assert.equal(validateCoachCheckpoint(checkpoint,[{...a,institution:'Changed provider'}]).length,0);
 const old=saveWorkspace({...emptyTracker(),accounts:[a]},null,null,'en');delete old.learning;assert.deepEqual(restoreWorkspace(old).learning,[]);
 c.render({...a,institution:'Changed provider'});assert.deepEqual(c.snapshot([a]),[]);
});
test('malformed or unbounded checkpoints are rejected before import can replace live work',()=>{
 const a=account(),c=createNominationCoach();c.render(a);const row=c.snapshot([a])[0];
 for(const patch of [{step:6},{minor:'maybe'},{rights:'inherit-everything'},{context:'x'.repeat(801)},{accountId:'unknown-id'},{deceased:'true'}])assert.throws(()=>validateCoachCheckpoint([{...row,...patch}],[a]));
 assert.throws(()=>validateCoachCheckpoint([row,row],[a]));assert.throws(()=>validateCoachCheckpoint(Array(51).fill(row),[a]));
});
test('an unfinished one-question setup resumes at its context question and rejects unsafe question indexes',async()=>{
 const draft={...emptyAccount(),type:'bank',institution:'Fictional bank',_contextStep:1};
 const saved=saveWorkspace(emptyTracker(),{account:draft,step:2},null,'hi');
 const restored=restoreWorkspace(await openCase(await sealCase(saved,'fictional setup password'),'fictional setup password'));
 assert.equal(restored.draft._contextStep,1);assert.equal(restored.step,2);assert.equal(restored.tracker.accounts.length,0);
 for(const value of [-1,3,1.5,'1'])assert.throws(()=>validateDraft({...draft,_contextStep:value}));
});

test('back from a correction returns to the reply choice without restarting preparation or changing evidence',()=>{const a=account(),c=createNominationCoach();c.startCorrection(a);act(c,'correction','missing');act(c,'back');const state=c.snapshot([a])[0];assert.equal(state.step,5);assert.equal(state.correction,false);assert.equal(state.reason,'');assert.equal(a.nomination,'missing');});
