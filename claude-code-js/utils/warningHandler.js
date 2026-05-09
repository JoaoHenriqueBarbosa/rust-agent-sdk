// Original: src/utils/warningHandler.ts
function isInternalWarning(warning) {
  let warningStr = `${warning.name}: ${warning.message}`;
  return INTERNAL_WARNINGS.some((pattern) => pattern.test(warningStr));
}
function initializeWarningHandler() {
  let currentListeners = process.listeners("warning");
  if (warningHandler && currentListeners.includes(warningHandler))
    return;
  if (!1)
    process.removeAllListeners("warning");
  warningHandler = (warning) => {
    try {
      let warningKey = `${warning.name}: ${warning.message.slice(0, 50)}`, count4 = warningCounts.get(warningKey) || 0;
      if (warningCounts.has(warningKey) || warningCounts.size < MAX_WARNING_KEYS)
        warningCounts.set(warningKey, count4 + 1);
      let isInternal = isInternalWarning(warning);
      if (logEvent("tengu_node_warning", {
        is_internal: isInternal ? 1 : 0,
        occurrence_count: count4 + 1,
        classname: warning.name,
        ...!1
      }), isEnvTruthy(process.env.CLAUDE_DEBUG))
        logForDebugging(`${isInternal ? "[Internal Warning]" : "[Warning]"} ${warning.toString()}`, { level: "warn" });
    } catch {}
  }, process.on("warning", warningHandler);
}
var MAX_WARNING_KEYS = 1000, warningCounts, INTERNAL_WARNINGS, warningHandler = null;
var init_warningHandler = __esm(() => {
  init_debug();
  init_envUtils();
  init_platform();
  warningCounts = /* @__PURE__ */ new Map, INTERNAL_WARNINGS = [
    /MaxListenersExceededWarning.*AbortSignal/,
    /MaxListenersExceededWarning.*EventTarget/
  ];
});
