import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const base=process.env.QA_BASE_URL||'http://127.0.0.1:8792/';
const browser=await chromium.launch({headless:true,executablePath:process.env.QA_BROWSER_EXECUTABLE,args:['--mute-audio','--autoplay-policy=no-user-gesture-required']});
const page=await browser.newPage({viewport:{width:390,height:900}}),cases=[],errors=[];
page.on('pageerror',e=>errors.push(e.message));
try{
 for(const [person,field,tab] of [['instructor-chris','workflow','demo'],['instructor-sage','design','demo'],['instructor-03','development','demo'],['instructor-04','workflow','demo'],['instructor-chris','design','project']]){
  await page.goto(`${base}?page=${person}&field=${field}&tab=${tab}`,{waitUntil:'domcontentloaded'});
  const state=await page.locator('video').evaluate(async v=>{
   if(v.autoplay||!v.paused||v.preload!=='none')throw Error('Playback must start manually');
   await v.play();await new Promise(r=>setTimeout(r,180));
   const result={src:v.currentSrc,time:v.currentTime,duration:v.duration,paused:v.paused,tracks:[...v.querySelectorAll('track')].map(t=>t.src)};
   window.previousPlayer=v;return result;
  });
  assert(state.time>0);assert(!state.paused);assert(state.duration>0);
  const poster=await page.locator('video').getAttribute('poster');
  assert.equal((await page.request.get(new URL(poster,base).href)).status(),200);
  for(const track of state.tracks)assert.equal((await page.request.get(track)).status(),200);
  await page.locator('[role=tab][data-tab=curriculum]').click();
  assert(await page.evaluate(()=>previousPlayer.paused&&!previousPlayer.isConnected));assert.equal(await page.locator('video').count(),0);
  cases.push({person,field,tab,...state,tabChangeStopped:true});
 }
 await page.goto(`${base}?page=instructor-chris&field=workflow&tab=demo`,{waitUntil:'domcontentloaded'});
 await page.locator('video').evaluate(async v=>{await v.play();window.previousPlayer=v;});
 await page.locator('.learning-field-select').selectOption('design');assert(await page.evaluate(()=>previousPlayer.paused&&!previousPlayer.isConnected));
 await page.locator('video').evaluate(async v=>{
  await v.play();window.previousPlayer=v;
  const second=v.cloneNode(true);document.querySelector('.learning-media').append(second);await second.play();
  if(!v.paused)throw Error('Simultaneous playback');second.pause();second.remove();await v.play();
 });
 await page.locator('.course-back').click();assert(await page.evaluate(()=>previousPlayer.paused&&!previousPlayer.isConnected));
 cases.push({name:'field-page-single-player-stop',passed:true});
 await page.goto(`${base}?page=instructor-chris&field=workflow&tab=curriculum`,{waitUntil:'domcontentloaded'});
 assert(await page.locator('[role=tab]').evaluateAll(ns=>ns.every(n=>document.getElementById(n.getAttribute('aria-controls')))));
 await page.locator('.learning-panel a[data-page-link=contact]').click();
 await page.locator('#organization').fill('QA team');await page.locator('#enquiry').fill('Keep this exact enquiry.');
 await page.locator('#enquiry-form button[type=submit]').click();
 const draft=await page.locator('#enquiry-draft').inputValue();assert(draft.includes('Chris')&&draft.includes('Workflow')&&draft.includes('Keep this exact enquiry.'));
 cases.push({name:'aria-idrefs-and-enquiry-draft',passed:true});
 if(process.env.QA_SCREENSHOT_DIR){
  for(const lang of ['en','ko']){
   await page.evaluate(l=>localStorage.setItem('acumelo.language',l),lang);
   for(const [width,id,field,tab] of [[320,'instructor-chris','workflow','demo'],[390,'instructor-chris','workflow','curriculum'],[390,'lectures','',''],[1440,'lectures','',''],[1440,'design','design','curriculum']]){
    await page.setViewportSize({width,height:900});await page.goto(`${base}?page=${id}&field=${field}&tab=${tab}`,{waitUntil:'networkidle'});
    // Verify a poster is fetched before taking the review image; no playback or media editing.
    if(await page.locator('video').count())await page.locator('video').evaluate(v=>new Promise((ok,no)=>{const i=new Image();i.onload=ok;i.onerror=no;i.src=v.poster;}));
    await page.screenshot({path:`${process.env.QA_SCREENSHOT_DIR}/learning-${lang}-${width}-${id}-${tab||'list'}.png`,fullPage:true});
   }
  }
 }
}catch(e){errors.push(e.stack);}finally{await browser.close();}
await fs.writeFile(process.env.QA_REPORT||'learning-playback-qa.json',JSON.stringify({passed:!errors.length,cases,errors},null,2));
console.log(JSON.stringify({passed:!errors.length,cases:cases.length,errors}));if(errors.length)process.exitCode=1;
