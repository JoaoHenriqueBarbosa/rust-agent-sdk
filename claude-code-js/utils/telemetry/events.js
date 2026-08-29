// Original: src/utils/telemetry/events.ts
function isUserPromptLoggingEnabled() {
  return isEnvTruthy(process.env.OTEL_LOG_USER_PROMPTS);
}
function redactIfDisabled(content) {
  return isUserPromptLoggingEnabled() ? content : "<REDACTED>";
}
async function logOTelEvent(eventName, metadata = {}) {
  let eventLogger = getEventLogger();
  if (!eventLogger) {
    if (!hasWarnedNoEventLogger)
      hasWarnedNoEventLogger = !0, logForDebugging(`[3P telemetry] Event dropped (no event logger initialized): ${eventName}`, { level: "warn" });
    return;
  }
  let attributes = {
    ...getTelemetryAttributes(),
    "event.name": eventName,
    "event.timestamp": (/* @__PURE__ */ new Date()).toISOString(),
    "event.sequence": eventSequence++
  }, promptId = getPromptId();
  if (promptId)
    attributes["prompt.id"] = promptId;
  let workspaceDir = process.env.CLAUDE_CODE_WORKSPACE_HOST_PATHS;
  if (workspaceDir)
    attributes["workspace.host_paths"] = workspaceDir.split("|");
  for (let [key2, value] of Object.entries(metadata))
    if (value !== void 0)
      attributes[key2] = value;
  eventLogger.emit({
    body: `claude_code.${eventName}`,
    attributes
  });
}
var eventSequence = 0, hasWarnedNoEventLogger = !1;
var init_events = __esm(() => {
  init_state();
  init_debug();
  init_envUtils();
  init_telemetryAttributes();
});
