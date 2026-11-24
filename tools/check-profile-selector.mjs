// Resolver regression checks; responsive search/filter behaviour is checked headlessly.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
const source=await fs.readFile(new URL('../site.js',import.meta.url),'utf8');
const start=source.indexOf('  function assignedInstructorDemos('),end=source.indexOf('  let selectedTeachingField',start);
const member={id:'instructor-chris',teachingFieldIds:['workflow'],media:{voiceId:'am_michael',demo:{src:'legacy.mp4'},demos:{workflow:'test'}}};
const original={mediaId:'test',scope:'instructor',kind:'demo',fieldId:'workflow',assignedInstructorId:member.id,voiceId:'am_michael',src:'test.mp4'};
const content={mediaCatalog:{test:original},mediaAssignments:[{mediaId:'test',fieldId:'workflow',assignedInstructorId:member.id,placement:'profile-demo',status:'active'}]};
const sandbox={content};vm.createContext(sandbox);vm.runInContext(source.slice(start,end)+';this.resolve=assignedInstructorDemos;',sandbox);
assert.equal(sandbox.resolve(member).length,1);
for(const patch of [{scope:'category'},{kind:'project'},{fieldId:'design'},{assignedInstructorId:'instructor-sage'},{voiceId:'af_heart'},{voiceId:null}]){
 content.mediaCatalog.test={...original,...patch};assert.equal(sandbox.resolve(member).length,0,'Invalid assignment must stay empty');
}
delete content.mediaCatalog.test;assert.equal(sandbox.resolve(member).length,0);
content.mediaCatalog.test=original;content.mediaAssignments[0].status='superseded';assert.equal(sandbox.resolve(member).length,0);
content.mediaAssignments=[];assert.equal(sandbox.resolve(member).length,0,'No legacy/shared fallback');
assert(source.includes("video.preload = 'none'"));assert(source.includes('video.controls = true'));
assert(!/\.play\s*\(|autoplay\s*=\s*true/i.test(source),'Manual playback only');
assert(!/media-transcript-link|className\s*=\s*['"]media-transcript['"]/.test(source));
console.log('Instructor demo resolver passed: explicit scope, kind, field, presenter and voice; no legacy/category fallback; manual playback.');
