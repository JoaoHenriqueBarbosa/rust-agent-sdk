// function: _temp249
function _temp249(log_1) {
  let currentSessionId = getSessionId(), logSessionId = getSessionIdFromLog(log_1);
  if (currentSessionId && logSessionId === currentSessionId)
    return !0;
  if (log_1.customTitle)
    return !0;
  if (getFirstMeaningfulUserMessageTextContent(log_1.messages))
    return !0;
  if (log_1.firstPrompt || log_1.customTitle)
    return !0;
  return !1;
}
