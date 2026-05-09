// function: shouldShowUserMessage
function shouldShowUserMessage(message, isTranscriptMode) {
  if (message.type !== "user")
    return !0;
  if (message.isMeta) {
    if (message.origin?.kind === "channel")
      return !0;
    return !1;
  }
  if (message.isVisibleInTranscriptOnly && !isTranscriptMode)
    return !1;
  return !0;
}
