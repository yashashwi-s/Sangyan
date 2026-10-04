"""Download only ungated public Meta MMS candidates, pinning revision/licence/checksums.
No credentials, account text, API tokens, gated downloads or provider fallbacks.
"""
import argparse,concurrent.futures,hashlib,json,pathlib,re,urllib.request
ROOT=pathlib.Path(__file__).resolve().parents[1]
CANDIDATES=json.loads((ROOT/'audio/candidates.json').read_text())
p=argparse.ArgumentParser();p.add_argument('--models',required=True);p.add_argument('--language',choices=CANDIDATES,action='append');args=p.parse_args()
base=pathlib.Path(args.models);base.mkdir(parents=True,exist_ok=True)
def fetch(url):
 with urllib.request.urlopen(url,timeout=45) as response:return response.read()
def prepare(code):
 model='facebook/mms-tts-'+CANDIDATES[code]
 meta=json.loads(fetch('https://huggingface.co/api/models/'+model+'?blobs=true'))
 if meta.get('gated') or meta.get('private'):raise RuntimeError(f'{code}: gated/private model cannot be downloaded')
 revision=meta['sha'];licence=meta.get('cardData',{}).get('license')
 if not re.fullmatch('[a-f0-9]{40}',revision) or licence!='cc-by-nc-4.0':raise RuntimeError(f'{code}: unverified revision/licence')
 files={s['rfilename']:s for s in meta['siblings']}
 needed=['config.json','tokenizer_config.json','vocab.json','special_tokens_map.json','model.safetensors','README.md']
 # Safe tensor format only; do not download or deserialize pickle model weights.
 if any(name not in files for name in needed):raise RuntimeError(f'{code}: missing safe model/tokenizer files')
 out=base/CANDIDATES[code];out.mkdir(parents=True,exist_ok=True);hashes={}
 for name in needed:
  target=out/name;expected=files[name].get('lfs',{}).get('sha256')
  if target.exists() and expected and hashlib.sha256(target.read_bytes()).hexdigest()==expected:
   data=target.read_bytes()
  else:
   data=fetch(f'https://huggingface.co/{model}/resolve/{revision}/{name}')
   digest=hashlib.sha256(data).hexdigest()
   if expected and digest!=expected:raise RuntimeError(f'{code}/{name}: downloaded checksum mismatch')
   tmp=out/(name+'.partial');tmp.write_bytes(data);tmp.replace(target)
  hashes[name]={'sha256':hashlib.sha256(data).hexdigest(),'bytes':len(data)}
 source={'model':model,'revision':revision,'license':'CC-BY-NC-4.0','languageCode':code,'files':hashes}
 (out/'source.json').write_text(json.dumps(source,indent=2)+'\n')
 print(code,'MODEL_READY',revision,flush=True)
 return code,source
results={};errors={}
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
 futures={pool.submit(prepare,c):c for c in args.language or CANDIDATES}
 for f in concurrent.futures.as_completed(futures):
  code=futures[f]
  try:k,result=f.result();results[k]=result
  except Exception as e:errors[code]=str(e);print(code,'BLOCKED',str(e),flush=True)
  (base/'preparation.json').write_text(json.dumps({'ready':results,'errors':errors},indent=2)+'\n')
if errors:raise SystemExit('Some candidate models could not be prepared; see preparation.json. No gated access was attempted.')
