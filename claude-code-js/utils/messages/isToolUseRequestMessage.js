// function: isToolUseRequestMessage
function isToolUseRequestMessage(message) {
  return message.type === "assistant" && message.message.content.some((_) => _.type === "tool_use");
}
