// function: getStickyBucketAssignments
function getStickyBucketAssignments(ctx, expHashAttribute, expFallbackAttribute) {
  if (!ctx.user.stickyBucketAssignmentDocs)
    return {};
  let {
    hashAttribute,
    hashValue
  } = getHashAttribute(ctx, expHashAttribute), hashKey = getStickyBucketAttributeKey(hashAttribute, toString7(hashValue)), {
    hashAttribute: fallbackAttribute,
    hashValue: fallbackValue
  } = getHashAttribute(ctx, expFallbackAttribute), fallbackKey = fallbackValue ? getStickyBucketAttributeKey(fallbackAttribute, toString7(fallbackValue)) : null, assignments = {};
  if (fallbackKey && ctx.user.stickyBucketAssignmentDocs[fallbackKey])
    Object.assign(assignments, ctx.user.stickyBucketAssignmentDocs[fallbackKey].assignments || {});
  if (ctx.user.stickyBucketAssignmentDocs[hashKey])
    Object.assign(assignments, ctx.user.stickyBucketAssignmentDocs[hashKey].assignments || {});
  return assignments;
}
