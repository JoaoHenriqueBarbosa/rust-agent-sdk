// function: getExperimentResult
function getExperimentResult(ctx, experiment, variationIndex, hashUsed, featureId, bucket, stickyBucketUsed) {
  let inExperiment = !0;
  if (variationIndex < 0 || variationIndex >= experiment.variations.length)
    variationIndex = 0, inExperiment = !1;
  let {
    hashAttribute,
    hashValue
  } = getHashAttribute(ctx, experiment.hashAttribute, ctx.user.saveStickyBucketAssignmentDoc && !experiment.disableStickyBucketing ? experiment.fallbackAttribute : void 0), meta = experiment.meta ? experiment.meta[variationIndex] : {}, res = {
    key: meta.key || "" + variationIndex,
    featureId,
    inExperiment,
    hashUsed,
    variationId: variationIndex,
    value: experiment.variations[variationIndex],
    hashAttribute,
    hashValue,
    stickyBucketUsed: !!stickyBucketUsed
  };
  if (meta.name)
    res.name = meta.name;
  if (bucket !== void 0)
    res.bucket = bucket;
  if (meta.passthrough)
    res.passthrough = meta.passthrough;
  return res;
}
