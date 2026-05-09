// Original: src/tools/ListMcpResourcesTool/ListMcpResourcesTool.ts
var inputSchema3, outputSchema3, ListMcpResourcesTool;
var init_ListMcpResourcesTool = __esm(() => {
  init_v4();
  init_client20();
  init_Tool();
  init_errors();
  init_log3();
  init_slowOperations();
  init_terminal2();
  init_UI();
  inputSchema3 = lazySchema(() => exports_external.object({
    server: exports_external.string().optional().describe("Optional server name to filter resources by")
  })), outputSchema3 = lazySchema(() => exports_external.array(exports_external.object({
    uri: exports_external.string().describe("Resource URI"),
    name: exports_external.string().describe("Resource name"),
    mimeType: exports_external.string().optional().describe("MIME type of the resource"),
    description: exports_external.string().optional().describe("Resource description"),
    server: exports_external.string().describe("Server that provides this resource")
  }))), ListMcpResourcesTool = buildTool({
    isConcurrencySafe() {
      return !0;
    },
    isReadOnly() {
      return !0;
    },
    toAutoClassifierInput(input) {
      return input.server ?? "";
    },
    shouldDefer: !0,
    name: LIST_MCP_RESOURCES_TOOL_NAME,
    searchHint: "list resources from connected MCP servers",
    maxResultSizeChars: 1e5,
    async description() {
      return DESCRIPTION7;
    },
    async prompt() {
      return PROMPT2;
    },
    get inputSchema() {
      return inputSchema3();
    },
    get outputSchema() {
      return outputSchema3();
    },
    async call(input, { options: { mcpClients } }) {
      let { server: targetServer } = input, clientsToProcess = targetServer ? mcpClients.filter((client15) => client15.name === targetServer) : mcpClients;
      if (targetServer && clientsToProcess.length === 0)
        throw Error(`Server "${targetServer}" not found. Available servers: ${mcpClients.map((c3) => c3.name).join(", ")}`);
      return {
        data: (await Promise.all(clientsToProcess.map(async (client15) => {
          if (client15.type !== "connected")
            return [];
          try {
            let fresh = await ensureConnectedClient(client15);
            return await fetchResourcesForClient(fresh);
          } catch (error44) {
            return logMCPError(client15.name, errorMessage(error44)), [];
          }
        }))).flat()
      };
    },
    renderToolUseMessage,
    userFacingName: () => "listMcpResources",
    renderToolResultMessage,
    isResultTruncated(output) {
      return isOutputLineTruncated(jsonStringify(output));
    },
    mapToolResultToToolResultBlockParam(content, toolUseID) {
      if (!content || content.length === 0)
        return {
          tool_use_id: toolUseID,
          type: "tool_result",
          content: "No resources found. MCP servers may still provide tools even if they have no resources."
        };
      return {
        tool_use_id: toolUseID,
        type: "tool_result",
        content: jsonStringify(content)
      };
    }
  });
});
