// Apply technically verified revision metadata without deleting previous assets.
import fs from 'node:fs/promises';import path from 'node:path';import vm from 'node:vm';import assert from 'node:assert/strict';
const root=path.resolve(import.meta.dirname,'..');
const manifest=JSON.parse(await fs.readFile(path.join(root,'assets/media/20261124d/editorial-manifest.json'),'utf8'));
const qa=JSON.parse(await fs.readFile(path.join(root,'assets/media/20261124d/validation-report.json'),'utf8'));
assert(qa.passed&&qa.films===17&&!qa.editorialApproval);assert.equal(manifest.media.length,17);
const ctx={window:{}};vm.runInNewContext(await fs.readFile(path.join(root,'content.js'),'utf8'),ctx);const d=ctx.window.ACUMELO;
for(const film of manifest.media){
 const instructor=film.scope==='instructor',kind=instructor?'demo':'project',placement=instructor?'profile-demo':'course-project';
 const current=d.mediaAssignments.find(a=>a.status==='active'&&a.placement===placement&&a.fieldId===film.fieldId&&(!instructor||a.assignedInstructorId===film.assignedInstructorId));
 assert(current,film.id);const old=d.mediaCatalog[current.mediaId];assert.equal(old.contentOwnerId,film.contentOwnerId);
 if(current.mediaId===film.mediaId){assert.equal(old.sha256,film.sha256);assert.equal(old.assignedInstructorId,instructor?film.assignedInstructorId:null);continue;}
 if(instructor){assert.equal(old.voiceId,film.voiceId);assert.equal(old.sha256,film.sourceVideoSha256);assert(film.audioCopiedVerified);assert.equal(old.assignedInstructorId,film.assignedInstructorId);}
 else{assert.equal(film.voiceId,null);assert.equal(film.audio.voiceId,null);assert.equal(film.hasNarration,false);assert.equal(film.captions.length,0);}
 const id=film.mediaId;assert(!d.mediaCatalog[id],'Revision already imported');
 const asset={...old,mediaId:id,id,src:film.src,poster:'assets/media/20261124d/'+film.poster,captions:film.subtitlePath?[{src:'assets/media/20261124d/'+film.subtitlePath,srclang:'en',label:'English'}]:[],durationSeconds:film.durationSeconds,sha256:film.sha256,bytes:film.bytes,hasBgm:true,hasNarration:instructor,narration:instructor?{language:'en',temporaryVoice:true,voiceId:film.voiceId}:null,voiceId:film.voiceId,voiceRole:instructor?'instructor-demo':'shared-project-music',assignedInstructorId:instructor?film.assignedInstructorId:null,revision:film.revision,editorialApproval:false,technicalQa:film.technicalQa};
 d.mediaCatalog[id]=asset;current.status='superseded';
 d.mediaAssignments.push({...current,assignmentId:current.assignmentId+'-20261124d',mediaId:id,status:'active',replacesAssignmentId:current.assignmentId});
 if(instructor){const member=d.members.find(m=>m.id===film.assignedInstructorId);member.media.demos[film.fieldId]=id;}
 else d.courseMedia[film.fieldId][kind]=asset;
}
d.mediaGallery='assets/media/20261124d/index.html';
for(const [language,copy] of Object.entries(d.copy)){
 copy.profileOwnDemoNote=language==='ko'?'화면을 재구성한 교육용 예시입니다. 임시 영어 합성 음성과 자체 제작 배경음을 사용합니다.':'Illustrative interface reconstructions with temporary synthetic English voices and original music.';
 copy.mediaExampleNotice=language==='ko'?'화면 재구성 시연에는 임시 영어 합성 해설과 배경음, 공통 프로젝트 콘셉트에는 배경음만 사용합니다. 실제 앱 녹화·강사 목소리·수강생 제출물이 아닙니다.':'Illustrative demos use temporary synthetic English voices and music; shared project concepts use music only. These are not live software recordings, real instructor voices or student submissions.';
 copy.mediaLibraryIntro=language==='ko'?'강사별·분야별 시연과 공통 프로젝트 콘셉트를 살펴보세요. 시연에는 임시 영어 합성 해설과 자체 배경음, 프로젝트 예시에는 배경음만 사용합니다. 실제 프로그램 녹화나 수강생 제출물이 아닌 재구성 예시입니다.':'Explore instructor demonstrations and shared project concepts. Demos use temporary synthetic English narration and original music; project concepts use music only. These are illustrative reconstructions, not software recordings or student submissions.';
}
const outputIndex=process.argv.indexOf('--output');
const output=outputIndex>=0?path.resolve(process.argv[outputIndex+1]):path.join(root,'content.js');
await fs.writeFile(output,'window.ACUMELO = '+JSON.stringify(d,null,2)+';\n');
console.log('Mapped 11 instructor demos and 6 music-only projects; preserved previous media and ownership. Editorial approval remains separate.');
