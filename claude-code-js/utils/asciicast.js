// Original: src/utils/asciicast.ts
var exports_asciicast = {};
__export(exports_asciicast, {
  renameRecordingForSession: () => renameRecordingForSession,
  installAsciicastRecorder: () => installAsciicastRecorder,
  getSessionRecordingPaths: () => getSessionRecordingPaths,
  getRecordFilePath: () => getRecordFilePath,
  flushAsciicastRecorder: () => flushAsciicastRecorder,
  _resetRecordingStateForTesting: () => _resetRecordingStateForTesting
});
import { appendFile as appendFile6, rename as rename10 } from "fs/promises";
import { basename as basename54, dirname as dirname60, join as join144 } from "path";
function getRecordFilePath() {
  if (recordingState.filePath !== null)
    return recordingState.filePath;
  return null;
}
function _resetRecordingStateForTesting() {
  recordingState.filePath = null, recordingState.timestamp = 0;
}
function getSessionRecordingPaths() {
  let sessionId = getSessionId(), projectsDir = join144(getClaudeConfigHomeDir(), "projects"), projectDir = join144(projectsDir, sanitizePath2(getOriginalCwd()));
  try {
    let entries2 = getFsImplementation().readdirSync(projectDir);
    return (typeof entries2[0] === "string" ? entries2 : entries2.map((e) => e.name)).filter((f) => f.startsWith(sessionId) && f.endsWith(".cast")).sort().map((f) => join144(projectDir, f));
  } catch {
    return [];
  }
}
async function renameRecordingForSession() {
  let oldPath = recordingState.filePath;
  if (!oldPath || recordingState.timestamp === 0)
    return;
  let projectsDir = join144(getClaudeConfigHomeDir(), "projects"), projectDir = join144(projectsDir, sanitizePath2(getOriginalCwd())), newPath = join144(projectDir, `${getSessionId()}-${recordingState.timestamp}.cast`);
  if (oldPath === newPath)
    return;
  await recorder?.flush();
  let oldName = basename54(oldPath), newName = basename54(newPath);
  try {
    await rename10(oldPath, newPath), recordingState.filePath = newPath, logForDebugging(`[asciicast] Renamed recording: ${oldName} \u2192 ${newName}`);
  } catch {
    logForDebugging(`[asciicast] Failed to rename recording from ${oldName} to ${newName}`);
  }
}
function getTerminalSize() {
  let cols = process.stdout.columns || 80, rows = process.stdout.rows || 24;
  return { cols, rows };
}
async function flushAsciicastRecorder() {
  await recorder?.flush();
}
function installAsciicastRecorder() {
  let filePath = getRecordFilePath();
  if (!filePath)
    return;
  let { cols, rows } = getTerminalSize(), startTime = performance.now(), header = jsonStringify({
    version: 2,
    width: cols,
    height: rows,
    timestamp: Math.floor(Date.now() / 1000),
    env: {
      SHELL: process.env.SHELL || "",
      TERM: process.env.TERM || ""
    }
  });
  try {
    getFsImplementation().mkdirSync(dirname60(filePath));
  } catch {}
  getFsImplementation().appendFileSync(filePath, header + `
`, { mode: 384 });
  let pendingWrite2 = Promise.resolve(), writer = createBufferedWriter({
    writeFn(content) {
      let currentPath = recordingState.filePath;
      if (!currentPath)
        return;
      pendingWrite2 = pendingWrite2.then(() => appendFile6(currentPath, content)).catch(() => {});
    },
    flushIntervalMs: 500,
    maxBufferSize: 50,
    maxBufferBytes: 10485760
  }), originalWrite = process.stdout.write.bind(process.stdout);
  process.stdout.write = function(chunk2, encodingOrCb, cb) {
    let elapsed = (performance.now() - startTime) / 1000, text2 = typeof chunk2 === "string" ? chunk2 : Buffer.from(chunk2).toString("utf-8");
    if (writer.write(jsonStringify([elapsed, "o", text2]) + `
`), typeof encodingOrCb === "function")
      return originalWrite(chunk2, encodingOrCb);
    return originalWrite(chunk2, encodingOrCb, cb);
  };
  function onResize() {
    let elapsed = (performance.now() - startTime) / 1000, { cols: newCols, rows: newRows } = getTerminalSize();
    writer.write(jsonStringify([elapsed, "r", `${newCols}x${newRows}`]) + `
`);
  }
  process.stdout.on("resize", onResize), recorder = {
    async flush() {
      writer.flush(), await pendingWrite2;
    },
    async dispose() {
      writer.dispose(), await pendingWrite2, process.stdout.removeListener("resize", onResize), process.stdout.write = originalWrite;
    }
  }, registerCleanup(async () => {
    await recorder?.dispose(), recorder = null;
  }), logForDebugging(`[asciicast] Recording to ${filePath}`);
}
var recordingState, recorder = null;
var init_asciicast = __esm(() => {
  init_state();
  init_cleanupRegistry();
  init_debug();
  init_envUtils();
  init_fsOperations();
  init_path2();
  init_slowOperations();
  recordingState = {
    filePath: null,
    timestamp: 0
  };
});
