// function: extractToolUseId
function extractToolUseId(message) {
  if (message.message.content[0]?.type !== "tool_use")
    return;
  return message.message.content[0].id;
}
