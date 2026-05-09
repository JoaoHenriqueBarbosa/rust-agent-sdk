// function: buildMessageLookups
function buildMessageLookups(normalizedMessages, messages) {
  let toolUseIDsByMessageID = /* @__PURE__ */ new Map, toolUseIDToMessageID = /* @__PURE__ */ new Map, toolUseByToolUseID = /* @__PURE__ */ new Map;
  for (let msg of messages)
    if (msg.type === "assistant") {
      let id = msg.message.id, toolUseIDs = toolUseIDsByMessageID.get(id);
      if (!toolUseIDs)
        toolUseIDs = /* @__PURE__ */ new Set, toolUseIDsByMessageID.set(id, toolUseIDs);
      for (let content of msg.message.content)
        if (content.type === "tool_use")
          toolUseIDs.add(content.id), toolUseIDToMessageID.set(content.id, id), toolUseByToolUseID.set(content.id, content);
    }
  let siblingToolUseIDs = /* @__PURE__ */ new Map;
  for (let [toolUseID, messageID] of toolUseIDToMessageID)
    siblingToolUseIDs.set(toolUseID, toolUseIDsByMessageID.get(messageID));
  let progressMessagesByToolUseID = /* @__PURE__ */ new Map, inProgressHookCounts = /* @__PURE__ */ new Map, resolvedHookNames = /* @__PURE__ */ new Map, toolResultByToolUseID = /* @__PURE__ */ new Map, resolvedToolUseIDs = /* @__PURE__ */ new Set, erroredToolUseIDs = /* @__PURE__ */ new Set;
  for (let msg of normalizedMessages) {
    if (msg.type === "progress") {
      let toolUseID = msg.parentToolUseID, existing = progressMessagesByToolUseID.get(toolUseID);
      if (existing)
        existing.push(msg);
      else
        progressMessagesByToolUseID.set(toolUseID, [msg]);
      if (msg.data.type === "hook_progress") {
        let hookEvent = msg.data.hookEvent, byHookEvent = inProgressHookCounts.get(toolUseID);
        if (!byHookEvent)
          byHookEvent = /* @__PURE__ */ new Map, inProgressHookCounts.set(toolUseID, byHookEvent);
        byHookEvent.set(hookEvent, (byHookEvent.get(hookEvent) ?? 0) + 1);
      }
    }
    if (msg.type === "user") {
      for (let content of msg.message.content)
        if (content.type === "tool_result") {
          if (toolResultByToolUseID.set(content.tool_use_id, msg), resolvedToolUseIDs.add(content.tool_use_id), content.is_error)
            erroredToolUseIDs.add(content.tool_use_id);
        }
    }
    if (msg.type === "assistant")
      for (let content of msg.message.content) {
        if ("tool_use_id" in content && typeof content.tool_use_id === "string")
          resolvedToolUseIDs.add(content.tool_use_id);
        if (content.type === "advisor_tool_result") {
          let result = content;
          if (result.content.type === "advisor_tool_result_error")
            erroredToolUseIDs.add(result.tool_use_id);
        }
      }
    if (isHookAttachmentMessage(msg)) {
      let toolUseID = msg.attachment.toolUseID, hookEvent = msg.attachment.hookEvent, hookName = msg.attachment.hookName;
      if (hookName !== void 0) {
        let byHookEvent = resolvedHookNames.get(toolUseID);
        if (!byHookEvent)
          byHookEvent = /* @__PURE__ */ new Map, resolvedHookNames.set(toolUseID, byHookEvent);
        let names = byHookEvent.get(hookEvent);
        if (!names)
          names = /* @__PURE__ */ new Set, byHookEvent.set(hookEvent, names);
        names.add(hookName);
      }
    }
  }
  let resolvedHookCounts = /* @__PURE__ */ new Map;
  for (let [toolUseID, byHookEvent] of resolvedHookNames) {
    let countMap = /* @__PURE__ */ new Map;
    for (let [hookEvent, names] of byHookEvent)
      countMap.set(hookEvent, names.size);
    resolvedHookCounts.set(toolUseID, countMap);
  }
  let lastMsg = messages.at(-1), lastAssistantMsgId = lastMsg?.type === "assistant" ? lastMsg.message.id : void 0;
  for (let msg of normalizedMessages) {
    if (msg.type !== "assistant")
      continue;
    if (msg.message.id === lastAssistantMsgId)
      continue;
    for (let content of msg.message.content)
      if ((content.type === "server_tool_use" || content.type === "mcp_tool_use") && !resolvedToolUseIDs.has(content.id)) {
        let id = content.id;
        resolvedToolUseIDs.add(id), erroredToolUseIDs.add(id);
      }
  }
  return {
    siblingToolUseIDs,
    progressMessagesByToolUseID,
    inProgressHookCounts,
    resolvedHookCounts,
    toolResultByToolUseID,
    toolUseByToolUseID,
    normalizedMessageCount: normalizedMessages.length,
    resolvedToolUseIDs,
    erroredToolUseIDs
  };
}
