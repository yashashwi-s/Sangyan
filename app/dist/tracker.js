import {validateCoachCheckpoint} from './nomination-coach.js';
import {isKnownLanguage} from './languages.js';
import {institutionById,matchInstitution} from './institutions.js';
import {FOLLOWUP_KINDS} from './resilience.js';
import {intendedDetailsChecked} from './complaint-review.js';
export const SOURCES=Object.freeze({reviewedOn:'2026-10-03',sebi:'https://www.sebi.gov.in/sebi_data/attachdocs/jun-2026/1780397706130.pdf',bank:'https://thc.nic.in/Central%20Governmental%20Rules/Banking%20Companies%20(Nomination)%20Rules,%202025.pdf',mf:'https://www.amfiindia.com/investor/become-mf-distributor?zoneName=nomination',hdfc:'https://www.hdfc.bank.in/need-help/net-banking-faqs',zerodha:'https://support.zerodha.com/category/your-zerodha-account/nomination-process/articles/add-nominee-online-zerodha',hdfcmf:'https://www.hdfcfund.com/services/registration-of-nominee',cams:'https://www.camsonline.com/Investors/Service-requests/Nomination/Nomination_Opt-in_or_Opt-out'});
export const TYPES=['demat','bank','mf'];
export const NOMINATION=['registered','missing','unknown','change','optout'];
export const REVIEW=['reported','submitted','confirmed','blocked'];
// Decimal digits used by the released scripts; saved dates/last-four values stay ASCII.
// Preserve other characters so validation, rather than coercion, decides whether they are valid.
const decimalZeros=[0x0660,0x06f0,0x0966,0x09e6,0x0a66,0x0ae6,0x0b66,0x0be6,0x0c66,0x0ce6,0x0d66,0x1c50];
export function normaliseDigits(text){return text.replace(/\p{Nd}/gu,char=>{const point=char.codePointAt(0),zero=decimalZeros.find(start=>point>=start&&point<start+10);return zero===undefined?char:String(point-zero);});}
export function today(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
export function validDate(value,future=false){if(value==='')return true;if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;const date=new Date(value+'T00:00:00Z');return Number.isFinite(date.getTime())&&date.toISOString().slice(0,10)===value&&(future||value<=today());}
export function emptyTracker(){return {schema:3,product:'virasat',synthetic:false,accounts:[]};}
export function emptyAccount(){return {id:crypto.randomUUID(),type:'demat',institution:'',institutionId:'',linkedDematId:'',label:'',owner:'',nomineeNote:'',nominees:[],last4:'',holding:'unknown',product:'unknown',mfMode:'unknown',nomination:'unknown',review:'reported',checkedOn:'',submittedOn:'',confirmationOn:'',followupOn:'',familyReviewedOn:'',handoff:{find:false,next:false,access:false,on:''},supportEvents:[],supportCase:{issue:'',request:'',field:'',reason:'',supplied:'',next:''},recordKind:'',recordNote:'',recordLocation:'',evidenceScope:'status',evidenceLocation:'',intendedChecks:{account:false,names:false,other:false},confirmationChecked:false,events:[]};}
function text(value,max=80){if(typeof value!=='string'||value.length>max)throw new Error('invalidSave');return value.trim();}
export function validateAccount(value){
 const a=emptyAccount();if(typeof value?.id!=='string'||!/^[a-zA-Z0-9-]{1,64}$/.test(value.id))throw new Error('invalidSave');a.id=value.id;
 for(const [key,set] of [['type',TYPES],['nomination',NOMINATION],['review',REVIEW]]){if(!set.includes(value[key]))throw new Error('invalidSave');a[key]=value[key];}
 for(const key of ['institution','label','owner','nomineeNote','last4','recordNote'])a[key]=text(value[key],key==='recordNote'?160:80);
 for(const key of ['institutionId','linkedDematId','recordLocation'])a[key]=text(value[key]??'',key==='recordLocation'?160:80);
 for(const [key,values] of [['holding',['sole','joint','unknown']],['product',['savings','deposit','unknown']],['mfMode',['folio','demat','unknown']],['evidenceScope',['status','details']]]){a[key]=value[key]??a[key];if(!values.includes(a[key]))throw new Error('invalidSave');}
 if(a.linkedDematId&&(!/^[a-zA-Z0-9-]{1,64}$/.test(a.linkedDematId)||a.type!=='mf'||a.mfMode!=='demat'||a.linkedDematId===a.id))throw new Error('invalidSave');
 if(a.institutionId){const institution=institutionById(a.institutionId);if(!institution||institution.type!==a.type||a.institution!==institution.name)throw new Error('invalidSave');}
 else {const matched=matchInstitution(a.type,a.institution);if(matched){a.institutionId=matched.id;a.institution=matched.name;}}
 if(!a.institution||!/^\d{0,4}$/.test(a.last4)||a.last4.length>0&&a.last4.length!==4)throw new Error('invalidAccount');
 for(const key of ['checkedOn','submittedOn','confirmationOn']){if(typeof value[key]!=='string'||!validDate(value[key]))throw new Error('invalidDate');a[key]=value[key];}
 a.followupOn=value.followupOn??'';if(typeof a.followupOn!=='string'||!validDate(a.followupOn,true))throw new Error('invalidDate');
 a.familyReviewedOn=value.familyReviewedOn??'';if(typeof a.familyReviewedOn!=='string'||!validDate(a.familyReviewedOn))throw new Error('invalidDate');
 const handoff=value.handoff??a.handoff;
 if(!handoff||typeof handoff!=='object'||['find','next','access'].some(k=>typeof handoff[k]!=='boolean')||typeof handoff.on!=='string'||!validDate(handoff.on))throw new Error('invalidSave');
 a.handoff={find:handoff.find,next:handoff.next,access:handoff.access,on:handoff.on};
 if(!a.familyReviewedOn||!a.handoff.find||!a.handoff.next||!a.handoff.access)a.handoff.on='';
 const supportCase=value.supportCase??{issue:'',request:''};
 if(!supportCase||typeof supportCase!=='object')throw new Error('invalidSave');
 a.supportCase=Object.fromEntries(['issue','request','field','reason','supplied','next'].map(k=>[k,text(supportCase[k]??'',k==='issue'||k==='request'?160:320)]));
 a.evidenceLocation=text(value.evidenceLocation??'',160);
 const checks=value.intendedChecks??{account:false,names:false,other:false};
 if(!checks||['account','names','other'].some(k=>typeof checks[k]!=='boolean'))throw new Error('invalidSave');
 a.intendedChecks={account:checks.account,names:checks.names,other:checks.other};
 // Legacy details assertions remain readable but are downgraded until separately checked.
 if(a.evidenceScope==='details'&&!intendedDetailsChecked(a))a.evidenceScope='status';
 const supportEvents=value.supportEvents??[];
 if(!Array.isArray(supportEvents)||supportEvents.length>20)throw new Error('invalidSave');
 a.supportEvents=supportEvents.map(e=>{if(!FOLLOWUP_KINDS.includes(e?.kind)||typeof e.on!=='string'||!e.on||!validDate(e.on))throw new Error('invalidSave');return {kind:e.kind,on:e.on,note:text(e.note??'',160),location:text(e.location??'',160)};});
 const nominees=value.nominees??[];if(!Array.isArray(nominees)||nominees.length>(a.type==='bank'?4:3))throw new Error('invalidSave');a.nominees=nominees.map(n=>text(n)).filter(Boolean);
 if(!['','statement','registration'].includes(value.recordKind)||typeof value.confirmationChecked!=='boolean')throw new Error('invalidSave');a.recordKind=value.recordKind;a.confirmationChecked=value.confirmationChecked;
 if(a.review==='submitted'&&!a.submittedOn)throw new Error('submissionRequired');
 if(a.review==='confirmed'&&(a.nomination!=='registered'||!a.confirmationOn||!a.recordKind||!a.confirmationChecked))throw new Error('confirmationRequired');
 if(a.review==='confirmed'&&a.submittedOn&&a.confirmationOn<a.submittedOn)throw new Error('invalidDate');
 if(a.review!=='confirmed'){a.intendedChecks={account:false,names:false,other:false};a.evidenceLocation='';a.confirmationOn='';a.recordKind='';a.confirmationChecked=false;a.evidenceScope='status';}
 if(a.review==='reported')a.submittedOn='';
 if(!Array.isArray(value.events??[])||(value.events??[]).length>20)throw new Error('invalidSave');
 a.events=(value.events??[]).map(e=>{if(!['missing','unknown','change','optout','submitted','confirmed','blocked','recheck','linked'].includes(e.kind)||!e.on||!validDate(e.on))throw new Error('invalidSave');return {kind:e.kind,on:e.on};});
 return a;
}
export function validateTracker(value){if(![2,3].includes(value?.schema)||value.product!=='virasat'||typeof value.synthetic!=='boolean'||!Array.isArray(value.accounts)||value.accounts.length>50)throw new Error('invalidSave');const accounts=value.accounts.map(validateAccount);if(new Set(accounts.map(a=>a.id)).size!==accounts.length)throw new Error('invalidSave');for(const a of accounts)if(a.linkedDematId&&!accounts.some(d=>d.id===a.linkedDematId&&d.type==='demat'))throw new Error('invalidSave');return {schema:3,product:'virasat',synthetic:value.synthetic,accounts};}
export function attention(a){return a.linkedDematId?'linked':a.review==='blocked'?'blocked':a.review==='submitted'?'awaiting':a.review==='confirmed'?'confirmed':a.nomination==='missing'?'missing':a.nomination==='unknown'?'unknown':a.nomination==='change'?'change':a.nomination==='optout'?'optout':'review';}
export function orderedAccounts(accounts){const priorities={blocked:0,change:1,missing:2,unknown:3,awaiting:4,review:5,optout:6,confirmed:7,linked:8};return [...accounts].sort((a,b)=>Number(Boolean(b.followupOn&&b.followupOn<=today()))-Number(Boolean(a.followupOn&&a.followupOn<=today()))||priorities[attention(a)]-priorities[attention(b)]);}
export function counts(c){const result={total:c.accounts.length};for(const state of ['missing','unknown','awaiting','confirmed','change','blocked','review','optout','linked'])result[state]=c.accounts.filter(a=>attention(a)===state).length;return result;}
export function transition(account,kind,fields={}){
 const a={...account,...fields,events:[...(account.events||[]),{kind,on:today()}].slice(-20)};
 if(['missing','unknown','change','optout','recheck'].includes(kind)){a.nomination=kind==='recheck'?'unknown':kind;a.review='reported';a.confirmationChecked=false;a.recordKind='';a.confirmationOn='';a.submittedOn='';a.recordNote='';a.evidenceLocation='';a.intendedChecks={account:false,names:false,other:false};a.familyReviewedOn='';a.handoff={find:false,next:false,access:false,on:''};a.checkedOn=kind==='recheck'?'':today();}
 if(kind==='submitted')a.review='submitted';
 if(kind==='blocked')a.review='blocked';
 if(kind==='confirmed'){a.review='confirmed';a.nomination='registered';a.checkedOn=today();a.followupOn='';}
 return validateAccount(a);
}
export function validateDraft(value){
 if(!value||typeof value!=='object')throw new Error('invalidSave');
 if(!TYPES.includes(value.type)&&value.type!=='')throw new Error('invalidSave');const type=value.type||'demat';
 const checked=validateAccount({...emptyAccount(),...value,type,institution:value.institution||'Draft',review:'reported',nomination:NOMINATION.includes(value.nomination)?value.nomination:'unknown',submittedOn:'',confirmationOn:'',recordKind:'',confirmationChecked:false});
 checked._contextStep=value._contextStep??0;if(!Number.isInteger(checked._contextStep)||checked._contextStep<0||checked._contextStep>2)throw Error('invalidSave');
 checked.type=value.type===''?'':type;checked.institution=value.institution||'';return checked;
}
export function workspaceSnapshot(tracker,draft=null,step=0,language='en'){return {format:'virasat-workspace',version:1,tracker:validateTracker(tracker),draft:draft?validateDraft(draft):null,step:Math.max(0,Math.min(3,step)),language};}
export function readWorkspace(value){
 if(value?.format!=='virasat-workspace')return {tracker:validateTracker(value),draft:null,step:0,language:null};
 if(value.version!==1||!Number.isInteger(value.step)||value.step<0||value.step>3||!isKnownLanguage(value.language))throw new Error('invalidSave');
 return {tracker:validateTracker(value.tracker),draft:value.draft?validateDraft(value.draft):null,step:value.step,language:value.language};
}
export function sampleTracker(){const c=emptyTracker();c.synthetic=true;c.accounts=[{...emptyAccount(),id:'demo-bank',type:'bank',institution:'HDFC Bank',institutionId:'hdfc-bank',holding:'sole',product:'savings',owner:'@parent',nomination:'unknown'},{...emptyAccount(),id:'demo-demat',type:'demat',institution:'Zerodha',institutionId:'zerodha',holding:'sole',owner:'@me',nomination:'missing'},{...emptyAccount(),id:'demo-mf',type:'mf',institution:'HDFC Mutual Fund',institutionId:'hdfc-mf',holding:'sole',mfMode:'folio',owner:'@parent',nomination:'registered'}];return c;}
export function familySummary(c){return {format:'virasat-family-summary',version:2,synthetic:c.synthetic,generatedAt:new Date().toISOString(),accounts:c.accounts.map(({id,recordNote,events,supportEvents,supportCase,evidenceLocation,intendedChecks,confirmationChecked,...a})=>({...a,evidenceBasis:a.review==='confirmed'?'User reports reviewing an institution record showing registration':a.review==='submitted'?'User reports sending a request; registration not confirmed':'User report only'})),sources:SOURCES,limitations:['This family planning record is not an institutional register.','Registration status and nominee details checked are separate observations.','No account discovery, automatic verification, submission or succession determination.']};}

// Uncommitted form fields are saved separately from the account record. They
// must go through the normal form validation before they can change its status.
export function validateEditor(value){
 if(!value||!['form','family','confirm','submit','followup','support-record'].includes(value.view)||!['new','edit'].includes(value.mode))throw new Error('invalidSave');
 if(!Number.isInteger(value.step)||value.step<0||value.step>3)throw new Error('invalidSave');
 const raw=value.account;if(!raw||typeof raw!=='object')throw new Error('invalidSave');
 const a=validateDraft({...raw,last4:'',followupOn:validDate(raw.followupOn||'',true)?raw.followupOn||'':''});a.review=REVIEW.includes(raw.review)?raw.review:'reported';a.last4=text(raw.last4??'',4);
 a.recordKind=['','statement','registration'].includes(raw.recordKind)?raw.recordKind:'';
 a.confirmationChecked=raw.confirmationChecked===true;
 a.confirmationOn=text(raw.confirmationOn??'',10);a.submittedOn=text(raw.submittedOn??'',10);
 a.evidenceScope=raw.evidenceScope==='details'?'details':'status';a.evidenceLocation=text(raw.evidenceLocation??'',160);
 const intended=raw.intendedChecks??{account:false,names:false,other:false};if(['account','names','other'].some(k=>typeof intended[k]!=='boolean'))throw Error('invalidSave');a.intendedChecks={...intended};
 a._dateParts={};for(const key of ['submittedOn','confirmationOn','followupOn','supportOn']){if(raw._dateParts?.[key]){const parts=raw._dateParts[key];a._dateParts[key]={};for(const part of ['year','month','day']){const v=text(parts[part]??'',part==='year'?4:2);if(!/^\d*$/.test(v))throw new Error('invalidSave');a._dateParts[key][part]=v;}}}
 if(raw._support){const s=raw._support;if(!FOLLOWUP_KINDS.includes(s.kind)&&s.kind!=='')throw new Error('invalidSave');a._support={kind:s.kind,on:text(s.on??'',10),note:text(s.note??'',160),location:text(s.location??'',160)};}
 return {view:value.view,mode:value.mode,step:value.step,account:a};
}
function validateLinkDraft(sourceId,data){if(!sourceId)return '';if(typeof sourceId!=='string'||!data.draft||data.draft.type!=='demat'||!data.tracker.accounts.some(a=>a.id===sourceId&&a.type==='mf'&&a.mfMode==='demat'&&!a.linkedDematId))throw new Error('invalidSave');return sourceId;}
export function saveWorkspace(tracker,unfinished,pending,language,savedOn=today(),learning=[]){if(typeof savedOn!=='string'||!savedOn||!validDate(savedOn))throw new Error('invalidDate');const data=workspaceSnapshot(tracker,unfinished?.account||null,unfinished?.step||0,language);return {...data,version:2,savedOn,learning:validateCoachCheckpoint(learning,data.tracker.accounts),editor:pending?validateEditor(pending):null,linkFrom:validateLinkDraft(unfinished?.sourceId,data)};}
export function restoreWorkspace(value){if(value?.version!==2||value?.format!=='virasat-workspace')return {...readWorkspace(value),learning:[],editor:null,linkFrom:''};const savedOn=value.savedOn??'';if(typeof savedOn!=='string'||!validDate(savedOn))throw new Error('invalidDate');const data=readWorkspace({...value,version:1});const editor=value.editor?validateEditor(value.editor):null;if(editor&&!(editor.view==='form'&&editor.mode==='new')&&!data.tracker.accounts.some(a=>a.id===editor.account.id))throw new Error('invalidSave');return {...data,savedOn,learning:validateCoachCheckpoint(value.learning??[],data.tracker.accounts),editor,linkFrom:validateLinkDraft(value.linkFrom,data)};}
