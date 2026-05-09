// Original: src/utils/telemetry/perfettoTracing.ts
function stringToNumericHash(str2) {
  return Math.abs(djb2Hash(str2)) || 1;
}
function getProcessIdForAgent(agentId) {
  let existing = agentIdToProcessId.get(agentId);
  if (existing !== void 0)
    return existing;
  return processIdCounter++, agentIdToProcessId.set(agentId, processIdCounter), processIdCounter;
}
function getCurrentAgentInfo() {
  let agentId = getAgentId() ?? getSessionId(), agentName = getAgentName() ?? "main", parentSessionId = getParentSessionId2(), existing = agentRegistry.get(agentId);
  if (existing)
    return existing;
  let info = {
    agentId,
    agentName,
    parentAgentId: parentSessionId,
    processId: agentId === getSessionId() ? 1 : getProcessIdForAgent(agentId),
    threadId: stringToNumericHash(agentName)
  };
  return agentRegistry.set(agentId, info), totalAgentCount++, info;
}
function getTimestamp() {
  return (Date.now() - startTimeMs) * 1000;
}
function generateSpanId() {
  return `span_${++spanIdCounter}`;
}
function initializePerfettoTracing() {
  let envValue = process.env.CLAUDE_CODE_PERFETTO_TRACE;
  logForDebugging(`[Perfetto] initializePerfettoTracing called, env value: ${envValue}`);
}
function emitProcessMetadata(agentInfo) {
  if (!isEnabled)
    return;
  if (metadataEvents.push({
    name: "process_name",
    cat: "__metadata",
    ph: "M",
    ts: 0,
    pid: agentInfo.processId,
    tid: 0,
    args: { name: agentInfo.agentName }
  }), metadataEvents.push({
    name: "thread_name",
    cat: "__metadata",
    ph: "M",
    ts: 0,
    pid: agentInfo.processId,
    tid: agentInfo.threadId,
    args: { name: agentInfo.agentName }
  }), agentInfo.parentAgentId)
    metadataEvents.push({
      name: "parent_agent",
      cat: "__metadata",
      ph: "M",
      ts: 0,
      pid: agentInfo.processId,
      tid: 0,
      args: {
        parent_agent_id: agentInfo.parentAgentId
      }
    });
}
function isPerfettoTracingEnabled() {
  return isEnabled;
}
function registerAgent(agentId, agentName, parentAgentId) {
  if (!isEnabled)
    return;
  let info = {
    agentId,
    agentName,
    parentAgentId,
    processId: getProcessIdForAgent(agentId),
    threadId: stringToNumericHash(agentName)
  };
  agentRegistry.set(agentId, info), totalAgentCount++, emitProcessMetadata(info);
}
function unregisterAgent(agentId) {
  if (!isEnabled)
    return;
  agentRegistry.delete(agentId), agentIdToProcessId.delete(agentId);
}
function startLLMRequestPerfettoSpan(args) {
  if (!isEnabled)
    return "";
  let spanId = generateSpanId(), agentInfo = getCurrentAgentInfo();
  return pendingSpans.set(spanId, {
    name: "API Call",
    category: "api",
    startTime: getTimestamp(),
    agentInfo,
    args: {
      model: args.model,
      prompt_tokens: args.promptTokens,
      message_id: args.messageId,
      is_speculative: args.isSpeculative ?? !1,
      query_source: args.querySource
    }
  }), events.push({
    name: "API Call",
    cat: "api",
    ph: "B",
    ts: pendingSpans.get(spanId).startTime,
    pid: agentInfo.processId,
    tid: agentInfo.threadId,
    args: pendingSpans.get(spanId).args
  }), spanId;
}
function endLLMRequestPerfettoSpan(spanId, metadata) {
  if (!isEnabled || !spanId)
    return;
  let pending = pendingSpans.get(spanId);
  if (!pending)
    return;
  let endTime = getTimestamp(), duration3 = endTime - pending.startTime, promptTokens = metadata.promptTokens ?? pending.args.prompt_tokens, ttftMs = metadata.ttftMs, ttltMs = metadata.ttltMs, outputTokens = metadata.outputTokens, cacheReadTokens = metadata.cacheReadTokens, itps = ttftMs !== void 0 && promptTokens !== void 0 && ttftMs > 0 ? Math.round(promptTokens / (ttftMs / 1000) * 100) / 100 : void 0, samplingMs = ttltMs !== void 0 && ttftMs !== void 0 ? ttltMs - ttftMs : void 0, otps = samplingMs !== void 0 && outputTokens !== void 0 && samplingMs > 0 ? Math.round(outputTokens / (samplingMs / 1000) * 100) / 100 : void 0, cacheHitRate = cacheReadTokens !== void 0 && promptTokens !== void 0 && promptTokens > 0 ? Math.round(cacheReadTokens / promptTokens * 1e4) / 100 : void 0, requestSetupMs = metadata.requestSetupMs, attemptStartTimes = metadata.attemptStartTimes, args = {
    ...pending.args,
    ttft_ms: ttftMs,
    ttlt_ms: ttltMs,
    prompt_tokens: promptTokens,
    output_tokens: outputTokens,
    cache_read_tokens: cacheReadTokens,
    cache_creation_tokens: metadata.cacheCreationTokens,
    message_id: metadata.messageId ?? pending.args.message_id,
    success: metadata.success ?? !0,
    error: metadata.error,
    duration_ms: duration3 / 1000,
    request_setup_ms: requestSetupMs,
    itps,
    otps,
    cache_hit_rate_pct: cacheHitRate
  }, setupUs = requestSetupMs !== void 0 && requestSetupMs > 0 ? requestSetupMs * 1000 : 0;
  if (setupUs > 0) {
    let setupEndTs = pending.startTime + setupUs;
    if (events.push({
      name: "Request Setup",
      cat: "api,setup",
      ph: "B",
      ts: pending.startTime,
      pid: pending.agentInfo.processId,
      tid: pending.agentInfo.threadId,
      args: {
        request_setup_ms: requestSetupMs,
        attempt_count: attemptStartTimes?.length ?? 1
      }
    }), attemptStartTimes && attemptStartTimes.length > 1) {
      let baseWallMs = attemptStartTimes[0];
      for (let i5 = 0;i5 < attemptStartTimes.length - 1; i5++) {
        let attemptStartUs = pending.startTime + (attemptStartTimes[i5] - baseWallMs) * 1000, attemptEndUs = pending.startTime + (attemptStartTimes[i5 + 1] - baseWallMs) * 1000;
        events.push({
          name: `Attempt ${i5 + 1} (retry)`,
          cat: "api,retry",
          ph: "B",
          ts: attemptStartUs,
          pid: pending.agentInfo.processId,
          tid: pending.agentInfo.threadId,
          args: { attempt: i5 + 1 }
        }), events.push({
          name: `Attempt ${i5 + 1} (retry)`,
          cat: "api,retry",
          ph: "E",
          ts: attemptEndUs,
          pid: pending.agentInfo.processId,
          tid: pending.agentInfo.threadId
        });
      }
    }
    events.push({
      name: "Request Setup",
      cat: "api,setup",
      ph: "E",
      ts: setupEndTs,
      pid: pending.agentInfo.processId,
      tid: pending.agentInfo.threadId
    });
  }
  if (ttftMs !== void 0) {
    let firstTokenStartTs = pending.startTime + setupUs, firstTokenEndTs = firstTokenStartTs + ttftMs * 1000;
    events.push({
      name: "First Token",
      cat: "api,ttft",
      ph: "B",
      ts: firstTokenStartTs,
      pid: pending.agentInfo.processId,
      tid: pending.agentInfo.threadId,
      args: {
        ttft_ms: ttftMs,
        prompt_tokens: promptTokens,
        itps,
        cache_hit_rate_pct: cacheHitRate
      }
    }), events.push({
      name: "First Token",
      cat: "api,ttft",
      ph: "E",
      ts: firstTokenEndTs,
      pid: pending.agentInfo.processId,
      tid: pending.agentInfo.threadId
    });
    let actualSamplingMs = ttltMs !== void 0 ? ttltMs - ttftMs - setupUs / 1000 : void 0;
    if (actualSamplingMs !== void 0 && actualSamplingMs > 0)
      events.push({
        name: "Sampling",
        cat: "api,sampling",
        ph: "B",
        ts: firstTokenEndTs,
        pid: pending.agentInfo.processId,
        tid: pending.agentInfo.threadId,
        args: {
          sampling_ms: actualSamplingMs,
          output_tokens: outputTokens,
          otps
        }
      }), events.push({
        name: "Sampling",
        cat: "api,sampling",
        ph: "E",
        ts: firstTokenEndTs + actualSamplingMs * 1000,
        pid: pending.agentInfo.processId,
        tid: pending.agentInfo.threadId
      });
  }
  events.push({
    name: pending.name,
    cat: pending.category,
    ph: "E",
    ts: endTime,
    pid: pending.agentInfo.processId,
    tid: pending.agentInfo.threadId,
    args
  }), pendingSpans.delete(spanId);
}
function startToolPerfettoSpan(toolName, args) {
  if (!isEnabled)
    return "";
  let spanId = generateSpanId(), agentInfo = getCurrentAgentInfo();
  return pendingSpans.set(spanId, {
    name: `Tool: ${toolName}`,
    category: "tool",
    startTime: getTimestamp(),
    agentInfo,
    args: {
      tool_name: toolName,
      ...args
    }
  }), events.push({
    name: `Tool: ${toolName}`,
    cat: "tool",
    ph: "B",
    ts: pendingSpans.get(spanId).startTime,
    pid: agentInfo.processId,
    tid: agentInfo.threadId,
    args: pendingSpans.get(spanId).args
  }), spanId;
}
function endToolPerfettoSpan(spanId, metadata) {
  if (!isEnabled || !spanId)
    return;
  let pending = pendingSpans.get(spanId);
  if (!pending)
    return;
  let endTime = getTimestamp(), duration3 = endTime - pending.startTime, args = {
    ...pending.args,
    success: metadata?.success ?? !0,
    error: metadata?.error,
    result_tokens: metadata?.resultTokens,
    duration_ms: duration3 / 1000
  };
  events.push({
    name: pending.name,
    cat: pending.category,
    ph: "E",
    ts: endTime,
    pid: pending.agentInfo.processId,
    tid: pending.agentInfo.threadId,
    args
  }), pendingSpans.delete(spanId);
}
function startUserInputPerfettoSpan(context3) {
  if (!isEnabled)
    return "";
  let spanId = generateSpanId(), agentInfo = getCurrentAgentInfo();
  return pendingSpans.set(spanId, {
    name: "Waiting for User Input",
    category: "user_input",
    startTime: getTimestamp(),
    agentInfo,
    args: {
      context: context3
    }
  }), events.push({
    name: "Waiting for User Input",
    cat: "user_input",
    ph: "B",
    ts: pendingSpans.get(spanId).startTime,
    pid: agentInfo.processId,
    tid: agentInfo.threadId,
    args: pendingSpans.get(spanId).args
  }), spanId;
}
function endUserInputPerfettoSpan(spanId, metadata) {
  if (!isEnabled || !spanId)
    return;
  let pending = pendingSpans.get(spanId);
  if (!pending)
    return;
  let endTime = getTimestamp(), duration3 = endTime - pending.startTime, args = {
    ...pending.args,
    decision: metadata?.decision,
    source: metadata?.source,
    duration_ms: duration3 / 1000
  };
  events.push({
    name: pending.name,
    cat: pending.category,
    ph: "E",
    ts: endTime,
    pid: pending.agentInfo.processId,
    tid: pending.agentInfo.threadId,
    args
  }), pendingSpans.delete(spanId);
}
function startInteractionPerfettoSpan(userPrompt) {
  if (!isEnabled)
    return "";
  let spanId = generateSpanId(), agentInfo = getCurrentAgentInfo();
  return pendingSpans.set(spanId, {
    name: "Interaction",
    category: "interaction",
    startTime: getTimestamp(),
    agentInfo,
    args: {
      user_prompt_length: userPrompt?.length
    }
  }), events.push({
    name: "Interaction",
    cat: "interaction",
    ph: "B",
    ts: pendingSpans.get(spanId).startTime,
    pid: agentInfo.processId,
    tid: agentInfo.threadId,
    args: pendingSpans.get(spanId).args
  }), spanId;
}
function endInteractionPerfettoSpan(spanId) {
  if (!isEnabled || !spanId)
    return;
  let pending = pendingSpans.get(spanId);
  if (!pending)
    return;
  let endTime = getTimestamp(), duration3 = endTime - pending.startTime;
  events.push({
    name: pending.name,
    cat: pending.category,
    ph: "E",
    ts: endTime,
    pid: pending.agentInfo.processId,
    tid: pending.agentInfo.threadId,
    args: {
      ...pending.args,
      duration_ms: duration3 / 1000
    }
  }), pendingSpans.delete(spanId);
}
var isEnabled = !1, metadataEvents, events, pendingSpans, agentRegistry, totalAgentCount = 0, startTimeMs = 0, spanIdCounter = 0, processIdCounter = 1, agentIdToProcessId;
var init_perfettoTracing = __esm(() => {
  init_state();
  init_cleanupRegistry();
  init_debug();
  init_envUtils();
  init_errors();
  init_slowOperations();
  init_teammate();
  metadataEvents = [], events = [], pendingSpans = /* @__PURE__ */ new Map, agentRegistry = /* @__PURE__ */ new Map, agentIdToProcessId = /* @__PURE__ */ new Map;
});
