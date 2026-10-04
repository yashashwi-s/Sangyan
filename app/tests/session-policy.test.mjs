import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {sessionText,clearLegacyRecords} from '../dist/session-policy.js';
const source=path=>readFile(new URL(path,import.meta.url),'utf8');
test('legacy personal copy is removed without reading or decrypting it; preferences remain',()=>{
 const data=new Map([['virasat-locked-workspace-v1','PRIVATE-CANARY'],['virasat-reading-settings-v1','{"textLevel":120}']]);
 const storage={get length(){return data.size;},key:i=>[...data.keys()][i],getItem(){throw Error('must not read personal data');},removeItem:key=>data.delete(key)};
 assert.equal(clearLegacyRecords(storage),true);assert.equal(data.size,1);assert.ok(data.has('virasat-reading-settings-v1'));assert.equal(clearLegacyRecords(storage),false);
 assert.equal(clearLegacyRecords({get length(){throw Error('storage blocked');}}),false);
});
test('session notice is explicit in every supported language and unknown keys are not overridden',()=>{
 for(const lang of ['en','hi','bn','mr','ta','ur'])assert.ok(sessionText(lang,'sessionNotice').length>80);
 assert.equal(sessionText('en','privacyDetail'),sessionText('en','sessionNotice'));assert.equal(sessionText('en','unrelated'),undefined);
});
test('public app has no record persistence, file intake, personal export or credential controls',async()=>{
 const main=await source('../dist/main.js');
 assert.doesNotMatch(main,/sealCase|openCase|handleVault|readableFile|calendarFile|window\.print|type="(?:file|password)"|sessionStorage|indexedDB|document\.cookie|sendBeacon/);
 const writes=[...main.matchAll(/localStorage\.setItem\(([^,]+),/g)].map(m=>m[1]);assert.deepEqual(writes,['preferencesKey']);
 assert.match(main,/pagehide',clearSession/);assert.match(main,/if\(e\.persisted\)clearSession/);
 assert.match(main,/function clearSession\(\)[\s\S]*?coach\.reset\(\)[\s\S]*?current=emptyTracker\(\)[\s\S]*?draft=null/);
});
test('stale persistence narration is absent from current UI and policy copy is never sent to old audio',async()=>{
 const main=await source('../dist/main.js');
 assert.doesNotMatch(main,/copy\('(?:deviceHelp|saveIntro|saveBeforeLeaving|savedNext|shareHelp)'/);
 assert.match(main,/hasSessionText\(key\)\?'':'data-speak'/);
});
test('hosting blocks form submission, embedding, external connections and device permissions',async()=>{
 const config=JSON.parse(await source('../vercel.json')),headers=Object.fromEntries(config.headers[0].headers.map(({key,value})=>[key,value]));
 for(const directive of ["form-action 'none'","frame-ancestors 'none'","connect-src 'self'","object-src 'none'"])assert.ok(headers['Content-Security-Policy'].includes(directive));
 assert.equal(headers['Referrer-Policy'],'no-referrer');assert.ok(headers['Permissions-Policy'].includes('microphone=()'));
});
