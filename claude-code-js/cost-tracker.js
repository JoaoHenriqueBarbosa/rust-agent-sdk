// Original: src/cost-tracker.ts
function getStoredSessionCosts(sessionId) {
  let projectConfig = getCurrentProjectConfig();
  if (projectConfig.lastSessionId !== sessionId)
    return;
  let modelUsage;
  if (projectConfig.lastModelUsage)
    modelUsage = Object.fromEntries(Object.entries(projectConfig.lastModelUsage).map(([model, usage]) => [
      model,
      {
        ...usage,
        contextWindow: getContextWindowForModel(model, getSdkBetas()),
        maxOutputTokens: getModelMaxOutputTokens(model).default
      }
    ]));
  return {
    totalCostUSD: projectConfig.lastCost ?? 0,
    totalAPIDuration: projectConfig.lastAPIDuration ?? 0,
    totalAPIDurationWithoutRetries: projectConfig.lastAPIDurationWithoutRetries ?? 0,
    totalToolDuration: projectConfig.lastToolDuration ?? 0,
    totalLinesAdded: projectConfig.lastLinesAdded ?? 0,
    totalLinesRemoved: projectConfig.lastLinesRemoved ?? 0,
    lastDuration: projectConfig.lastDuration,
    modelUsage
  };
}
function restoreCostStateForSession(sessionId) {
  let data = getStoredSessionCosts(sessionId);
  if (!data)
    return !1;
  return setCostStateForRestore(data), !0;
}
function saveCurrentSessionCosts(fpsMetrics) {
  saveCurrentProjectConfig((current) => ({
    ...current,
    lastCost: getTotalCostUSD(),
    lastAPIDuration: getTotalAPIDuration(),
    lastAPIDurationWithoutRetries: getTotalAPIDurationWithoutRetries(),
    lastToolDuration: getTotalToolDuration(),
    lastDuration: getTotalDuration(),
    lastLinesAdded: getTotalLinesAdded(),
    lastLinesRemoved: getTotalLinesRemoved(),
    lastTotalInputTokens: getTotalInputTokens(),
    lastTotalOutputTokens: getTotalOutputTokens(),
    lastTotalCacheCreationInputTokens: getTotalCacheCreationInputTokens(),
    lastTotalCacheReadInputTokens: getTotalCacheReadInputTokens(),
    lastTotalWebSearchRequests: getTotalWebSearchRequests(),
    lastFpsAverage: fpsMetrics?.averageFps,
    lastFpsLow1Pct: fpsMetrics?.low1PctFps,
    lastModelUsage: Object.fromEntries(Object.entries(getModelUsage()).map(([model, usage]) => [
      model,
      {
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
        cacheReadInputTokens: usage.cacheReadInputTokens,
        cacheCreationInputTokens: usage.cacheCreationInputTokens,
        webSearchRequests: usage.webSearchRequests,
        costUSD: usage.costUSD
      }
    ])),
    lastSessionId: getSessionId()
  }));
}
function formatCost(cost, maxDecimalPlaces = 4) {
  return `$${cost > 0.5 ? round(cost, 100).toFixed(2) : cost.toFixed(maxDecimalPlaces)}`;
}
function formatModelUsage() {
  let modelUsageMap = getModelUsage();
  if (Object.keys(modelUsageMap).length === 0)
    return "Usage:                 0 input, 0 output, 0 cache read, 0 cache write";
  let usageByShortName = {};
  for (let [model, usage] of Object.entries(modelUsageMap)) {
    let shortName = getCanonicalName(model);
    if (!usageByShortName[shortName])
      usageByShortName[shortName] = {
        inputTokens: 0,
        outputTokens: 0,
        cacheReadInputTokens: 0,
        cacheCreationInputTokens: 0,
        webSearchRequests: 0,
        costUSD: 0,
        contextWindow: 0,
        maxOutputTokens: 0
      };
    let accumulated = usageByShortName[shortName];
    accumulated.inputTokens += usage.inputTokens, accumulated.outputTokens += usage.outputTokens, accumulated.cacheReadInputTokens += usage.cacheReadInputTokens, accumulated.cacheCreationInputTokens += usage.cacheCreationInputTokens, accumulated.webSearchRequests += usage.webSearchRequests, accumulated.costUSD += usage.costUSD;
  }
  let result = "Usage by model:";
  for (let [shortName, usage] of Object.entries(usageByShortName)) {
    let usageString = `  ${formatNumber(usage.inputTokens)} input, ${formatNumber(usage.outputTokens)} output, ${formatNumber(usage.cacheReadInputTokens)} cache read, ${formatNumber(usage.cacheCreationInputTokens)} cache write` + (usage.webSearchRequests > 0 ? `, ${formatNumber(usage.webSearchRequests)} web search` : "") + ` (${formatCost(usage.costUSD)})`;
    result += `
` + `${shortName}:`.padStart(21) + usageString;
  }
  return result;
}
function formatTotalCost() {
  let costDisplay = formatCost(getTotalCostUSD()) + (hasUnknownModelCost() ? " (costs may be inaccurate due to usage of unknown models)" : ""), modelUsageDisplay = formatModelUsage();
  return source_default.dim(`Total cost:            ${costDisplay}
Total duration (API):  ${formatDuration(getTotalAPIDuration())}
Total duration (wall): ${formatDuration(getTotalDuration())}
Total code changes:    ${getTotalLinesAdded()} ${getTotalLinesAdded() === 1 ? "line" : "lines"} added, ${getTotalLinesRemoved()} ${getTotalLinesRemoved() === 1 ? "line" : "lines"} removed
${modelUsageDisplay}`);
}
function round(number5, precision) {
  return Math.round(number5 * precision) / precision;
}
function addToTotalModelUsage(cost, usage, model) {
  let modelUsage = getUsageForModel(model) ?? {
    inputTokens: 0,
    outputTokens: 0,
    cacheReadInputTokens: 0,
    cacheCreationInputTokens: 0,
    webSearchRequests: 0,
    costUSD: 0,
    contextWindow: 0,
    maxOutputTokens: 0
  };
  return modelUsage.inputTokens += usage.input_tokens, modelUsage.outputTokens += usage.output_tokens, modelUsage.cacheReadInputTokens += usage.cache_read_input_tokens ?? 0, modelUsage.cacheCreationInputTokens += usage.cache_creation_input_tokens ?? 0, modelUsage.webSearchRequests += usage.server_tool_use?.web_search_requests ?? 0, modelUsage.costUSD += cost, modelUsage.contextWindow = getContextWindowForModel(model, getSdkBetas()), modelUsage.maxOutputTokens = getModelMaxOutputTokens(model).default, modelUsage;
}
function addToTotalSessionCost(cost, usage, model) {
  let modelUsage = addToTotalModelUsage(cost, usage, model);
  addToTotalCostState(cost, modelUsage, model);
  let attrs = isFastModeEnabled() && usage.speed === "fast" ? { model, speed: "fast" } : { model };
  getCostCounter()?.add(cost, attrs), getTokenCounter()?.add(usage.input_tokens, { ...attrs, type: "input" }), getTokenCounter()?.add(usage.output_tokens, { ...attrs, type: "output" }), getTokenCounter()?.add(usage.cache_read_input_tokens ?? 0, {
    ...attrs,
    type: "cacheRead"
  }), getTokenCounter()?.add(usage.cache_creation_input_tokens ?? 0, {
    ...attrs,
    type: "cacheCreation"
  });
  let totalCost = cost;
  for (let advisorUsage of getAdvisorUsage(usage)) {
    let advisorCost = calculateUSDCost(advisorUsage.model, advisorUsage);
    logEvent("tengu_advisor_tool_token_usage", {
      advisor_model: advisorUsage.model,
      input_tokens: advisorUsage.input_tokens,
      output_tokens: advisorUsage.output_tokens,
      cache_read_input_tokens: advisorUsage.cache_read_input_tokens ?? 0,
      cache_creation_input_tokens: advisorUsage.cache_creation_input_tokens ?? 0,
      cost_usd_micros: Math.round(advisorCost * 1e6)
    }), totalCost += addToTotalSessionCost(advisorCost, advisorUsage, advisorUsage.model);
  }
  return totalCost;
}
var init_cost_tracker = __esm(() => {
  init_source();
  init_state();
  init_advisor();
  init_config4();
  init_context();
  init_fastMode();
  init_format();
  init_model();
  init_modelCost();
});
