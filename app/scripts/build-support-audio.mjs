// Fail closed on stale public text, incomplete coverage, changed clips or model provenance.
import {readFile,writeFile,readdir,rm} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {audioLanguages} from '../dist/languages.js';
import {dictionaries} from './dictionaries.mjs';
const root=new URL('../',import.meta.url),catalog={};
const synthesisJSON=value=>Array.isArray(value)?'['+value.map(synthesisJSON).join(', ')+']':value&&typeof value==='object'?'{'+Object.keys(value).sort().map(key=>JSON.stringify(key)+': '+synthesisJSON(value[key])).join(', ')+'}':JSON.stringify(value);
const pronunciation=JSON.parse(await readFile(new URL('audio/support-pronunciation.json',root))),candidateRules=JSON.parse(await readFile(new URL('audio/pronunciation-candidates.json',root))),baseRules=JSON.parse(await readFile(new URL('audio/pronunciation.json',root)));
const hash=data=>createHash('sha256').update(data).digest('hex');
const source=JSON.parse(await readFile(new URL('audio/support-public-text.json',root)));
if(JSON.stringify(Object.keys(source))!==JSON.stringify(audioLanguages))throw Error('Supplement language registry mismatch');
for(const lang of audioLanguages){
 const expected={...JSON.parse(await readFile(new URL(`translations/guidance-${lang}.json`,root))),...JSON.parse(await readFile(new URL(`translations/resilience-${lang}.json`,root)))};
 if(JSON.stringify(source[lang])!==JSON.stringify(expected))throw Error(`Stale fixed support source: ${lang}`);
 const report=JSON.parse(await readFile(new URL(`audio/support-recordings-${lang}.json`,root))),base=JSON.parse(await readFile(new URL(`audio/recordings-${lang}.json`,root)));
 if(report.language!==lang||report.scope!=='complete'||report.fluentReview!==false||!/^[a-f0-9]{12}$/.test(report.revision)||report.model.revision!==base.model.revision||report.license!==base.license)throw Error(`Unverified supplement provenance ${lang}`);
 if(lang==='ne'?JSON.stringify(report.model)!==JSON.stringify(base.model):report.model.model!==base.model.model)throw Error(`Wrong support model ${lang}`);
 if(lang!=='ne'&&JSON.stringify(report.supplementRules)!==JSON.stringify(pronunciation[lang]))throw Error(`Stale supplement pronunciation rules ${lang}`);
 const recipe=lang==='ne'?{text:expected,model:report.model,generator:'support-piper-ne-1',engine:'piper-tts-1.8.0',aliases:{}}:{text:expected,rules:candidateRules[lang]||baseRules,model:report.model,supplementRules:pronunciation[lang],generator:'support-mms-1'};
 if(report.generator!==recipe.generator||report.revision!==hash(synthesisJSON(recipe)).slice(0,12))throw Error(`Stale supplemental synthesis revision ${lang}`);
 const keys=Object.keys(expected);
 if(JSON.stringify(Object.keys(report.entries))!==JSON.stringify(keys))throw Error(`Incomplete supplemental audio ${lang}`);
 const directory=new URL(`dist/audio/${lang}/support-${report.revision}/`,root);
 for(const key of keys){
  const entry=report.entries[key],file=new URL(`${key}.mp3`,directory),data=await readFile(file);
  if(entry.textHash!==hash(dictionaries[lang][key])||entry.sha256!==hash(data)||entry.bytes!==data.length||entry.seconds<=0||entry.seconds>90)throw Error(`Invalid support recording ${lang}/${key}`);
 }
 // Bind catalog revision to the complete report, not a caller-provided path.
 const manifestHash=hash(JSON.stringify(report));
 catalog[lang]={revision:'support-'+report.revision,keys,bytes:Object.values(report.entries).reduce((n,e)=>n+e.bytes,0),manifestHash};
 for(const file of await readdir(directory))if(file.endsWith('.json'))await rm(new URL(file,directory));
 for(const dir of await readdir(new URL(`dist/audio/${lang}/`,root)))if(dir.startsWith('support-')&&dir!==catalog[lang].revision)await rm(new URL(`dist/audio/${lang}/${dir}/`,root),{recursive:true});
}
await writeFile(new URL('dist/audio-support-catalog.js',root),'// Generated from validated fixed public guidance recordings.\nexport const supportAudioCatalog='+JSON.stringify(catalog)+';\n');
console.log({languages:Object.keys(catalog).length,clips:Object.values(catalog).reduce((n,c)=>n+c.keys.length,0),bytes:Object.values(catalog).reduce((n,c)=>n+c.bytes,0)});

const creditsPath=new URL('dist/audio-credits.html',root);let credits=await readFile(creditsPath,'utf8');
const coverage=`<p id="support-audio-coverage">The step-by-step learning and persona support journeys include ${Object.values(catalog)[0].keys.length} additional fixed public recordings in each of the ${Object.keys(catalog).length} audio languages listed above. These use the same credited models and remain synthetic drafts without fluent review. Private account details and complaint notes are never synthesized.</p>`;
credits=credits.includes('id="support-audio-coverage"')?credits.replace(/<p id="support-audio-coverage">[\s\S]*?<\/p>/,coverage):credits.replace('</main>',coverage+'</main>');await writeFile(creditsPath,credits);
