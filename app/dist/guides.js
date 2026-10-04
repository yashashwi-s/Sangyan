import {SOURCES} from './tracker.js';

// A directory match is not a claim that an institution has a verified guide.
// Each route keeps its applicability and public evidence next to the content.
export const GUIDE_REFERENCES=Object.freeze({
 hdfc:{url:SOURCES.hdfc,scope:'scopeHdfc',reviewedOn:'2026-10-03'},
 sbi:{url:'https://sbi.bank.in/web/personal-banking/nomination-facility',scope:'scopeSbi',reviewedOn:'2026-10-03',supporting:['https://sbi.bank.in/documents/17826/35696/Annual%2BReport%2BFY2025.pdf']},
 axis:{url:'https://application.axis.bank.in/webforms/axis-support/sub-issues/sub-issues/Bank-SB-update-11.aspx',scope:'scopeAxis',reviewedOn:'2026-10-03'},
 zerodha:{url:SOURCES.zerodha,scope:'scopeZerodhaAdd',reviewedOn:'2026-10-03'},
 zerodhaChange:{url:'https://support.zerodha.com/category/your-zerodha-account/nomination-process/articles/add-modify-or-remove-nominee',scope:'scopeZerodhaChange',reviewedOn:'2026-10-03'},
 groww:{url:'https://groww.in/help/stocks%2C-f%26o%2C-ipo-%26-mtf/searchable/how-can-i-change-my-nominee-on-groww--62',scope:'scopeGroww',reviewedOn:'2026-10-03'},
 hdfcmf:{url:SOURCES.hdfcmf,scope:'scopeHdfcMf',reviewedOn:'2026-10-04',formUrl:'https://files.hdfcfund.com/s3fs-public/2026-08/Nomination%20Registration%20Form%20310826%20V1%20(Revised).pdf',formEffectiveOn:'2026-09-01',supporting:['https://www.hdfcfund.com/services/forms']}
});
export function guideFor(a){
 const base={check:['checkLocation','askInstitution'],action:[a.type+'Guide','submitKeep'],offline:['offlineContact','offlineBring','offlineAsk','submitKeep'],url:a.type==='bank'?SOURCES.bank:SOURCES.sebi,label:'source',specific:false,scope:'scopeGeneral',reviewedOn:SOURCES.reviewedOn};
 const use=(id)=>Object.assign(base,GUIDE_REFERENCES[id],{id,label:'openOfficial',specific:true});
 if(a.type==='bank'&&a.institutionId==='hdfc-bank'&&a.product!=='unknown'){
  use('hdfc');const path=a.product==='deposit'?'hdfcDeposit':'hdfcSavings';
  base.check=[path,'askInstitution'];base.action=a.holding==='joint'?['jointGuide','offlineText','submitKeep']:[path,'hdfcAction','submitKeep'];
 }
 if(a.type==='bank'&&a.institutionId==='sbi'){
  use('sbi');base.action=['sbiAction','submitKeep'];
 }
 if(a.type==='bank'&&a.institutionId==='axis-bank'&&a.product==='savings'){
  use('axis');base.action=['axisStart','axisSubmit','submitKeep'];
 }
 if(a.type==='demat'&&a.institutionId==='zerodha'){
  use(a.nomination==='change'?'zerodhaChange':'zerodha');base.check=['zerodhaCheck','askInstitution'];
  base.action=a.nomination==='change'?['zerodhaChangeForms','zerodhaChangeSubmit','submitKeep']:['zerodhaAction','submitKeep'];
 }
 if(a.type==='demat'&&a.institutionId==='groww'){
  use('groww');base.check=['growwCheck','askInstitution'];base.action=['growwCheck','growwAction','submitKeep'];
 }
 if(a.type==='mf'&&a.institutionId==='hdfc-mf'&&a.mfMode==='folio'){
  use('hdfcmf');base.action=['hdfcMfGuide','submitKeep'];
 }
 if(a.type==='mf'&&a.mfMode==='demat')return {...base,check:['mfDematHelp'],action:['mfDematHelp'],offline:['mfDematHelp'],specific:false,scope:'scopeDematFunds'};
 if(a.type==='mf'&&a.mfMode==='unknown')return {...base,check:['identifyText','askInstitution'],action:['identifyText','askInstitution'],offline:['identifyText','askInstitution'],specific:false,scope:'scopeUnknownFunds'};
 if(a.holding==='unknown')base.action=['unknownContext',...base.action];
 if(a.holding==='joint'){
  // Do not infer digital eligibility for joint holders from a retail help page.
  base.action=['jointGuide',...base.offline];
  base.offline=['jointGuide',...base.offline];
 }
 return base;
}
