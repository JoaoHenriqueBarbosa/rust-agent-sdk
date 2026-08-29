// function: getStickyBucketVariation
function getStickyBucketVariation({
  ctx,
  expKey,
  expBucketVersion,
  expHashAttribute,
  expFallbackAttribute,
  expMinBucketVersion,
  expMeta
}) {
  expBucketVersion = expBucketVersion || 0, expMinBucketVersion = expMinBucketVersion || 0, expHashAttribute = expHashAttribute || "id", expMeta = expMeta || [];
  let id = getStickyBucketExperimentKey(expKey, expBucketVersion), assignments = getStickyBucketAssignments(ctx, expHashAttribute, expFallbackAttribute);
  if (expMinBucketVersion > 0)
    for (let i5 = 0;i5 < expMinBucketVersion; i5++) {
      let blockedKey = getStickyBucketExperimentKey(expKey, i5);
      if (assignments[blockedKey] !== void 0)
        return {
          variation: -1,
          versionIsBlocked: !0
        };
    }
  let variationKey = assignments[id];
  if (variationKey === void 0)
    return {
      variation: -1
    };
  let variation = expMeta.findIndex((m4) => m4.key === variationKey);
  if (variation < 0)
    return {
      variation: -1
    };
  return {
    variation
  };
}
