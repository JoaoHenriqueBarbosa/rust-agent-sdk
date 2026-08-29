// function: messagesAfterAreOnlySynthetic
function messagesAfterAreOnlySynthetic(messages, fromIndex) {
  for (let i5 = fromIndex + 1;i5 < messages.length; i5++) {
    let msg = messages[i5];
    if (!msg)
      continue;
    if (isSyntheticMessage(msg))
      continue;
    if (isToolUseResultMessage(msg))
      continue;
    if (msg.type === "progress")
      continue;
    if (msg.type === "system")
      continue;
    if (msg.type === "attachment")
      continue;
    if (msg.type === "user" && msg.isMeta)
      continue;
    if (msg.type === "assistant") {
      let content = msg.message.content;
      if (Array.isArray(content)) {
        if (content.some((block2) => block2.type === "text" && block2.text.trim() || block2.type === "tool_use"))
          return !1;
      }
      continue;
    }
    if (msg.type === "user")
      return !1;
  }
  return !0;
}
