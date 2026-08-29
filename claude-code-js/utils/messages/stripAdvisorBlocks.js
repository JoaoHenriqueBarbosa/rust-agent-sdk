// function: stripAdvisorBlocks
function stripAdvisorBlocks(messages) {
  let changed = !1, result = messages.map((msg) => {
    if (msg.type !== "assistant")
      return msg;
    let content = msg.message.content, filtered = content.filter((b) => !isAdvisorBlock(b));
    if (filtered.length === content.length)
      return msg;
    if (changed = !0, filtered.length === 0 || filtered.every((b) => b.type === "thinking" || b.type === "redacted_thinking" || b.type === "text" && (!b.text || !b.text.trim())))
      filtered.push({
        type: "text",
        text: "[Advisor response]",
        citations: []
      });
    return { ...msg, message: { ...msg.message, content: filtered } };
  });
  return changed ? result : messages;
}
