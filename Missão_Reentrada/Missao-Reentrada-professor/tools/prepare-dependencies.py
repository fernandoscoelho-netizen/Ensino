"""Instalação alternativa de pacotes npm para ambientes sem npm/pnpm funcionais.
Usa exclusivamente o registo npm e valida os caminhos de cada arquivo.
"""
import json, urllib.request, tarfile, io, re, os, hashlib
from pathlib import Path
ROOT=Path(__file__).parent.parent
DEST=ROOT/'node_modules'
resolved={}
manifest=json.loads((ROOT/'package.json').read_text())
recorded=json.loads((ROOT/'dependencies-resolved.json').read_text()) if (ROOT/'dependencies-resolved.json').exists() else {}
pins={**recorded,**manifest['dependencies'],**manifest.get('devDependencies',{})}
def version_tuple(s):
 m=re.match(r'^(\d+)\.(\d+)\.(\d+)$',s)
 return tuple(map(int,m.groups())) if m else None
def matches(v, spec):
 if spec in ('*','latest',''): return True
 if '||' in spec: return any(matches(v,x.strip()) for x in spec.split('||'))
 for part in spec.split():
  m=re.match(r'^(\^|~|>=|<=|>|<|=)?(\d+)(?:\.(\d+|x|\*))?(?:\.(\d+|x|\*))?$',part)
  if not m: return False
  op,a,b,c=m.groups();target=(int(a),int(b) if b and b.isdigit() else 0,int(c) if c and c.isdigit() else 0)
  if op=='^': ok=v>=target and v<(target[0]+1,0,0) if target[0]>0 else v>=target and v<(0,target[1]+1,0) if target[1]>0 else v==target
  elif op=='~': ok=v>=target and v<(target[0],target[1]+1,0)
  elif op=='>=':ok=v>=target
  elif op=='<=':ok=v<=target
  elif op=='>':ok=v>target
  elif op=='<':ok=v<target
  else:ok=v==target if c and c.isdigit() else v[:2]==target[:2] if b and b.isdigit() else v[0]==target[0]
  if not ok:return False
 return True

def get(url):
 with urllib.request.urlopen(url,timeout=40) as r:return r.read()
def install(name,spec):
 spec=pins.get(name,spec)
 if name in resolved:
  if not matches(version_tuple(resolved[name]),spec):raise RuntimeError('Incompatible versions: '+name+' '+spec)
  return
 data=json.loads(get('https://registry.npmjs.org/'+name.replace('/','%2f')))
 versions=[(version_tuple(v),v) for v in data['versions'] if version_tuple(v) and matches(version_tuple(v),spec)]
 if not versions:raise RuntimeError(name+' '+spec)
 v=max(versions)[1];meta=data['versions'][v];resolved[name]=v
 blob=get(meta['dist']['tarball'])
 if meta['dist'].get('shasum') and hashlib.sha1(blob).hexdigest()!=meta['dist']['shasum']:raise RuntimeError('Checksum '+name)
 folder=DEST/name;folder.mkdir(parents=True,exist_ok=True)
 with tarfile.open(fileobj=io.BytesIO(blob),mode='r:gz') as tar:
  for entry in tar:
   parts=Path(entry.name).parts
   if not parts or parts[0]!='package' or '..' in parts or entry.issym() or entry.islnk():continue
   target=folder.joinpath(*parts[1:])
   if entry.isdir():target.mkdir(parents=True,exist_ok=True)
   elif entry.isfile():target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(tar.extractfile(entry).read())
 print(name+'@'+v,flush=True)
 for dep,req in meta.get('dependencies',{}).items():install(dep,req)
 if name=='esbuild':install('@esbuild/win32-x64',v)
manifest=json.loads((ROOT/'package.json').read_text())
for name,spec in {**manifest['dependencies'],**manifest.get('devDependencies',{})}.items():install(name,spec)
(ROOT/'dependencies-resolved.json').write_text(json.dumps(resolved,indent=2))
print('Dependencies ready',flush=True)
