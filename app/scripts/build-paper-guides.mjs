// Static public fallback; no records, browser storage, form submission or scripts.
import {mkdir,writeFile} from 'node:fs/promises';
import {dictionaries} from './dictionaries.mjs';
import {isRTL} from '../dist/languages.js';
const root=new URL('../dist/paper/',import.meta.url);
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
await mkdir(root,{recursive:true});
for(const [lang,d] of Object.entries(dictionaries)){
 const t=k=>esc(d[k]);
 const steps=[['plainEntryQuestion','plainHomeTypes'],['checkTask','checkGuide'],['plainFormTitle','plainFormHelp'],['plainReferenceTitle','plainReferenceHelp'],['plainPersonTitle','plainPersonHelp'],['plainMinorTitle','plainMinorHelp'],['plainSubmitTitle','plainSubmitHelp'],['plainResponseTitle','plainReceiptMeaning'],['familyRecord','handoverTry']];
 const html=`<!doctype html><html lang="${lang}" dir="${isRTL(lang)?'rtl':'ltr'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="referrer" content="no-referrer"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'self'; font-src 'self'; form-action 'none'; base-uri 'none'"><title>${t('paperGuide')} · Virasat</title><link rel="stylesheet" href="/styles.css"></head><body><a class="skip" href="#main">${t('skip')}</a><main id="main" tabindex="-1" class="app-shell"><p><a href="/${lang}">${t('home')}</a></p><h1>${t('paperGuide')}</h1>${lang!=='en'?`<p>${t('translationDraft')}</p>`:''}<p>${t('paperNoScript')}</p><p>${t('paperBlank')}</p><ol>${steps.map(([title,body])=>`<li><h2>${t(title)}</h2><p>${t(body)}</p></li>`).join('')}</ol><h2>${t('plainPrivacy')}</h2><p>${t('plainJoint')}</p><p>${t('plainNotSent')}</p><h2>${t('unclaimedTask')}</h2><p>${t('tracingInputs')}</p><ul><li><a href="https://app.mfcentral.com/links/mitra" rel="noreferrer">${t('officialMITRA')}</a></li><li><a href="https://udgam.rbi.org.in/" rel="noreferrer">${t('openUDGAM')}</a></li><li><a href="https://www.iepf.gov.in/" rel="noreferrer">${t('officialIEPF')}</a></li></ul><h2>${t('complaintTask')}</h2><p>${t('complaintHelp')}</p><p>${t('reviewHelp')}</p><p><a href="https://scores.sebi.gov.in/" rel="noreferrer">${t('officialSCORES')}</a></p><p>${t('bankComplaintHelp')}</p><p>${t('sourceReviewed')}</p></main></body></html>`;
 await writeFile(new URL(lang+'.html',root),html);
}
console.log({paperGuides:Object.keys(dictionaries).length,scripts:0});
