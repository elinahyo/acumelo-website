import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve(import.meta.dirname,'..');
// Optional Git tree evidence supports code-only checkouts with media kept in Git/cloud.
const remoteTree=process.env.QA_ASSET_TREE ? JSON.parse(await fs.readFile(process.env.QA_ASSET_TREE,'utf8')).tree : null;
const context={window:{}};
vm.runInNewContext(await fs.readFile(path.join(root,'content.js'),'utf8'),context,{timeout:1000});
const data=JSON.parse(JSON.stringify(context.window.ACUMELO));
const fields=['workflow','strategy','design','analytics','marketing','development'];
const expected=[['Chris',fields],['Sage',['strategy','design','development']],['Pillow',['design','development']],['John',['workflow','development']],['Sarah',['strategy','design']],['Joseph',['analytics','development']],['Rachel',['marketing','development']],['Joshua',['analytics','development']],['Elizabeth',['workflow','strategy']],['Michael',['analytics']],['Rebecca',['workflow','development']]];
assert.equal(data.members.length,11);
assert.equal(data.members.reduce((n,m)=>n+m.teachingFieldIds.length,0),26);
data.members.forEach((m,i)=>{
  assert.equal(m.id,i===0?'instructor-chris':i===1?'instructor-sage':`instructor-${String(i+1).padStart(2,'0')}`);
  assert.equal(m.name.en,expected[i][0]);assert.equal(m.name.ko,expected[i][0]);
  assert.deepEqual(m.teachingFieldIds,expected[i][1]);
});
assert.equal(data.members[0].image,'assets/instructors/avatar-01-20261114-final-v5.webp');
assert.equal(data.instructorPrograms.length,26);
assert.equal(new Set(data.instructorPrograms.map(p=>p.curriculumId)).size,26);
for(const member of data.members)for(const field of member.teachingFieldIds){
 const matches=data.instructorPrograms.filter(p=>p.instructorId===member.id&&p.fieldId===field);
 assert.equal(matches.length,1,'Each instructor-field pair has an independent curriculum record');
 const program=matches[0];assert(['pending','published'].includes(program.status));
 for(const lang of ['en','ko'])assert(Array.isArray(program.modules[lang]));
}
const paths=new Set();
function walk(value){
  if(typeof value==='string'&&value.startsWith('assets/')) paths.add(value.split(/[?#]/)[0]);
  else if(Array.isArray(value))value.forEach(walk);
  else if(value&&typeof value==='object')Object.values(value).forEach(walk);
}
walk(data);
for(const relative of paths){
  assert(!relative.split('/').includes('..'),'Asset paths must stay inside the repository');
  const local=await fs.stat(path.join(root,relative)).catch(()=>null);
  assert(local?.isFile() || remoteTree?.some(entry=>entry.path===relative&&entry.type==='blob'&&entry.size>0),relative);
}
const members=new Map(data.members.map(m=>[m.id,m]));
const ids=new Set(),active=new Set();
for(const [id,asset] of Object.entries(data.mediaCatalog||{})){
  assert.equal(id,asset.mediaId);assert(members.has(asset.contentOwnerId));assert(fields.includes(asset.fieldId));
}
for(const a of data.mediaAssignments||[]){
  assert(!ids.has(a.assignmentId));ids.add(a.assignmentId);
  const asset=data.mediaCatalog[a.mediaId];assert(asset,'Assignment must reference an existing asset');
  assert.equal(a.fieldId,asset.fieldId);
  assert(['active','superseded'].includes(a.status));
  assert(['profile-demo','course-demo','course-project','owner-library'].includes(a.placement));
  if(a.placement==='profile-demo'){
    const member=members.get(a.assignedInstructorId);assert(member?.teachingFieldIds.includes(a.fieldId));
    assert.equal(asset.scope,'instructor');assert.equal(asset.kind,'demo');assert.equal(asset.assignedInstructorId,member.id);
    assert(member.media.voiceId);assert.equal(asset.voiceId,member.media.voiceId);
  }
  if(a.placement==='course-demo'||a.placement==='course-project'){
    assert.equal(asset.scope,'category');assert(!asset.assignedInstructorId);assert.equal(asset.kind,a.placement.slice(7));
  }
  if(a.placement==='owner-library')assert.equal(a.assignedInstructorId,asset.contentOwnerId);
  if(a.status==='active'){
    const key=JSON.stringify([a.placement,a.assignedInstructorId||'',a.fieldId,a.placement==='owner-library'?a.mediaId:'']);
    assert(!active.has(key),'Duplicate active slot');active.add(key);
  }
}
const script=await fs.readFile(path.join(root,'site.js'),'utf8');new vm.Script(script);
assert(!script.includes('className = "media-transcript"'));
assert(!script.includes('className = "media-transcript-link"'));
console.log(`Site check passed: 11 instructors, 26 assignments of teaching fields, ${paths.size} existing asset paths; media registry valid.`);
