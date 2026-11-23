// Asset ownership and immutable media IDs are independent of page assignments.
export function ownedMedia(data, ownerId) {
  return Object.values(data.mediaCatalog || {}).filter(asset => asset.contentOwnerId === ownerId);
}

export function replaceAssignment(data, {assignmentId, replacementMediaId, replacementAssignmentId, ownerAssignmentId}) {
  const next = structuredClone(data);
  const current = next.mediaAssignments.find(a => a.assignmentId === assignmentId && a.status === 'active');
  if (!current) throw new Error('Active assignment not found');
  const original = next.mediaCatalog[current.mediaId];
  const replacement = next.mediaCatalog[replacementMediaId];
  if (!original || !replacement) throw new Error('Both assets must already be registered');
  if (replacementMediaId === current.mediaId) throw new Error('Replacement must have a distinct media ID');
  if (replacement.fieldId !== current.fieldId || replacement.kind !== original.kind) throw new Error('Replacement field/kind mismatch');
  const owners = new Set(next.members.map(m => m.id));
  if (!owners.has(original.contentOwnerId)) throw new Error('Original owner is not a known instructor');
  const ids = new Set(next.mediaAssignments.map(a => a.assignmentId));
  if (!replacementAssignmentId || !ownerAssignmentId || ids.has(replacementAssignmentId) || ids.has(ownerAssignmentId) || replacementAssignmentId === ownerAssignmentId) throw new Error('New assignment IDs must be unique');
  current.status = 'superseded';
  current.replacedByAssignmentId = replacementAssignmentId;
  next.mediaAssignments.push({assignmentId:replacementAssignmentId, mediaId:replacementMediaId,
    assignedInstructorId:current.assignedInstructorId, fieldId:current.fieldId,
    placement:current.placement, temporaryAssignment:false, status:'active'});
  // Retain the old clip in its owner's separate library, never in the guest's demo slot.
  if (!next.mediaAssignments.some(a => a.status === 'active' && a.mediaId === original.mediaId && a.placement === 'owner-library' && a.assignedInstructorId === original.contentOwnerId)) {
    next.mediaAssignments.push({assignmentId:ownerAssignmentId, mediaId:original.mediaId,
      assignedInstructorId:original.contentOwnerId, fieldId:original.fieldId,
      placement:'owner-library', temporaryAssignment:false, status:'active'});
  }
  return next;
}
