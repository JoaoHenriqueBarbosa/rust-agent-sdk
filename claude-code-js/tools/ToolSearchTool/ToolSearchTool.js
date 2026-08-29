// Original: src/tools/ToolSearchTool/ToolSearchTool.ts
var exports_ToolSearchTool = {};
__export(exports_ToolSearchTool, {
  outputSchema: () => outputSchema,
  inputSchema: () => inputSchema,
  clearToolSearchDescriptionCache: () => clearToolSearchDescriptionCache,
  ToolSearchTool: () => ToolSearchTool
});
function getDeferredToolsCacheKey(deferredTools) {
  return deferredTools.map((t2) => t2.name).sort().join(",");
}
function maybeInvalidateCache(deferredTools) {
  let currentKey = getDeferredToolsCacheKey(deferredTools);
  if (cachedDeferredToolNames !== currentKey)
    logForDebugging("ToolSearchTool: cache invalidated - deferred tools changed"), getToolDescriptionMemoized.cache.clear?.(), cachedDeferredToolNames = currentKey;
}
function clearToolSearchDescriptionCache() {
  getToolDescriptionMemoized.cache.clear?.(), cachedDeferredToolNames = null;
}
function buildSearchResult(matches, query, totalDeferredTools, pendingMcpServers) {
  return {
    data: {
      matches,
      query,
      total_deferred_tools: totalDeferredTools,
      ...pendingMcpServers && pendingMcpServers.length > 0 ? { pending_mcp_servers: pendingMcpServers } : {}
    }
  };
}
function parseToolName(name3) {
  if (name3.startsWith("mcp__")) {
    let withoutPrefix = name3.replace(/^mcp__/, "").toLowerCase();
    return {
      parts: withoutPrefix.split("__").flatMap((p4) => p4.split("_")).filter(Boolean),
      full: withoutPrefix.replace(/__/g, " ").replace(/_/g, " "),
      isMcp: !0
    };
  }
  let parts = name3.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/_/g, " ").toLowerCase().split(/\s+/).filter(Boolean);
  return {
    parts,
    full: parts.join(" "),
    isMcp: !1
  };
}
function compileTermPatterns(terms) {
  let patterns = /* @__PURE__ */ new Map;
  for (let term of terms)
    if (!patterns.has(term))
      patterns.set(term, new RegExp(`\\b${escapeRegExp(term)}\\b`));
  return patterns;
}
async function searchToolsWithKeywords(query, deferredTools, tools, maxResults) {
  let queryLower = query.toLowerCase().trim(), exactMatch = deferredTools.find((t2) => t2.name.toLowerCase() === queryLower) ?? tools.find((t2) => t2.name.toLowerCase() === queryLower);
  if (exactMatch)
    return [exactMatch.name];
  if (queryLower.startsWith("mcp__") && queryLower.length > 5) {
    let prefixMatches = deferredTools.filter((t2) => t2.name.toLowerCase().startsWith(queryLower)).slice(0, maxResults).map((t2) => t2.name);
    if (prefixMatches.length > 0)
      return prefixMatches;
  }
  let queryTerms = queryLower.split(/\s+/).filter((term) => term.length > 0), requiredTerms = [], optionalTerms = [];
  for (let term of queryTerms)
    if (term.startsWith("+") && term.length > 1)
      requiredTerms.push(term.slice(1));
    else
      optionalTerms.push(term);
  let allScoringTerms = requiredTerms.length > 0 ? [...requiredTerms, ...optionalTerms] : queryTerms, termPatterns = compileTermPatterns(allScoringTerms), candidateTools = deferredTools;
  if (requiredTerms.length > 0)
    candidateTools = (await Promise.all(deferredTools.map(async (tool) => {
      let parsed = parseToolName(tool.name), descNormalized = (await getToolDescriptionMemoized(tool.name, tools)).toLowerCase(), hintNormalized = tool.searchHint?.toLowerCase() ?? "";
      return requiredTerms.every((term) => {
        let pattern = termPatterns.get(term);
        return parsed.parts.includes(term) || parsed.parts.some((part) => part.includes(term)) || pattern.test(descNormalized) || hintNormalized && pattern.test(hintNormalized);
      }) ? tool : null;
    }))).filter((t2) => t2 !== null);
  return (await Promise.all(candidateTools.map(async (tool) => {
    let parsed = parseToolName(tool.name), descNormalized = (await getToolDescriptionMemoized(tool.name, tools)).toLowerCase(), hintNormalized = tool.searchHint?.toLowerCase() ?? "", score = 0;
    for (let term of allScoringTerms) {
      let pattern = termPatterns.get(term);
      if (parsed.parts.includes(term))
        score += parsed.isMcp ? 12 : 10;
      else if (parsed.parts.some((part) => part.includes(term)))
        score += parsed.isMcp ? 6 : 5;
      if (parsed.full.includes(term) && score === 0)
        score += 3;
      if (hintNormalized && pattern.test(hintNormalized))
        score += 4;
      if (pattern.test(descNormalized))
        score += 2;
    }
    return { name: tool.name, score };
  }))).filter((item) => item.score > 0).sort((a2, b) => b.score - a2.score).slice(0, maxResults).map((item) => item.name);
}
var inputSchema, outputSchema, cachedDeferredToolNames = null, getToolDescriptionMemoized, ToolSearchTool;
var init_ToolSearchTool = __esm(() => {
  init_memoize();
  init_v4();
  init_Tool();
  init_debug();
  init_toolSearch();
  init_prompt8();
  inputSchema = lazySchema(() => exports_external.object({
    query: exports_external.string().describe('Query to find deferred tools. Use "select:<tool_name>" for direct selection, or keywords to search.'),
    max_results: exports_external.number().optional().default(5).describe("Maximum number of results to return (default: 5)")
  })), outputSchema = lazySchema(() => exports_external.object({
    matches: exports_external.array(exports_external.string()),
    query: exports_external.string(),
    total_deferred_tools: exports_external.number(),
    pending_mcp_servers: exports_external.array(exports_external.string()).optional()
  }));
  getToolDescriptionMemoized = memoize_default(async (toolName, tools) => {
    let tool = findToolByName(tools, toolName);
    if (!tool)
      return "";
    return tool.prompt({
      getToolPermissionContext: async () => ({
        mode: "default",
        additionalWorkingDirectories: /* @__PURE__ */ new Map,
        alwaysAllowRules: {},
        alwaysDenyRules: {},
        alwaysAskRules: {},
        isBypassPermissionsModeAvailable: !1
      }),
      tools,
      agents: []
    });
  }, (toolName) => toolName);
  ToolSearchTool = buildTool({
    isEnabled() {
      return isToolSearchEnabledOptimistic();
    },
    isConcurrencySafe() {
      return !0;
    },
    isReadOnly() {
      return !0;
    },
    name: TOOL_SEARCH_TOOL_NAME,
    maxResultSizeChars: 1e5,
    async description() {
      return getPrompt2();
    },
    async prompt() {
      return getPrompt2();
    },
    get inputSchema() {
      return inputSchema();
    },
    get outputSchema() {
      return outputSchema();
    },
    async call(input, { options: { tools }, getAppState }) {
      let { query, max_results = 5 } = input, deferredTools = tools.filter(isDeferredTool);
      maybeInvalidateCache(deferredTools);
      function getPendingServerNames() {
        let pending = getAppState().mcp.clients.filter((c3) => c3.type === "pending");
        return pending.length > 0 ? pending.map((s2) => s2.name) : void 0;
      }
      function logSearchOutcome(matches2, queryType) {
        logEvent("tengu_tool_search_outcome", {
          query,
          queryType,
          matchCount: matches2.length,
          totalDeferredTools: deferredTools.length,
          maxResults: max_results,
          hasMatches: matches2.length > 0
        });
      }
      let selectMatch = query.match(/^select:(.+)$/i);
      if (selectMatch) {
        let requested = selectMatch[1].split(",").map((s2) => s2.trim()).filter(Boolean), found = [], missing = [];
        for (let toolName of requested) {
          let tool = findToolByName(deferredTools, toolName) ?? findToolByName(tools, toolName);
          if (tool) {
            if (!found.includes(tool.name))
              found.push(tool.name);
          } else
            missing.push(toolName);
        }
        if (found.length === 0) {
          logForDebugging(`ToolSearchTool: select failed \u2014 none found: ${missing.join(", ")}`), logSearchOutcome([], "select");
          let pendingServers = getPendingServerNames();
          return buildSearchResult([], query, deferredTools.length, pendingServers);
        }
        if (missing.length > 0)
          logForDebugging(`ToolSearchTool: partial select \u2014 found: ${found.join(", ")}, missing: ${missing.join(", ")}`);
        else
          logForDebugging(`ToolSearchTool: selected ${found.join(", ")}`);
        return logSearchOutcome(found, "select"), buildSearchResult(found, query, deferredTools.length);
      }
      let matches = await searchToolsWithKeywords(query, deferredTools, tools, max_results);
      if (logForDebugging(`ToolSearchTool: keyword search for "${query}", found ${matches.length} matches`), logSearchOutcome(matches, "keyword"), matches.length === 0) {
        let pendingServers = getPendingServerNames();
        return buildSearchResult(matches, query, deferredTools.length, pendingServers);
      }
      return buildSearchResult(matches, query, deferredTools.length);
    },
    renderToolUseMessage() {
      return null;
    },
    userFacingName: () => "",
    mapToolResultToToolResultBlockParam(content, toolUseID) {
      if (content.matches.length === 0) {
        let text2 = "No matching deferred tools found";
        if (content.pending_mcp_servers && content.pending_mcp_servers.length > 0)
          text2 += `. Some MCP servers are still connecting: ${content.pending_mcp_servers.join(", ")}. Their tools will become available shortly \u2014 try searching again.`;
        return {
          type: "tool_result",
          tool_use_id: toolUseID,
          content: text2
        };
      }
      return {
        type: "tool_result",
        tool_use_id: toolUseID,
        content: content.matches.map((name3) => ({
          type: "tool_reference",
          tool_name: name3
        }))
      };
    }
  });
});
