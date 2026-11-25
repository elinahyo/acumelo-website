"""Fetch licensed Google Fonts web subsets; retain provenance and SHA-256.

Run only when deliberately refreshing font assets. No runtime third-party requests.
Uses Python standard library; no temporary TTFs or dependency installation.
"""
from pathlib import Path
import hashlib,json,re,urllib.request,urllib.parse
ROOT=Path(__file__).resolve().parent.parent
OUT=ROOT/'assets'/'fonts';OUT.mkdir(parents=True,exist_ok=True)
COMMIT='83c62e30d87daa70216dab6b984d00d20d96d585'
UA='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
def get(url):
 with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':UA}),timeout=60) as r:return r.read()
text=''.join((ROOT/p).read_text(encoding='utf-8') for p in ['content.js','source.html','site.js'])
ko=sorted(set(c for c in text if 0xAC00<=ord(c)<=0xD7AF or 0x1100<=ord(c)<=0x11FF or 0x3130<=ord(c)<=0x318F))
manifest={'sourceCommit':COMMIT,'license':'SIL Open Font License 1.1','files':[],'koreanCharacters':len(ko)};faces=[]
for folder,family,weight in [('nunito','Nunito','400 900'),('jua','Jua','400'),('notosanskr','Noto Sans KR','400 800')]:
 license_url=f'https://raw.githubusercontent.com/google/fonts/{COMMIT}/ofl/{folder}/OFL.txt'
 license_bytes=get(license_url);(OUT/f'{folder}-OFL.txt').write_bytes(license_bytes)
 batches=[None] if folder=='nunito' else [ko[i:i+200] for i in range(0,len(ko),200)]
 for i,chars in enumerate(batches):
  params={'family':family+('' if folder=='jua' else ':wght@'+weight.replace(' ','..')),'display':'swap'}
  if chars:params['text']=''.join(chars)
  css_url='https://fonts.googleapis.com/css2?'+urllib.parse.urlencode(params)
  css=get(css_url).decode()
  if folder=='nunito':css=css.split('/* latin */')[-1]
  url=re.search(r'src:\s*url\(([^)]+)\)',css).group(1)
  if not url.startswith('https://fonts.gstatic.com/'):raise ValueError('Unexpected font host')
  binary=get(url)
  if binary[:4]!=b'wOF2':raise ValueError('Expected WOFF2')
  name=f'{folder}-{i}.woff2';(OUT/name).write_bytes(binary)
  ranges=','.join('U+'+format(ord(c),'X') for c in chars) if chars else re.search(r'unicode-range:\s*([^;]+)',css).group(1)
  faces.append(f'@font-face{{font-family:"{family}";font-style:normal;font-weight:{weight};font-display:swap;src:url("{name}") format("woff2");unicode-range:{ranges}}}')
  manifest['files'].append({'file':name,'family':family,'weight':weight,'source':url,'cssRequest':css_url,'licenseSource':license_url,'sha256':hashlib.sha256(binary).hexdigest(),'bytes':len(binary)})
  print(name,len(binary))
(OUT/'fonts.css').write_text('\n'.join(faces)+'\n',encoding='utf-8')
(OUT/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Font bytes:',sum(f['bytes'] for f in manifest['files']))
