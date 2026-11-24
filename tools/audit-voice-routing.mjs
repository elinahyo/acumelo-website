// Read the rendered card URLs and hash public media in memory; no audio files saved.
import fs from 'node:fs/promises';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=path.resolve(import.meta.dirname,'..'),base=process.env.QA_BASE_URL||'https://elinahyo.github.io/acumelo-website/';
const production=JSON.parse(await fs.readFile(path.join(root,'media-production/v3-20261123/production.json'),'utf8'));
const output=process.env.QA_REPORT||path.join(root,'.local/voice-routing.json');
const report={baseUrl:base,mode:'headless-read-only-card-audit',voiceEvidence:'Declared production voice ID plus exact public MP4 SHA-256; not a perceptual speaker-identification test',instructorCards:[],sharedProjectCards:[],errors:[]};
let browser;
try{
 browser=await chromium.launch({headless:true,executablePath:process.env.QA_BROWSER_EXECUTABLE||undefined,args:['--mute-audio']});const page=await browser.newPage();
 await page.goto(new URL('?page=home',base).href);const data=await page.evaluate(()=>window.ACUMELO);
 for(const member of data.members){
  await page.goto(new URL('?page='+member.id,base).href);
  for(const field of member.teachingFieldIds){
   await page.locator('#'+member.id+' .demo-filter[data-field-id="'+field+'"]').click();
   const card=await page.locator('#'+member.id+' .profile-demo-player .media-card').evaluate(el=>({mediaId:el.dataset.mediaId,publicUrl:el.querySelector('video')?.src||null}));
   const asset=data.mediaCatalog[card.mediaId],assignment=data.mediaAssignments.find(a=>a.status==='active'&&a.placement==='profile-demo'&&a.assignedInstructorId===member.id&&a.fieldId===field);
   const film=production.films.find(f=>f.id===asset.src.split("/").pop().replace(/-2026112[34][cd]\.mp4$/, ""));assert(film);assert.equal(assignment.mediaId,card.mediaId);assert.equal(film.instructorId,member.id);assert.equal(film.scope,'instructor');assert.equal(asset.voiceId,film.voice);
   report.instructorCards.push({...card,member:member.name.en,assignedInstructorId:assignment.assignedInstructorId,contentOwnerId:asset.contentOwnerId,scope:asset.scope,kind:asset.kind,fieldId:field,voiceId:asset.voiceId,expectedSha256:asset.sha256,expectedBytes:asset.bytes});
  }
  if(member.id==='instructor-chris'){
   const cards=await page.locator('#'+member.id+' [data-media-group="field-projects"] .media-card').evaluateAll(cards=>cards.map(el=>({mediaId:el.dataset.mediaId,publicUrl:el.querySelector('video')?.src})));
   for(const card of cards){const asset=data.mediaCatalog[card.mediaId],film=production.films.find(f=>f.id===asset.src.split("/").pop().replace(/-2026112[34][cd]\.mp4$/, ""));report.sharedProjectCards.push({...card,assignedInstructorId:null,contentOwnerId:asset.contentOwnerId,scope:asset.scope,kind:asset.kind,fieldId:asset.fieldId,voiceId:asset.voiceId,expectedSha256:asset.sha256,expectedBytes:asset.bytes});}
  }
 }
 for(let i=0;i<report.instructorCards.length+report.sharedProjectCards.length;i+=3){
  const batch=[...report.instructorCards,...report.sharedProjectCards].slice(i,i+3);
  await Promise.all(batch.map(async card=>{const response=await fetch(card.publicUrl);assert(response.ok);const hash=crypto.createHash('sha256');let bytes=0;for await(const chunk of response.body){hash.update(chunk);bytes+=chunk.length;}card.publicSha256=hash.digest('hex');card.publicBytes=bytes;card.hashMatches=card.publicSha256===card.expectedSha256&&bytes===card.expectedBytes;assert(card.hashMatches,card.mediaId);}));
 }
 report.passed=true;
}catch(error){report.passed=false;report.errors.push(error.stack);process.exitCode=1;}finally{if(browser)await browser.close();await fs.mkdir(path.dirname(output),{recursive:true});await fs.writeFile(output,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({passed:report.passed,instructorCards:report.instructorCards.length,sharedCards:report.sharedProjectCards.length,errors:report.errors}));}
