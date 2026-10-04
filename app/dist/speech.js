import {dictionaryFor} from './locale.js';
import {audioCatalog} from './audio-catalog.js';

// Public dictionary matches only. Neither arbitrary text nor user entries can become a URL.
export const normalizeSpeech=text=>String(text).replace(/[↗→]/g,'').replace(/\s+/gu,' ').trim();
export function audioQueue(blocks,language,catalog=audioCatalog,dictionary=dictionaryFor(language)){
 const release=catalog[language];
 if(!release||!dictionary)return [];
 const keys=new Map(release.keys.filter(key=>Object.hasOwn(dictionary,key)).map(key=>[normalizeSpeech(dictionary[key]),key]));
 return blocks.map(block=>{
  const key=keys.get(normalizeSpeech(block.text));
  if(!key||!release.keys.includes(key))return null;
  return {text:dictionary[key],source:block.source??null,url:`/audio/${language}/${release.revision}/${key}.mp3`};
 }).filter(Boolean);
}
export function createReader({createAudio=()=>new Audio(),catalog=audioCatalog,getDictionary=dictionaryFor,onChange=()=>{},timeoutMs=20000}={}){
 let audio=null,queue=[],index=0,token=0,attempt=0,state='idle',rate=.9,timer=null,lastProgress=0;
 const update=(next,error='')=>{state=next;onChange({state,index,total:queue.length,text:queue[index]?.text||'',source:queue[index]?.source??null,error});};
 const clearTimer=()=>{clearTimeout(timer);timer=null;};
 const detach=()=>{clearTimer();if(audio){audio.onended=audio.onerror=audio.onwaiting=audio.onplaying=audio.ontimeupdate=null;audio.pause();}};
 const cancel=()=>{token++;attempt++;detach();};
 const stop=()=>{cancel();if(audio){audio.removeAttribute('src');audio.load();}queue=[];index=0;update('idle');};
 const fail=(session,error)=>{if(session!==token||state==='paused')return;detach();update(error?.name==='NotAllowedError'?'blocked':'error',error?.name||'network');};
 const loading=session=>{if(session!==token||state==='paused')return;update('loading');clearTimer();timer=setTimeout(()=>fail(session,{name:'TimeoutError'}),timeoutMs);};
 function playCurrent(){
  const session=++token;detach();
  // Explicit next/repeat/retry actions start a new clip even after a pause.
  state='idle';
  if(index>=queue.length){update('finished');return;}
  try{
   audio??=createAudio();audio.preload='none';audio.playbackRate=rate;audio.preservesPitch=true;
   audio.onended=()=>{if(session!==token||state==='paused')return;clearTimer();index++;playCurrent();};
   audio.onerror=()=>fail(session,{name:'MediaError'});
   audio.onwaiting=()=>loading(session);
   lastProgress=0;
   audio.ontimeupdate=()=>{if(session!==token||state==='paused')return;const position=Number(audio.currentTime)||0;if(position>lastProgress){lastProgress=position;clearTimer();if(state==='loading')update('playing');}};
   audio.onplaying=()=>{if(session!==token||state==='paused')return;clearTimer();update('playing');};
   audio.src=queue[index].url;loading(session);
   // Called directly from the user's click. Reuse one element across the queue on mobile.
   const playId=++attempt,started=audio.play();started?.catch(error=>{if(playId===attempt)fail(session,error);});
  }catch(error){fail(session,error);}
 }
 function move(offset){if(!queue.length)return;index=Math.max(0,Math.min(queue.length-1,index+offset));playCurrent();}
 return {
  stop,
  start(blocks,options={}){
   stop();rate=[.75,.9,1.05].includes(options.rate)?options.rate:.9;
   queue=audioQueue(Array.isArray(blocks)?blocks:[{text:blocks}],options.language||'en',catalog,getDictionary(options.language||'en'));
   if(!queue.length){update('unavailable');return false;}playCurrent();return true;
  },
  pause(){if(['playing','loading'].includes(state)){attempt++;clearTimer();audio.pause();update('paused');}},
  resume(){if(state==='paused'){const session=token;update('loading');loading(session);try{const playId=++attempt;audio.play()?.catch(error=>{if(playId===attempt)fail(session,error);});}catch(error){fail(session,error);}}else if(['error','blocked'].includes(state))playCurrent();},
  retry(){if(queue.length)playCurrent();},previous(){move(-1);},repeat(){move(0);},next(){move(1);},
  get state(){return state;}
 };
}
