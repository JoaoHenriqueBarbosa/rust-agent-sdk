// function: createStopHookSummaryMessage2
function createStopHookSummaryMessage2(hookCount, hookInfos, hookErrors, preventedContinuation, stopReason, hasOutput, level, toolUseID, hookLabel, totalDurationMs) {
  return {
    type: "system",
    subtype: "stop_hook_summary",
    hookCount,
    hookInfos,
    hookErrors,
    preventedContinuation,
    stopReason,
    hasOutput,
    level,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    uuid: randomUUID22(),
    toolUseID,
    hookLabel,
    totalDurationMs
  };
}
