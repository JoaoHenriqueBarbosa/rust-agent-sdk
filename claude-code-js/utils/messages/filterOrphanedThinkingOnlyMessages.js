// function: filterOrphanedThinkingOnlyMessages
function filterOrphanedThinkingOnlyMessages(messages) {
  let messageIdsWithNonThinkingContent = /* @__PURE__ */ new Set;
  for (let msg of messages) {
    if (msg.type !== "assistant")
      continue;
    let content = msg.message.content;
    if (!Array.isArray(content))
      continue;
    if (content.some((block2) => block2.type !== "thinking" && block2.type !== "redacted_thinking") && msg.message.id)
      messageIdsWithNonThinkingContent.add(msg.message.id);
  }
  return messages.filter((msg) => {
    if (msg.type !== "assistant")
      return !0;
    let content = msg.message.content;
    if (!Array.isArray(content) || content.length === 0)
      return !0;
    if (!content.every((block2) => block2.type === "thinking" || block2.type === "redacted_thinking"))
      return !0;
    if (msg.message.id && messageIdsWithNonThinkingContent.has(msg.message.id))
      return !0;
    return logEvent("tengu_filtered_orphaned_thinking_message", {
      messageUUID: msg.uuid,
      messageId: msg.message.id,
      blockCount: content.length
    }), !1;
  });
}
