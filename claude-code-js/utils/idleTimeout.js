// Original: src/utils/idleTimeout.ts
function createIdleTimeoutManager(isIdle) {
  let exitAfterStopDelay = process.env.CLAUDE_CODE_EXIT_AFTER_STOP_DELAY, delayMs = exitAfterStopDelay ? parseInt(exitAfterStopDelay, 10) : null, isValidDelay = delayMs && !isNaN(delayMs) && delayMs > 0, timer = null, lastIdleTime = 0;
  return {
    start() {
      if (timer)
        clearTimeout(timer), timer = null;
      if (isValidDelay)
        lastIdleTime = Date.now(), timer = setTimeout(() => {
          let idleDuration = Date.now() - lastIdleTime;
          if (isIdle() && idleDuration >= delayMs)
            logForDebugging(`Exiting after ${delayMs}ms of idle time`), gracefulShutdownSync();
        }, delayMs);
    },
    stop() {
      if (timer)
        clearTimeout(timer), timer = null;
    }
  };
}
var init_idleTimeout = __esm(() => {
  init_debug();
  init_gracefulShutdown();
});
