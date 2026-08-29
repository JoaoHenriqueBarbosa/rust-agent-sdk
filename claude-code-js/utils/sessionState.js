// Original: src/utils/sessionState.ts
function setSessionStateChangedListener(cb) {
  stateListener = cb;
}
function setSessionMetadataChangedListener(cb) {
  metadataListener = cb;
}
function setPermissionModeChangedListener(cb) {
  permissionModeListener = cb;
}
function getSessionState() {
  return currentState;
}
function notifySessionStateChanged(state4, details) {
  if (currentState = state4, stateListener?.(state4, details), state4 === "requires_action" && details)
    hasPendingAction = !0, metadataListener?.({
      pending_action: details
    });
  else if (hasPendingAction)
    hasPendingAction = !1, metadataListener?.({ pending_action: null });
  if (state4 === "idle")
    metadataListener?.({ task_summary: null });
  if (isEnvTruthy(process.env.CLAUDE_CODE_EMIT_SESSION_STATE_EVENTS))
    enqueueSdkEvent({
      type: "system",
      subtype: "session_state_changed",
      state: state4
    });
}
function notifySessionMetadataChanged(metadata) {
  metadataListener?.(metadata);
}
function notifyPermissionModeChanged(mode) {
  permissionModeListener?.(mode);
}
var stateListener = null, metadataListener = null, permissionModeListener = null, hasPendingAction = !1, currentState = "idle";
var init_sessionState = __esm(() => {
  init_envUtils();
  init_sdkEventQueue();
});
