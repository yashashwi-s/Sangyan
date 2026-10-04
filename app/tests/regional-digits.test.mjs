import {test} from 'node:test';
import assert from 'node:assert/strict';
import {normaliseDigits,emptyAccount,emptyTracker,validateAccount,saveWorkspace,restoreWorkspace,validDate,familySummary} from '../dist/tracker.js';

const fixtures=[
 ['Latin','0123456789'],['Devanagari','०१२३४५६७८९'],['Bengali/Assamese','০১২৩৪৫৬৭৮৯'],
 ['Gurmukhi','੦੧੨੩੪੫੬੭੮੯'],['Gujarati','૦૧૨૩૪૫૬૭૮૯'],['Odia','୦୧୨୩୪୫୬୭୮୯'],
 ['Tamil decimal','௦௧௨௩௪௫௬௭௮௯'],['Telugu','౦౧౨౩౪౫౬౭౮౯'],['Kannada','೦೧೨೩೪೫೬೭೮೯'],
 ['Malayalam','൦൧൨൩൪൫൬൭൮൯'],['Arabic','٠١٢٣٤٥٦٧٨٩'],['Eastern Arabic','۰۱۲۳۴۵۶۷۸۹'],
 ['Ol Chiki','᱐᱑᱒᱓᱔᱕᱖᱗᱘᱙']
];
test('regional date and last-four input preserves numeric value through validation and saved drafts',()=>{
 for(const [name,digits] of fixtures){
  assert.equal(normaliseDigits(digits),'0123456789',name);
  const nativeDate=`${digits[2]}${digits[0]}${digits[2]}${digits[5]}-${digits[0]}${digits[9]}-${digits[0]}${digits[8]}`;
  const checkedOn=normaliseDigits(nativeDate),last4=normaliseDigits(digits[0]+digits[0]+digits[7]+digits[8]);
  assert.equal(checkedOn,'2025-09-08',name);assert.ok(validDate(checkedOn),name);
  const a=validateAccount({...emptyAccount(),institution:'Custom bank',type:'bank',checkedOn,last4});
  const tracker=emptyTracker();tracker.accounts.push(a);
  const restored=restoreWorkspace(saveWorkspace(tracker,null,null,'en'));
  assert.equal(restored.tracker.accounts[0].last4,'0078',name);
  assert.equal(restored.tracker.accounts[0].checkedOn,'2025-09-08',name);
  assert.equal(familySummary(restored.tracker).accounts[0].last4,'0078',name);
 }
});
test('digit normalization does not turn letters or non-decimal numerals into a valid identifier',()=>{
 assert.equal(normaliseDigits('૨0੬٨'),'2068');
 assert.equal(normaliseDigits('૦O૧I'),'0O1I');
 assert.equal(normaliseDigits('௰Ⅳ'),'௰Ⅳ');
 assert.throws(()=>validateAccount({...emptyAccount(),institution:'Custom bank',last4:normaliseDigits('૦O૧I')}),/invalidAccount/);
 assert.equal(validDate(normaliseDigits('૨૦૨૫-૦૨-૩૧')),false);
});
