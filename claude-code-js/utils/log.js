// Original: src/utils/log.ts
function getLogDisplayTitle(log, defaultTitle) {
  let isAutonomousPrompt = log.firstPrompt?.startsWith(`<${TICK_TAG}>`), strippedFirstPrompt = log.firstPrompt ? stripDisplayTagsAllowEmpty(log.firstPrompt) : "", useFirstPrompt = strippedFirstPrompt && !isAutonomousPrompt, title = log.agentName || log.customTitle || log.summary || (useFirstPrompt ? strippedFirstPrompt : void 0) || defaultTitle || (isAutonomousPrompt ? "Autonomous session" : void 0) || (log.sessionId ? log.sessionId.slice(0, 8) : "") || "";
  return stripDisplayTags(title).trim();
}
function dateToFilename(date5) {
  return date5.toISOString().replace(/[:.]/g, "-");
}
function addToInMemoryErrorLog2(errorInfo) {
  if (inMemoryErrorLog.length >= MAX_IN_MEMORY_ERRORS)
    inMemoryErrorLog.shift();
  inMemoryErrorLog.push(errorInfo);
}
function attachErrorLogSink(newSink) {
  if (errorLogSink !== null)
    return;
  if (errorLogSink = newSink, errorQueue.length > 0) {
    let queuedEvents = [...errorQueue];
    errorQueue.length = 0;
    for (let event of queuedEvents)
      switch (event.type) {
        case "error":
          errorLogSink.logError(event.error);
          break;
        case "mcpError":
          errorLogSink.logMCPError(event.serverName, event.error);
          break;
        case "mcpDebug":
          errorLogSink.logMCPDebug(event.serverName, event.message);
          break;
      }
  }
}
function logError2(error41) {
  let err = toError(error41);
  try {
    if (isEnvTruthy(process.env.CLAUDE_CODE_USE_BEDROCK) || isEnvTruthy(process.env.CLAUDE_CODE_USE_VERTEX) || isEnvTruthy(process.env.CLAUDE_CODE_USE_FOUNDRY) || process.env.DISABLE_ERROR_REPORTING || isEssentialTrafficOnly())
      return;
    let errorInfo = {
      error: err.stack || err.message,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (addToInMemoryErrorLog2(errorInfo), errorLogSink === null) {
      errorQueue.push({ type: "error", error: err });
      return;
    }
    errorLogSink.logError(err);
  } catch {}
}
function getInMemoryErrors() {
  return [...inMemoryErrorLog];
}
function logMCPError(serverName, error41) {
  try {
    if (errorLogSink === null) {
      errorQueue.push({ type: "mcpError", serverName, error: error41 });
      return;
    }
    errorLogSink.logMCPError(serverName, error41);
  } catch {}
}
function logMCPDebug(serverName, message) {
  try {
    if (errorLogSink === null) {
      errorQueue.push({ type: "mcpDebug", serverName, message });
      return;
    }
    errorLogSink.logMCPDebug(serverName, message);
  } catch {}
}
function captureAPIRequest(params, querySource) {
  if (!querySource || !querySource.startsWith("repl_main_thread"))
    return;
  let { messages, ...paramsWithoutMessages } = params;
  setLastAPIRequest(paramsWithoutMessages), setLastAPIRequestMessages(null);
}
var MAX_IN_MEMORY_ERRORS = 100, inMemoryErrorLog, errorQueue, errorLogSink = null, isHardFailMode;
var init_log3 = __esm(() => {
  init_memoize();
  init_state();
  init_xml();
  init_cachePaths();
  init_displayTags();
  init_envUtils();
  init_errors();
  init_slowOperations();
  inMemoryErrorLog = [];
  errorQueue = [];
  isHardFailMode = memoize_default(() => {
    return process.argv.includes("--hard-fail");
  });
});
