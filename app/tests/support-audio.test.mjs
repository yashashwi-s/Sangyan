import {test} from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';import {createHash} from 'node:crypto';
import {supportAudioCatalog} from '../dist/audio-support-catalog.js';import {recordedPublicCatalog,audioQueue,createReader} from '../dist/speech.js';import {dictionaries} from '../scripts/dictionaries.mjs';import {audioLanguages,languageInfo} from '../dist/languages.js';
const hash=data=>createHash('sha256').update(data).digest('hex');
test('every guided-learning and persona-support recording matches the committed public text and actual bundled bytes',async()=>{
 const source=JSON.parse(await readFile(new URL('../audio/support-public-text.json',import.meta.url)));assert.deepEqual(Object.keys(supportAudioCatalog),audioLanguages);
 for(const language of audioLanguages){
  const report=JSON.parse(await readFile(new URL(`../audio/support-recordings-${language}.json`,import.meta.url))),release=supportAudioCatalog[language];
  const expected={...JSON.parse(await readFile(new URL(`../translations/guidance-${language}.json`,import.meta.url))),...JSON.parse(await readFile(new URL(`../translations/resilience-${language}.json`,import.meta.url)))};
  assert.deepEqual(source[language],expected);assert.equal(release.keys.length,Object.keys(expected).length);assert.deepEqual(release.keys,Object.keys(expected));assert.equal(release.revision,'support-'+report.revision);assert.equal(release.manifestHash,hash(JSON.stringify(report)));assert.equal(report.fluentReview,false);
  for(const [key,text] of Object.entries(expected)){
   const entry=report.entries[key],data=await readFile(new URL(`../dist/audio/${language}/${release.revision}/${key}.mp3`,import.meta.url));
   assert.equal(entry.textHash,hash(text));assert.equal(entry.sha256,hash(data));assert.equal(entry.bytes,data.length);assert.ok(entry.seconds>0&&entry.seconds<=90);assert.equal(dictionaries[language][key],text);
   const queue=audioQueue([{text,source:7}],language,recordedPublicCatalog,dictionaries[language]);assert.equal(queue.length,1,`${language}/${key}`);assert.ok(queue[0].url.startsWith(`/audio/${language}/support-`));
  }
 }
});
test('supplemental playback combines earlier instructions and new steps while excluding private entries',()=>{
 for(const language of audioLanguages){
  const dictionary=dictionaries[language],blocks=[{text:dictionary.homeTitle},{text:dictionary.tipsHelp},{text:dictionary.oldSharesKind},{text:'Fictional private complaint note 123456789'}];
  const queue=audioQueue(blocks,language,recordedPublicCatalog,dictionary);assert.equal(queue.length,3);assert.ok(!queue.some(c=>c.url.includes('123456789')));
  const audio={pause(){},load(){},removeAttribute(){},play(){return Promise.resolve();}},reader=createReader({createAudio:()=>audio,getDictionary:()=>dictionary});
  assert.equal(reader.start([{text:dictionary.tipsHelp}],{language}),true);assert.equal(audio.src,queue[1].url);reader.stop();
 }
 for(const [code] of languageInfo)if(!audioLanguages.includes(code)){assert.equal(supportAudioCatalog[code],undefined);assert.deepEqual(audioQueue([{text:dictionaries[code].tipsHelp}],code,recordedPublicCatalog,dictionaries[code]),[]);}
});
