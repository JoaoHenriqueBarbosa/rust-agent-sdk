// function: logStartupPerf
function logStartupPerf() {
  if (!STATSIG_LOGGING_SAMPLED)
    return;
  let marks = getPerformance().getEntriesByType("mark");
  if (marks.length === 0)
    return;
  let checkpointTimes = /* @__PURE__ */ new Map;
  for (let mark of marks)
    checkpointTimes.set(mark.name, mark.startTime);
  let metadata = {};
  for (let [phaseName, [startCheckpoint, endCheckpoint]] of Object.entries(PHASE_DEFINITIONS)) {
    let startTime = checkpointTimes.get(startCheckpoint), endTime = checkpointTimes.get(endCheckpoint);
    if (startTime !== void 0 && endTime !== void 0)
      metadata[`${phaseName}_ms`] = Math.round(endTime - startTime);
  }
  metadata.checkpoint_count = marks.length, logEvent("tengu_startup_perf", metadata);
}
