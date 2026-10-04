import {languages,translate,loadLanguage,keepLanguageOffline,loadingText,retryText} from './locale.js';
import {emptyTracker,emptyAccount,sampleTracker,validateAccount,attention,orderedAccounts,counts,transition,today,validDate,SOURCES} from './tracker.js';
import {searchInstitutions,matchInstitution,institutionById} from './institutions.js';
import {guideFor} from './guides.js';
import {createReader} from './speech.js';
import {sessionText,hasSessionText,clearLegacyRecords} from './session-policy.js';
import {createNominationCoach} from './nomination-coach.js';
import {createJourneyEntry} from './journey-entry.js';
const entry=createJourneyEntry();
const coach=createNominationCoach();
const legacyRemoved=clearLegacyRecords();

const $=selector=>document.querySelector(selector);
const main=$('main'),live=$('#live');
const codes=languages.map(([code])=>code);
const initialLanguage=location.pathname.replace(/\/$/,'').slice(1);
let lang=codes.includes(initialLanguage)?initialLanguage:'en',chosen=codes.includes(initialLanguage);
let current=emptyTracker(),view='home',selected='',draft=null,step=0,editorMode='new',dirty=false,generation=0;
let pendingDematSource='',pendingEditor=null,unfinished=null,shareNames=true,shareLocation=true;
let speechRate=.9,textLevel=100,dialogOrigin=null;
const preferencesKey='virasat-reading-settings-v1';
try{const p=JSON.parse(localStorage.getItem(preferencesKey)||'null');if(p){textLevel=[90,100,110,120,130,140,150,160,170,180,190,200].includes(p.textLevel)?p.textLevel:100;speechRate=[.75,.9,1.05].includes(p.speechRate)?p.speechRate:.9;for(const [key,cls] of [['contrast','high-contrast'],['motion','no-motion'],['spacing','more-spacing']])document.body.classList.toggle(cls,p[key]===true);document.documentElement.style.fontSize=textLevel+'%';}}catch{}
function rememberReading(){try{localStorage.setItem(preferencesKey,JSON.stringify({textLevel,speechRate,contrast:document.body.classList.contains('high-contrast'),motion:document.body.classList.contains('no-motion'),spacing:document.body.classList.contains('more-spacing')}));}catch{}}
const t=key=>sessionText(lang,key)??translate(lang,key);
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const copy=(key,tag='p',cls='')=>`<${tag} class="${cls}" ${hasSessionText(key)?'':'data-speak'}>${esc(t(key))}</${tag}>`;
const button=(id,key,cls='secondary',extra='')=>`<button type="button" id="${id}" class="${cls}" ${['found-yes','found-no','found-change','found-unknown','prepare','check-result','submit-request','confirm-record'].includes(id)?'data-speak':''} ${extra}>${key==='back'?'<span aria-hidden="true">‹</span> ':''}${esc(t(key))}${cls==='answer-button'?'<span class="answer-arrow" aria-hidden="true">→</span>':''}</button>`;
const number=n=>new Intl.NumberFormat(lang+'-IN').format(n);
const date=value=>value?new Intl.DateTimeFormat(lang+'-IN',{day:'numeric',month:'short',year:'numeric'}).format(new Date(value+'T12:00:00')):t('neverChecked');
const ownerText=value=>value?.startsWith('@')?t(value.slice(1)):value;
const account=()=>current.accounts.find(a=>a.id===selected);
const accountTitle=a=>a.label||a.institution;
const status=a=>`<span class="status-pill status-${attention(a)}">${esc(t(attention(a)))}</span>`;
const isDue=a=>Boolean(a.followupOn&&a.followupOn<=today()&&!a.linkedDematId);
const taskKey=a=>isDue(a)&&['confirmed','optout'].includes(attention(a))?'recheck':({missing:'prepare',unknown:'helpCheck',review:'helpCheck',change:'prepare',awaiting:'confirmTask',confirmed:a.familyReviewedOn?'summary':'familyRecord',blocked:'requestHelp',optout:'optout',linked:'useDemat'}[attention(a)]);
const icons={bank:'<path d="m3 9 9-5 9 5M4 20h16M6 11v6m6-6v6m6-6v6"/>',demat:'<path d="m3 7 9-4 9 4-9 4-9-4Zm0 5 9 4 9-4M3 17l9 4 9-4"/>',mf:'<path d="M12 3v9h9A9 9 0 0 0 12 3Z"/><path d="M8 4a9 9 0 1 0 12 12"/>',sound:'<path d="m11 5-6 4H2v6h3l6 4V5Zm4 3a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',arrow:'<path d="m9 5 7 7-7 7"/>',check:'<path d="m5 12 4 4 10-10"/>'};
const icon=name=>`<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${icons[name]||icons.arrow}</svg>`;
let speechScope=main;
const reader=createReader({onChange:state=>updateSpeech(state)});
function listenBar(prefix=''){return `<div class="listen-bar" data-no-print><button type="button" id="listen" class="listen-button">${icon('sound')}<span>${t('read')}</span></button><button type="button" id="speech-stop" class="text-button" hidden>${t('stop')}</button><span id="speech-status" class="micro" role="status" aria-live="polite"></span></div><div id="read-along" class="read-along" data-no-print hidden><p class="overline">${t('readingNow')} <span id="speech-position"></span></p><p id="speech-sentence"></p><div class="sentence-controls">${button('speech-previous','previousSentence','text-button')}${button('speech-repeat','repeatSentence','text-button')}${button('speech-next','nextSentence','text-button')}</div></div>`.replaceAll('id="','id="'+prefix);}
function heading(key,intro='',privateHeading=false){return `<div class="page-heading"><h1 ${privateHeading?'':'data-speak'}>${esc(privateHeading?key:t(key))}</h1>${intro?copy(intro):''}${listenBar()}</div>`;}
function details(key,body,id=''){return `<details ${id?`id="${id}"`:''}><summary data-speak><span>${t(key)}</span></summary><div class="detail-body">${body}</div></details>`;}
function saveNotice(){return `<div class="session-notice" role="note"><p>${esc(t('sessionShort'))}</p><details><summary>${esc(t('privacyHelp'))}</summary><p>${esc(t('sessionNotice'))}${legacyRemoved?' '+esc(t('legacyRemoved')):''}</p></details></div>`;}

