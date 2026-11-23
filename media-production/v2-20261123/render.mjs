import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import crypto from 'node:crypto';
import {members,fields,colors,projects,categoryScenes,references} from './blueprint.mjs';
import {renderFrame,W,H,FPS,DURATION} from './visuals.mjs';
import {ffmpeg,registerFonts} from './runtime.mjs';
const root=path.dirname(fileURLToPath(import.meta.url)),out=path.join(root,'output');
const req=createRequire(import.meta.url);let lib;try{lib=req('@napi-rs/canvas')}catch{lib=req('@napi-rs/canvas')}
const {createCanvas,loadImage,GlobalFonts}=lib;
registerFonts(GlobalFonts);
const arg=(name,def)=>{let i=process.argv.indexOf('--'+name);return i>=0?process.argv[i+1]:def};
const only=arg('only','all'),kindFilter=arg('kind','all'),proof=process.argv.includes('--proof'),shard=arg('shard','0/1').split('/').map(Number);
for(const p of [out,path.join(out,'posters'),path.join(out,'captions'),path.join(out,'transcripts'),path.join(root,'proofs'),path.join(root,'logs')])fs.mkdirSync(p,{recursive:true});
const assets={};for(const key of ['product','sculpture','gallery','islands']){const dir=path.join(root,'assets/blender',key);assets[key]=await Promise.all(fs.readdirSync(dir).filter(f=>f.endsWith('.jpg')).sort().map(f=>loadImage(path.join(dir,f))))}
for(const key of ['world','headphones','forest','coastal','portal','desert','watch'])assets[key]=await loadImage(path.join(root,'assets',key+'.png'));
const items=[...members.map(m=>({id:m.id+'-demo',instructorId:m.id,name:m.name,kind:'demo',scope:'instructor',fieldIds:m.fields,color:m.color,title:m.name+' / '+m.focus,scenes:m.scenes,stem:'instructor-'+m.name.toLowerCase()+'-demo-15s-v20261123b'})),...Object.keys(fields).flatMap(f=>[{id:f+'-demo-15s',category:f,fieldIds:[f],kind:'demo',scope:'category',title:fields[f]+' / Frameworks in practice',categoryTitle:fields[f],color:colors[f],scenes:categoryScenes[f],stem:f+'-demo-15s-v20261123b'},{id:f+'-showcase-15s',category:f,fieldIds:[f],kind:'showcase',scope:'category',title:fields[f]+' / 24 finished project concepts',categoryTitle:fields[f],color:colors[f],scenes:projects[f],stem:f+'-showcase-15s-v20261123b'}])];
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const canvas=createCanvas(W,H),c=canvas.getContext('2d');
function at(item,frame){const pos=frame/(FPS*DURATION)*item.scenes.length,i=Math.min(item.scenes.length-1,Math.floor(pos));renderFrame(c,item.scenes[i],pos-i,{...item,sceneIndex:i,sceneCount:item.scenes.length},assets)}
const stamp=s=>{const ms=Math.round(s*1000);return '00:'+String(Math.floor(ms/60000)).padStart(2,'0')+':'+String(Math.floor(ms/1000)%60).padStart(2,'0')+'.'+String(ms%1000).padStart(3,'0')};
function captions(item){return 'WEBVTT\n\n'+item.scenes.map((s,i)=>`${i+1}\n${stamp(i*15/item.scenes.length)} --> ${stamp((i+1)*15/item.scenes.length)}\n${s.tool?s.tool+' — ':''}${s.title}\n`).join('\n')}
const disclosure='Original animated workflow reconstructions and generated project concepts. Not recordings of live software sessions or verified student submissions. Tool names identify the illustrated workflows; no endorsement is implied.';
for(let n=0;n<items.length;n++){
 const item=items[n];if(only!=='all'&&only!==item.id&&only!==item.scope&&only!==item.category&&only!==item.name?.toLowerCase())continue;if(kindFilter!=='all'&&kindFilter!==item.kind)continue;if(n%shard[1]!==shard[0])continue;
 const contact=createCanvas(1280,720),cc=contact.getContext('2d');cc.fillStyle='#0e1a2a';cc.fillRect(0,0,1280,720);const count=item.kind==='showcase'?12:6,cols=item.kind==='showcase'?4:3,rows=item.kind==='showcase'?3:2;
 for(let j=0;j<count;j++){at(item,Math.floor((j+.4)/count*FPS*DURATION));cc.drawImage(canvas,j%cols*1280/cols,Math.floor(j/cols)*720/rows,1280/cols,720/rows)}
 fs.writeFileSync(path.join(root,'proofs',item.stem+'-contact.jpg'),contact.toBuffer('image/jpeg',90));
 at(item,Math.floor(15/item.scenes.length*.55*FPS));fs.writeFileSync(path.join(out,'posters',item.stem+'.jpg'),canvas.toBuffer('image/jpeg',87));
 fs.writeFileSync(path.join(out,'captions',item.stem+'.vtt'),captions(item));
 const transcript=item.title+'\n\n'+disclosure+'\n\n'+item.scenes.map((s,i)=>`${stamp(i*15/item.scenes.length)} – ${stamp((i+1)*15/item.scenes.length)} | ${String(i+1).padStart(2,'0')} | ${s.tool||'Finished output'}\n${s.title}\n${s.detail}\n`).join('\n');
 fs.writeFileSync(path.join(out,'transcripts',item.stem+'.txt'),transcript);
 if(proof){console.log('PROOF '+item.id);continue}
 const file=path.join(out,item.stem+'.mp4');const start=Date.now();
 console.log('RENDER '+item.id+' / '+item.scenes.length+' scenes');
 const ff=spawn(ffmpeg,['-hide_banner','-loglevel','warning','-y','-f','rawvideo','-pix_fmt','rgba','-s',`${W}x${H}`,'-r',String(FPS),'-i','pipe:0','-an','-c:v','libx264','-preset','fast','-crf','22','-pix_fmt','yuv420p','-movflags','+faststart','-metadata','comment=Acumelo: animated workflow reconstructions and generated project concepts.',file],{windowsHide:true,stdio:['pipe','ignore','pipe']});let err='';ff.stderr.on('data',d=>err+=d);ff.stdin.on('error',()=>{});const done=once(ff,'close');
 for(let f=0;f<FPS*DURATION;f++){at(item,f);const d=c.getImageData(0,0,W,H).data;const buf=Buffer.from(d.buffer,d.byteOffset,d.byteLength);if(!ff.stdin.write(buf))await once(ff.stdin,'drain')}
 ff.stdin.end();const [exitCode]=await done;fs.writeFileSync(path.join(root,'logs',item.stem+'.log'),err);if(exitCode!==0)throw new Error(err);
 const record={...item,version:'2026-11-23b',durationSeconds:15,width:W,height:H,fps:FPS,codec:'h264',pixelFormat:'yuv420p',silent:true,path:item.stem+'.mp4',poster:'posters/'+item.stem+'.jpg',subtitlePath:'captions/'+item.stem+'.vtt',transcriptPath:'transcripts/'+item.stem+'.txt',sceneCount:item.scenes.length,projectCount:item.kind==='showcase'?24:0,frameworks:[...new Set(item.scenes.map(s=>s.tool).filter(Boolean))],label:item.kind==='showcase'?'Finished project concepts':'Illustrative framework demonstration',illustrative:true,disclosure,bytes:fs.statSync(file).size,sha256:hash(fs.readFileSync(file)),renderSeconds:Math.round((Date.now()-start)/1000)};
 fs.writeFileSync(path.join(out,item.stem+'.json'),JSON.stringify(record,null,2));console.log('DONE '+item.id+' '+Math.round(record.bytes/1024)+' KB / '+record.renderSeconds+'s');
}
const existing=fs.readdirSync(out).filter(f=>f.endsWith('-v20261123b.json')).map(f=>JSON.parse(fs.readFileSync(path.join(out,f),'utf8')));
existing.sort((a,b)=>items.findIndex(x=>x.id===a.id)-items.findIndex(x=>x.id===b.id));
const manifest={version:2,revision:'2026-11-23b',createdAt:new Date().toISOString(),durationSeconds:15,width:W,height:H,fps:FPS,disclosure,expectedCount:23,mapping:members.map(({id,name,fields,focus})=>({id,name,fieldIds:fields,focus})),references,media:existing};
fs.writeFileSync(path.join(out,'media-manifest.json'),JSON.stringify(manifest,null,2));
fs.writeFileSync(path.join(root,'production-blueprint.json'),JSON.stringify({members,fields,projects,categoryScenes,references},null,2));
console.log('MANIFEST '+existing.length+'/23');
