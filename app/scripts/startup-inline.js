// Embedded with an exact CSP hash: recovery must work even if public modules fail.
(()=>{
 const key='virasat-startup-retries-v1',path=location.pathname;
 const untouched=()=>!performance.getEntriesByName('virasat-ready').length&&!document.querySelector('form')&&location.pathname===path;
 function start(){
  const script=document.createElement('script');script.type='module';script.src='/main.js';
  script.onload=()=>{try{sessionStorage.removeItem(key);}catch{}};
  script.onerror=()=>{
   if(!untouched())return;
   let attempts;
   try{const prior=JSON.parse(sessionStorage.getItem(key)||'null');attempts=prior?.path===path?prior.attempts:0;if(!Number.isInteger(attempts)||attempts<0||attempts>=2)return;sessionStorage.setItem(key,JSON.stringify({path,attempts:attempts+1}));}catch{return;}
   setTimeout(()=>{
    if(!untouched())return;
    // A connected radio does not prove the server is reachable. Probe only this
    // public asset before navigating, so a short outage keeps the native fallback.
    const recover=async()=>{try{const response=await fetch('/main.js',{cache:'no-store',signal:AbortSignal.timeout(8000)});if(!response.ok)throw Error('Public module unavailable');if(untouched())location.reload();}catch{if(untouched())script.onerror();}};
    if(navigator.onLine!==false){recover();return;}
    const online=()=>{clearTimeout(expiry);window.removeEventListener('online',online);if(untouched())recover();};
    const expiry=setTimeout(()=>window.removeEventListener('online',online),30000);
    window.addEventListener('online',online);
   },2000*(attempts+1));
  };
  document.head.append(script);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
