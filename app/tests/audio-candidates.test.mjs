import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {publicAudioCopy} from '../scripts/audio-public-copy.mjs';
import {isKnownLanguage} from '../dist/languages.js';
const candidates=JSON.parse(await readFile(new URL('../audio/candidates.json',import.meta.url)));
const sources=JSON.parse(await readFile(new URL('../audio/candidate-model-sources.json',import.meta.url)));
const rules=JSON.parse(await readFile(new URL('../audio/pronunciation-candidates.json',import.meta.url)));
test('candidate model provenance pins distinct language codes, non-commercial licence and safe model files',()=>{
 for(const [code,model] of Object.entries(candidates)){
  assert.ok(isKnownLanguage(code));const source=sources[code];
  assert.equal(source.model,`facebook/mms-tts-${model}`);assert.equal(source.languageCode,code);assert.equal(source.license,'CC-BY-NC-4.0');assert.match(source.revision,/^[a-f0-9]{40}$/);
  assert.ok(source.files['model.safetensors']);assert.ok(!source.files['pytorch_model.bin']);
  for(const [file,meta] of Object.entries(source.files)){assert.ok(!file.includes('/'));assert.match(meta.sha256,/^[a-f0-9]{64}$/);assert.ok(meta.bytes>0);}
 }
 assert.equal(new Set(Object.values(candidates)).size,Object.keys(candidates).length);
});
test('every fixed public number and Latin token has an explicit unreviewed candidate pronunciation',()=>{
 for(const [code,copy] of Object.entries(publicAudioCopy(Object.keys(candidates)))){
  assert.equal(rules[code].fluentReview,false);
  for(let value of Object.values(copy)){
   // Numeric forms in these nine native scripts correspond to the same decimal values.
   value=value.replace(/[૦-૯੦-੯೦-೯౦-౯൦-൯০-৯୦-୯०-९]/gu,c=>String(['૦૧૨૩૪૫૬૭૮૯','੦੧੨੩੪੫੬੭੮੯','೦೧೨೩೪೫೬೭೮೯','౦౧౨౩౪౫౬౭౮౯','൦൧൨൩൪൫൬൭൮൯','০১২৩৪৫৬৭৮৯','୦୧୨୩୪୫୬୭୮୯','०१२३४५६७८९'].find(d=>d.includes(c)).indexOf(c)));
   for(const token of value.match(/[A-Za-z]+(?:-[A-Za-z]+)*/g)||[])assert.ok(rules[code].words[token.toLowerCase()],`${code}: missing ${token}`);
   for(const number of value.match(/\d+/g)||[])assert.ok(rules[code].numbers[number],`${code}: missing ${number}`);
  }
 }
});
