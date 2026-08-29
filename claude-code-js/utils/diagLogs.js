// Original: src/utils/diagLogs.ts
import { dirname as dirname4 } from "path";
function logForDiagnosticsNoPII(level, event, data) {
  let logFile = getDiagnosticLogFile();
  if (!logFile)
    return;
  let entry = {
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    level,
    event,
    data: data ?? {}
  }, fs2 = getFsImplementation(), line = jsonStringify(entry) + `
`;
  try {
    fs2.appendFileSync(logFile, line);
  } catch {
    try {
      fs2.mkdirSync(dirname4(logFile)), fs2.appendFileSync(logFile, line);
    } catch {}
  }
}
function getDiagnosticLogFile() {
  return process.env.CLAUDE_CODE_DIAGNOSTICS_FILE;
}
async function withDiagnosticsTiming(event, fn, getData) {
  let startTime = Date.now();
  logForDiagnosticsNoPII("info", `${event}_started`);
  try {
    let result = await fn(), additionalData = getData ? getData(result) : {};
    return logForDiagnosticsNoPII("info", `${event}_completed`, {
      duration_ms: Date.now() - startTime,
      ...additionalData
    }), result;
  } catch (error41) {
    throw logForDiagnosticsNoPII("error", `${event}_failed`, {
      duration_ms: Date.now() - startTime
    }), error41;
  }
}
var init_diagLogs = __esm(() => {
  init_fsOperations();
  init_slowOperations();
});
