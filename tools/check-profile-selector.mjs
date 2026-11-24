// Code-only behaviour checks; this is not a browser/mobile visual test.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
const source=await fs.readFile(new URL('../site.js',import.meta.url),'utf8');
function extract(name,end){return source.slice(source.indexOf('  function '+name+'('),source.indexOf(end,source.indexOf('  function '+name+'(')));}
class Element {
  constructor(tag,className,text){this.tag=tag;this.className=className;this.textContent=text;this.children=[];this.dataset={};this.events={};this.attributes={};this.pauseCount=0;}
  append(...nodes){this.children.push(...nodes);}
  replaceChildren(...nodes){this.children=nodes;}
  setAttribute(key,value){this.attributes[key]=value;}
  addEventListener(event,handler){this.events[event]=handler;}
  querySelectorAll(tag){return this.children.flatMap(node=>[...(node.tag===tag?[node]:[]),...node.querySelectorAll(tag)]);}
  pause(){this.pauseCount++;}
}
const fields=['workflow','strategy','design','analytics','marketing','development'];
const member={id:'instructor-chris',teachingFieldIds:fields,media:{voiceId:'am_michael',demo:{id:'legacy',src:'old.mp4'}}};
const content={mediaCatalog:{},mediaAssignments:[]};
for(const fieldId of fields){const mediaId='test-'+fieldId;content.mediaCatalog[mediaId]={mediaId,fieldId,scope:'instructor',kind:'demo',assignedInstructorId:member.id,voiceId:'am_michael',src:mediaId+'.mp4',title:{en:fieldId,ko:fieldId+'-ko'}};
  content.mediaAssignments.push({assignmentId:'a-'+fieldId,mediaId,fieldId,assignedInstructorId:member.id,placement:'profile-demo',status:'active'});}
const sandbox={content,lang:'en',profileDemoSelections:new Map(),
  el:(...args)=>new Element(...args),t:key=>key,teachingCourses:m=>m.teachingFieldIds.map(id=>({id,title:id})),
  mediaCard:(asset,label)=>{const card=new Element('article');card.dataset.mediaId=asset.id;card.label=label;if(asset.src)card.append(new Element('video'));return card;}};
vm.createContext(sandbox);
vm.runInContext(extract('assignedInstructorDemos','  let selectedTeachingField')+extract('instructorDemoSection','  function courseMediaGrid')+'\nthis.render=instructorDemoSection;this.resolve=assignedInstructorDemos;',sandbox);
let section=sandbox.render(member),select=section.querySelectorAll('select')[0];
assert.equal(select.children.length,6);assert.equal(section.querySelectorAll('video').length,1);
assert.equal(section.querySelectorAll('article')[0].dataset.mediaId,'test-workflow');
assert.equal(section.querySelectorAll('label')[0].htmlFor,select.id);
assert.equal(select.attributes['aria-controls'],'instructor-chris-demo-player');
const previous=section.querySelectorAll('video')[0];select.value='development';select.events.change();
assert.equal(previous.pauseCount,1);assert.equal(section.querySelectorAll('video').length,1);
assert.equal(section.querySelectorAll('article')[0].dataset.mediaId,'test-development');
sandbox.lang='ko';section=sandbox.render(member);
assert.equal(section.querySelectorAll('select')[0].value,'development');
assert.equal(section.querySelectorAll('article')[0].label,'development-ko');
const original=structuredClone(content.mediaCatalog['test-workflow']);
sandbox.profileDemoSelections.set(member.id,'workflow');
for(const patch of [{scope:'category'},{assignedInstructorId:'instructor-sage'},{kind:'project'},{voiceId:'af_heart'},{voiceId:null}]){
 content.mediaCatalog['test-workflow']={...original,...patch};
 assert.equal(sandbox.resolve(member).length,5);
 const rejected=sandbox.render(member);assert.equal(rejected.querySelectorAll('select')[0].children.length,6);
 assert.equal(rejected.querySelectorAll('video').length,0,'Invalid selected field must stay empty, not play another clip');
}
delete content.mediaCatalog['test-workflow'];assert.equal(sandbox.render(member).querySelectorAll('video').length,0);
content.mediaCatalog['test-workflow']=original;
content.mediaAssignments.forEach(a=>a.status='superseded');
assert.equal(sandbox.resolve(member).length,0,'Superseded registry must not resurrect the legacy video');
assert.equal(sandbox.render(member).querySelectorAll('video').length,0);
content.mediaAssignments=[];assert.equal(sandbox.resolve(member).length,0,'No legacy demo fallback');
member.media.demos=Object.fromEntries(fields.map(f=>[f,'test-'+f]));assert.equal(sandbox.resolve(member).length,0,'No unassigned map fallback');
const mediaCardSource=extract('mediaCard','  function courseMediaAsset');
assert(mediaCardSource.includes("video.preload = 'none'"));assert(mediaCardSource.includes('video.controls = true'));
assert(!/\.play\s*\(|autoplay\s*=\s*true/i.test(source),'Playback must remain manual');
assert(!/media-transcript-link|className\s*=\s*['"]media-transcript['"]/.test(source));
console.log('Profile selector passed: explicit presenter/voice/scope/kind/field matching, missing-field empty slots, no legacy/category fallback, pause and locale persistence.');
