// Build-time public UI copy only. No runtime values or user files are accepted.
import {readFile} from 'node:fs/promises';
import {dictionaries} from './dictionaries.mjs';
import {isKnownLanguage} from '../dist/languages.js';
const baseline=JSON.parse(await readFile(new URL('../translations/en.json',import.meta.url),'utf8'));
// These controls belong to the retired device-voice implementation.
const retired=new Set(['voiceSetup','voiceSetupHelp','androidVoice','appleVoice','voiceFallback','refreshVoices','chooseVoice']);
export const audioPublicKeys=Object.keys(baseline).filter(key=>!retired.has(key));
export function publicAudioCopy(codes){
 return Object.fromEntries(codes.map(code=>{
  if(!isKnownLanguage(code)||!Object.hasOwn(dictionaries,code))throw Error(`Unsupported audio-text language: ${code}`);
  return [code,Object.fromEntries(audioPublicKeys.map(key=>{
   const value=dictionaries[code][key];
   if(typeof value!=='string'||!value.trim())throw Error(`Missing public audio text: ${code}/${key}`);
   return [key,value];
  }))];
 }));
}
