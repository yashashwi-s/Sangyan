"""Build-time translation of fixed public copy only. Outputs remain unreviewed drafts.
A previous English snapshot limits updates to changed keys; completed batches can resume.
"""
import argparse,concurrent.futures,hashlib,json,pathlib,re,time,urllib.parse,urllib.request
ROOT=pathlib.Path(__file__).resolve().parents[1]
LANGUAGES=['hi','bn','mr','ta','ur','as','doi','gu','kn','kok','mai','ml','mni','ne','or','pa','sa','sat','sd','te']
parser=argparse.ArgumentParser();parser.add_argument('--previous-source');parser.add_argument('--state',default='/private/tmp/virasat-public-translation-state');args=parser.parse_args()
source=json.loads((ROOT/'translations/resilience-en.json').read_text())
previous=json.loads(pathlib.Path(args.previous_source).read_text()) if args.previous_source else {}
state=pathlib.Path(args.state);state.mkdir(parents=True,exist_ok=True)
def translate(lang):
 target=ROOT/'translations'/f'resilience-{lang}.json';out=json.loads(target.read_text()) if target.exists() else {}
 progress=state/f'{lang}.json';done=json.loads(progress.read_text()) if progress.exists() else {}
 hashes={k:hashlib.sha256(v.encode()).hexdigest() for k,v in source.items()}
 todo=[(k,v) for k,v in source.items() if k not in out or (previous.get(k)!=v and done.get(k)!=hashes[k])]
 batches=[];batch=[];size=0
 for k,v in todo:
  if batch and size+len(v)>1000:batches.append(batch);batch=[];size=0
  batch.append((k,v));size+=len(v)+10
 if batch:batches.append(batch)
 for batch in batches:
  query='\n'.join(f'[{i:03d}]\n{v}' for i,(k,v) in enumerate(batch))
  url='https://translate.googleapis.com/translate_a/single?'+urllib.parse.urlencode({'client':'gtx','sl':'en','tl':'mni-Mtei' if lang=='mni' else lang,'dt':'t','q':query})
  for attempt in range(4):
   try:
    with urllib.request.urlopen(url,timeout=30) as response:data=json.load(response)
    translated=''.join(x[0] for x in data[0] if x and x[0]);parts=re.split(r'\[\s*(\d{3})\s*\]',translated);values={}
    if parts[0].strip():raise ValueError('Unexpected prefix')
    for i in range(1,len(parts),2):
     index=int(parts[i]);value=parts[i+1].strip()
     if index>=len(batch) or not value or '<' in value or '\n' in value:raise ValueError('Invalid translated public text')
     values[batch[index][0]]=value
    if len(values)!=len(batch):raise ValueError('Incomplete markers')
    out.update(values);done.update({k:hashes[k] for k in values})
    target.write_text(json.dumps({k:out[k] for k in source if k in out},ensure_ascii=False,indent=2)+'\n');progress.write_text(json.dumps(done)+'\n');break
   except Exception as error:
    if attempt==3:
     values={}
     for k,v in batch:
      single='https://translate.googleapis.com/translate_a/single?'+urllib.parse.urlencode({'client':'gtx','sl':'en','tl':'mni-Mtei' if lang=='mni' else lang,'dt':'t','q':v})
      with urllib.request.urlopen(single,timeout=30) as response:item=json.load(response)
      value=' '.join(''.join(x[0] for x in item[0] if x and x[0]).split())
      if not value or '<' in value or re.search(r'\[\s*\d{3}\s*\]',value):raise ValueError('Invalid single translation '+lang+'/'+k)
      values[k]=value
     out.update(values);done.update({k:hashes[k] for k in values})
     target.write_text(json.dumps({k:out[k] for k in source if k in out},ensure_ascii=False,indent=2)+'\n');progress.write_text(json.dumps(done)+'\n');break
    time.sleep(1+attempt)
  time.sleep(.1)
 if set(out)!=set(source):raise ValueError('Incomplete language '+lang)
 return f'{lang}: {len(out)} fixed public strings; draft'
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
 for result in pool.map(translate,LANGUAGES):print(result,flush=True)
