// Original: src/services/compact/autoCompact.ts
function getEffectiveContextWindowSize(model) {
  let reservedTokensForSummary = Math.min(getMaxOutputTokensForModel(model), MAX_OUTPUT_TOKENS_FOR_SUMMARY), contextWindow = getContextWindowForModel(model, getSdkBetas()), autoCompactWindow = process.env.CLAUDE_CODE_AUTO_COMPACT_WINDOW;
  if (autoCompactWindow) {
    let parsed = parseInt(autoCompactWindow, 10);
    if (!isNaN(parsed) && parsed > 0)
      contextWindow = Math.min(contextWindow, parsed);
  }
  return contextWindow - reservedTokensForSummary;
}
function getAutoCompactThreshold(model) {
  let effectiveContextWindow = getEffectiveContextWindowSize(model), autocompactThreshold = effectiveContextWindow - AUTOCOMPACT_BUFFER_TOKENS, envPercent = process.env.CLAUDE_AUTOCOMPACT_PCT_OVERRIDE;
  if (envPercent) {
    let parsed = parseFloat(envPercent);
    if (!isNaN(parsed) && parsed > 0 && parsed <= 100) {
      let percentageThreshold = Math.floor(effectiveContextWindow * (parsed / 100));
      return Math.min(percentageThreshold, autocompactThreshold);
    }
  }
  return autocompactThreshold;
}
function calculateTokenWarningState(tokenUsage, model) {
  let autoCompactThreshold = getAutoCompactThreshold(model), threshold = isAutoCompactEnabled() ? autoCompactThreshold : getEffectiveContextWindowSize(model), percentLeft = Math.max(0, Math.round((threshold - tokenUsage) / threshold * 100)), warningThreshold = threshold - WARNING_THRESHOLD_BUFFER_TOKENS, errorThreshold = threshold - ERROR_THRESHOLD_BUFFER_TOKENS, isAboveWarningThreshold = tokenUsage >= warningThreshold, isAboveErrorThreshold = tokenUsage >= errorThreshold, isAboveAutoCompactThreshold = isAutoCompactEnabled() && tokenUsage >= autoCompactThreshold, defaultBlockingLimit = getEffectiveContextWindowSize(model) - MANUAL_COMPACT_BUFFER_TOKENS, blockingLimitOverride = process.env.CLAUDE_CODE_BLOCKING_LIMIT_OVERRIDE, parsedOverride = blockingLimitOverride ? parseInt(blockingLimitOverride, 10) : NaN, blockingLimit = !isNaN(parsedOverride) && parsedOverride > 0 ? parsedOverride : defaultBlockingLimit, isAtBlockingLimit = tokenUsage >= blockingLimit;
  return {
    percentLeft,
    isAboveWarningThreshold,
    isAboveErrorThreshold,
    isAboveAutoCompactThreshold,
    isAtBlockingLimit
  };
}
function isAutoCompactEnabled() {
  if (isEnvTruthy(process.env.DISABLE_COMPACT))
    return !1;
  if (isEnvTruthy(process.env.DISABLE_AUTO_COMPACT))
    return !1;
  return getGlobalConfig().autoCompactEnabled;
}
async function shouldAutoCompact(messages, model, querySource, snipTokensFreed = 0) {
  if (querySource === "session_memory" || querySource === "compact")
    return !1;
  if (!isAutoCompactEnabled())
    return !1;
  let tokenCount = tokenCountWithEstimation(messages) - snipTokensFreed, threshold = getAutoCompactThreshold(model), effectiveWindow = getEffectiveContextWindowSize(model);
  logForDebugging(`autocompact: tokens=${tokenCount} threshold=${threshold} effectiveWindow=${effectiveWindow}${snipTokensFreed > 0 ? ` snipFreed=${snipTokensFreed}` : ""}`);
  let { isAboveAutoCompactThreshold } = calculateTokenWarningState(tokenCount, model);
  return isAboveAutoCompactThreshold;
}
async function autoCompactIfNeeded(messages, toolUseContext, cacheSafeParams, querySource, tracking, snipTokensFreed) {
  if (isEnvTruthy(process.env.DISABLE_COMPACT))
    return { wasCompacted: !1 };
  if (tracking?.consecutiveFailures !== void 0 && tracking.consecutiveFailures >= MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES)
    return { wasCompacted: !1 };
  let model = toolUseContext.options.mainLoopModel;
  if (!await shouldAutoCompact(messages, model, querySource, snipTokensFreed))
    return { wasCompacted: !1 };
  let recompactionInfo = {
    isRecompactionInChain: tracking?.compacted === !0,
    turnsSincePreviousCompact: tracking?.turnCounter ?? -1,
    previousCompactTurnId: tracking?.turnId,
    autoCompactThreshold: getAutoCompactThreshold(model),
    querySource
  }, sessionMemoryResult = await trySessionMemoryCompaction(messages, toolUseContext.agentId, recompactionInfo.autoCompactThreshold);
  if (sessionMemoryResult)
    return setLastSummarizedMessageId(void 0), runPostCompactCleanup(querySource), markPostCompaction(), {
      wasCompacted: !0,
      compactionResult: sessionMemoryResult
    };
  try {
    let compactionResult = await compactConversation(messages, toolUseContext, cacheSafeParams, !0, void 0, !0, recompactionInfo);
    return setLastSummarizedMessageId(void 0), runPostCompactCleanup(querySource), {
      wasCompacted: !0,
      compactionResult,
      consecutiveFailures: 0
    };
  } catch (error44) {
    if (!hasExactErrorMessage(error44, ERROR_MESSAGE_USER_ABORT))
      logError2(error44);
    let nextFailures = (tracking?.consecutiveFailures ?? 0) + 1;
    if (nextFailures >= MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES)
      logForDebugging(`autocompact: circuit breaker tripped after ${nextFailures} consecutive failures \u2014 skipping future attempts this session`, { level: "warn" });
    return { wasCompacted: !1, consecutiveFailures: nextFailures };
  }
}
var MAX_OUTPUT_TOKENS_FOR_SUMMARY = 20000, AUTOCOMPACT_BUFFER_TOKENS = 13000, WARNING_THRESHOLD_BUFFER_TOKENS = 20000, ERROR_THRESHOLD_BUFFER_TOKENS = 20000, MANUAL_COMPACT_BUFFER_TOKENS = 3000, MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES = 3;
var init_autoCompact = __esm(() => {
  init_state();
  init_state();
  init_config4();
  init_context();
  init_debug();
  init_envUtils();
  init_errors();
  init_log3();
  init_tokens();
  init_claude();
  init_sessionMemoryUtils();
  init_compact();
  init_postCompactCleanup();
  init_sessionMemoryCompact();
});
