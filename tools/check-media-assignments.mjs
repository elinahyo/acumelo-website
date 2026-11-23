import assert from 'node:assert/strict';
import {replaceAssignment, ownedMedia} from './media-assignments.mjs';
const fixture={members:[{id:'instructor-chris'},{id:'instructor-03'}],mediaCatalog:{
  'media-a':{mediaId:'media-a',contentOwnerId:'instructor-chris',fieldId:'design',kind:'demo',src:'assets/media/example-a.mp4',durationSeconds:42},
  'media-b':{mediaId:'media-b',contentOwnerId:'instructor-03',fieldId:'design',kind:'demo',src:'assets/media/example-b.mp4',durationSeconds:67}
},mediaAssignments:[{assignmentId:'assignment-a',mediaId:'media-a',assignedInstructorId:'instructor-03',fieldId:'design',placement:'profile-demo',temporaryAssignment:true,status:'active'}]};
const before=structuredClone(fixture);
const next=replaceAssignment(fixture,{assignmentId:'assignment-a',replacementMediaId:'media-b',replacementAssignmentId:'assignment-b',ownerAssignmentId:'owner-a'});
assert.deepEqual(fixture,before,'Replacing a placement must not mutate the input registry');
assert.deepEqual(next.mediaCatalog,fixture.mediaCatalog,'Both original files and ownership metadata must remain unchanged');
assert.equal(next.mediaAssignments.find(a=>a.assignmentId==='assignment-a').status,'superseded');
assert.equal(next.mediaAssignments.filter(a=>a.status==='active'&&a.placement==='profile-demo').length,1);
assert.equal(next.mediaAssignments.find(a=>a.assignmentId==='assignment-b').assignedInstructorId,'instructor-03');
assert.deepEqual(next.mediaAssignments.find(a=>a.placement==='owner-library'),{assignmentId:'owner-a',mediaId:'media-a',assignedInstructorId:'instructor-chris',fieldId:'design',placement:'owner-library',temporaryAssignment:false,status:'active'});
assert.equal(ownedMedia(next,'instructor-chris')[0].mediaId,'media-a');
assert.throws(()=>replaceAssignment(fixture,{assignmentId:'assignment-a',replacementMediaId:'missing',replacementAssignmentId:'b',ownerAssignmentId:'c'}));
assert.throws(()=>replaceAssignment(fixture,{assignmentId:'assignment-a',replacementMediaId:'media-b',replacementAssignmentId:'assignment-a',ownerAssignmentId:'c'}));
console.log('Assignment replacement preserves originals, ownership, history and Chris library; non-15s media supported.');
