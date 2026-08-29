// function: onExperimentViewed
function onExperimentViewed(ctx, experiment, result) {
  if (ctx.user.trackedExperiments) {
    let k3 = getExperimentDedupeKey(experiment, result);
    if (ctx.user.trackedExperiments.has(k3))
      return [];
    ctx.user.trackedExperiments.add(k3);
  }
  if (ctx.user.enableDevMode && ctx.user.devLogs)
    ctx.user.devLogs.push({
      experiment,
      result,
      timestamp: Date.now().toString(),
      logType: "experiment"
    });
  let calls = [];
  if (ctx.global.trackingCallback) {
    let cb = ctx.global.trackingCallback;
    calls.push(safeCall(() => cb(experiment, result, ctx.user)));
  }
  if (ctx.user.trackingCallback) {
    let cb = ctx.user.trackingCallback;
    calls.push(safeCall(() => cb(experiment, result)));
  }
  if (ctx.global.eventLogger) {
    let cb = ctx.global.eventLogger;
    calls.push(safeCall(() => cb(EVENT_EXPERIMENT_VIEWED, {
      experimentId: experiment.key,
      variationId: result.key,
      hashAttribute: result.hashAttribute,
      hashValue: result.hashValue
    }, ctx.user)));
  }
  return calls;
}
