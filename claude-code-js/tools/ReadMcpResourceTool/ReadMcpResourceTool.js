// Original: src/tools/ReadMcpResourceTool/ReadMcpResourceTool.ts
var inputSchema6, outputSchema5, ReadMcpResourceTool;
var init_ReadMcpResourceTool = __esm(() => {
  init_types();
  init_v4();
  init_client20();
  init_Tool();
  init_mcpOutputStorage();
  init_slowOperations();
  init_terminal2();
  init_UI3();
  inputSchema6 = lazySchema(() => exports_external.object({
    server: exports_external.string().describe("The MCP server name"),
    uri: exports_external.string().describe("The resource URI to read")
  })), outputSchema5 = lazySchema(() => exports_external.object({
    contents: exports_external.array(exports_external.object({
      uri: exports_external.string().describe("Resource URI"),
      mimeType: exports_external.string().optional().describe("MIME type of the content"),
      text: exports_external.string().optional().describe("Text content of the resource"),
      blobSavedTo: exports_external.string().optional().describe("Path where binary blob content was saved")
    }))
  })), ReadMcpResourceTool = buildTool({
    isConcurrencySafe() {
      return !0;
    },
    isReadOnly() {
      return !0;
    },
    toAutoClassifierInput(input) {
      return `${input.server} ${input.uri}`;
    },
    shouldDefer: !0,
    name: "ReadMcpResourceTool",
    searchHint: "read a specific MCP resource by URI",
    maxResultSizeChars: 1e5,
    async description() {
      return DESCRIPTION9;
    },
    async prompt() {
      return PROMPT4;
    },
    get inputSchema() {
      return inputSchema6();
    },
    get outputSchema() {
      return outputSchema5();
    },
    async call(input, { options: { mcpClients } }) {
      let { server: serverName, uri: uri7 } = input, client15 = mcpClients.find((client16) => client16.name === serverName);
      if (!client15)
        throw Error(`Server "${serverName}" not found. Available servers: ${mcpClients.map((c3) => c3.name).join(", ")}`);
      if (client15.type !== "connected")
        throw Error(`Server "${serverName}" is not connected`);
      if (!client15.capabilities?.resources)
        throw Error(`Server "${serverName}" does not support resources`);
      let result = await (await ensureConnectedClient(client15)).client.request({
        method: "resources/read",
        params: { uri: uri7 }
      }, ReadResourceResultSchema);
      return {
        data: { contents: await Promise.all(result.contents.map(async (c3, i5) => {
          if ("text" in c3)
            return { uri: c3.uri, mimeType: c3.mimeType, text: c3.text };
          if (!("blob" in c3) || typeof c3.blob !== "string")
            return { uri: c3.uri, mimeType: c3.mimeType };
          let persistId = `mcp-resource-${Date.now()}-${i5}-${Math.random().toString(36).slice(2, 8)}`, persisted = await persistBinaryContent(Buffer.from(c3.blob, "base64"), c3.mimeType, persistId);
          if ("error" in persisted)
            return {
              uri: c3.uri,
              mimeType: c3.mimeType,
              text: `Binary content could not be saved to disk: ${persisted.error}`
            };
          return {
            uri: c3.uri,
            mimeType: c3.mimeType,
            blobSavedTo: persisted.filepath,
            text: getBinaryBlobSavedMessage(persisted.filepath, c3.mimeType, persisted.size, `[Resource from ${serverName} at ${c3.uri}] `)
          };
        })) }
      };
    },
    renderToolUseMessage: renderToolUseMessage3,
    userFacingName,
    renderToolResultMessage: renderToolResultMessage3,
    isResultTruncated(output) {
      return isOutputLineTruncated(jsonStringify(output));
    },
    mapToolResultToToolResultBlockParam(content, toolUseID) {
      return {
        tool_use_id: toolUseID,
        type: "tool_result",
        content: jsonStringify(content)
      };
    }
  });
});
