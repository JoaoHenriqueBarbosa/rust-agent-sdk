// function: getToolUseIDs
function getToolUseIDs(normalizedMessages) {
  return new Set(normalizedMessages.filter((_) => _.type === "assistant" && Array.isArray(_.message.content) && _.message.content[0]?.type === "tool_use").map((_) => _.message.content[0].id));
}
