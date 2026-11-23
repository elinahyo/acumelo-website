from pathlib import Path
import json,subprocess,re,hashlib,concurrent.futures
R=Path(__file__).resolve().parent;O=R/'output'
import os,imageio_ffmpeg
FF=os.environ.get('FFMPEG_PATH') or imageio_ffmpeg.get_ffmpeg_exe()
data=json.loads((R/'delivery-map.json').read_text(encoding='utf8'))
def check(row):
 p=O/Path(row['path']).name
 cmd=[str(FF),'-hide_banner','-i',str(p),'-vf','blackdetect=d=1.2:pix_th=0.04,freezedetect=n=-45dB:d=4','-af','volumedetect','-f','null','-']
 r=subprocess.run(cmd,capture_output=True,text=True,creationflags=getattr(subprocess,'CREATE_NO_WINDOW',0));log=r.stderr
 duration=re.search(r'Duration: (\d+):(\d+):([\d.]+)',log)
 actual=sum(float(x)*m for x,m in zip(duration.groups(),[3600,60,1])) if duration else 0
 peak=re.search(r'max_volume: ([-\d.]+) dB',log);mean=re.search(r'mean_volume: ([-\d.]+) dB',log)
 errors=[]
 for ok,msg in [(r.returncode==0,'Decode failed'),('Video: h264' in log,'Missing H264'),('1280x720' in log,'Wrong dimensions'),('30 fps' in log,'Wrong framerate'),('Audio: aac' in log,'Missing AAC'),('48000 Hz' in log,'Wrong audio rate'),(abs(actual-row['durationSeconds'])<.2,'Duration mismatch'),(peak and float(peak.group(1))<-.1,'Clipping risk'),(mean and float(mean.group(1))>-35,'Very low average audio'),('black_start:' not in log,'Sustained black interval'),('freeze_start:' not in log,'Sustained frozen interval')]:
  if not ok:errors.append(msg)
 h=hashlib.sha256(p.read_bytes()).hexdigest()
 if h!=row['sha256']:errors.append('SHA-256 mismatch')
 cap=O/'captions'/p.with_suffix('.vtt').name
 if not cap.exists() or not cap.read_text().startswith('WEBVTT'):errors.append('Missing caption file')
 return {'id':row['id'],'duration':actual,'peakDb':float(peak.group(1)) if peak else None,'meanDb':float(mean.group(1)) if mean else None,'bytes':p.stat().st_size,'sha256':h,'passed':not errors,'errors':errors,'alerts':[x for x in log.splitlines() if 'black_start:' in x or 'freeze_start:' in x]}
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
 results=list(pool.map(check,data['media']))
report={'films':len(results),'passed':all(r['passed'] for r in results),'checks':'Full decode, H264/AAC, size/fps, duration, peak/mean audio, sustained black/freeze, subtitle existence, SHA-256','results':results}
(O/'validation-report.json').write_text(json.dumps(report,indent=2),encoding='utf8')
print(json.dumps({'films':len(results),'passed':report['passed'],'issues':[r for r in results if not r['passed']]}))
if not report['passed']:raise SystemExit(1)
data['status']='qa-passed'
for dest in [R/'delivery-map.json',O/'media-manifest.json']:dest.write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf8')
