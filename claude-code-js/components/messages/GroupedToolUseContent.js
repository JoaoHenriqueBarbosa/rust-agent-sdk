// Original: src/components/messages/GroupedToolUseContent.tsx
function GroupedToolUseContent({
  message,
  tools,
  lookups,
  inProgressToolUseIDs,
  shouldAnimate
}) {
  let tool = findToolByName(tools, message.toolName);
  if (!tool?.renderGroupedToolUse)
    return null;
  let resultsByToolUseId = /* @__PURE__ */ new Map;
  for (let resultMsg of message.results)
    for (let content of resultMsg.message.content)
      if (content.type === "tool_result")
        resultsByToolUseId.set(content.tool_use_id, {
          param: content,
          output: resultMsg.toolUseResult
        });
  let toolUsesData = message.messages.map((msg) => {
    let content = msg.message.content[0], result = resultsByToolUseId.get(content.id);
    return {
      param: content,
      isResolved: lookups.resolvedToolUseIDs.has(content.id),
      isError: lookups.erroredToolUseIDs.has(content.id),
      isInProgress: inProgressToolUseIDs.has(content.id),
      progressMessages: filterToolProgressMessages(lookups.progressMessagesByToolUseID.get(content.id) ?? []),
      result
    };
  }), anyInProgress = toolUsesData.some((d) => d.isInProgress);
  return tool.renderGroupedToolUse(toolUsesData, {
    shouldAnimate: shouldAnimate && anyInProgress,
    tools
  });
}
var init_GroupedToolUseContent = __esm(() => {
  init_Tool();
});
