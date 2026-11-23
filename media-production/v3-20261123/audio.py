from pathlib import Path
import sys,json,os,hashlib,time
R=Path(__file__).resolve().parent
sys.path.insert(0,str(R/'audio-engine/packages'))
os.environ.setdefault('OMP_NUM_THREADS','3')
import numpy as np
import soundfile as sf
from scipy.signal import lfilter
from kokoro_onnx import Kokoro
SR=24000
def make_music(n,bpm,seed,cuts):
    rng=np.random.default_rng(seed); out=np.zeros((n,2),np.float32)
    beat=60/bpm
    def place(s,start,amp=1,pan=0):
        a=int(start*SR);b=min(n,a+len(s))
        if b<=a or a<0:return
        out[a:b,0]+=s[:b-a]*amp*np.sqrt((1-pan)/2)
        out[a:b,1]+=s[:b-a]*amp*np.sqrt((1+pan)/2)
    def tone(freq,dur,kind='pluck'):
        t=np.arange(int(dur*SR))/SR
        if kind=='pad':
            env=np.minimum(t/.3,1)*np.minimum((dur-t)/.5,1)
            return (np.sin(2*np.pi*freq*t)+.25*np.sin(2*np.pi*freq*2.003*t))*env*.15
        env=(1-np.exp(-t*90))*np.exp(-t*(4.8 if kind=='pluck' else 3))
        return (np.sin(2*np.pi*freq*t)+.25*np.sin(2*np.pi*freq*2*t)+.08*np.sin(2*np.pi*freq*3*t))*env
    chords=[[57,60,64,67],[53,57,60,64],[60,64,67,71],[55,59,62,65]]
    hz=lambda m:440*2**((m-69)/12)
    count=int(n/SR/beat)+1
    for k in range(count):
        start=k*beat; chord=chords[((k//8)+seed)%4]
        if k%4==0:
            for j,m in enumerate(chord):place(tone(hz(m),beat*4.5,'pad'),start,.22,(j-1.5)/2.5)
        place(tone(hz(chord[0]-24),beat*.9,'bass'),start,.28,0)
        for j in range(2):
            note=chord[(k+j+seed)%4]+12
            place(tone(hz(note),beat*1.3),start+j*beat/2,.08,(-1 if j%2 else 1)*.5)
        if k%2==0:
            t=np.arange(int(.19*SR))/SR
            phase=2*np.pi*(48*t+65*.025*(1-np.exp(-t/.025)))
            kick=np.sin(phase)*np.exp(-t*22)
            place(kick,start,.44)
        else:
            t=np.arange(int(.15*SR))/SR
            noise=rng.normal(0,1,len(t));hp=noise-lfilter([.08],[1,-.92],noise)
            place((hp*.22+np.sin(2*np.pi*185*t)*.12)*np.exp(-t*30),start,.25)
        for j in range(2):
            t=np.arange(int(.045*SR))/SR;noise=rng.normal(0,1,len(t))
            place((noise-np.roll(noise,1))*np.exp(-t*100),start+j*beat/2,.014,(-1 if j else 1)*.5)
    for t0 in cuts:
        t=np.arange(int(.14*SR))/SR
        z=rng.normal(0,1,len(t));z=lfilter([.12],[1,-.88],z)
        place(z*np.sin(np.pi*t/.14)**2,max(0,t0-.08),.09,-.3)
    peak=np.max(np.abs(out));out*=.22/max(peak,.01)
    fade=int(SR*.65);out[:fade]*=np.linspace(0,1,fade)[:,None];out[-fade:]*=np.linspace(1,0,fade)[:,None]
    return out
def main():
    data=json.loads((R/'production.json').read_text(encoding='utf8'))
    wanted=set(sys.argv[1:]);films=[f for f in data['films'] if not wanted or f['id'] in wanted]
    (R/'audio').mkdir(exist_ok=True);(R/'timelines').mkdir(exist_ok=True)
    k=None
    for f in films:
        stamp=hashlib.sha256(json.dumps(f,sort_keys=True).encode()).hexdigest()
        meta=R/'timelines'/(f['id']+'.json')
        if meta.exists() and json.loads(meta.read_text()).get('sourceHash')==stamp:
            saved=json.loads(meta.read_text());a=saved.get('audio',{})
            for key in ['voice','music','mix']:a.pop(key,None)
            a.update({'voiceId':f['voice'],'voicePath':'audio/'+f['id']+'-voice.wav','musicPath':'audio/'+f['id']+'-music.wav','mixPath':'audio/'+f['id']+'-mix.wav'})
            saved['audio']=a;meta.write_text(json.dumps(saved,ensure_ascii=False,indent=2),encoding='utf8')
            print('CACHED',f['id'],flush=True);continue
        reusable={}
        oldvoice=R/'audio'/(f['id']+'-voice.wav')
        if meta.exists() and oldvoice.exists():
            oldmeta=json.loads(meta.read_text()); oldsamples,oldsr=sf.read(oldvoice)
            if oldsr==SR and oldmeta.get('voice')==f['voice']:
                for cp in oldmeta.get('captions',[]):
                    reusable[cp['text']]=oldsamples[round(cp['start']*SR):round(cp['end']*SR)]
        segments=[];shots=[];captions=[];offset=1.25;beg=time.time()
        for i,b in enumerate(f['beats']):
            if b['text'] in reusable:a,sr=reusable[b['text']],SR
            else:
                if k is None:k=Kokoro(str(R/'audio-engine/kokoro-v1.0.int8.onnx'),str(R/'audio-engine/voices-v1.0.bin'))
                a,sr=k.create(b['text'],voice=f['voice'],speed=1.04,lang='en-gb' if f['voice'].startswith(('bf_','bm_')) else 'en-us',sentence_pause=.2,clause_pause=.08)
            if sr!=SR:raise ValueError('sample rate')
            a=np.asarray(a,np.float32);a*=.68/max(float(np.max(np.abs(a))),.01);segments.append((offset,a));dur=len(a)/SR+.4
            captions.append({'start':offset,'end':offset+len(a)/SR,'text':b['text']})
            weights=sum(s['weight'] for s in b['shots']);pos=offset-.08
            for s in b['shots']:
                d=dur*s['weight']/weights
                shots.append({**s,'start':pos,'duration':d,'beat':i});pos+=d
            offset+=dur
        duration=round((offset+.85)*30)/30;n=round(duration*SR)
        voice=np.zeros(n,np.float32)
        for start,a in segments:
            j=round(start*SR);voice[j:j+len(a)]+=a
        peak=np.max(np.abs(voice));voice*=.72/max(peak,.01)
        active=np.sqrt(lfilter([1/2400]*2400,[1],voice.astype(float)**2))
        gate=np.minimum(1,active/.025)
        duck=lfilter([.0008],[1,-.9992],gate)
        music=make_music(n,f['bpm'],f['variant']+len(f['id']),[s['start'] for s in shots])
        music*= (.48-.31*np.minimum(1,duck))[:,None]
        mixed=np.column_stack([voice,voice])+music
        mx=np.max(np.abs(mixed));mixed*=min(1,.91/max(mx,.01))
        for kind,x in [('voice',voice),('music',music),('mix',mixed)]:sf.write(R/'audio'/(f['id']+'-'+kind+'.wav'),x,SR,subtype='PCM_16')
        f={**f,'sourceHash':stamp,'durationSeconds':duration,'shots':shots,'captions':captions,'audio':{'sampleRate':SR,'voicePath':'audio/'+f['id']+'-voice.wav','musicPath':'audio/'+f['id']+'-music.wav','mixPath':'audio/'+f['id']+'-mix.wav','voiceEngine':'Kokoro-82M ONNX','voiceId':f['voice'],'musicType':'Original procedural composition','peak':float(np.max(np.abs(mixed)))}}
        meta.write_text(json.dumps(f,ensure_ascii=False,indent=2),encoding='utf8')
        print('AUDIO',f['id'],duration,'sec',round(time.time()-beg,1),'render sec',flush=True)
if __name__=='__main__':main()
