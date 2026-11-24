import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import crypto from 'node:crypto';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=path.resolve(import.meta.dirname,'..'),base=process.env.QA_BASE_URL||'http://127.0.0.1:8792/';
const manifest=JSON.parse(await fs.readFile(path.join(root,'assets/media/20261124d/editorial-manifest.json'),'utf8'));
const url=new URL('assets/media/20261124d/index.html',base).href;
const report={url,editorialApproval:false,responsive:[],films:[],errors:[]};let browser;
try{
 browser=await chromium.launch({headless:true,executablePath:process.env.QA_BROWSER_EXECUTABLE||undefined,args:['--mute-audio','--autoplay-policy=no-user-gesture-required']});const page=await browser.newPage();page.on('pageerror',e=>report.errors.push(e.message));
 for(const width of [320,390])for(const lang of ['en','ko']){
  await page.setViewportSize({width,height:900});await page.goto(url);await page.locator('[data-language="'+lang+'"]').click();
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));assert.equal(await page.locator('video').count(),38);assert.equal(await page.locator('details,.media-transcript-link').count(),0);
  await page.locator('#person').selectOption('Chris');assert.equal(await page.locator('article:not([hidden])').count(),6);
  await page.locator('#person').selectOption('');await page.locator('#kind').selectOption('showcase');assert.equal(await page.locator('article:not([hidden])').count(),6);assert.equal(await page.locator('article:not([hidden]) track').count(),0);
  report.responsive.push({width,lang,passed:true});
 }
 await page.goto(url);
 for(const f of manifest.media){
  const card=page.locator('article[data-media-id="'+f.mediaId+'"]');assert.equal(await card.count(),1);
  const info=await card.locator('video').evaluate(async v=>{
   v.load();await Promise.race([new Promise((resolve,reject)=>{if(v.readyState>=1)return resolve();v.addEventListener('loadedmetadata',resolve,{once:true});v.addEventListener('error',()=>reject(Error('Video error')),{once:true});}),new Promise((_,reject)=>setTimeout(()=>reject(Error('Metadata timeout')),30000))]);
   await v.play();await new Promise(resolve=>setTimeout(resolve,120));v.pause();
   const captions=[];for(const t of v.querySelectorAll('track')){const r=await fetch(t.src);captions.push(r.ok&&(await r.text()).startsWith('WEBVTT'));}
   const poster=await fetch(v.poster);return{src:v.querySelector('source').src,width:v.videoWidth,height:v.videoHeight,duration:v.duration,controls:v.controls,playsInline:v.playsInline,autoplay:v.autoplay,captions,poster:poster.ok};
  });
  assert.equal(info.width,1280);assert.equal(info.height,720);assert(Math.abs(info.duration-f.durationSeconds)<.2);assert(info.controls&&info.playsInline&&!info.autoplay&&info.poster);assert.equal(info.captions.length,f.hasNarration?1:0);assert(info.captions.every(Boolean));
  const response=await fetch(info.src);assert(response.ok);const hash=crypto.createHash('sha256');let bytes=0;for await(const chunk of response.body){hash.update(chunk);bytes+=chunk.length;}assert.equal(hash.digest('hex'),f.sha256);assert.equal(bytes,f.bytes);
  report.films.push({id:f.id,...info,sha256:f.sha256,bytes,hashMatches:true,voiceId:f.voiceId,speakerId:f.speakerId,hasNarration:f.hasNarration});
 }
 const first=page.locator('video').nth(0),second=page.locator('video').nth(1);await first.evaluate(v=>v.play());await second.evaluate(v=>v.play());assert(await first.evaluate(v=>v.paused));await page.locator('#person').selectOption('Pillow');assert(await second.evaluate(v=>v.paused));
 report.singlePlayback=true;report.filterPauses=true;assert.equal(report.errors.length,0);report.passed=true;
}catch(error){report.passed=false;report.errors.push(error.stack);process.exitCode=1;}finally{if(browser)await browser.close();const p=process.env.QA_REPORT||'editorial-gallery-qa.json';await fs.mkdir(path.dirname(p),{recursive:true});await fs.writeFile(p,JSON.stringify(report,null,2));console.log(JSON.stringify({passed:report.passed,films:report.films.length,responsive:report.responsive.length,errors:report.errors}));}
