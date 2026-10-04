// Reminder arithmetic only; the official portal determines eligibility and acceptance.
export const REVIEW_EVENTS=['entity-atr','body-atr','first-review','second-review','closed'];
export function reviewReminder(account,asOf){
 if(!['demat','mf'].includes(account.type))return null;
 const events=account.supportEvents||[];
 const latest=events.filter(e=>REVIEW_EVENTS.includes(e.kind)).map((e,i)=>({...e,i})).sort((a,b)=>a.on.localeCompare(b.on)||a.i-b.i).at(-1);
 if(!latest)return {state:'unknown'};
 if(latest.kind==='closed')return {state:'closed'};
 if(['first-review','second-review'].includes(latest.kind))return {state:'waiting'};
 if(!/^\d{4}-\d{2}-\d{2}$/.test(latest.on))return {state:'unknown'};
 const date=new Date(latest.on+'T12:00:00Z');
 if(!Number.isFinite(date.getTime())||date.toISOString().slice(0,10)!==latest.on)return {state:'unknown'};
 date.setUTCDate(date.getUTCDate()+15);
 const due=date.toISOString().slice(0,10);
 return {state:asOf>due?'expired':'available',stage:latest.kind==='entity-atr'?'first':'second',received:latest.on,due};
}
export const DETAIL_CHECKS=['account','names','other'];
export function intendedDetailsChecked(a){return DETAIL_CHECKS.every(k=>a.intendedChecks?.[k]===true);}
