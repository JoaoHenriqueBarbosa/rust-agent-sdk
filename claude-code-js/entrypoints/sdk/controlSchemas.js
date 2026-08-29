// Original: src/entrypoints/sdk/controlSchemas.ts
var JSONRPCMessagePlaceholder, SDKHookCallbackMatcherSchema, SDKControlInitializeRequestSchema, SDKControlInitializeResponseSchema, SDKControlInterruptRequestSchema, SDKControlPermissionRequestSchema, SDKControlSetPermissionModeRequestSchema, SDKControlSetModelRequestSchema, SDKControlSetMaxThinkingTokensRequestSchema, SDKControlMcpStatusRequestSchema, SDKControlMcpStatusResponseSchema, SDKControlGetContextUsageRequestSchema, ContextCategorySchema, ContextGridSquareSchema, SDKControlGetContextUsageResponseSchema, SDKControlRewindFilesRequestSchema, SDKControlRewindFilesResponseSchema, SDKControlCancelAsyncMessageRequestSchema, SDKControlCancelAsyncMessageResponseSchema, SDKControlSeedReadStateRequestSchema, SDKHookCallbackRequestSchema, SDKControlMcpMessageRequestSchema, SDKControlMcpSetServersRequestSchema, SDKControlMcpSetServersResponseSchema, SDKControlReloadPluginsRequestSchema, SDKControlReloadPluginsResponseSchema, SDKControlMcpReconnectRequestSchema, SDKControlMcpToggleRequestSchema, SDKControlStopTaskRequestSchema, SDKControlApplyFlagSettingsRequestSchema, SDKControlGetSettingsRequestSchema, SDKControlGetSettingsResponseSchema, SDKControlElicitationRequestSchema, SDKControlElicitationResponseSchema, SDKControlRequestInnerSchema, SDKControlRequestSchema, ControlResponseSchema, ControlErrorResponseSchema, SDKControlResponseSchema, SDKControlCancelRequestSchema, SDKKeepAliveMessageSchema, SDKUpdateEnvironmentVariablesMessageSchema, StdoutMessageSchema, StdinMessageSchema;
var init_controlSchemas = __esm(() => {
  init_v4();
  init_coreSchemas();
  JSONRPCMessagePlaceholder = lazySchema(() => exports_external.unknown()), SDKHookCallbackMatcherSchema = lazySchema(() => exports_external.object({
    matcher: exports_external.string().optional(),
    hookCallbackIds: exports_external.array(exports_external.string()),
    timeout: exports_external.number().optional()
  }).describe("Configuration for matching and routing hook callbacks.")), SDKControlInitializeRequestSchema = lazySchema(() => exports_external.object({
    subtype: exports_external.literal("initialize"),
    hooks: exports_external.record(HookEventSchema(), exports_external.array(SDKHookCallbackMatcherSchema())).optional(),
    sdkMcpServers: exports_external.array(exports_external.string()).optional(),
    jsonSchema: exports_external.record(exports_external.string(), exports_external.unknown()).optional(),
    systemPrompt: exports_external.string().optional(),
    appendSystemPrompt: exports_external.string().optional(),
    agents: exports_external.record(exports_external.string(), AgentDefinitionSchema()).optional(),
    promptSuggestions: exports_external.boolean().optional(),
    agentProgressSummaries: exports_external.boolean().optional()
  }).describe("Initializes the SDK session with hooks, MCP servers, and agent configuration.")), SDKControlInitializeResponseSchema = lazySchema(() => exports_external.object({
    commands: exports_external.array(SlashCommandSchema()),
    agents: exports_external.array(AgentInfoSchema()),
    output_style: exports_external.string(),
    available_output_styles: exports_external.array(exports_external.string()),
    models: exports_external.array(ModelInfoSchema()),
    account: AccountInfoSchema(),
    pid: exports_external.number().optional().describe("@internal CLI process PID for tmux socket isolation"),
    fast_mode_state: FastModeStateSchema().optional()
  }).describe("Response from session initialization with available commands, models, and account info.")), SDKControlInterruptRequestSchema = lazySchema(() => exports_external.object({
    subtype: exports_external.literal("interrupt")
  }).describe("Interrupts the currently running conversation turn.")), SDKControlPermissionRequestSchema = lazySchema(() => exports_external.object({
    subtype: exports_external.literal("can_use_tool"),
    tool_name: exports_external.string(),
    input: exports_external.record(exports_external.string(), exports_external.unknown()),
    permission_suggestions: exports_external.array(PermissionUpdateSchema()).optional(),
    blocked_path: exports_external.string().optional(),
    decision_reason: exports_external.string().optional(),
    title: exports_external.string().optional(),
    display_name: exports_external.string().optional(),
    tool_use_id: exports_external.string(),
    agent_id: exports_external.string().optional(),
    description: exports_external.string().optional()
  }).describe("Requests permission to use a tool with the given input.")), SDKControlSetPermissionModeRequestSchema = lazySchema(() => exports_external.object({
    subtype: exports_external.literal("set_permission_mode"),
    mode: PermissionModeSchema(),
    ultraplan: exports_external.boolean().optional().describe("@internal CCR ultraplan session marker.")
  }).describe("Sets the permission mode for tool execution handling.")), SDKControlSetModelRequestSchema = lazySchema(() => exports_external.object({
    subtype: exports_external.literal("set_model"),
    model: exports_external.string().optional()
  }).describe("Sets the model to use for subsequent conversation turns.")), SDKControlSetMaxThinkingTokensRequestSchema = lazySchema(() => exports_external.object({
    subtype: exports_external.literal("set_max_thinking_tokens"),
    max_thinking_tokens: exports_external.number().nullable()
  }).describe("Sets the maximum number of thinking tokens for extended thinking.")), SDKControlMcpStatusRequestSchema = lazySchema(() => exports_external.object({
    subtype: exports_external.literal("mcp_status")
  }).describe("Requests the current status of all MCP server connections.")), SDKControlMcpStatusResponseSchema = lazySchema(() => exports_external.object({
    mcpServers: exports_external.array(McpServerStatusSchema())
  }).describe("Response containing the current status of all MCP server connections.")), SDKControlGetContextUsageRequestSchema = lazySchema(() => exports_external.object({
    subtype: exports_external.literal("get_context_usage")
  }).describe("Requests a breakdown of current context window usage by category.")), ContextCategorySchema = lazySchema(() => exports_external.object({
    name: exports_external.string(),
    tokens: exports_external.number(),
    color: exports_external.string(),
    isDeferred: exports_external.boolean().optional()
  })), ContextGridSquareSchema = lazySchema(() => exports_external.object({
    color: exports_external.string(),
    isFilled: exports_external.boolean(),
    categoryName: exports_external.string(),
    tokens: exports_external.number(),
    percentage: exports_external.number(),
    squareFullness: exports_external.number()
  })), SDKControlGetContextUsageResponseSchema = lazySchema(() => exports_external.object({
    categories: exports_external.array(ContextCategorySchema()),
    totalTokens: exports_external.number(),
    maxTokens: exports_external.number(),
    rawMaxTokens: exports_external.number(),
    percentage: exports_external.number(),
    gridRows: exports_external.array(exports_external.array(ContextGridSquareSchema())),
    model: exports_external.string(),
    memoryFiles: exports_external.array(exports_external.object({
      path: exports_external.string(),
      type: exports_external.string(),
      tokens: exports_external.number()
    })),
    mcpTools: exports_external.array(exports_external.object({
      name: exports_external.string(),
      serverName: exports_external.string(),
      tokens: exports_external.number(),
      isLoaded: exports_external.boolean().optional()
    })),
    deferredBuiltinTools: exports_external.array(exports_external.object({
      name: exports_external.string(),
      tokens: exports_external.number(),
      isLoaded: exports_external.boolean()
    })).optional(),
    systemTools: exports_external.array(exports_external.object({ name: exports_external.string(), tokens: exports_external.number() })).optional(),
    systemPromptSections: exports_external.array(exports_external.object({ name: exports_external.string(), tokens: exports_external.number() })).optional(),
    agents: exports_external.array(exports_external.object({
      agentType: exports_external.string(),
      source: exports_external.string(),
      tokens: exports_external.number()
    })),
    slashCommands: exports_external.object({
      totalCommands: exports_external.number(),
      includedCommands: exports_external.number(),
      tokens: exports_external.number()
    }).optional(),
    skills: exports_external.object({
      totalSkills: exports_external.number(),
      includedSkills: exports_external.number(),
      tokens: exports_external.number(),
      skillFrontmatter: exports_external.array(exports_external.object({
        name: exports_external.string(),
        source: exports_external.string(),
        tokens: exports_external.number()
      }))
    }).optional(),
    autoCompactThreshold: exports_external.number().optional(),
    isAutoCompactEnabled: exports_external.boolean(),
    messageBreakdown: exports_external.object({
      toolCallTokens: exports_external.number(),
      toolResultTokens: exports_external.number(),
      attachmentTokens: exports_external.number(),
      assistantMessageTokens: exports_external.number(),
      userMessageTokens: exports_external.number(),
      toolCallsByType: exports_external.array(exports_external.object({
        name: exports_external.string(),
        callTokens: exports_external.number(),
        resultTokens: exports_external.number()
      })),
      attachmentsByType: exports_external.array(exports_external.object({ name: exports_external.string(), tokens: exports_external.number() }))
    }).optional(),
    apiUsage: exports_external.object({
      input_tokens: exports_external.number(),
      output_tokens: exports_external.number(),
      cache_creation_input_tokens: exports_external.number(),
      cache_read_input_tokens: exports_external.number()
    }).nullable()
  }).describe("Breakdown of current context window usage by category (system prompt, tools, messages, etc.).")), SDKControlRewindFilesRequestSchema = lazySchema(() => exports_external.object({
    subtype: exports_external.literal("rewind_files"),
    user_message_id: exports_external.string(),
    dry_run: exports_external.boolean().optional()
  }).describe("Rewinds file changes made since a specific user message.")), SDKControlRewindFilesResponseSchema = lazySchema(() => exports_external.object({
    canRewind: exports_external.boolean(),
    error: exports_external.string().optional(),
    filesChanged: exports_external.array(exports_external.string()).optional(),
    insertions: exports_external.number().optional(),
    deletions: exports_external.number().optional()
  }).describe("Result of a rewindFiles operation.")), SDKControlCancelAsyncMessageRequestSchema = lazySchema(() => exports_external.object({
    subtype: exports_external.literal("cancel_async_message"),
    message_uuid: exports_external.string()
  }).describe("Drops a pending async user message from the command queue by uuid. No-op if already dequeued for execution.")), SDKControlCancelAsyncMessageResponseSchema = lazySchema(() => exports_external.object({
    cancelled: exports_external.boolean()
  }).describe("Result of a cancel_async_message operation. cancelled=false means the message was not in the queue (already dequeued or never enqueued).")), SDKControlSeedReadStateRequestSchema = lazySchema(() => exports_external.object({
    subtype: exports_external.literal("seed_read_state"),
    path: exports_external.string(),
    mtime: exports_external.number()
  }).describe("Seeds the readFileState cache with a path+mtime entry. Use when a prior Read was removed from context (e.g. by snip) so Edit validation would fail despite the client having observed the Read. The mtime lets the CLI detect if the file changed since the seeded Read \u2014 same staleness check as the normal path.")), SDKHookCallbackRequestSchema = lazySchema(() => exports_external.object({
    subtype: exports_external.literal("hook_callback"),
    callback_id: exports_external.string(),
    input: HookInputSchema(),
    tool_use_id: exports_external.string().optional()
  }).describe("Delivers a hook callback with its input data.")), SDKControlMcpMessageRequestSchema = lazySchema(() => exports_external.object({
    subtype: exports_external.literal("mcp_message"),
    server_name: exports_external.string(),
    message: JSONRPCMessagePlaceholder()
  }).describe("Sends a JSON-RPC message to a specific MCP server.")), SDKControlMcpSetServersRequestSchema = lazySchema(() => exports_external.object({
    subtype: exports_external.literal("mcp_set_servers"),
    servers: exports_external.record(exports_external.string(), McpServerConfigForProcessTransportSchema())
  }).describe("Replaces the set of dynamically managed MCP servers.")), SDKControlMcpSetServersResponseSchema = lazySchema(() => exports_external.object({
    added: exports_external.array(exports_external.string()),
    removed: exports_external.array(exports_external.string()),
    errors: exports_external.record(exports_external.string(), exports_external.string())
  }).describe("Result of replacing the set of dynamically managed MCP servers.")), SDKControlReloadPluginsRequestSchema = lazySchema(() => exports_external.object({
    subtype: exports_external.literal("reload_plugins")
  }).describe("Reloads plugins from disk and returns the refreshed session components.")), SDKControlReloadPluginsResponseSchema = lazySchema(() => exports_external.object({
    commands: exports_external.array(SlashCommandSchema()),
    agents: exports_external.array(AgentInfoSchema()),
    plugins: exports_external.array(exports_external.object({
      name: exports_external.string(),
      path: exports_external.string(),
      source: exports_external.string().optional()
    })),
    mcpServers: exports_external.array(McpServerStatusSchema()),
    error_count: exports_external.number()
  }).describe("Refreshed commands, agents, plugins, and MCP server status after reload.")), SDKControlMcpReconnectRequestSchema = lazySchema(() => exports_external.object({
    subtype: exports_external.literal("mcp_reconnect"),
    serverName: exports_external.string()
  }).describe("Reconnects a disconnected or failed MCP server.")), SDKControlMcpToggleRequestSchema = lazySchema(() => exports_external.object({
    subtype: exports_external.literal("mcp_toggle"),
    serverName: exports_external.string(),
    enabled: exports_external.boolean()
  }).describe("Enables or disables an MCP server.")), SDKControlStopTaskRequestSchema = lazySchema(() => exports_external.object({
    subtype: exports_external.literal("stop_task"),
    task_id: exports_external.string()
  }).describe("Stops a running task.")), SDKControlApplyFlagSettingsRequestSchema = lazySchema(() => exports_external.object({
    subtype: exports_external.literal("apply_flag_settings"),
    settings: exports_external.record(exports_external.string(), exports_external.unknown())
  }).describe("Merges the provided settings into the flag settings layer, updating the active configuration.")), SDKControlGetSettingsRequestSchema = lazySchema(() => exports_external.object({
    subtype: exports_external.literal("get_settings")
  }).describe("Returns the effective merged settings and the raw per-source settings.")), SDKControlGetSettingsResponseSchema = lazySchema(() => exports_external.object({
    effective: exports_external.record(exports_external.string(), exports_external.unknown()),
    sources: exports_external.array(exports_external.object({
      source: exports_external.enum([
        "userSettings",
        "projectSettings",
        "localSettings",
        "flagSettings",
        "policySettings"
      ]),
      settings: exports_external.record(exports_external.string(), exports_external.unknown())
    })).describe("Ordered low-to-high priority \u2014 later entries override earlier ones."),
    applied: exports_external.object({
      model: exports_external.string(),
      effort: exports_external.enum(["low", "medium", "high", "max"]).nullable()
    }).optional().describe("Runtime-resolved values after env overrides, session state, and model-specific defaults are applied. Unlike `effective` (disk merge), these reflect what will actually be sent to the API.")
  }).describe("Effective merged settings plus raw per-source settings in merge order.")), SDKControlElicitationRequestSchema = lazySchema(() => exports_external.object({
    subtype: exports_external.literal("elicitation"),
    mcp_server_name: exports_external.string(),
    message: exports_external.string(),
    mode: exports_external.enum(["form", "url"]).optional(),
    url: exports_external.string().optional(),
    elicitation_id: exports_external.string().optional(),
    requested_schema: exports_external.record(exports_external.string(), exports_external.unknown()).optional()
  }).describe("Requests the SDK consumer to handle an MCP elicitation (user input request).")), SDKControlElicitationResponseSchema = lazySchema(() => exports_external.object({
    action: exports_external.enum(["accept", "decline", "cancel"]),
    content: exports_external.record(exports_external.string(), exports_external.unknown()).optional()
  }).describe("Response from the SDK consumer for an elicitation request.")), SDKControlRequestInnerSchema = lazySchema(() => exports_external.union([
    SDKControlInterruptRequestSchema(),
    SDKControlPermissionRequestSchema(),
    SDKControlInitializeRequestSchema(),
    SDKControlSetPermissionModeRequestSchema(),
    SDKControlSetModelRequestSchema(),
    SDKControlSetMaxThinkingTokensRequestSchema(),
    SDKControlMcpStatusRequestSchema(),
    SDKControlGetContextUsageRequestSchema(),
    SDKHookCallbackRequestSchema(),
    SDKControlMcpMessageRequestSchema(),
    SDKControlRewindFilesRequestSchema(),
    SDKControlCancelAsyncMessageRequestSchema(),
    SDKControlSeedReadStateRequestSchema(),
    SDKControlMcpSetServersRequestSchema(),
    SDKControlReloadPluginsRequestSchema(),
    SDKControlMcpReconnectRequestSchema(),
    SDKControlMcpToggleRequestSchema(),
    SDKControlStopTaskRequestSchema(),
    SDKControlApplyFlagSettingsRequestSchema(),
    SDKControlGetSettingsRequestSchema(),
    SDKControlElicitationRequestSchema()
  ])), SDKControlRequestSchema = lazySchema(() => exports_external.object({
    type: exports_external.literal("control_request"),
    request_id: exports_external.string(),
    request: SDKControlRequestInnerSchema()
  })), ControlResponseSchema = lazySchema(() => exports_external.object({
    subtype: exports_external.literal("success"),
    request_id: exports_external.string(),
    response: exports_external.record(exports_external.string(), exports_external.unknown()).optional()
  })), ControlErrorResponseSchema = lazySchema(() => exports_external.object({
    subtype: exports_external.literal("error"),
    request_id: exports_external.string(),
    error: exports_external.string(),
    pending_permission_requests: exports_external.array(exports_external.lazy(() => SDKControlRequestSchema())).optional()
  })), SDKControlResponseSchema = lazySchema(() => exports_external.object({
    type: exports_external.literal("control_response"),
    response: exports_external.union([ControlResponseSchema(), ControlErrorResponseSchema()])
  })), SDKControlCancelRequestSchema = lazySchema(() => exports_external.object({
    type: exports_external.literal("control_cancel_request"),
    request_id: exports_external.string()
  }).describe("Cancels a currently open control request.")), SDKKeepAliveMessageSchema = lazySchema(() => exports_external.object({
    type: exports_external.literal("keep_alive")
  }).describe("Keep-alive message to maintain WebSocket connection.")), SDKUpdateEnvironmentVariablesMessageSchema = lazySchema(() => exports_external.object({
    type: exports_external.literal("update_environment_variables"),
    variables: exports_external.record(exports_external.string(), exports_external.string())
  }).describe("Updates environment variables at runtime.")), StdoutMessageSchema = lazySchema(() => exports_external.union([
    SDKMessageSchema(),
    SDKStreamlinedTextMessageSchema(),
    SDKStreamlinedToolUseSummaryMessageSchema(),
    SDKPostTurnSummaryMessageSchema(),
    SDKControlResponseSchema(),
    SDKControlRequestSchema(),
    SDKControlCancelRequestSchema(),
    SDKKeepAliveMessageSchema()
  ])), StdinMessageSchema = lazySchema(() => exports_external.union([
    SDKUserMessageSchema(),
    SDKControlRequestSchema(),
    SDKControlResponseSchema(),
    SDKKeepAliveMessageSchema(),
    SDKUpdateEnvironmentVariablesMessageSchema()
  ]));
});
