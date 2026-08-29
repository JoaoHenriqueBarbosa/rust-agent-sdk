// Original: src/utils/toolSearch.ts
var exports_toolSearch = {};
__export(exports_toolSearch, {
  modelSupportsToolReference: () => modelSupportsToolReference,
  isToolSearchToolAvailable: () => isToolSearchToolAvailable,
  isToolSearchEnabledOptimistic: () => isToolSearchEnabledOptimistic,
  isToolSearchEnabled: () => isToolSearchEnabled,
  isToolReferenceBlock: () => isToolReferenceBlock,
  isDeferredToolsDeltaEnabled: () => isDeferredToolsDeltaEnabled,
  getToolSearchMode: () => getToolSearchMode,
  getDeferredToolsDelta: () => getDeferredToolsDelta,
  getAutoToolSearchCharThreshold: () => getAutoToolSearchCharThreshold,
  extractDiscoveredToolNames: () => extractDiscoveredToolNames
});
function parseAutoPercentage(value) {
  if (!value.startsWith("auto:"))
    return null;
  let percentStr = value.slice(5), percent = parseInt(percentStr, 10);
  if (isNaN(percent))
    return logForDebugging(`Invalid ENABLE_TOOL_SEARCH value "${value}": expected auto:N where N is a number.`), null;
  return Math.max(0, Math.min(100, percent));
}
function isAutoToolSearchMode(value) {
  if (!value)
    return !1;
  return value === "auto" || value.startsWith("auto:");
}
function getAutoToolSearchPercentage() {
  let value = process.env.ENABLE_TOOL_SEARCH;
  if (!value)
    return DEFAULT_AUTO_TOOL_SEARCH_PERCENTAGE;
  if (value === "auto")
    return DEFAULT_AUTO_TOOL_SEARCH_PERCENTAGE;
  let parsed = parseAutoPercentage(value);
  if (parsed !== null)
    return parsed;
  return DEFAULT_AUTO_TOOL_SEARCH_PERCENTAGE;
}
function getAutoToolSearchTokenThreshold(model) {
  let betas = getMergedBetas(model), contextWindow = getContextWindowForModel(model, betas), percentage = getAutoToolSearchPercentage() / 100;
  return Math.floor(contextWindow * percentage);
}
function getAutoToolSearchCharThreshold(model) {
  return Math.floor(getAutoToolSearchTokenThreshold(model) * CHARS_PER_TOKEN2);
}
function getToolSearchMode() {
  if (isEnvTruthy(process.env.CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS))
    return "standard";
  let value = process.env.ENABLE_TOOL_SEARCH, autoPercent = value ? parseAutoPercentage(value) : null;
  if (autoPercent === 0)
    return "tst";
  if (autoPercent === 100)
    return "standard";
  if (isAutoToolSearchMode(value))
    return "tst-auto";
  if (isEnvTruthy(value))
    return "tst";
  if (isEnvDefinedFalsy(process.env.ENABLE_TOOL_SEARCH))
    return "standard";
  return "tst";
}
function getUnsupportedToolReferencePatterns() {
  return DEFAULT_UNSUPPORTED_MODEL_PATTERNS;
}
function modelSupportsToolReference(model) {
  let normalizedModel = model.toLowerCase(), unsupportedPatterns = getUnsupportedToolReferencePatterns();
  for (let pattern of unsupportedPatterns)
    if (normalizedModel.includes(pattern.toLowerCase()))
      return !1;
  return !0;
}
function isToolSearchEnabledOptimistic() {
  let mode = getToolSearchMode();
  if (mode === "standard") {
    if (!loggedOptimistic)
      loggedOptimistic = !0, logForDebugging(`[ToolSearch:optimistic] mode=${mode}, ENABLE_TOOL_SEARCH=${process.env.ENABLE_TOOL_SEARCH}, result=false`);
    return !1;
  }
  if (!process.env.ENABLE_TOOL_SEARCH && getAPIProvider() === "firstParty" && !isFirstPartyAnthropicBaseUrl()) {
    if (!loggedOptimistic)
      loggedOptimistic = !0, logForDebugging(`[ToolSearch:optimistic] disabled: ANTHROPIC_BASE_URL=${process.env.ANTHROPIC_BASE_URL} is not a first-party Anthropic host. Set ENABLE_TOOL_SEARCH=true (or auto / auto:N) if your proxy forwards tool_reference blocks.`);
    return !1;
  }
  if (!loggedOptimistic)
    loggedOptimistic = !0, logForDebugging(`[ToolSearch:optimistic] mode=${mode}, ENABLE_TOOL_SEARCH=${process.env.ENABLE_TOOL_SEARCH}, result=true`);
  return !0;
}
function isToolSearchToolAvailable(tools) {
  return tools.some((tool) => toolMatchesName(tool, TOOL_SEARCH_TOOL_NAME));
}
async function calculateDeferredToolDescriptionChars(tools, getToolPermissionContext, agents) {
  let deferredTools = tools.filter((t2) => isDeferredTool(t2));
  if (deferredTools.length === 0)
    return 0;
  return (await Promise.all(deferredTools.map(async (tool) => {
    let description = await tool.prompt({
      getToolPermissionContext,
      tools,
      agents
    }), inputSchema40 = tool.inputJSONSchema ? jsonStringify(tool.inputJSONSchema) : tool.inputSchema ? jsonStringify(zodToJsonSchema3(tool.inputSchema)) : "";
    return tool.name.length + description.length + inputSchema40.length;
  }))).reduce((total, size) => total + size, 0);
}
async function isToolSearchEnabled(model, tools, getToolPermissionContext, agents, source) {
  let mcpToolCount = count2(tools, (t2) => t2.isMcp);
  function logModeDecision(enabled2, mode2, reason, extraProps) {
    logEvent("tengu_tool_search_mode_decision", {
      enabled: enabled2,
      mode: mode2,
      reason,
      checkedModel: model,
      mcpToolCount,
      userType: "external",
      ...extraProps
    });
  }
  if (!modelSupportsToolReference(model))
    return logForDebugging(`Tool search disabled for model '${model}': model does not support tool_reference blocks. This feature is only available on Claude Sonnet 4+, Opus 4+, and newer models.`), logModeDecision(!1, "standard", "model_unsupported"), !1;
  if (!isToolSearchToolAvailable(tools))
    return logForDebugging("Tool search disabled: ToolSearchTool is not available (may have been disallowed via disallowedTools)."), logModeDecision(!1, "standard", "mcp_search_unavailable"), !1;
  let mode = getToolSearchMode();
  switch (mode) {
    case "tst":
      return logModeDecision(!0, mode, "tst_enabled"), !0;
    case "tst-auto": {
      let { enabled: enabled2, debugDescription, metrics } = await checkAutoThreshold(tools, getToolPermissionContext, agents, model);
      if (enabled2)
        return logForDebugging(`Auto tool search enabled: ${debugDescription}` + (source ? ` [source: ${source}]` : "")), logModeDecision(!0, mode, "auto_above_threshold", metrics), !0;
      return logForDebugging(`Auto tool search disabled: ${debugDescription}` + (source ? ` [source: ${source}]` : "")), logModeDecision(!1, mode, "auto_below_threshold", metrics), !1;
    }
    case "standard":
      return logModeDecision(!1, mode, "standard_mode"), !1;
  }
}
function isToolReferenceBlock(obj) {
  return typeof obj === "object" && obj !== null && "type" in obj && obj.type === "tool_reference";
}
function isToolReferenceWithName(obj) {
  return isToolReferenceBlock(obj) && "tool_name" in obj && typeof obj.tool_name === "string";
}
function isToolResultBlockWithContent(obj) {
  return typeof obj === "object" && obj !== null && "type" in obj && obj.type === "tool_result" && "content" in obj && Array.isArray(obj.content);
}
function extractDiscoveredToolNames(messages) {
  let discoveredTools = /* @__PURE__ */ new Set, carriedFromBoundary = 0;
  for (let msg of messages) {
    if (msg.type === "system" && msg.subtype === "compact_boundary") {
      let carried = msg.compactMetadata?.preCompactDiscoveredTools;
      if (carried) {
        for (let name3 of carried)
          discoveredTools.add(name3);
        carriedFromBoundary += carried.length;
      }
      continue;
    }
    if (msg.type !== "user")
      continue;
    let content = msg.message?.content;
    if (!Array.isArray(content))
      continue;
    for (let block2 of content)
      if (isToolResultBlockWithContent(block2)) {
        for (let item of block2.content)
          if (isToolReferenceWithName(item))
            discoveredTools.add(item.tool_name);
      }
  }
  if (discoveredTools.size > 0)
    logForDebugging(`Dynamic tool loading: found ${discoveredTools.size} discovered tools in message history` + (carriedFromBoundary > 0 ? ` (${carriedFromBoundary} carried from compact boundary)` : ""));
  return discoveredTools;
}
function isDeferredToolsDeltaEnabled() {
  return !1;
}
function getDeferredToolsDelta(tools, messages, scanContext) {
  let announced = /* @__PURE__ */ new Set, attachmentCount = 0, dtdCount = 0, attachmentTypesSeen = /* @__PURE__ */ new Set;
  for (let msg of messages) {
    if (msg.type !== "attachment")
      continue;
    if (attachmentCount++, attachmentTypesSeen.add(msg.attachment.type), msg.attachment.type !== "deferred_tools_delta")
      continue;
    dtdCount++;
    for (let n5 of msg.attachment.addedNames)
      announced.add(n5);
    for (let n5 of msg.attachment.removedNames)
      announced.delete(n5);
  }
  let deferred = tools.filter(isDeferredTool), deferredNames = new Set(deferred.map((t2) => t2.name)), poolNames = new Set(tools.map((t2) => t2.name)), added = deferred.filter((t2) => !announced.has(t2.name)), removed = [];
  for (let n5 of announced) {
    if (deferredNames.has(n5))
      continue;
    if (!poolNames.has(n5))
      removed.push(n5);
  }
  if (added.length === 0 && removed.length === 0)
    return null;
  return logEvent("tengu_deferred_tools_pool_change", {
    addedCount: added.length,
    removedCount: removed.length,
    priorAnnouncedCount: announced.size,
    messagesLength: messages.length,
    attachmentCount,
    dtdCount,
    callSite: scanContext?.callSite ?? "unknown",
    querySource: scanContext?.querySource ?? "unknown",
    attachmentTypesSeen: [...attachmentTypesSeen].sort().join(",")
  }), {
    addedNames: added.map((t2) => t2.name).sort(),
    addedLines: added.map(formatDeferredToolLine).sort(),
    removedNames: removed.sort()
  };
}
async function checkAutoThreshold(tools, getToolPermissionContext, agents, model) {
  let deferredToolTokens = await getDeferredToolTokenCount(tools, getToolPermissionContext, agents, model);
  if (deferredToolTokens !== null) {
    let threshold = getAutoToolSearchTokenThreshold(model);
    return {
      enabled: deferredToolTokens >= threshold,
      debugDescription: `${deferredToolTokens} tokens (threshold: ${threshold}, ${getAutoToolSearchPercentage()}% of context)`,
      metrics: { deferredToolTokens, threshold }
    };
  }
  let deferredToolDescriptionChars = await calculateDeferredToolDescriptionChars(tools, getToolPermissionContext, agents), charThreshold = getAutoToolSearchCharThreshold(model);
  return {
    enabled: deferredToolDescriptionChars >= charThreshold,
    debugDescription: `${deferredToolDescriptionChars} chars (threshold: ${charThreshold}, ${getAutoToolSearchPercentage()}% of context) (char fallback)`,
    metrics: { deferredToolDescriptionChars, charThreshold }
  };
}
var DEFAULT_AUTO_TOOL_SEARCH_PERCENTAGE = 10, CHARS_PER_TOKEN2 = 2.5, getDeferredToolTokenCount, DEFAULT_UNSUPPORTED_MODEL_PATTERNS, loggedOptimistic = !1;
var init_toolSearch = __esm(() => {
  init_memoize();
  init_Tool();
  init_prompt8();
  init_analyzeContext();
  init_betas2();
  init_context();
  init_debug();
  init_envUtils();
  init_providers();
  init_slowOperations();
  init_zodToJsonSchema2();
  getDeferredToolTokenCount = memoize_default(async (tools, getToolPermissionContext, agents, model) => {
    let deferredTools = tools.filter((t2) => isDeferredTool(t2));
    if (deferredTools.length === 0)
      return 0;
    try {
      let total = await countToolDefinitionTokens(deferredTools, getToolPermissionContext, { activeAgents: agents, allAgents: agents }, model);
      if (total === 0)
        return null;
      return Math.max(0, total - TOOL_TOKEN_COUNT_OVERHEAD);
    } catch {
      return null;
    }
  }, (tools) => tools.filter((t2) => isDeferredTool(t2)).map((t2) => t2.name).join(","));
  DEFAULT_UNSUPPORTED_MODEL_PATTERNS = ["haiku"];
});
