"""Promote complete, technically checked public recordings as explicitly unreviewed drafts.
No model/runtime is copied into the website. --check performs the same gates without edits.
This is a release step, not a fluent-listening approval or an internet deployment.
"""
import argparse,json,pathlib,re,shutil,subprocess,sys
ROOT=pathlib.Path(__file__).resolve().parents[1]
CANDIDATES=json.loads((ROOT/'audio/candidates.json').read_text())
p=argparse.ArgumentParser();p.add_argument('--staging',required=True);p.add_argument('--language',choices=CANDIDATES,action='append',required=True);p.add_argument('--check',action='store_true');args=p.parse_args()
stage=pathlib.Path(args.staging).resolve()
if stage==ROOT or ROOT in stage.parents:raise SystemExit('Staging must stay outside the application directory.')
codes=list(dict.fromkeys(args.language));options=[item for code in codes for item in ('--language',code)]
# Re-read the current effective public copy, including locale authoring corrections.
fresh=stage/'promotion-public-text.json'
subprocess.run(['node',str(ROOT/'scripts/export-audio-text.mjs'),*options,'--output',str(fresh)],check=True)
current=json.loads(fresh.read_text());staged=json.loads((stage/'public-text.json').read_text())
for code in codes:
 if current[code]!=staged.get(code):raise SystemExit(f'Public text changed after synthesis: {code}')
# Decode and inspect every actual file; reports alone cannot pass this gate.
subprocess.run([sys.executable,str(ROOT/'scripts/validate-audio-candidates.py'),'--staging',str(stage),'--complete',*options],check=True)
reports={code:json.loads((stage/'reports'/f'recordings-{code}.json').read_text()) for code in codes}
for code,report in reports.items():
 if not re.fullmatch('[a-f0-9]{12}',report['revision']):raise SystemExit(f'Invalid revision: {code}')
 if any(not re.fullmatch('[a-zA-Z0-9]+',key) for key in report['entries']):raise SystemExit(f'Invalid key: {code}')
registry=ROOT/'dist/languages.js';content=registry.read_text()
match=re.search(r'export const audioLanguages=(\[[^;]+\]);',content)
if not match:raise SystemExit('Missing audio-language registry')
existing=json.loads(match[1].replace("'",'"'));released=list(dict.fromkeys(existing+codes))
source=json.loads((ROOT/'audio/public-text.json').read_text())
source.update(current)
if set(source)!=set(released):raise SystemExit('Released source and language registry disagree')
print(json.dumps({'languages':codes,'clips':sum(len(r['entries']) for r in reports.values()),'bytes':sum(e['bytes'] for r in reports.values() for e in r['entries'].values()),'fluentReview':False,'checkOnly':args.check}),flush=True)
if args.check:sys.exit(0)
for code,report in reports.items():
 destination=ROOT/'dist/audio'/code/report['revision']
 destination.mkdir(parents=True,exist_ok=True)
 for key in report['entries']:shutil.copyfile(stage/'audio'/code/report['revision']/(key+'.mp3'),destination/(key+'.mp3'))
 shutil.copyfile(stage/'reports'/f'recordings-{code}.json',ROOT/'audio'/f'recordings-{code}.json')
(ROOT/'audio/public-text.json').write_text(json.dumps(source,ensure_ascii=False,indent=2)+'\n')
registry.write_text(content[:match.start(1)]+json.dumps(released,separators=(',',':'))+content[match.end(1):])
subprocess.run(['node',str(ROOT/'scripts/build-audio.mjs')],check=True)
subprocess.run(['node',str(ROOT/'scripts/build-locales.mjs')],check=True)
print('Draft files are integrated locally. Update credits/support evidence and run release checks before publishing.',flush=True)
