"""Stage exact public Nepali guidance using an independent Piper voice; never promote."""
import argparse,collections,hashlib,json,os,pathlib,subprocess,time,wave,shutil
from importlib.metadata import version
parser=argparse.ArgumentParser();parser.add_argument('--models',required=True);parser.add_argument('--source',required=True);parser.add_argument('--staging',required=True);parser.add_argument('--sample',action='store_true');args=parser.parse_args()
app=pathlib.Path(__file__).resolve().parents[1];root=pathlib.Path(args.models).resolve();stage=pathlib.Path(args.staging).resolve();source_path=pathlib.Path(args.source).resolve()
if stage==app or app in stage.parents:parser.error('Staging must be outside app.')
stage.mkdir(parents=True,exist_ok=True);os.chdir(stage)
import numpy as np
import onnxruntime
onnxruntime.disable_telemetry_events()
from piper import PiperVoice
if version('piper-tts')!='1.8.0' or version('onnxruntime')!='1.30.0':raise ValueError('Use the pinned Piper/ONNX build runtime')
texts=json.loads(source_path.read_text())
expected={**json.loads((app/'translations/guidance-ne.json').read_text()),**json.loads((app/'translations/resilience-ne.json').read_text())}
if texts.get('ne')!=expected or args.sample:parser.error('Only the exact complete current public supplemental Nepali source is accepted.')
texts=texts['ne'];source=json.loads((root/'source.json').read_text())
if source.get('repo')!='rhasspy/piper-voices' or source.get('revision')!='c10ece1aade47bb51c153c893d14e5bf8e5b7117' or source.get('language')!='ne_NP' or source.get('repoLicense')!='MIT' or source.get('datasetLicense')!='CC0':raise ValueError('Public voice provenance guard failed')
for file in source['files']:
 if pathlib.Path(file['path']).name!=file['path'] or hashlib.sha256((root/file['path']).read_bytes()).hexdigest()!=file['sha256']:raise ValueError('Voice-file checksum mismatch')
voice=PiperVoice.load(root/'ne_NP-chitwan-medium.onnx')
if voice.config.espeak_voice!='ne':raise ValueError('Nepali phonemizer required')
phonemes={key:voice.phonemize(text) for key,text in texts.items()};unknown={}
for key,sentences in phonemes.items():
 missing=collections.Counter(p for sentence in sentences for p in sentence if p not in voice.config.phoneme_id_map)
 if missing:unknown[key]=dict(missing)
reports=stage/'reports';reports.mkdir(parents=True,exist_ok=True)
(reports/'preflight-ne.json').write_text(json.dumps({'language':'ne','keys':len(texts),'unknownPhonemes':unknown,'phonemes':phonemes,'aliases':{},'fluentReview':False,'auditoryReview':False},ensure_ascii=False,indent=2)+'\n')
if unknown:raise ValueError('Unknown phonemes; do not drop/substitute text')
revision=hashlib.sha256(json.dumps({'text':texts,'model':source,'generator':'support-piper-ne-1','engine':'piper-tts-1.8.0','aliases':{}},ensure_ascii=False,sort_keys=True).encode()).hexdigest()[:12]
out=stage/'audio/ne'/('support-'+revision);out.mkdir(parents=True,exist_ok=True)
keys=['homeTitle','nomineeExplain','receiptExample','registeredExample','helpScopeText','passwordHelp','privacyDetail'] if args.sample else list(texts)
previous_path=stage/'reports/support-recordings-ne.json';previous=json.loads(previous_path.read_text()) if previous_path.exists() else {};entries={};start=time.time()
for n,key in enumerate(keys):
 target=out/(key+'.mp3');meta=out/(key+'.json');text=texts[key]
 if target.exists() and meta.exists():
  prior=json.loads(meta.read_text())
  if prior['textHash']==hashlib.sha256(text.encode()).hexdigest() and prior['sha256']==hashlib.sha256(target.read_bytes()).hexdigest():entries[key]=prior;continue
 prior=previous.get('entries',{}).get(key);old_file=stage/'audio/ne'/('support-'+previous.get('revision',''))/(key+'.mp3')
 if prior and previous.get('model')==source and prior.get('textHash')==hashlib.sha256(text.encode()).hexdigest() and old_file.is_file() and prior['sha256']==hashlib.sha256(old_file.read_bytes()).hexdigest():
  shutil.copyfile(old_file,target);meta.write_text(json.dumps(prior,ensure_ascii=False));entries[key]=prior;continue
 wav=out/(key+'.wav')
 with wave.open(str(wav),'wb') as f:voice.synthesize_wav(text,f)
 with wave.open(str(wav),'rb') as f:
  rate=f.getframerate();channels=f.getnchannels();samples=np.frombuffer(f.readframes(f.getnframes()),dtype='<i2');seconds=len(samples)/rate
 if rate!=22050 or channels!=1 or not .2<seconds<90 or np.count_nonzero(np.abs(samples.astype(np.int32))>100)<160:raise ValueError('Invalid/silent/unexpected-duration waveform: '+key)
 subprocess.run(['ffmpeg','-nostdin','-hide_banner','-loglevel','error','-y','-i',str(wav),'-af','loudnorm=I=-19:TP=-2:LRA=7','-ar','24000','-ac','1','-codec:a','libmp3lame','-b:a','32k','-metadata','artist=Virasat; speech voice: Piper Chitwan','-metadata','copyright=Voice repository MIT; dataset CC0','-metadata','title='+key,str(target)],check=True)
 subprocess.run(['ffmpeg','-nostdin','-hide_banner','-loglevel','error','-i',str(target),'-f','null','-'],check=True)
 entries[key]={'textHash':hashlib.sha256(text.encode()).hexdigest(),'spoken':text,'bytes':target.stat().st_size,'seconds':round(seconds,3),'sha256':hashlib.sha256(target.read_bytes()).hexdigest()}
 meta.write_text(json.dumps(entries[key],ensure_ascii=False)+'\n');wav.unlink()
 if n%25==0:print('ne',n+1,'/',len(keys),'elapsed',round(time.time()-start),flush=True)
report={'language':'ne','revision':revision,'model':source,'engine':'Piper 1.8.0 (GPL-3.0 build-only)','license':'MIT voice repository / CC0 dataset','fluentReview':False,'auditoryReview':False,'aliases':{},'scope':'complete','generator':'support-piper-ne-1','released':False,'entries':entries}
(reports/'support-recordings-ne.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print('ne READY',len(entries),'bytes',sum(e['bytes'] for e in entries.values()),'seconds',round(sum(e['seconds'] for e in entries.values())),flush=True)