function row(a){return `<button type="button" class="account-row" data-account="${a.id}" aria-label="${esc([accountTitle(a),ownerText(a.owner),t(attention(a))].filter(Boolean).join(', '))}"><span class="account-symbol">${icon(a.type)}</span><span class="account-row-main"><strong>${esc(accountTitle(a))}</strong><span>${[ownerText(a.owner),a.label?a.institution:'',t(a.type),a.last4?'•••• '+a.last4:''].filter(Boolean).map(esc).join(' · ')}</span><span class="row-task">${esc(t(taskKey(a)))}</span></span><span class="account-row-status">${status(a)}${a.followupOn?`<span class="review-due">${a.followupOn<=today()?t('followDue'):t('reviewDate')} · ${date(a.followupOn)}</span>`:''}</span><span class="row-arrow">${icon('arrow')}</span></button>`;}
function entryPage(){return `${button('back-list','home','back-button')}${entry.render()}${saveNotice()}`;}
function entryLinks(){return `<div class="entry-links" lang="en"><p class="micro">Guided help · English text-only preview</p><div class="coach-options"><button type="button" id="entry-start">Help me get started</button><button type="button" id="entry-claim">Help after someone has died</button></div></div>`;}
function home(){
 const c=counts(current),items=orderedAccounts(current.accounts),familyRemaining=items.filter(a=>!a.familyReviewedOn).length,next=items.find(a=>isDue(a)||!['confirmed','optout','linked'].includes(attention(a)))||items.find(a=>a.review==='confirmed'&&!a.familyReviewedOn);
 return `${heading('homeTitle','homeIntro')}${c.total?`${current.synthetic?copy('sample','p','sample-label'):''}<div class="overview-counts"><div><strong>${number(c.total)}</strong><span>${t('accounts')}</span></div><div><strong>${number(current.accounts.filter(a=>isDue(a)||!['confirmed','optout','linked'].includes(attention(a))).length)}</strong><span>${t('needsAttention')}</span></div><div><strong>${number(c.confirmed)}</strong><span>${t('checkedCount')}</span></div></div>${next?`<section class="next-task"><div>${copy('next','p','overline')}<h2>${esc(accountTitle(next))}</h2><p data-speak>${esc(t(taskKey(next)))}</p></div><button type="button" class="primary" data-account="${next.id}">${t('resumeTask')} <span aria-hidden="true">→</span></button></section>`:''}${familyRemaining?`<p class="family-progress">${t('familyRemaining')}: ${number(familyRemaining)}</p>`:''}<div class="home-actions">${button('add',current.synthetic?'startOwnList':'add',next?'secondary':'primary')}${button('summary','summary','text-button')}</div>`:`<div class="home-actions">${button('add','startCheck','primary')}</div>${copy('startHelp','p','start-help')}<div class="example-types">${['bank','demat','mf'].map(k=>`<span>${icon(k)}${t(k)}</span>`).join('')}</div>${button('demo','example','text-button')}${details('howWorks',copy('howWorksText'))}`}${entryLinks()}${pendingEditor?button('continue-editor','unfinishedChanges','unfinished-link'):''}${unfinished?`<button type="button" id="continue-draft" class="unfinished-link">${t('unfinished')} ${icon('arrow')}</button>`:''}${c.total?`<section class="account-list" aria-label="${t('accounts')}"><div class="list-heading"><h2>${t('accounts')}</h2></div>${items.map(row).join('')}</section>`:''}${saveNotice()}`;
}
function options(name,key,values,description=false){return `<fieldset class="choice-group"><legend data-speak>${t(key)}</legend><div class="${description?'type-options':'choice-options'}">${values.map(([value,label,desc])=>`<label><input aria-describedby="${name}-error" type="radio" name="${name}" value="${value}" ${draft[name]===value?'checked':''}><span>${description?icon(value):''}<span><strong data-speak>${esc(t(label))}</strong>${desc?`<span data-speak>${esc(t(desc))}</span>`:''}</span></span></label>`).join('')}</div><p class="error field-error" id="${name}-error" role="alert"></p></fieldset>`;}
const hints={label:'nicknameExample',owner:'ownerExample',nomineeNote:'nomineeNoteExample',last4:'last4Example',recordNote:'recordNoteExample',recordLocation:'locationHelp'};
function field(name,label,required=false){const hint=hints[name];return `<div class="field"><label for="account-${name}" data-speak>${t(label)}</label><input id="account-${name}" name="${name}" type="text" value="${esc(name==='owner'?ownerText(draft[name]):draft[name])}" maxlength="${name==='last4'?4:['recordLocation','recordNote'].includes(name)?160:80}" ${name==='last4'?'inputmode="numeric"':''} ${required?'required':''} aria-describedby="${hint?`account-${name}-hint `:''}account-${name}-error" autocomplete="off">${hint?`<p class="help" id="account-${name}-hint" data-speak>${t(hint)}</p>`:''}<p id="account-${name}-error" class="error field-error" role="alert"></p></div>`;}
function institutionField(){const key={bank:'searchBank',demat:'searchDemat',mf:'searchMf'}[draft.type];return `<div class="institution-picker field"><label for="account-institution" data-speak>${t(key)}</label><div class="combobox-anchor"><input id="account-institution" name="institution" type="text" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="institution-results" aria-describedby="institution-help account-institution-error" value="${esc(draft.institution)}" autocomplete="off" autocapitalize="words" spellcheck="false" maxlength="80" required><div id="institution-results" role="listbox" aria-label="${t('suggestions')}" hidden></div></div><p id="institution-announcement" class="sr-only" role="status" aria-live="polite"></p><p class="help" id="institution-help" data-speak>${t('searchHelp')}</p><p id="account-institution-error" class="error field-error" role="alert"></p></div>${copy(draft.type+'Location','p','context-guide')}`;}
function contextFields(){return `${options('owner','whose',[['@me','me'],['@parent','parent'],['@familyMember','familyMember'],['','unknown']])}${options('holding','holderQuestion',[['sole','sole'],['joint','joint'],['unknown','unknown']])}${draft.type==='bank'?options('product','bankProduct',[['savings','savings'],['deposit','deposit'],['unknown','unknown']]):draft.type==='mf'?`${options('mfMode','mfMode',[['folio','folioMode'],['demat','dematMode'],['unknown','unknown']])}${details('identifyHelp',copy('identifyText'))}`:''}`;}
function nomineeChoices(){return `${copy('nomineeExplain','p','nominee-explanation')}${options('nomination','nomination',[['unknown','unknown'],['registered','nomineeYes'],['missing','nomineeNo'],['change','change']])}${details('optout',`${copy('optoutHelp')}<label class="check-field"><input type="checkbox" id="choose-optout" ${draft.nomination==='optout'?'checked':''}><span>${t('optout')}</span></label>`)}`;}
function accountForm(){const editing=editorMode==='edit';return `${editing?button('cancel-edit','back','back-button'):''}${!editing?`<p class="step-label">${t('step')} ${number(step+1)} ${t('of')} ${number(4)} · ${t(['stepType','stepInstitution','stepContext','stepNomination'][step])}</p><div class="step-track" aria-hidden="true">${[0,1,2,3].map(i=>`<span class="${i<=step?'reached':''}"></span>`).join('')}</div>`:''}${heading(editing?'edit':['typeQuestion','institutionQuestion','accountContext','nomination'][step],!editing&&step===2?'contextHelp':'')}<form autocomplete="off" novalidate id="account-form" class="form-flow">${editing?`${institutionField()}${contextFields()}`:step===0?`${options('type','type',[['bank','bank','bankDescription'],['demat','demat','dematDescription'],['mf','mf','mfDescription']],true)}${details('identifyHelp',copy('dematDescription')+copy('bankDescription')+copy('mfDescription'))}`:step===1?institutionField():step===2?contextFields():nomineeChoices()}<p id="form-error" class="error" role="alert"></p><div class="button-row">${button('form-back','back','back-button')}<button type="submit" class="primary" data-speak>${t(editing?'update':step===3?'seeNext':'continue')}</button></div></form>${saveNotice()}`;}
function sourceDisclosure(a){const guide=guideFor(a);return details('source',`${copy(guide.scope,'p','help')}<a href="${guide.url}" target="_blank" rel="noopener noreferrer">${t(guide.label)} ↗</a><p class="micro">${t('checkedOn')}: ${date(guide.reviewedOn)}</p>${copy('sourceNote','p','micro')}${copy('selfReport','p','micro')}`);}
function instructionList(keys){return `<ol class="task-checklist" role="list">${keys.map((key,i)=>`<li><span class="step-number" aria-hidden="true">${number(i+1)}</span>${copy(key)}</li>`).join('')}</ol>`;}
function evidenceExample(){return details('seeEvidence',`${copy('fictionalExample','p','micro')}<div class="evidence-examples"><div>${copy('submitted','h3')}${copy('receiptExample')}</div><div>${copy('confirmed','h3')}${copy('registeredExample')}</div></div>`);}
function officialLink(a){const guide=guideFor(a);return `<a class="official-link" data-speak href="${guide.url}" target="_blank" rel="noopener noreferrer">${t([SOURCES.bank,SOURCES.sebi].includes(guide.url)?'readRules':'openOfficial')} <span aria-hidden="true">↗</span></a>`;}
function detail(){
 const a=account(),state=attention(a),guide=guideFor(a);
 let content='',actions='';
 if(['unknown','review'].includes(state)) {content=instructionList(guide.check);actions=button('check-result','whatFound','primary')+button('submit-request','markSubmitted','text-button');}
 if(['missing','change'].includes(state)){content=copy(state==='change'?'foundChange':'foundNo')+copy('prepareIntro');actions=button('prepare','prepare','primary')+button('check-result','helpCheck','text-button')+button('submit-request','markSubmitted','text-button');}
 if(state==='awaiting'){content=copy('followRequest');actions='<button type="button" id="review-response" class="primary" lang="en">Understand the institution’s response</button>';}
 if(state==='blocked'){content=copy('blockedHelp');actions=button('prepare','prepare','primary')+button('check-result','whatFound','text-button');}
 if(state==='confirmed'){content=copy(a.familyReviewedOn?'familyReadyNext':'familyReviewHelp')+`<p data-speak>${esc(t(a.evidenceScope==='details'?'detailsChecked':'statusOnly'))}</p>`;actions=(isDue(a)?button('recheck','recheck','primary')+button('family','familyRecord','text-button'):(a.familyReviewedOn?button('summary','summary','primary')+button('family','familyRecord','text-button'):button('family','familyRecord','primary'))+button('recheck','recheck','text-button'))+button('change-nomination','foundChange','text-button');}
 if(state==='linked'){content=copy('mfDematHelp')+`<p>${t('linkedTo')} <bdi>${esc(accountTitle(current.accounts.find(d=>d.id===a.linkedDematId)))}</bdi></p>`;actions=button('use-demat','useDemat','primary');}
 if(state==='optout'){content=copy('optoutHelp');actions=button('recheck','recheck','primary');}
 if(a.type==='mf'&&a.mfMode==='demat'&&!['confirmed','awaiting','optout','linked'].includes(state)){content=copy('mfDematHelp');actions=button('use-demat','useDemat','primary');}
 return `${button('back-list','back','back-button')}${heading(accountTitle(a),'',true)}<p class="account-subtitle">${[t(a.type),ownerText(a.owner),a.label?a.institution:'',a.last4?'•••• '+a.last4:''].filter(Boolean).map(esc).join(' · ')}</p><div class="focused-detail"><section class="task-card"><div class="section-heading">${copy('next','p','overline')}${status(a)}</div>${copy(taskKey(a),'h2')}${!guide.specific&&['unknown','review','missing','change'].includes(state)?copy('routeFallback','p','help'):''}${content}<div class="button-row">${actions}</div>${state==='unknown'||state==='review'?officialLink(a):''}${['unknown','review','awaiting','blocked'].includes(state)?details('askHelp',copy('askText')+button('copy-question','copyQuestion','text-button')):''}${['awaiting','confirmed'].includes(state)?evidenceExample():''}${sourceDisclosure(a)}</section><details class="progress-card secondary-record"><summary>${t('currentRecord')}</summary><div class="detail-body">${copy('selfReport','p','micro')}<dl class="record-facts"><dt>${t('nomination')}</dt><dd>${t(a.linkedDematId?'linked':a.nomination)}</dd><dt>${t('checkedOn')}</dt><dd>${date(a.checkedOn)}</dd>${a.submittedOn?`<dt>${t('submissionDate')}</dt><dd>${date(a.submittedOn)}</dd>`:''}${a.confirmationOn?`<dt>${t('confirmationDate')}</dt><dd>${date(a.confirmationOn)}</dd>`:''}${a.followupOn?`<dt>${t('reviewDate')}</dt><dd>${date(a.followupOn)}${a.followupOn<=today()?` · ${t('followDue')}`:''}</dd>`:''}</dl>${button('followup','followup','text-button')}${details('familyRecord',`${copy(a.familyReviewedOn?'familyReviewed':'familyPending','p','family-status')}<p>${t('owner')}: <bdi>${esc(ownerText(a.owner)||t('notProvided'))}</bdi></p><p>${t('nominees')}: <bdi>${esc([...a.nominees,a.nomineeNote].filter(Boolean).join(', ')||t('notProvided'))}</bdi></p><p>${t('recordLocation')}: <bdi>${esc(a.recordLocation||t('notProvided'))}</bdi></p>${button('family-aside','edit','text-button')}`)}${a.recordNote?details('privateRecord',`<p><bdi>${esc(a.recordNote)}</bdi></p>${copy('privateRecordHelp','p','micro')}`):''}${a.events.length?details('history',`<ol class="event-list">${a.events.slice().reverse().map(e=>`<li>${t(e.kind)} <span>${date(e.on)}</span></li>`).join('')}</ol>`):''}<div class="record-actions">${button('edit-account','edit','text-button')}${button('remove-account','remove','text-button danger')}</div></div></details></div>${saveNotice()}`;
}
function checkResult(){return `${button('back-detail','back','back-button')}${heading('whatFound','checkFirst')}<div class="answer-list">${[['found-yes','foundYes'],['found-no','foundNo'],['found-change','foundChange'],['found-unknown','foundUnknown']].map(([id,key])=>button(id,key,'answer-button')).join('')}</div>${details('optout',copy('optoutHelp')+button('found-optout','optout','text-button'))}${evidenceExample()}`;}
function prepare(){const a=account(),guide=guideFor(a);return `${button('back-detail','back','back-button')}${coach.render(a,{...guide,action:guide.action.map(t),offline:guide.offline.map(t),scope:t(guide.scope)})}${saveNotice()}`;}
function dateParts(name){if(!draft._dateParts)draft._dateParts={};if(!draft._dateParts[name]){const [year='',month='',day='']=(draft[name]||'').split('-');draft._dateParts[name]={day,month,year};}return draft._dateParts[name];}
function dateField(name,key){const parts=dateParts(name);return `<fieldset class="date-field"><legend data-speak>${t(key)}</legend><div class="date-parts">${['day','month','year'].map(part=>`<div><label for="account-${name}-${part}">${t(part)}</label><input id="account-${name}-${part}" data-date-name="${name}" data-date-part="${part}" type="text" inputmode="numeric" maxlength="${part==='year'?4:2}" value="${esc(parts[part])}" placeholder="${part==='day'?'14':part==='month'?'09':'2026'}" aria-describedby="account-${name}-hint account-${name}-error"></div>`).join('')}</div><p class="help" id="account-${name}-hint" data-speak>${t(name==='followupOn'?'followupHelp':name==='submittedOn'?'submissionExample':'dateExample')}</p><p id="account-${name}-error" class="error field-error" role="alert"></p></fieldset>`;}
function recordChoices(){return `<fieldset class="record-options"><legend data-speak>${t('recordKind')}</legend>${['statement','registration'].map(k=>`<label><input id="record-${k}" name="recordKind" type="radio" value="${k}" ${draft.recordKind===k?'checked':''} aria-describedby="record-${k}-hint account-recordKind-error"><span><strong data-speak>${t(k)}</strong><span data-speak id="record-${k}-hint">${t(k+'Example')}</span></span></label>`).join('')}<p id="account-recordKind-error" class="error field-error" role="alert"></p></fieldset>`;}
function progressForm(){const confirm=view==='confirm',follow=view==='followup';return `${button('back-detail','back','back-button')}${heading(follow?'followup':confirm?'markConfirmed':'markSubmitted',follow?'':confirm?'confirmationRequired':'receiptGuide')}<form autocomplete="off" novalidate id="progress-form" class="narrow-card">${confirm?`${recordChoices()}${options('evidenceScope','evidenceScope',[['status','statusOnly'],['details','detailsChecked']])}`:''}${dateField(follow?'followupOn':confirm?'confirmationOn':'submittedOn',follow?'reviewDate':confirm?'confirmationDate':'submissionDate')}${!follow?field('recordNote','recordNote'):''}${confirm?`<label class="check-field"><input id="account-confirmationChecked" name="confirmationChecked" type="checkbox" ${draft.confirmationChecked?'checked':''} aria-describedby="account-confirmationChecked-error"><span data-speak>${t('confirmationCheck')}</span></label><p id="account-confirmationChecked-error" class="error field-error" role="alert"></p>`:''}<p id="form-error" class="error" role="alert"></p><div class="button-row">${button('cancel-progress','back','back-button')}<button type="submit" class="primary" data-speak>${t('update')}</button></div></form>${confirm?evidenceExample():''}${saveNotice()}`;}
function familyForm(){return `${button('back-detail','back','back-button')}${heading('familyRecord','familyHelp')}<form autocomplete="off" novalidate id="family-form" class="form-flow">${field('owner','owner')}${field('label','nickname')}${field('last4','last4')}<fieldset class="nominee-records"><legend data-speak>${t('nominees')}</legend>${copy('optionalDetails','p','help')}<div id="nominee-inputs">${(draft.nominees.length?draft.nominees:['']).map((value,i)=>`<div class="nominee-line"><label for="nominee-${i}">${t('nomineeNote')} ${number(i+1)}</label><input type="text" id="nominee-${i}" data-nominee="${i}" value="${esc(value)}" maxlength="80" autocomplete="off">${i?`<button type="button" data-remove-nominee="${i}" aria-label="${t('removeNote')} ${number(i+1)}">×</button>`:''}</div>`).join('')}</div>${draft.nominees.length<(draft.type==='bank'?4:3)?button('add-nominee','addNomineeNote','text-button'):''}${draft.nomineeNote?field('nomineeNote','nomineeNote'):''}</fieldset>${field('recordLocation','recordLocation')}<div class="family-review">${copy('familyReviewHelp','p','help')}<label class="check-field"><input id="reviewed-family" type="checkbox" ${draft.familyReviewedOn?'checked':''}><span data-speak>${t('familyReviewCheck')}</span></label></div><p id="form-error" class="error" role="alert"></p><div class="button-row">${button('cancel-family','back','back-button')}<button type="submit" class="primary" data-speak>${t('update')}</button></div></form>${saveNotice()}`;}
function sheetBody(){return `${current.synthetic?copy('sample','p','sample-label'):''}${orderedAccounts(current.accounts).map(a=>`<article class="summary-account"><div class="summary-top"><h2>${esc(accountTitle(a))}</h2>${status(a)}</div><p>${esc(t(a.type))}${a.label?' · '+esc(a.institution):''}${a.last4?' · •••• '+a.last4:''}</p>${a.linkedDematId?`<p>${t('linkedTo')}: ${esc(accountTitle(current.accounts.find(d=>d.id===a.linkedDematId)))}</p>`:''}${shareNames?`<p>${t('whose')} <bdi>${esc(ownerText(a.owner)||t('notProvided'))}</bdi></p><p>${t('nominees')}: <bdi>${esc([...a.nominees,a.nomineeNote].filter(Boolean).join(', ')||t(a.familyReviewedOn?'notIncluded':'notProvided'))}</bdi></p>`:''}<p class="family-status">${t(a.familyReviewedOn?'familyReviewed':'familyPending')}${a.familyReviewedOn?' · '+date(a.familyReviewedOn):''}</p><p><strong>${t('next')}:</strong> ${t(a.review==='confirmed'&&a.familyReviewedOn?'familyReadyNext':taskKey(a))}</p><p>${t('checkedOn')}: ${date(a.checkedOn)}${a.review==='confirmed'?' · '+t(a.evidenceScope==='details'?'detailsChecked':'statusOnly'):''}</p>${a.submittedOn?`<p>${t('submissionDate')}: ${date(a.submittedOn)}</p>`:''}${a.confirmationOn?`<p>${t('confirmationDate')}: ${date(a.confirmationOn)}</p>`:''}${a.followupOn?`<p>${t('reviewDate')}: ${date(a.followupOn)}</p>`:''}${shareLocation&&a.recordLocation?`<p>${t('recordLocation')} <bdi>${esc(a.recordLocation)}</bdi></p>`:''}<a href="${guideFor(a).url}" target="_blank" rel="noopener noreferrer">${t('openOfficial')}</a></article>`).join('')}<p class="micro" data-speak>${t('selfReport')}</p><p class="micro" data-speak>${t('noIds')}</p><p class="micro" data-speak>${t('boundary')}</p>`;}
function summary(){return `${button('back-list','back','back-button')}${heading('summary')}${saveNotice()}<div class="share-controls" data-no-print><label class="check-field"><input id="share-names" type="checkbox" ${shareNames?'checked':''}><span data-speak>${t('shareNames')}</span></label><label class="check-field"><input id="share-location" type="checkbox" ${shareLocation?'checked':''}><span data-speak>${t('shareLocation')}</span></label></div><section id="family-sheet" class="summary-card">${sheetBody()}</section>`;}


