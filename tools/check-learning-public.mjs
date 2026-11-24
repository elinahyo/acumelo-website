import fs from 'node:fs/promises';import assert from 'node:assert/strict';import crypto from 'node:crypto';import vm from 'node:vm';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE);
const base='https://elinahyo.github.io/acumelo-website/';
const expected=process.env.QA_EXPECTED_BLOB;
const bytes=Buffer.from(await (await fetch(base+'?release=structure-20261124')).arrayBuffer());
const blob=crypto.createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');assert.equal(blob,expected,'Public index must match approved Git blob');
const box={window:{}};vm.runInNewContext(await fs.readFile(new URL('../content.js',import.meta.url),'utf8'),box);const data=box.window.ACUMELO;
const browser=await chromium.launch({headless:true,executablePath:process.env.QA_BROWSER_EXECUTABLE,args:['--mute-audio']});
const page=await browser.newPage(),cases=[],errors=[];
page.on('pageerror',e=>errors.push(e.message));
try{
 await page.route('**/*.mp4',r=>r.abort());
 for(const lang of ['en','ko']){
  await page.goto(base);await page.evaluate(l=>localStorage.setItem('acumelo.language',l),lang);
  for(const width of [320,360,390,768,1440]){
   await page.setViewportSize({width,height:900});await page.goto(base+'?page=lectures',{waitUntil:'domcontentloaded'});
   assert.equal(await page.locator('.comparison-link').count(),6);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   await page.locator('.comparison-link').nth(2).click();assert.equal(new URL(page.url()).searchParams.get('tab'),'curriculum');
   await page.locator('.learning-instructors a').first().click();assert.equal(new URL(page.url()).searchParams.get('field'),'design');
   await page.locator('[role=tab][data-tab=demo]').click();assert.equal(await page.locator('video').count(),1);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   await page.locator('[role=tab][data-tab=lecture]').click();assert.equal(await page.locator('video').count(),0);
   await page.goBack();assert.equal(await page.locator('.learning-workspace').getAttribute('data-tab'),'demo');
   cases.push({lang,width,comparisonToInstructor:true,history:true,overflow:false});
  }
  await page.setViewportSize({width:390,height:900});
  for(const member of data.members)for(const field of member.teachingFieldIds){
   await page.goto(`${base}?page=${member.id}&field=${field}&tab=demo`,{waitUntil:'domcontentloaded'});
   const assigned=await page.locator('.learning-media .media-card').getAttribute('data-assigned-instructor-id');assert.equal(assigned,member.id);
   assert.equal(await page.locator('.learning-workspace').getAttribute('data-field-id'),field);
   await page.locator('[role=tab][data-tab=curriculum]').click();assert.equal(await page.locator('[role=tabpanel]').getAttribute('data-curriculum-id'),`${member.id}-${field}-curriculum`);
   cases.push({lang,instructor:member.id,field,correctMapping:true});
  }
 }
}catch(e){errors.push(e.stack);}finally{await browser.close();}
const report={passed:!errors.length,base,commit:process.env.QA_COMMIT,expectedBlob:expected,publicBlob:blob,cases,errors};
await fs.writeFile(process.env.QA_REPORT||'learning-public-qa.json',JSON.stringify(report,null,2));console.log(JSON.stringify({passed:report.passed,cases:cases.length,blob,errors}));if(errors.length)process.exitCode=1;
