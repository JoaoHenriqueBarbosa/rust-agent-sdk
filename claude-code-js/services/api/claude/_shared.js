// Shared module state and imports
// Original: src/services/api/claude.ts
import { randomUUID as randomUUID30 } from "crypto";
async function* queryModelWithStreaming({
  messages,
  systemPrompt,
  thinkingConfig,
  tools,
  signal,
  options: options2
}) {
  return yield* withStreamingVCR(messages, async function* () {
    yield* queryModel(messages, systemPrompt, thinkingConfig, tools, signal, options2);
  });
}
async function* executeNonStreamingRequest(clientOptions, retryOptions, paramsFromContext, onAttempt, captureRequest, originatingRequestId) {
  let fallbackTimeoutMs = getNonstreamingFallbackTimeoutMs(), generator = withRetry(() => getAnthropicClient({
    maxRetries: 0,
    model: clientOptions.model,
    fetchOverride: clientOptions.fetchOverride,
    source: clientOptions.source
  }), async (anthropic, attempt, context7) => {
    let start = Date.now(), retryParams = paramsFromContext(context7);
    captureRequest(retryParams), onAttempt(attempt, start, retryParams.max_tokens);
    let adjustedParams = adjustParamsForNonStreaming(retryParams, MAX_NON_STREAMING_TOKENS);
    try {
      return await anthropic.beta.messages.create({
        ...adjustedParams,
        model: normalizeModelStringForAPI(adjustedParams.model)
      }, {
        signal: retryOptions.signal,
        timeout: fallbackTimeoutMs
      });
    } catch (err2) {
      if (err2 instanceof APIUserAbortError)
        throw err2;
      throw logForDiagnosticsNoPII("error", "cli_nonstreaming_fallback_error"), logEvent("tengu_nonstreaming_fallback_error", {
        model: clientOptions.model,
        error: err2 instanceof Error ? err2.name : "unknown",
        attempt,
        timeout_ms: fallbackTimeoutMs,
        request_id: originatingRequestId ?? "unknown"
      }), err2;
    }
  }, {
    model: retryOptions.model,
    fallbackModel: retryOptions.fallbackModel,
    thinkingConfig: retryOptions.thinkingConfig,
    ...isFastModeEnabled() && { fastMode: retryOptions.fastMode },
    signal: retryOptions.signal,
    initialConsecutive529Errors: retryOptions.initialConsecutive529Errors,
    querySource: retryOptions.querySource
  }), e;
  do
    if (e = await generator.next(), !e.done && e.value.type === "system")
      yield e.value;
  while (!e.done);
  return e.value;
}
async function* queryModel(messages, systemPrompt, thinkingConfig, tools, signal, options2) {
  !isClaudeAISubscriber() && isNonCustomOpusModel(options2.model);
  let previousRequestId = getPreviousRequestIdFromMessages(messages), resolvedModel = getAPIProvider() === "bedrock" && options2.model.includes("application-inference-profile") ? await getInferenceProfileBackingModel(options2.model) ?? options2.model : options2.model;
  queryCheckpoint("query_tool_schema_build_start");
  let isAgenticQuery = options2.querySource.startsWith("repl_main_thread") || options2.querySource.startsWith("agent:") || options2.querySource === "sdk" || options2.querySource === "hook_agent" || options2.querySource === "verification_agent", betas = getMergedBetas(options2.model, { isAgenticQuery });
  if (isAdvisorEnabled())
    betas.push(ADVISOR_BETA_HEADER);
  let advisorModel;
  if (isAgenticQuery && isAdvisorEnabled()) {
    let advisorOption = options2.advisorModel, advisorExperiment = getExperimentAdvisorModels();
    if (advisorExperiment !== void 0) {
      if (normalizeModelStringForAPI(advisorExperiment.baseModel) === normalizeModelStringForAPI(options2.model))
        advisorOption = advisorExperiment.advisorModel;
    }
    if (advisorOption) {
      let normalizedAdvisorModel = normalizeModelStringForAPI(parseUserSpecifiedModel(advisorOption));
      if (!modelSupportsAdvisor(options2.model))
        logForDebugging(`[AdvisorTool] Skipping advisor - base model ${options2.model} does not support advisor`);
      else if (!isValidAdvisorModel(normalizedAdvisorModel))
        logForDebugging(`[AdvisorTool] Skipping advisor - ${normalizedAdvisorModel} is not a valid advisor model`);
      else
        advisorModel = normalizedAdvisorModel, logForDebugging(`[AdvisorTool] Server-side tool enabled with ${advisorModel} as the advisor model`);
    }
  }
  let useToolSearch = await isToolSearchEnabled(options2.model, tools, options2.getToolPermissionContext, options2.agents, "query"), deferredToolNames = /* @__PURE__ */ new Set;
  if (useToolSearch) {
    for (let t2 of tools)
      if (isDeferredTool(t2))
        deferredToolNames.add(t2.name);
  }
  if (useToolSearch && deferredToolNames.size === 0 && !options2.hasPendingMcpServers)
    logForDebugging("Tool search disabled: no deferred tools available to search"), useToolSearch = !1;
  let filteredTools;
  if (useToolSearch) {
    let discoveredToolNames = extractDiscoveredToolNames(messages);
    filteredTools = tools.filter((tool) => {
      if (!deferredToolNames.has(tool.name))
        return !0;
      if (toolMatchesName(tool, TOOL_SEARCH_TOOL_NAME))
        return !0;
      return discoveredToolNames.has(tool.name);
    });
  } else
    filteredTools = tools.filter((t2) => !toolMatchesName(t2, TOOL_SEARCH_TOOL_NAME));
  let toolSearchHeader = useToolSearch ? getToolSearchBetaHeader() : null;
  if (toolSearchHeader && getAPIProvider() !== "bedrock") {
    if (!betas.includes(toolSearchHeader))
      betas.push(toolSearchHeader);
  }
  let cachedMCEnabled = !1, cacheEditingBetaHeader = "", useGlobalCacheFeature = shouldUseGlobalCacheScope(), willDefer = (t2) => useToolSearch && (deferredToolNames.has(t2.name) || shouldDeferLspTool(t2)), needsToolBasedCacheMarker = useGlobalCacheFeature && filteredTools.some((t2) => t2.isMcp === !0 && !willDefer(t2));
  if (useGlobalCacheFeature && !betas.includes(PROMPT_CACHING_SCOPE_BETA_HEADER))
    betas.push(PROMPT_CACHING_SCOPE_BETA_HEADER);
  let globalCacheStrategy = useGlobalCacheFeature ? needsToolBasedCacheMarker ? "none" : "system_prompt" : "none", toolSchemas = await Promise.all(filteredTools.map((tool) => toolToAPISchema(tool, {
    getToolPermissionContext: options2.getToolPermissionContext,
    tools,
    agents: options2.agents,
    allowedAgentTypes: options2.allowedAgentTypes,
    model: options2.model,
    deferLoading: willDefer(tool)
  })));
  if (useToolSearch) {
    let includedDeferredTools = count2(filteredTools, (t2) => deferredToolNames.has(t2.name));
    logForDebugging(`Dynamic tool loading: ${includedDeferredTools}/${deferredToolNames.size} deferred tools included`);
  }
  queryCheckpoint("query_tool_schema_build_end"), logEvent("tengu_api_before_normalize", {
    preNormalizedMessageCount: messages.length
  }), queryCheckpoint("query_message_normalization_start");
  let messagesForAPI = normalizeMessagesForAPI(messages, filteredTools);
  if (queryCheckpoint("query_message_normalization_end"), !useToolSearch)
    messagesForAPI = messagesForAPI.map((msg) => {
      switch (msg.type) {
        case "user":
          return stripToolReferenceBlocksFromUserMessage(msg);
        case "assistant":
          return stripCallerFieldFromAssistantMessage(msg);
        default:
          return msg;
      }
    });
  if (messagesForAPI = ensureToolResultPairing(messagesForAPI), !betas.includes(ADVISOR_BETA_HEADER))
    messagesForAPI = stripAdvisorBlocks(messagesForAPI);
  messagesForAPI = stripExcessMediaItems(messagesForAPI, API_MAX_MEDIA_PER_REQUEST), logEvent("tengu_api_after_normalize", {
    postNormalizedMessageCount: messagesForAPI.length
  });
  let fingerprint = computeFingerprintFromMessages(messagesForAPI);
  if (useToolSearch && !isDeferredToolsDeltaEnabled()) {
    let deferredToolList = tools.filter((t2) => deferredToolNames.has(t2.name)).map(formatDeferredToolLine).sort().join(`
`);
    if (deferredToolList)
      messagesForAPI = [
        createUserMessage({
          content: `<available-deferred-tools>
${deferredToolList}
</available-deferred-tools>`,
          isMeta: !0
        }),
        ...messagesForAPI
      ];
  }
  let hasChromeTools = filteredTools.some((t2) => isToolFromMcpServer(t2.name, CLAUDE_IN_CHROME_MCP_SERVER_NAME)), injectChromeHere = useToolSearch && hasChromeTools && !isMcpInstructionsDeltaEnabled();
  systemPrompt = asSystemPrompt([
    getAttributionHeader(fingerprint),
    getCLISyspromptPrefix({
      isNonInteractive: options2.isNonInteractiveSession,
      hasAppendSystemPrompt: options2.hasAppendSystemPrompt
    }),
    ...systemPrompt,
    ...advisorModel ? [ADVISOR_TOOL_INSTRUCTIONS] : [],
    ...injectChromeHere ? [CHROME_TOOL_SEARCH_INSTRUCTIONS] : []
  ].filter(Boolean)), logAPIPrefix(systemPrompt);
  let enablePromptCaching = options2.enablePromptCaching ?? getPromptCachingEnabled(options2.model), system = buildSystemPromptBlocks(systemPrompt, enablePromptCaching, {
    skipGlobalCacheForSystemPrompt: needsToolBasedCacheMarker,
    querySource: options2.querySource
  }), useBetas = betas.length > 0, extraToolSchemas = [...options2.extraToolSchemas ?? []];
  if (advisorModel)
    extraToolSchemas.push({
      type: "advisor_20260301",
      name: "advisor",
      model: advisorModel
    });
  let allTools = [...toolSchemas, ...extraToolSchemas], isFastMode = isFastModeEnabled() && isFastModeAvailable() && !isFastModeCooldown() && isFastModeSupportedByModel(options2.model) && !!options2.fastMode, afkHeaderLatched = getAfkModeHeaderLatched() === !0, fastModeHeaderLatched = getFastModeHeaderLatched() === !0;
  if (!fastModeHeaderLatched && isFastMode)
    fastModeHeaderLatched = !0, setFastModeHeaderLatched(!0);
  let cacheEditingHeaderLatched = getCacheEditingHeaderLatched() === !0, thinkingClearLatched = getThinkingClearLatched() === !0;
  if (!thinkingClearLatched && isAgenticQuery) {
    let lastCompletion = getLastApiCompletionTimestamp();
    if (lastCompletion !== null && Date.now() - lastCompletion > CACHE_TTL_1HOUR_MS)
      thinkingClearLatched = !0, setThinkingClearLatched(!0);
  }
  let effort = resolveAppliedEffort(options2.model, options2.effortValue), newContext = isBetaTracingEnabled() ? {
    systemPrompt: systemPrompt.join(`

`),
    querySource: options2.querySource,
    tools: jsonStringify(allTools)
  } : void 0, llmSpan = startLLMRequestSpan(options2.model, newContext, messagesForAPI, isFastMode), startIncludingRetries = Date.now(), start = Date.now(), attemptNumber = 0, attemptStartTimes = [], stream10 = void 0, streamRequestId = void 0, clientRequestId = void 0, streamResponse = void 0;
  function releaseStreamResources() {
    if (cleanupStream(stream10), stream10 = void 0, streamResponse)
      streamResponse.body?.cancel().catch(() => {}), streamResponse = void 0;
  }
  let consumedCacheEdits = cachedMCEnabled ? consumePendingCacheEdits() : null, consumedPinnedEdits = cachedMCEnabled ? getPinnedCacheEdits() : [], lastRequestBetas, paramsFromContext = (retryContext) => {
    let betasParams = [...betas];
    if (!betasParams.includes(CONTEXT_1M_BETA_HEADER) && getSonnet1mExpTreatmentEnabled(retryContext.model))
      betasParams.push(CONTEXT_1M_BETA_HEADER);
    let bedrockBetas = getAPIProvider() === "bedrock" ? [
      ...getBedrockExtraBodyParamsBetas(retryContext.model),
      ...toolSearchHeader ? [toolSearchHeader] : []
    ] : [], extraBodyParams = getExtraBodyParams(bedrockBetas), outputConfig = {
      ...extraBodyParams.output_config ?? {}
    };
    if (configureEffortParams(effort, outputConfig, extraBodyParams, betasParams, options2.model), configureTaskBudgetParams(options2.taskBudget, outputConfig, betasParams), options2.outputFormat && !("format" in outputConfig)) {
      if (outputConfig.format = options2.outputFormat, modelSupportsStructuredOutputs(options2.model) && !betasParams.includes(STRUCTURED_OUTPUTS_BETA_HEADER))
        betasParams.push(STRUCTURED_OUTPUTS_BETA_HEADER);
    }
    let maxOutputTokens2 = retryContext?.maxTokensOverride || options2.maxOutputTokensOverride || getMaxOutputTokensForModel(options2.model), hasThinking = thinkingConfig.type !== "disabled" && !isEnvTruthy(process.env.CLAUDE_CODE_DISABLE_THINKING), thinking = void 0;
    if (hasThinking && modelSupportsThinking(options2.model))
      if (!isEnvTruthy(process.env.CLAUDE_CODE_DISABLE_ADAPTIVE_THINKING) && modelSupportsAdaptiveThinking(options2.model))
        thinking = {
          type: "adaptive"
        };
      else {
        let thinkingBudget = getMaxThinkingTokensForModel(options2.model);
        if (thinkingConfig.type === "enabled" && thinkingConfig.budgetTokens !== void 0)
          thinkingBudget = thinkingConfig.budgetTokens;
        thinkingBudget = Math.min(maxOutputTokens2 - 1, thinkingBudget), thinking = {
          budget_tokens: thinkingBudget,
          type: "enabled"
        };
      }
    let contextManagement = getAPIContextManagement({
      hasThinking,
      isRedactThinkingActive: betasParams.includes(REDACT_THINKING_BETA_HEADER),
      clearAllThinking: thinkingClearLatched
    }), enablePromptCaching2 = options2.enablePromptCaching ?? getPromptCachingEnabled(retryContext.model), speed;
    if (isFastModeEnabled() && isFastModeAvailable() && !isFastModeCooldown() && isFastModeSupportedByModel(options2.model) && !!retryContext.fastMode)
      speed = "fast";
    if (fastModeHeaderLatched && !betasParams.includes(FAST_MODE_BETA_HEADER))
      betasParams.push(FAST_MODE_BETA_HEADER);
    let useCachedMC = cachedMCEnabled && getAPIProvider() === "firstParty" && options2.querySource === "repl_main_thread";
    if (cacheEditingHeaderLatched && getAPIProvider() === "firstParty" && options2.querySource === "repl_main_thread" && !betasParams.includes(cacheEditingBetaHeader))
      betasParams.push(cacheEditingBetaHeader), logForDebugging("Cache editing beta header enabled for cached microcompact");
    let temperature = !hasThinking ? options2.temperatureOverride ?? 1 : void 0;
    return lastRequestBetas = betasParams, {
      model: normalizeModelStringForAPI(options2.model),
      messages: addCacheBreakpoints(messagesForAPI, enablePromptCaching2, options2.querySource, useCachedMC, consumedCacheEdits, consumedPinnedEdits, options2.skipCacheWrite),
      system,
      tools: allTools,
      tool_choice: options2.toolChoice,
      ...useBetas && { betas: betasParams },
      metadata: getAPIMetadata(),
      max_tokens: maxOutputTokens2,
      thinking,
      ...temperature !== void 0 && { temperature },
      ...contextManagement && useBetas && betasParams.includes(CONTEXT_MANAGEMENT_BETA_HEADER) && {
        context_management: contextManagement
      },
      ...extraBodyParams,
      ...Object.keys(outputConfig).length > 0 && {
        output_config: outputConfig
      },
      ...speed !== void 0 && { speed }
    };
  };
  {
    let queryParams = paramsFromContext({
      model: options2.model,
      thinkingConfig
    }), logMessagesLength = queryParams.messages.length, logBetas = useBetas ? queryParams.betas ?? [] : [], logThinkingType = queryParams.thinking?.type ?? "disabled", logEffortValue = queryParams.output_config?.effort;
    options2.getToolPermissionContext().then((permissionContext) => {
      logAPIQuery({
        model: options2.model,
        messagesLength: logMessagesLength,
        temperature: options2.temperatureOverride ?? 1,
        betas: logBetas,
        permissionMode: permissionContext.mode,
        querySource: options2.querySource,
        queryTracking: options2.queryTracking,
        thinkingType: logThinkingType,
        effortValue: logEffortValue,
        fastMode: isFastMode,
        previousRequestId
      });
    });
  }
  let newMessages = [], ttftMs = 0, partialMessage = void 0, contentBlocks = [], usage = EMPTY_USAGE, costUSD = 0, stopReason = null, didFallBackToNonStreaming = !1, fallbackMessage, maxOutputTokens = 0, responseHeaders = void 0, research = void 0, isFastModeRequest = isFastMode, isAdvisorInProgress = !1;
  try {
    let clearStreamIdleTimers = function() {
      if (streamIdleWarningTimer !== null)
        clearTimeout(streamIdleWarningTimer), streamIdleWarningTimer = null;
      if (streamIdleTimer !== null)
        clearTimeout(streamIdleTimer), streamIdleTimer = null;
    }, resetStreamIdleTimer = function() {
      if (clearStreamIdleTimers(), !streamWatchdogEnabled)
        return;
      streamIdleWarningTimer = setTimeout((warnMs) => {
        logForDebugging(`Streaming idle warning: no chunks received for ${warnMs / 1000}s`, { level: "warn" }), logForDiagnosticsNoPII("warn", "cli_streaming_idle_warning");
      }, STREAM_IDLE_WARNING_MS, STREAM_IDLE_WARNING_MS), streamIdleTimer = setTimeout(() => {
        streamIdleAborted = !0, streamWatchdogFiredAt = performance.now(), logForDebugging(`Streaming idle timeout: no chunks received for ${STREAM_IDLE_TIMEOUT_MS / 1000}s, aborting stream`, { level: "error" }), logForDiagnosticsNoPII("error", "cli_streaming_idle_timeout"), logEvent("tengu_streaming_idle_timeout", {
          model: options2.model,
          request_id: streamRequestId ?? "unknown",
          timeout_ms: STREAM_IDLE_TIMEOUT_MS
        }), releaseStreamResources();
      }, STREAM_IDLE_TIMEOUT_MS);
    };
    queryCheckpoint("query_client_creation_start");
    let generator = withRetry(() => getAnthropicClient({
      maxRetries: 0,
      model: options2.model,
      fetchOverride: options2.fetchOverride,
      source: options2.querySource
    }), async (anthropic, attempt, context7) => {
      attemptNumber = attempt, isFastModeRequest = context7.fastMode ?? !1, start = Date.now(), attemptStartTimes.push(start), queryCheckpoint("query_client_creation_end");
      let params = paramsFromContext(context7);
      if (captureAPIRequest(params, options2.querySource), maxOutputTokens = params.max_tokens, queryCheckpoint("query_api_request_sent"), !options2.agentId)
        headlessProfilerCheckpoint("api_request_sent");
      clientRequestId = getAPIProvider() === "firstParty" && isFirstPartyAnthropicBaseUrl() ? randomUUID30() : void 0;
      let result = await anthropic.beta.messages.create({ ...params, stream: !0 }, {
        signal,
        ...clientRequestId && {
          headers: { [CLIENT_REQUEST_ID_HEADER]: clientRequestId }
        }
      }).withResponse();
      return queryCheckpoint("query_response_headers_received"), streamRequestId = result.request_id, streamResponse = result.response, result.data;
    }, {
      model: options2.model,
      fallbackModel: options2.fallbackModel,
      thinkingConfig,
      ...isFastModeEnabled() ? { fastMode: isFastMode } : !1,
      signal,
      querySource: options2.querySource
    }), e;
    do
      if (e = await generator.next(), !("controller" in e.value))
        yield e.value;
    while (!e.done);
    stream10 = e.value, newMessages.length = 0, ttftMs = 0, partialMessage = void 0, contentBlocks.length = 0, usage = EMPTY_USAGE, stopReason = null, isAdvisorInProgress = !1;
    let streamWatchdogEnabled = isEnvTruthy(process.env.CLAUDE_ENABLE_STREAM_WATCHDOG), STREAM_IDLE_TIMEOUT_MS = parseInt(process.env.CLAUDE_STREAM_IDLE_TIMEOUT_MS || "", 10) || 90000, STREAM_IDLE_WARNING_MS = STREAM_IDLE_TIMEOUT_MS / 2, streamIdleAborted = !1, streamWatchdogFiredAt = null, streamIdleWarningTimer = null, streamIdleTimer = null;
    resetStreamIdleTimer(), startSessionActivity("api_call");
    try {
      let isFirstChunk = !0, lastEventTime = null, STALL_THRESHOLD_MS2 = 30000, totalStallTime = 0, stallCount = 0;
      for await (let part of stream10) {
        resetStreamIdleTimer();
        let now2 = Date.now();
        if (lastEventTime !== null) {
          let timeSinceLastEvent = now2 - lastEventTime;
          if (timeSinceLastEvent > STALL_THRESHOLD_MS2)
            stallCount++, totalStallTime += timeSinceLastEvent, logForDebugging(`Streaming stall detected: ${(timeSinceLastEvent / 1000).toFixed(1)}s gap between events (stall #${stallCount})`, { level: "warn" }), logEvent("tengu_streaming_stall", {
              stall_duration_ms: timeSinceLastEvent,
              stall_count: stallCount,
              total_stall_time_ms: totalStallTime,
              event_type: part.type,
              model: options2.model,
              request_id: streamRequestId ?? "unknown"
            });
        }
        if (lastEventTime = now2, isFirstChunk) {
          if (logForDebugging("Stream started - received first chunk"), queryCheckpoint("query_first_chunk_received"), !options2.agentId)
            headlessProfilerCheckpoint("first_chunk");
          endQueryProfile(), isFirstChunk = !1;
        }
        switch (part.type) {
          case "message_start": {
            partialMessage = part.message, ttftMs = Date.now() - start, usage = updateUsage(usage, part.message?.usage);
            break;
          }
          case "content_block_start":
            switch (part.content_block.type) {
              case "tool_use":
                contentBlocks[part.index] = {
                  ...part.content_block,
                  input: ""
                };
                break;
              case "server_tool_use":
                if (contentBlocks[part.index] = {
                  ...part.content_block,
                  input: ""
                }, part.content_block.name === "advisor")
                  isAdvisorInProgress = !0, logForDebugging("[AdvisorTool] Advisor tool called"), logEvent("tengu_advisor_tool_call", {
                    model: options2.model,
                    advisor_model: advisorModel ?? "unknown"
                  });
                break;
              case "text":
                contentBlocks[part.index] = {
                  ...part.content_block,
                  text: ""
                };
                break;
              case "thinking":
                contentBlocks[part.index] = {
                  ...part.content_block,
                  thinking: "",
                  signature: ""
                };
                break;
              default:
                if (contentBlocks[part.index] = { ...part.content_block }, part.content_block.type === "advisor_tool_result")
                  isAdvisorInProgress = !1, logForDebugging("[AdvisorTool] Advisor tool result received");
                break;
            }
            break;
          case "content_block_delta": {
            let contentBlock = contentBlocks[part.index], delta = part.delta;
            if (!contentBlock)
              throw logEvent("tengu_streaming_error", {
                error_type: "content_block_not_found_delta",
                part_type: part.type,
                part_index: part.index
              }), RangeError("Content block not found");
            switch (delta.type) {
              case "citations_delta":
                break;
              case "input_json_delta":
                if (contentBlock.type !== "tool_use" && contentBlock.type !== "server_tool_use")
                  throw logEvent("tengu_streaming_error", {
                    error_type: "content_block_type_mismatch_input_json",
                    expected_type: "tool_use",
                    actual_type: contentBlock.type
                  }), Error("Content block is not a input_json block");
                if (typeof contentBlock.input !== "string")
                  throw logEvent("tengu_streaming_error", {
                    error_type: "content_block_input_not_string",
                    input_type: typeof contentBlock.input
                  }), Error("Content block input is not a string");
                contentBlock.input += delta.partial_json;
                break;
              case "text_delta":
                if (contentBlock.type !== "text")
                  throw logEvent("tengu_streaming_error", {
                    error_type: "content_block_type_mismatch_text",
                    expected_type: "text",
                    actual_type: contentBlock.type
                  }), Error("Content block is not a text block");
                contentBlock.text += delta.text;
                break;
              case "signature_delta":
                if (contentBlock.type !== "thinking")
                  throw logEvent("tengu_streaming_error", {
                    error_type: "content_block_type_mismatch_thinking_signature",
                    expected_type: "thinking",
                    actual_type: contentBlock.type
                  }), Error("Content block is not a thinking block");
                contentBlock.signature = delta.signature;
                break;
              case "thinking_delta":
                if (contentBlock.type !== "thinking")
                  throw logEvent("tengu_streaming_error", {
                    error_type: "content_block_type_mismatch_thinking_delta",
                    expected_type: "thinking",
                    actual_type: contentBlock.type
                  }), Error("Content block is not a thinking block");
                contentBlock.thinking += delta.thinking;
                break;
            }
            break;
          }
          case "content_block_stop": {
            let contentBlock = contentBlocks[part.index];
            if (!contentBlock)
              throw logEvent("tengu_streaming_error", {
                error_type: "content_block_not_found_stop",
                part_type: part.type,
                part_index: part.index
              }), RangeError("Content block not found");
            if (!partialMessage)
              throw logEvent("tengu_streaming_error", {
                error_type: "partial_message_not_found",
                part_type: part.type
              }), Error("Message not found");
            let m4 = {
              message: {
                ...partialMessage,
                content: normalizeContentFromAPI([contentBlock], tools, options2.agentId)
              },
              requestId: streamRequestId ?? void 0,
              type: "assistant",
              uuid: randomUUID30(),
              timestamp: (/* @__PURE__ */ new Date()).toISOString(),
              ...!1,
              ...advisorModel && { advisorModel }
            };
            newMessages.push(m4), yield m4;
            break;
          }
          case "message_delta": {
            usage = updateUsage(usage, part.usage), stopReason = part.delta.stop_reason;
            let lastMsg = newMessages.at(-1);
            if (lastMsg)
              lastMsg.message.usage = usage, lastMsg.message.stop_reason = stopReason;
            let costUSDForPart = calculateUSDCost(resolvedModel, usage);
            costUSD += addToTotalSessionCost(costUSDForPart, usage, options2.model);
            let refusalMessage = getErrorMessageIfRefusal(part.delta.stop_reason, options2.model);
            if (refusalMessage)
              yield refusalMessage;
            if (stopReason === "max_tokens")
              logEvent("tengu_max_tokens_reached", {
                max_tokens: maxOutputTokens
              }), yield createAssistantAPIErrorMessage({
                content: `${API_ERROR_MESSAGE_PREFIX}: Claude's response exceeded the ${maxOutputTokens} output token maximum. To configure this behavior, set the CLAUDE_CODE_MAX_OUTPUT_TOKENS environment variable.`,
                apiError: "max_output_tokens",
                error: "max_output_tokens"
              });
            if (stopReason === "model_context_window_exceeded")
              logEvent("tengu_context_window_exceeded", {
                max_tokens: maxOutputTokens,
                output_tokens: usage.output_tokens
              }), yield createAssistantAPIErrorMessage({
                content: `${API_ERROR_MESSAGE_PREFIX}: The model has reached its context window limit.`,
                apiError: "max_output_tokens",
                error: "max_output_tokens"
              });
            break;
          }
          case "message_stop":
            break;
        }
        yield {
          type: "stream_event",
          event: part,
          ...part.type === "message_start" ? { ttftMs } : void 0
        };
      }
      if (clearStreamIdleTimers(), streamIdleAborted) {
        let exitDelayMs = streamWatchdogFiredAt !== null ? Math.round(performance.now() - streamWatchdogFiredAt) : -1;
        throw logForDiagnosticsNoPII("info", "cli_stream_loop_exited_after_watchdog_clean"), logEvent("tengu_stream_loop_exited_after_watchdog", {
          request_id: streamRequestId ?? "unknown",
          exit_delay_ms: exitDelayMs,
          exit_path: "clean",
          model: options2.model
        }), streamWatchdogFiredAt = null, Error("Stream idle timeout - no chunks received");
      }
      if (!partialMessage || newMessages.length === 0 && !stopReason)
        throw logForDebugging(!partialMessage ? "Stream completed without receiving message_start event - triggering non-streaming fallback" : "Stream completed with message_start but no content blocks completed - triggering non-streaming fallback", { level: "error" }), logEvent("tengu_stream_no_events", {
          model: options2.model,
          request_id: streamRequestId ?? "unknown"
        }), Error("Stream ended without receiving any events");
      if (stallCount > 0)
        logForDebugging(`Streaming completed with ${stallCount} stall(s), total stall time: ${(totalStallTime / 1000).toFixed(1)}s`, { level: "warn" }), logEvent("tengu_streaming_stall_summary", {
          stall_count: stallCount,
          total_stall_time_ms: totalStallTime,
          model: options2.model,
          request_id: streamRequestId ?? "unknown"
        });
      let resp = streamResponse;
      if (resp)
        extractQuotaStatusFromHeaders(resp.headers), responseHeaders = resp.headers;
    } catch (streamingError) {
      if (clearStreamIdleTimers(), streamIdleAborted && streamWatchdogFiredAt !== null) {
        let exitDelayMs = Math.round(performance.now() - streamWatchdogFiredAt);
        logForDiagnosticsNoPII("info", "cli_stream_loop_exited_after_watchdog_error"), logEvent("tengu_stream_loop_exited_after_watchdog", {
          request_id: streamRequestId ?? "unknown",
          exit_delay_ms: exitDelayMs,
          exit_path: "error",
          error_name: streamingError instanceof Error ? streamingError.name : "unknown",
          model: options2.model
        });
      }
      if (streamingError instanceof APIUserAbortError)
        if (signal.aborted) {
          if (logForDebugging(`Streaming aborted by user: ${errorMessage(streamingError)}`), isAdvisorInProgress)
            logEvent("tengu_advisor_tool_interrupted", {
              model: options2.model,
              advisor_model: advisorModel ?? "unknown"
            });
          throw streamingError;
        } else
          throw logForDebugging(`Streaming timeout (SDK abort): ${streamingError.message}`, { level: "error" }), new APIConnectionTimeoutError({ message: "Request timed out" });
      if (isEnvTruthy(process.env.CLAUDE_CODE_DISABLE_NONSTREAMING_FALLBACK) || !1)
        throw logForDebugging(`Error streaming (non-streaming fallback disabled): ${errorMessage(streamingError)}`, { level: "error" }), logEvent("tengu_streaming_fallback_to_non_streaming", {
          model: options2.model,
          error: streamingError instanceof Error ? streamingError.name : String(streamingError),
          attemptNumber,
          maxOutputTokens,
          thinkingType: thinkingConfig.type,
          fallback_disabled: !0,
          request_id: streamRequestId ?? "unknown",
          fallback_cause: streamIdleAborted ? "watchdog" : "other"
        }), streamingError;
      if (logForDebugging(`Error streaming, falling back to non-streaming mode: ${errorMessage(streamingError)}`, { level: "error" }), didFallBackToNonStreaming = !0, options2.onStreamingFallback)
        options2.onStreamingFallback();
      logEvent("tengu_streaming_fallback_to_non_streaming", {
        model: options2.model,
        error: streamingError instanceof Error ? streamingError.name : String(streamingError),
        attemptNumber,
        maxOutputTokens,
        thinkingType: thinkingConfig.type,
        fallback_disabled: !1,
        request_id: streamRequestId ?? "unknown",
        fallback_cause: streamIdleAborted ? "watchdog" : "other"
      }), logForDiagnosticsNoPII("info", "cli_nonstreaming_fallback_started"), logEvent("tengu_nonstreaming_fallback_started", {
        request_id: streamRequestId ?? "unknown",
        model: options2.model,
        fallback_cause: streamIdleAborted ? "watchdog" : "other"
      });
      let result = yield* executeNonStreamingRequest({ model: options2.model, source: options2.querySource }, {
        model: options2.model,
        fallbackModel: options2.fallbackModel,
        thinkingConfig,
        ...isFastModeEnabled() && { fastMode: isFastMode },
        signal,
        initialConsecutive529Errors: is529Error(streamingError) ? 1 : 0,
        querySource: options2.querySource
      }, paramsFromContext, (attempt, _startTime, tokens) => {
        attemptNumber = attempt, maxOutputTokens = tokens;
      }, (params) => captureAPIRequest(params, options2.querySource), streamRequestId), m4 = {
        message: {
          ...result,
          content: normalizeContentFromAPI(result.content, tools, options2.agentId)
        },
        requestId: streamRequestId ?? void 0,
        type: "assistant",
        uuid: randomUUID30(),
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        ...!1,
        ...advisorModel && {
          advisorModel
        }
      };
      newMessages.push(m4), fallbackMessage = m4, yield m4;
    } finally {
      clearStreamIdleTimers();
    }
  } catch (errorFromRetry) {
    if (errorFromRetry instanceof FallbackTriggeredError)
      throw errorFromRetry;
    if (!didFallBackToNonStreaming && errorFromRetry instanceof CannotRetryError && errorFromRetry.originalError instanceof APIError && errorFromRetry.originalError.status === 404) {
      let failedRequestId = errorFromRetry.originalError.requestID ?? "unknown";
      if (logForDebugging("Streaming endpoint returned 404, falling back to non-streaming mode", { level: "warn" }), didFallBackToNonStreaming = !0, options2.onStreamingFallback)
        options2.onStreamingFallback();
      logEvent("tengu_streaming_fallback_to_non_streaming", {
        model: options2.model,
        error: "404_stream_creation",
        attemptNumber,
        maxOutputTokens,
        thinkingType: thinkingConfig.type,
        request_id: failedRequestId,
        fallback_cause: "404_stream_creation"
      });
      try {
        let result = yield* executeNonStreamingRequest({ model: options2.model, source: options2.querySource }, {
          model: options2.model,
          fallbackModel: options2.fallbackModel,
          thinkingConfig,
          ...isFastModeEnabled() && { fastMode: isFastMode },
          signal
        }, paramsFromContext, (attempt, _startTime, tokens) => {
          attemptNumber = attempt, maxOutputTokens = tokens;
        }, (params) => captureAPIRequest(params, options2.querySource), failedRequestId), m4 = {
          message: {
            ...result,
            content: normalizeContentFromAPI(result.content, tools, options2.agentId)
          },
          requestId: streamRequestId ?? void 0,
          type: "assistant",
          uuid: randomUUID30(),
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          ...!1,
          ...advisorModel && { advisorModel }
        };
        newMessages.push(m4), fallbackMessage = m4, yield m4;
      } catch (fallbackError) {
        if (fallbackError instanceof FallbackTriggeredError)
          throw fallbackError;
        logForDebugging(`Non-streaming fallback also failed: ${errorMessage(fallbackError)}`, { level: "error" });
        let error44 = fallbackError, errorModel = options2.model;
        if (fallbackError instanceof CannotRetryError)
          error44 = fallbackError.originalError, errorModel = fallbackError.retryContext.model;
        if (error44 instanceof APIError)
          extractQuotaStatusFromError(error44);
        let requestId = streamRequestId || (error44 instanceof APIError ? error44.requestID : void 0) || (error44 instanceof APIError ? error44.error?.request_id : void 0);
        if (logAPIError({
          error: error44,
          model: errorModel,
          messageCount: messagesForAPI.length,
          messageTokens: tokenCountFromLastAPIResponse(messagesForAPI),
          durationMs: Date.now() - start,
          durationMsIncludingRetries: Date.now() - startIncludingRetries,
          attempt: attemptNumber,
          requestId,
          clientRequestId,
          didFallBackToNonStreaming,
          queryTracking: options2.queryTracking,
          querySource: options2.querySource,
          llmSpan,
          fastMode: isFastModeRequest,
          previousRequestId
        }), error44 instanceof APIUserAbortError) {
          releaseStreamResources();
          return;
        }
        yield getAssistantMessageFromError(error44, errorModel, {
          messages,
          messagesForAPI
        }), releaseStreamResources();
        return;
      }
    } else {
      logForDebugging(`Error in API request: ${errorMessage(errorFromRetry)}`, {
        level: "error"
      });
      let error44 = errorFromRetry, errorModel = options2.model;
      if (errorFromRetry instanceof CannotRetryError)
        error44 = errorFromRetry.originalError, errorModel = errorFromRetry.retryContext.model;
      if (error44 instanceof APIError)
        extractQuotaStatusFromError(error44);
      let requestId = streamRequestId || (error44 instanceof APIError ? error44.requestID : void 0) || (error44 instanceof APIError ? error44.error?.request_id : void 0);
      if (logAPIError({
        error: error44,
        model: errorModel,
        messageCount: messagesForAPI.length,
        messageTokens: tokenCountFromLastAPIResponse(messagesForAPI),
        durationMs: Date.now() - start,
        durationMsIncludingRetries: Date.now() - startIncludingRetries,
        attempt: attemptNumber,
        requestId,
        clientRequestId,
        didFallBackToNonStreaming,
        queryTracking: options2.queryTracking,
        querySource: options2.querySource,
        llmSpan,
        fastMode: isFastModeRequest,
        previousRequestId
      }), error44 instanceof APIUserAbortError) {
        releaseStreamResources();
        return;
      }
      yield getAssistantMessageFromError(error44, errorModel, {
        messages,
        messagesForAPI
      }), releaseStreamResources();
      return;
    }
  } finally {
    if (stopSessionActivity("api_call"), releaseStreamResources(), fallbackMessage) {
      let fallbackUsage = fallbackMessage.message.usage;
      usage = updateUsage(EMPTY_USAGE, fallbackUsage), stopReason = fallbackMessage.message.stop_reason;
      let fallbackCost = calculateUSDCost(resolvedModel, fallbackUsage);
      costUSD += addToTotalSessionCost(fallbackCost, fallbackUsage, options2.model);
    }
  }
  if (streamRequestId && !getAgentContext() && (options2.querySource.startsWith("repl_main_thread") || options2.querySource === "sdk"))
    setLastMainRequestId(streamRequestId);
  let logMessageCount = messagesForAPI.length, logMessageTokens = tokenCountFromLastAPIResponse(messagesForAPI);
  options2.getToolPermissionContext().then((permissionContext) => {
    logAPISuccessAndDuration({
      model: newMessages[0]?.message.model ?? partialMessage?.model ?? options2.model,
      preNormalizedModel: options2.model,
      usage,
      start,
      startIncludingRetries,
      attempt: attemptNumber,
      messageCount: logMessageCount,
      messageTokens: logMessageTokens,
      requestId: streamRequestId ?? null,
      stopReason,
      ttftMs,
      didFallBackToNonStreaming,
      querySource: options2.querySource,
      headers: responseHeaders,
      costUSD,
      queryTracking: options2.queryTracking,
      permissionMode: permissionContext.mode,
      newMessages,
      llmSpan,
      globalCacheStrategy,
      requestSetupMs: start - startIncludingRetries,
      attemptStartTimes,
      fastMode: isFastModeRequest,
      previousRequestId,
      betas: lastRequestBetas
    });
  }), releaseStreamResources();
}

