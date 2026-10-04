"""Resumable build-only MMS candidate evaluation; outputs stay outside the app.
Use the isolated audio environment's Python. Only fixed public dictionaries are exported.
"""
import argparse,json,pathlib,subprocess,sys,time
ROOT=pathlib.Path(__file__).resolve().parents[1]
CANDIDATES=json.loads((ROOT/'audio/candidates.json').read_text())
p=argparse.ArgumentParser();p.add_argument('--models',required=True);p.add_argument('--staging',required=True);p.add_argument('--phase',choices=['preflight','sample','full'],required=True);p.add_argument('--language',choices=CANDIDATES,action='append');args=p.parse_args()
langs=args.language or list(CANDIDATES);stage=pathlib.Path(args.staging).resolve()
if stage==ROOT or ROOT in stage.parents:p.error('Staging must be outside the app.')
stage.mkdir(parents=True,exist_ok=True);source=stage/'public-text.json';progress=stage/'progress.json'
cmd=['node',str(ROOT/'scripts/export-audio-text.mjs')]
for code in CANDIDATES:cmd+=['--language',code]
subprocess.run(cmd+['--output',str(source)],check=True)
results={};errors={}
for code in langs:
 base=[sys.executable,str(ROOT/'scripts/generate-audio.py'),'--models',args.models,'--language',code,'--source',str(source),'--staging',str(stage)]
 phases=['preflight'] if args.phase=='preflight' else ['preflight','sample'] if args.phase=='sample' else ['preflight','sample','full']
 for phase in phases:
  log=stage/f'{code}-{phase}.log';start=time.time()
  with log.open('w') as out:result=subprocess.run(base+(['--preflight'] if phase=='preflight' else ['--sample'] if phase=='sample' else []),stdout=out,stderr=subprocess.STDOUT)
  info={'phase':phase,'exitCode':result.returncode,'seconds':round(time.time()-start,2),'log':str(log)}
  results.setdefault(code,[]).append(info)
  progress.write_text(json.dumps({'requestedPhase':args.phase,'results':results,'errors':errors},indent=2)+'\n')
  print(code,phase,'PASS' if result.returncode==0 else 'FAIL',info['seconds'],'seconds',flush=True)
  if result.returncode:
   errors[code]=info;progress.write_text(json.dumps({'requestedPhase':args.phase,'results':results,'errors':errors},indent=2)+'\n');break
if errors:raise SystemExit('Candidate failures retained in progress.json; no public audio was enabled.')
