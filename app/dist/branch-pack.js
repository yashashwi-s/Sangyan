// A local, read-only preparation sheet. No notes, nominee names or identity numbers are exported.
import {isRTL} from './languages.js';
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeURL=value=>{try{const url=new URL(value);return url.protocol==='https:'&&!url.username&&!url.password?url.href:'';}catch{return '';}};
export function branchPackBody({account,guide={},dictionary,language='en',generatedOn='',sample=false}){
 if(!account||!['bank','demat','mf'].includes(account.type)||!dictionary)throw Error('Invalid branch pack');
 const t=key=>{if(typeof dictionary[key]!=='string')throw Error('Missing branch pack copy: '+key);return esc(dictionary[key]);};
 const p=key=>`<p data-speak>${t(key)}</p>`;
 const identify=account.type==='mf'&&account.mfMode==='unknown';
 const linked=account.type==='mf'&&account.mfMode==='demat';
 const deceased=account.holderDeceased===true;
 const securities=account.type!=='bank'&&!identify&&!linked&&!deceased;
 const url=guide.specific&&!identify&&!linked&&!deceased?safeURL(guide.url):'';
 const reference=/^\d{1,4}$/.test(account.last4||'')?` · <bdi>•••• ${esc(account.last4)}</bdi>`:'';
 const section=(n,key,body)=>`<section class="branch-pack-section"><h2><span aria-hidden="true">${n}.</span> ${t(key)}</h2>${body}</section>`;
 const where=p(deceased?'plainClaimTeam':linked?'mfDematHelp':identify?'identifyText':'offlineContact')+(url?`<p><a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${t('openOfficial')}</a><small class="branch-pack-url">${esc(url)}</small></p>`:p('routeFallback'));
 const bring=p(deceased?'plainClaimWritten':'offlineBring')+(!deceased&&!identify&&!linked&&account.holding==='joint'?p('plainJoint'):'')+(securities?p('offlineSignatureHelp'):'');
 const ask=`<blockquote data-speak>${t(deceased?'plainClaimAsk':identify||linked?'plainOldAsk':'askText')}</blockquote>`;
 const keep=p('submitKeep')+p(deceased?'plainClaimReceipt':'plainReceiptMeaning')+(!deceased?p('receiptGuide'):'');
 return `<article class="branch-pack-sheet" lang="${esc(language)}" dir="${isRTL(language)?'rtl':'ltr'}"><header class="branch-pack-heading"><p class="branch-pack-brand">Virasat</p><h1>${t('branchPack')}</h1>${sample?p('sample'):''}<p class="branch-pack-account"><strong><bdi>${esc(account.institution)}</bdi></strong> · ${t(account.type)}${reference}</p><p class="branch-pack-date">${esc(generatedOn)}</p></header>${section(1,'branchWhere',where)}${section(2,'branchBring',bring)}${section(3,'branchAsk',ask)}${section(4,'branchKeep',keep)}<div class="branch-pack-footer">${p('plainPrivacy')}${p('publicFallback')}${language!=='en'?p('translationDraft'):''}</div></article>`;
}
export const BRANCH_PACK_CSS=`@page{size:A4;margin:12mm}*{box-sizing:border-box}body{margin:0;color:#25372f;background:#fff;font:16px/1.5 system-ui,sans-serif}.branch-pack-sheet{max-width:760px;margin:32px auto;padding:0 24px}.branch-pack-brand{font-size:12px;letter-spacing:.08em;margin:0;color:#526b5f}.branch-pack-heading{border-bottom:2px solid #36594b;padding-bottom:10px}.branch-pack-heading h1{font-size:26px;line-height:1.2;margin:7px 0}.branch-pack-account{margin:6px 0}.branch-pack-date{font-size:12px;margin:0;color:#526b5f}.branch-pack-section{padding:10px 0;border-bottom:1px solid #d5ded6;break-inside:avoid}.branch-pack-section h2{font-size:17px;margin:0 0 5px}.branch-pack-section p{margin:5px 0}.branch-pack-section a{color:inherit}.branch-pack-url{display:block;font-size:10px;overflow-wrap:anywhere}.branch-pack-section blockquote{margin:0;padding-inline-start:12px;border-inline-start:3px solid #c5ae77}.branch-pack-footer{font-size:12px;padding-top:10px;break-inside:avoid}.branch-pack-footer p{margin:4px 0}@media print{body{font-size:10.5pt;line-height:1.4}.branch-pack-sheet{max-width:none;margin:0;padding:0}.branch-pack-heading h1{font-size:20pt}.branch-pack-section{padding:7px 0}.branch-pack-section h2{font-size:12pt}.branch-pack-footer{font-size:8.5pt}}`;
export function branchPackDocument(options,font=''){
 const body=branchPackBody(options),language=options.language||'en';
 return `<!doctype html><html lang="${esc(language)}" dir="${isRTL(language)?'rtl':'ltr'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="referrer" content="no-referrer"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; font-src data:; base-uri 'none'; form-action 'none'"><title>${esc(options.dictionary.branchPack)} · Virasat</title><style>${BRANCH_PACK_CSS}${font}</style></head><body>${body}</body></html>`;
}
