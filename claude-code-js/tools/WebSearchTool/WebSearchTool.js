// Original: src/tools/WebSearchTool/WebSearchTool.ts
function makeToolSchema(input) {
  return {
    type: "web_search_20250305",
    name: "web_search",
    allowed_domains: input.allowed_domains,
    blocked_domains: input.blocked_domains,
    max_uses: 8
  };
}
function makeOutputFromSearchResponse(result, query3, durationSeconds) {
  let results = [], textAcc = "", inText = !0;
  for (let block2 of result) {
    if (block2.type === "server_tool_use") {
      if (inText) {
        if (inText = !1, textAcc.trim().length > 0)
          results.push(textAcc.trim());
        textAcc = "";
      }
      continue;
    }
    if (block2.type === "web_search_tool_result") {
      if (!Array.isArray(block2.content)) {
        let errorMessage2 = `Web search error: ${block2.content.error_code}`;
        logError2(Error(errorMessage2)), results.push(errorMessage2);
        continue;
      }
      let hits = block2.content.map((r4) => ({ title: r4.title, url: r4.url }));
      results.push({
        tool_use_id: block2.tool_use_id,
        content: hits
      });
    }
    if (block2.type === "text")
      if (inText)
        textAcc += block2.text;
      else
        inText = !0, textAcc = block2.text;
  }
  if (textAcc.length)
    results.push(textAcc.trim());
  return {
    query: query3,
    results,
    durationSeconds
  };
}
var inputSchema21, searchResultSchema, outputSchema17, WebSearchTool;
var init_WebSearchTool = __esm(() => {
  init_providers();
  init_v4();
  init_claude();
  init_Tool();
  init_log3();
  init_messages3();
  init_model();
  init_slowOperations();
  init_prompt6();
  init_UI16();
  inputSchema21 = lazySchema(() => exports_external.strictObject({
    query: exports_external.string().min(2).describe("The search query to use"),
    allowed_domains: exports_external.array(exports_external.string()).optional().describe("Only include search results from these domains"),
    blocked_domains: exports_external.array(exports_external.string()).optional().describe("Never include search results from these domains")
  })), searchResultSchema = lazySchema(() => {
    let searchHitSchema = exports_external.object({
      title: exports_external.string().describe("The title of the search result"),
      url: exports_external.string().describe("The URL of the search result")
    });
    return exports_external.object({
      tool_use_id: exports_external.string().describe("ID of the tool use"),
      content: exports_external.array(searchHitSchema).describe("Array of search hits")
    });
  }), outputSchema17 = lazySchema(() => exports_external.object({
    query: exports_external.string().describe("The search query that was executed"),
    results: exports_external.array(exports_external.union([searchResultSchema(), exports_external.string()])).describe("Search results and/or text commentary from the model"),
    durationSeconds: exports_external.number().describe("Time taken to complete the search operation")
  }));
  WebSearchTool = buildTool({
    name: WEB_SEARCH_TOOL_NAME,
    searchHint: "search the web for current information",
    maxResultSizeChars: 1e5,
    shouldDefer: !0,
    async description(input) {
      return `Claude wants to search the web for: ${input.query}`;
    },
    userFacingName() {
      return "Web Search";
    },
    getToolUseSummary: getToolUseSummary7,
    getActivityDescription(input) {
      let summary = getToolUseSummary7(input);
      return summary ? `Searching for ${summary}` : "Searching the web";
    },
    isEnabled() {
      let provider5 = getAPIProvider(), model = getMainLoopModel();
      if (provider5 === "firstParty")
        return !0;
      if (provider5 === "vertex")
        return model.includes("claude-opus-4") || model.includes("claude-sonnet-4") || model.includes("claude-haiku-4");
      if (provider5 === "foundry")
        return !0;
      return !1;
    },
    get inputSchema() {
      return inputSchema21();
    },
    get outputSchema() {
      return outputSchema17();
    },
    isConcurrencySafe() {
      return !0;
    },
    isReadOnly() {
      return !0;
    },
    toAutoClassifierInput(input) {
      return input.query;
    },
    async checkPermissions(_input) {
      return {
        behavior: "passthrough",
        message: "WebSearchTool requires permission.",
        suggestions: [
          {
            type: "addRules",
            rules: [{ toolName: WEB_SEARCH_TOOL_NAME }],
            behavior: "allow",
            destination: "localSettings"
          }
        ]
      };
    },
    async prompt() {
      return getWebSearchPrompt();
    },
    renderToolUseMessage: renderToolUseMessage17,
    renderToolUseProgressMessage: renderToolUseProgressMessage8,
    renderToolResultMessage: renderToolResultMessage16,
    extractSearchText() {
      return "";
    },
    async validateInput(input) {
      let { query: query3, allowed_domains, blocked_domains } = input;
      if (!query3.length)
        return {
          result: !1,
          message: "Error: Missing query",
          errorCode: 1
        };
      if (allowed_domains?.length && blocked_domains?.length)
        return {
          result: !1,
          message: "Error: Cannot specify both allowed_domains and blocked_domains in the same request",
          errorCode: 2
        };
      return { result: !0 };
    },
    async call(input, context6, _canUseTool, _parentMessage, onProgress) {
      let startTime = performance.now(), { query: query3 } = input, userMessage = createUserMessage({
        content: "Perform a web search for the query: " + query3
      }), toolSchema = makeToolSchema(input), appState = context6.getAppState(), queryStream = queryModelWithStreaming({
        messages: [userMessage],
        systemPrompt: asSystemPrompt([
          "You are an assistant for performing a web search tool use"
        ]),
        thinkingConfig: context6.options.thinkingConfig,
        tools: [],
        signal: context6.abortController.signal,
        options: {
          getToolPermissionContext: async () => appState.toolPermissionContext,
          model: context6.options.mainLoopModel,
          toolChoice: void 0,
          isNonInteractiveSession: context6.options.isNonInteractiveSession,
          hasAppendSystemPrompt: !!context6.options.appendSystemPrompt,
          extraToolSchemas: [toolSchema],
          querySource: "web_search_tool",
          agents: context6.options.agentDefinitions.activeAgents,
          mcpTools: [],
          agentId: context6.agentId,
          effortValue: appState.effortValue
        }
      }), allContentBlocks = [], currentToolUseId = null, currentToolUseJson = "", progressCounter = 0, toolUseQueries = /* @__PURE__ */ new Map;
      for await (let event of queryStream) {
        if (event.type === "assistant") {
          allContentBlocks.push(...event.message.content);
          continue;
        }
        if (event.type === "stream_event" && event.event?.type === "content_block_start") {
          let contentBlock = event.event.content_block;
          if (contentBlock && contentBlock.type === "server_tool_use") {
            currentToolUseId = contentBlock.id, currentToolUseJson = "";
            continue;
          }
        }
        if (currentToolUseId && event.type === "stream_event" && event.event?.type === "content_block_delta") {
          let delta = event.event.delta;
          if (delta?.type === "input_json_delta" && delta.partial_json) {
            currentToolUseJson += delta.partial_json;
            try {
              let queryMatch = currentToolUseJson.match(/"query"\s*:\s*"((?:[^"\\]|\\.)*)"/);
              if (queryMatch && queryMatch[1]) {
                let query4 = jsonParse('"' + queryMatch[1] + '"');
                if (!toolUseQueries.has(currentToolUseId) || toolUseQueries.get(currentToolUseId) !== query4) {
                  if (toolUseQueries.set(currentToolUseId, query4), progressCounter++, onProgress)
                    onProgress({
                      toolUseID: `search-progress-${progressCounter}`,
                      data: {
                        type: "query_update",
                        query: query4
                      }
                    });
                }
              }
            } catch {}
          }
        }
        if (event.type === "stream_event" && event.event?.type === "content_block_start") {
          let contentBlock = event.event.content_block;
          if (contentBlock && contentBlock.type === "web_search_tool_result") {
            let toolUseId = contentBlock.tool_use_id, actualQuery = toolUseQueries.get(toolUseId) || query3, content = contentBlock.content;
            if (progressCounter++, onProgress)
              onProgress({
                toolUseID: toolUseId || `search-progress-${progressCounter}`,
                data: {
                  type: "search_results_received",
                  resultCount: Array.isArray(content) ? content.length : 0,
                  query: actualQuery
                }
              });
          }
        }
      }
      let durationSeconds = (performance.now() - startTime) / 1000;
      return { data: makeOutputFromSearchResponse(allContentBlocks, query3, durationSeconds) };
    },
    mapToolResultToToolResultBlockParam(output, toolUseID) {
      let { query: query3, results } = output, formattedOutput = `Web search results for query: "${query3}"

`;
      return (results ?? []).forEach((result) => {
        if (result == null)
          return;
        if (typeof result === "string")
          formattedOutput += result + `

`;
        else if (result.content?.length > 0)
          formattedOutput += `Links: ${jsonStringify(result.content)}

`;
        else
          formattedOutput += `No links found.

`;
      }), formattedOutput += `
REMINDER: You MUST include the sources above in your response to the user using markdown hyperlinks.`, {
        tool_use_id: toolUseID,
        type: "tool_result",
        content: formattedOutput.trim()
      };
    }
  });
});
