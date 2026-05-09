// Original: src/tools/AgentTool/agentToolUtils.ts
function filterToolsForAgent({
  tools,
  isBuiltIn,
  isAsync: isAsync2 = !1,
  permissionMode
}) {
  return tools.filter((tool) => {
    if (tool.name.startsWith("mcp__"))
      return !0;
    if (toolMatchesName(tool, EXIT_PLAN_MODE_V2_TOOL_NAME) && permissionMode === "plan")
      return !0;
    if (ALL_AGENT_DISALLOWED_TOOLS.has(tool.name))
      return !1;
    if (!isBuiltIn && CUSTOM_AGENT_DISALLOWED_TOOLS.has(tool.name))
      return !1;
    if (isAsync2 && !ASYNC_AGENT_ALLOWED_TOOLS.has(tool.name)) {
      if (isAgentSwarmsEnabled() && isInProcessTeammate()) {
        if (toolMatchesName(tool, AGENT_TOOL_NAME))
          return !0;
        if (IN_PROCESS_TEAMMATE_ALLOWED_TOOLS.has(tool.name))
          return !0;
      }
      return !1;
    }
    return !0;
  });
}
function resolveAgentTools(agentDefinition, availableTools, isAsync2 = !1, isMainThread = !1) {
  let {
    tools: agentTools,
    disallowedTools,
    source,
    permissionMode
  } = agentDefinition, filteredAvailableTools = isMainThread ? availableTools : filterToolsForAgent({
    tools: availableTools,
    isBuiltIn: source === "built-in",
    isAsync: isAsync2,
    permissionMode
  }), disallowedToolSet = new Set(disallowedTools?.map((toolSpec) => {
    let { toolName } = permissionRuleValueFromString(toolSpec);
    return toolName;
  }) ?? []), allowedAvailableTools = filteredAvailableTools.filter((tool) => !disallowedToolSet.has(tool.name));
  if (agentTools === void 0 || agentTools.length === 1 && agentTools[0] === "*")
    return {
      hasWildcard: !0,
      validTools: [],
      invalidTools: [],
      resolvedTools: allowedAvailableTools
    };
  let availableToolMap = /* @__PURE__ */ new Map;
  for (let tool of allowedAvailableTools)
    availableToolMap.set(tool.name, tool);
  let validTools = [], invalidTools = [], resolved = [], resolvedToolsSet = /* @__PURE__ */ new Set, allowedAgentTypes;
  for (let toolSpec of agentTools) {
    let { toolName, ruleContent } = permissionRuleValueFromString(toolSpec);
    if (toolName === AGENT_TOOL_NAME) {
      if (ruleContent)
        allowedAgentTypes = ruleContent.split(",").map((s2) => s2.trim());
      if (!isMainThread) {
        validTools.push(toolSpec);
        continue;
      }
    }
    let tool = availableToolMap.get(toolName);
    if (tool) {
      if (validTools.push(toolSpec), !resolvedToolsSet.has(tool))
        resolved.push(tool), resolvedToolsSet.add(tool);
    } else
      invalidTools.push(toolSpec);
  }
  return {
    hasWildcard: !1,
    validTools,
    invalidTools,
    resolvedTools: resolved,
    allowedAgentTypes
  };
}
function countToolUses(messages) {
  let count3 = 0;
  for (let m4 of messages)
    if (m4.type === "assistant") {
      for (let block2 of m4.message.content)
        if (block2.type === "tool_use")
          count3++;
    }
  return count3;
}
function finalizeAgentTool(agentMessages, agentId, metadata) {
  let {
    prompt,
    resolvedAgentModel,
    isBuiltInAgent: isBuiltInAgent2,
    startTime,
    agentType,
    isAsync: isAsync2
  } = metadata, lastAssistantMessage = getLastAssistantMessage(agentMessages);
  if (lastAssistantMessage === void 0)
    throw Error("No assistant messages found");
  let content = lastAssistantMessage.message.content.filter((_) => _.type === "text");
  if (content.length === 0)
    for (let i5 = agentMessages.length - 1;i5 >= 0; i5--) {
      let m4 = agentMessages[i5];
      if (m4.type !== "assistant")
        continue;
      let textBlocks = m4.message.content.filter((_) => _.type === "text");
      if (textBlocks.length > 0) {
        content = textBlocks;
        break;
      }
    }
  let totalTokens = getTokenCountFromUsage(lastAssistantMessage.message.usage), totalToolUseCount = countToolUses(agentMessages);
  logEvent("tengu_agent_tool_completed", {
    agent_type: agentType,
    model: resolvedAgentModel,
    prompt_char_count: prompt.length,
    response_char_count: content.length,
    assistant_message_count: agentMessages.length,
    total_tool_uses: totalToolUseCount,
    duration_ms: Date.now() - startTime,
    total_tokens: totalTokens,
    is_built_in_agent: isBuiltInAgent2,
    is_async: isAsync2
  });
  let lastRequestId = lastAssistantMessage.requestId;
  if (lastRequestId)
    logEvent("tengu_cache_eviction_hint", {
      scope: "subagent_end",
      last_request_id: lastRequestId
    });
  return {
    agentId,
    agentType,
    content,
    totalDurationMs: Date.now() - startTime,
    totalTokens,
    totalToolUseCount,
    usage: lastAssistantMessage.message.usage
  };
}
function getLastToolUseName(message) {
  if (message.type !== "assistant")
    return;
  let block2 = message.message.content.findLast((b) => b.type === "tool_use");
  return block2?.type === "tool_use" ? block2.name : void 0;
}
function emitTaskProgress2(tracker, taskId, toolUseId, description, startTime, lastToolName) {
  let progress = getProgressUpdate(tracker);
  emitTaskProgress({
    taskId,
    toolUseId,
    description: progress.lastActivity?.activityDescription ?? description,
    startTime,
    totalTokens: progress.tokenCount,
    toolUses: progress.toolUseCount,
    lastToolName
  });
}
function extractPartialResult(messages) {
  for (let i5 = messages.length - 1;i5 >= 0; i5--) {
    let m4 = messages[i5];
    if (m4.type !== "assistant")
      continue;
    let text2 = extractTextContent(m4.message.content, `
`);
    if (text2)
      return text2;
  }
  return;
}
async function runAsyncAgentLifecycle({
  taskId,
  abortController,
  makeStream,
  metadata,
  description,
  toolUseContext,
  rootSetAppState,
  agentIdForCleanup,
  enableSummarization,
  getWorktreeResult
}) {
  let stopSummarization, agentMessages = [];
  try {
    let tracker = createProgressTracker(), resolveActivity = createActivityDescriptionResolver(toolUseContext.options.tools), onCacheSafeParams = enableSummarization ? (params) => {
      let { stop } = startAgentSummarization(taskId, asAgentId(taskId), params, rootSetAppState);
      stopSummarization = stop;
    } : void 0;
    for await (let message of makeStream(onCacheSafeParams)) {
      agentMessages.push(message), rootSetAppState((prev) => {
        let t2 = prev.tasks[taskId];
        if (!isLocalAgentTask(t2) || !t2.retain)
          return prev;
        let base2 = t2.messages ?? [];
        return {
          ...prev,
          tasks: {
            ...prev.tasks,
            [taskId]: { ...t2, messages: [...base2, message] }
          }
        };
      }), updateProgressFromMessage(tracker, message, resolveActivity, toolUseContext.options.tools), updateAgentProgress(taskId, getProgressUpdate(tracker), rootSetAppState);
      let lastToolName = getLastToolUseName(message);
      if (lastToolName)
        emitTaskProgress2(tracker, taskId, toolUseContext.toolUseId, description, metadata.startTime, lastToolName);
    }
    stopSummarization?.();
    let agentResult = finalizeAgentTool(agentMessages, taskId, metadata);
    completeAgentTask(agentResult, rootSetAppState);
    let finalMessage = extractTextContent(agentResult.content, `
`), worktreeResult = await getWorktreeResult();
    enqueueAgentNotification({
      taskId,
      description,
      status: "completed",
      setAppState: rootSetAppState,
      finalMessage,
      usage: {
        totalTokens: getTokenCountFromTracker(tracker),
        toolUses: agentResult.totalToolUseCount,
        durationMs: agentResult.totalDurationMs
      },
      toolUseId: toolUseContext.toolUseId,
      ...worktreeResult
    });
  } catch (error44) {
    if (stopSummarization?.(), error44 instanceof AbortError) {
      killAsyncAgent(taskId, rootSetAppState), logEvent("tengu_agent_tool_terminated", {
        agent_type: metadata.agentType,
        model: metadata.resolvedAgentModel,
        duration_ms: Date.now() - metadata.startTime,
        is_async: !0,
        is_built_in_agent: metadata.isBuiltInAgent,
        reason: "user_kill_async"
      });
      let worktreeResult2 = await getWorktreeResult(), partialResult = extractPartialResult(agentMessages);
      enqueueAgentNotification({
        taskId,
        description,
        status: "killed",
        setAppState: rootSetAppState,
        toolUseId: toolUseContext.toolUseId,
        finalMessage: partialResult,
        ...worktreeResult2
      });
      return;
    }
    let msg = errorMessage(error44);
    failAgentTask(taskId, msg, rootSetAppState);
    let worktreeResult = await getWorktreeResult();
    enqueueAgentNotification({
      taskId,
      description,
      status: "failed",
      error: msg,
      setAppState: rootSetAppState,
      toolUseId: toolUseContext.toolUseId,
      ...worktreeResult
    });
  } finally {
    clearInvokedSkillsForAgent(agentIdForCleanup), clearDumpState(agentIdForCleanup);
  }
}
var agentToolResultSchema;
var init_agentToolUtils = __esm(() => {
  init_v4();
  init_state();
  init_tools();
  init_agentSummary();
  init_dumpPrompts();
  init_Tool();
  init_LocalAgentTask();
  init_ids();
  init_agentSwarmsEnabled();
  init_errors();
  init_messages3();
  init_permissionRuleParser();
  init_sdkProgress();
  init_teammateContext();
  init_tokens();
  init_constants3();
  agentToolResultSchema = lazySchema(() => exports_external.object({
    agentId: exports_external.string(),
    agentType: exports_external.string().optional(),
    content: exports_external.array(exports_external.object({ type: exports_external.literal("text"), text: exports_external.string() })),
    totalToolUseCount: exports_external.number(),
    totalDurationMs: exports_external.number(),
    totalTokens: exports_external.number(),
    usage: exports_external.object({
      input_tokens: exports_external.number(),
      output_tokens: exports_external.number(),
      cache_creation_input_tokens: exports_external.number().nullable(),
      cache_read_input_tokens: exports_external.number().nullable(),
      server_tool_use: exports_external.object({
        web_search_requests: exports_external.number(),
        web_fetch_requests: exports_external.number()
      }).nullable(),
      service_tier: exports_external.enum(["standard", "priority", "batch"]).nullable(),
      cache_creation: exports_external.object({
        ephemeral_1h_input_tokens: exports_external.number(),
        ephemeral_5m_input_tokens: exports_external.number()
      }).nullable()
    })
  }));
});
