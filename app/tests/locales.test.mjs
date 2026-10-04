import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {gzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {createLocaleStore} from '../dist/locale.js';
import {localeCatalog} from '../dist/locale-catalog.js';
import {dictionaries} from '../scripts/dictionaries.mjs';
test('each small language pack matches all current public copy and its immutable address',async()=>{
 for(const [language,path] of Object.entries(localeCatalog)){
  const data=await readFile(new URL('../dist'+path,import.meta.url));assert.deepEqual(JSON.parse(data),dictionaries[language]);
  assert.ok(path.includes(createHash('sha256').update(data).digest('hex').slice(0,12)));assert.ok(gzipSync(data).length<24000);
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
  const html=await readFile(new URL(`../dist/entry/${language}.html`,import.meta.url),'utf8');assert.ok(html.includes(dictionaries[language].homeTitle));assert.ok(html.includes(dictionaries[language].homeIntro));assert.ok(html.includes(`href="${path}" as="fetch"`));assert.equal((html.match(/as="fetch"/g)||[]).length,1);assert.ok(html.includes('aria-busy="true"'));assert.ok(html.includes(`class="startup-retry" href="/${language}"`));assert.ok(!html.includes('input type="text"'));
 }
});
test('the release contains exactly English plus 20 scheduled languages and excludes deferred languages',async()=>{
 const {languageInfo,isRTL,audioLanguages,isKnownLanguage}=await import('../dist/languages.js');
 const codes=languageInfo.map(([code])=>code);
 assert.equal(codes.length,21);assert.equal(new Set(codes).size,21);
 assert.deepEqual(codes.filter(code=>code!=='en').sort(),['as','bn','doi','gu','hi','kn','kok','mai','ml','mni','mr','ne','or','pa','sa','sat','sd','ta','te','ur'].sort());
 assert.ok(['sd','ur'].every(isRTL));assert.equal(isRTL('hi'),false);
 assert.equal(new Set(audioLanguages).size,audioLanguages.length);
 assert.ok(audioLanguages.every(code=>languageInfo.some(([language])=>language===code)));
 for(const language of ['en','hi','bn','mr','ta','ur'])assert.ok(audioLanguages.includes(language));
 assert.ok(['brx','ks'].every(code=>!isKnownLanguage(code)&&!Object.hasOwn(localeCatalog,code)));
 assert.deepEqual(Object.keys(localeCatalog).sort(),codes.slice().sort());
 const html=await readFile(new URL('../dist/index.html',import.meta.url),'utf8');
 assert.ok(!html.includes('href="/brx"')&&!html.includes('href="/ks"'));
});
test('saved work can restore every registered language without changing account content',async()=>{
 const {languageInfo}=await import('../dist/languages.js');
 const {workspaceSnapshot,readWorkspace,sampleTracker}=await import('../dist/tracker.js');
 for(const [code] of languageInfo){const original=workspaceSnapshot(sampleTracker(),null,0,code),restored=readWorkspace(original);assert.equal(restored.language,code);assert.deepEqual(restored.tracker,original.tracker);}
});
test('translation source snapshot stays aligned with current public English instructions',async()=>{
 const snapshot=JSON.parse(await readFile(new URL('../translations/en.json',import.meta.url),'utf8'));
 const {en}=await import('../dist/i18n.js');assert.deepEqual(snapshot,en);
});
test('local script-font files match their recorded source hashes and small download budgets',async()=>{
 const manifest=JSON.parse(await readFile(new URL('../dist/fonts/SOURCES.json',import.meta.url),'utf8'));
 for(const font of manifest.fonts){
  const data=await readFile(new URL('../dist/fonts/'+font.file,import.meta.url));
  assert.equal(data.length,font.bytes);assert.ok(data.length<10000);
  assert.equal(createHash('sha256').update(data).digest('hex'),font.sha256);
  const license=await readFile(new URL('../dist/fonts/'+font.licenceFile,import.meta.url),'utf8');
  assert.ok(license.includes('SIL OPEN FONT LICENSE'));
 }
});
test('every published language has a native retry label before its full pack loads',async()=>{
 const {nativeRetry}=await import('../dist/locale-retry.js');
 const {retryText}=await import('../dist/locale.js');
 for(const code of Object.keys(localeCatalog)){assert.equal(nativeRetry[code],dictionaries[code].audioRetry);assert.ok(retryText[code]);}
});
