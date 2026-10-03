// Validate generated recordings against the exact copy before publishing the catalog.
import {readFile,writeFile,readdir,rm} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {dictionaries} from './dictionaries.mjs';
import {audioLanguages} from '../dist/languages.js';
import {publicAudioCopy} from './audio-public-copy.mjs';
const root=new URL('../',import.meta.url),catalog={};
const publicSource=JSON.parse(await readFile(new URL('audio/public-text.json',root)));
const candidateModels=JSON.parse(await readFile(new URL('audio/candidate-model-sources.json',root)));
const currentSource=publicAudioCopy(audioLanguages);
if(JSON.stringify(publicSource)!==JSON.stringify(currentSource))throw Error('Released audio source does not match current public copy and audio-language registry.');
for(const lang of audioLanguages){
 const report=JSON.parse(await readFile(new URL(`audio/recordings-${lang}.json`,root)));
 if(candidateModels[lang]&&(report.scope!=='complete'||report.fluentReview!==false||report.license!=='CC-BY-NC-4.0'||JSON.stringify(report.model)!==JSON.stringify(candidateModels[lang])))throw Error(`Unverified candidate provenance or review claim: ${lang}`);
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
 // Metadata and synthesis reports stay in source control, outside the public asset directory.
 const directory=new URL(`dist/audio/${lang}/${report.revision}/`,root);
 for(const file of await readdir(directory))if(file.endsWith('.json'))await rm(new URL(file,directory));
 // Older generated revisions are not part of this release.
 for(const revision of await readdir(new URL(`dist/audio/${lang}/`,root)))if(revision!==report.revision)await rm(new URL(`dist/audio/${lang}/${revision}/`,root),{recursive:true});
}
await writeFile(new URL('dist/audio-catalog.js',root),'// Generated from verified public copy and bundled recordings.\nexport const audioCatalog='+JSON.stringify(catalog)+';\n');
console.log(Object.fromEntries(Object.entries(catalog).map(([l,c])=>[l,{clips:c.keys.length,megabytes:(c.bytes/1e6).toFixed(2)}])));
