// Acumelo editorial revision. These are illustrative interfaces, never native-app footage.
// Run against the portable v3 source. No paid generation or private media is required.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import {spawn, spawnSync} from 'node:child_process';
import {once} from 'node:events';

const arg = (key, fallback) => {const i=process.argv.indexOf('--'+key);return i<0?fallback:process.argv[i+1];};
const ROOT=path.resolve(arg('source','media-production/v3-20261123'));
const MEDIA=path.resolve(arg('media','assets/media/20261123c'));
const OUT=path.resolve(arg('output','editorial-output'));
const REV='20261124d', W=1280,H=720,FPS=30;
const proof=process.argv.includes('--proof');
const selected=new Set(arg('only','all').split(','));
const require=createRequire(path.join(ROOT,'package.json'));
const {createCanvas,loadImage,GlobalFonts}=require(process.env.CANVAS_MODULE||'@napi-rs/canvas');
for(const [file,name] of [
 ['segoeui.ttf','Segoe UI'],['seguisb.ttf','Segoe UI'],['arial.ttf','Arial'],['arialbd.ttf','Arial'],['consola.ttf','Consolas'],
]){const p=path.join(process.env.FONT_DIR||'C:/Windows/Fonts',file);if(fs.existsSync(p))GlobalFonts.registerFromPath(p,name);}
const linuxFonts=[['/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf','Segoe UI'],['/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf','Arial'],['/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf','Segoe UI'],['/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf','Consolas']];
for(const [p,n] of linuxFonts)if(fs.existsSync(p))GlobalFonts.registerFromPath(p,n);
const {drawApp,drawFinished}=await import(pathToFileURL(path.join(ROOT,'apps.mjs')));
const {renderFrame:renderProduct}=await import(pathToFileURL(path.join(ROOT,'project-visuals.mjs')));
const {fields,appNames}=await import(pathToFileURL(path.join(ROOT,'blueprint.mjs')));
const ffmpeg=process.env.FFMPEG_PATH||'ffmpeg';
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const ease=x=>1-(1-clamp(x))**3;
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const assets={};
for(const k of ['product','sculpture','gallery','islands']){const d=path.join(ROOT,'assets/blender',k);assets[k]=await Promise.all(fs.readdirSync(d).filter(n=>n.endsWith('.jpg')).sort().map(n=>loadImage(path.join(d,n))));}
for(const k of ['world','headphones','forest','coastal','portal','desert','watch'])assets[k]=await loadImage(path.join(ROOT,'assets',k+'.png'));
for(const p of [OUT,path.join(OUT,'posters'),path.join(OUT,'captions'),path.join(OUT,'proofs'),path.join(OUT,'metadata')])fs.mkdirSync(p,{recursive:true});
const scene=createCanvas(W,H),sc=scene.getContext('2d'),previous=createCanvas(W,H),pc=previous.getContext('2d');
const frame=createCanvas(W,H),c=frame.getContext('2d'),screenA=createCanvas(W,H),a=screenA.getContext('2d'),screenB=createCanvas(W,H),b=screenB.getContext('2d');
const styles={Chris:{base:'#091827',ink:'#f2f5fa',accent:'#86b6ff',second:'#ff987e',light:false},Sage:{base:'#f4f0e7',ink:'#253349',accent:'#715cac',second:'#d4806b',light:true},Pillow:{base:'#1b1025',ink:'#f8f0ed',accent:'#e7a0c6',second:'#d6e594',light:false},Acumelo:{base:'#101b2b',ink:'#fbf4e8',accent:'#8bb6ff',second:'#ffa288',light:false}};
function box(ctx,x,y,w,h,col,r=0){ctx.fillStyle=col;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();}
function txt(ctx,s,x,y,size,col,weight=600){ctx.font=`${weight} ${size}px "Segoe UI"`;ctx.fillStyle=col;ctx.fillText(String(s),x,y);}
function fit(ctx,s,x,y,w,size,col,weight=600){while(size>10){ctx.font=`${weight} ${size}px "Segoe UI"`;if(ctx.measureText(s).width<=w)break;size--;}txt(ctx,s,x,y,size,col,weight);}
function fitted(ctx,img,x,y,w,h,zoom=1,cx=.5,cy=.5,contain=false){ctx.save();ctx.beginPath();ctx.roundRect(x,y,w,h,12);ctx.clip();const z=(contain?Math.min(w/W,h/H):Math.max(w/W,h/H))*zoom,iw=W*z,ih=H*z;ctx.drawImage(img,x+w/2-iw*cx,y+h/2-ih*cy,iw,ih);ctx.restore();}
function particles(ctx,t,st,energy=1){ctx.save();for(let i=0;i<45;i++){const angle=i*2.399963+Math.sin(t*.16)*.15;const r=70+((i*53+t*(12+i%4))%720);const xx=640+Math.cos(angle)*r,yy=320+Math.sin(angle)*r*.55;ctx.globalAlpha=(.06+(i%4)*.025)*energy;box(ctx,xx,yy,1+i%3,1+i%3,i%3?st.accent:st.second,2);}ctx.restore();}
function backdrop(ctx,t,st){box(ctx,0,0,W,H,st.base);const g=ctx.createRadialGradient(1050+Math.sin(t*.3)*80,180,10,850,220,780);g.addColorStop(0,st.light?'#decfe84d':'#55569b32');g.addColorStop(1,'#00000000');box(ctx,0,0,W,H,g);ctx.save();ctx.globalAlpha=.06;ctx.strokeStyle=st.accent;ctx.lineWidth=1;for(let i=0;i<9;i++){ctx.beginPath();ctx.moveTo(0,100+i*82);ctx.lineTo(W,40+i*82);ctx.stroke();}ctx.restore();}
function drawSurface(ctx,app,s,p,f,second=false){ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,W,H);if(app==='project'){const pr=(second?s.secondProject:s.project)||s.project;renderProduct(ctx,pr,.08+clamp(p)*.86,{kind:'showcase',color:f.color,sceneIndex:s.projectIndex||0,sceneCount:24},assets);}else if(app==='result'){drawFinished(ctx,p,f,assets);}else{drawApp(ctx,app,p,s,f,assets);}ctx.restore();}
function sceneShot(ctx,f,index,time){
 const st=styles[f.name]||styles.Acumelo,s=f.shots[index],age=clamp(time-s.start,0,s.duration),local=clamp(age/s.duration),p=(s.visualStart||0)+((s.visualEnd??1)-(s.visualStart||0))*local,show=f.kind==='showcase';
 backdrop(ctx,time,st);drawSurface(a,s.app,s,p,f);
 const mode=s.editorialMode,entry=ease(age/.38),move=(1-entry)*26;
 if(mode==='split'){
  const alternate=show?'project':(s.split||'result');drawSurface(b,alternate,s,p,f,true);
  const flip=f.name==='Pillow'||(show&&index%2),leftW=flip?468:744,rightX=leftW+38;
  box(ctx,20,110,leftW,493,st.light?'#ffffff':'#243046',15);box(ctx,rightX,110,W-rightX-20,493,st.light?'#ffffff':'#243046',15);
  fitted(ctx,screenA,27,117+move,leftW-14,479,1,.5,.5,true);
  fitted(ctx,screenB,rightX+7,117-move,W-rightX-34,479,1,.5,.5,true);
  box(ctx,leftW+27,131,2,447,st.second);
  txt(ctx,show?'CONCEPT / A':'WORKING VIEW',30,94,12,st.accent);
  txt(ctx,show?'CONCEPT / B':'RESULT / CONTEXT',rightX+9,94,12,st.accent);
 }else if(mode==='pip'){
  const alternate=s.split||'result';drawSurface(b,alternate,s,p,f,true);
  fitted(ctx,screenB,24,91,W-48,535,1,.5,.5,true);
  box(ctx,46,359,434,245,st.light?'#ffffff':'#111a2c',15);
  fitted(ctx,screenA,54,367+move,418,229,1,.5,.5,true);
  box(ctx,55,332,159,25,st.accent,5);txt(ctx,'BEHIND THE RESULT',65,349,10,st.base);
 }else{
  const zoom=mode==='detail'&&!show?1.08+.06*ease(p):1;
  const cx=mode==='detail'?(s.app==='n8n'?.63:.53):.5;
  const cy=mode==='detail'?.49:.5;
  box(ctx,20,87,W-40,543,st.light?'#ffffff':'#263349',16);
  fitted(ctx,screenA,27,94+move,W-54,529,zoom,cx,cy,true);
 }
 if(show||s.app==='result')particles(ctx,time,st,.85);
 txt(ctx,'ACUMELO',28,35,14,st.ink,700);
 fit(ctx,show?'PROJECT CONCEPTS':f.name.toUpperCase()+' / '+fields[f.fieldId].toUpperCase(),190,35,820,12,st.accent);
 txt(ctx,show?'MUSIC ONLY':'INSTRUCTOR DEMO',1075,35,11,st.ink,500);
 box(ctx,28,660,5,36,st.second,2);fit(ctx,s.title,48,679,1000,25,st.ink);
 txt(ctx,show?'Illustrative outcomes · 24 original concepts':'Illustrative interface · temporary synthetic voice',48,701,11,st.light?'#667184':'#b5bdcd',400);
 txt(ctx,String(index+1).padStart(2,'0')+' / '+f.shots.length,1152,682,13,st.accent);
 box(ctx,0,717,W*clamp(time/f.durationSeconds),3,st.accent);
}
function titleFrame(f,t){const st=styles[f.name]||styles.Acumelo;backdrop(c,t,st);particles(c,t,st,2);const e=ease(t/.55);txt(c,'ACUMELO',52,57,17,st.ink);txt(c,f.kind==='showcase'?'POSSIBILITIES IN MOTION':f.name.toUpperCase(),54,229,18,st.accent);c.save();c.globalAlpha=e;fit(c,f.title,52+(1-e)*55,324,1120,58,st.ink);txt(c,f.kind==='showcase'?'24 ideas. Many ways forward.':'Inside the process. Beyond the interface.',56,387,25,st.light?'#667184':'#bbc4d8',400);c.restore();box(c,56,449,180*e,4,st.second);}
function render(f,time){
 const st=styles[f.name]||styles.Acumelo;
 if(time<1.25){titleFrame(f,time);if(time<.32){c.globalAlpha=1-time/.32;box(c,0,0,W,H,st.base);c.globalAlpha=1;}return;}
 let idx=f.shots.findIndex(s=>time>=s.start&&time<s.start+s.duration);if(idx<0)idx=time<f.shots[0].start?0:f.shots.length-1;
 const s=f.shots[idx],age=time-s.start;sceneShot(sc,f,idx,time);c.drawImage(scene,0,0);
 if(idx>0&&age<.25){const prev=f.shots[idx-1];sceneShot(pc,f,idx-1,prev.start+prev.duration-.02);const q=ease(age/.25);
  if(s.transition==='dissolve'){c.globalAlpha=1-q;c.drawImage(previous,0,0);c.globalAlpha=1;}
  else if(s.transition==='slide'){c.drawImage(previous,-q*W*.12,0);c.save();c.beginPath();c.rect(W*(1-q),0,W*q,H);c.clip();c.drawImage(scene,0,0);c.restore();c.save();c.globalAlpha=(1-q)*.5;box(c,W*(1-q)-2,0,4,H,st.second);c.restore();}
 }
 const remain=f.durationSeconds-time;if(remain<.7){c.globalAlpha=1-clamp(remain/.7);box(c,0,0,W,H,st.base);txt(c,'ACUMELO',52,365,42,st.ink);c.globalAlpha=1;}
}
function recut(f){
 const groups=new Map();for(const s of f.shots){if(!groups.has(s.beat))groups.set(s.beat,[]);groups.get(s.beat).push(s);}
 const durations=[];let index=0;
 for(const group of groups.values()){
  const start=group[0].start,total=group.reduce((n,s)=>n+s.duration,0);
  const pattern=f.kind==='showcase'?[2.3,.65,.85,1.65,.55,1.3,.75,2.0]:f.name==='Pillow'?[1.65,.65,1.1,2.5]:f.name==='Sage'?[2.4,1.05,1.65,.9]:[2.6,.75,1.2,1.8];
  const weights=group.map((_,i)=>pattern[i%pattern.length]),sum=weights.reduce((a,b)=>a+b,0);let at=start;
  group.forEach((s,i)=>{s.start=at;s.duration=total*weights[i]/sum;at+=s.duration;durations.push(Number(s.duration.toFixed(3)));
   const show=f.kind==='showcase';s.editorialMode=show?(index%5===2?'split':index%5===4?'detail':'full'):(i===0?'establish':s.split?'split':i===group.length-1?'pip':i%2?'detail':'full');
   if(show&&!s.secondProject)s.secondProject=f.shots[(index+1)%f.shots.length].project;
   s.transition=i===0?'dissolve':index%3===1?'slide':'cut';index++;
  });
 }
 // Keep the spoken lesson intact, but add contextual inserts during long speech beats.
 f.shots=f.shots.flatMap(s=>{if(s.duration<=4.8||f.kind==='showcase')return [s];let at=s.start;return [.47,.19,.34].map((w,i)=>{const start=[0,.47,.66][i],v={...s,start:at,duration:s.duration*w,visualStart:start,visualEnd:start+w,editorialMode:i===0?s.editorialMode:i===1?'detail':'split',transition:i===0?s.transition:i===1?'cut':'dissolve'};at+=v.duration;return v;});});
 f.editing={revision:REV,cutSeconds:f.shots.map(s=>Number(s.duration.toFixed(3))),splitFrames:f.shots.filter(s=>s.editorialMode==='split').length,pictureInPictureFrames:f.shots.filter(s=>s.editorialMode==='pip').length,transitions:['dissolve','slide','cut','fade-in','fade-out'],particles:'subtle brand accents on concept/result shots',status:'editorial-review-required'};
}
const manifest=[];
for(const name of fs.readdirSync(path.join(ROOT,'timelines')).filter(s=>s.endsWith('.json')).sort()){
 const f=JSON.parse(fs.readFileSync(path.join(ROOT,'timelines',name),'utf8'));
 if(!(['Chris','Sage','Pillow'].includes(f.name)&&f.scope==='instructor')&&f.kind!=='showcase')continue;
 if(!selected.has('all')&&!selected.has(f.id))continue;
 const expected={Chris:'am_michael',Sage:'af_heart',Pillow:'af_nicole'};
 if(f.scope==='instructor'&&f.voice!==expected[f.name])throw Error('VOICE MISMATCH '+f.id);
 const oldStem=f.stem;recut(f);f.stem=f.id+'-'+REV;f.mediaId='acumelo-'+f.stem;f.revision=REV;
 const poster=path.join(OUT,'posters',f.stem+'.jpg');render(f,Math.min(5,f.durationSeconds*.16));fs.writeFileSync(poster,frame.toBuffer('image/jpeg',90));
 const sheet=createCanvas(1280,1080),sx=sheet.getContext('2d');
 for(let i=0;i<6;i++){const sh=f.shots[Math.floor(i*f.shots.length/6)];render(f,sh.start+Math.min(.7,sh.duration*.6));sx.drawImage(frame,(i%2)*640,Math.floor(i/2)*360,640,360);}
 fs.writeFileSync(path.join(OUT,'proofs',f.id+'.jpg'),sheet.toBuffer('image/jpeg',88));
 const source=path.join(MEDIA,oldStem+'.mp4'),music=path.join(OUT,'music',f.id+'.wav');
 const audio=f.kind==='showcase'?music:source;
 const record={...f,assignedInstructorId:f.scope==='instructor'?f.instructorId:null,sourceVideoSha256:fs.existsSync(source)?sha(source):null,width:W,height:H,fps:FPS,src:'assets/media/'+REV+'/'+f.stem+'.mp4',path:f.stem+'.mp4',poster:'posters/'+f.stem+'.jpg',subtitlePath:f.kind==='showcase'?null:'captions/'+f.stem+'.vtt',hasNarration:f.kind!=='showcase',hasMusic:true,voiceId:f.kind==='showcase'?null:f.voice,speakerId:f.scope==='instructor'?f.instructorId:null,audioRole:f.kind==='showcase'?'music-only':'instructor-demonstration',voiceProvenance:f.kind==='showcase'?null:'Existing verified temporary synthetic voice; encoded audio copied unchanged from v3',illustrative:true,disclosure:'Illustrative interface reconstructions and project concepts. Temporary synthetic instructor voices; project concepts use music only.',status:'editorial-review-required'};
 // Clear inherited v3 narration fields as well as the top-level playback role.
 // Otherwise a consumer reading audio.voiceId or captions can resurrect a stale speaker.
 if(f.kind==='showcase'){
  record.voice=null;record.captions=[];delete record.beats;
  record.audio={musicType:'Original procedural composition, rebuilt without narration or speech ducking',voiceEngine:null,voiceId:null,voicePath:null,musicPath:'music/'+f.id+'.wav',mixPath:null,mode:'music-only'};
 }
 if(proof){fs.writeFileSync(path.join(OUT,'metadata',f.stem+'.json'),JSON.stringify(record,null,2));console.log('PROOF '+f.id);continue;}
 if(!fs.existsSync(audio))throw Error('Missing audio input '+audio);
 const output=path.join(OUT,f.stem+'.mp4');console.log('RENDER '+f.id+' '+f.durationSeconds.toFixed(2)+'s');
 const ff=spawn(ffmpeg,['-hide_banner','-loglevel','error','-y','-f','rawvideo','-pix_fmt','rgba','-s',W+'x'+H,'-r',String(FPS),'-i','pipe:0','-i',audio,'-map','0:v:0','-map','1:a:0','-c:v','libx264','-preset','fast','-crf','20','-pix_fmt','yuv420p','-c:a',f.kind==='showcase'?'aac':'copy',...(f.kind==='showcase'?['-b:a','192k']:[]),'-t',String(f.durationSeconds),'-movflags','+faststart','-metadata','comment='+record.disclosure,output],{windowsHide:true,stdio:['pipe','ignore','pipe']});
 let errors='';ff.stderr.on('data',d=>errors+=d);ff.stdin.on('error',()=>{});const ended=once(ff,'close');
 for(let i=0;i<Math.round(FPS*f.durationSeconds);i++){render(f,i/FPS);const px=c.getImageData(0,0,W,H).data;if(!ff.stdin.write(Buffer.from(px.buffer,px.byteOffset,px.byteLength)))await once(ff.stdin,'drain');}
 ff.stdin.end();const [code]=await ended;if(code!==0)throw Error(errors);
 record.bytes=fs.statSync(output).size;record.sha256=sha(output);
 if(f.kind!=='showcase'){
  const audioHash=p=>{const r=spawnSync(ffmpeg,['-v','error','-i',p,'-map','0:a:0','-c','copy','-f','hash','-hash','sha256','-'],{encoding:'utf8',windowsHide:true});if(r.status!==0)throw Error(r.stderr);return r.stdout.trim();};
  record.audioStreamSha256=audioHash(output);record.audioCopiedVerified=record.audioStreamSha256===audioHash(source);if(!record.audioCopiedVerified)throw Error('Encoded instructor audio changed '+f.id);
  fs.copyFileSync(path.join(MEDIA,'captions',oldStem+'.vtt'),path.join(OUT,'captions',f.stem+'.vtt'));
 }
 fs.writeFileSync(path.join(OUT,'metadata',f.stem+'.json'),JSON.stringify(record,null,2));manifest.push(record);console.log('DONE '+f.id);
}
fs.writeFileSync(path.join(OUT,'editorial-manifest.json'),JSON.stringify({revision:REV,status:proof?'proofs-only':'rendered-awaiting-editorial-review',sourceRevision:'20261123c',media:manifest},null,2));
