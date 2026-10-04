// Fixed public guidance only. No search request, document upload or external service.
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const SUPPORT_SOURCES=Object.freeze({reviewedOn:'2026-10-04',safety:'https://investor.sebi.gov.in/securities-dos_and_donts.html',ipo:'https://investor.sebi.gov.in/ipo_through_asba.html',cyber:'https://cybercrime.gov.in/',scores:'https://scores.sebi.gov.in/',bank:'https://www.rbi.org.in/commonperson/English/Scripts/FAQs.aspx?Id=3407',iepf:'https://www.iepf.gov.in/',mitra:'https://app.mfcentral.com/links/mitra',udgam:'https://udgam.rbi.org.in/'});
export const SUPPORT_MODES=['protect','unclaimed','complaint','inventory'];
export function createSupport(){
 let mode='inventory',kind='',offer='',practice='',tracing='';
 const reset=()=>{mode='inventory';kind='';offer='';practice='';tracing='';};
 function start(next,initialKind=''){reset();if(SUPPORT_MODES.includes(next))mode=next;if(mode==='unclaimed'&&['bank','shares','mf','unknown'].includes(initialKind))kind=initialKind;}
 function handle(target){const el=target?.closest?.('[data-support-action]');if(!el)return false;const {supportAction:action,supportValue:value}=el.dataset;
  if(action==='back'){kind='';offer='';practice='';tracing='';return true;}
  if(action==='trace'&&['found','not-found','unable'].includes(value)){tracing=value;return true;}
  if(action==='kind'&&['bank','demat','shares','mf','unknown'].includes(value)){kind=value;return true;}
  if(action==='offer'&&['tips','scheme','paid'].includes(value)){offer=value;practice='';return true;}
  if(action==='practice'&&['pause','pay'].includes(value)){practice=value;return true;}
  return false;
 }
 function render(t){
  const p=key=>`<p data-speak>${escape(t(key))}</p>`,h=key=>`<h2 data-speak>${escape(t(key))}</h2>`;
  const b=(action,value,key,selected)=>`<button type="button" class="secondary" data-support-action="${action}" data-support-value="${value}" aria-pressed="${selected===value}" data-speak>${escape(t(key))}</button>`.replace(action==='back'?/ aria-pressed="[^"]*"/:/$^/,'');
  const link=(key,url)=>`<p><a data-speak href="${url}" target="_blank" rel="noopener noreferrer">${escape(t(key))}</a></p>`;
  const more=(key,body)=>`<details><summary data-speak>${escape(t(key))}</summary><div class="detail-body">${body}</div></details>`;
  const choices=mode==='unclaimed'?[['bank','bank'],['shares','oldSharesKind'],['mf','mf'],['unknown','unknown']]:[['bank','bank'],['demat','demat'],['mf','mf'],['unknown','unknown']];
  const kinds=()=>kind?`<div class="support-choice"><p data-speak>${escape(t(choices.find(([v])=>v===kind)?.[1]||'unknown'))}</p>${b('back','','back','')}</div>`:h('kindQuestion')+`<div class="coach-options">${choices.map(([v,k])=>b('kind',v,k,kind)).join('')}</div>`;
  const question=key=>`<h3 data-speak>${escape(t('plainQuestion'))}</h3><blockquote data-speak>${escape(t(key))}</blockquote>`;
  let body='';
  if(mode==='protect'){
   if(!offer)body=h('offerQuestion')+`<div class="coach-options">${[['tips','tipsOffer'],['scheme','schemeOffer'],['paid','paidOffer']].map(([v,k])=>b('offer',v,k,offer)).join('')}</div>`+p('riskUnknown');
   else body=`<div class="support-choice">${b('back','','back','')}</div>`+p(offer==='tips'?'tipsHelp':offer==='scheme'?'schemeHelp':'fraudHelp')+(offer==='paid'?p('plainPrivacy')+link('officialCyber',SUPPORT_SOURCES.cyber):p('riskUnknown')+more('plainMoreDetails',(offer==='scheme'?p('ipoHelp')+link('officialIPO',SUPPORT_SOURCES.ipo):'')+link('officialSafety',SUPPORT_SOURCES.safety))+`<details ${practice?'open':''}><summary data-speak>${escape(t('plainPersonExample'))}</summary><fieldset><legend data-speak>${escape(t('riskPractice'))}</legend><div class="coach-options">${b('practice','pause','riskPause',practice)}${b('practice','pay','riskPay',practice)}</div>${practice?`<p role="status" data-speak>${escape(t(practice==='pause'?'riskCorrect':'riskIncorrect'))}</p>`:''}</fieldset></details>`);
  }
  if(mode==='unclaimed')body=(!kind?p('oldHoldingHelp'):'')+kinds()+(kind?(p(kind==='bank'?'oldBankHelp':kind==='mf'?'oldMFHelp':['demat','shares'].includes(kind)?'oldSharesHelp':'oldHoldingHelp')+question('plainOldAsk')+more('plainMoreDetails',kind==='bank'?link('openUDGAM',SUPPORT_SOURCES.udgam):kind==='mf'?link('officialMITRA',SUPPORT_SOURCES.mitra):['demat','shares'].includes(kind)?link('officialIEPF',SUPPORT_SOURCES.iepf)+p('iepfLimit'):'')+more('plainWords',p('plainDematMeaning')+p('plainFolioMeaning'))+p('tracingInputs')+more('tracingReturn',`<div class="coach-options">${[['found','tracingFound'],['not-found','tracingNotFound'],['unable','tracingUnable']].map(([v,k])=>b('trace',v,k,tracing)).join('')}</div>${tracing?p(tracing==='found'?'tracingNext':'tracingInputs'):''}`)):'');
  if(mode==='complaint')body=kinds()+(kind?p('complaintHelp')+question('plainComplaintAsk')+more('plainMoreDetails',(kind==='bank'?p('bankComplaintHelp')+link('officialRBI',SUPPORT_SOURCES.bank):['demat','mf'].includes(kind)?p('securitiesHelp')+link('officialSCORES',SUPPORT_SOURCES.scores):p('unknownComplaintHelp')+link('officialCyber',SUPPORT_SOURCES.cyber))+p('complaintSteps')):'');
  if(mode==='inventory')body=p('inventoryHelp')+more('plainWords',p('plainDematMeaning')+p('plainFolioMeaning'));
  return `<section class="support-guide"><div class="coach-content" tabindex="-1">${body}</div>${p('plainNotSent')}${more('source',p('supportBoundary')+p('sourceReviewed'))}</section>`;
 }
 function snapshot(){return {mode,kind,offer,practice,tracing};}
 function restore(value){start(value?.mode);if(!value)return;kind=['bank','demat','shares','mf','unknown'].includes(value.kind)?value.kind:'';offer=['tips','scheme','paid'].includes(value.offer)?value.offer:'';practice=['pause','pay'].includes(value.practice)?value.practice:'';tracing=['found','not-found','unable'].includes(value.tracing)?value.tracing:'';}
 return {start,reset,handle,render,snapshot,restore};
}
export const FOLLOWUP_KINDS=['contact','correction','resubmit','escalate','response','resolved','entity-atr','body-atr','first-review','second-review','closed'];
export const followupLabel=kind=>({contact:'eventContact',correction:'eventCorrection',resubmit:'eventResubmit',escalate:'eventEscalate',response:'eventResponse',resolved:'eventResolved','entity-atr':'eventEntityATR','body-atr':'eventBodyATR','first-review':'eventFirstReview','second-review':'eventSecondReview',closed:'eventClosed'})[kind];
export function annualReviewDate(on){const [year,month,day]=on.split('-').map(Number),lastDay=new Date(Date.UTC(year+1,month,0)).getUTCDate();return `${year+1}-${String(month).padStart(2,'0')}-${String(Math.min(day,lastDay)).padStart(2,'0')}`;}
