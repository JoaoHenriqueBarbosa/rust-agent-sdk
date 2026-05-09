// function: enableConfigs
function enableConfigs() {
  if (configReadingAllowed)
    return;
  let startTime = Date.now();
  logForDiagnosticsNoPII("info", "enable_configs_started"), configReadingAllowed = !0, getConfig(getGlobalClaudeFile(), createDefaultGlobalConfig, !0), logForDiagnosticsNoPII("info", "enable_configs_completed", {
    duration_ms: Date.now() - startTime
  });
}
