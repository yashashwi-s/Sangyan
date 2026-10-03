"""Validate real staged files, exact public-copy hashes and pinned model provenance.
This verifies technical media integrity; it cannot certify fluent pronunciation/meaning.
"""
import argparse,hashlib,json,pathlib,subprocess,sys
ROOT=pathlib.Path(__file__).resolve().parents[1]
CANDIDATES=json.loads((ROOT/'audio/candidates.json').read_text());SOURCES=json.loads((ROOT/'audio/candidate-model-sources.json').read_text())
RULES=json.loads((ROOT/'audio/pronunciation-candidates.json').read_text())
p=argparse.ArgumentParser();p.add_argument('--staging',required=True);p.add_argument('--complete',action='store_true');p.add_argument('--language',choices=CANDIDATES,action='append');args=p.parse_args()
stage=pathlib.Path(args.staging).resolve();source=json.loads((stage/'public-text.json').read_text());results={};errors={}
for code in args.language or CANDIDATES:
 try:
  report=json.loads((stage/'reports'/f'recordings-{code}.json').read_text())
  if report['language']!=code or report['model']!=SOURCES[code] or report['license']!='CC-BY-NC-4.0' or report['fluentReview'] is not False:raise ValueError('Unverified model/licence/review metadata')
  revision=hashlib.sha256(json.dumps({'text':source[code],'rules':RULES[code],'model':SOURCES[code],'generator':3},ensure_ascii=False,sort_keys=True).encode()).hexdigest()[:12]
  if report['revision']!=revision:raise ValueError('Stale text, pronunciation rules or synthesis revision')
  expected=set(source[code]) if args.complete else {'homeTitle','nomineeExplain','receiptExample','registeredExample','helpScopeText','passwordHelp','privacyDetail'}
  if set(report['entries'])!=expected or (args.complete and report.get('scope')!='complete'):raise ValueError('Incomplete staged clip set')
  total=0;durations=[]
  for key,entry in report['entries'].items():
   if entry['textHash']!=hashlib.sha256(source[code][key].encode()).hexdigest():raise ValueError(f'Stale public text: {key}')
   clip=stage/'audio'/code/report['revision']/(key+'.mp3');data=clip.read_bytes()
   if entry['sha256']!=hashlib.sha256(data).hexdigest() or entry['bytes']!=len(data):raise ValueError(f'Changed recording: {key}')
   media=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','stream=codec_name,sample_rate,channels:format=duration','-of','json',str(clip)]))
   stream=media['streams'][0];duration=float(media['format']['duration'])
   if stream['codec_name']!='mp3' or stream['sample_rate']!='24000' or stream['channels']!=1 or not 0<duration<91 or abs(duration-entry['seconds'])>.2:raise ValueError(f'Invalid format/duration: {key}')
   subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-xerror','-i',str(clip),'-f','null','-'],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
   durations.append(duration);total+=len(data)
  results[code]={'clips':len(expected),'bytes':total,'seconds':round(sum(durations),3),'revision':report['revision'],'technicalMediaValid':True,'fluentReview':False}
  print(code,'VERIFIED',len(expected),'clips',flush=True)
 except Exception as e:errors[code]=str(e);print(code,'FAILED',str(e),flush=True)
(stage/('validation-complete.json' if args.complete else 'validation-samples.json')).write_text(json.dumps({'results':results,'errors':errors,'note':'Technical media validation only; pronunciation, accent and meaning need fluent listening review.'},indent=2)+'\n')
if errors:sys.exit(1)
