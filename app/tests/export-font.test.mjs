import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {exportFont} from '../dist/export-font.js';
test('family HTML embeds the selected script font without transmitting family content',async()=>{
 for(const [code,file] of [['mni','noto-sans-meetei-mayek.woff2'],['sat','noto-sans-ol-chiki.woff2']]){
  const bytes=await readFile(new URL('../dist/fonts/'+file,import.meta.url)),requests=[];
  const licence='SIL OPEN FONT LICENSE Version 1.1';
  const css=await exportFont(code,async(...args)=>{requests.push(args);return new Response(args[0].endsWith('.txt')?licence:bytes);});
  assert.deepEqual(requests,[['/fonts/'+file],['/fonts/OFL-'+(code==='mni'?'meetei-mayek':'ol-chiki')+'.txt']]);assert.ok(css.includes(licence));
  assert.ok(css.includes(bytes.toString('base64')));assert.ok(!css.includes('https://'));
 }
});
test('other languages need no font download and missing fonts fail explicitly',async()=>{
 assert.equal(await exportFont('hi',()=>{throw Error('Unexpected fetch');}),'');
 await assert.rejects(exportFont('sat',async()=>new Response('',{status:404})));
 await assert.rejects(exportFont('mni',async()=>new Response(new Uint8Array(10001))));
});
