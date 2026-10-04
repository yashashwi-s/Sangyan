import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {audioCatalog} from '../dist/audio-catalog.js';
import {dictionaries} from '../scripts/dictionaries.mjs';
import {audioLanguages,languageInfo} from '../dist/languages.js';
import {audioQueue} from '../dist/speech.js';
const hash=data=>createHash('sha256').update(data).digest('hex');
test('every advertised audio language has actual current recordings for all exported public text',async()=>{
 const source=JSON.parse(await readFile(new URL('../audio/public-text.json',import.meta.url)));
 assert.deepEqual(Object.keys(audioCatalog).sort(),audioLanguages.slice().sort());
 assert.deepEqual(Object.keys(source).sort(),audioLanguages.slice().sort());
 for(const [language,copy] of Object.entries(source)){
  const report=JSON.parse(await readFile(new URL(`../audio/recordings-${language}.json`,import.meta.url))),release=audioCatalog[language];
  assert.equal(release.revision,report.revision);assert.deepEqual(release.keys.sort(),Object.keys(copy).sort());
  for(const [key,text] of Object.entries(copy)){
   assert.equal(text,dictionaries[language][key],`${language}/${key} stale source`);
   const entry=report.entries[key],file=new URL(`../dist/audio/${language}/${release.revision}/${key}.mp3`,import.meta.url),data=await readFile(file);
   assert.equal(entry.textHash,hash(text));assert.equal(entry.sha256,hash(data));assert.equal(data.length,entry.bytes);assert.ok(entry.seconds>0&&entry.seconds<90);assert.ok(data.length<370000);
   assert.equal(audioQueue([{text}],language,audioCatalog,dictionaries[language]).length,1,`${language}/${key} cannot be played`);
  }
 }
});
test('audio deployment permits same-origin media without exposing a synthesis endpoint',async()=>{
 const config=JSON.parse(await readFile(new URL('../vercel.json',import.meta.url))),html=await readFile(new URL('../dist/index.html',import.meta.url),'utf8');
 assert.ok(html.includes("media-src 'self'"));assert.ok(config.headers[0].headers.find(h=>h.key==='Content-Security-Policy').value.includes("media-src 'self'"));
 const code=await readFile(new URL('../dist/speech.js',import.meta.url),'utf8');assert.ok(!code.includes('speechSynthesis'));assert.ok(!code.includes('SpeechSynthesisUtterance'));assert.ok(!code.includes('https://'));
});
test('published audio coverage and model credits match each actual language manifest',async()=>{
 const page=await readFile(new URL('../dist/audio-credits.html',import.meta.url),'utf8');
 const links=[...page.matchAll(/href="https:\/\/huggingface\.co\/([^"#]+)"/g)].map(m=>m[1]);
 assert.equal(links.length,audioLanguages.length);
 const coverage=page.match(/<p id="audio-language-coverage">(.*?)<\/p>/)[1];
 for(const language of audioLanguages){
  const report=JSON.parse(await readFile(new URL(`../audio/recordings-${language}.json`,import.meta.url)));
  assert.ok(links.includes(`${report.model.repo||report.model.model}/tree/${report.model.revision}${language==='ne'?'/ne/ne_NP/chitwan/medium':''}`),language);
  assert.ok(coverage.includes(languageInfo.find(([code])=>code===language)[2]),language);
 }
 assert.ok(page.includes('have not yet passed fluent-speaker checks'));
 assert.ok(page.includes('CC BY-NC 4.0'));
 if(audioLanguages.includes('ne')){assert.ok(page.includes('Piper Chitwan'));assert.ok(page.includes('CC0'));assert.ok(page.includes('GPL-3.0'));}
});
