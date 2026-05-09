// function: onFeatureUsage
function onFeatureUsage(ctx, key3, ret) {
  if (ctx.user.trackedFeatureUsage) {
    let stringifiedValue = JSON.stringify(ret.value);
    if (ctx.user.trackedFeatureUsage[key3] === stringifiedValue)
      return;
    if (ctx.user.trackedFeatureUsage[key3] = stringifiedValue, ctx.user.enableDevMode && ctx.user.devLogs)
      ctx.user.devLogs.push({
        featureKey: key3,
        result: ret,
        timestamp: Date.now().toString(),
        logType: "feature"
      });
  }
  if (ctx.global.onFeatureUsage) {
    let cb = ctx.global.onFeatureUsage;
    safeCall(() => cb(key3, ret, ctx.user));
  }
  if (ctx.user.onFeatureUsage) {
    let cb = ctx.user.onFeatureUsage;
    safeCall(() => cb(key3, ret));
  }
  if (ctx.global.eventLogger) {
    let cb = ctx.global.eventLogger;
    safeCall(() => cb(EVENT_FEATURE_EVALUATED, {
      feature: key3,
      source: ret.source,
      value: ret.value,
      ruleId: ret.source === "defaultValue" ? "$default" : ret.ruleId || "",
      variationId: ret.experimentResult ? ret.experimentResult.key : ""
    }, ctx.user));
  }
}
