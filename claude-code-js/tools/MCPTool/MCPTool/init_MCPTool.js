// var: init_MCPTool
var init_MCPTool = __esm(() => {
  init_v4();
  init_Tool();
  init_terminal2();
  init_UI2();
  inputSchema4 = lazySchema(() => exports_external.object({}).passthrough()), outputSchema4 = lazySchema(() => exports_external.string().describe("MCP tool execution result")), MCPTool = buildTool({
    isMcp: !0,
    isOpenWorld() {
      return !1;
    },
    name: "mcp",
    maxResultSizeChars: 1e5,
    async description() {
      return DESCRIPTION8;
    },
    async prompt() {
      return PROMPT3;
    },
    get inputSchema() {
      return inputSchema4();
    },
    get outputSchema() {
      return outputSchema4();
    },
    async call() {
      return {
        data: ""
      };
    },
    async checkPermissions() {
      return {
        behavior: "passthrough",
        message: "MCPTool requires permission."
      };
    },
    renderToolUseMessage: renderToolUseMessage2,
    userFacingName: () => "mcp",
    renderToolUseProgressMessage,
    renderToolResultMessage: renderToolResultMessage2,
    isResultTruncated(output) {
      return isOutputLineTruncated(output);
    },
    mapToolResultToToolResultBlockParam(content, toolUseID) {
      return {
        tool_use_id: toolUseID,
        type: "tool_result",
        content
      };
    }
  });
});
