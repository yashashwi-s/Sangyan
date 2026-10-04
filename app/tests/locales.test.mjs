import {sessionText} from '../dist/session-policy.js';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {gzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {createLocaleStore} from '../dist/locale.js';
import {localeCatalog} from '../dist/locale-catalog.js';
import {dictionaries} from '../dist/i18n.js';
test('each small language pack matches all current public copy and its immutable address',async()=>{
 for(const [language,path] of Object.entries(localeCatalog)){
  const data=await readFile(new URL('../dist'+path,import.meta.url));assert.deepEqual(JSON.parse(data),dictionaries[language]);
  assert.ok(path.includes(createHash('sha256').update(data).digest('hex').slice(0,12)));assert.ok(gzipSync(data).length<12000);
 }
});
test('choosing a language fetches only that language once and reuses concurrent loads',async()=>{
 const calls=[],store=createLocaleStore(async path=>{calls.push(path);return Response.json(dictionaries.hi);});
 const [a,b]=await Promise.all([store.load('hi'),store.load('hi')]);assert.equal(a,b);assert.deepEqual(calls,[localeCatalog.hi]);
 await store.load('hi');assert.equal(calls.length,1);assert.equal(store.get('en'),undefined);
});
test('a failed language download can be retried without losing the current language',async()=>{
 let fails=true;const store=createLocaleStore(async path=>{if(path===localeCatalog.ta&&fails)throw Error('offline');return Response.json(path===localeCatalog.ta?dictionaries.ta:dictionaries.en);});
 await store.load('en');await assert.rejects(store.load('ta'));assert.equal(store.get('en').homeTitle,dictionaries.en.homeTitle);fails=false;await store.load('ta');assert.equal(store.get('ta').homeTitle,dictionaries.ta.homeTitle);
});
test('unknown languages and malformed downloads are rejected without poisoning the cache',async()=>{
 let calls=0;const store=createLocaleStore(async()=>{calls++;return Response.json({homeTitle:17});});
 for(const code of ['xx','__proto__','constructor'])await assert.rejects(store.load(code));assert.equal(calls,0);
 await assert.rejects(store.load('en'));assert.equal(store.get('en'),undefined);
});
test('entry HTML gives a usable language choice before JavaScript and avoids all-language preloads',async()=>{
 const html=await readFile(new URL('../dist/index.html',import.meta.url),'utf8');
 for(const language of Object.keys(localeCatalog))assert.ok(html.includes(`href="/${language}" data-language="${language}"`));
 for(const file of ['virasat-copy.js','journey-copy.js','audio-copy.js','i18n.js'])assert.ok(!html.includes(file));
});
test('all regional entry pages show current text, preload only their own pack and expose no private values',async()=>{
 const config=JSON.parse(await readFile(new URL('../vercel.json',import.meta.url)));assert.equal(config.rewrites[0].destination,'/entry/:locale.html');
 for(const [language,path] of Object.entries(localeCatalog)){
  const html=await readFile(new URL(`../dist/entry/${language}.html`,import.meta.url),'utf8');assert.ok(html.includes(dictionaries[language].homeTitle));assert.ok(html.includes(sessionText(language,'homeIntro')));assert.ok(html.includes(`href="${path}" as="fetch"`));assert.equal((html.match(/as="fetch"/g)||[]).length,1);assert.ok(html.includes('aria-busy="true"'));assert.ok(!html.includes('input type="text"'));
 }
});
