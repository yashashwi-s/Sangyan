// Current documented CLI source-upload ceilings; these are not traffic capacity promises.
export const DEPLOYMENT_LIMITS=Object.freeze({hobby:{bytes:100_000_000,files:15000},pro:{bytes:1_000_000_000,files:15000}});
export function checkDeploymentBudget({bytes,files},plan){
 if(!Object.hasOwn(DEPLOYMENT_LIMITS,plan)||![bytes,files].every(n=>Number.isSafeInteger(n)&&n>=0))throw Error('Provide a supported, explicitly selected plan and a valid measured inventory');
 const limits=DEPLOYMENT_LIMITS[plan];return {plan,limits,bytes,files,fits:bytes<=limits.bytes&&files<=limits.files,accountPlanVerified:false,source:'https://vercel.com/docs/limits',reviewedOn:'2026-10-04'};
}
