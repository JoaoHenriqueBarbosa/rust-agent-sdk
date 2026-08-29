// function: buildSubagentLookups
function buildSubagentLookups(messages) {
  let toolUseByToolUseID = /* @__PURE__ */ new Map, resolvedToolUseIDs = /* @__PURE__ */ new Set, toolResultByToolUseID = /* @__PURE__ */ new Map;
  for (let { message: msg } of messages)
    if (msg.type === "assistant") {
      for (let content of msg.message.content)
        if (content.type === "tool_use")
          toolUseByToolUseID.set(content.id, content);
    } else if (msg.type === "user") {
      for (let content of msg.message.content)
        if (content.type === "tool_result")
          resolvedToolUseIDs.add(content.tool_use_id), toolResultByToolUseID.set(content.tool_use_id, msg);
    }
  let inProgressToolUseIDs = /* @__PURE__ */ new Set;
  for (let id of toolUseByToolUseID.keys())
    if (!resolvedToolUseIDs.has(id))
      inProgressToolUseIDs.add(id);
  return {
    lookups: {
      ...EMPTY_LOOKUPS,
      toolUseByToolUseID,
      resolvedToolUseIDs,
      toolResultByToolUseID
    },
    inProgressToolUseIDs
  };
}
