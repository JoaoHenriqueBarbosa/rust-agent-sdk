// Original: src/services/preventSleep.ts
import { spawn as spawn12 } from "child_process";
function startPreventSleep() {
  if (refCount++, refCount === 1)
    spawnCaffeinate(), startRestartInterval();
}
function stopPreventSleep() {
  if (refCount > 0)
    refCount--;
  if (refCount === 0)
    stopRestartInterval(), killCaffeinate();
}
function forceStopPreventSleep() {
  refCount = 0, stopRestartInterval(), killCaffeinate();
}
function startRestartInterval() {
  if (process.platform !== "darwin")
    return;
  if (restartInterval !== null)
    return;
  restartInterval = setInterval(() => {
    if (refCount > 0)
      logForDebugging("Restarting caffeinate to maintain sleep prevention"), killCaffeinate(), spawnCaffeinate();
  }, RESTART_INTERVAL_MS), restartInterval.unref();
}
function stopRestartInterval() {
  if (restartInterval !== null)
    clearInterval(restartInterval), restartInterval = null;
}
function spawnCaffeinate() {
  if (process.platform !== "darwin")
    return;
  if (caffeinateProcess !== null)
    return;
  if (!cleanupRegistered6)
    cleanupRegistered6 = !0, registerCleanup(async () => {
      forceStopPreventSleep();
    });
  try {
    caffeinateProcess = spawn12("caffeinate", ["-i", "-t", String(CAFFEINATE_TIMEOUT_SECONDS)], {
      stdio: "ignore"
    }), caffeinateProcess.unref();
    let thisProc = caffeinateProcess;
    caffeinateProcess.on("error", (err2) => {
      if (logForDebugging(`caffeinate spawn error: ${err2.message}`), caffeinateProcess === thisProc)
        caffeinateProcess = null;
    }), caffeinateProcess.on("exit", () => {
      if (caffeinateProcess === thisProc)
        caffeinateProcess = null;
    }), logForDebugging("Started caffeinate to prevent sleep");
  } catch {
    caffeinateProcess = null;
  }
}
function killCaffeinate() {
  if (caffeinateProcess !== null) {
    let proc = caffeinateProcess;
    caffeinateProcess = null;
    try {
      proc.kill("SIGKILL"), logForDebugging("Stopped caffeinate, allowing sleep");
    } catch {}
  }
}
var CAFFEINATE_TIMEOUT_SECONDS = 300, RESTART_INTERVAL_MS = 240000, caffeinateProcess = null, restartInterval = null, refCount = 0, cleanupRegistered6 = !1;
var init_preventSleep = __esm(() => {
  init_cleanupRegistry();
  init_debug();
});
