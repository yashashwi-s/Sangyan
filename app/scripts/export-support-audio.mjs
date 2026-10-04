// Build-time fixed public guidance only. Never run on user records.
import {readFile,writeFile} from 'node:fs/promises';
import {audioLanguages} from '../dist/languages.js';
const source={};
for(const lang of audioLanguages)source[lang]={...JSON.parse(await readFile(new URL(`../translations/guidance-${lang}.json`,import.meta.url))),...JSON.parse(await readFile(new URL(`../translations/resilience-${lang}.json`,import.meta.url)))};
await writeFile(new URL('../audio/support-public-text.json',import.meta.url),JSON.stringify(source,null,2)+'\n');
