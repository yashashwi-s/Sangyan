import {createNominationCoach} from '../dist/nomination-coach.js';
import {emptyAccount,emptyTracker,saveWorkspace} from '../dist/tracker.js';
// Entirely fictional records; exercise the supported maximum and retained edit state.
export function scaleWorkspace(){
 const accounts=Array.from({length:50},(_,i)=>({...emptyAccount(),id:`synthetic-${i}`,type:i%3===0?'demat':i%3===1?'bank':'mf',institution:`Synthetic Institution ${i}`,label:`Fictional account ${i}`,owner:`Synthetic owner ${i}`,nomineeNote:`Synthetic nominee ${i}`,nominees:['Fictional person A','Fictional person B'],last4:String(i).padStart(4,'0'),recordNote:'Synthetic private note — कोई वास्तविक जानकारी नहीं',recordLocation:'Synthetic folder',supportCase:{issue:'Synthetic issue. '.repeat(11).slice(0,160),request:'Synthetic fix. '.repeat(11).slice(0,160),field:'Synthetic field. '.repeat(30).slice(0,320),reason:'Synthetic reason. '.repeat(30).slice(0,320),supplied:'Synthetic evidence. '.repeat(30).slice(0,320),next:'Synthetic action. '.repeat(30).slice(0,320)},supportEvents:Array.from({length:20},()=>({kind:'correction',on:'2026-10-01',note:'Synthetic private issue. '.repeat(6),location:'Synthetic private location. '.repeat(5)})),events:Array.from({length:20},()=>({kind:'unknown',on:'2026-10-01'}))}));
 const tracker={...emptyTracker(),synthetic:true,accounts};
 const draft={...emptyAccount(),id:'synthetic-draft',type:'bank',institution:'Unfinished synthetic institution',owner:'अधूरा मसौदा',nomination:'unknown'};
 const editor={view:'confirm',mode:'edit',step:0,account:{...accounts[0],last4:'12',confirmationOn:'',recordKind:'statement',_dateParts:{confirmationOn:{year:'20',month:'1',day:''}}}};
 const coach=createNominationCoach();for(const a of accounts)coach.render(a);
 return saveWorkspace(tracker,{account:{...draft,_contextStep:1},step:2},editor,'ur',undefined,coach.snapshot(accounts));
}
