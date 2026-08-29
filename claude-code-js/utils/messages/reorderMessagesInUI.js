// function: reorderMessagesInUI
function reorderMessagesInUI(messages, syntheticStreamingToolUseMessages) {
  let toolUseGroups = /* @__PURE__ */ new Map;
  for (let message of messages) {
    if (isToolUseRequestMessage(message)) {
      let toolUseID = message.message.content[0]?.id;
      if (toolUseID) {
        if (!toolUseGroups.has(toolUseID))
          toolUseGroups.set(toolUseID, {
            toolUse: null,
            preHooks: [],
            toolResult: null,
            postHooks: []
          });
        toolUseGroups.get(toolUseID).toolUse = message;
      }
      continue;
    }
    if (isHookAttachmentMessage(message) && message.attachment.hookEvent === "PreToolUse") {
      let toolUseID = message.attachment.toolUseID;
      if (!toolUseGroups.has(toolUseID))
        toolUseGroups.set(toolUseID, {
          toolUse: null,
          preHooks: [],
          toolResult: null,
          postHooks: []
        });
      toolUseGroups.get(toolUseID).preHooks.push(message);
      continue;
    }
    if (message.type === "user" && message.message.content[0]?.type === "tool_result") {
      let toolUseID = message.message.content[0].tool_use_id;
      if (!toolUseGroups.has(toolUseID))
        toolUseGroups.set(toolUseID, {
          toolUse: null,
          preHooks: [],
          toolResult: null,
          postHooks: []
        });
      toolUseGroups.get(toolUseID).toolResult = message;
      continue;
    }
    if (isHookAttachmentMessage(message) && message.attachment.hookEvent === "PostToolUse") {
      let toolUseID = message.attachment.toolUseID;
      if (!toolUseGroups.has(toolUseID))
        toolUseGroups.set(toolUseID, {
          toolUse: null,
          preHooks: [],
          toolResult: null,
          postHooks: []
        });
      toolUseGroups.get(toolUseID).postHooks.push(message);
      continue;
    }
  }
  let result = [], processedToolUses = /* @__PURE__ */ new Set;
  for (let message of messages) {
    if (isToolUseRequestMessage(message)) {
      let toolUseID = message.message.content[0]?.id;
      if (toolUseID && !processedToolUses.has(toolUseID)) {
        processedToolUses.add(toolUseID);
        let group = toolUseGroups.get(toolUseID);
        if (group && group.toolUse) {
          if (result.push(group.toolUse), result.push(...group.preHooks), group.toolResult)
            result.push(group.toolResult);
          result.push(...group.postHooks);
        }
      }
      continue;
    }
    if (isHookAttachmentMessage(message) && (message.attachment.hookEvent === "PreToolUse" || message.attachment.hookEvent === "PostToolUse"))
      continue;
    if (message.type === "user" && message.message.content[0]?.type === "tool_result")
      continue;
    if (message.type === "system" && message.subtype === "api_error") {
      let last3 = result.at(-1);
      if (last3?.type === "system" && last3.subtype === "api_error")
        result[result.length - 1] = message;
      else
        result.push(message);
      continue;
    }
    result.push(message);
  }
  for (let message of syntheticStreamingToolUseMessages)
    result.push(message);
  let last2 = result.at(-1);
  return result.filter((_) => _.type !== "system" || _.subtype !== "api_error" || _ === last2);
}
