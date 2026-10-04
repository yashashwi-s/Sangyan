"""Fetch one independently public, pinned Nepali ONNX voice. Build-only, no credentials."""
import argparse,hashlib,json,pathlib,urllib.request
REPO='rhasspy/piper-voices'
REVISION='c10ece1aade47bb51c153c893d14e5bf8e5b7117'
FILES={
 'MODEL_CARD':(276,'127e85643329612dbebd7a071dd0f69a03439ceecdec5b637ed8641379b4ba00'),
 'ne_NP-chitwan-medium.onnx':(62950044,'f7ba6b0927688f92717e93ca52bc06f5783ce8edc765d5f85365acef1d41822c'),
 'ne_NP-chitwan-medium.onnx.json':(5043,'18d523b03b201422d14e2892cc750a81208d2e45158a9c6a7e4e06a500930dee'),
}
parser=argparse.ArgumentParser();parser.add_argument('--models',required=True);args=parser.parse_args()
root=pathlib.Path(args.models).resolve();app=pathlib.Path(__file__).resolve().parents[1]
if root==app or app in root.parents:parser.error('Model storage must be outside app.')
root.mkdir(parents=True,exist_ok=True)
source={'repo':REPO,'revision':REVISION,'repoLicense':'MIT','datasetLicense':'CC0','language':'ne_NP','espeakVoice':'ne','files':[]}
for name,(size,sha) in FILES.items():
 url=f'https://huggingface.co/{REPO}/resolve/{REVISION}/ne/ne_NP/chitwan/medium/{name}'
 target=root/name
 if not target.exists():
  temporary=target.with_suffix(target.suffix+'.partial')
  with urllib.request.urlopen(url,timeout=60) as response,temporary.open('wb') as f:
   while chunk:=response.read(1048576):f.write(chunk)
  temporary.replace(target)
 digest=hashlib.sha256(target.read_bytes()).hexdigest()
 if target.stat().st_size!=size or (sha and digest!=sha):raise ValueError('Pinned public model file failed integrity check: '+name)
 source['files'].append({'path':name,'url':url,'bytes':size,'sha256':digest})
 print(name,size,flush=True)
card=(root/'MODEL_CARD').read_text();config=json.loads((root/'ne_NP-chitwan-medium.onnx.json').read_text())
if 'License:  CC0' not in card or 'ne_NP (Nepali, Nepal)' not in card or config['espeak']['voice']!='ne' or config['language']['code']!='ne_NP':raise ValueError('Voice language/licence guard failed')
(root/'source.json').write_text(json.dumps(source,indent=2)+'\n')
