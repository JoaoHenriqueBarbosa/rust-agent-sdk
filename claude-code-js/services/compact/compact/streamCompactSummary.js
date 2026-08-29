// function: streamCompactSummary
async function streamCompactSummary({
  messages,
  summaryRequest,
  appState,
  context: context6,
  preCompactTokenCount,
  cacheSafeParams
}) {
  let activityInterval = isSessionActivityTrackingActive() ? setInterval((statusSetter) => {
    sendSessionActivitySignal(), statusSetter?.("compacting");
  }, 30000, context6.setSDKStatus) : void 0;
  try {
    try {
      let result = await runForkedAgent({
        promptMessages: [summaryRequest],
        cacheSafeParams,
        canUseTool: createCompactCanUseTool(),
        querySource: "compact",
        forkLabel: "compact",
        maxTurns: 1,
        skipCacheWrite: !0,
        overrides: { abortController: context6.abortController }
      }), assistantMsg = getLastAssistantMessage(result.messages), assistantText = assistantMsg ? getAssistantMessageText(assistantMsg) : null;
      if (assistantMsg && assistantText && !assistantMsg.isApiErrorMessage) {
        if (!assistantText.startsWith(PROMPT_TOO_LONG_ERROR_MESSAGE))
          logEvent("tengu_compact_cache_sharing_success", {
            preCompactTokenCount,
            outputTokens: result.totalUsage.output_tokens,
            cacheReadInputTokens: result.totalUsage.cache_read_input_tokens,
            cacheCreationInputTokens: result.totalUsage.cache_creation_input_tokens,
            cacheHitRate: result.totalUsage.cache_read_input_tokens > 0 ? result.totalUsage.cache_read_input_tokens / (result.totalUsage.cache_read_input_tokens + result.totalUsage.cache_creation_input_tokens + result.totalUsage.input_tokens) : 0
          });
        return assistantMsg;
      }
      logForDebugging(`Compact cache sharing: no text in response, falling back. Response: ${jsonStringify(assistantMsg)}`, { level: "warn" }), logEvent("tengu_compact_cache_sharing_fallback", {
        reason: "no_text_response",
        preCompactTokenCount
      });
    } catch (error44) {
      logError2(error44), logEvent("tengu_compact_cache_sharing_fallback", {
        reason: "error",
        preCompactTokenCount
      });
    }
    let retryEnabled = !1, maxAttempts = retryEnabled ? MAX_COMPACT_STREAMING_RETRIES : 1;
    for (let attempt = 1;attempt <= maxAttempts; attempt++) {
      let hasStartedStreaming = !1, response7;
      context6.setResponseLength?.(() => 0);
      let tools = await isToolSearchEnabled(context6.options.mainLoopModel, context6.options.tools, async () => appState.toolPermissionContext, context6.options.agentDefinitions.activeAgents, "compact") ? uniqBy_default([
        FileReadTool,
        ToolSearchTool,
        ...context6.options.tools.filter((t2) => t2.isMcp)
      ], "name") : [FileReadTool], streamIter = queryModelWithStreaming({
        messages: normalizeMessagesForAPI(stripImagesFromMessages(stripReinjectedAttachments([
          ...getMessagesAfterCompactBoundary(messages),
          summaryRequest
        ])), context6.options.tools),
        systemPrompt: asSystemPrompt([
          "You are a helpful AI assistant tasked with summarizing conversations."
        ]),
        thinkingConfig: { type: "disabled" },
        tools,
        signal: context6.abortController.signal,
        options: {
          async getToolPermissionContext() {
            return context6.getAppState().toolPermissionContext;
          },
          model: context6.options.mainLoopModel,
          toolChoice: void 0,
          isNonInteractiveSession: context6.options.isNonInteractiveSession,
          hasAppendSystemPrompt: !!context6.options.appendSystemPrompt,
          maxOutputTokensOverride: Math.min(COMPACT_MAX_OUTPUT_TOKENS, getMaxOutputTokensForModel(context6.options.mainLoopModel)),
          querySource: "compact",
          agents: context6.options.agentDefinitions.activeAgents,
          mcpTools: [],
          effortValue: appState.effortValue
        }
      })[Symbol.asyncIterator](), next2 = await streamIter.next();
      while (!next2.done) {
        let event = next2.value;
        if (!hasStartedStreaming && event.type === "stream_event" && event.event.type === "content_block_start" && event.event.content_block.type === "text")
          hasStartedStreaming = !0, context6.setStreamMode?.("responding");
        if (event.type === "stream_event" && event.event.type === "content_block_delta" && event.event.delta.type === "text_delta") {
          let charactersStreamed = event.event.delta.text.length;
          context6.setResponseLength?.((length) => length + charactersStreamed);
        }
        if (event.type === "assistant")
          response7 = event;
        next2 = await streamIter.next();
      }
      if (response7)
        return response7;
      if (attempt < maxAttempts) {
        logEvent("tengu_compact_streaming_retry", {
          attempt,
          preCompactTokenCount,
          hasStartedStreaming
        }), await sleep3(getRetryDelay(attempt), context6.abortController.signal, {
          abortError: () => new APIUserAbortError
        });
        continue;
      }
      throw logForDebugging(`Compact streaming failed after ${attempt} attempts. hasStartedStreaming=${hasStartedStreaming}`, { level: "error" }), logEvent("tengu_compact_failed", {
        reason: "no_streaming_response",
        preCompactTokenCount,
        hasStartedStreaming,
        retryEnabled,
        attempts: attempt,
        promptCacheSharingEnabled: !0
      }), Error(ERROR_MESSAGE_INCOMPLETE_RESPONSE);
    }
    throw Error(ERROR_MESSAGE_INCOMPLETE_RESPONSE);
  } finally {
    clearInterval(activityInterval);
  }
}
