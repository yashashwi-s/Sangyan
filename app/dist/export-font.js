// Only a small public script font is fetched. The family record never leaves the page.
const fonts={mni:'noto-sans-meetei-mayek.woff2',sat:'noto-sans-ol-chiki.woff2'};
const licences={mni:'OFL-meetei-mayek.txt',sat:'OFL-ol-chiki.txt'};
export async function exportFont(language,fetcher=fetch){
 if(!fonts[language])return '';
 const response=await fetcher('/fonts/'+fonts[language]);
 if(!response.ok)throw Error('Script font unavailable');
 const data=new Uint8Array(await response.arrayBuffer());
 if(!data.length||data.length>10000)throw Error('Invalid script font');
 let binary='';for(const byte of data)binary+=String.fromCharCode(byte);
 const licenceResponse=await fetcher('/fonts/'+licences[language]);
 if(!licenceResponse.ok)throw Error('Font licence unavailable');
 const licence=await licenceResponse.text();
 if(!licence.includes('SIL OPEN FONT LICENSE')||licence.length>12000)throw Error('Invalid font licence');
 return `/* ${licence.replaceAll('*/','* /')} */@font-face{font-family:VirasatExport;src:url(data:font/woff2;base64,${btoa(binary)}) format('woff2');font-weight:400;font-style:normal}body{font-family:VirasatExport,system-ui,sans-serif!important}`;
}
