// function: generateStickyBucketAssignmentDoc
function generateStickyBucketAssignmentDoc(ctx, attributeName, attributeValue, assignments) {
  let key3 = getStickyBucketAttributeKey(attributeName, attributeValue), existingAssignments = ctx.user.stickyBucketAssignmentDocs && ctx.user.stickyBucketAssignmentDocs[key3] ? ctx.user.stickyBucketAssignmentDocs[key3].assignments || {} : {}, newAssignments = {
    ...existingAssignments,
    ...assignments
  }, changed = JSON.stringify(existingAssignments) !== JSON.stringify(newAssignments);
  return {
    key: key3,
    doc: {
      attributeName,
      attributeValue,
      assignments: newAssignments
    },
    changed
  };
}
