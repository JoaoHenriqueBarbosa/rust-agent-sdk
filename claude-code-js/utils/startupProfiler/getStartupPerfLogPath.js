// function: getStartupPerfLogPath
function getStartupPerfLogPath() {
  return join4(getClaudeConfigHomeDir(), "startup-perf", `${getSessionId()}.txt`);
}
