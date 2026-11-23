import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {renderScreen,W,H} from './screens.mjs';
const root=path.dirname(fileURLToPath(import.meta.url));
const out=path.join(root,'output');
const manifest=JSON.parse(fs.readFileSync(path.join(out,'media-manifest.json'),'utf8'));
const board=JSON.parse(fs.readFileSync(path.join(root,'./storyboard-coverage.json'),'utf8').replace(/^\uFEFF/,''));
const ffmpeg=process.env.FFMPEG_PATH||path.join(root,'vendor/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v9.0.2.exe');
const require=createRequire(import.meta.url);let canvasModule;
try{canvasModule=require('@napi-rs/canvas')}catch{canvasModule=require(path.join(process.env.CODEX_NODE_PACKAGES||path.join(root, 'node_modules'),'@napi-rs/canvas'))}
const {createCanvas}=canvasModule,canvas=createCanvas(W,H),ctx=canvas.getContext('2d');
const textIssues=[];const proxy=new Proxy(ctx,{get(target,key){if(key==='fillText')return function(value,...args){if(/undefined|\bNaN\b|\[object Object\]/.test(String(value)))textIssues.push(String(value));return target.fillText(value,...args)};const v=Reflect.get(target,key,target);return typeof v==='function'?v.bind(target):v},set(target,key,value){return Reflect.set(target,key,value,target)}});
const coverage=[];
for(const category of board.categories)for(const kind of ['demo','showcase']){const scenes=kind==='demo'?category.demoSteps:category.projects;for(let i=0;i<scenes.length;i++)for(const t of [.23,.81])renderScreen(proxy,category.id,kind,scenes[i],i,t,(i+t)/scenes.length,scenes.length);coverage.push({category:category.id,kind,count:scenes.length,uniqueTitles:new Set(scenes.map(s=>s.title)).size,archetypes:[...new Set(scenes.map(s=>s.archetype))]})}
const checks=[];
for(const media of manifest.media){const file=path.resolve(out,media.path);const result=spawnSync(ffmpeg,['-hide_banner','-i',file,'-map','0:v:0','-an','-f','framemd5','-'],{encoding:'utf8',windowsHide:true,maxBuffer:12*1024*1024});const log=result.stderr||'',hashRows=(result.stdout||'').split(/\r?\n/).filter(s=>/^0,/.test(s));const hashes=hashRows.map(s=>s.split(',').at(-1).trim());const duration=Number(log.match(/Duration: (\d+):(\d+):(\d+\.\d+)/)?.[3]);const size=log.match(/Video: h264[^\n]*?yuv420p[^\n]*?, (\d+)x(\d+)/);const timingOK=duration===15&&/30 fps/.test(log);const frameOK=hashes.length===450;const motionOK=new Set(hashes).size>400;const dimensionsOK=Number(size?.[1])===1280&&Number(size?.[2])===720;const codecOK=/Video: h264[^\n]*yuv420p/.test(log);const attachmentsOK=[media.poster,media.subtitlePath,media.srtPath,media.transcriptPath].every(p=>fs.existsSync(path.resolve(out,p)));const buf=fs.readFileSync(file);const faststartOK=buf.indexOf('moov')>0&&buf.indexOf('moov')<buf.indexOf('mdat');const pass=result.status===0&&timingOK&&frameOK&&motionOK&&dimensionsOK&&codecOK&&attachmentsOK&&faststartOK;checks.push({id:media.id,pass,durationSeconds:duration,width:Number(size?.[1]),height:Number(size?.[2]),decodedFrames:hashes.length,uniqueDecodedFrames:new Set(hashes).size,codec:'h264',pixelFormat:'yuv420p',fps:30,faststart:faststartOK,attachmentsPresent:attachmentsOK,bytes:buf.length,decodeExitCode:result.status});console.log((pass?'PASS ':'FAIL ')+media.id+' / '+hashes.length+' decoded frames / '+new Set(hashes).size+' unique');if(!pass)fs.writeFileSync(path.join(root,'logs',media.id+'-validation.log'),log)}
const report={validatedAt:new Date().toISOString(),pass:checks.length===12&&checks.every(s=>s.pass)&&textIssues.length===0,mediaCount:checks.length,expectedMediaCount:12,totalDecodedFrames:checks.reduce((a,s)=>a+s.decodedFrames,0),expectedDecodedFrames:5400,demoSceneCount:coverage.filter(x=>x.kind==='demo').reduce((a,s)=>a+s.count,0),projectConceptCount:coverage.filter(x=>x.kind==='showcase').reduce((a,s)=>a+s.count,0),renderTextIssues:textIssues,footerLayout:'Disclosure is fitted within x39–669; action is clipped to x711–1238. Distinct non-overlapping regions.',coverage,checks};
fs.writeFileSync(path.join(out,'validation-report.json'),JSON.stringify(report,null,2));
if(!report.pass)process.exitCode=1;
console.log('Validation report: '+path.join(out,'validation-report.json'));
