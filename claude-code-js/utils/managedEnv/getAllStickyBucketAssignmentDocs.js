// function: getAllStickyBucketAssignmentDocs
async function getAllStickyBucketAssignmentDocs(ctx, stickyBucketService, data) {
  let attributes2 = getStickyBucketAttributes(ctx, data);
  return stickyBucketService.getAllAssignments(attributes2);
}
