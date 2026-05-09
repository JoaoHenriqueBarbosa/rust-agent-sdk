// Original: src/utils/errorLogSink.ts
import { dirname as dirname64, join as join148 } from "path";
function getErrorsPath() {
  return join148(CACHE_PATHS.errors(), DATE + ".jsonl");
}
function getMCPLogsPath(serverName) {
  return join148(CACHE_PATHS.mcpLogs(serverName), DATE + ".jsonl");
}
function createJsonlWriter(options2) {
  let writer = createBufferedWriter(options2);
  return {
    write(obj) {
      writer.write(jsonStringify(obj) + `
`);
    },
    flush: writer.flush,
    dispose: writer.dispose
  };
}
function getLogWriter(path27) {
  let writer = logWriters.get(path27);
  if (!writer) {
    let dir = dirname64(path27);
    writer = createJsonlWriter({
      writeFn: (content) => {
        try {
          getFsImplementation().appendFileSync(path27, content);
        } catch {
          getFsImplementation().mkdirSync(dir), getFsImplementation().appendFileSync(path27, content);
        }
      },
      flushIntervalMs: 1000,
      maxBufferSize: 50
    }), logWriters.set(path27, writer), registerCleanup(async () => writer?.dispose());
  }
  return writer;
}
function appendToLog(path27, message) {
  return;
}
function extractServerMessage(data) {
  if (typeof data === "string")
    return data;
  if (data && typeof data === "object") {
    let obj = data;
    if (typeof obj.message === "string")
      return obj.message;
    if (typeof obj.error === "object" && obj.error && "message" in obj.error && typeof obj.error.message === "string")
      return obj.error.message;
  }
  return;
}
function logErrorImpl(error44) {
  let errorStr = error44.stack || error44.message, context7 = "";
  if (axios_default.isAxiosError(error44) && error44.config?.url) {
    let parts = [`url=${error44.config.url}`];
    if (error44.response?.status !== void 0)
      parts.push(`status=${error44.response.status}`);
    let serverMessage = extractServerMessage(error44.response?.data);
    if (serverMessage)
      parts.push(`body=${serverMessage}`);
    context7 = `[${parts.join(",")}] `;
  }
  logForDebugging(`${error44.name}: ${context7}${errorStr}`, { level: "error" }), appendToLog(getErrorsPath(), {
    error: `${context7}${errorStr}`
  });
}
function logMCPErrorImpl(serverName, error44) {
  logForDebugging(`MCP server "${serverName}" ${error44}`, { level: "error" });
  let logFile = getMCPLogsPath(serverName), errorInfo = {
    error: error44 instanceof Error ? error44.stack || error44.message : String(error44),
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    sessionId: getSessionId(),
    cwd: getFsImplementation().cwd()
  };
  getLogWriter(logFile).write(errorInfo);
}
function logMCPDebugImpl(serverName, message) {
  logForDebugging(`MCP server "${serverName}": ${message}`);
  let logFile = getMCPLogsPath(serverName), debugInfo = {
    debug: message,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    sessionId: getSessionId(),
    cwd: getFsImplementation().cwd()
  };
  getLogWriter(logFile).write(debugInfo);
}
function initializeErrorLogSink() {
  attachErrorLogSink({
    logError: logErrorImpl,
    logMCPError: logMCPErrorImpl,
    logMCPDebug: logMCPDebugImpl,
    getErrorsPath,
    getMCPLogsPath
  }), logForDebugging("Error log sink initialized");
}
var DATE, logWriters;
var init_errorLogSink = __esm(() => {
  init_axios2();
  init_state();
  init_cachePaths();
  init_cleanupRegistry();
  init_debug();
  init_fsOperations();
  init_log3();
  init_slowOperations();
  DATE = dateToFilename(/* @__PURE__ */ new Date);
  logWriters = /* @__PURE__ */ new Map;
});
