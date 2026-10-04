import {writeFile,mkdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {parseArgs} from 'node:util';
import {audioLanguages} from '../dist/languages.js';
import {publicAudioCopy} from './audio-public-copy.mjs';
const {values}=parseArgs({options:{language:{type:'string',multiple:true},output:{type:'string'}}});
const languages=values.language||audioLanguages;
if(new Set(languages).size!==languages.length)throw Error('Duplicate audio-text language.');
// Candidate exports stay separate from the released source until their recordings pass checks.
const released=languages.length===audioLanguages.length&&languages.every(code=>audioLanguages.includes(code));
if(!released&&!values.output)throw Error('Candidate audio text requires --output to preserve the released audio source.');
const text=publicAudioCopy(languages);
const output=values.output?resolve(values.output):fileURLToPath(new URL('../audio/public-text.json',import.meta.url));
if(!released&&output===fileURLToPath(new URL('../audio/public-text.json',import.meta.url)))throw Error('Candidate audio text cannot replace the released source.');
await mkdir(dirname(output),{recursive:true});
await writeFile(output,JSON.stringify(text,null,2)+'\n');
console.log(`Exported ${languages.length} public dictionaries (${Object.keys(Object.values(text)[0]).length} keys each). No user input is accepted.`);
