// Original: src/tools/utils.ts
function tagMessagesWithToolUseID(messages, toolUseID) {
  if (!toolUseID)
    return messages;
  return messages.map((m4) => {
    if (m4.type === "user")
      return { ...m4, sourceToolUseID: toolUseID };
    return m4;
  });
}
function getToolUseIDFromParentMessage(parentMessage, toolName) {
  let toolUseBlock = parentMessage.message.content.find((block2) => block2.type === "tool_use" && block2.name === toolName);
  return toolUseBlock && toolUseBlock.type === "tool_use" ? toolUseBlock.id : void 0;
}