function announce(key){live.textContent='';requestAnimationFrame(()=>{live.textContent=t(key);});}
function markDirty(){dirty=true;generation++;}
function storeAccount(value){const a=validateAccount(value);const candidates=current.accounts.filter(x=>x.id!==a.id).concat(a);for(const item of candidates)if(item.linkedDematId&&!candidates.some(d=>d.id===item.linkedDematId&&d.type==='demat'))throw new Error('invalidSave');const index=current.accounts.findIndex(x=>x.id===a.id);if(index<0)current.accounts.push(a);else current.accounts[index]=a;selected=a.id;if(unfinished?.sourceId===a.id&&(a.type!=='mf'||a.mfMode!=='demat'||a.linkedDematId))unfinished.sourceId='';markDirty();if(view==='form'&&editorMode==='new'){unfinished=null;if(pendingDematSource&&a.type==='demat'){const sourceId=pendingDematSource;pendingDematSource='';queueMicrotask(()=>confirmDematLink(sourceId,a.id));}}if(pendingEditor?.account.id===a.id)pendingEditor=null;draft=null;view='detail';draw();announce('updated');}
function keepDraft(){if(!draft)return;if(view==='form'&&editorMode==='new')unfinished={account:structuredClone(draft),step,sourceId:pendingDematSource};else if(['form','family','confirm','submit','followup'].includes(view))pendingEditor={view,mode:editorMode,step,account:structuredClone(draft)};}
function go(next){generation++;reader.stop();keepDraft();draft=null;view=next;draw();}
function begin(){generation++;if(current.accounts.length>=50){announce('accountLimit');return false;}pendingDematSource='';unfinished=null;draft={...emptyAccount(),type:''};step=0;editorMode='new';view='form';markDirty();draw();return true;}
function openEditor(next){
 if(pendingEditor){if(pendingEditor.view===next&&pendingEditor.account.id===selected){draft=structuredClone(pendingEditor.account);step=pendingEditor.step;editorMode=pendingEditor.mode;view=next;draw();return;}confirmAction('replaceChanges',()=>{pendingEditor=null;openEditor(next);});return;}
 generation++;draft=structuredClone(account());editorMode='edit';if(next==='confirm'){draft.recordKind='';draft.confirmationChecked=false;draft.confirmationOn='';}view=next;draw();
}
function openProgress(next){openEditor(next);}

