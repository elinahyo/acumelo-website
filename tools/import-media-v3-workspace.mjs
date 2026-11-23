import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const [rootArg]=process.argv.slice(2);if(!rootArg)throw Error('Supply final delivery root');
const root=path.resolve(rootArg),workspace=path.resolve(import.meta.dirname,'..');
const hasWorkspace=await fs.access(path.join(workspace,'preview/content.js')).then(()=>true,()=>false);
const contentFile=path.join(workspace,hasWorkspace?'preview/content.js':'content.js');
const published=hasWorkspace?path.join(workspace,'publish/github-pages'):workspace;
const reports=path.join(workspace,hasWorkspace?'review':'.local');await fs.mkdir(reports,{recursive:true});
const delivery=JSON.parse(await fs.readFile(path.join(root,'delivery-map.json'),'utf8'));
const qa=JSON.parse(await fs.readFile(path.join(root,'output/validation-report.json'),'utf8'));
const production=JSON.parse(await fs.readFile(path.join(root,'production.json'),'utf8'));
assert.equal(delivery.status,'qa-passed');assert.equal(delivery.totalFilms,38);assert.equal(qa.passed,true);assert.equal(qa.films,38);
assert.equal(qa.results.length,38);assert(qa.results.every(r=>r.passed&&!(r.errors||[]).length&&!(r.alerts||[]).length));
const context={window:{}};vm.runInNewContext(await fs.readFile(contentFile,'utf8'),context,{timeout:1000});
const content=JSON.parse(JSON.stringify(context.window.ACUMELO)),previous=structuredClone(content);
assert.equal(Object.keys(content.mediaCatalog||{}).length,0,'Do not overwrite a populated catalogue without migration');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const files=[],catalog={},assignments=[];
for(const item of delivery.media){
  const film=production.films.find(f=>f.mediaId===item.mediaId);assert(film);
  assert.equal(item.contentOwnerId,'instructor-chris');
  assert.equal(item.hasNarration,true);assert.equal(item.hasMusic,true);assert.equal(item.illustrative,true);
  const record=JSON.parse(await fs.readFile(path.join(root,'output',film.stem+'.json'),'utf8'));
  if(item.scope==='instructor')assert.deepEqual(record.beats,film.beats);
  const check=qa.results.find(r=>r.id===item.id);assert(check);assert.equal(check.sha256,item.sha256);
  assert.equal(record.sha256,item.sha256);assert.equal(record.durationSeconds,item.durationSeconds);
  for(const repoPath of [item.path,item.poster,item.subtitlePath]){
    assert(repoPath.startsWith('assets/media/20261123c/'));assert(!repoPath.includes('..')&&!repoPath.includes('\\'));
    const relative=repoPath.slice('assets/media/20261123c/'.length),bytes=await fs.readFile(path.join(root,'output',relative));
    if(repoPath.endsWith('.mp4')){assert.equal(hash(bytes),item.sha256);assert.equal(bytes.length,item.bytes);}
    const dest=path.join(published,repoPath);await fs.mkdir(path.dirname(dest),{recursive:true});await fs.writeFile(dest,bytes);
    files.push({repoPath,localPath:dest,bytes:bytes.length,sha256:hash(bytes),gitBlobSha:crypto.createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex')});
  }
  const field=content.copy.ko.courses.find(c=>c.id===item.fieldId);assert(field);
  const member=content.members.find(m=>m.id===item.assignedInstructorId);
  if(item.scope==='instructor')assert(member?.teachingFieldIds.includes(item.fieldId));
  assert.equal(item.temporaryAssignment,Boolean(member&&member.id!=='instructor-chris'));
  const kind=item.kind==='showcase'?'project':item.kind;
  catalog[item.mediaId]={mediaId:item.mediaId,id:item.mediaId,contentOwnerId:item.contentOwnerId,
    fieldId:item.fieldId,kind,scope:item.scope,status:'ready',illustrative:true,
    title:{en:item.title,ko:(member?member.name.ko+' · ':'')+field.title+(kind==='project'?' · 결과물 예시':' · 시연')},
    src:item.path,poster:item.poster,captions:[{src:item.subtitlePath,srclang:'en',label:'English'}],
    durationSeconds:item.durationSeconds,narration:{language:'en',temporaryVoice:true},hasBgm:true,
    projectCount:item.projectCount,sha256:item.sha256,bytes:item.bytes};
  assignments.push({assignmentId:'assignment-'+item.id,mediaId:item.mediaId,assignedInstructorId:item.assignedInstructorId||null,
    fieldId:item.fieldId,placement:item.scope==='instructor'?'profile-demo':'course-'+kind,temporaryAssignment:item.temporaryAssignment,status:'active'});
}
assert.equal(Object.keys(catalog).length,38);assert.equal(assignments.filter(a=>a.placement==='profile-demo').length,26);
content.mediaCatalog=catalog;content.mediaAssignments=assignments;
for(const member of content.members){
  member.media.demos=Object.fromEntries(assignments.filter(a=>a.assignedInstructorId===member.id&&a.placement==='profile-demo').map(a=>[a.fieldId,a.mediaId]));
  assert.deepEqual(Object.keys(member.media.demos),member.teachingFieldIds);
}
for(const field of content.copy.en.courses)for(const kind of ['demo','project']){
  const assignment=assignments.find(a=>a.fieldId===field.id&&a.placement==='course-'+kind);assert(assignment);
  content.courseMedia[field.id][kind]=catalog[assignment.mediaId];
}
content.mediaGallery='assets/media/20261123c/index.html';
Object.assign(content.copy.en,{mediaGallery:'Explore all 38 films',mediaExampleNotice:'Reconstructed training examples and shared project concepts. Synthetic English narration and original music; not live software recordings, real instructor voices or student submissions.',profileOwnDemoNote:'Field-specific reconstructed examples with temporary synthetic English narration and original music.',profileFieldProjectsNote:'Shared project concepts for these fields, not this instructor’s actual student submissions or client work.'});
Object.assign(content.copy.ko,{mediaGallery:'전체 영상 38편 보기',mediaExampleNotice:'화면을 재구성한 교육용 시연과 공통 프로젝트 예시입니다. 영어 합성 해설과 자체 배경음을 사용하며, 실제 앱 녹화·강사 목소리·수강생 제출물이 아닙니다.',profileOwnDemoNote:'분야별로 재구성한 시연 예시입니다. 임시 영어 합성 해설과 자체 제작 배경음을 사용합니다.',profileFieldProjectsNote:'담당 분야의 공통 프로젝트 콘셉트입니다. 이 강사의 실제 수강생 제출물이나 고객 실적이 아닙니다.'});
for(let i=0;i<content.members.length;i++){
  const {media,...old}=previous.members[i],{media:newMedia,...current}=content.members[i];assert.deepEqual(current,old);
  assert.deepEqual(newMedia.lecture,media.lecture);assert(!newMedia.lecture.src);
}
for(const name of ['index.html','media-manifest.json','validation-report.json']){
  const bytes=await fs.readFile(path.join(root,'output',name)),repoPath='assets/media/20261123c/'+name,dest=path.join(published,repoPath);
  await fs.writeFile(dest,bytes);files.push({repoPath,localPath:dest,bytes:bytes.length,sha256:hash(bytes),gitBlobSha:crypto.createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex')});
}
await fs.writeFile(contentFile,'window.ACUMELO = '+JSON.stringify(content,null,2)+';\n');
await fs.writeFile(path.join(published,'content.js'),'window.ACUMELO = '+JSON.stringify(content,null,2)+';\n');
await fs.writeFile(path.join(reports,'media-v3-final-files.json'),JSON.stringify({status:'final-qa-verified',files},null,2)+'\n');
console.log('Verified and imported 38 final films, 26 instructor-field assignments and 12 category assets. Avatars, names, fields and empty lecture slots preserved.');
