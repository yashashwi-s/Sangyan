import {test} from 'node:test';import assert from 'node:assert/strict';import {checkDeploymentBudget} from '../scripts/delivery-budget.mjs';
test('upload checks distinguish actual byte/file ceilings from unverified plan and traffic capacity',()=>{
 assert.equal(checkDeploymentBudget({bytes:100_000_000,files:15000},'hobby').fits,true);
 assert.equal(checkDeploymentBudget({bytes:100_000_001,files:10},'hobby').fits,false);
 assert.equal(checkDeploymentBudget({bytes:200_000_000,files:9500},'pro').fits,true);
 assert.equal(checkDeploymentBudget({bytes:1,files:15001},'pro').fits,false);
 assert.equal(checkDeploymentBudget({bytes:1_000_000_001,files:1},'pro').fits,false);
 assert.equal(checkDeploymentBudget({bytes:1,files:1},'pro').accountPlanVerified,false);
 for(const plan of ['unknown','__proto__'])assert.throws(()=>checkDeploymentBudget({bytes:1,files:1},plan));
 for(const bytes of [-1,NaN,Infinity])assert.throws(()=>checkDeploymentBudget({bytes,files:1},'pro'));
});
