// function: isThinkingMessage
function isThinkingMessage(message) {
  if (message.type !== "assistant")
    return !1;
  if (!Array.isArray(message.message.content))
    return !1;
  return message.message.content.every((block2) => block2.type === "thinking" || block2.type === "redacted_thinking");
}
