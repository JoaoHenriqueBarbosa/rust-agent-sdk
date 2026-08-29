// function: extractLastToolInfo
function extractLastToolInfo(progressMessages, tools) {
  let toolUseByID = /* @__PURE__ */ new Map;
  for (let pm of progressMessages) {
    if (!hasProgressMessage(pm.data))
      continue;
    if (pm.data.message.type === "assistant") {
      for (let c3 of pm.data.message.message.content)
        if (c3.type === "tool_use")
          toolUseByID.set(c3.id, c3);
    }
  }
  let searchCount = 0, readCount = 0;
  for (let i5 = progressMessages.length - 1;i5 >= 0; i5--) {
    let msg = progressMessages[i5];
    if (!hasProgressMessage(msg.data))
      continue;
    let info = getSearchOrReadInfo(msg, tools, toolUseByID);
    if (info && (info.isSearch || info.isRead)) {
      if (msg.data.message.type === "user") {
        if (info.isSearch)
          searchCount++;
        else if (info.isRead)
          readCount++;
      }
    } else
      break;
  }
  if (searchCount + readCount >= 2)
    return getSearchReadSummaryText(searchCount, readCount, !0);
  let lastToolResult = progressMessages.findLast((msg) => {
    if (!hasProgressMessage(msg.data))
      return !1;
    let message = msg.data.message;
    return message.type === "user" && message.message.content.some((c3) => c3.type === "tool_result");
  });
  if (lastToolResult?.data.message.type === "user") {
    let toolResultBlock = lastToolResult.data.message.message.content.find((c3) => c3.type === "tool_result");
    if (toolResultBlock?.type === "tool_result") {
      let toolUseBlock = toolUseByID.get(toolResultBlock.tool_use_id);
      if (toolUseBlock) {
        let tool = findToolByName(tools, toolUseBlock.name);
        if (!tool)
          return toolUseBlock.name;
        let input = toolUseBlock.input, parsedInput = tool.inputSchema.safeParse(input), userFacingToolName = tool.userFacingName(parsedInput.success ? parsedInput.data : void 0);
        if (tool.getToolUseSummary) {
          let summary = tool.getToolUseSummary(parsedInput.success ? parsedInput.data : void 0);
          if (summary)
            return `${userFacingToolName}: ${summary}`;
        }
        return userFacingToolName;
      }
    }
  }
  return null;
}
