// Original: src/services/api/logging.ts
function getErrorMessage3(error44) {
  if (error44 instanceof APIError) {
    let body = error44.error;
    if (body?.error?.message)
      return body.error.message;
  }
  return error44 instanceof Error ? error44.message : String(error44);
}
function detectGateway({
  headers,
  baseUrl
}) {
  if (headers) {
    let headerNames = [];
    headers.forEach((_, key3) => headerNames.push(key3));
    for (let [gw, { prefixes }] of Object.entries(GATEWAY_FINGERPRINTS))
      if (prefixes.some((p4) => headerNames.some((h4) => h4.startsWith(p4))))
        return gw;
  }
  if (baseUrl)
    try {
      let host = new URL(baseUrl).hostname.toLowerCase();
      for (let [gw, suffixes] of Object.entries(GATEWAY_HOST_SUFFIXES))
        if (suffixes.some((s2) => host.endsWith(s2)))
          return gw;
    } catch {}
  return;
}
function getAnthropicEnvMetadata() {
  return {
    ...process.env.ANTHROPIC_BASE_URL ? {
      baseUrl: process.env.ANTHROPIC_BASE_URL
    } : {},
    ...process.env.ANTHROPIC_MODEL ? {
      envModel: process.env.ANTHROPIC_MODEL
    } : {},
    ...process.env.ANTHROPIC_SMALL_FAST_MODEL ? {
      envSmallFastModel: process.env.ANTHROPIC_SMALL_FAST_MODEL
    } : {}
  };
}
function getBuildAgeMinutes() {
  let buildTime = (/* @__PURE__ */ new Date("2026-05-07T15:49:58.586Z")).getTime();
  if (isNaN(buildTime))
    return;
  return Math.floor((Date.now() - buildTime) / 60000);
}
function logAPIQuery({
  model,
  messagesLength,
  temperature,
  betas,
  permissionMode,
  querySource,
  queryTracking,
  thinkingType,
  effortValue,
  fastMode,
  previousRequestId
}) {
  logEvent("tengu_api_query", {
    model,
    messagesLength,
    temperature,
    provider: getAPIProviderForStatsig(),
    buildAgeMins: getBuildAgeMinutes(),
    ...betas?.length ? {
      betas: betas.join(",")
    } : {},
    permissionMode,
    querySource,
    ...queryTracking ? {
      queryChainId: queryTracking.chainId,
      queryDepth: queryTracking.depth
    } : {},
    thinkingType,
    effortValue,
    fastMode,
    ...previousRequestId ? {
      previousRequestId
    } : {},
    ...getAnthropicEnvMetadata()
  });
}
function logAPIError({
  error: error44,
  model,
  messageCount,
  messageTokens,
  durationMs,
  durationMsIncludingRetries,
  attempt,
  requestId,
  clientRequestId,
  didFallBackToNonStreaming,
  promptCategory,
  headers,
  queryTracking,
  querySource,
  llmSpan,
  fastMode,
  previousRequestId
}) {
  let gateway = detectGateway({
    headers: error44 instanceof APIError && error44.headers ? error44.headers : headers,
    baseUrl: process.env.ANTHROPIC_BASE_URL
  }), errStr = getErrorMessage3(error44), status = error44 instanceof APIError ? String(error44.status) : void 0, errorType = classifyAPIError(error44), connectionDetails = extractConnectionErrorDetails(error44);
  if (connectionDetails) {
    let sslLabel = connectionDetails.isSSLError ? " (SSL error)" : "";
    logForDebugging(`Connection error details: code=${connectionDetails.code}${sslLabel}, message=${connectionDetails.message}`, { level: "error" });
  }
  let invocation = consumeInvokingRequestId();
  if (clientRequestId)
    logForDebugging(`API error x-client-request-id=${clientRequestId} (give this to the API team for server-log lookup)`, { level: "error" });
  logError2(error44), logEvent("tengu_api_error", {
    model,
    error: errStr,
    status,
    errorType,
    messageCount,
    messageTokens,
    durationMs,
    durationMsIncludingRetries,
    attempt,
    provider: getAPIProviderForStatsig(),
    requestId: requestId || void 0,
    ...invocation ? {
      invokingRequestId: invocation.invokingRequestId,
      invocationKind: invocation.invocationKind
    } : {},
    clientRequestId: clientRequestId || void 0,
    didFallBackToNonStreaming,
    ...promptCategory ? {
      promptCategory
    } : {},
    ...gateway ? {
      gateway
    } : {},
    ...queryTracking ? {
      queryChainId: queryTracking.chainId,
      queryDepth: queryTracking.depth
    } : {},
    ...querySource ? {
      querySource
    } : {},
    fastMode,
    ...previousRequestId ? {
      previousRequestId
    } : {},
    ...getAnthropicEnvMetadata()
  }), logOTelEvent("api_error", {
    model,
    error: errStr,
    status_code: String(status),
    duration_ms: String(durationMs),
    attempt: String(attempt),
    speed: fastMode ? "fast" : "normal"
  }), endLLMRequestSpan(llmSpan, {
    success: !1,
    statusCode: status ? parseInt(status) : void 0,
    error: errStr,
    attempt
  });
  let teleportInfo = getTeleportedSessionInfo();
  if (teleportInfo?.isTeleported && !teleportInfo.hasLoggedFirstMessage)
    logEvent("tengu_teleport_first_message_error", {
      session_id: teleportInfo.sessionId,
      error_type: errorType
    }), markFirstTeleportMessageLogged();
}
function logAPISuccess({
  model,
  preNormalizedModel,
  messageCount,
  messageTokens,
  usage,
  durationMs,
  durationMsIncludingRetries,
  attempt,
  ttftMs,
  requestId,
  stopReason,
  costUSD,
  didFallBackToNonStreaming,
  querySource,
  gateway,
  queryTracking,
  permissionMode,
  globalCacheStrategy,
  textContentLength,
  thinkingContentLength,
  toolUseContentLengths,
  connectorTextBlockCount,
  fastMode,
  previousRequestId,
  betas
}) {
  let isNonInteractiveSession = getIsNonInteractiveSession(), isPostCompaction = consumePostCompaction(), hasPrintFlag = process.argv.includes("-p") || process.argv.includes("--print"), now2 = Date.now(), lastCompletion = getLastApiCompletionTimestamp(), timeSinceLastApiCallMs = lastCompletion !== null ? now2 - lastCompletion : void 0, invocation = consumeInvokingRequestId();
  logEvent("tengu_api_success", {
    model,
    ...preNormalizedModel !== model ? {
      preNormalizedModel
    } : {},
    ...betas?.length ? {
      betas: betas.join(",")
    } : {},
    messageCount,
    messageTokens,
    inputTokens: usage.input_tokens,
    outputTokens: usage.output_tokens,
    cachedInputTokens: usage.cache_read_input_tokens ?? 0,
    uncachedInputTokens: usage.cache_creation_input_tokens ?? 0,
    durationMs,
    durationMsIncludingRetries,
    attempt,
    ttftMs: ttftMs ?? void 0,
    buildAgeMins: getBuildAgeMinutes(),
    provider: getAPIProviderForStatsig(),
    requestId: requestId ?? void 0,
    ...invocation ? {
      invokingRequestId: invocation.invokingRequestId,
      invocationKind: invocation.invocationKind
    } : {},
    stop_reason: stopReason ?? void 0,
    costUSD,
    didFallBackToNonStreaming,
    isNonInteractiveSession,
    print: hasPrintFlag,
    isTTY: process.stdout.isTTY ?? !1,
    querySource,
    ...gateway ? {
      gateway
    } : {},
    ...queryTracking ? {
      queryChainId: queryTracking.chainId,
      queryDepth: queryTracking.depth
    } : {},
    permissionMode,
    ...globalCacheStrategy ? {
      globalCacheStrategy
    } : {},
    ...textContentLength !== void 0 ? {
      textContentLength
    } : {},
    ...thinkingContentLength !== void 0 ? {
      thinkingContentLength
    } : {},
    ...toolUseContentLengths !== void 0 ? {
      toolUseContentLengths: jsonStringify(toolUseContentLengths)
    } : {},
    ...connectorTextBlockCount !== void 0 ? {
      connectorTextBlockCount
    } : {},
    fastMode,
    ...previousRequestId ? {
      previousRequestId
    } : {},
    ...isPostCompaction ? { isPostCompaction } : {},
    ...getAnthropicEnvMetadata(),
    timeSinceLastApiCallMs
  }), setLastApiCompletionTimestamp(now2);
}
function logAPISuccessAndDuration({
  model,
  preNormalizedModel,
  start,
  startIncludingRetries,
  ttftMs,
  usage,
  attempt,
  messageCount,
  messageTokens,
  requestId,
  stopReason,
  didFallBackToNonStreaming,
  querySource,
  headers,
  costUSD,
  queryTracking,
  permissionMode,
  newMessages,
  llmSpan,
  globalCacheStrategy,
  requestSetupMs,
  attemptStartTimes,
  fastMode,
  previousRequestId,
  betas
}) {
  let gateway = detectGateway({
    headers,
    baseUrl: process.env.ANTHROPIC_BASE_URL
  }), textContentLength, thinkingContentLength, toolUseContentLengths, connectorTextBlockCount;
  if (newMessages) {
    let textLen = 0, thinkingLen = 0, hasToolUse = !1, toolLengths = {}, connectorCount = 0;
    for (let msg of newMessages)
      for (let block2 of msg.message.content)
        if (block2.type === "text")
          textLen += block2.text.length;
        else if (block2.type === "thinking")
          thinkingLen += block2.thinking.length;
        else if (block2.type === "tool_use" || block2.type === "server_tool_use" || block2.type === "mcp_tool_use") {
          let inputLen = jsonStringify(block2.input).length, sanitizedName = sanitizeToolNameForAnalytics(block2.name);
          toolLengths[sanitizedName] = (toolLengths[sanitizedName] ?? 0) + inputLen, hasToolUse = !0;
        }
    textContentLength = textLen, thinkingContentLength = thinkingLen > 0 ? thinkingLen : void 0, toolUseContentLengths = hasToolUse ? toolLengths : void 0, connectorTextBlockCount = connectorCount > 0 ? connectorCount : void 0;
  }
  let durationMs = Date.now() - start, durationMsIncludingRetries = Date.now() - startIncludingRetries;
  addToTotalDurationState(durationMsIncludingRetries, durationMs), logAPISuccess({
    model,
    preNormalizedModel,
    messageCount,
    messageTokens,
    usage,
    durationMs,
    durationMsIncludingRetries,
    attempt,
    ttftMs,
    requestId,
    stopReason,
    costUSD,
    didFallBackToNonStreaming,
    querySource,
    gateway,
    queryTracking,
    permissionMode,
    globalCacheStrategy,
    textContentLength,
    thinkingContentLength,
    toolUseContentLengths,
    connectorTextBlockCount,
    fastMode,
    previousRequestId,
    betas
  }), logOTelEvent("api_request", {
    model,
    input_tokens: String(usage.input_tokens),
    output_tokens: String(usage.output_tokens),
    cache_read_tokens: String(usage.cache_read_input_tokens),
    cache_creation_tokens: String(usage.cache_creation_input_tokens),
    cost_usd: String(costUSD),
    duration_ms: String(durationMs),
    speed: fastMode ? "fast" : "normal"
  });
  let modelOutput, thinkingOutput, hasToolCall;
  if (isBetaTracingEnabled() && newMessages)
    modelOutput = newMessages.flatMap((m4) => m4.message.content.filter((c3) => c3.type === "text").map((c3) => c3.text)).join(`
`) || void 0, hasToolCall = newMessages.some((m4) => m4.message.content.some((c3) => c3.type === "tool_use"));
  endLLMRequestSpan(llmSpan, {
    success: !0,
    inputTokens: usage.input_tokens,
    outputTokens: usage.output_tokens,
    cacheReadTokens: usage.cache_read_input_tokens,
    cacheCreationTokens: usage.cache_creation_input_tokens,
    attempt,
    modelOutput,
    thinkingOutput,
    hasToolCall,
    ttftMs: ttftMs ?? void 0,
    requestSetupMs,
    attemptStartTimes
  });
  let teleportInfo = getTeleportedSessionInfo();
  if (teleportInfo?.isTeleported && !teleportInfo.hasLoggedFirstMessage)
    logEvent("tengu_teleport_first_message_success", {
      session_id: teleportInfo.sessionId
    }), markFirstTeleportMessageLogged();
}
var GATEWAY_FINGERPRINTS, GATEWAY_HOST_SUFFIXES;
var init_logging2 = __esm(() => {
  init_sdk();
  init_state();
  init_debug();
  init_log3();
  init_providers();
  init_slowOperations();
  init_events();
  init_sessionTracing();
  init_agentContext();
  init_metadata();
  init_emptyUsage();
  init_errors11();
  init_errorUtils();
  GATEWAY_FINGERPRINTS = {
    litellm: {
      prefixes: ["x-litellm-"]
    },
    helicone: {
      prefixes: ["helicone-"]
    },
    portkey: {
      prefixes: ["x-portkey-"]
    },
    "cloudflare-ai-gateway": {
      prefixes: ["cf-aig-"]
    },
    kong: {
      prefixes: ["x-kong-"]
    },
    braintrust: {
      prefixes: ["x-bt-"]
    }
  }, GATEWAY_HOST_SUFFIXES = {
    databricks: [
      ".cloud.databricks.com",
      ".azuredatabricks.net",
      ".gcp.databricks.com"
    ]
  };
});
