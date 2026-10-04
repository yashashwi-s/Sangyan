// Release scope: English plus 20 Eighth Schedule languages. Bodo and Kashmiri are excluded.
// Text packs load only on demand; audio availability is a separate checked release state.
export const languageInfo=[
 ['en','English','English'],['hi','हिन्दी','Hindi'],['as','অসমীয়া','Assamese'],
 ['bn','বাংলা','Bengali'],['doi','डोगरी','Dogri'],
 ['gu','ગુજરાતી','Gujarati'],['kn','ಕನ್ನಡ','Kannada'],
 ['kok','कोंकणी','Konkani'],['mai','मैथिली','Maithili'],['ml','മലയാളം','Malayalam'],
 ['mni','ꯃꯤꯇꯩꯂꯣꯟ','Manipuri · Meitei'],['mr','मराठी','Marathi'],['ne','नेपाली','Nepali'],
 ['or','ଓଡ଼ିଆ','Odia'],['pa','ਪੰਜਾਬੀ','Punjabi'],['sa','संस्कृतम्','Sanskrit'],
 ['sat','ᱥᱟᱱᱛᱟᱲᱤ','Santali'],['sd','سنڌي','Sindhi'],['ta','தமிழ்','Tamil'],
 ['te','తెలుగు','Telugu'],['ur','اردو','Urdu']
];
export const audioLanguages=["en","hi","bn","mr","ta","ur","gu","pa","kn","te","ml","as","or","doi","mai","ne"];
export const isRTL=language=>['ur','sd'].includes(language);
export const isKnownLanguage=language=>languageInfo.some(([code])=>code===language);
