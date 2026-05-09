// function: filterWhitespaceOnlyAssistantMessages
function filterWhitespaceOnlyAssistantMessages(messages) {
  let hasChanges = !1, filtered = messages.filter((message) => {
    if (message.type !== "assistant")
      return !0;
    let content = message.message.content;
    if (!Array.isArray(content) || content.length === 0)
      return !0;
    if (hasOnlyWhitespaceTextContent(content))
      return hasChanges = !0, logEvent("tengu_filtered_whitespace_only_assistant", {
        messageUUID: message.uuid
      }), !1;
    return !0;
  });
  if (!hasChanges)
    return messages;
  let merged = [];
  for (let message of filtered) {
    let prev = merged.at(-1);
    if (message.type === "user" && prev?.type === "user")
      merged[merged.length - 1] = mergeUserMessages(prev, message);
    else
      merged.push(message);
  }
  return merged;
}
