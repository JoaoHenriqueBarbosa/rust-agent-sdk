// Shared module state and imports
// Original: src/services/tools/toolExecution.ts
async function* runToolUse(toolUse, assistantMessage, canUseTool, toolUseContext) {
  let toolName = toolUse.name, tool = findToolByName(toolUseContext.options.tools, toolName);
  if (!tool) {
    let fallbackTool = findToolByName(getAllBaseTools(), toolName);
    if (fallbackTool && fallbackTool.aliases?.includes(toolName))
      tool = fallbackTool;
  }
  let messageId = assistantMessage.message.id, requestId = assistantMessage.requestId, mcpServerType = getMcpServerType(toolName, toolUseContext.options.mcpClients), mcpServerBaseUrl = getMcpServerBaseUrlFromToolName(toolName, toolUseContext.options.mcpClients);
  if (!tool) {
    let sanitizedToolName = sanitizeToolNameForAnalytics(toolName);
    logForDebugging(`Unknown tool ${toolName}: ${toolUse.id}`), logEvent("tengu_tool_use_error", {
      error: `No such tool available: ${sanitizedToolName}`,
      toolName: sanitizedToolName,
      toolUseID: toolUse.id,
      isMcp: toolName.startsWith("mcp__"),
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
      ...mcpToolDetailsForAnalytics(toolName, mcpServerType, mcpServerBaseUrl)
    }), yield {
      message: createUserMessage({
        content: [
          {
            type: "tool_result",
            content: `<tool_use_error>Error: No such tool available: ${toolName}</tool_use_error>`,
            is_error: !0,
            tool_use_id: toolUse.id
          }
        ],
        toolUseResult: `Error: No such tool available: ${toolName}`,
        sourceToolAssistantUUID: assistantMessage.uuid
      })
    };
    return;
  }
  let toolInput = toolUse.input;
  try {
    if (toolUseContext.abortController.signal.aborted) {
      logEvent("tengu_tool_use_cancelled", {
        toolName: sanitizeToolNameForAnalytics(tool.name),
        toolUseID: toolUse.id,
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
      });
      let content = createToolResultStopMessage(toolUse.id);
      content.content = withMemoryCorrectionHint(CANCEL_MESSAGE), yield {
        message: createUserMessage({
          content: [content],
          toolUseResult: CANCEL_MESSAGE,
          sourceToolAssistantUUID: assistantMessage.uuid
        })
      };
      return;
    }
    for await (let update2 of streamedCheckPermissionsAndCallTool(tool, toolUse.id, toolInput, toolUseContext, canUseTool, assistantMessage, messageId, requestId, mcpServerType, mcpServerBaseUrl))
      yield update2;
  } catch (error44) {
    logError2(error44);
    let errorMessage2 = error44 instanceof Error ? error44.message : String(error44), detailedError = `Error calling tool${tool ? ` (${tool.name})` : ""}: ${errorMessage2}`;
    yield {
      message: createUserMessage({
        content: [
          {
            type: "tool_result",
            content: `<tool_use_error>${detailedError}</tool_use_error>`,
            is_error: !0,
            tool_use_id: toolUse.id
          }
        ],
        toolUseResult: detailedError,
        sourceToolAssistantUUID: assistantMessage.uuid
      })
    };
  }
}

