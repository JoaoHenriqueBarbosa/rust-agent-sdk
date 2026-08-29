// function: selectableUserMessagesFilter
function selectableUserMessagesFilter(message) {
  if (message.type !== "user")
    return !1;
  if (Array.isArray(message.message.content) && message.message.content[0]?.type === "tool_result")
    return !1;
  if (isSyntheticMessage(message))
    return !1;
  if (message.isMeta)
    return !1;
  if (message.isCompactSummary || message.isVisibleInTranscriptOnly)
    return !1;
  let content = message.message.content, lastBlock = typeof content === "string" ? null : content[content.length - 1], messageText = typeof content === "string" ? content.trim() : lastBlock && isTextBlock2(lastBlock) ? lastBlock.text.trim() : "";
  if (messageText.indexOf(`<${LOCAL_COMMAND_STDOUT_TAG}>`) !== -1 || messageText.indexOf(`<${LOCAL_COMMAND_STDERR_TAG}>`) !== -1 || messageText.indexOf(`<${BASH_STDOUT_TAG}>`) !== -1 || messageText.indexOf(`<${BASH_STDERR_TAG}>`) !== -1 || messageText.indexOf(`<${TASK_NOTIFICATION_TAG}>`) !== -1 || messageText.indexOf(`<${TICK_TAG}>`) !== -1 || messageText.indexOf(`<${TEAMMATE_MESSAGE_TAG}`) !== -1)
    return !1;
  return !0;
}
