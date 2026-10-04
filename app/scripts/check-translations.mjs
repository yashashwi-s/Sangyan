// Build-time structural checks. These do not certify linguistic or legal accuracy.
import {readFile} from 'node:fs/promises';
import {gzipSync} from 'node:zlib';
import {languageInfo,audioLanguages} from '../dist/languages.js';
import {dictionaries} from './dictionaries.mjs';
const baseline=JSON.parse(await readFile(new URL('../translations/en.json',import.meta.url),'utf8'));
const guidance=JSON.parse(await readFile(new URL('../translations/guidance-en.json',import.meta.url),'utf8'));
const required=[...Object.keys(guidance),...Object.keys(baseline),'searchLanguages','translationDraft','textOnly','audioAvailable','noLanguages'];
const codes=languageInfo.map(([code])=>code);
if(codes.length!==21||new Set(codes).size!==21||codes.some(code=>['brx','ks'].includes(code)))throw Error('Release scope must be English plus 20 supported scheduled languages (21 total); Bodo and Kashmiri are excluded.');
if(JSON.stringify(Object.keys(dictionaries).sort())!==JSON.stringify(codes.slice().sort()))throw Error('Dictionary registry and release scope differ.');
if(audioLanguages.some(code=>!codes.includes(code)))throw Error('Audio claims an unsupported language.');
const report=[];
for(const [code,nativeName,name] of languageInfo){
 const d=dictionaries[code];if(!d)throw Error(`Missing language ${code}`);
 const missing=required.filter(key=>typeof d[key]!=='string'||!d[key].trim());
 if(missing.length)throw Error(`Missing ${code}: ${missing.join(', ')}`);
 const artifacts=Object.entries(d).filter(([,value])=>(/^\s*\[\d{3}\]/.test(value)||/^\s*[०-९]+[.।]\s*\n/u.test(value))||value.includes('\ufffd'));
 if(artifacts.length)throw Error(`Suspicious encoding/translation markers ${code}: ${artifacts.map(([k])=>k).join(', ')}`);
 const gzipBytes=gzipSync(JSON.stringify(d)).length;if(gzipBytes>24000)throw Error(`Language pack exceeds 24 KB budget: ${code} ${gzipBytes}`);
 report.push({code,name,nativeName,keys:Object.keys(d).length,gzipBytes,audio:audioLanguages.includes(code),humanReviewed:false,unchangedEnglish:Object.keys(baseline).filter(key=>d[key]===baseline[key]).length});
}
console.log(JSON.stringify({note:'Structural completeness only. Unchanged names/numbers can be intentional; fluent review is still required.',languages:report},null,2));
