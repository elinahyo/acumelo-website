import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {renderScreen,W,H,FPS,DURATION,names} from './screens.mjs';
const root=path.dirname(fileURLToPath(import.meta.url));
const runtime=process.env.CODEX_NODE_PACKAGES || path.join(root, 'node_modules');
const require=createRequire(import.meta.url);
let canvasModule;try{canvasModule=require('@napi-rs/canvas')}catch{canvasModule=require(path.join(runtime,'@napi-rs/canvas'))}
const {createCanvas,GlobalFonts}=canvasModule;
for(const [file,family] of [['arial.ttf','Arial'],['arialbd.ttf','Arial'],['consola.ttf','Consolas']]){const p=path.join('C:/Windows/Fonts',file);if(fs.existsSync(p))GlobalFonts.registerFromPath(p,family)}
const ffmpeg=process.env.FFMPEG_PATH || path.join(root,'vendor/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v9.0.2.exe');
if(!fs.existsSync(ffmpeg))throw new Error('Set FFMPEG_PATH to an FFmpeg executable. See README.');
const arg=(name,def)=>{const i=process.argv.indexOf('--'+name);return i>=0?process.argv[i+1]:def};
const boardFile=arg('storyboard',path.join(root,'./storyboard-coverage.json'));
let board=JSON.parse(fs.readFileSync(boardFile,'utf8').replace(/^\uFEFF/,''));
let cats=Array.isArray(board)?board:board.categories;
if(!Array.isArray(cats))cats=Object.entries(cats||board).filter(([id])=>names[id]).map(([id,v])=>({id,...v}));
const category=arg('category','all'),kind=arg('kind','all'),onlyFrames=process.argv.includes('--frames-only');
const out=path.join(root,'output'),posters=path.join(out,'posters'),samples=path.join(out,'samples');
[out,posters,samples,path.join(root,'logs')].forEach(p=>fs.mkdirSync(p,{recursive:true}));
const canvas=createCanvas(W,H),ctx=canvas.getContext('2d');
const hash=buffer=>crypto.createHash('sha256').update(buffer).digest('hex');
const manifestPath=path.join(out,'media-manifest.json');
let manifest=fs.existsSync(manifestPath)?JSON.parse(fs.readFileSync(manifestPath,'utf8')):{version:1,width:W,height:H,fps:FPS,duration:DURATION,createdAt:new Date().toISOString(),renderer:'Code-driven Canvas timeline + FFmpeg H.264',disclosure:'Illustrative screens. Tool names indicate relevant example stacks; no live external execution is claimed.',media:[]};
function getFrames(cat,k){return k==='demo'?(cat.demoSteps||cat.demo||cat.instructorSteps):(cat.projects||cat.showcase||cat.studentProjects)}
function drawAt(cat,k,frames,f){const pos=f/(FPS*DURATION)*frames.length;const index=Math.min(frames.length-1,Math.floor(pos)),local=pos-index;renderScreen(ctx,cat.id||cat.category,k,frames[index],index,local,f/(FPS*DURATION-1),frames.length);return {index,local}}
function stamp(seconds,sep=','){const ms=Math.round(seconds*1000);return '00:'+Math.floor(ms/60000).toString().padStart(2,'0')+':'+Math.floor(ms/1000%60).toString().padStart(2,'0')+sep+(ms%1000).toString().padStart(3,'0')}
function cues(frames,format='srt'){const sep=format==='vtt'?'.':',';return (format==='vtt'?'WEBVTT\n\n':'')+frames.map((e,i)=>String(i+1)+'\n'+stamp(i*DURATION/frames.length,sep)+' --> '+stamp((i+1)*DURATION/frames.length,sep)+'\n'+(e.title||e.name)+(e.tool?' — '+e.tool:'')+'\n').join('\n')}
function transcript(cat,k,frames){return names[cat.id]+' — '+(k==='demo'?'Illustrative screen demonstration':'24 illustrative project concepts')+'\n\nThese are code-animated interface illustrations and synthetic examples. They are not live software recordings or verified student submissions. Tool names describe indicative stacks.\n\n'+frames.map((e,i)=>stamp(i*DURATION/frames.length,'.')+'–'+stamp((i+1)*DURATION/frames.length,'.')+' | '+(i+1)+'. '+e.title+(e.tool?' / '+e.tool:'')+'\n'+(e.action||e.subtitle||e.detail||'')+'\n'+(e.content?.bullets||[]).map(s=>'  • '+s).join('\n')+(e.content?.code?'\nIllustrative '+e.content.language+' source:\n'+e.content.code.join('\n'):'')+'\n').join('\n')}
async function render(cat,k){
  const id=cat.id||cat.category,frames=getFrames(cat,k);if(!frames?.length)throw new Error('No frames for '+id+' '+k);
  const mediaId=id+'-'+k+'-15s',stem=mediaId+'-v20261123',file=path.join(out,stem+'.mp4');
  const shotFrames=[Math.round(FPS*.6),Math.round(FPS*3.4),Math.round(FPS*7.1),Math.round(FPS*10.8),Math.round(FPS*13.7)];
  const contact=createCanvas(W*3,H*2),cc=contact.getContext('2d');cc.fillStyle='#091321';cc.fillRect(0,0,W*3,H*2);
  shotFrames.forEach((f,j)=>{drawAt(cat,k,frames,f);fs.writeFileSync(path.join(samples,stem+'-sample-'+(j+1)+'.jpg'),canvas.toBuffer('image/jpeg',92));cc.putImageData(ctx.getImageData(0,0,W,H),(j%3)*W,Math.floor(j/3)*H)});
  cc.fillStyle='#edf3ff';cc.font='bold 48px Arial';cc.fillText(names[id],W*2+64,H+155);cc.font='32px Arial';cc.fillText(k==='demo'?'12 tool / workflow screens':'24 project concepts',W*2+64,H+220);cc.fillText('15 seconds • 1280 × 720 • 30fps',W*2+64,H+280);cc.fillText('Illustrative UI, generated from code',W*2+64,H+340);
  fs.writeFileSync(path.join(samples,stem+'-contact.jpg'),contact.toBuffer('image/jpeg',86));
  drawAt(cat,k,frames,k==='demo'?45:25);const poster=path.join(posters,stem+'.jpg');fs.writeFileSync(poster,canvas.toBuffer('image/jpeg',90));
  fs.writeFileSync(path.join(out,stem+'.srt'),cues(frames));fs.writeFileSync(path.join(out,stem+'.vtt'),cues(frames,'vtt'));fs.writeFileSync(path.join(out,stem+'.txt'),transcript(cat,k,frames));
  if(onlyFrames){console.log('FRAME PROOFS '+stem);return}
  const started=Date.now();console.log('RENDER '+stem+' / '+frames.length+' scenes');
  const args=['-hide_banner','-loglevel','warning','-y','-f','rawvideo','-pix_fmt','rgba','-s',W+'x'+H,'-r',String(FPS),'-i','pipe:0','-an','-c:v','libx264','-preset','fast','-crf','23','-pix_fmt','yuv420p','-r',String(FPS),'-movflags','+faststart','-metadata','comment=Acumelo illustrative screen montage; sample data and project concepts.',file];
  const ff=spawn(ffmpeg,args,{windowsHide:true,stdio:['pipe','ignore','pipe']});let stderr='';ff.stderr.on('data',b=>stderr+=b.toString());ff.stdin.on('error',()=>{});const done=once(ff,'close');
  const rawHashes=[];
  for(let f=0;f<FPS*DURATION;f++){drawAt(cat,k,frames,f);const pixels=ctx.getImageData(0,0,W,H).data;const buf=Buffer.from(pixels.buffer,pixels.byteOffset,pixels.byteLength);if(f%150===0)rawHashes.push(hash(buf));if(!ff.stdin.write(buf))await once(ff.stdin,'drain')}
  ff.stdin.end();const [exitCode]=await done;fs.writeFileSync(path.join(root,'logs',stem+'.log'),stderr);if(exitCode!==0)throw new Error('FFmpeg failed '+exitCode+' '+stderr);
  const item={id:mediaId,version:'2026-11-23',category:id,kind:k,type:k,title:k==='demo'?names[id]+' / tools in motion':names[id]+' / 24 project concepts',path:stem+'.mp4',poster:'posters/'+stem+'.jpg',durationSeconds:DURATION,width:W,height:H,fps:FPS,codec:'h264',pixelFormat:'yuv420p',silent:true,sceneCount:frames.length,projectCount:k==='showcase'?frames.length:0,frameworks:[...new Set((k==='showcase'?cat.demoSteps:frames).flatMap(e=>e.tool?[e.tool]:(e.tools||[])))],label:k==='demo'?'Illustrative screen demo':'Illustrative student project examples',subtitlePath:stem+'.vtt',srtPath:stem+'.srt',transcriptPath:stem+'.txt',sampleContactSheet:'samples/'+stem+'-contact.jpg',bytes:fs.statSync(file).size,sha256:hash(fs.readFileSync(file)),distinctRawFrameHashes:new Set(rawHashes).size,scenes:frames.map(e=>({title:e.title||e.name,archetype:e.archetype,tool:e.tool,action:e.action||e.subtitle,bullets:e.content?.bullets})),renderSeconds:Math.round((Date.now()-started)/1000)};
  manifest.media=manifest.media.filter(e=>e.id!==mediaId);manifest.media.push(item);manifest.pathBase='Paths are relative to this manifest directory.';fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2));console.log('DONE '+stem+' '+Math.round(item.bytes/1024)+'KB / '+item.renderSeconds+'s');
}
for(const cat of cats){const id=cat.id||cat.category;if(category!=='all'&&category!==id)continue;for(const k of ['demo','showcase']){if(kind==='all'||kind===k)await render(cat,k)}}
console.log('Manifest: '+manifestPath);
