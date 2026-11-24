// Headless automated QA only: never open or control a desktop browser window.
import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import {spawn} from 'node:child_process';import {once} from 'node:events';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=path.resolve(import.meta.dirname,'..'),reportPath=process.env.QA_REPORT||path.join(root,'.local/browser-qa.json');
const external=process.env.QA_BASE_URL;let server,browser;
const result={mode:'headless-no-desktop-window',baseUrl:external||'http://127.0.0.1:18766/',responsive:[],playback:[],errors:[],passed:false};
try{
 if(!external){server=spawn(process.execPath,['tools/serve.mjs'],{cwd:root,env:{...process.env,PORT:'18766'},windowsHide:true,stdio:['ignore','pipe','pipe']});await Promise.race([once(server.stdout,'data'),once(server,'error').then(([e])=>{throw e})]);}
 browser=await chromium.launch({headless:true,executablePath:process.env.QA_BROWSER_EXECUTABLE||undefined,args:['--mute-audio','--autoplay-policy=no-user-gesture-required']});
 const context=await browser.newContext(),page=await context.newPage();page.on('pageerror',e=>result.errors.push(e.message));
 const url=pageId=>new URL('?page='+pageId,result.baseUrl).href;
 await page.goto(url('home'));
 const data=await page.evaluate(()=>window.ACUMELO);
 const activeMedia=[...new Set(data.mediaAssignments.filter(a=>a.status==='active'&&a.placement!=='owner-library').map(a=>a.mediaId))].map(id=>data.mediaCatalog[id]);assert.equal(activeMedia.length,38);assert.equal(data.mediaAssignments.filter(a=>a.status==='active'&&a.placement==='profile-demo').length,26);
 for(const width of [320,390])for(const language of ['en','ko']){
  await page.setViewportSize({width,height:844});await page.goto(url('home'));
  if(!await page.locator('[data-lang="'+language+'"]').isVisible())await page.locator('#menu-toggle').click();
  await page.locator('[data-lang="'+language+'"]').click();
  for(const id of ['library',...data.copy.en.courses.map(c=>c.id),...data.members.map(m=>m.id)]){
   await page.goto(url(id));await page.waitForFunction(()=>document.body.dataset.page===new URL(location.href).searchParams.get('page'));
   const measurement=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));assert(measurement.scroll<=width+1,JSON.stringify({id,language,...measurement}));
   if(id.startsWith('instructor-')){
    const member=data.members.find(m=>m.id===id),selector=page.locator('#'+id+' .demo-filters');
    assert.equal(await selector.locator('button').count(),member.teachingFieldIds.length+1);
    for(const field of member.teachingFieldIds){await selector.locator('[data-field-id="'+field+'"]').click();const actual=await page.locator('#'+id+' .profile-demo-player .media-card').getAttribute('data-media-id');assert.equal(actual,member.media.demos[field]);assert.equal(await page.locator('#'+id+' .profile-demo-player video').count(),1);}
    assert.equal(await page.locator('#'+id+' [data-media-group="lecture"] video').count(),0);
   }
   result.responsive.push({id,width,language,passed:true});
  }
 }
 await page.goto(url('instructor-chris'));
 await page.evaluate(async()=>{window.qaOld=document.querySelector('#instructor-chris .profile-demo-player video');await window.qaOld.play();});
 await page.locator('#instructor-chris .demo-filter[data-field-id="development"]').click();assert(await page.evaluate(()=>window.qaOld.paused));
 await page.evaluate(async()=>{const a=document.querySelector('#instructor-chris .profile-demo-player video');await a.play();const b=document.querySelector('#instructor-chris [data-media-group="field-projects"] video');await b.play();window.qaSecond=b;});
 assert(await page.evaluate(()=>document.querySelector('#instructor-chris .profile-demo-player video').paused));
 await page.locator('#instructor-chris a[data-page-link="development"]').first().click();assert(await page.evaluate(()=>window.qaSecond.paused));
 result.singlePlayback=true;result.fieldChangePauses=true;result.navigationPauses=true;
 const gallery=new URL(data.mediaGallery,result.baseUrl).href;
 for(const width of [320,390])for(const language of ['en','ko']){
  await page.setViewportSize({width,height:844});await page.goto(gallery);await page.locator('[data-language="'+language+'"]').click();
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));assert.equal(await page.locator('video').count(),38);
  assert.equal(await page.locator('details,.media-transcript-link').count(),0);
  result.responsive.push({id:'gallery',width,language,passed:true});
 }
 await page.goto(gallery);
 for(const media of activeMedia){
  const file=media.src.split('/').pop();
  const info=await page.evaluate(async filename=>{
   const video=[...document.querySelectorAll('video')].find(v=>v.querySelector('source')?.getAttribute('src').split('/').pop()===filename);
   if(!video)throw Error('Missing gallery video '+filename);
   video.load();await Promise.race([new Promise((resolve,reject)=>{if(video.readyState>=1)return resolve();video.addEventListener('loadedmetadata',resolve,{once:true});video.addEventListener('error',()=>reject(Error('Video failed '+filename)),{once:true});}),new Promise((_,reject)=>setTimeout(()=>reject(Error('Metadata timeout '+filename)),20000))]);
   await video.play();await new Promise(resolve=>setTimeout(resolve,80));video.pause();
   const track=video.querySelector('track');let captionOk=!track;if(track){const caption=await fetch(track.src);captionOk=caption.ok&&(await caption.text()).startsWith('WEBVTT');}
   const poster=await fetch(video.poster);const info={duration:video.duration,width:video.videoWidth,height:video.videoHeight,autoplay:video.autoplay,controls:video.controls,playsInline:video.playsInline,caption:captionOk,captionTracks:video.querySelectorAll('track').length,poster:poster.ok};
   video.preload='none';return info;
  },file);
  assert.equal(info.captionTracks,(media.captions||[]).length);assert(Math.abs(info.duration-media.durationSeconds)<0.6);assert.equal(info.width,1280);assert.equal(info.height,720);assert(info.caption&&info.poster&&info.controls&&info.playsInline&&!info.autoplay);
  result.playback.push({mediaId:media.mediaId,...info});
 }
 assert.equal(result.errors.length,0);result.passed=true;
}catch(error){result.failure=error.stack;process.exitCode=1;}finally{
 if(browser)await browser.close();if(server){server.kill();await once(server,'exit').catch(()=>{});}
 await fs.mkdir(path.dirname(reportPath),{recursive:true});await fs.writeFile(reportPath,JSON.stringify(result,null,2)+'\n');
 console.log(JSON.stringify({passed:result.passed,responsiveCases:result.responsive.length,played:result.playback.length,failure:result.failure,errors:result.errors}));
}
