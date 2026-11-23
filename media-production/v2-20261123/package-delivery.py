from pathlib import Path
import json, zipfile, hashlib
root=Path(__file__).resolve().parent
public=root/'output'
report=json.loads((public/'validation-report.json').read_text(encoding='utf-8'))
if not report['pass']:raise SystemExit('Refusing to package an unvalidated release')
files=[]
for p in sorted(public.rglob('*')):
    if p.is_file() and not p.name.endswith('-v20261123b.json'):
        files.append({'local':str(p),'relative':p.relative_to(public).as_posix(),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
with zipfile.ZipFile(root/'Acumelo-v2-videos.zip','w',zipfile.ZIP_DEFLATED,compresslevel=3) as z:
    for f in files:z.write(f['local'],f['relative'])
source_files=[]
for p in sorted(root.rglob('*')):
    if not p.is_file():continue
    rel=p.relative_to(root)
    if rel.parts[0] in ['output','logs','proofs'] or 'unity-project' in rel.parts or p.suffix=='.zip' or p.name.endswith('.blend1') or p.name=='delivery-map.json':continue
    source_files.append({'local':str(p),'relative':rel.as_posix(),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
with zipfile.ZipFile(root/'Acumelo-v2-production-source.zip','w',zipfile.ZIP_DEFLATED,compresslevel=3) as z:
    for f in source_files:z.write(f['local'],f['relative'])
delivery={'revision':'2026-11-23b','validated':True,'videoCount':23,'totalVideoBytes':report['totalBytes'],'publicFiles':files,'sourceFiles':source_files,'recommendedWebsiteBase':'assets/media/20261123b/','recommendedSourceBase':'media-production/v2-20261123/','notes':['11 individually mapped instructor demos','12 category demo/showcase films','Keep human lecture footage empty','No paid Higgsfield generation','Illustrative workflow and project concepts']}
(root/'delivery-map.json').write_text(json.dumps(delivery,indent=2),encoding='utf-8')
print(json.dumps({'publicFiles':len(files),'sourceFiles':len(source_files),'videoZipBytes':(root/'Acumelo-v2-videos.zip').stat().st_size,'sourceZipBytes':(root/'Acumelo-v2-production-source.zip').stat().st_size}))
