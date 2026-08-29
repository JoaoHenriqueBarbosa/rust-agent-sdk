// Original: src/utils/sessionActivity.ts
function startHeartbeatTimer() {
  clearIdleTimer(), heartbeatTimer = setInterval(() => {
    if (logForDiagnosticsNoPII("debug", "session_keepalive_heartbeat", {
      refcount
    }), isEnvTruthy(process.env.CLAUDE_CODE_REMOTE_SEND_KEEPALIVES))
      activityCallback?.();
  }, SESSION_ACTIVITY_INTERVAL_MS);
}
function startIdleTimer() {
  if (clearIdleTimer(), activityCallback === null)
    return;
  idleTimer = setTimeout(() => {
    logForDiagnosticsNoPII("info", "session_idle_30s"), idleTimer = null;
  }, SESSION_ACTIVITY_INTERVAL_MS);
}
function clearIdleTimer() {
  if (idleTimer !== null)
    clearTimeout(idleTimer), idleTimer = null;
}
function registerSessionActivityCallback(cb) {
  if (activityCallback = cb, refcount > 0 && heartbeatTimer === null)
    startHeartbeatTimer();
}
function unregisterSessionActivityCallback() {
  if (activityCallback = null, heartbeatTimer !== null)
    clearInterval(heartbeatTimer), heartbeatTimer = null;
  clearIdleTimer();
}
function sendSessionActivitySignal() {
  if (isEnvTruthy(process.env.CLAUDE_CODE_REMOTE_SEND_KEEPALIVES))
    activityCallback?.();
}
function isSessionActivityTrackingActive() {
  return activityCallback !== null;
}
function startSessionActivity(reason) {
  if (refcount++, activeReasons.set(reason, (activeReasons.get(reason) ?? 0) + 1), refcount === 1) {
    if (oldestActivityStartedAt = Date.now(), activityCallback !== null && heartbeatTimer === null)
      startHeartbeatTimer();
  }
  if (!cleanupRegistered3)
    cleanupRegistered3 = !0, registerCleanup(async () => {
      logForDiagnosticsNoPII("info", "session_activity_at_shutdown", {
        refcount,
        active: Object.fromEntries(activeReasons),
        oldest_activity_ms: refcount > 0 && oldestActivityStartedAt !== null ? Date.now() - oldestActivityStartedAt : null
      });
    });
}
function stopSessionActivity(reason) {
  if (refcount > 0)
    refcount--;
  let n5 = (activeReasons.get(reason) ?? 0) - 1;
  if (n5 > 0)
    activeReasons.set(reason, n5);
  else
    activeReasons.delete(reason);
  if (refcount === 0 && heartbeatTimer !== null)
    clearInterval(heartbeatTimer), heartbeatTimer = null, startIdleTimer();
}
var SESSION_ACTIVITY_INTERVAL_MS = 30000, activityCallback = null, refcount = 0, activeReasons, oldestActivityStartedAt = null, heartbeatTimer = null, idleTimer = null, cleanupRegistered3 = !1;
var init_sessionActivity = __esm(() => {
  init_cleanupRegistry();
  init_diagLogs();
  init_envUtils();
  activeReasons = /* @__PURE__ */ new Map;
});
