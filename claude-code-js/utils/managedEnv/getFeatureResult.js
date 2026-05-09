// function: getFeatureResult
function getFeatureResult(ctx, key3, value, source, ruleId, experiment, result) {
  let ret = {
    value,
    on: !!value,
    off: !value,
    source,
    ruleId: ruleId || ""
  };
  if (experiment)
    ret.experiment = experiment;
  if (result)
    ret.experimentResult = result;
  if (source !== "override")
    onFeatureUsage(ctx, key3, ret);
  return ret;
}
