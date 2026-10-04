import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {languageInfo} from '../dist/languages.js';
import {localizeGuidance,guidanceSource} from '../dist/guidance-copy.js';
import {createJourneyEntry} from '../dist/journey-entry.js';
import {createNominationCoach} from '../dist/nomination-coach.js';
const source=JSON.parse(await readFile(new URL('../translations/guidance-en.json',import.meta.url),'utf8'));
test('all 21 packs contain the exact new guided-copy scope with no missing-value fallback',async()=>{
 for(const [code] of languageInfo){const translated=JSON.parse(await readFile(new URL(`../translations/guidance-${code}.json`,import.meta.url),'utf8'));assert.deepEqual(Object.keys(translated).sort(),Object.keys(source).sort());assert.ok(Object.values(translated).every(v=>typeof v==='string'&&v.trim()&&!v.includes('\ufffd')));}
});
test('new guide uses fixed public lookup and escapes translations without changing action attributes or official links',()=>{
 const entry=createJourneyEntry(),html=entry.render(),translated=localizeGuidance(html,'ur',()=>'<translated & text>');assert.match(translated,/lang="ur"/);assert.match(translated,/&lt;translated &amp; text&gt;/);assert.match(translated,/data-entry-action="living"/);assert.doesNotMatch(translated,/What do you need help with/);
 const coach=createNominationCoach(),rendered=localizeGuidance(coach.render({id:'fictional',type:'bank',holding:'sole'},{url:'https://example.org'}),'hi',()=> 'अनुवाद');assert.match(rendered,/href="https:\/\/example.org\/"/);assert.match(rendered,/data-coach-action="next"/);assert.doesNotMatch(rendered,/Start with the correct official form/);
 assert.equal(guidanceSource['New guided learning: text guidance. Existing recorded instructions are available separately.'],'guidance157');
});
test('private-looking arbitrary provider content is preserved locally and never passed to a translator',()=>{
 const calls=[],html='<p>PRIVATE CANARY 1234</p>';assert.equal(localizeGuidance(html,'hi',(...args)=>{calls.push(args);return ''; }),html);assert.equal(calls.length,0);
});

test('all public coach and entry rendering branches have translated text keys',async()=>{
 const {collectGuidanceRenderings}=await import('../scripts/collect-guidance-copy.mjs');
 const {texts,markup}=collectGuidanceRenderings();assert.ok(markup.length>17000);
 for(const text of texts)assert.ok(guidanceSource[text],`Missing public guidance: ${text}`);
 for(const [code] of languageInfo){
  const pack=JSON.parse(await readFile(new URL(`../translations/guidance-${code}.json`,import.meta.url),'utf8'));
  for(const text of texts)assert.ok(pack[guidanceSource[text]]?.trim());
 }
});
