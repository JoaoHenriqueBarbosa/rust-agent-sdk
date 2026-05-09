// Original: src/utils/forkedAgent.ts
import { randomUUID as randomUUID18 } from "crypto";
function saveCacheSafeParams(params) {
  lastCacheSafeParams = params;
}
function getLastCacheSafeParams() {
  return lastCacheSafeParams;
}
function createCacheSafeParams(context6) {
  return {
    systemPrompt: context6.systemPrompt,
    userContext: context6.userContext,
    systemContext: context6.systemContext,
    toolUseContext: context6.toolUseContext,
    forkContextMessages: context6.messages
  };
}
function createGetAppStateWithAllowedTools(baseGetAppState, allowedTools) {
  if (allowedTools.length === 0)
    return baseGetAppState;
  return () => {
    let appState = baseGetAppState();
    return {
      ...appState,
      toolPermissionContext: {
        ...appState.toolPermissionContext,
        alwaysAllowRules: {
          ...appState.toolPermissionContext.alwaysAllowRules,
          command: [
            .../* @__PURE__ */ new Set([
              ...appState.toolPermissionContext.alwaysAllowRules.command || [],
              ...allowedTools
            ])
          ]
        }
      }
    };
  };
}
async function prepareForkedCommandContext(command12, args, context6) {
  let skillContent = (await command12.getPromptForCommand(args, context6)).map((block2) => block2.type === "text" ? block2.text : "").join(`
`), allowedTools = parseToolListFromCLI(command12.allowedTools ?? []), modifiedGetAppState = createGetAppStateWithAllowedTools(context6.getAppState, allowedTools), agentTypeName = command12.agent ?? "general-purpose", agents = context6.options.agentDefinitions.activeAgents, baseAgent = agents.find((a2) => a2.agentType === agentTypeName) ?? agents.find((a2) => a2.agentType === "general-purpose") ?? agents[0];
  if (!baseAgent)
    throw Error("No agent available for forked execution");
  let promptMessages = [createUserMessage({ content: skillContent })];
  return {
    skillContent,
    modifiedGetAppState,
    baseAgent,
    promptMessages
  };
}
function extractResultText(agentMessages, defaultText = "Execution completed") {
  let lastAssistantMessage = getLastAssistantMessage(agentMessages);
  if (!lastAssistantMessage)
    return defaultText;
  return extractTextContent(lastAssistantMessage.message.content, `
`) || defaultText;
}
function createSubagentContext(parentContext, overrides) {
  let abortController = overrides?.abortController ?? (overrides?.shareAbortController ? parentContext.abortController : createChildAbortController(parentContext.abortController)), getAppState = overrides?.getAppState ? overrides.getAppState : overrides?.shareAbortController ? parentContext.getAppState : () => {
    let state3 = parentContext.getAppState();
    if (state3.toolPermissionContext.shouldAvoidPermissionPrompts)
      return state3;
    return {
      ...state3,
      toolPermissionContext: {
        ...state3.toolPermissionContext,
        shouldAvoidPermissionPrompts: !0
      }
    };
  };
  return {
    readFileState: cloneFileStateCache(overrides?.readFileState ?? parentContext.readFileState),
    nestedMemoryAttachmentTriggers: /* @__PURE__ */ new Set,
    loadedNestedMemoryPaths: /* @__PURE__ */ new Set,
    dynamicSkillDirTriggers: /* @__PURE__ */ new Set,
    discoveredSkillNames: /* @__PURE__ */ new Set,
    toolDecisions: void 0,
    contentReplacementState: overrides?.contentReplacementState ?? (parentContext.contentReplacementState ? cloneContentReplacementState(parentContext.contentReplacementState) : void 0),
    abortController,
    getAppState,
    setAppState: overrides?.shareSetAppState ? parentContext.setAppState : () => {},
    setAppStateForTasks: parentContext.setAppStateForTasks ?? parentContext.setAppState,
    localDenialTracking: overrides?.shareSetAppState ? parentContext.localDenialTracking : createDenialTrackingState(),
    setInProgressToolUseIDs: () => {},
    setResponseLength: overrides?.shareSetResponseLength ? parentContext.setResponseLength : () => {},
    pushApiMetricsEntry: overrides?.shareSetResponseLength ? parentContext.pushApiMetricsEntry : void 0,
    updateFileHistoryState: () => {},
    updateAttributionState: parentContext.updateAttributionState,
    addNotification: void 0,
    setToolJSX: void 0,
    setStreamMode: void 0,
    setSDKStatus: void 0,
    openMessageSelector: void 0,
    options: overrides?.options ?? parentContext.options,
    messages: overrides?.messages ?? parentContext.messages,
    agentId: overrides?.agentId ?? createAgentId(),
    agentType: overrides?.agentType,
    queryTracking: {
      chainId: randomUUID18(),
      depth: (parentContext.queryTracking?.depth ?? -1) + 1
    },
    fileReadingLimits: parentContext.fileReadingLimits,
    userModified: parentContext.userModified,
    criticalSystemReminder_EXPERIMENTAL: overrides?.criticalSystemReminder_EXPERIMENTAL,
    requireCanUseTool: overrides?.requireCanUseTool
  };
}
async function runForkedAgent({
  promptMessages,
  cacheSafeParams,
  canUseTool,
  querySource,
  forkLabel,
  overrides,
  maxOutputTokens,
  maxTurns,
  onMessage: onMessage2,
  skipTranscript,
  skipCacheWrite
}) {
  let startTime = Date.now(), outputMessages = [], totalUsage = { ...EMPTY_USAGE }, {
    systemPrompt,
    userContext,
    systemContext,
    toolUseContext,
    forkContextMessages
  } = cacheSafeParams, isolatedToolUseContext = createSubagentContext(toolUseContext, overrides), initialMessages = [...forkContextMessages, ...promptMessages], agentId = skipTranscript ? void 0 : createAgentId(forkLabel), lastRecordedUuid = null;
  if (agentId)
    await recordSidechainTranscript(initialMessages, agentId).catch((err2) => logForDebugging(`Forked agent [${forkLabel}] failed to record initial transcript: ${err2}`)), lastRecordedUuid = initialMessages.length > 0 ? initialMessages[initialMessages.length - 1].uuid : null;
  try {
    for await (let message of query({
      messages: initialMessages,
      systemPrompt,
      userContext,
      systemContext,
      canUseTool,
      toolUseContext: isolatedToolUseContext,
      querySource,
      maxOutputTokensOverride: maxOutputTokens,
      maxTurns,
      skipCacheWrite
    })) {
      if (message.type === "stream_event") {
        if ("event" in message && message.event?.type === "message_delta" && message.event.usage) {
          let turnUsage = updateUsage({ ...EMPTY_USAGE }, message.event.usage);
          totalUsage = accumulateUsage(totalUsage, turnUsage);
        }
        continue;
      }
      if (message.type === "stream_request_start")
        continue;
      logForDebugging(`Forked agent [${forkLabel}] received message: type=${message.type}`), outputMessages.push(message), onMessage2?.(message);
      let msg = message;
      if (agentId && (msg.type === "assistant" || msg.type === "user" || msg.type === "progress")) {
        if (await recordSidechainTranscript([msg], agentId, lastRecordedUuid).catch((err2) => logForDebugging(`Forked agent [${forkLabel}] failed to record transcript: ${err2}`)), msg.type !== "progress")
          lastRecordedUuid = msg.uuid;
      }
    }
  } finally {
    isolatedToolUseContext.readFileState.clear(), initialMessages.length = 0;
  }
  logForDebugging(`Forked agent [${forkLabel}] finished: ${outputMessages.length} messages, types=[${outputMessages.map((m4) => m4.type).join(", ")}], totalUsage: input=${totalUsage.input_tokens} output=${totalUsage.output_tokens} cacheRead=${totalUsage.cache_read_input_tokens} cacheCreate=${totalUsage.cache_creation_input_tokens}`);
  let durationMs = Date.now() - startTime;
  return logForkAgentQueryEvent({
    forkLabel,
    querySource,
    durationMs,
    messageCount: outputMessages.length,
    totalUsage,
    queryTracking: toolUseContext.queryTracking
  }), {
    messages: outputMessages,
    totalUsage
  };
}
function logForkAgentQueryEvent({
  forkLabel,
  querySource,
  durationMs,
  messageCount,
  totalUsage,
  queryTracking
}) {
  let totalInputTokens = totalUsage.input_tokens + totalUsage.cache_creation_input_tokens + totalUsage.cache_read_input_tokens, cacheHitRate = totalInputTokens > 0 ? totalUsage.cache_read_input_tokens / totalInputTokens : 0;
  logEvent("tengu_fork_agent_query", {
    forkLabel,
    querySource,
    durationMs,
    messageCount,
    inputTokens: totalUsage.input_tokens,
    outputTokens: totalUsage.output_tokens,
    cacheReadInputTokens: totalUsage.cache_read_input_tokens,
    cacheCreationInputTokens: totalUsage.cache_creation_input_tokens,
    serviceTier: totalUsage.service_tier,
    cacheCreationEphemeral1hTokens: totalUsage.cache_creation.ephemeral_1h_input_tokens,
    cacheCreationEphemeral5mTokens: totalUsage.cache_creation.ephemeral_5m_input_tokens,
    cacheHitRate,
    ...queryTracking ? {
      queryChainId: queryTracking.chainId,
      queryDepth: queryTracking.depth
    } : {}
  });
}
var lastCacheSafeParams = null;
var init_forkedAgent = __esm(() => {
  init_query();
  init_claude();
  init_logging2();
  init_abortController();
  init_debug();
  init_fileStateCache();
  init_messages3();
  init_denialTracking();
  init_permissionSetup();
  init_sessionStorage();
  init_toolResultStorage();
  init_uuid();
});
