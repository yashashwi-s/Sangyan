// A searchable starting list, not a registry or a claim of institutional integration.
// Names identify the institution; guide coverage is determined separately in guides.js.
const rows = {
  bank: [
    ['hdfc-bank','HDFC Bank','hdfc एचडीएफसी एचडीएफसी बैंक এইচডিএফসি எச்டிஎஃப்சி ایچ ڈی ایف سی'],
    ['sbi','State Bank of India','sbi state bank एसबीआई स्टेट बैंक भारतीय स्टेट बैंक এসবিআই স্টেট ব্যাংক எஸ்பிஐ اسٹیٹ بینک'],
    ['icici-bank','ICICI Bank','icici आईसीआईसीआई আইসিআইসিআই ஐசிஐசிஐ آئی سی آئی سی آئی'],
    ['axis-bank','Axis Bank','axis एक्सिस অ্যাক্সিস ஆக்சிஸ் ایکسس'],
    ['pnb','Punjab National Bank','pnb पीएनबी पंजाब नेशनल পাঞ্জাব ন্যাশনাল பஞ்சாப் پنجاب نیشنل'],
    ['bank-of-baroda','Bank of Baroda','bob बड़ौदा बडोदा বরোদা பரோடா بڑودہ'],
    ['canara-bank','Canara Bank','canara केनरा কানাড়া கனரா کینرا'],
    ['union-bank','Union Bank of India','union यूनियन ইউনিয়ন யூனியன் یونین'],
    ['bank-of-india','Bank of India','boi बैंक ऑफ इंडिया ব্যাঙ্ক অফ ইন্ডিয়া பேங்க் ஆஃப் இந்தியா'],
    ['bank-of-maharashtra','Bank of Maharashtra','bom महाराष्ट्र মহারাষ্ট্র மகாராஷ்டிரா'],
    ['central-bank','Central Bank of India','cbi सेंट्रल সেন্ট্রাল சென்ட்ரல்'],
    ['indian-bank','Indian Bank','इंडियन इंडियन बँक ইন্ডিয়ান இந்தியன் انڈین'],
    ['iob','Indian Overseas Bank','iob इंडियन ओवरसीज இந்தியன் ஓவர்சீஸ்'],
    ['uco','UCO Bank','यूको ইউকো யூகோ'],
    ['punjab-sind','Punjab & Sind Bank','psb punjab sind पंजाब सिंध'],
    ['kotak','Kotak Mahindra Bank','kotak कोटक কোটাক கோட்டக் کوٹک'],
    ['idfc','IDFC FIRST Bank','idfc आईडीएफसी ஐடிஎஃப்சி'],
    ['indusind','IndusInd Bank','indusind इंडसइंड'],
    ['yes','YES Bank','yes यस ইয়েস யெஸ்'],
    ['federal','Federal Bank','federal फेडरल ஃபெடரல்'],
    ['idbi','IDBI Bank','idbi आईडीबीआई আইডিবিআই ஐடிபிஐ'],
    ['rbl','RBL Bank','rbl आरबीएल'],
    ['south-indian','South Indian Bank','south indian साउथ इंडियन சவுத் இந்தியன்'],
    ['karur-vysya','Karur Vysya Bank','kvb करूर वैश्य கரூர் வைஸ்யா'],
    ['karnataka','Karnataka Bank','karnataka कर्नाटक கர்நாடகா'],
    ['city-union','City Union Bank','cub city union सिटी यूनियन சிட்டி யூனியன்'],
    ['dcb','DCB Bank','dcb डीसीबी'],
    ['dhanlaxmi','Dhanlaxmi Bank','dhanlaxmi धनलक्ष्मी'],
    ['jammu-kashmir','Jammu & Kashmir Bank','jk j&k जम्मू कश्मीर'],
    ['tmb','Tamilnad Mercantile Bank','tmb tamilnad தமிழ்நாடு மெர்க்கன்டைல்'],
    ['au','AU Small Finance Bank','au एयू'],
    ['ujjivan','Ujjivan Small Finance Bank','ujjivan उज्जीवन'],
    ['equitas','Equitas Small Finance Bank','equitas इक्विटास ஈக்விடாஸ்'],
    ['hsbc','HSBC India','hsbc एचएसबीसी'],
    ['standard-chartered','Standard Chartered Bank','scb standard chartered स्टैंडर्ड चार्टर्ड'],
    ['dbs','DBS Bank India','dbs डीबीएस']
  ],
  demat: [
    ['zerodha','Zerodha','kite coin जेरोधा ज़ेरोधा জেরোধা ஜெரோதா زیرودھا'],
    ['groww','Groww','grow ग्रो গ্রো க்ரோ'],['angel','Angel One','angel broking एंजेल অ্যাঞ্জেল ஏஞ்சல்'],
    ['upstox','Upstox','rk sv अपस्टॉक्स அப்ஸ்டாக்ஸ்'],['icici-direct','ICICI Direct','icici securities आईसीआईसीआई'],
    ['hdfc-securities','HDFC Securities','hdfc sky एचडीएफसी सिक्योरिटीज'],['kotak-securities','Kotak Securities','kotak neo कोटक'],
    ['motilal','Motilal Oswal','motilal मोतीलाल'],['sbi-securities','SBI Securities','sbicap एसबीआई सिक्योरिटीज'],
    ['5paisa','5paisa','5 paisa five paisa पांच पैसा'],['iifl','IIFL Securities','iifl आईआईएफएल'],
    ['dhan','Dhan','धन ধন தன்'],['geojit','Geojit','geojit जियोजित'],['sharekhan','Sharekhan','sharekhan शेयरखान']
  ],
  mf: [
    ['hdfc-mf','HDFC Mutual Fund','hdfc एचडीएफसी এইচডিএফসি எச்டிஎஃப்சி ایچ ڈی ایف سی'],
    ['sbi-mf','SBI Mutual Fund','sbi एसबीआई এসবিআই எஸ்பிஐ'],['icici-mf','ICICI Prudential Mutual Fund','icici prudential आईसीआईसीआई'],
    ['axis-mf','Axis Mutual Fund','axis एक्सिस অ্যাক্সিস ஆக்சிஸ்'],['kotak-mf','Kotak Mahindra Mutual Fund','kotak कोटक'],
    ['nippon-mf','Nippon India Mutual Fund','nippon reliance निप्पॉन रिलायंस'],['aditya-mf','Aditya Birla Sun Life Mutual Fund','absl aditya birla आदित्य बिरला'],
    ['uti-mf','UTI Mutual Fund','uti यूटीआई'],['dsp-mf','DSP Mutual Fund','dsp डीएसपी'],['tata-mf','Tata Mutual Fund','tata टाटा টাটা டாடா'],
    ['mirae-mf','Mirae Asset Mutual Fund','mirae मिराए'],['ppfas','PPFAS Mutual Fund','parag parikh ppfas पराग पारिख'],
    ['franklin-mf','Franklin Templeton Mutual Fund','franklin फ्रैंकलिन'],['hsbc-mf','HSBC Mutual Fund','hsbc l&t एचएसबीसी'],
    ['quant-mf','quant Mutual Fund','quant क्वांट'],['quantum-mf','Quantum Mutual Fund','quantum क्वांटम'],
    ['bandhan-mf','Bandhan Mutual Fund','bandhan idfc बंधन বন্ধন'],['edelweiss-mf','Edelweiss Mutual Fund','edelweiss एडलवाइस'],
    ['motilal-mf','Motilal Oswal Mutual Fund','motilal मोतीलाल'],['canara-mf','Canara Robeco Mutual Fund','canara robeco केनरा'],
    ['invesco-mf','Invesco Mutual Fund','invesco इन्वेस्को'],['sundaram-mf','Sundaram Mutual Fund','sundaram सुंदरम சுந்தரம்'],
    ['lic-mf','LIC Mutual Fund','lic एलआईसी'],['union-mf','Union Mutual Fund','union यूनियन'],['bajaj-mf','Bajaj Finserv Mutual Fund','bajaj बजाज']
  ]
};
// Search words can suggest an institution, but only complete explicit aliases
// may identify one automatically. A generic "bank" must remain a custom record.
const exactAliases={"hdfc-bank":["hdfc","एचडीएफसी","एचडीएफसी बैंक","এইচডিএফসি","எச்டிஎஃப்சி","ایچ ڈی ایف سی","એચ ડી એફ સી","એચ ડી એફ સી બેંક","ਐਚ ਡੀ ਐਫ ਸੀ","ਐਚ ਡੀ ਐਫ ਸੀ ਬੈਂਕ","ಎಚ್ ಡಿ ಎಫ್ ಸಿ","ಎಚ್ ಡಿ ಎಫ್ ಸಿ ಬ್ಯಾಂಕ್","హెచ్ డీ ఎఫ్ సీ","హెచ్ డీ ఎఫ్ సీ బ్యాంక్","എച്ച് ഡി എഫ് സി","എച്ച് ഡി എഫ് സി ബാങ്ക്","এইচ ডি এফ চি","এইচ ডি এফ চি বেংক","ଏଚ୍ ଡି ଏଫ୍ ସି","ଏଚ୍ ଡି ଏଫ୍ ସି ବ୍ୟାଙ୍କ","एच डी एफ सी","एच डी एफ सी बैंक"],"sbi":["state bank","एसबीआई","स्टेट बैंक","भारतीय स्टेट बैंक","এসবিআই","স্টেট ব্যাংক","எஸ்பிஐ","اسٹیٹ بینک","એસ બી આઇ","ਐਸ ਬੀ ਆਈ","ಎಸ್ ಬಿ ಐ","ఎస్ బీ ఐ","എസ് ബി ഐ","এছ বি আই","ଏସ୍ ବି ଆଇ","एस बी आई"],"icici-bank":["icici","आईसीआईसीआई","আইসিআইসিআই","ஐசிஐசிஐ","آئی سی آئی سی آئی"],"axis-bank":["axis","एक्सिस","অ্যাক্সিস","ஆக்சிஸ்","ایکسس","એક્સિસ","એક્સિસ બેંક","ਐਕਸਿਸ","ਐਕਸਿਸ ਬੈਂਕ","ಆಕ್ಸಿಸ್","ಆಕ್ಸಿಸ್ ಬ್ಯಾಂಕ್","యాక్సిస్","యాక్సిస్ బ్యాంక్","ആക്സിസ്","ആക്സിസ് ബാങ്ക്","এক্সিছ","এক্সিছ বেংক","ଆକ୍ସିସ୍","ଆକ୍ସିସ୍ ବ୍ୟାଙ୍କ","एक्सिस बैंक"],"pnb":["पीएनबी","पंजाब नेशनल","পাঞ্জাব ন্যাশনাল","پنجاب نیشنل"],"bank-of-baroda":["bob","बड़ौदा","बडोदा","বরোদা","பரோடா","بڑودہ"],"canara-bank":["canara","केनरा","কানাড়া","கனரா","کینرا"],"union-bank":["union","यूनियन","ইউনিয়ন","யூனியன்","یونین"],"bank-of-india":["boi","बैंक ऑफ इंडिया","ব্যাঙ্ক অফ ইন্ডিয়া","பேங்க் ஆஃப் இந்தியா"],"bank-of-maharashtra":["bom","महाराष्ट्र","মহারাষ্ট্র","மகாராஷ்டிரா"],"central-bank":["cbi","सेंट्रल","সেন্ট্রাল","சென்ட்ரல்"],"indian-bank":["इंडियन बैंक","इंडियन बँक"],"iob":["इंडियन ओवरसीज","இந்தியன் ஓவர்சீஸ்"],"uco":["यूको","ইউকো","யூகோ"],"punjab-sind":["psb","punjab sind","पंजाब सिंध"],"zerodha":["kite","coin","जेरोधा","ज़ेरोधा","জেরোধা","ஜெரோதா","زیرودھا","ઝેરોધા","ਜ਼ੇਰੋਧਾ","ಜೆರೋಧಾ","జెరోధా","സെരോധാ","জেৰোধা","ଜେରୋଧା"],"groww":["grow","ग्रो","গ্রো","க்ரோ","ગ્રો","ਗ੍ਰੋ","ಗ್ರೋ","గ్రో","ഗ്രോ","গ্ৰো","ଗ୍ରୋ"],"angel":["angel broking","एंजेल","অ্যাঞ্জেল","ஏஞ்சல்"],"upstox":["rk sv","अपस्टॉक्स","அப்ஸ்டாக்ஸ்"],"icici-direct":["icici securities","आईसीआईसीआई"],"hdfc-securities":["hdfc sky","एचडीएफसी सिक्योरिटीज"],"kotak-securities":["kotak neo","कोटक"],"motilal":["मोतीलाल"],"sbi-securities":["sbicap","एसबीआई सिक्योरिटीज"],"5paisa":["5 paisa","five paisa","पांच पैसा"],"iifl":["आईआईएफएल"],"dhan":["धन","ধন","தன்"],"geojit":["जियोजित"],"sharekhan":["शेयरखान"],"hdfc-mf":["hdfc","एचडीएफसी","এইচডিএফসি","எச்டிஎஃப்சி","ایچ ڈی ایف سی","એચ ડી એફ સી","એચ ડી એફ સી મ્યુચ્યુઅલ ફંડ","ਐਚ ਡੀ ਐਫ ਸੀ","ਐਚ ਡੀ ਐਫ ਸੀ ਮਿਊਚੁਅਲ ਫੰਡ","ಎಚ್ ಡಿ ಎಫ್ ಸಿ","ಎಚ್ ಡಿ ಎಫ್ ಸಿ ಮ್ಯೂಚುವಲ್ ಫಂಡ್","హెచ్ డీ ఎఫ్ సీ","హెచ్ డీ ఎఫ్ సీ మ్యూచువల్ ఫండ్","എച്ച് ഡി എഫ് സി","എച്ച് ഡി എഫ് സി മ്യൂച്വൽ ഫണ്ട്","এইচ ডি এফ চি","এইচ ডি এফ চি মিউচুৱেল ফাণ্ড","ଏଚ୍ ଡି ଏଫ୍ ସି","ଏଚ୍ ଡି ଏଫ୍ ସି ମ୍ୟୁଚୁଆଲ୍ ଫଣ୍ଡ","एच डी एफ सी","एच डी एफ सी म्यूचुअल फंड"],"sbi-mf":["sbi","एसबीआई","এসবিআই","எஸ்பிஐ"],"icici-mf":["icici","icici prudential","आईसीआईसीआई"],"axis-mf":["axis","एक्सिस","অ্যাক্সিস","ஆக்சிஸ்"],"kotak-mf":["kotak","कोटक"],"nippon-mf":["nippon","reliance","निप्पॉन","रिलायंस"],"aditya-mf":["absl","aditya birla","आदित्य बिरला"],"uti-mf":["uti","यूटीआई"],"dsp-mf":["dsp","डीएसपी"],"ppfas":["parag parikh","पराग पारिख"],"hsbc-mf":["hsbc","l&t","एचएसबीसी"],"bandhan-mf":["bandhan","idfc","बंधन","বন্ধন"],"canara-mf":["canara robeco","केनरा"],"lic-mf":["lic","एलआईसी"]};
export const INSTITUTIONS=Object.entries(rows).flatMap(([type,items])=>items.map(([id,name,aliases])=>({id,name,type,aliases:aliases+' '+(exactAliases[id]||[]).join(' ')})));
export function normalise(value){return String(value).normalize('NFKC').toLocaleLowerCase().replace(/[^\p{L}\p{M}\p{N}]+/gu,' ').trim();}
const searchIndex=new Map(INSTITUTIONS.map(item=>[item.id,{name:normalise(item.name),search:normalise(item.name+' '+item.aliases),exact:[item.name,item.id,...(exactAliases[item.id]||[])].map(alias=>normalise(alias).replace(/\s/g,''))}]));
export function institutionById(id){return INSTITUTIONS.find(item=>item.id===id);}
export function matchInstitution(type,value){const q=normalise(value).replace(/\s/g,'');if(!q)return undefined;const matches=INSTITUTIONS.filter(item=>item.type===type&&searchIndex.get(item.id).exact.includes(q));return matches.length===1?matches[0]:undefined;}
export function searchInstitutions(type,value,limit=8){const q=normalise(value),terms=q.split(' ').filter(Boolean);return INSTITUTIONS.filter(item=>item.type===type&&terms.every(term=>searchIndex.get(item.id).search.includes(term))).sort((a,b)=>Number(searchIndex.get(b.id).name.startsWith(q))-Number(searchIndex.get(a.id).name.startsWith(q))||a.name.localeCompare(b.name)).slice(0,limit);}
