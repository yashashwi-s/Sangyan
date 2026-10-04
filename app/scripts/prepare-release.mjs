// Offline staging only. Never authenticates, publishes, changes a host plan or reads user saves.
import {readFile,writeFile,mkdir,readdir,copyFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {createHash} from 'node:crypto';
import {localeCatalog} from '../dist/locale-catalog.js';
import {audioCatalog} from '../dist/audio-catalog.js';
import {supportAudioCatalog} from '../dist/audio-support-catalog.js';
import {audioLanguages} from '../dist/languages.js';
import {checkDeploymentBudget} from './delivery-budget.mjs';
const [output,plan,option]=process.argv.slice(2);
if(!output||!['hobby','pro'].includes(plan)||option&&option!=='--check-only')throw Error('Use: node scripts/prepare-release.mjs OUTPUT hobby|pro [--check-only]. Select the actual deployment plan before publishing.');
const app=resolve(import.meta.dirname,'..'),root=resolve(app,'dist'),out=resolve(output);
if(out===app||out.startsWith(app+'/'))throw Error('Use an isolated staging directory outside the app.');
const worker=await readFile(resolve(root,'sw.js'),'utf8'),shell=worker.match(/const FILES=\[([^\]]+)\]/)?.[1];if(!shell)throw Error('Missing public shell inventory');
const files=new Set([...shell.matchAll(/'([^']+)'/g)].map(m=>m[1].slice(1)));files.add('sw.js');
for(const name of ['stats.html','stats.css','stats.json'])files.add(name);
for(const [language,path] of Object.entries(localeCatalog)){files.add(path.slice(1));files.add(`entry/${language}.html`);files.add(`paper/${language}.html`);}
for(const name of ['noto-sans-meetei-mayek.woff2','noto-sans-ol-chiki.woff2','OFL-meetei-mayek.txt','OFL-ol-chiki.txt','SOURCES.json'])files.add('fonts/'+name);
for(const lang of audioLanguages)for(const catalog of [audioCatalog,supportAudioCatalog]){
 const release=catalog[lang];if(!release||!/^((support-)?[a-f0-9]{12})$/.test(release.revision)||!release.keys.length)throw Error(`Missing verified recordings ${lang}`);
 for(const key of release.keys){if(!/^[a-zA-Z0-9]+$/.test(key))throw Error('Unsafe public clip name');files.add(`audio/${lang}/${release.revision}/${key}.mp3`);}
}
const rows=[];
for(const path of [...files].sort()){
 if(path.startsWith('/')||path.split('/').includes('..')||path.includes('\\')||!/^([a-zA-Z0-9_./-]+)$/.test(path))throw Error('Unsafe public asset path');
 const data=await readFile(resolve(root,path));rows.push({path:'dist/'+path,bytes:data.length,sha256:createHash('sha256').update(data).digest('hex')});
}
const config=await readFile(resolve(app,'vercel.json'));rows.push({path:'vercel.json',bytes:config.length,sha256:createHash('sha256').update(config).digest('hex')});
const budget=checkDeploymentBudget({bytes:rows.reduce((n,r)=>n+r.bytes,0),files:rows.length},plan);
const report={...budget,sourceManifestSha256:createHash('sha256').update(JSON.stringify(rows)).digest('hex'),assets:rows,staged:false,notes:['Only the released public shell, selected-language packs, entry pages, fonts/credits and verified recordings are included.','Authoring dictionaries, research, synthesis reports/models, user saves, repository metadata and authentication configuration are excluded.','This measures CLI upload size/file ceilings; it does not verify the account plan, delivery quotas, cost, production performance or service-provider acceptance.']};
if(option==='--check-only'){console.log(JSON.stringify(report,null,2));if(!budget.fits)process.exitCode=1;}
else{
 if(!budget.fits)throw Error(`Measured public release exceeds ${plan} CLI source-upload limits. Review the plan/build-based delivery route; nothing was staged or published.`);
 await mkdir(out,{recursive:true});if((await readdir(out)).length)throw Error('Staging directory must be empty; existing contents are never deleted.');
 for(const row of rows){const dest=resolve(out,row.path);await mkdir(dirname(dest),{recursive:true});await copyFile(row.path==='vercel.json'?resolve(app,'vercel.json'):resolve(root,row.path.slice(5)),dest);}
 report.staged=true;await writeFile(out+'-manifest.json',JSON.stringify(report,null,2)+'\n');console.log({stage:out,...budget});
}
