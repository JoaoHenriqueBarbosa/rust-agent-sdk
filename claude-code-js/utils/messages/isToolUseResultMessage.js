// function: isToolUseResultMessage
function isToolUseResultMessage(message) {
  return message.type === "user" && (Array.isArray(message.message.content) && message.message.content[0]?.type === "tool_result" || Boolean(message.toolUseResult));
}
