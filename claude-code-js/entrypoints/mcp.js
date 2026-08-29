// Original: src/entrypoints/mcp.ts
var exports_mcp2 = {};
__export(exports_mcp2, {
  startMCPServer: () => startMCPServer
});
async function startMCPServer(cwd3, debug, verbose) {
  let readFileStateCache = createFileStateCacheWithSizeLimit(100);
  setCwd(cwd3);
  let server = new Server({
    name: "claude/tengu",
    version: "2.1.90"
  }, {
    capabilities: {
      tools: {}
    }
  });
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    let toolPermissionContext = getEmptyToolPermissionContext(), tools = getTools(toolPermissionContext);
    return {
      tools: await Promise.all(tools.map(async (tool) => {
        let outputSchema34;
        if (tool.outputSchema) {
          let convertedSchema = zodToJsonSchema3(tool.outputSchema);
          if (typeof convertedSchema === "object" && convertedSchema !== null && "type" in convertedSchema && convertedSchema.type === "object")
            outputSchema34 = convertedSchema;
        }
        return {
          ...tool,
          description: await tool.prompt({
            getToolPermissionContext: async () => toolPermissionContext,
            tools,
            agents: []
          }),
          inputSchema: zodToJsonSchema3(tool.inputSchema),
          outputSchema: outputSchema34
        };
      }))
    };
  }), server.setRequestHandler(CallToolRequestSchema, async ({ params: { name: name3, arguments: args } }) => {
    let toolPermissionContext = getEmptyToolPermissionContext(), tools = getTools(toolPermissionContext), tool = findToolByName(tools, name3);
    if (!tool)
      throw Error(`Tool ${name3} not found`);
    let toolUseContext = {
      abortController: createAbortController(),
      options: {
        commands: MCP_COMMANDS,
        tools,
        mainLoopModel: getMainLoopModel(),
        thinkingConfig: { type: "disabled" },
        mcpClients: [],
        mcpResources: {},
        isNonInteractiveSession: !0,
        debug,
        verbose,
        agentDefinitions: { activeAgents: [], allAgents: [] }
      },
      getAppState: () => getDefaultAppState(),
      setAppState: () => {},
      messages: [],
      readFileState: readFileStateCache,
      setInProgressToolUseIDs: () => {},
      setResponseLength: () => {},
      updateFileHistoryState: () => {},
      updateAttributionState: () => {}
    };
    try {
      if (!tool.isEnabled())
        throw Error(`Tool ${name3} is not enabled`);
      let validationResult = await tool.validateInput?.(args ?? {}, toolUseContext);
      if (validationResult && !validationResult.result)
        throw Error(`Tool ${name3} input is invalid: ${validationResult.message}`);
      let finalResult = await tool.call(args ?? {}, toolUseContext, hasPermissionsToUseTool, createAssistantMessage({
        content: []
      }));
      return {
        content: [
          {
            type: "text",
            text: typeof finalResult === "string" ? finalResult : jsonStringify(finalResult.data)
          }
        ]
      };
    } catch (error44) {
      return logError2(error44), {
        isError: !0,
        content: [
          {
            type: "text",
            text: (error44 instanceof Error ? getErrorParts(error44) : [String(error44)]).filter(Boolean).join(`
`).trim() || "Error"
          }
        ]
      };
    }
  });
  async function runServer() {
    let transport = new StdioServerTransport;
    await server.connect(transport);
  }
  return await runServer();
}
var MCP_COMMANDS;
var init_mcp4 = __esm(() => {
  init_server4();
  init_stdio2();
  init_types();
  init_AppStateStore();
  init_review();
  init_Tool();
  init_tools2();
  init_abortController();
  init_fileStateCache();
  init_log3();
  init_messages3();
  init_model();
  init_permissions2();
  init_Shell();
  init_slowOperations();
  init_toolErrors();
  init_zodToJsonSchema2();
  MCP_COMMANDS = [review_default];
});
