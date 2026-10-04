import {emptyAccount,emptyTracker,saveWorkspace} from '../dist/tracker.js';
// Entirely fictional records; exercise the supported maximum and retained edit state.
export function scaleWorkspace(){
 const accounts=Array.from({length:50},(_,i)=>({...emptyAccount(),id:`synthetic-${i}`,type:i%3===0?'demat':i%3===1?'bank':'mf',institution:`Synthetic Institution ${i}`,label:`Fictional account ${i}`,owner:`Synthetic owner ${i}`,nomineeNote:`Synthetic nominee ${i}`,nominees:['Fictional person A','Fictional person B'],last4:String(i).padStart(4,'0'),recordNote:'Synthetic private note — कोई वास्तविक जानकारी नहीं',recordLocation:'Synthetic folder',events:Array.from({length:20},()=>({kind:'unknown',on:'2026-10-01'}))}));
 const tracker={...emptyTracker(),synthetic:true,accounts};
 const draft={...emptyAccount(),id:'synthetic-draft',type:'bank',institution:'Unfinished synthetic institution',owner:'अधूरा मसौदा',nomination:'unknown'};
 const editor={view:'confirm',mode:'edit',step:0,account:{...accounts[0],last4:'12',confirmationOn:'',recordKind:'statement',_dateParts:{confirmationOn:{year:'20',month:'1',day:''}}}};
 return saveWorkspace(tracker,{account:draft,step:2},editor,'ur');
}
