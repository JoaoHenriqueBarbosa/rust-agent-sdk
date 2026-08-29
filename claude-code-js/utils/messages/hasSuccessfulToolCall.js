// function: hasSuccessfulToolCall
function hasSuccessfulToolCall(messages, toolName) {
  let mostRecentToolUseId;
  for (let i5 = messages.length - 1;i5 >= 0; i5--) {
    let msg = messages[i5];
    if (!msg)
      continue;
    if (msg.type === "assistant" && Array.isArray(msg.message.content)) {
      let toolUse = msg.message.content.find((block2) => block2.type === "tool_use" && block2.name === toolName);
      if (toolUse) {
        mostRecentToolUseId = toolUse.id;
        break;
      }
    }
  }
  if (!mostRecentToolUseId)
    return !1;
  for (let i5 = messages.length - 1;i5 >= 0; i5--) {
    let msg = messages[i5];
    if (!msg)
      continue;
    if (msg.type === "user" && Array.isArray(msg.message.content)) {
      let toolResult = msg.message.content.find((block2) => block2.type === "tool_result" && block2.tool_use_id === mostRecentToolUseId);
      if (toolResult)
        return toolResult.is_error !== !0;
    }
  }
  return !1;
}
