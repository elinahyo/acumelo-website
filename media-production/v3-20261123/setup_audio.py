from pathlib import Path
import urllib.request, concurrent.futures, hashlib, json
root=Path(__file__).resolve().parent/'audio-engine'
root.mkdir(exist_ok=True)
files={
 'kokoro-v1.0.int8.onnx':'https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.1/kokoro-v1.0.int8.onnx',
 'voices-v1.0.bin':'https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.1/voices-v1.0.bin',
}
def get(item):
 name,url=item;p=root/name
 if not p.exists():urllib.request.urlretrieve(url,p)
 return {'name':name,'url':url,'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:data=list(pool.map(get,files.items()))
(root/'models.json').write_text(json.dumps(data,indent=2))
print(json.dumps(data,indent=2))
