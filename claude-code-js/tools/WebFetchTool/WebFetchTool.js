// Original: src/tools/WebFetchTool/WebFetchTool.ts
function webFetchToolInputToPermissionRuleContent(input) {
  try {
    let parsedInput = WebFetchTool.inputSchema.safeParse(input);
    if (!parsedInput.success)
      return `input:${input.toString()}`;
    let { url: url3 } = parsedInput.data;
    return `domain:${new URL(url3).hostname}`;
  } catch {
    return `input:${input.toString()}`;
  }
}
function buildSuggestions(ruleContent) {
  return [
    {
      type: "addRules",
      destination: "localSettings",
      rules: [{ toolName: WEB_FETCH_TOOL_NAME, ruleContent }],
      behavior: "allow"
    }
  ];
}
var inputSchema17, outputSchema14, WebFetchTool;
var init_WebFetchTool = __esm(() => {
  init_v4();
  init_Tool();
  init_format();
  init_permissions2();
  init_preapproved();
  init_prompt3();
  init_UI13();
  init_utils15();
  inputSchema17 = lazySchema(() => exports_external.strictObject({
    url: exports_external.string().url().describe("The URL to fetch content from"),
    prompt: exports_external.string().describe("The prompt to run on the fetched content")
  })), outputSchema14 = lazySchema(() => exports_external.object({
    bytes: exports_external.number().describe("Size of the fetched content in bytes"),
    code: exports_external.number().describe("HTTP response code"),
    codeText: exports_external.string().describe("HTTP response code text"),
    result: exports_external.string().describe("Processed result from applying the prompt to the content"),
    durationMs: exports_external.number().describe("Time taken to fetch and process the content"),
    url: exports_external.string().describe("The URL that was fetched")
  }));
  WebFetchTool = buildTool({
    name: WEB_FETCH_TOOL_NAME,
    searchHint: "fetch and extract content from a URL",
    maxResultSizeChars: 1e5,
    shouldDefer: !0,
    async description(input) {
      let { url: url3 } = input;
      try {
        return `Claude wants to fetch content from ${new URL(url3).hostname}`;
      } catch {
        return "Claude wants to fetch content from this URL";
      }
    },
    userFacingName() {
      return "Fetch";
    },
    getToolUseSummary: getToolUseSummary6,
    getActivityDescription(input) {
      let summary = getToolUseSummary6(input);
      return summary ? `Fetching ${summary}` : "Fetching web page";
    },
    get inputSchema() {
      return inputSchema17();
    },
    get outputSchema() {
      return outputSchema14();
    },
    isConcurrencySafe() {
      return !0;
    },
    isReadOnly() {
      return !0;
    },
    toAutoClassifierInput(input) {
      return input.prompt ? `${input.url}: ${input.prompt}` : input.url;
    },
    async checkPermissions(input, context6) {
      let permissionContext = context6.getAppState().toolPermissionContext;
      try {
        let { url: url3 } = input, parsedUrl = new URL(url3);
        if (isPreapprovedHost(parsedUrl.hostname, parsedUrl.pathname))
          return {
            behavior: "allow",
            updatedInput: input,
            decisionReason: { type: "other", reason: "Preapproved host" }
          };
      } catch {}
      let ruleContent = webFetchToolInputToPermissionRuleContent(input), denyRule = getRuleByContentsForTool(permissionContext, WebFetchTool, "deny").get(ruleContent);
      if (denyRule)
        return {
          behavior: "deny",
          message: `${WebFetchTool.name} denied access to ${ruleContent}.`,
          decisionReason: {
            type: "rule",
            rule: denyRule
          }
        };
      let askRule = getRuleByContentsForTool(permissionContext, WebFetchTool, "ask").get(ruleContent);
      if (askRule)
        return {
          behavior: "ask",
          message: `Claude requested permissions to use ${WebFetchTool.name}, but you haven't granted it yet.`,
          decisionReason: {
            type: "rule",
            rule: askRule
          },
          suggestions: buildSuggestions(ruleContent)
        };
      let allowRule = getRuleByContentsForTool(permissionContext, WebFetchTool, "allow").get(ruleContent);
      if (allowRule)
        return {
          behavior: "allow",
          updatedInput: input,
          decisionReason: {
            type: "rule",
            rule: allowRule
          }
        };
      return {
        behavior: "ask",
        message: `Claude requested permissions to use ${WebFetchTool.name}, but you haven't granted it yet.`,
        suggestions: buildSuggestions(ruleContent)
      };
    },
    async prompt(_options) {
      return `IMPORTANT: WebFetch WILL FAIL for authenticated or private URLs. Before using this tool, check if the URL points to an authenticated service (e.g. Google Docs, Confluence, Jira, GitHub). If so, look for a specialized MCP tool that provides authenticated access.
${DESCRIPTION4}`;
    },
    async validateInput(input) {
      let { url: url3 } = input;
      try {
        new URL(url3);
      } catch {
        return {
          result: !1,
          message: `Error: Invalid URL "${url3}". The URL provided could not be parsed.`,
          meta: { reason: "invalid_url" },
          errorCode: 1
        };
      }
      return { result: !0 };
    },
    renderToolUseMessage: renderToolUseMessage14,
    renderToolUseProgressMessage: renderToolUseProgressMessage7,
    renderToolResultMessage: renderToolResultMessage13,
    async call({ url: url3, prompt }, { abortController, options: { isNonInteractiveSession } }) {
      let start = Date.now(), response7 = await getURLMarkdownContent(url3, abortController);
      if ("type" in response7 && response7.type === "redirect") {
        let statusText = response7.statusCode === 301 ? "Moved Permanently" : response7.statusCode === 308 ? "Permanent Redirect" : response7.statusCode === 307 ? "Temporary Redirect" : "Found", message = `REDIRECT DETECTED: The URL redirects to a different host.

Original URL: ${response7.originalUrl}
Redirect URL: ${response7.redirectUrl}
Status: ${response7.statusCode} ${statusText}

To complete your request, I need to fetch content from the redirected URL. Please use WebFetch again with these parameters:
- url: "${response7.redirectUrl}"
- prompt: "${prompt}"`;
        return {
          data: {
            bytes: Buffer.byteLength(message),
            code: response7.statusCode,
            codeText: statusText,
            result: message,
            durationMs: Date.now() - start,
            url: url3
          }
        };
      }
      let {
        content,
        bytes,
        code,
        codeText,
        contentType,
        persistedPath,
        persistedSize
      } = response7, isPreapproved = isPreapprovedUrl(url3), result;
      if (isPreapproved && contentType.includes("text/markdown") && content.length < MAX_MARKDOWN_LENGTH)
        result = content;
      else
        result = await applyPromptToMarkdown(prompt, content, abortController.signal, isNonInteractiveSession, isPreapproved);
      if (persistedPath)
        result += `

[Binary content (${contentType}, ${formatFileSize(persistedSize ?? bytes)}) also saved to ${persistedPath}]`;
      return {
        data: {
          bytes,
          code,
          codeText,
          result,
          durationMs: Date.now() - start,
          url: url3
        }
      };
    },
    mapToolResultToToolResultBlockParam({ result }, toolUseID) {
      return {
        tool_use_id: toolUseID,
        type: "tool_result",
        content: result
      };
    }
  });
});
