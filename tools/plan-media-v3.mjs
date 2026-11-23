// Validate a delivery contract without copying files or modifying website data.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import {pathToFileURL} from 'node:url';

export function planDelivery(delivery, content) {
  const fields=content.copy.en.courses.map(c=>c.id);
  const assets=delivery.media;
  assert(Array.isArray(assets),'Delivery must contain media');
  assert.equal(assets.length,38);
  const byId=new Map(assets.map(a=>[a.mediaId,a]));
  assert.equal(byId.size,38,'Media IDs must be unique');
  assert.equal(delivery.instructors.length,11);assert.equal(delivery.categories.length,6);
  const assignments=[], seenMembers=new Set(), seenFields=new Set();
  function bind(mediaId,fieldId,placement,assignedInstructorId=null) {
    const asset=byId.get(mediaId);assert(asset,'Missing referenced media ID');
    assert.equal(asset.fieldId,fieldId);assert.equal(asset.contentOwnerId,'instructor-chris');
    assert.equal(asset.assignedInstructorId,assignedInstructorId);
    assert.equal(asset.scope,placement==='profile-demo'?'instructor':'category');
    assert.equal(asset.kind,placement==='course-project'?'showcase':'demo');
    assert.equal(asset.temporaryAssignment,Boolean(assignedInstructorId && assignedInstructorId!=='instructor-chris'));
    assert.equal(asset.illustrative,true);assert.equal(asset.hasNarration,true);assert.equal(asset.hasMusic,true);
    for(const key of ['path','poster','subtitlePath']) {
      assert(asset[key]?.startsWith(delivery.basePath));
      assert(!asset[key].includes('..')&&!asset[key].includes('\\'),'Only repository-relative media paths');
    }
    assignments.push({assignmentId:mediaId+'-'+placement,mediaId,fieldId,assignedInstructorId,placement,
      temporaryAssignment:asset.temporaryAssignment,status:'pending'});
  }
  for(const entry of delivery.instructors) {
    const member=content.members.find(m=>m.id===entry.instructorId);assert(member);
    assert(!seenMembers.has(member.id));seenMembers.add(member.id);
    assert.equal(entry.name,member.name.en);assert.deepEqual(entry.fields,member.teachingFieldIds);
    assert.deepEqual(Object.keys(entry.demos),member.teachingFieldIds);
    for(const field of entry.fields)bind(entry.demos[field],field,'profile-demo',member.id);
  }
  assert.equal(assignments.length,26);
  for(const entry of delivery.categories) {
    assert(fields.includes(entry.fieldId));assert(!seenFields.has(entry.fieldId));seenFields.add(entry.fieldId);
    bind(entry.demo,entry.fieldId,'course-demo');bind(entry.showcase,entry.fieldId,'course-project');
  }
  assert.equal(new Set(assignments.map(a=>a.mediaId)).size,38);
  return {revision:delivery.revision,status:'planning-only-not-for-publication',sourceStatus:delivery.status,
    counts:{instructorDemos:26,categoryOverviews:6,projectShowcases:6},disclosure:delivery.disclosure,
    contentOwnerId:'instructor-chris',assignments,
    importRules:{mapShowcaseKindTo:'project',narration:{language:'en',temporaryVoice:true},hasBgm:true,
      retainHumanLectureSlots:true,requireFinalDurationAndAudioQa:true,requireFinalDeliveryMap:true,
      activateAssignmentsOnlyAfterFinalValidation:true,copyRenderingFiles:false}};
}

if(process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [contract,contentFile,output]=process.argv.slice(2);
  if(!contract||!contentFile||!output)throw new Error('Usage: node plan-media-v3.mjs contract.json content.js plan.json');
  const context={window:{}};vm.runInNewContext(await fs.readFile(contentFile,'utf8'),context,{timeout:1000});
  const result=planDelivery(JSON.parse(await fs.readFile(contract,'utf8')),JSON.parse(JSON.stringify(context.window.ACUMELO)));
  await fs.writeFile(output,JSON.stringify(result,null,2)+'\n');
  console.log('Validated 38 planned assets and 26 instructor-field demos. No assets copied; website data unchanged.');
}