function pageDirection(){document.documentElement.lang=lang;document.documentElement.dir='ltr';document.body.classList.toggle('urdu',lang==='ur');document.querySelectorAll('[data-speak], h1, h2, h3, label, legend, summary, .help, .error, .account-row-main, .status-pill, .record-facts, .language-tiles strong').forEach(el=>{el.dir=el.closest('[lang="en"]')?'ltr':lang==='ur'?'rtl':'ltr';});}
function draw(focus=true){
 reader.stop();speechScope=main;document.body.classList.toggle('language-gate',!chosen);$('.site-header').hidden=!chosen;$('footer').hidden=!chosen;$('.skip').hidden=!chosen;
 if(!chosen){main.className='';main.innerHTML=`<section class="language-picker"><div class="gate-brand">${$('.brand').innerHTML}</div><h1>Choose your language</h1><div class="language-tiles">${languages.map(([code,label])=>`<button type="button" data-language="${code}" lang="${code}"><strong dir="${code==='ur'?'rtl':'ltr'}">${label}</strong></button>`).join('')}</div><p class="language-status" role="status"></p></section>`;return;}
 document.querySelectorAll('[data-startup-disabled]').forEach(el=>el.disabled=false);main.className='app-shell';$('#language-button').textContent=languages.find(([c])=>c===lang)[1];$('#language-button').setAttribute('aria-label',t('language')+': '+languages.find(([c])=>c===lang)[1]);$('#access-toggle').setAttribute('aria-label',t('readingSettings'));$('#home-button').setAttribute('aria-label',t('home'));$('#help').textContent=t('privacyHelp');$('#clear').textContent=t('clear');$('.skip').textContent=t('skip');
 if(['detail','check','prepare','confirm','submit','family','followup'].includes(view)&&!account()){view='home';draft=null;}
 main.innerHTML=(current.synthetic&&!['home','summary'].includes(view)?copy('sample','p','sample-label'):'')+({home,entry:entryPage,form:accountForm,detail,check:checkResult,prepare,confirm:progressForm,submit:progressForm,followup:progressForm,family:familyForm,summary}[view]||home)();pageDirection();
 if($('#account-institution'))bindInstitution();
 if(focus){main.focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});}
}
function showError(id,key){const el=document.getElementById(id);if(el){el.textContent=t(key);el.setAttribute('data-speak','');}}
function clearErrors(){main.querySelectorAll('.error').forEach(e=>e.textContent='');main.querySelectorAll('[aria-invalid]').forEach(e=>e.removeAttribute('aria-invalid'));}
function invalid(name,key){showError(document.getElementById('account-'+name+'-error')?'account-'+name+'-error':name+'-error',key);const input=$('#account-'+name)||$(`[data-date-name="${name}"]`)||$(`[name="${name}"]`);if(input){input.setAttribute('aria-invalid','true');input.focus();}else showError('form-error',key);}
function normaliseDigits(text){return text.replace(/[०-९০-৯٠-٩۰-۹]/g,c=>String(c.charCodeAt(0)-(c>='०'&&c<='९'?0x966:c>='০'&&c<='৯'?0x9e6:c>='٠'&&c<='٩'?0x660:0x6f0)));}
function readDates(){for(const [name,parts] of Object.entries(draft?._dateParts||{})){const {year,month,day}=parts;draft[name]=[year,month,day].every(v=>v==='')?'':`${year.padStart(4,'0')}-${month.padStart(2,'0')}-${day.padStart(2,'0')}`;}}
function bindInstitution(){
 const input=$('#account-institution'),list=$('#institution-results');let results=[],active=-1;
 const close=()=>{list.hidden=true;input.setAttribute('aria-expanded','false');input.removeAttribute('aria-activedescendant');active=-1;};
 const render=()=>{results=searchInstitutions(draft.type,input.value,8);active=-1;list.innerHTML=results.map((r,i)=>`<div role="option" id="institution-option-${i}" aria-selected="false" data-institution-index="${i}"><span>${esc(r.name)}</span><span aria-hidden="true">↵</span></div>`).join('')+(input.value.trim()?`<div role="option" id="institution-option-${results.length}" aria-selected="false" data-institution-index="${results.length}" class="custom-institution">${esc(t('useTyped'))}: <strong>${esc(input.value.trim())}</strong></div>`:'');if(!results.length&&!input.value.trim()){close();return;}list.hidden=false;input.setAttribute('aria-expanded','true');input.removeAttribute('aria-activedescendant');$('#institution-announcement').textContent=results.length?`${number(results.length)} ${t('suggestions')}`:t('noMatches');};
 const choose=i=>{const item=results[i];draft.institution=item?.name||input.value.trim();draft.institutionId=item?.id||'';input.value=draft.institution;markDirty();close();input.focus();};
 input.addEventListener('focus',render);input.addEventListener('input',()=>{draft.institution=input.value;draft.institutionId='';render();});
 input.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();close();return;}if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();if(list.hidden)render();const count=list.children.length;if(!count)return;active=(active+(e.key==='ArrowDown'?1:-1)+count)%count;[...list.children].forEach((el,i)=>el.setAttribute('aria-selected',String(i===active)));input.setAttribute('aria-activedescendant',list.children[active].id);list.children[active].scrollIntoView({block:'nearest'});}else if(e.key==='Enter'&&!list.hidden&&active>=0){e.preventDefault();choose(active);}else if(e.key==='Tab')close();});
 list.addEventListener('pointerdown',e=>e.preventDefault());list.addEventListener('click',e=>{const option=e.target.closest('[data-institution-index]');if(option)choose(Number(option.dataset.institutionIndex));});input.addEventListener('blur',close);
}
function updateSpeech({state,error,index,total,text,source}){
 const q=id=>speechScope.querySelector('#'+(speechScope===main?'':speechScope.id+'-')+id),active=['loading','playing','paused','blocked','error'].includes(state),listen=q('listen'),stop=q('speech-stop'),status=q('speech-status');
 if(listen)listen.querySelector('span').textContent=t(['playing','loading'].includes(state)?'pause':['paused','blocked'].includes(state)?'resumeAudio':state==='error'?'audioRetry':'read');
 if(stop)stop.hidden=!active;
 const message=t(({loading:'audioLoading',blocked:'audioBlocked',playing:'listening',paused:'pause',finished:'finishedAudio',error:'speechError',unavailable:'speechUnavailable'})[state]||'')||'';
 if(status&&status.textContent!==message)status.textContent=message;
 if(!active&&/speech-(stop|previous|repeat|next)$/.test(document.activeElement?.id||''))listen?.focus();
 document.querySelectorAll('.reading-current').forEach(el=>el.classList.remove('reading-current'));
 if(active&&source!==null)speechScope.querySelector(`[data-reading-source="${source}"]`)?.classList.add('reading-current');
 if(q('read-along')){q('read-along').hidden=!active;q('speech-sentence').textContent=text||'';q('speech-position').textContent=active?`${number(index+1)} ${t('of')} ${number(total)}`:'';q('speech-previous').disabled=index===0;q('speech-next').disabled=index>=total-1;}
}
function readPage(scope=main){
 reader.stop();speechScope=scope;
 const blocks=[...scope.querySelectorAll('[data-speak]')].filter(e=>(e.checkVisibility?.({checkVisibilityCSS:true})??e.getClientRects().length>0)&&!e.parentElement.closest('[data-speak]')).map((e,i)=>{e.dataset.readingSource=String(i);return {text:e.textContent.trim(),source:i};});
 reader.start(blocks,{language:lang,rate:speechRate});
}
function audioAction(id,scope){
 if(id==='listen'){if(['playing','loading'].includes(reader.state))reader.pause();else if(['paused','blocked'].includes(reader.state))reader.resume();else if(reader.state==='error')reader.retry();else readPage(scope);return true;}
 const actions={'speech-stop':'stop','speech-previous':'previous','speech-repeat':'repeat','speech-next':'next'};
 if(actions[id]){reader[actions[id]]();return true;}return false;
}
function dialogHead(id,key){return `<div class="dialog-head"><h2 id="${id}" data-speak>${t(key)}</h2><button type="button" class="dialog-close" data-close aria-label="${t('close')}">×</button></div>`;}
function openDialog(id,body){reader.stop();dialogOrigin=document.activeElement;const dialog=$('#'+id);dialog.innerHTML=body.replace('</div>','</div>'+listenBar(id+'-'));speechScope=dialog;pageDirection();dialog.showModal();dialog.querySelector('[data-close]')?.addEventListener('click',()=>dialog.close());return dialog;}
function confirmAction(key,action){const d=openDialog('confirm-dialog',`${dialogHead('confirm-title','beforeContinue')}${copy(key)}<div class="button-row">${button('confirm-cancel','cancel')}${button('confirm-action','continue','primary')}</div>`);$('#confirm-cancel').onclick=()=>d.close();$('#confirm-action').onclick=()=>{d.close();action();};$('#confirm-cancel').focus();}
function languageDialog(){const d=openDialog('language-dialog',`${dialogHead('language-title','language')}${copy('languageHelp')}<div class="language-tiles">${languages.map(([code,label])=>`<button type="button" data-language="${code}" lang="${code}" aria-pressed="${code===lang}"><strong dir="${code==='ur'?'rtl':'ltr'}">${label}</strong></button>`).join('')}</div><p class="language-status" role="status"></p>`);d.onclick=e=>{const b=e.target.closest('[data-language]');if(b)chooseLanguage(b.dataset.language,d);};}
let languageRequest=0;
async function chooseLanguage(next,dialog=null,focus=true){
 const request=++languageRequest,scope=dialog||main,status=scope.querySelector('.language-status');
 if(status){status.lang=next;status.dir=next==='ur'?'rtl':'ltr';status.textContent=loadingText[next];}
 scope.setAttribute('aria-busy','true');reader.stop();
 try{await loadLanguage(next);if(request!==languageRequest||(dialog&&!dialog.open))return;lang=next;chosen=true;keepLanguageOffline(lang);dialog?.close();history.replaceState(null,'','/');draw(focus&&!dialog);if(!performance.getEntriesByName('virasat-ready').length)performance.mark('virasat-ready');}
 catch{if(request===languageRequest){if(status)status.textContent=retryText[next];const choices=scope.querySelector('.startup-languages');if(choices)choices.hidden=false;}}
 finally{if(request===languageRequest||dialog&&!dialog.open)scope.removeAttribute('aria-busy');}
}
function accessDialog(){
 const contrast=document.body.classList.contains('high-contrast'),motion=document.body.classList.contains('no-motion'),spacing=document.body.classList.contains('more-spacing');
 const d=openDialog('access-dialog',`${dialogHead('access-title','readingSettings')}<section class="settings-section"><h3>${t('appearance')}</h3><div class="size-control"><span>${t('textSize')}</span><button id="smaller" aria-label="${t('smaller')}">A−</button><output id="text-size">${textLevel}%</output><button id="larger" aria-label="${t('larger')}">A+</button></div>${[['contrast',contrast],['motion',motion],['lineSpacing',spacing]].map(([k,on])=>`<label class="setting-switch"><span>${t(k)}</span><input id="setting-${k}" role="switch" type="checkbox" ${on?'checked':''}></label>`).join('')}</section><section class="settings-section"><h3>${t('voice')}</h3>${copy('voiceHelp','p','help')}<fieldset class="speed-control"><legend>${t('speed')}</legend>${[[.75,'slower'],[.9,'normalSpeed'],[1.05,'faster']].map(([rate,k])=>`<label><input name="speed" type="radio" value="${rate}" ${speechRate===rate?'checked':''}><span>${t(k)}</span></label>`).join('')}</fieldset><p id="voice-status" role="status" class="help"></p>${details('audioCache',copy('audioData')+button('clear-audio','clearAudio','text-button'))}${copy('audioDraft','p','micro')}</section>${copy('readingPreferences','p','help')}${button('reset-settings','resetSettings','text-button')}`);
 function size(amount){textLevel=Math.max(90,Math.min(200,textLevel+amount));document.documentElement.style.fontSize=textLevel+'%';$('#text-size').textContent=textLevel+'%';$('#smaller').disabled=textLevel<=90;$('#larger').disabled=textLevel>=200;rememberReading();}
 $('#smaller').onclick=()=>size(-10);$('#larger').onclick=()=>size(10);size(0);
 for(const [key,cls] of [['contrast','high-contrast'],['motion','no-motion'],['lineSpacing','more-spacing']])$('#setting-'+key).onchange=e=>{document.body.classList.toggle(cls,e.target.checked);rememberReading();};
 d.querySelectorAll('[name=speed]').forEach(el=>el.onchange=()=>{speechRate=Number(el.value);rememberReading();reader.stop();});

 $('#clear-audio').onclick=async()=>{reader.stop();try{for(const key of await caches.keys())if(key.startsWith('virasat-audio-'))await caches.delete(key);$('#voice-status').textContent=t('audioCleared');}catch{$('#voice-status').textContent=t('speechError');}};
 $('#reset-settings').onclick=()=>{textLevel=100;size(0);speechRate=.9;document.body.classList.remove('high-contrast','no-motion','more-spacing');try{localStorage.removeItem(preferencesKey);}catch{}d.close();accessDialog();};
}
function helpDialog(){openDialog('help-dialog',`${dialogHead('help-title','privacyHelp')}${copy('howWorksText')}${copy('noIds')}${copy('privacyDetail')}${copy('voiceHelp')}${copy('audioPrivacy')}<p class="micro"><a href="/audio-credits.html" target="_blank" rel="noopener noreferrer">${t('voice')} · Meta MMS · CC BY-NC 4.0 ↗</a></p>${copy('boundary')}${copy('translationNotice')}`);}
function beginLinkedDemat(sourceId){const start=()=>{if(!begin())return;pendingDematSource=sourceId;draft.type='demat';step=1;draw();};unfinished?confirmAction('replaceDraft',start):start();}
function confirmDematLink(sourceId,targetId){const source=current.accounts.find(a=>a.id===sourceId),target=current.accounts.find(a=>a.id===targetId);if(!source||!target)return;const d=openDialog('confirm-dialog',`${dialogHead('confirm-title','checkConnection')}${copy('connectionHelp')}<p><bdi>${esc(accountTitle(source))} · ${esc(ownerText(source.owner))}</bdi><br><span aria-hidden="true">↓</span><br><bdi>${esc(accountTitle(target))} · ${esc(ownerText(target.owner))}</bdi></p><label class="check-field"><input id="same-holders" type="checkbox"><span>${t('sameHolders')}</span></label><div class="button-row">${button('link-account','linkAccount','primary','disabled')}</div>`);$('#same-holders').onchange=e=>$('#link-account').disabled=!e.target.checked;$('#link-account').onclick=()=>{source.linkedDematId=targetId;source.familyReviewedOn='';if(unfinished?.sourceId===sourceId)unfinished.sourceId='';source.events=[...source.events,{kind:'linked',on:today()}].slice(-20);markDirty();selected=targetId;d.close();go('detail');};}
main.addEventListener('input',e=>{
 const el=e.target;if(!draft)return;
 if(el.dataset.dateName){dateParts(el.dataset.dateName)[el.dataset.datePart]=normaliseDigits(el.value).replace(/[^0-9]/g,'');el.value=dateParts(el.dataset.dateName)[el.dataset.datePart];}
 else if(el.dataset.nominee!==undefined){draft.nominees[Number(el.dataset.nominee)]=el.value;}
 else if(el.name&&Object.hasOwn(draft,el.name)){const before=draft[el.name];draft[el.name]=el.type==='checkbox'?el.checked:el.name==='last4'?normaliseDigits(el.value):el.value;if(el.name==='type'&&before!==el.value){draft.institution='';draft.institutionId='';if(el.value!=='demat')pendingDematSource='';}}
 if(view==='family'){if(el.id==='reviewed-family')draft.familyReviewedOn=el.checked?today():'';else{draft.familyReviewedOn='';$('#reviewed-family').checked=false;}}
 if(el.id==='choose-optout'){draft.nomination=el.checked?'optout':'unknown';main.querySelectorAll('[name=nomination]').forEach(r=>r.checked=r.value===draft.nomination);}
 if(el.name==='nomination')$('#choose-optout').checked=false;
 markDirty();
});
main.addEventListener('change',e=>{if(e.target.id==='share-names'||e.target.id==='share-location'){shareNames=$('#share-names').checked;shareLocation=$('#share-location').checked;$('#family-sheet').innerHTML=sheetBody();pageDirection();}});
main.addEventListener('submit',async e=>{
 e.preventDefault();const id=e.target.id;clearErrors();
 if(id==='account-form'){
  if(!draft.type){showError('type-error','chooseType');$('[name=type]')?.focus();return;}
  if((editorMode==='edit'||step===1)&&!draft.institution.trim()){invalid('institution','requiredInstitution');return;}
  if(editorMode==='new'&&step<3){step++;draw();return;}
  try{if(editorMode==='edit'){if(draft.mfMode!=='demat')draft.linkedDematId='';const old=account();if(['institution','type','owner','holding','product','mfMode'].some(k=>old[k]!==draft[k])){draft.linkedDematId='';draft=transition(draft,'recheck');for(const linked of current.accounts)if(linked.linkedDematId===old.id){linked.linkedDematId='';linked.familyReviewedOn='';}}}storeAccount(draft);}catch(err){showError('form-error',t(err.message)===err.message?'invalidSave':err.message);}return;
 }
 if(id==='family-form'){if(draft.last4&&!/^\d{4}$/.test(draft.last4)){invalid('last4','invalidAccount');return;}try{storeAccount(draft);}catch(err){showError('form-error',t(err.message)===err.message?'invalidSave':err.message);}return;}
 if(id==='progress-form'){
  if(view==='confirm'&&!draft.recordKind){invalid('recordKind','requiredRecord');return;}
  readDates();const key=view==='confirm'?'confirmationOn':view==='submit'?'submittedOn':'followupOn';
  const parts=draft._dateParts?.[key];const partial=parts&&Object.values(parts).some(Boolean)&&(!/^\d{4}$/.test(parts.year)||!/^\d{1,2}$/.test(parts.month)||!/^\d{1,2}$/.test(parts.day));
  if(partial||view!=='followup'&&!draft[key]||!validDate(draft[key],view==='followup')||view==='confirm'&&draft.submittedOn&&draft.confirmationOn<draft.submittedOn){invalid(key,view==='followup'?'validFollowup':'invalidDate');return;}
  if(view==='confirm'&&!draft.confirmationChecked){invalid('confirmationChecked','requiredCheck');return;}
  try{storeAccount(view==='followup'?draft:transition(draft,view==='confirm'?'confirmed':'submitted'));}catch(err){showError('form-error',t(err.message)===err.message?'invalidSave':err.message);}
 }
});
main.addEventListener('click',async e=>{
 const target=e.target.closest('button,a');if(!target)return;
 if(target.dataset.language){e.preventDefault();chooseLanguage(target.dataset.language);return;}
 if(target.dataset.account){selected=target.dataset.account;go('detail');return;}
 if(target.dataset.removeNominee!==undefined){draft.nominees.splice(Number(target.dataset.removeNominee),1);draft.familyReviewedOn='';markDirty();draw(false);$('#add-nominee')?.focus();return;}
 const id=target.id;
 if(id==='entry-start'||id==='entry-claim'){id==='entry-claim'?entry.startClaim():entry.reset();go('entry');return;}
 if(view==='entry'){
  const result=entry.handle(target);
  if(result){
   if(typeof result==='string'&&result.startsWith('setup-')){
    const type=result.slice(6),start=()=>{if(current.synthetic){current=emptyTracker();pendingEditor=null;unfinished=null;selected='';coach.reset();}if(begin()){draft.type=type;step=1;draw();}};
    if(current.synthetic||unfinished)confirmAction(current.synthetic?'startOwnHelp':'replaceDraft',start);else start();
   }else {draw(false);$('.coach-content')?.focus();}
   return;
  }
 }

 if(view==='prepare'){
  const result=coach.handle(target);
  if(result){
   if(result==='claim-help'){entry.startClaim();go('entry');}
   else if(result==='edit-context')openEditor('form');
   else if(result==='submitted')openProgress('submit');
   else if(result==='confirm')openProgress('confirm');
   else if(result==='blocked')storeAccount(transition(account(),'blocked'));
   else {draw(false);$('.coach-content')?.focus();}
   return;
  }
 }
 if(audioAction(id,main))return;
 if(id==='add'){if(current.synthetic){confirmAction('startOwnHelp',()=>{current=emptyTracker();unfinished=null;pendingEditor=null;begin();});return;}if(unfinished)confirmAction('replaceDraft',begin);else begin();}
 if(id==='demo'){const action=()=>{current=sampleTracker();unfinished=null;pendingEditor=null;markDirty();go('home');};current.accounts.length||unfinished?confirmAction('replaceList',action):action();}
 if(id==='continue-editor'){draft=structuredClone(pendingEditor.account);selected=draft.id;step=pendingEditor.step;editorMode=pendingEditor.mode;view=pendingEditor.view;draw();}
 if(id==='continue-draft'){pendingDematSource=unfinished.sourceId||'';draft=structuredClone(unfinished.account);step=unfinished.step;editorMode='new';view='form';draw();}
 if(['back-list','cancel-edit'].includes(id))go('home');
 if(['back-detail','cancel-progress','cancel-family'].includes(id)){keepDraft();draft=null;go('detail');}
 if(id==='form-back'){if(editorMode==='new'&&step>0){step--;draw();}else go(editorMode==='edit'?'detail':'home');}
 if(['summary','prepare','check-result'].includes(id))go(id==='check-result'?'check':id);

 if(id==='review-response'){coach.startResponse(account());go('prepare');}
 if(id==='edit-account')openEditor('form');
 if(['family','family-aside'].includes(id))openEditor('family');
 if(id==='add-nominee'){draft.familyReviewedOn='';if(!draft.nominees.length)draft.nominees.push('');draft.nominees.push('');markDirty();draw(false);$('#nominee-'+(draft.nominees.length-1))?.focus();}
 if(['confirm-record','found-yes'].includes(id))openProgress('confirm');
 if(id==='submit-request')openProgress('submit');
 if(id==='followup')openProgress('followup');
 const moves={'found-no':'missing','found-change':'change','found-unknown':'unknown','found-optout':'optout',blocked:'blocked',recheck:'recheck','change-nomination':'change'};
 if(moves[id])storeAccount(transition(account(),moves[id]));
 if(id==='use-demat'){if(account().linkedDematId){selected=account().linkedDematId;go('detail');return;}const sourceId=selected;const candidates=current.accounts.filter(a=>a.type==='demat');if(candidates.length){const d=openDialog('confirm-dialog',`${dialogHead('confirm-title','useDemat')}${copy('mfDematHelp')}<div class="answer-list">${candidates.map(a=>`<button type="button" class="answer-button" data-link-demat="${a.id}">${esc(accountTitle(a))} · ${esc(ownerText(a.owner))}</button>`).join('')}${button('new-demat','add','secondary')}</div>`);d.querySelectorAll('[data-link-demat]').forEach(b=>b.onclick=()=>{const targetId=b.dataset.linkDemat;d.close();confirmDematLink(sourceId,targetId);});$('#new-demat').onclick=()=>{d.close();beginLinkedDemat(sourceId);};}else beginLinkedDemat(sourceId);}
 if(id==='remove-account')confirmAction('removeAsk',()=>{if(pendingEditor?.account.id===selected)pendingEditor=null;if(unfinished?.sourceId===selected)unfinished.sourceId='';if(pendingDematSource===selected)pendingDematSource='';current.accounts=current.accounts.filter(a=>a.id!==selected);for(const a of current.accounts)if(a.linkedDematId===selected)a.linkedDematId='';markDirty();go('home');});
 if(id==='copy-question'){try{await navigator.clipboard.writeText(t('askText'));target.textContent=t('copied');}catch{const range=document.createRange();range.selectNodeContents(target.previousElementSibling);const sel=window.getSelection();sel.removeAllRanges();sel.addRange(range);}}
});
$('#home-button').onclick=()=>go('home');$('.brand').onclick=e=>{e.preventDefault();go('home');};$('#language-button').onclick=languageDialog;$('#access-toggle').onclick=accessDialog;$('#help').onclick=helpDialog;
function clearSession(){generation++;reader.stop();coach.reset();entry.reset();current=emptyTracker();unfinished=null;pendingEditor=null;pendingDematSource='';draft=null;selected='';dirty=false;shareNames=true;shareLocation=true;for(const d of document.querySelectorAll('dialog')){if(d.open)d.close();d.replaceChildren();}view='home';draw(false);}
$('#clear').onclick=()=>confirmAction('clearAsk',()=>{clearSession();main.focus();announce('clearDone');});
for(const d of document.querySelectorAll('dialog')){d.addEventListener('click',e=>{const id=e.target.closest('button')?.id;if(id?.startsWith(d.id+'-'))audioAction(id.slice(d.id.length+1),d);});d.addEventListener('close',()=>{reader.stop();speechScope=main;if(dialogOrigin?.isConnected)dialogOrigin.focus();});}
// A visible session notice replaces the old unsaved-file navigation prompt.
// Clear both JS state and rendered fields before a possible back-forward cache snapshot.
window.addEventListener('pagehide',clearSession);
window.addEventListener('pageshow',e=>{if(e.persisted)clearSession();});

if('serviceWorker' in navigator)navigator.serviceWorker.register('/sw.js').catch(()=>{});
if(chosen)chooseLanguage(lang,null,false);else draw(false);
