// Original: src/utils/gracefulShutdown.ts
import { writeSync as writeSync2 } from "fs";
function cleanupTerminalModes() {
  if (!process.stdout.isTTY)
    return;
  try {
    writeSync2(1, DISABLE_MOUSE_TRACKING);
    let inst = instances_default.get(process.stdout);
    if (inst?.isAltScreenActive)
      try {
        inst.unmount();
      } catch {
        writeSync2(1, EXIT_ALT_SCREEN);
      }
    if (inst?.drainStdin(), inst?.detachForShutdown(), writeSync2(1, DISABLE_MODIFY_OTHER_KEYS), writeSync2(1, DISABLE_KITTY_KEYBOARD), writeSync2(1, DFE), writeSync2(1, DBP), writeSync2(1, SHOW_CURSOR), writeSync2(1, CLEAR_ITERM2_PROGRESS), supportsTabStatus())
      writeSync2(1, wrapForMultiplexer(CLEAR_TAB_STATUS));
    if (!isEnvTruthy(process.env.CLAUDE_CODE_DISABLE_TERMINAL_TITLE))
      if (process.platform === "win32")
        process.title = "";
      else
        writeSync2(1, CLEAR_TERMINAL_TITLE);
  } catch {}
}
function printResumeHint() {
  if (resumeHintPrinted)
    return;
  if (process.stdout.isTTY && getIsInteractive() && !isSessionPersistenceDisabled())
    try {
      let sessionId = getSessionId();
      if (!sessionIdExists(sessionId))
        return;
      let customTitle = getCurrentSessionTitle(sessionId), resumeArg;
      if (customTitle)
        resumeArg = `"${customTitle.replace(/\\/g, "\\\\").replace(/"/g, "\\\"")}"`;
      else
        resumeArg = sessionId;
      writeSync2(1, source_default.dim(`
Resume this session with:
claude --resume ${resumeArg}
`)), resumeHintPrinted = !0;
    } catch {}
}
function forceExit(exitCode) {
  if (failsafeTimer !== void 0)
    clearTimeout(failsafeTimer), failsafeTimer = void 0;
  try {
    instances_default.get(process.stdout)?.drainStdin();
  } catch {}
  try {
    process.exit(exitCode);
  } catch (e) {
    process.kill(process.pid, "SIGKILL");
  }
  throw Error("unreachable");
}
function gracefulShutdownSync(exitCode = 0, reason = "other", options2) {
  process.exitCode = exitCode, pendingShutdown = gracefulShutdown(exitCode, reason, options2).catch((error44) => {
    logForDebugging(`Graceful shutdown failed: ${error44}`, { level: "error" }), cleanupTerminalModes(), printResumeHint(), forceExit(exitCode);
  }).catch(() => {});
}
function isShuttingDown() {
  return shutdownInProgress;
}
async function gracefulShutdown(exitCode = 0, reason = "other", options2) {
  if (shutdownInProgress)
    return;
  shutdownInProgress = !0;
  let { executeSessionEndHooks, getSessionEndHookTimeoutMs } = await Promise.resolve().then(() => (init_hooks5(), exports_hooks2)), sessionEndTimeoutMs = getSessionEndHookTimeoutMs();
  failsafeTimer = setTimeout((code) => {
    cleanupTerminalModes(), printResumeHint(), forceExit(code);
  }, Math.max(5000, sessionEndTimeoutMs + 3500), exitCode), failsafeTimer.unref(), process.exitCode = exitCode, cleanupTerminalModes(), printResumeHint();
  let cleanupTimeoutId;
  try {
    let cleanupPromise = (async () => {
      try {
        await runCleanupFunctions();
      } catch {}
    })();
    await Promise.race([
      cleanupPromise,
      new Promise((_, reject2) => {
        cleanupTimeoutId = setTimeout((rej) => rej(new CleanupTimeoutError), 2000, reject2);
      })
    ]), clearTimeout(cleanupTimeoutId);
  } catch {
    clearTimeout(cleanupTimeoutId);
  }
  try {
    await executeSessionEndHooks(reason, {
      ...options2,
      signal: AbortSignal.timeout(sessionEndTimeoutMs),
      timeoutMs: sessionEndTimeoutMs
    });
  } catch {}
  try {
    profileReport();
  } catch {}
  let lastRequestId = getLastMainRequestId();
  if (lastRequestId)
    logEvent("tengu_cache_eviction_hint", {
      scope: "session_end",
      last_request_id: lastRequestId
    });
  try {
    await Promise.race([
      Promise.all([shutdown1PEventLogging(), shutdownDatadog()]),
      sleep3(500)
    ]);
  } catch {}
  if (options2?.finalMessage)
    try {
      writeSync2(2, options2.finalMessage + `
`);
    } catch {}
  forceExit(exitCode);
}
var resumeHintPrinted = !1, setupGracefulShutdown, shutdownInProgress = !1, failsafeTimer, orphanCheckInterval, pendingShutdown, CleanupTimeoutError;
var init_gracefulShutdown = __esm(() => {
  init_source();
  init_memoize();
  init_mjs();
  init_state();
  init_instances();
  init_csi();
  init_dec();
  init_osc();
  init_cleanupRegistry();
  init_debug();
  init_diagLogs();
  init_envUtils();
  init_sessionStorage();
  init_startupProfiler();
  setupGracefulShutdown = memoize_default(() => {
    if (onExit(() => {}), process.on("SIGINT", () => {
      if (process.argv.includes("-p") || process.argv.includes("--print"))
        return;
      logForDiagnosticsNoPII("info", "shutdown_signal", { signal: "SIGINT" }), gracefulShutdown(0);
    }), process.on("SIGTERM", () => {
      logForDiagnosticsNoPII("info", "shutdown_signal", { signal: "SIGTERM" }), gracefulShutdown(143);
    }), process.platform !== "win32") {
      if (process.on("SIGHUP", () => {
        logForDiagnosticsNoPII("info", "shutdown_signal", { signal: "SIGHUP" }), gracefulShutdown(129);
      }), process.stdin.isTTY)
        orphanCheckInterval = setInterval(() => {
          if (getIsScrollDraining())
            return;
          if (!process.stdout.writable || !process.stdin.readable)
            clearInterval(orphanCheckInterval), logForDiagnosticsNoPII("info", "shutdown_signal", {
              signal: "orphan_detected"
            }), gracefulShutdown(129);
        }, 30000), orphanCheckInterval.unref();
    }
    process.on("uncaughtException", (error44) => {
      logForDiagnosticsNoPII("error", "uncaught_exception", {
        error_name: error44.name,
        error_message: error44.message.slice(0, 2000)
      }), logEvent("tengu_uncaught_exception", {
        error_name: error44.name
      });
    }), process.on("unhandledRejection", (reason) => {
      let errorName = reason instanceof Error ? reason.name : typeof reason === "string" ? "string" : "unknown", errorInfo = reason instanceof Error ? {
        error_name: reason.name,
        error_message: reason.message.slice(0, 2000),
        error_stack: reason.stack?.slice(0, 4000)
      } : { error_message: String(reason).slice(0, 2000) };
      logForDiagnosticsNoPII("error", "unhandled_rejection", errorInfo), logEvent("tengu_unhandled_rejection", {
        error_name: errorName
      });
    });
  });
  CleanupTimeoutError = class CleanupTimeoutError extends Error {
    constructor() {
      super("Cleanup timeout");
    }
  };
});
