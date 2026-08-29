// function: regenerateSessionId
function regenerateSessionId(options = {}) {
  if (options.setCurrentAsParent)
    STATE.parentSessionId = STATE.sessionId;
  return STATE.planSlugCache.delete(STATE.sessionId), STATE.sessionId = randomUUID(), STATE.sessionProjectDir = null, STATE.sessionId;
}
