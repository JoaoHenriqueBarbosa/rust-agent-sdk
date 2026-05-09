// Original: src/utils/groupToolUses.ts
function getToolsWithGrouping(tools) {
  let cached3 = GROUPING_CACHE.get(tools);
  if (!cached3)
    cached3 = new Set(tools.filter((t2) => t2.renderGroupedToolUse).map((t2) => t2.name)), GROUPING_CACHE.set(tools, cached3);
  return cached3;
}
function getToolUseInfo(msg) {
  if (msg.type === "assistant" && msg.message.content[0]?.type === "tool_use") {
    let content = msg.message.content[0];
    return {
      messageId: msg.message.id,
      toolUseId: content.id,
      toolName: content.name
    };
  }
  return null;
}
function applyGrouping(messages, tools, verbose = !1) {
  if (verbose)
    return {
      messages
    };
  let toolsWithGrouping = getToolsWithGrouping(tools), groups = /* @__PURE__ */ new Map;
  for (let msg of messages) {
    let info = getToolUseInfo(msg);
    if (info && toolsWithGrouping.has(info.toolName)) {
      let key3 = `${info.messageId}:${info.toolName}`, group = groups.get(key3) ?? [];
      group.push(msg), groups.set(key3, group);
    }
  }
  let validGroups = /* @__PURE__ */ new Map, groupedToolUseIds = /* @__PURE__ */ new Set;
  for (let [key3, group] of groups)
    if (group.length >= 2) {
      validGroups.set(key3, group);
      for (let msg of group) {
        let info = getToolUseInfo(msg);
        if (info)
          groupedToolUseIds.add(info.toolUseId);
      }
    }
  let resultsByToolUseId = /* @__PURE__ */ new Map;
  for (let msg of messages)
    if (msg.type === "user") {
      for (let content of msg.message.content)
        if (content.type === "tool_result" && groupedToolUseIds.has(content.tool_use_id))
          resultsByToolUseId.set(content.tool_use_id, msg);
    }
  let result = [], emittedGroups = /* @__PURE__ */ new Set;
  for (let msg of messages) {
    let info = getToolUseInfo(msg);
    if (info) {
      let key3 = `${info.messageId}:${info.toolName}`, group = validGroups.get(key3);
      if (group) {
        if (!emittedGroups.has(key3)) {
          emittedGroups.add(key3);
          let firstMsg = group[0], results = [];
          for (let assistantMsg of group) {
            let toolUseId = assistantMsg.message.content[0].id, resultMsg = resultsByToolUseId.get(toolUseId);
            if (resultMsg)
              results.push(resultMsg);
          }
          let groupedMessage = {
            type: "grouped_tool_use",
            toolName: info.toolName,
            messages: group,
            results,
            displayMessage: firstMsg,
            uuid: `grouped-${firstMsg.uuid}`,
            timestamp: firstMsg.timestamp,
            messageId: info.messageId
          };
          result.push(groupedMessage);
        }
        continue;
      }
    }
    if (msg.type === "user") {
      let toolResults = msg.message.content.filter((c3) => c3.type === "tool_result");
      if (toolResults.length > 0) {
        if (toolResults.every((tr) => groupedToolUseIds.has(tr.tool_use_id)))
          continue;
      }
    }
    result.push(msg);
  }
  return { messages: result };
}
var GROUPING_CACHE;
var init_groupToolUses = __esm(() => {
  GROUPING_CACHE = /* @__PURE__ */ new WeakMap;
});
