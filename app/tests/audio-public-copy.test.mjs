import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,mkdtemp,rm} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {publicAudioCopy,audioPublicKeys} from '../scripts/audio-public-copy.mjs';
import {audioLanguages,languageInfo} from '../dist/languages.js';
test('public audio export can stage every supported language without accepting private text or changing released coverage',async()=>{
 const source=JSON.parse(await readFile(new URL('../audio/public-text.json',import.meta.url)));
 assert.deepEqual(publicAudioCopy(audioLanguages),source);
 assert.equal(audioPublicKeys.length,357);
 const staged=publicAudioCopy(languageInfo.map(([code])=>code));
 assert.equal(Object.keys(staged).length,21);
 for(const copy of Object.values(staged))assert.deepEqual(Object.keys(copy),audioPublicKeys);
 for(const code of ['brx','ks','__proto__','my private account'])assert.throws(()=>publicAudioCopy([code]),/Unsupported/);
});
test('candidate command requires a separate output and rejects unsupported languages before writing',async()=>{
 const script=new URL('../scripts/export-audio-text.mjs',import.meta.url),directory=await mkdtemp(join(tmpdir(),'virasat-audio-stage-'));
 try{
  assert.throws(()=>execFileSync(process.execPath,[script.pathname,'--language','gu'],{stdio:'pipe'}),/Candidate audio text requires/);
  const output=join(directory,'public.json');
  execFileSync(process.execPath,[script.pathname,'--language','gu','--output',output],{stdio:'pipe'});
  assert.deepEqual(JSON.parse(await readFile(output)),publicAudioCopy(['gu']));
  assert.throws(()=>execFileSync(process.execPath,[script.pathname,'--language','ks','--output',output],{stdio:'pipe'}),/Unsupported audio-text language/);
  assert.deepEqual(JSON.parse(await readFile(output)),publicAudioCopy(['gu']));
 }finally{await rm(directory,{recursive:true,force:true});}
});
