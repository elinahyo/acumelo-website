// Headless interaction checks for the field-scoped learning workspace.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root=new URL('../',import.meta.url), sandbox={window:{}};
vm.runInNewContext(await fs.readFile(new URL('content.js',root),'utf8'),sandbox);
const data=JSON.parse(JSON.stringify(sandbox.window.ACUMELO));
const base=process.env.QA_BASE_URL || 'http://127.0.0.1:8792/';
const browser=await chromium.launch({headless:true,executablePath:process.env.QA_BROWSER_EXECUTABLE,args:['--mute-audio']});
const cases=[],errors=[];
let page;
const check=async(name,fn)=>{try{await fn();cases.push({name,passed:true});}catch(e){errors.push({name,error:e.message});throw e;}};
const tabs=['curriculum','lecture','demo','project'];
const route=(pageId,field,tab='curriculum')=>`${base}?page=${pageId}&field=${field}&tab=${tab}`;
const overflow=()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1);
try {
 const context=await browser.newContext();
 page=await context.newPage();page.on('pageerror',e=>errors.push({name:'pageerror',error:e.message}));
 // Structural checks do not download unchanged video assets.
 await page.route('**/*.mp4',r=>r.abort());
 for(const lang of ['en','ko'])for(const width of [320,360,390,768,1440]){
  await page.setViewportSize({width,height:900});
  await page.goto(base,{waitUntil:'domcontentloaded'});
  await page.evaluate(l=>localStorage.setItem('acumelo.language',l),lang);
  for(const member of data.members){
   await page.goto(route(member.id,member.teachingFieldIds[0]),{waitUntil:'domcontentloaded'});
   for(const field of member.teachingFieldIds){
    await check(`${lang}/${width}/${member.id}/${field}`,async()=>{
     if(width<=900)await page.locator('.learning-field-select').selectOption(field);
     else await page.locator(`.learning-field-button[data-field-id="${field}"]`).click();
     assert.equal(await page.locator('.learning-workspace').getAttribute('data-field-id'),field);
     assert.equal(new URL(page.url()).searchParams.get('field'),field);
     assert.equal(await page.locator('.learning-field-select option').count(),member.teachingFieldIds.length);
     for(const tab of tabs){
      await page.locator(`[role=tab][data-tab=${tab}]`).click();
      assert.equal(await page.locator('[role=tabpanel]').count(),1);
      assert.equal(await page.locator('[role=tab][aria-selected=true]').getAttribute('data-tab'),tab);
      assert.equal(new URL(page.url()).searchParams.get('tab'),tab);
      const cards=await page.locator('.learning-panel .media-card').evaluateAll(ns=>ns.map(n=>({...n.dataset})));
      if(tab==='curriculum'){
       assert.equal(await page.locator('[role=tabpanel]').getAttribute('data-curriculum-id'),`${member.id}-${field}-curriculum`);
       assert.equal(await page.locator('.learning-modules').count(),0,'Unconfirmed personal curriculum must not copy field modules');
      }
      if(tab==='demo'){
       assert.equal(cards.length,1);assert.equal(cards[0].assignedInstructorId,member.id);assert.equal(cards[0].voiceId,member.media.voiceId);assert.equal(cards[0].scope,'instructor');
       const expected=data.mediaAssignments.find(a=>a.status==='active'&&a.placement==='profile-demo'&&a.assignedInstructorId===member.id&&a.fieldId===field);
       assert.equal(cards[0].mediaId,expected.mediaId);
      }
      if(tab==='project'){assert.equal(cards.length,1);assert.equal(cards[0].scope,'category');assert(!cards[0].assignedInstructorId);}
      if(tab==='lecture')assert.equal(cards.length,0,'Empty lecture is a compact notice');
      assert.equal(await page.locator('video').count(),tab==='demo'||tab==='project'?1:0,'No inactive media in DOM');
      assert(await overflow(),'Horizontal overflow');
     }
    });
   }
  }
  for(const course of data.copy[lang].courses){
   await page.goto(route(course.id,course.id),{waitUntil:'domcontentloaded'});
   await check(`${lang}/${width}/field/${course.id}`,async()=>{
    assert.equal(await page.locator('.learning-module').count(),course.curriculum.length);
    await page.locator('.learning-module summary').first().click();
    assert(await page.locator('.learning-module').first().evaluate(n=>n.open));
    const links=await page.locator('.learning-instructors a').evaluateAll(ns=>ns.map(n=>n.href));
    assert.equal(links.length,data.members.filter(m=>m.teachingFieldIds.includes(course.id)).length);
    for(const link of links){assert.equal(new URL(link).searchParams.get('field'),course.id);assert.equal(new URL(link).searchParams.get('tab'),'curriculum');}
    for(const tab of tabs){await page.locator(`[role=tab][data-tab=${tab}]`).click();assert(await overflow());assert.equal(await page.locator('video').count(),['demo','project'].includes(tab)?1:0);}
   });
  }
  await page.goto(base+'?page=lectures',{waitUntil:'domcontentloaded'});
  await check(`${lang}/${width}/comparison`,async()=>{assert.equal(await page.locator('.comparison-link').count(),6);assert.equal(await page.locator('.comparison-cell').count(),12);assert(await overflow());});
 }
 await page.setViewportSize({width:390,height:844});
 await page.goto(route('instructor-chris','workflow','demo'),{waitUntil:'domcontentloaded'});
 await check('scoped-search',async()=>{
  await page.locator('.learning-search summary').click();
  await page.locator('.demo-search').fill('zzzz-absent');assert.equal(await page.locator('video').count(),0);
  await page.locator('.demo-clear').click();assert.equal(await page.locator('video').count(),1);
  assert(await page.locator('.demo-search').evaluate(n=>n===document.activeElement));
  await page.locator('.demo-search').fill('엑셀');assert.equal(await page.locator('video').count(),1);
 });
 await check('history-refresh-language',async()=>{
  await page.locator('.learning-field-select').selectOption('design');
  await page.locator('[data-tab=project]').click();
  await page.goBack();assert.equal(await page.locator('.learning-workspace').getAttribute('data-tab'),'demo');
  await page.goBack();assert.equal(await page.locator('.learning-workspace').getAttribute('data-field-id'),'workflow');
  await page.goForward();assert.equal(await page.locator('.learning-workspace').getAttribute('data-field-id'),'design');
  await page.reload();assert.equal(await page.locator('.learning-workspace').getAttribute('data-field-id'),'design');
  await page.locator('#menu-toggle').click();await page.locator('[data-lang=en]').click();await page.locator('#menu-toggle').click();
  assert.equal(await page.locator('.learning-workspace').getAttribute('data-field-id'),'design');assert.equal(await page.locator('.learning-workspace').getAttribute('data-tab'),'demo');
 });
 await check('keyboard-tabs-no-jump',async()=>{
  await page.locator('[role=tab][data-tab=curriculum]').click();
  await page.locator('[role=tab][data-tab=curriculum]').focus();
  const y=await page.evaluate(()=>scrollY);await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('[role=tab][aria-selected=true]').getAttribute('data-tab'),'lecture');
  assert(Math.abs(await page.evaluate(()=>scrollY)-y)<2);
  await page.keyboard.press('End');assert.equal(await page.locator('[role=tab][aria-selected=true]').getAttribute('data-tab'),'project');
  await page.keyboard.press('Home');assert.equal(await page.locator('[role=tab][aria-selected=true]').getAttribute('data-tab'),'curriculum');
 });
 await check('invalid-field-and-tab',async()=>{
  await page.goto(route('instructor-sage','workflow','not-a-tab'),{waitUntil:'domcontentloaded'});
  assert.equal(await page.locator('.learning-workspace').getAttribute('data-field-id'),'strategy');assert.equal(await page.locator('.learning-workspace').getAttribute('data-tab'),'curriculum');
  assert.equal(new URL(page.url()).searchParams.get('field'),'strategy');
 });
 await check('filtered-person-link-and-enquiry',async()=>{
  await page.goto(base+'?page=people',{waitUntil:'domcontentloaded'});
  await page.locator('#people-filters [data-field-id=design]').click();await page.locator('.member-link').first().click();
  assert.equal(await page.locator('.learning-workspace').getAttribute('data-field-id'),'design');
  await page.locator('.learning-panel a[data-page-link=contact]').click();assert.equal(await page.locator('#topic').inputValue(),'design');
  assert((await page.locator('#enquiry-context').textContent()).includes('Chris'));
  await page.reload();assert.equal(await page.locator('#topic').inputValue(),'design');
 });
 await check('library-context-only',async()=>{
  await page.goto(route('library','design','project'),{waitUntil:'domcontentloaded'});assert.equal(await page.locator('video').count(),1);
  await page.locator('.learning-field-select').selectOption('analytics');assert.equal(new URL(page.url()).searchParams.get('page'),'library');assert.equal(await page.locator('video').count(),1);
 });
 await page.goto(route('instructor-chris','workflow'),{waitUntil:'domcontentloaded'});
 const reach=await page.locator('.learning-field-select').evaluate(n=>n.getBoundingClientRect().top);
 assert(reach<650,`Mobile selector too far down: ${reach}`);cases.push({name:'mobile-first-control-reach',passed:true,top:reach});
 if(process.env.QA_SCREENSHOT_DIR){
  for(const lang of ['en','ko']){
   await page.evaluate(l=>localStorage.setItem('acumelo.language',l),lang);
   for(const [width,id,field,tab] of [[320,'instructor-chris','workflow','demo'],[390,'lectures','',''],[1440,'design','design','curriculum']]){
    await page.setViewportSize({width,height:900});await page.goto(route(id,field,tab),{waitUntil:'networkidle'});
    await page.screenshot({path:`${process.env.QA_SCREENSHOT_DIR}/learning-${lang}-${width}-${id}.png`,fullPage:true});
   }
  }
 }
}catch(error){if(!errors.length)errors.push({name:'fatal',error:error.stack});}
finally{await browser.close();}
const report={passed:errors.length===0,base,widths:[320,360,390,768,1440],languages:['en','ko'],cases,errors};
await fs.writeFile(process.env.QA_REPORT||'learning-navigation-qa.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({passed:report.passed,cases:cases.length,errors}));if(errors.length)process.exitCode=1;
