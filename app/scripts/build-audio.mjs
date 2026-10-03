// Validate generated recordings against the exact copy before publishing the catalog.
import {readFile,writeFile,readdir,rm} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {dictionaries} from './dictionaries.mjs';
import {audioLanguages,languageInfo} from '../dist/languages.js';
import {publicAudioCopy} from './audio-public-copy.mjs';
const root=new URL('../',import.meta.url),catalog={},credits=[];
const publicSource=JSON.parse(await readFile(new URL('audio/public-text.json',root)));
const candidateModels=JSON.parse(await readFile(new URL('audio/candidate-model-sources.json',root)));
const candidateRules=JSON.parse(await readFile(new URL('audio/pronunciation-candidates.json',root)));
// Match the generator's sorted Python JSON representation, including its spaces.
const synthesisJSON=value=>Array.isArray(value)?'['+value.map(synthesisJSON).join(', ')+']':value&&typeof value==='object'?'{'+Object.keys(value).sort().map(key=>JSON.stringify(key)+': '+synthesisJSON(value[key])).join(', ')+'}':JSON.stringify(value);
const currentSource=publicAudioCopy(audioLanguages);
if(JSON.stringify(publicSource)!==JSON.stringify(currentSource))throw Error('Released audio source does not match current public copy and audio-language registry.');
for(const lang of audioLanguages){
 const report=JSON.parse(await readFile(new URL(`audio/recordings-${lang}.json`,root)));
 if(report.language!==lang||report.license!=='CC-BY-NC-4.0'||report.fluentReview!==false||!/^facebook\/mms-tts-[a-z_-]+$/.test(report.model?.model)||!/^[a-f0-9]{40}$/.test(report.model?.revision))throw Error(`Unverified speech attribution or review claim: ${lang}`);
 if(candidateModels[lang]&&(report.scope!=='complete'||report.fluentReview!==false||report.license!=='CC-BY-NC-4.0'||JSON.stringify(report.model)!==JSON.stringify(candidateModels[lang])))throw Error(`Unverified candidate provenance or review claim: ${lang}`);
 if(candidateModels[lang]){
  const expected=createHash('sha256').update(synthesisJSON({text:publicSource[lang],rules:candidateRules[lang],model:candidateModels[lang],generator:3})).digest('hex').slice(0,12);
  if(report.revision!==expected)throw Error(`Stale candidate pronunciation/model/text revision: ${lang}`);
 }
 const source=publicSource[lang];
 const keys=Object.keys(source);
 if(Object.keys(report.entries).length!==keys.length)throw Error(`Incomplete audio: ${lang}`);
 for(const key of keys){
  const entry=report.entries[key];
  const hash=createHash('sha256').update(dictionaries[lang][key]).digest('hex');
  if(!entry||entry.textHash!==hash)throw Error(`Stale audio ${lang}/${key}`);
  const file=new URL(`dist/audio/${lang}/${report.revision}/${key}.mp3`,root),data=await readFile(file);
  if(createHash('sha256').update(data).digest('hex')!==entry.sha256)throw Error(`Changed recording ${lang}/${key}`);
  if(data.length!==entry.bytes||entry.seconds<=0||entry.seconds>90)throw Error(`Invalid recording ${lang}/${key}`);
 }
 catalog[lang]={revision:report.revision,keys,bytes:Object.values(report.entries).reduce((n,e)=>n+e.bytes,0)};
 const label=languageInfo.find(([code])=>code===lang)?.[2];if(!label)throw Error(`Unknown credited language: ${lang}`);
 credits.push({label,model:report.model.model,revision:report.model.revision});
 // Metadata and synthesis reports stay in source control, outside the public asset directory.
 const directory=new URL(`dist/audio/${lang}/${report.revision}/`,root);
 for(const file of await readdir(directory))if(file.endsWith('.json'))await rm(new URL(file,directory));
 // Older generated revisions are not part of this release.
 for(const revision of await readdir(new URL(`dist/audio/${lang}/`,root)))if(revision!==report.revision)await rm(new URL(`dist/audio/${lang}/${revision}/`,root),{recursive:true});
}
await writeFile(new URL('dist/audio-catalog.js',root),'// Generated from verified public copy and bundled recordings.\nexport const audioCatalog='+JSON.stringify(catalog)+';\n');
// Human-readable coverage and attribution must agree with actual checked files.
const creditsPath=new URL('dist/audio-credits.html',root);
let page=await readFile(creditsPath,'utf8');
if(!page.includes('id="audio-language-coverage"')||!page.includes('id="audio-model-credits"'))throw Error('Missing audio credit/coverage markers.');
const escape=value=>value.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const labels=credits.map(c=>c.label),list=labels.length===1?labels[0]:labels.slice(0,-1).join(', ')+' and '+labels.at(-1);
page=page.replace(/<p id="audio-language-coverage">[\s\S]*?<\/p>/,`<p id="audio-language-coverage">Bundled recordings are currently available in ${escape(list)}. A language offered for text does not automatically have recordings. No person's voice was cloned for this project.</p>`)
 .replace(/<ul id="audio-model-credits">[\s\S]*?<\/ul>/,`<ul id="audio-model-credits">\n${credits.map(c=>`<li><a href="https://huggingface.co/${c.model}/tree/${c.revision}" rel="noopener noreferrer">${escape(c.label)} model</a></li>`).join('\n')}\n</ul>`);
await writeFile(creditsPath,page);
console.log(Object.fromEntries(Object.entries(catalog).map(([l,c])=>[l,{clips:c.keys.length,megabytes:(c.bytes/1e6).toFixed(2)}])));
