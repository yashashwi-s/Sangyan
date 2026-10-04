"""Independently inspect every staged Nepali MP3 before optional local promotion."""
import argparse,hashlib,json,pathlib,shutil,subprocess
parser=argparse.ArgumentParser();parser.add_argument('--staging',required=True);parser.add_argument('--promote',action='store_true');args=parser.parse_args()
app=pathlib.Path(__file__).resolve().parents[1];stage=pathlib.Path(args.staging).resolve()
if stage==app or app in stage.parents:parser.error('Staging must be outside app.')
report=json.loads((stage/'reports/recordings-ne.json').read_text());model=json.loads((app/'audio/piper-ne-model-source.json').read_text())
text=json.loads((app/'translations/ne.json').read_text());retired={'voiceSetup','voiceSetupHelp','androidVoice','appleVoice','voiceFallback','refreshVoices','chooseVoice'};text={k:v for k,v in text.items() if k not in retired}
if report['model']!=model or report['scope']!='complete' or report['fluentReview'] is not False or report['auditoryReview'] is not False or report['license']!='MIT voice repository / CC0 dataset' or report['aliases']!={}:raise ValueError('Provenance/review gate failed')
revision=hashlib.sha256(json.dumps({'text':text,'model':model,'generator':'piper-ne-1','engine':'piper-tts-1.8.0','aliases':{}},ensure_ascii=False,sort_keys=True).encode()).hexdigest()[:12]
if report['revision']!=revision or len(text)!=357 or set(report['entries'])!=set(text):raise ValueError('Incomplete or stale source/revision')
preflight=json.loads((stage/'reports/preflight-ne.json').read_text())
if preflight['keys']!=357 or preflight['unknownPhonemes'] or preflight['aliases']:raise ValueError('Phoneme coverage gate failed')
files=stage/'audio/ne'/revision;durations=[]
for key,entry in report['entries'].items():
 path=files/(key+'.mp3')
 if entry['spoken']!=text[key] or entry['textHash']!=hashlib.sha256(text[key].encode()).hexdigest() or entry['sha256']!=hashlib.sha256(path.read_bytes()).hexdigest() or entry['bytes']!=path.stat().st_size:raise ValueError('Source/media mismatch: '+key)
 info=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(path)]));streams=info['streams'];duration=float(info['format']['duration'])
 if len(streams)!=1 or streams[0]['codec_name']!='mp3' or streams[0]['channels']!=1 or streams[0]['sample_rate']!='24000' or not .2<duration<90 or abs(duration-entry['seconds'])>.25:raise ValueError('MP3 format/duration gate failed: '+key)
 subprocess.run(['ffmpeg','-nostdin','-hide_banner','-loglevel','error','-i',str(path),'-f','null','-'],check=True)
 durations.append(duration)
evidence={'language':'ne','revision':revision,'clips':357,'bytes':sum(e['bytes'] for e in report['entries'].values()),'mp3Seconds':sum(durations),'minSeconds':min(durations),'maxSeconds':max(durations),'failures':[],'allClipsDecoded':True,'allSourcesMatch':True,'aliases':{},'fluentReview':False,'auditoryReview':False,'promoted':args.promote}
(stage/'reports/validation-ne.json').write_text(json.dumps(evidence,indent=2)+'\n')
if args.promote:
 target=app/'dist/audio/ne'/revision;target.mkdir(parents=True,exist_ok=True)
 for key in text:shutil.copyfile(files/(key+'.mp3'),target/(key+'.mp3'))
 report['released']=True;(app/'audio/recordings-ne.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(evidence,indent=2))
