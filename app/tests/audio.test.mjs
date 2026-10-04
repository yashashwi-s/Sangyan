import {test} from 'node:test';
import assert from 'node:assert/strict';
import {audioQueue,createReader} from '../dist/speech.js';
import {dictionaries} from '../scripts/dictionaries.mjs';
import {audioLanguages,languageInfo} from '../dist/languages.js';
const catalog=Object.fromEntries(audioLanguages.map(lang=>[lang,{revision:'012345abcdef',keys:Object.keys(dictionaries[lang])}]));
function setup(play=()=>Promise.resolve()){
 const events=[],audio={pause(){this.pauses=(this.pauses||0)+1;},load(){this.loads=(this.loads||0)+1;},removeAttribute(){this.src='';},play(){this.plays=(this.plays||0)+1;return play();}};
 const reader=createReader({createAudio:()=>audio,catalog,getDictionary:language=>dictionaries[language],onChange:e=>events.push(e)});
 return {audio,reader,events};
}
test('recorded instruction playback works for every advertised language without a speech synthesis API',()=>{
 assert.equal(globalThis.speechSynthesis,undefined);
 for(const lang of audioLanguages){
  const {reader,audio}=setup();assert.equal(reader.start(dictionaries[lang].homeTitle,{language:lang}),true);
  assert.equal(audio.src,`/audio/${lang}/012345abcdef/homeTitle.mp3`);assert.equal(reader.state,'loading');audio.onplaying();assert.equal(reader.state,'playing');reader.stop();
 }
});
test('private values and unknown languages never become audio URLs',()=>{
 const entries=[{text:'My account 123456789 password secret',source:1},{text:dictionaries.hi.homeIntro,source:2}];
 const queue=audioQueue(entries,'hi',catalog,dictionaries.hi);assert.equal(queue.length,1);assert.equal(queue[0].source,2);assert.ok(!queue[0].url.includes('123456789'));
 assert.deepEqual(audioQueue(entries,'xx',catalog),[]);
 for(const [language] of languageInfo)if(!audioLanguages.includes(language))assert.deepEqual(audioQueue([{text:dictionaries[language].homeTitle}],language,catalog,dictionaries[language]),[]);
 const {reader,audio}=setup();assert.equal(reader.start(entries[0].text),false);assert.equal(audio.src,undefined);
});
test('pausing while loading, resuming and replaying preserve the selected part',()=>{
 const {reader,audio,events}=setup();reader.start([{text:dictionaries.en.homeTitle,source:4},{text:dictionaries.en.homeIntro,source:9}]);
 reader.pause();assert.equal(reader.state,'paused');reader.resume();assert.equal(reader.state,'loading');audio.onplaying();assert.equal(reader.state,'playing');
 const stale=audio.onended;reader.next();assert.equal(events.at(-1).source,9);stale();assert.equal(events.at(-1).source,9);
 reader.repeat();assert.equal(events.at(-1).index,1);reader.previous();assert.equal(events.at(-1).index,0);reader.stop();assert.equal(audio.src,'');
});
test('a rejected mobile autoplay becomes an explicit continue action',async()=>{
 let first=true;const {reader,audio}=setup(()=>{if(first){first=false;return Promise.reject({name:'NotAllowedError'});}return Promise.resolve();});
 reader.start(dictionaries.en.homeTitle);await Promise.resolve();assert.equal(reader.state,'blocked');reader.resume();audio.onplaying();assert.equal(reader.state,'playing');reader.stop();
});
test('network errors keep the same part and retry its public file',()=>{
 const {reader,audio,events}=setup();reader.start([{text:dictionaries.en.homeTitle},{text:dictionaries.en.homeIntro}]);reader.next();const url=audio.src;
 audio.onerror();assert.equal(reader.state,'error');assert.equal(events.at(-1).index,1);const loads=audio.loads;reader.retry();assert.equal(audio.src,url);assert.equal(audio.loads,loads+1);audio.onplaying();assert.equal(reader.state,'playing');reader.stop();
});
test('stopping or changing language cancels late play failures and completions',async()=>{
 let reject;const {reader,audio}=setup(()=>new Promise((_,r)=>reject=r));reader.start(dictionaries.en.homeTitle);const stale=audio.onended,oldReject=reject;
 reader.start(dictionaries.ur.homeTitle,{language:'ur'});oldReject({name:'NetworkError'});stale();await Promise.resolve();assert.equal(reader.state,'loading');assert.ok(audio.src.includes('/ur/'));
 reader.stop();reject({name:'NetworkError'});await Promise.resolve();assert.equal(reader.state,'idle');
});
test('playback uses one audio element, preserves pitch and ends cleanly',()=>{
 const {reader,audio,events}=setup();reader.start([{text:dictionaries.en.homeTitle},{text:dictionaries.en.homeIntro}],{rate:.75});assert.equal(audio.playbackRate,.75);assert.equal(audio.preservesPitch,true);
 audio.onplaying();audio.onended();assert.equal(audio.plays,2);audio.onplaying();audio.onended();assert.equal(reader.state,'finished');assert.equal(events.at(-1).total,2);reader.stop();
});
test('slow connections stop waiting and expose retry instead of spinning forever',async()=>{
 const audio={pause(){},load(){},removeAttribute(){},play(){return new Promise(()=>{});}};
 const reader=createReader({createAudio:()=>audio,catalog,getDictionary:language=>dictionaries[language],timeoutMs:10});reader.start(dictionaries.en.homeTitle);
 await new Promise(r=>setTimeout(r,25));assert.equal(reader.state,'error');reader.stop();
});
test('a delayed play rejection caused by pause cannot overwrite a later resume',async()=>{
 const pending=[];const {reader,audio}=setup(()=>new Promise((_,reject)=>pending.push(reject)));
 reader.start(dictionaries.en.homeTitle);reader.pause();reader.resume();pending[0]({name:'AbortError'});await Promise.resolve();assert.equal(reader.state,'loading');audio.onplaying();assert.equal(reader.state,'playing');reader.stop();
});
test('a late media error cannot replace an intentional pause',()=>{
 const {reader,audio}=setup();reader.start(dictionaries.en.homeTitle);reader.pause();audio.onerror();assert.equal(reader.state,'paused');reader.resume();audio.onplaying();assert.equal(reader.state,'playing');reader.stop();
});
test('real playback progress clears a buffering timeout on constrained browsers',async()=>{
 const audio={currentTime:0,pause(){},load(){},removeAttribute(){},play(){return Promise.resolve();}};
 const reader=createReader({createAudio:()=>audio,catalog,getDictionary:language=>dictionaries[language],timeoutMs:15});
 reader.start(dictionaries.en.homeTitle);audio.currentTime=.5;audio.ontimeupdate();
 await new Promise(resolve=>setTimeout(resolve,30));assert.equal(reader.state,'playing');
 audio.onwaiting();await new Promise(resolve=>setTimeout(resolve,30));assert.equal(reader.state,'error');reader.stop();
});
test('next and repeat from pause start a new clip with an accurate playback state',()=>{
 const {reader,audio,events}=setup();reader.start([{text:dictionaries.en.homeTitle},{text:dictionaries.en.homeIntro}]);
 audio.onplaying();reader.pause();reader.next();assert.equal(reader.state,'loading');audio.onplaying();assert.equal(reader.state,'playing');assert.equal(events.at(-1).index,1);
 reader.pause();reader.repeat();assert.equal(reader.state,'loading');audio.onplaying();assert.equal(reader.state,'playing');assert.equal(events.at(-1).index,1);reader.stop();
});
