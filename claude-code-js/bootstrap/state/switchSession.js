// function: switchSession
function switchSession(sessionId, projectDir = null) {
  STATE.planSlugCache.delete(STATE.sessionId), STATE.sessionId = sessionId, STATE.sessionProjectDir = projectDir, sessionSwitched.emit(sessionId);
}
