import {readFile} from 'node:fs/promises';
import {dictionaries as original} from '../dist/i18n.js';
import {languageInfo} from '../dist/languages.js';
export const dictionaries={...original};
const keys=Object.keys(original.en).sort();
for(const [code] of languageInfo){
 if(dictionaries[code])continue;
 let source;
 try{source=await readFile(new URL(`../translations/${code}.json`,import.meta.url),'utf8');}
 catch(error){if(error.code==='ENOENT')continue;throw error;}
 const dictionary=JSON.parse(source);
 if(JSON.stringify(Object.keys(dictionary).sort())!==JSON.stringify(keys)||Object.values(dictionary).some(value=>typeof value!=='string'||!value.trim()||/<\/?[a-z]/i.test(value)))throw Error(`Incomplete translation: ${code}`);
 dictionaries[code]=dictionary;
}
for(const [code,dictionary] of Object.entries(dictionaries)){
 let coverage;
 try{coverage=JSON.parse(await readFile(new URL(`../translations/coverage-${code}.json`,import.meta.url),'utf8'));}
 catch(error){throw Error(`Missing coverage labels: ${code}`,{cause:error});}
 const required=['searchLanguages','translationDraft','textOnly','audioAvailable','noLanguages'];
 if(required.some(key=>typeof coverage[key]!=='string'||!coverage[key].trim()))throw Error(`Incomplete coverage labels: ${code}`);
 dictionaries[code]={...dictionary,...coverage};
}

const fixedKeys={};
function validateFixed(kind,code,copy){const keys=Object.keys(copy).sort();if(code==='en')fixedKeys[kind]=keys;if(JSON.stringify(keys)!==JSON.stringify(fixedKeys[kind])||Object.values(copy).some(v=>typeof v!=='string'||!v.trim()||/<\/?[a-z]/i.test(v)||v.includes('\ufffd')||v.includes('\n')))throw Error(`Invalid fixed public ${kind} translation: ${code}`);}

// Guided learning is fixed public copy, merged into every effective language pack.
for(const [code,dictionary] of Object.entries(dictionaries)){
 const guidance=JSON.parse(await readFile(new URL(`../translations/guidance-${code}.json`,import.meta.url),'utf8'));
 validateFixed('guidance',code,guidance);dictionaries[code]={...dictionary,...guidance};
}

// Persona support is fixed build-time public text, loaded only in the selected pack.
for(const [code,dictionary] of Object.entries(dictionaries)){
 const support=JSON.parse(await readFile(new URL(`../translations/resilience-${code}.json`,import.meta.url),'utf8'));
 validateFixed('support',code,support);dictionaries[code]={...dictionary,...support};
}

// Fixed usability and offline-signing notices are text-only draft labels.
for(const [code,dictionary] of Object.entries(dictionaries)){
 const usability=JSON.parse(await readFile(new URL(`../translations/usability-${code}.json`,import.meta.url),'utf8'));
 validateFixed('usability',code,usability);dictionaries[code]={...dictionary,...usability};
}
