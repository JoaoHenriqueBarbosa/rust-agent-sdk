// Original: src/utils/debug.ts
import { appendFile, mkdir, symlink, unlink } from "fs/promises";
import { dirname as dirname2, join as join3 } from "path";
function enableDebugLogging() {
  let wasActive = isDebugMode() || !1;
  return runtimeDebugEnabled = !0, isDebugMode.cache.clear?.(), wasActive;
}
function shouldLogDebugMessage(message) {
  if (!isDebugMode())
    return !1;
  if (typeof process > "u" || typeof process.versions > "u" || typeof process.versions.node > "u")
    return !1;
  let filter = getDebugFilter();
  return shouldShowDebugMessage(message, filter);
}
function setHasFormattedOutput(value) {
  hasFormattedOutput = value;
}
function getHasFormattedOutput() {
  return hasFormattedOutput;
}
async function appendAsync(needMkdir, dir, path2, content) {
  if (needMkdir)
    await mkdir(dir, { recursive: !0 }).catch(() => {});
  await appendFile(path2, content), updateLatestDebugLogSymlink();
}
function noop2() {}
function getDebugWriter() {
  if (!debugWriter) {
    let ensuredDir = null;
    debugWriter = createBufferedWriter({
      writeFn: (content) => {
        let path2 = getDebugLogPath(), dir = dirname2(path2), needMkdir = ensuredDir !== dir;
        if (ensuredDir = dir, isDebugMode()) {
          if (needMkdir)
            try {
              getFsImplementation().mkdirSync(dir);
            } catch {}
          getFsImplementation().appendFileSync(path2, content), updateLatestDebugLogSymlink();
          return;
        }
        pendingWrite = pendingWrite.then(appendAsync.bind(null, needMkdir, dir, path2, content)).catch(noop2);
      },
      flushIntervalMs: 1000,
      maxBufferSize: 100,
      immediateMode: isDebugMode()
    }), registerCleanup(async () => {
      debugWriter?.dispose(), await pendingWrite;
    });
  }
  return debugWriter;
}
function logForDebugging(message, { level } = {
  level: "debug"
}) {
  if (LEVEL_ORDER[level] < LEVEL_ORDER[getMinDebugLogLevel()])
    return;
  if (!shouldLogDebugMessage(message))
    return;
  if (hasFormattedOutput && message.includes(`
`))
    message = jsonStringify(message);
  let output = `${(/* @__PURE__ */ new Date()).toISOString()} [${level.toUpperCase()}] ${message.trim()}
`;
  if (isDebugToStdErr()) {
    writeToStderr(output);
    return;
  }
  getDebugWriter().write(output);
}
function getDebugLogPath() {
  return getDebugFilePath() ?? process.env.CLAUDE_CODE_DEBUG_LOGS_DIR ?? join3(getClaudeConfigHomeDir(), "debug", `${getSessionId()}.txt`);
}
function logAntError(context, error2) {
  return;
}
var LEVEL_ORDER, getMinDebugLogLevel, runtimeDebugEnabled = !1, isDebugMode, getDebugFilter, isDebugToStdErr, getDebugFilePath, hasFormattedOutput = !1, debugWriter = null, pendingWrite, updateLatestDebugLogSymlink;
var init_debug = __esm(() => {
  init_memoize();
  init_state();
  init_cleanupRegistry();
  init_debugFilter();
  init_envUtils();
  init_fsOperations();
  init_slowOperations();
  LEVEL_ORDER = {
    verbose: 0,
    debug: 1,
    info: 2,
    warn: 3,
    error: 4
  }, getMinDebugLogLevel = memoize_default(() => {
    let raw = process.env.CLAUDE_CODE_DEBUG_LOG_LEVEL?.toLowerCase().trim();
    if (raw && Object.hasOwn(LEVEL_ORDER, raw))
      return raw;
    return "debug";
  }), isDebugMode = memoize_default(() => {
    return runtimeDebugEnabled || isEnvTruthy(process.env.DEBUG) || isEnvTruthy(process.env.DEBUG_SDK) || process.argv.includes("--debug") || process.argv.includes("-d") || isDebugToStdErr() || process.argv.some((arg) => arg.startsWith("--debug=")) || getDebugFilePath() !== null;
  });
  getDebugFilter = memoize_default(() => {
    let debugArg = process.argv.find((arg) => arg.startsWith("--debug="));
    if (!debugArg)
      return null;
    let filterPattern = debugArg.substring(8);
    return parseDebugFilter(filterPattern);
  }), isDebugToStdErr = memoize_default(() => {
    return process.argv.includes("--debug-to-stderr") || process.argv.includes("-d2e");
  }), getDebugFilePath = memoize_default(() => {
    for (let i = 0;i < process.argv.length; i++) {
      let arg = process.argv[i];
      if (arg.startsWith("--debug-file="))
        return arg.substring(13);
      if (arg === "--debug-file" && i + 1 < process.argv.length)
        return process.argv[i + 1];
    }
    return null;
  });
  pendingWrite = Promise.resolve();
  updateLatestDebugLogSymlink = memoize_default(async () => {
    try {
      let debugLogPath = getDebugLogPath(), debugLogsDir = dirname2(debugLogPath), latestSymlinkPath = join3(debugLogsDir, "latest");
      await unlink(latestSymlinkPath).catch(() => {}), await symlink(debugLogPath, latestSymlinkPath);
    } catch {}
  });
});
