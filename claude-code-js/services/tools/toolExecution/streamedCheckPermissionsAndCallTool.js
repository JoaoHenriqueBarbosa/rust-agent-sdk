// function: streamedCheckPermissionsAndCallTool
function streamedCheckPermissionsAndCallTool(tool, toolUseID, input, toolUseContext, canUseTool, assistantMessage, messageId, requestId, mcpServerType, mcpServerBaseUrl) {
  let stream10 = new Stream4;
  return checkPermissionsAndCallTool(tool, toolUseID, input, toolUseContext, canUseTool, assistantMessage, messageId, requestId, mcpServerType, mcpServerBaseUrl, (progress) => {
    logEvent("tengu_tool_use_progress", {
      messageID: messageId,
      toolName: sanitizeToolNameForAnalytics(tool.name),
      isMcp: tool.isMcp ?? !1,
      queryChainId: toolUseContext.queryTracking?.chainId,
      queryDepth: toolUseContext.queryTracking?.depth,
      ...mcpServerType && {
        mcpServerType
      },
      ...mcpServerBaseUrl && {
        mcpServerBaseUrl
      },
      ...requestId && {
        requestId
      },
      ...mcpToolDetailsForAnalytics(tool.name, mcpServerType, mcpServerBaseUrl)
    }), stream10.enqueue({
      message: createProgressMessage({
        toolUseID: progress.toolUseID,
        parentToolUseID: toolUseID,
        data: progress.data
      })
    });
  }).then((results) => {
    for (let result of results)
      stream10.enqueue(result);
  }).catch((error44) => {
    stream10.error(error44);
  }).finally(() => {
    stream10.done();
  }), stream10;
}
