// Original: src/utils/headlessProfiler.ts
function clearHeadlessMarks() {
  let perf = getPerformance(), allMarks = perf.getEntriesByType("mark");
  for (let mark of allMarks)
    if (mark.name.startsWith(MARK_PREFIX))
      perf.clearMarks(mark.name);
}
function headlessProfilerStartTurn() {
  if (!getIsNonInteractiveSession())
    return;
  if (!SHOULD_PROFILE2)
    return;
  if (currentTurnNumber++, clearHeadlessMarks(), getPerformance().mark(`${MARK_PREFIX}turn_start`), DETAILED_PROFILING2)
    logForDebugging(`[headlessProfiler] Started turn ${currentTurnNumber}`);
}
function headlessProfilerCheckpoint(name3) {
  if (!getIsNonInteractiveSession())
    return;
  if (!SHOULD_PROFILE2)
    return;
  let perf = getPerformance();
  if (perf.mark(`${MARK_PREFIX}${name3}`), DETAILED_PROFILING2)
    logForDebugging(`[headlessProfiler] Checkpoint: ${name3} at ${perf.now().toFixed(1)}ms`);
}
function logHeadlessProfilerTurn() {
  if (!getIsNonInteractiveSession())
    return;
  if (!SHOULD_PROFILE2)
    return;
  let marks = getPerformance().getEntriesByType("mark").filter((mark) => mark.name.startsWith(MARK_PREFIX));
  if (marks.length === 0)
    return;
  let checkpointTimes = /* @__PURE__ */ new Map;
  for (let mark of marks) {
    let name3 = mark.name.slice(MARK_PREFIX.length);
    checkpointTimes.set(name3, mark.startTime);
  }
  let turnStart = checkpointTimes.get("turn_start");
  if (turnStart === void 0)
    return;
  let metadata = {
    turn_number: currentTurnNumber
  }, systemMessageTime = checkpointTimes.get("system_message_yielded");
  if (systemMessageTime !== void 0 && currentTurnNumber === 0)
    metadata.time_to_system_message_ms = Math.round(systemMessageTime);
  let queryStartTime = checkpointTimes.get("query_started");
  if (queryStartTime !== void 0)
    metadata.time_to_query_start_ms = Math.round(queryStartTime - turnStart);
  let firstChunkTime = checkpointTimes.get("first_chunk");
  if (firstChunkTime !== void 0)
    metadata.time_to_first_response_ms = Math.round(firstChunkTime - turnStart);
  let apiRequestTime = checkpointTimes.get("api_request_sent");
  if (queryStartTime !== void 0 && apiRequestTime !== void 0)
    metadata.query_overhead_ms = Math.round(apiRequestTime - queryStartTime);
  if (metadata.checkpoint_count = marks.length, process.env.CLAUDE_CODE_ENTRYPOINT)
    metadata.entrypoint = process.env.CLAUDE_CODE_ENTRYPOINT;
  if (STATSIG_LOGGING_SAMPLED2)
    logEvent("tengu_headless_latency", metadata);
  if (DETAILED_PROFILING2)
    logForDebugging(`[headlessProfiler] Turn ${currentTurnNumber} metrics: ${jsonStringify(metadata)}`);
}
var DETAILED_PROFILING2, STATSIG_SAMPLE_RATE2 = 0.05, STATSIG_LOGGING_SAMPLED2, SHOULD_PROFILE2, MARK_PREFIX = "headless_", currentTurnNumber = -1;
var init_headlessProfiler = __esm(() => {
  init_state();
  init_debug();
  init_envUtils();
  init_profilerBase();
  init_slowOperations();
  DETAILED_PROFILING2 = isEnvTruthy(process.env.CLAUDE_CODE_PROFILE_STARTUP), STATSIG_LOGGING_SAMPLED2 = Math.random() < STATSIG_SAMPLE_RATE2, SHOULD_PROFILE2 = DETAILED_PROFILING2 || STATSIG_LOGGING_SAMPLED2;
});
