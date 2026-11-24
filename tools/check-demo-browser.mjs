import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const base=process.env.QA_BASE_URL||'http://127.0.0.1:8791/';
const report={base,cases:[],errors:[]};let browser;
try{
 browser=await chromium.launch({headless:true,executablePath:process.env.QA_BROWSER_EXECUTABLE||undefined,args:['--mute-audio']});
 const page=await browser.newPage();page.on('pageerror',e=>report.errors.push(e.message));
 await page.goto(base);const data=await page.evaluate(()=>window.ACUMELO);
 for(const width of process.env.QA_SMOKE_ONLY ? [] : [320,390])for(const lang of ['en','ko'])for(const member of data.members){
  await page.setViewportSize({width,height:900});await page.evaluate(lang=>localStorage.setItem('acumelo.language',lang),lang);
  await page.goto(new URL('?page='+member.id,base).href);
  const section=page.locator('#'+member.id+' .profile-own-demo');
  assert.equal(await section.locator('.demo-filter').count(),member.teachingFieldIds.length+1);
  assert.equal(await section.locator('.demo-result').count(),member.teachingFieldIds.length);
  const mediaIds=await section.locator('.demo-result').evaluateAll(nodes=>nodes.map(n=>n.dataset.mediaId));
  for(const id of mediaIds){assert.equal(data.mediaCatalog[id].assignedInstructorId,member.id);assert.equal(data.mediaCatalog[id].scope,'instructor');}
  for(const field of member.teachingFieldIds){
   const chip=section.locator('.demo-filter[data-field-id="'+field+'"]');await chip.click();assert.equal(await chip.getAttribute('aria-pressed'),'true');
   assert.equal(await section.locator('.demo-result').count(),1);
   const id=await section.locator('.profile-demo-player .media-card').getAttribute('data-media-id');assert.equal(data.mediaCatalog[id].fieldId,field);
  }
  await section.locator('.demo-reset').click();
  const input=section.locator('.demo-search');assert(await input.evaluate(n=>n===document.activeElement));
  const first=data.mediaCatalog[mediaIds[0]],query=first.tools[0];
  await input.fill(query);assert(await section.locator('.demo-result').count()>0);
  const queryIds=await section.locator('.demo-result').evaluateAll(nodes=>nodes.map(n=>n.dataset.mediaId));
  assert(queryIds.includes(first.mediaId));
  await input.fill('no-matching-demo-987654');assert.equal(await section.locator('.demo-result').count(),0);assert.equal(await section.locator('video').count(),0);assert(await section.locator('.demo-empty').isVisible());
  await section.locator('.demo-clear').click();assert(await input.evaluate(n=>n===document.activeElement));assert.equal(await section.locator('.demo-result').count(),member.teachingFieldIds.length);
  await input.fill(lang==='ko'?'엑셀':'Excel');if(member.id==='instructor-chris')assert(await section.locator('.demo-result').count()>0);
  await section.locator('.demo-reset').click();
  const dimensions=await section.evaluate(el=>({overflow:document.documentElement.scrollWidth>innerWidth+1,small:[...el.querySelectorAll('button,input')].filter(n=>n.getBoundingClientRect().height<44).length}));
  assert.equal(dimensions.overflow,false,member.id+' '+width+' '+lang);assert.equal(dimensions.small,0);
  if(member.id==='instructor-chris'&&width===390&&lang==='en'&&process.env.QA_SCREENSHOT)await section.screenshot({path:process.env.QA_SCREENSHOT});
  report.cases.push({instructor:member.id,width,lang,results:mediaIds.length,passed:true});
 }
 // Manual playback, switch/zero-result pause, and invalid mapping isolation in the actual browser.
 await page.goto(new URL('?page=instructor-chris',base).href);
 const section=page.locator('#instructor-chris .profile-own-demo');
 const keyboardField=section.locator('[data-field-id="strategy"]');await keyboardField.focus();await page.keyboard.press('Space');assert.equal(await keyboardField.getAttribute('aria-pressed'),'true');
 assert(await keyboardField.evaluate(n=>n.matches(':focus-visible')));
 await section.locator('video').evaluate(async v=>{window.testPreviousVideo=v;await v.play();});
 await section.locator('[data-field-id="development"]').click();assert(await page.evaluate(()=>window.testPreviousVideo.paused));
 assert(await section.locator('video').evaluate(v=>v.paused));
 await section.locator('video').evaluate(async v=>{window.testPreviousVideo=v;await v.play();});
 await section.locator('.demo-search').fill('no-matching-demo-987654');assert(await page.evaluate(()=>window.testPreviousVideo.paused));
 await section.locator('.demo-reset').click();
 await page.evaluate(()=>{const d=window.ACUMELO;for(const a of d.mediaAssignments.filter(a=>a.assignedInstructorId==='instructor-chris'&&a.placement==='profile-demo'))d.mediaCatalog[a.mediaId].voiceId='wrong-person';});
 await page.setViewportSize({width:1440,height:1000});
 await page.locator('[data-lang="en"]').click();
 assert.equal(await section.locator('video').count(),0);assert.equal(await section.locator('.demo-result').count(),0);assert.equal(await section.locator('.demo-filter').count(),7);
 assert.equal(report.errors.length,0);report.passed=true;
}catch(error){report.passed=false;report.errors.push(error.stack);process.exitCode=1;}finally{
 if(browser)await browser.close();const file=process.env.QA_REPORT||'demo-browser-qa.json';await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,JSON.stringify(report,null,2));console.log(JSON.stringify({passed:report.passed,cases:report.cases.length,errors:report.errors}));
}
