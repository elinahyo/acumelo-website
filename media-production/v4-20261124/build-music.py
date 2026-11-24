"""Rebuild the original score without narration or speech ducking. No model downloads."""
import ast
import argparse
import hashlib
import json
from pathlib import Path
import numpy as np
import soundfile as sf
from scipy.signal import lfilter

parser=argparse.ArgumentParser()
parser.add_argument('--source',required=True)
parser.add_argument('--output',required=True)
a=parser.parse_args()
root=Path(a.source);out=Path(a.output)/'music';out.mkdir(parents=True,exist_ok=True)
tree=ast.parse((root/'audio.py').read_text(encoding='utf-8'))
function=next(n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name=='make_music')
ns={'np':np,'lfilter':lfilter,'SR':24000}
exec(compile(ast.Module(body=[function],type_ignores=[]),'original-composition','exec'),ns)
index=[]
for p in sorted((root/'timelines').glob('*-showcase.json')):
 f=json.loads(p.read_text(encoding='utf-8'));n=round(f['durationSeconds']*24000)
 music=ns['make_music'](n,f['bpm'],f['variant']+len(f['id']),[s['start'] for s in f['shots']])
 # A gentle structural swell gives the reveal breathing room; no clipped samples.
 t=np.arange(n)/24000
 envelope=.82+.12*np.sin(np.pi*np.clip(t/f['durationSeconds'],0,1))**2
 music*=envelope[:,None]
 file=out/(f['id']+'.wav');sf.write(file,music,24000,subtype='PCM_16')
 index.append({'id':f['id'],'path':file.name,'hasNarration':False,'audioRole':'music-only','peak':float(np.max(np.abs(music))),'sha256':hashlib.sha256(file.read_bytes()).hexdigest()})
(out/'music-manifest.json').write_text(json.dumps(index,indent=2),encoding='utf-8')
print(json.dumps({'musicOnlyFiles':len(index),'privateAudioUsed':False}))
