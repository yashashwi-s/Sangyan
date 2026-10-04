import {nativeRetry} from './locale-retry.js';
import {localeCatalog} from './locale-catalog.js';
import {languageInfo} from './languages.js';
export const languages=languageInfo.filter(([code])=>Object.hasOwn(localeCatalog,code));
// These small messages remain usable when the chosen dictionary has not arrived.
export const loadingText={en:'Opening…',hi:'खुल रहा है…',bn:'খুলছে…',mr:'उघडत आहे…',ta:'திறக்கிறது…',ur:'کھل رہا ہے…'};
export const retryText={...nativeRetry,en:'Could not load. Choose your language to try again.',hi:'खुल नहीं सका। फिर कोशिश करने के लिए अपनी भाषा चुनें।',bn:'খোলা যায়নি। আবার চেষ্টা করতে আপনার ভাষা বেছে নিন।',mr:'उघडले नाही. पुन्हा प्रयत्न करण्यासाठी तुमची भाषा निवडा.',ta:'திறக்க முடியவில்லை. மீண்டும் முயற்சிக்க உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்.',ur:'کھل نہیں سکا۔ دوبارہ کوشش کے لیے اپنی زبان منتخب کریں۔'};
export function createLocaleStore(fetcher=(...args)=>fetch(...args),{retryDelays=[1000,2000],sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms))}={}){
 const loaded=new Map(),pending=new Map();
 return {
  get:language=>loaded.get(language),
  async load(language){
   if(!Object.prototype.hasOwnProperty.call(localeCatalog,language))throw Error('Unknown language');
   if(loaded.has(language))return loaded.get(language);
   if(!pending.has(language))pending.set(language,(async()=>{
    const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),20000);
    try{
    let response;
    for(let attempt=0;attempt<=retryDelays.length;attempt++){
     if(controller.signal.aborted)throw Error('Language unavailable');
     try{response=await fetcher(localeCatalog[language],{credentials:'same-origin',signal:controller.signal});}
     catch(error){if(controller.signal.aborted||attempt===retryDelays.length)throw error;await sleep(retryDelays[attempt]);continue;}
     if(response.ok)break;
     if(![408,429].includes(response.status)&&response.status<500||attempt===retryDelays.length)throw Error('Language unavailable');
     await sleep(retryDelays[attempt]);
    }
    const dictionary=await response.json();
    if(!dictionary||typeof dictionary.homeTitle!=='string'||Object.values(dictionary).some(value=>typeof value!=='string'))throw Error('Invalid language');
    loaded.set(language,dictionary);return dictionary;
    }finally{clearTimeout(timeout);}
   })().finally(()=>pending.delete(language)));
   return pending.get(language);
  }
 };
}
const store=createLocaleStore();
export const loadLanguage=language=>store.load(language);
export const dictionaryFor=language=>store.get(language);
export const translate=(language,key)=>store.get(language)?.[key]??key;
export function keepLanguageOffline(language){
 if('serviceWorker' in navigator)navigator.serviceWorker.ready.then(reg=>reg.active?.postMessage({type:'cache-language',language})).catch(()=>{});
}
