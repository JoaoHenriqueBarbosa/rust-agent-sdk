// Original: src/entrypoints/sdk/coreSchemas.ts
var ModelUsageSchema, OutputFormatTypeSchema, BaseOutputFormatSchema, JsonSchemaOutputFormatSchema, OutputFormatSchema, ApiKeySourceSchema, ConfigScopeSchema2, SdkBetaSchema, ThinkingAdaptiveSchema, ThinkingEnabledSchema, ThinkingDisabledSchema, ThinkingConfigSchema, McpStdioServerConfigSchema2, McpSSEServerConfigSchema2, McpHttpServerConfigSchema, McpSdkServerConfigSchema2, McpServerConfigForProcessTransportSchema, McpClaudeAIProxyServerConfigSchema2, McpServerStatusConfigSchema, McpServerStatusSchema, McpSetServersResultSchema, PermissionUpdateDestinationSchema, PermissionBehaviorSchema, PermissionRuleValueSchema, PermissionUpdateSchema, PermissionDecisionClassificationSchema, PermissionResultSchema, PermissionModeSchema, HOOK_EVENTS2, HookEventSchema, BaseHookInputSchema, PreToolUseHookInputSchema, PermissionRequestHookInputSchema, PostToolUseHookInputSchema, PostToolUseFailureHookInputSchema, PermissionDeniedHookInputSchema, NotificationHookInputSchema, UserPromptSubmitHookInputSchema, SessionStartHookInputSchema, SetupHookInputSchema, StopHookInputSchema, StopFailureHookInputSchema, SubagentStartHookInputSchema, SubagentStopHookInputSchema, PreCompactHookInputSchema, PostCompactHookInputSchema, TeammateIdleHookInputSchema, TaskCreatedHookInputSchema, TaskCompletedHookInputSchema, ElicitationHookInputSchema, ElicitationResultHookInputSchema, CONFIG_CHANGE_SOURCES, ConfigChangeHookInputSchema, INSTRUCTIONS_LOAD_REASONS, INSTRUCTIONS_MEMORY_TYPES, InstructionsLoadedHookInputSchema, WorktreeCreateHookInputSchema, WorktreeRemoveHookInputSchema, CwdChangedHookInputSchema, FileChangedHookInputSchema, EXIT_REASONS, ExitReasonSchema, SessionEndHookInputSchema, HookInputSchema, AsyncHookJSONOutputSchema, PreToolUseHookSpecificOutputSchema, UserPromptSubmitHookSpecificOutputSchema, SessionStartHookSpecificOutputSchema, SetupHookSpecificOutputSchema, SubagentStartHookSpecificOutputSchema, PostToolUseHookSpecificOutputSchema, PostToolUseFailureHookSpecificOutputSchema, PermissionDeniedHookSpecificOutputSchema, NotificationHookSpecificOutputSchema, PermissionRequestHookSpecificOutputSchema, CwdChangedHookSpecificOutputSchema, FileChangedHookSpecificOutputSchema, SyncHookJSONOutputSchema, ElicitationHookSpecificOutputSchema, ElicitationResultHookSpecificOutputSchema, WorktreeCreateHookSpecificOutputSchema, HookJSONOutputSchema, PromptRequestOptionSchema, PromptRequestSchema, PromptResponseSchema, SlashCommandSchema, AgentInfoSchema, ModelInfoSchema, AccountInfoSchema, AgentMcpServerSpecSchema2, AgentDefinitionSchema, SettingSourceSchema, SdkPluginConfigSchema, RewindFilesResultSchema, APIUserMessagePlaceholder, APIAssistantMessagePlaceholder, RawMessageStreamEventPlaceholder, UUIDPlaceholder, NonNullableUsagePlaceholder, SDKAssistantMessageErrorSchema, SDKStatusSchema, SDKUserMessageContentSchema, SDKUserMessageSchema, SDKUserMessageReplaySchema, SDKRateLimitInfoSchema, SDKAssistantMessageSchema, SDKRateLimitEventSchema, SDKStreamlinedTextMessageSchema, SDKStreamlinedToolUseSummaryMessageSchema, SDKPermissionDenialSchema, SDKResultSuccessSchema, SDKResultErrorSchema, SDKResultMessageSchema, SDKSystemMessageSchema, SDKPartialAssistantMessageSchema, SDKCompactBoundaryMessageSchema, SDKStatusMessageSchema, SDKPostTurnSummaryMessageSchema, SDKAPIRetryMessageSchema, SDKLocalCommandOutputMessageSchema, SDKHookStartedMessageSchema, SDKHookProgressMessageSchema, SDKHookResponseMessageSchema, SDKToolProgressMessageSchema, SDKAuthStatusMessageSchema, SDKFilesPersistedEventSchema, SDKTaskNotificationMessageSchema, SDKTaskStartedMessageSchema, SDKSessionStateChangedMessageSchema, SDKTaskProgressMessageSchema, SDKToolUseSummaryMessageSchema, SDKElicitationCompleteMessageSchema, SDKPromptSuggestionMessageSchema, SDKSessionInfoSchema, SDKMessageSchema, FastModeStateSchema;
var init_coreSchemas = __esm(() => {
  init_v4();
  ModelUsageSchema = lazySchema(() => exports_external.object({
    inputTokens: exports_external.number(),
    outputTokens: exports_external.number(),
    cacheReadInputTokens: exports_external.number(),
    cacheCreationInputTokens: exports_external.number(),
    webSearchRequests: exports_external.number(),
    costUSD: exports_external.number(),
    contextWindow: exports_external.number(),
    maxOutputTokens: exports_external.number()
  })), OutputFormatTypeSchema = lazySchema(() => exports_external.literal("json_schema")), BaseOutputFormatSchema = lazySchema(() => exports_external.object({
    type: OutputFormatTypeSchema()
  })), JsonSchemaOutputFormatSchema = lazySchema(() => exports_external.object({
    type: exports_external.literal("json_schema"),
    schema: exports_external.record(exports_external.string(), exports_external.unknown())
  })), OutputFormatSchema = lazySchema(() => JsonSchemaOutputFormatSchema()), ApiKeySourceSchema = lazySchema(() => exports_external.enum(["user", "project", "org", "temporary", "oauth"])), ConfigScopeSchema2 = lazySchema(() => exports_external.enum(["local", "user", "project"]).describe("Config scope for settings.")), SdkBetaSchema = lazySchema(() => exports_external.literal("context-1m-2025-08-07")), ThinkingAdaptiveSchema = lazySchema(() => exports_external.object({
    type: exports_external.literal("adaptive")
  }).describe("Claude decides when and how much to think (Opus 4.6+).")), ThinkingEnabledSchema = lazySchema(() => exports_external.object({
    type: exports_external.literal("enabled"),
    budgetTokens: exports_external.number().optional()
  }).describe("Fixed thinking token budget (older models)")), ThinkingDisabledSchema = lazySchema(() => exports_external.object({
    type: exports_external.literal("disabled")
  }).describe("No extended thinking")), ThinkingConfigSchema = lazySchema(() => exports_external.union([
    ThinkingAdaptiveSchema(),
    ThinkingEnabledSchema(),
    ThinkingDisabledSchema()
  ]).describe("Controls Claude's thinking/reasoning behavior. When set, takes precedence over the deprecated maxThinkingTokens.")), McpStdioServerConfigSchema2 = lazySchema(() => exports_external.object({
    type: exports_external.literal("stdio").optional(),
    command: exports_external.string(),
    args: exports_external.array(exports_external.string()).optional(),
    env: exports_external.record(exports_external.string(), exports_external.string()).optional()
  })), McpSSEServerConfigSchema2 = lazySchema(() => exports_external.object({
    type: exports_external.literal("sse"),
    url: exports_external.string(),
    headers: exports_external.record(exports_external.string(), exports_external.string()).optional()
  })), McpHttpServerConfigSchema = lazySchema(() => exports_external.object({
    type: exports_external.literal("http"),
    url: exports_external.string(),
    headers: exports_external.record(exports_external.string(), exports_external.string()).optional()
  })), McpSdkServerConfigSchema2 = lazySchema(() => exports_external.object({
    type: exports_external.literal("sdk"),
    name: exports_external.string()
  })), McpServerConfigForProcessTransportSchema = lazySchema(() => exports_external.union([
    McpStdioServerConfigSchema2(),
    McpSSEServerConfigSchema2(),
    McpHttpServerConfigSchema(),
    McpSdkServerConfigSchema2()
  ])), McpClaudeAIProxyServerConfigSchema2 = lazySchema(() => exports_external.object({
    type: exports_external.literal("claudeai-proxy"),
    url: exports_external.string(),
    id: exports_external.string()
  })), McpServerStatusConfigSchema = lazySchema(() => exports_external.union([
    McpServerConfigForProcessTransportSchema(),
    McpClaudeAIProxyServerConfigSchema2()
  ])), McpServerStatusSchema = lazySchema(() => exports_external.object({
    name: exports_external.string().describe("Server name as configured"),
    status: exports_external.enum(["connected", "failed", "needs-auth", "pending", "disabled"]).describe("Current connection status"),
    serverInfo: exports_external.object({
      name: exports_external.string(),
      version: exports_external.string()
    }).optional().describe("Server information (available when connected)"),
    error: exports_external.string().optional().describe("Error message (available when status is 'failed')"),
    config: McpServerStatusConfigSchema().optional().describe("Server configuration (includes URL for HTTP/SSE servers)"),
    scope: exports_external.string().optional().describe("Configuration scope (e.g., project, user, local, claudeai, managed)"),
    tools: exports_external.array(exports_external.object({
      name: exports_external.string(),
      description: exports_external.string().optional(),
      annotations: exports_external.object({
        readOnly: exports_external.boolean().optional(),
        destructive: exports_external.boolean().optional(),
        openWorld: exports_external.boolean().optional()
      }).optional()
    })).optional().describe("Tools provided by this server (available when connected)"),
    capabilities: exports_external.object({
      experimental: exports_external.record(exports_external.string(), exports_external.unknown()).optional()
    }).optional().describe("@internal Server capabilities (available when connected). experimental['claude/channel'] is only present if the server's plugin is on the approved channels allowlist \u2014 use its presence to decide whether to show an Enable-channel prompt.")
  }).describe("Status information for an MCP server connection.")), McpSetServersResultSchema = lazySchema(() => exports_external.object({
    added: exports_external.array(exports_external.string()).describe("Names of servers that were added"),
    removed: exports_external.array(exports_external.string()).describe("Names of servers that were removed"),
    errors: exports_external.record(exports_external.string(), exports_external.string()).describe("Map of server names to error messages for servers that failed to connect")
  }).describe("Result of a setMcpServers operation.")), PermissionUpdateDestinationSchema = lazySchema(() => exports_external.enum([
    "userSettings",
    "projectSettings",
    "localSettings",
    "session",
    "cliArg"
  ])), PermissionBehaviorSchema = lazySchema(() => exports_external.enum(["allow", "deny", "ask"])), PermissionRuleValueSchema = lazySchema(() => exports_external.object({
    toolName: exports_external.string(),
    ruleContent: exports_external.string().optional()
  })), PermissionUpdateSchema = lazySchema(() => exports_external.discriminatedUnion("type", [
    exports_external.object({
      type: exports_external.literal("addRules"),
      rules: exports_external.array(PermissionRuleValueSchema()),
      behavior: PermissionBehaviorSchema(),
      destination: PermissionUpdateDestinationSchema()
    }),
    exports_external.object({
      type: exports_external.literal("replaceRules"),
      rules: exports_external.array(PermissionRuleValueSchema()),
      behavior: PermissionBehaviorSchema(),
      destination: PermissionUpdateDestinationSchema()
    }),
    exports_external.object({
      type: exports_external.literal("removeRules"),
      rules: exports_external.array(PermissionRuleValueSchema()),
      behavior: PermissionBehaviorSchema(),
      destination: PermissionUpdateDestinationSchema()
    }),
    exports_external.object({
      type: exports_external.literal("setMode"),
      mode: exports_external.lazy(() => PermissionModeSchema()),
      destination: PermissionUpdateDestinationSchema()
    }),
    exports_external.object({
      type: exports_external.literal("addDirectories"),
      directories: exports_external.array(exports_external.string()),
      destination: PermissionUpdateDestinationSchema()
    }),
    exports_external.object({
      type: exports_external.literal("removeDirectories"),
      directories: exports_external.array(exports_external.string()),
      destination: PermissionUpdateDestinationSchema()
    })
  ])), PermissionDecisionClassificationSchema = lazySchema(() => exports_external.enum(["user_temporary", "user_permanent", "user_reject"]).describe("Classification of this permission decision for telemetry. SDK hosts that prompt users (desktop apps, IDEs) should set this to reflect what actually happened: user_temporary for allow-once, user_permanent for always-allow (both the click and later cache hits), user_reject for deny. If unset, the CLI infers conservatively (temporary for allow, reject for deny). The vocabulary matches tool_decision OTel events (monitoring-usage docs).")), PermissionResultSchema = lazySchema(() => exports_external.union([
    exports_external.object({
      behavior: exports_external.literal("allow"),
      updatedInput: exports_external.record(exports_external.string(), exports_external.unknown()).optional(),
      updatedPermissions: exports_external.array(PermissionUpdateSchema()).optional(),
      toolUseID: exports_external.string().optional(),
      decisionClassification: PermissionDecisionClassificationSchema().optional()
    }),
    exports_external.object({
      behavior: exports_external.literal("deny"),
      message: exports_external.string(),
      interrupt: exports_external.boolean().optional(),
      toolUseID: exports_external.string().optional(),
      decisionClassification: PermissionDecisionClassificationSchema().optional()
    })
  ])), PermissionModeSchema = lazySchema(() => exports_external.enum(["default", "acceptEdits", "bypassPermissions", "plan", "dontAsk"]).describe("Permission mode for controlling how tool executions are handled. 'default' - Standard behavior, prompts for dangerous operations. 'acceptEdits' - Auto-accept file edit operations. 'bypassPermissions' - Bypass all permission checks (requires allowDangerouslySkipPermissions). 'plan' - Planning mode, no actual tool execution. 'dontAsk' - Don't prompt for permissions, deny if not pre-approved.")), HOOK_EVENTS2 = [
    "PreToolUse",
    "PostToolUse",
    "PostToolUseFailure",
    "Notification",
    "UserPromptSubmit",
    "SessionStart",
    "SessionEnd",
    "Stop",
    "StopFailure",
    "SubagentStart",
    "SubagentStop",
    "PreCompact",
    "PostCompact",
    "PermissionRequest",
    "PermissionDenied",
    "Setup",
    "TeammateIdle",
    "TaskCreated",
    "TaskCompleted",
    "Elicitation",
    "ElicitationResult",
    "ConfigChange",
    "WorktreeCreate",
    "WorktreeRemove",
    "InstructionsLoaded",
    "CwdChanged",
    "FileChanged"
  ], HookEventSchema = lazySchema(() => exports_external.enum(HOOK_EVENTS2)), BaseHookInputSchema = lazySchema(() => exports_external.object({
    session_id: exports_external.string(),
    transcript_path: exports_external.string(),
    cwd: exports_external.string(),
    permission_mode: exports_external.string().optional(),
    agent_id: exports_external.string().optional().describe("Subagent identifier. Present only when the hook fires from within a subagent (e.g., a tool called by an AgentTool worker). Absent for the main thread, even in --agent sessions. Use this field (not agent_type) to distinguish subagent calls from main-thread calls."),
    agent_type: exports_external.string().optional().describe('Agent type name (e.g., "general-purpose", "code-reviewer"). Present when the hook fires from within a subagent (alongside agent_id), or on the main thread of a session started with --agent (without agent_id).')
  })), PreToolUseHookInputSchema = lazySchema(() => BaseHookInputSchema().and(exports_external.object({
    hook_event_name: exports_external.literal("PreToolUse"),
    tool_name: exports_external.string(),
    tool_input: exports_external.unknown(),
    tool_use_id: exports_external.string()
  }))), PermissionRequestHookInputSchema = lazySchema(() => BaseHookInputSchema().and(exports_external.object({
    hook_event_name: exports_external.literal("PermissionRequest"),
    tool_name: exports_external.string(),
    tool_input: exports_external.unknown(),
    permission_suggestions: exports_external.array(PermissionUpdateSchema()).optional()
  }))), PostToolUseHookInputSchema = lazySchema(() => BaseHookInputSchema().and(exports_external.object({
    hook_event_name: exports_external.literal("PostToolUse"),
    tool_name: exports_external.string(),
    tool_input: exports_external.unknown(),
    tool_response: exports_external.unknown(),
    tool_use_id: exports_external.string()
  }))), PostToolUseFailureHookInputSchema = lazySchema(() => BaseHookInputSchema().and(exports_external.object({
    hook_event_name: exports_external.literal("PostToolUseFailure"),
    tool_name: exports_external.string(),
    tool_input: exports_external.unknown(),
    tool_use_id: exports_external.string(),
    error: exports_external.string(),
    is_interrupt: exports_external.boolean().optional()
  }))), PermissionDeniedHookInputSchema = lazySchema(() => BaseHookInputSchema().and(exports_external.object({
    hook_event_name: exports_external.literal("PermissionDenied"),
    tool_name: exports_external.string(),
    tool_input: exports_external.unknown(),
    tool_use_id: exports_external.string(),
    reason: exports_external.string()
  }))), NotificationHookInputSchema = lazySchema(() => BaseHookInputSchema().and(exports_external.object({
    hook_event_name: exports_external.literal("Notification"),
    message: exports_external.string(),
    title: exports_external.string().optional(),
    notification_type: exports_external.string()
  }))), UserPromptSubmitHookInputSchema = lazySchema(() => BaseHookInputSchema().and(exports_external.object({
    hook_event_name: exports_external.literal("UserPromptSubmit"),
    prompt: exports_external.string()
  }))), SessionStartHookInputSchema = lazySchema(() => BaseHookInputSchema().and(exports_external.object({
    hook_event_name: exports_external.literal("SessionStart"),
    source: exports_external.enum(["startup", "resume", "clear", "compact"]),
    agent_type: exports_external.string().optional(),
    model: exports_external.string().optional()
  }))), SetupHookInputSchema = lazySchema(() => BaseHookInputSchema().and(exports_external.object({
    hook_event_name: exports_external.literal("Setup"),
    trigger: exports_external.enum(["init", "maintenance"])
  }))), StopHookInputSchema = lazySchema(() => BaseHookInputSchema().and(exports_external.object({
    hook_event_name: exports_external.literal("Stop"),
    stop_hook_active: exports_external.boolean(),
    last_assistant_message: exports_external.string().optional().describe("Text content of the last assistant message before stopping. Avoids the need to read and parse the transcript file.")
  }))), StopFailureHookInputSchema = lazySchema(() => BaseHookInputSchema().and(exports_external.object({
    hook_event_name: exports_external.literal("StopFailure"),
    error: SDKAssistantMessageErrorSchema(),
    error_details: exports_external.string().optional(),
    last_assistant_message: exports_external.string().optional()
  }))), SubagentStartHookInputSchema = lazySchema(() => BaseHookInputSchema().and(exports_external.object({
    hook_event_name: exports_external.literal("SubagentStart"),
    agent_id: exports_external.string(),
    agent_type: exports_external.string()
  }))), SubagentStopHookInputSchema = lazySchema(() => BaseHookInputSchema().and(exports_external.object({
    hook_event_name: exports_external.literal("SubagentStop"),
    stop_hook_active: exports_external.boolean(),
    agent_id: exports_external.string(),
    agent_transcript_path: exports_external.string(),
    agent_type: exports_external.string(),
    last_assistant_message: exports_external.string().optional().describe("Text content of the last assistant message before stopping. Avoids the need to read and parse the transcript file.")
  }))), PreCompactHookInputSchema = lazySchema(() => BaseHookInputSchema().and(exports_external.object({
    hook_event_name: exports_external.literal("PreCompact"),
    trigger: exports_external.enum(["manual", "auto"]),
    custom_instructions: exports_external.string().nullable()
  }))), PostCompactHookInputSchema = lazySchema(() => BaseHookInputSchema().and(exports_external.object({
    hook_event_name: exports_external.literal("PostCompact"),
    trigger: exports_external.enum(["manual", "auto"]),
    compact_summary: exports_external.string().describe("The conversation summary produced by compaction")
  }))), TeammateIdleHookInputSchema = lazySchema(() => BaseHookInputSchema().and(exports_external.object({
    hook_event_name: exports_external.literal("TeammateIdle"),
    teammate_name: exports_external.string(),
    team_name: exports_external.string()
  }))), TaskCreatedHookInputSchema = lazySchema(() => BaseHookInputSchema().and(exports_external.object({
    hook_event_name: exports_external.literal("TaskCreated"),
    task_id: exports_external.string(),
    task_subject: exports_external.string(),
    task_description: exports_external.string().optional(),
    teammate_name: exports_external.string().optional(),
    team_name: exports_external.string().optional()
  }))), TaskCompletedHookInputSchema = lazySchema(() => BaseHookInputSchema().and(exports_external.object({
    hook_event_name: exports_external.literal("TaskCompleted"),
    task_id: exports_external.string(),
    task_subject: exports_external.string(),
    task_description: exports_external.string().optional(),
    teammate_name: exports_external.string().optional(),
    team_name: exports_external.string().optional()
  }))), ElicitationHookInputSchema = lazySchema(() => BaseHookInputSchema().and(exports_external.object({
    hook_event_name: exports_external.literal("Elicitation"),
    mcp_server_name: exports_external.string(),
    message: exports_external.string(),
    mode: exports_external.enum(["form", "url"]).optional(),
    url: exports_external.string().optional(),
    elicitation_id: exports_external.string().optional(),
    requested_schema: exports_external.record(exports_external.string(), exports_external.unknown()).optional()
  })).describe("Hook input for the Elicitation event. Fired when an MCP server requests user input. Hooks can auto-respond (accept/decline) instead of showing the dialog.")), ElicitationResultHookInputSchema = lazySchema(() => BaseHookInputSchema().and(exports_external.object({
    hook_event_name: exports_external.literal("ElicitationResult"),
    mcp_server_name: exports_external.string(),
    elicitation_id: exports_external.string().optional(),
    mode: exports_external.enum(["form", "url"]).optional(),
    action: exports_external.enum(["accept", "decline", "cancel"]),
    content: exports_external.record(exports_external.string(), exports_external.unknown()).optional()
  })).describe("Hook input for the ElicitationResult event. Fired after the user responds to an MCP elicitation. Hooks can observe or override the response before it is sent to the server.")), CONFIG_CHANGE_SOURCES = [
    "user_settings",
    "project_settings",
    "local_settings",
    "policy_settings",
    "skills"
  ], ConfigChangeHookInputSchema = lazySchema(() => BaseHookInputSchema().and(exports_external.object({
    hook_event_name: exports_external.literal("ConfigChange"),
    source: exports_external.enum(CONFIG_CHANGE_SOURCES),
    file_path: exports_external.string().optional()
  }))), INSTRUCTIONS_LOAD_REASONS = [
    "session_start",
    "nested_traversal",
    "path_glob_match",
    "include",
    "compact"
  ], INSTRUCTIONS_MEMORY_TYPES = [
    "User",
    "Project",
    "Local",
    "Managed"
  ], InstructionsLoadedHookInputSchema = lazySchema(() => BaseHookInputSchema().and(exports_external.object({
    hook_event_name: exports_external.literal("InstructionsLoaded"),
    file_path: exports_external.string(),
    memory_type: exports_external.enum(INSTRUCTIONS_MEMORY_TYPES),
    load_reason: exports_external.enum(INSTRUCTIONS_LOAD_REASONS),
    globs: exports_external.array(exports_external.string()).optional(),
    trigger_file_path: exports_external.string().optional(),
    parent_file_path: exports_external.string().optional()
  }))), WorktreeCreateHookInputSchema = lazySchema(() => BaseHookInputSchema().and(exports_external.object({
    hook_event_name: exports_external.literal("WorktreeCreate"),
    name: exports_external.string()
  }))), WorktreeRemoveHookInputSchema = lazySchema(() => BaseHookInputSchema().and(exports_external.object({
    hook_event_name: exports_external.literal("WorktreeRemove"),
    worktree_path: exports_external.string()
  }))), CwdChangedHookInputSchema = lazySchema(() => BaseHookInputSchema().and(exports_external.object({
    hook_event_name: exports_external.literal("CwdChanged"),
    old_cwd: exports_external.string(),
    new_cwd: exports_external.string()
  }))), FileChangedHookInputSchema = lazySchema(() => BaseHookInputSchema().and(exports_external.object({
    hook_event_name: exports_external.literal("FileChanged"),
    file_path: exports_external.string(),
    event: exports_external.enum(["change", "add", "unlink"])
  }))), EXIT_REASONS = [
    "clear",
    "resume",
    "logout",
    "prompt_input_exit",
    "other",
    "bypass_permissions_disabled"
  ], ExitReasonSchema = lazySchema(() => exports_external.enum(EXIT_REASONS)), SessionEndHookInputSchema = lazySchema(() => BaseHookInputSchema().and(exports_external.object({
    hook_event_name: exports_external.literal("SessionEnd"),
    reason: ExitReasonSchema()
  }))), HookInputSchema = lazySchema(() => exports_external.union([
    PreToolUseHookInputSchema(),
    PostToolUseHookInputSchema(),
    PostToolUseFailureHookInputSchema(),
    PermissionDeniedHookInputSchema(),
    NotificationHookInputSchema(),
    UserPromptSubmitHookInputSchema(),
    SessionStartHookInputSchema(),
    SessionEndHookInputSchema(),
    StopHookInputSchema(),
    StopFailureHookInputSchema(),
    SubagentStartHookInputSchema(),
    SubagentStopHookInputSchema(),
    PreCompactHookInputSchema(),
    PostCompactHookInputSchema(),
    PermissionRequestHookInputSchema(),
    SetupHookInputSchema(),
    TeammateIdleHookInputSchema(),
    TaskCreatedHookInputSchema(),
    TaskCompletedHookInputSchema(),
    ElicitationHookInputSchema(),
    ElicitationResultHookInputSchema(),
    ConfigChangeHookInputSchema(),
    InstructionsLoadedHookInputSchema(),
    WorktreeCreateHookInputSchema(),
    WorktreeRemoveHookInputSchema(),
    CwdChangedHookInputSchema(),
    FileChangedHookInputSchema()
  ])), AsyncHookJSONOutputSchema = lazySchema(() => exports_external.object({
    async: exports_external.literal(!0),
    asyncTimeout: exports_external.number().optional()
  })), PreToolUseHookSpecificOutputSchema = lazySchema(() => exports_external.object({
    hookEventName: exports_external.literal("PreToolUse"),
    permissionDecision: PermissionBehaviorSchema().optional(),
    permissionDecisionReason: exports_external.string().optional(),
    updatedInput: exports_external.record(exports_external.string(), exports_external.unknown()).optional(),
    additionalContext: exports_external.string().optional()
  })), UserPromptSubmitHookSpecificOutputSchema = lazySchema(() => exports_external.object({
    hookEventName: exports_external.literal("UserPromptSubmit"),
    additionalContext: exports_external.string().optional()
  })), SessionStartHookSpecificOutputSchema = lazySchema(() => exports_external.object({
    hookEventName: exports_external.literal("SessionStart"),
    additionalContext: exports_external.string().optional(),
    initialUserMessage: exports_external.string().optional(),
    watchPaths: exports_external.array(exports_external.string()).optional()
  })), SetupHookSpecificOutputSchema = lazySchema(() => exports_external.object({
    hookEventName: exports_external.literal("Setup"),
    additionalContext: exports_external.string().optional()
  })), SubagentStartHookSpecificOutputSchema = lazySchema(() => exports_external.object({
    hookEventName: exports_external.literal("SubagentStart"),
    additionalContext: exports_external.string().optional()
  })), PostToolUseHookSpecificOutputSchema = lazySchema(() => exports_external.object({
    hookEventName: exports_external.literal("PostToolUse"),
    additionalContext: exports_external.string().optional(),
    updatedMCPToolOutput: exports_external.unknown().optional()
  })), PostToolUseFailureHookSpecificOutputSchema = lazySchema(() => exports_external.object({
    hookEventName: exports_external.literal("PostToolUseFailure"),
    additionalContext: exports_external.string().optional()
  })), PermissionDeniedHookSpecificOutputSchema = lazySchema(() => exports_external.object({
    hookEventName: exports_external.literal("PermissionDenied"),
    retry: exports_external.boolean().optional()
  })), NotificationHookSpecificOutputSchema = lazySchema(() => exports_external.object({
    hookEventName: exports_external.literal("Notification"),
    additionalContext: exports_external.string().optional()
  })), PermissionRequestHookSpecificOutputSchema = lazySchema(() => exports_external.object({
    hookEventName: exports_external.literal("PermissionRequest"),
    decision: exports_external.union([
      exports_external.object({
        behavior: exports_external.literal("allow"),
        updatedInput: exports_external.record(exports_external.string(), exports_external.unknown()).optional(),
        updatedPermissions: exports_external.array(PermissionUpdateSchema()).optional()
      }),
      exports_external.object({
        behavior: exports_external.literal("deny"),
        message: exports_external.string().optional(),
        interrupt: exports_external.boolean().optional()
      })
    ])
  })), CwdChangedHookSpecificOutputSchema = lazySchema(() => exports_external.object({
    hookEventName: exports_external.literal("CwdChanged"),
    watchPaths: exports_external.array(exports_external.string()).optional()
  })), FileChangedHookSpecificOutputSchema = lazySchema(() => exports_external.object({
    hookEventName: exports_external.literal("FileChanged"),
    watchPaths: exports_external.array(exports_external.string()).optional()
  })), SyncHookJSONOutputSchema = lazySchema(() => exports_external.object({
    continue: exports_external.boolean().optional(),
    suppressOutput: exports_external.boolean().optional(),
    stopReason: exports_external.string().optional(),
    decision: exports_external.enum(["approve", "block"]).optional(),
    systemMessage: exports_external.string().optional(),
    reason: exports_external.string().optional(),
    hookSpecificOutput: exports_external.union([
      PreToolUseHookSpecificOutputSchema(),
      UserPromptSubmitHookSpecificOutputSchema(),
      SessionStartHookSpecificOutputSchema(),
      SetupHookSpecificOutputSchema(),
      SubagentStartHookSpecificOutputSchema(),
      PostToolUseHookSpecificOutputSchema(),
      PostToolUseFailureHookSpecificOutputSchema(),
      PermissionDeniedHookSpecificOutputSchema(),
      NotificationHookSpecificOutputSchema(),
      PermissionRequestHookSpecificOutputSchema(),
      ElicitationHookSpecificOutputSchema(),
      ElicitationResultHookSpecificOutputSchema(),
      CwdChangedHookSpecificOutputSchema(),
      FileChangedHookSpecificOutputSchema(),
      WorktreeCreateHookSpecificOutputSchema()
    ]).optional()
  })), ElicitationHookSpecificOutputSchema = lazySchema(() => exports_external.object({
    hookEventName: exports_external.literal("Elicitation"),
    action: exports_external.enum(["accept", "decline", "cancel"]).optional(),
    content: exports_external.record(exports_external.string(), exports_external.unknown()).optional()
  }).describe("Hook-specific output for the Elicitation event. Return this to programmatically accept or decline an MCP elicitation request.")), ElicitationResultHookSpecificOutputSchema = lazySchema(() => exports_external.object({
    hookEventName: exports_external.literal("ElicitationResult"),
    action: exports_external.enum(["accept", "decline", "cancel"]).optional(),
    content: exports_external.record(exports_external.string(), exports_external.unknown()).optional()
  }).describe("Hook-specific output for the ElicitationResult event. Return this to override the action or content before the response is sent to the MCP server.")), WorktreeCreateHookSpecificOutputSchema = lazySchema(() => exports_external.object({
    hookEventName: exports_external.literal("WorktreeCreate"),
    worktreePath: exports_external.string()
  }).describe("Hook-specific output for the WorktreeCreate event. Provides the absolute path to the created worktree directory. Command hooks print the path on stdout instead.")), HookJSONOutputSchema = lazySchema(() => exports_external.union([AsyncHookJSONOutputSchema(), SyncHookJSONOutputSchema()])), PromptRequestOptionSchema = lazySchema(() => exports_external.object({
    key: exports_external.string().describe("Unique key for this option, returned in the response"),
    label: exports_external.string().describe("Display text for this option"),
    description: exports_external.string().optional().describe("Optional description shown below the label")
  })), PromptRequestSchema = lazySchema(() => exports_external.object({
    prompt: exports_external.string().describe("Request ID. Presence of this key marks the line as a prompt request."),
    message: exports_external.string().describe("The prompt message to display to the user"),
    options: exports_external.array(PromptRequestOptionSchema()).describe("Available options for the user to choose from")
  })), PromptResponseSchema = lazySchema(() => exports_external.object({
    prompt_response: exports_external.string().describe("The request ID from the corresponding prompt request"),
    selected: exports_external.string().describe("The key of the selected option")
  })), SlashCommandSchema = lazySchema(() => exports_external.object({
    name: exports_external.string().describe("Skill name (without the leading slash)"),
    description: exports_external.string().describe("Description of what the skill does"),
    argumentHint: exports_external.string().describe('Hint for skill arguments (e.g., "<file>")')
  }).describe("Information about an available skill (invoked via /command syntax).")), AgentInfoSchema = lazySchema(() => exports_external.object({
    name: exports_external.string().describe('Agent type identifier (e.g., "Explore")'),
    description: exports_external.string().describe("Description of when to use this agent"),
    model: exports_external.string().optional().describe("Model alias this agent uses. If omitted, inherits the parent's model")
  }).describe("Information about an available subagent that can be invoked via the Task tool.")), ModelInfoSchema = lazySchema(() => exports_external.object({
    value: exports_external.string().describe("Model identifier to use in API calls"),
    displayName: exports_external.string().describe("Human-readable display name"),
    description: exports_external.string().describe("Description of the model's capabilities"),
    supportsEffort: exports_external.boolean().optional().describe("Whether this model supports effort levels"),
    supportedEffortLevels: exports_external.array(exports_external.enum(["low", "medium", "high", "max"])).optional().describe("Available effort levels for this model"),
    supportsAdaptiveThinking: exports_external.boolean().optional().describe("Whether this model supports adaptive thinking (Claude decides when and how much to think)"),
    supportsFastMode: exports_external.boolean().optional().describe("Whether this model supports fast mode"),
    supportsAutoMode: exports_external.boolean().optional().describe("Whether this model supports auto mode")
  }).describe("Information about an available model.")), AccountInfoSchema = lazySchema(() => exports_external.object({
    email: exports_external.string().optional(),
    organization: exports_external.string().optional(),
    subscriptionType: exports_external.string().optional(),
    tokenSource: exports_external.string().optional(),
    apiKeySource: exports_external.string().optional(),
    apiProvider: exports_external.enum(["firstParty", "bedrock", "vertex", "foundry"]).optional().describe('Active API backend. Anthropic OAuth login only applies when "firstParty"; for 3P providers the other fields are absent and auth is external (AWS creds, gcloud ADC, etc.).')
  }).describe("Information about the logged in user's account.")), AgentMcpServerSpecSchema2 = lazySchema(() => exports_external.union([
    exports_external.string(),
    exports_external.record(exports_external.string(), McpServerConfigForProcessTransportSchema())
  ])), AgentDefinitionSchema = lazySchema(() => exports_external.object({
    description: exports_external.string().describe("Natural language description of when to use this agent"),
    tools: exports_external.array(exports_external.string()).optional().describe("Array of allowed tool names. If omitted, inherits all tools from parent"),
    disallowedTools: exports_external.array(exports_external.string()).optional().describe("Array of tool names to explicitly disallow for this agent"),
    prompt: exports_external.string().describe("The agent's system prompt"),
    model: exports_external.string().optional().describe("Model alias (e.g. 'sonnet', 'opus', 'haiku') or full model ID (e.g. 'claude-opus-4-5'). If omitted or 'inherit', uses the main model"),
    mcpServers: exports_external.array(AgentMcpServerSpecSchema2()).optional(),
    criticalSystemReminder_EXPERIMENTAL: exports_external.string().optional().describe("Experimental: Critical reminder added to system prompt"),
    skills: exports_external.array(exports_external.string()).optional().describe("Array of skill names to preload into the agent context"),
    initialPrompt: exports_external.string().optional().describe("Auto-submitted as the first user turn when this agent is the main thread agent. Slash commands are processed. Prepended to any user-provided prompt."),
    maxTurns: exports_external.number().int().positive().optional().describe("Maximum number of agentic turns (API round-trips) before stopping"),
    background: exports_external.boolean().optional().describe("Run this agent as a background task (non-blocking, fire-and-forget) when invoked"),
    memory: exports_external.enum(["user", "project", "local"]).optional().describe("Scope for auto-loading agent memory files. 'user' - ~/.claude/agent-memory/<agentType>/, 'project' - .claude/agent-memory/<agentType>/, 'local' - .claude/agent-memory-local/<agentType>/"),
    effort: exports_external.union([exports_external.enum(["low", "medium", "high", "max"]), exports_external.number().int()]).optional().describe("Reasoning effort level for this agent. Either a named level or an integer"),
    permissionMode: PermissionModeSchema().optional().describe("Permission mode controlling how tool executions are handled")
  }).describe("Definition for a custom subagent that can be invoked via the Agent tool.")), SettingSourceSchema = lazySchema(() => exports_external.enum(["user", "project", "local"]).describe("Source for loading filesystem-based settings. 'user' - Global user settings (~/.claude/settings.json). 'project' - Project settings (.claude/settings.json). 'local' - Local settings (.claude/settings.local.json).")), SdkPluginConfigSchema = lazySchema(() => exports_external.object({
    type: exports_external.literal("local").describe("Plugin type. Currently only 'local' is supported"),
    path: exports_external.string().describe("Absolute or relative path to the plugin directory")
  }).describe("Configuration for loading a plugin.")), RewindFilesResultSchema = lazySchema(() => exports_external.object({
    canRewind: exports_external.boolean(),
    error: exports_external.string().optional(),
    filesChanged: exports_external.array(exports_external.string()).optional(),
    insertions: exports_external.number().optional(),
    deletions: exports_external.number().optional()
  }).describe("Result of a rewindFiles operation.")), APIUserMessagePlaceholder = lazySchema(() => exports_external.unknown()), APIAssistantMessagePlaceholder = lazySchema(() => exports_external.unknown()), RawMessageStreamEventPlaceholder = lazySchema(() => exports_external.unknown()), UUIDPlaceholder = lazySchema(() => exports_external.string()), NonNullableUsagePlaceholder = lazySchema(() => exports_external.unknown()), SDKAssistantMessageErrorSchema = lazySchema(() => exports_external.enum([
    "authentication_failed",
    "billing_error",
    "rate_limit",
    "invalid_request",
    "server_error",
    "unknown",
    "max_output_tokens"
  ])), SDKStatusSchema = lazySchema(() => exports_external.union([exports_external.literal("compacting"), exports_external.null()])), SDKUserMessageContentSchema = lazySchema(() => exports_external.object({
    type: exports_external.literal("user"),
    message: APIUserMessagePlaceholder(),
    parent_tool_use_id: exports_external.string().nullable(),
    isSynthetic: exports_external.boolean().optional(),
    tool_use_result: exports_external.unknown().optional(),
    priority: exports_external.enum(["now", "next", "later"]).optional(),
    timestamp: exports_external.string().optional().describe("ISO timestamp when the message was created on the originating process. Older emitters omit it; consumers should fall back to receive time.")
  })), SDKUserMessageSchema = lazySchema(() => SDKUserMessageContentSchema().extend({
    uuid: UUIDPlaceholder().optional(),
    session_id: exports_external.string().optional()
  })), SDKUserMessageReplaySchema = lazySchema(() => SDKUserMessageContentSchema().extend({
    uuid: UUIDPlaceholder(),
    session_id: exports_external.string(),
    isReplay: exports_external.literal(!0)
  })), SDKRateLimitInfoSchema = lazySchema(() => exports_external.object({
    status: exports_external.enum(["allowed", "allowed_warning", "rejected"]),
    resetsAt: exports_external.number().optional(),
    rateLimitType: exports_external.enum([
      "five_hour",
      "seven_day",
      "seven_day_opus",
      "seven_day_sonnet",
      "overage"
    ]).optional(),
    utilization: exports_external.number().optional(),
    overageStatus: exports_external.enum(["allowed", "allowed_warning", "rejected"]).optional(),
    overageResetsAt: exports_external.number().optional(),
    overageDisabledReason: exports_external.enum([
      "overage_not_provisioned",
      "org_level_disabled",
      "org_level_disabled_until",
      "out_of_credits",
      "seat_tier_level_disabled",
      "member_level_disabled",
      "seat_tier_zero_credit_limit",
      "group_zero_credit_limit",
      "member_zero_credit_limit",
      "org_service_level_disabled",
      "org_service_zero_credit_limit",
      "no_limits_configured",
      "unknown"
    ]).optional(),
    isUsingOverage: exports_external.boolean().optional(),
    surpassedThreshold: exports_external.number().optional()
  }).describe("Rate limit information for claude.ai subscription users.")), SDKAssistantMessageSchema = lazySchema(() => exports_external.object({
    type: exports_external.literal("assistant"),
    message: APIAssistantMessagePlaceholder(),
    parent_tool_use_id: exports_external.string().nullable(),
    error: SDKAssistantMessageErrorSchema().optional(),
    uuid: UUIDPlaceholder(),
    session_id: exports_external.string()
  })), SDKRateLimitEventSchema = lazySchema(() => exports_external.object({
    type: exports_external.literal("rate_limit_event"),
    rate_limit_info: SDKRateLimitInfoSchema(),
    uuid: UUIDPlaceholder(),
    session_id: exports_external.string()
  }).describe("Rate limit event emitted when rate limit info changes.")), SDKStreamlinedTextMessageSchema = lazySchema(() => exports_external.object({
    type: exports_external.literal("streamlined_text"),
    text: exports_external.string().describe("Text content preserved from the assistant message"),
    session_id: exports_external.string(),
    uuid: UUIDPlaceholder()
  }).describe("@internal Streamlined text message - replaces SDKAssistantMessage in streamlined output. Text content preserved, thinking and tool_use blocks removed.")), SDKStreamlinedToolUseSummaryMessageSchema = lazySchema(() => exports_external.object({
    type: exports_external.literal("streamlined_tool_use_summary"),
    tool_summary: exports_external.string().describe('Summary of tool calls (e.g., "Read 2 files, wrote 1 file")'),
    session_id: exports_external.string(),
    uuid: UUIDPlaceholder()
  }).describe("@internal Streamlined tool use summary - replaces tool_use blocks in streamlined output with a cumulative summary string.")), SDKPermissionDenialSchema = lazySchema(() => exports_external.object({
    tool_name: exports_external.string(),
    tool_use_id: exports_external.string(),
    tool_input: exports_external.record(exports_external.string(), exports_external.unknown())
  })), SDKResultSuccessSchema = lazySchema(() => exports_external.object({
    type: exports_external.literal("result"),
    subtype: exports_external.literal("success"),
    duration_ms: exports_external.number(),
    duration_api_ms: exports_external.number(),
    is_error: exports_external.boolean(),
    num_turns: exports_external.number(),
    result: exports_external.string(),
    stop_reason: exports_external.string().nullable(),
    total_cost_usd: exports_external.number(),
    usage: NonNullableUsagePlaceholder(),
    modelUsage: exports_external.record(exports_external.string(), ModelUsageSchema()),
    permission_denials: exports_external.array(SDKPermissionDenialSchema()),
    structured_output: exports_external.unknown().optional(),
    fast_mode_state: FastModeStateSchema().optional(),
    uuid: UUIDPlaceholder(),
    session_id: exports_external.string()
  })), SDKResultErrorSchema = lazySchema(() => exports_external.object({
    type: exports_external.literal("result"),
    subtype: exports_external.enum([
      "error_during_execution",
      "error_max_turns",
      "error_max_budget_usd",
      "error_max_structured_output_retries"
    ]),
    duration_ms: exports_external.number(),
    duration_api_ms: exports_external.number(),
    is_error: exports_external.boolean(),
    num_turns: exports_external.number(),
    stop_reason: exports_external.string().nullable(),
    total_cost_usd: exports_external.number(),
    usage: NonNullableUsagePlaceholder(),
    modelUsage: exports_external.record(exports_external.string(), ModelUsageSchema()),
    permission_denials: exports_external.array(SDKPermissionDenialSchema()),
    errors: exports_external.array(exports_external.string()),
    fast_mode_state: FastModeStateSchema().optional(),
    uuid: UUIDPlaceholder(),
    session_id: exports_external.string()
  })), SDKResultMessageSchema = lazySchema(() => exports_external.union([SDKResultSuccessSchema(), SDKResultErrorSchema()])), SDKSystemMessageSchema = lazySchema(() => exports_external.object({
    type: exports_external.literal("system"),
    subtype: exports_external.literal("init"),
    agents: exports_external.array(exports_external.string()).optional(),
    apiKeySource: ApiKeySourceSchema(),
    betas: exports_external.array(exports_external.string()).optional(),
    claude_code_version: exports_external.string(),
    cwd: exports_external.string(),
    tools: exports_external.array(exports_external.string()),
    mcp_servers: exports_external.array(exports_external.object({
      name: exports_external.string(),
      status: exports_external.string()
    })),
    model: exports_external.string(),
    permissionMode: PermissionModeSchema(),
    slash_commands: exports_external.array(exports_external.string()),
    output_style: exports_external.string(),
    skills: exports_external.array(exports_external.string()),
    plugins: exports_external.array(exports_external.object({
      name: exports_external.string(),
      path: exports_external.string(),
      source: exports_external.string().optional().describe('@internal Plugin source identifier in "name\\@marketplace" format. Sentinels: "name\\@inline" for --plugin-dir, "name\\@builtin" for built-in plugins.')
    })),
    fast_mode_state: FastModeStateSchema().optional(),
    uuid: UUIDPlaceholder(),
    session_id: exports_external.string()
  })), SDKPartialAssistantMessageSchema = lazySchema(() => exports_external.object({
    type: exports_external.literal("stream_event"),
    event: RawMessageStreamEventPlaceholder(),
    parent_tool_use_id: exports_external.string().nullable(),
    uuid: UUIDPlaceholder(),
    session_id: exports_external.string()
  })), SDKCompactBoundaryMessageSchema = lazySchema(() => exports_external.object({
    type: exports_external.literal("system"),
    subtype: exports_external.literal("compact_boundary"),
    compact_metadata: exports_external.object({
      trigger: exports_external.enum(["manual", "auto"]),
      pre_tokens: exports_external.number(),
      preserved_segment: exports_external.object({
        head_uuid: UUIDPlaceholder(),
        anchor_uuid: UUIDPlaceholder(),
        tail_uuid: UUIDPlaceholder()
      }).optional().describe("Relink info for messagesToKeep. Loaders splice the preserved segment at anchor_uuid (summary for suffix-preserving, boundary for prefix-preserving partial compact) so resume includes preserved content. Unset when compaction summarizes everything (no messagesToKeep).")
    }),
    uuid: UUIDPlaceholder(),
    session_id: exports_external.string()
  })), SDKStatusMessageSchema = lazySchema(() => exports_external.object({
    type: exports_external.literal("system"),
    subtype: exports_external.literal("status"),
    status: SDKStatusSchema(),
    permissionMode: PermissionModeSchema().optional(),
    uuid: UUIDPlaceholder(),
    session_id: exports_external.string()
  })), SDKPostTurnSummaryMessageSchema = lazySchema(() => exports_external.object({
    type: exports_external.literal("system"),
    subtype: exports_external.literal("post_turn_summary"),
    summarizes_uuid: exports_external.string(),
    status_category: exports_external.enum([
      "blocked",
      "waiting",
      "completed",
      "review_ready",
      "failed"
    ]),
    status_detail: exports_external.string(),
    is_noteworthy: exports_external.boolean(),
    title: exports_external.string(),
    description: exports_external.string(),
    recent_action: exports_external.string(),
    needs_action: exports_external.string(),
    artifact_urls: exports_external.array(exports_external.string()),
    uuid: UUIDPlaceholder(),
    session_id: exports_external.string()
  }).describe("@internal Background post-turn summary emitted after each assistant turn. summarizes_uuid points to the assistant message this summarizes.")), SDKAPIRetryMessageSchema = lazySchema(() => exports_external.object({
    type: exports_external.literal("system"),
    subtype: exports_external.literal("api_retry"),
    attempt: exports_external.number(),
    max_retries: exports_external.number(),
    retry_delay_ms: exports_external.number(),
    error_status: exports_external.number().nullable(),
    error: SDKAssistantMessageErrorSchema(),
    uuid: UUIDPlaceholder(),
    session_id: exports_external.string()
  }).describe("Emitted when an API request fails with a retryable error and will be retried after a delay. error_status is null for connection errors (e.g. timeouts) that had no HTTP response.")), SDKLocalCommandOutputMessageSchema = lazySchema(() => exports_external.object({
    type: exports_external.literal("system"),
    subtype: exports_external.literal("local_command_output"),
    content: exports_external.string(),
    uuid: UUIDPlaceholder(),
    session_id: exports_external.string()
  }).describe("Output from a local slash command (e.g. /voice, /cost). Displayed as assistant-style text in the transcript.")), SDKHookStartedMessageSchema = lazySchema(() => exports_external.object({
    type: exports_external.literal("system"),
    subtype: exports_external.literal("hook_started"),
    hook_id: exports_external.string(),
    hook_name: exports_external.string(),
    hook_event: exports_external.string(),
    uuid: UUIDPlaceholder(),
    session_id: exports_external.string()
  })), SDKHookProgressMessageSchema = lazySchema(() => exports_external.object({
    type: exports_external.literal("system"),
    subtype: exports_external.literal("hook_progress"),
    hook_id: exports_external.string(),
    hook_name: exports_external.string(),
    hook_event: exports_external.string(),
    stdout: exports_external.string(),
    stderr: exports_external.string(),
    output: exports_external.string(),
    uuid: UUIDPlaceholder(),
    session_id: exports_external.string()
  })), SDKHookResponseMessageSchema = lazySchema(() => exports_external.object({
    type: exports_external.literal("system"),
    subtype: exports_external.literal("hook_response"),
    hook_id: exports_external.string(),
    hook_name: exports_external.string(),
    hook_event: exports_external.string(),
    output: exports_external.string(),
    stdout: exports_external.string(),
    stderr: exports_external.string(),
    exit_code: exports_external.number().optional(),
    outcome: exports_external.enum(["success", "error", "cancelled"]),
    uuid: UUIDPlaceholder(),
    session_id: exports_external.string()
  })), SDKToolProgressMessageSchema = lazySchema(() => exports_external.object({
    type: exports_external.literal("tool_progress"),
    tool_use_id: exports_external.string(),
    tool_name: exports_external.string(),
    parent_tool_use_id: exports_external.string().nullable(),
    elapsed_time_seconds: exports_external.number(),
    task_id: exports_external.string().optional(),
    uuid: UUIDPlaceholder(),
    session_id: exports_external.string()
  })), SDKAuthStatusMessageSchema = lazySchema(() => exports_external.object({
    type: exports_external.literal("auth_status"),
    isAuthenticating: exports_external.boolean(),
    output: exports_external.array(exports_external.string()),
    error: exports_external.string().optional(),
    uuid: UUIDPlaceholder(),
    session_id: exports_external.string()
  })), SDKFilesPersistedEventSchema = lazySchema(() => exports_external.object({
    type: exports_external.literal("system"),
    subtype: exports_external.literal("files_persisted"),
    files: exports_external.array(exports_external.object({
      filename: exports_external.string(),
      file_id: exports_external.string()
    })),
    failed: exports_external.array(exports_external.object({
      filename: exports_external.string(),
      error: exports_external.string()
    })),
    processed_at: exports_external.string(),
    uuid: UUIDPlaceholder(),
    session_id: exports_external.string()
  })), SDKTaskNotificationMessageSchema = lazySchema(() => exports_external.object({
    type: exports_external.literal("system"),
    subtype: exports_external.literal("task_notification"),
    task_id: exports_external.string(),
    tool_use_id: exports_external.string().optional(),
    status: exports_external.enum(["completed", "failed", "stopped"]),
    output_file: exports_external.string(),
    summary: exports_external.string(),
    usage: exports_external.object({
      total_tokens: exports_external.number(),
      tool_uses: exports_external.number(),
      duration_ms: exports_external.number()
    }).optional(),
    uuid: UUIDPlaceholder(),
    session_id: exports_external.string()
  })), SDKTaskStartedMessageSchema = lazySchema(() => exports_external.object({
    type: exports_external.literal("system"),
    subtype: exports_external.literal("task_started"),
    task_id: exports_external.string(),
    tool_use_id: exports_external.string().optional(),
    description: exports_external.string(),
    task_type: exports_external.string().optional(),
    workflow_name: exports_external.string().optional().describe("meta.name from the workflow script (e.g. 'spec'). Only set when task_type is 'local_workflow'."),
    prompt: exports_external.string().optional(),
    uuid: UUIDPlaceholder(),
    session_id: exports_external.string()
  })), SDKSessionStateChangedMessageSchema = lazySchema(() => exports_external.object({
    type: exports_external.literal("system"),
    subtype: exports_external.literal("session_state_changed"),
    state: exports_external.enum(["idle", "running", "requires_action"]),
    uuid: UUIDPlaceholder(),
    session_id: exports_external.string()
  }).describe("Mirrors notifySessionStateChanged. 'idle' fires after heldBackResult flushes and the bg-agent do-while exits \u2014 authoritative turn-over signal.")), SDKTaskProgressMessageSchema = lazySchema(() => exports_external.object({
    type: exports_external.literal("system"),
    subtype: exports_external.literal("task_progress"),
    task_id: exports_external.string(),
    tool_use_id: exports_external.string().optional(),
    description: exports_external.string(),
    usage: exports_external.object({
      total_tokens: exports_external.number(),
      tool_uses: exports_external.number(),
      duration_ms: exports_external.number()
    }),
    last_tool_name: exports_external.string().optional(),
    summary: exports_external.string().optional(),
    uuid: UUIDPlaceholder(),
    session_id: exports_external.string()
  })), SDKToolUseSummaryMessageSchema = lazySchema(() => exports_external.object({
    type: exports_external.literal("tool_use_summary"),
    summary: exports_external.string(),
    preceding_tool_use_ids: exports_external.array(exports_external.string()),
    uuid: UUIDPlaceholder(),
    session_id: exports_external.string()
  })), SDKElicitationCompleteMessageSchema = lazySchema(() => exports_external.object({
    type: exports_external.literal("system"),
    subtype: exports_external.literal("elicitation_complete"),
    mcp_server_name: exports_external.string(),
    elicitation_id: exports_external.string(),
    uuid: UUIDPlaceholder(),
    session_id: exports_external.string()
  }).describe("Emitted when an MCP server confirms that a URL-mode elicitation is complete.")), SDKPromptSuggestionMessageSchema = lazySchema(() => exports_external.object({
    type: exports_external.literal("prompt_suggestion"),
    suggestion: exports_external.string(),
    uuid: UUIDPlaceholder(),
    session_id: exports_external.string()
  }).describe("Predicted next user prompt, emitted after each turn when promptSuggestions is enabled.")), SDKSessionInfoSchema = lazySchema(() => exports_external.object({
    sessionId: exports_external.string().describe("Unique session identifier (UUID)."),
    summary: exports_external.string().describe("Display title for the session: custom title, auto-generated summary, or first prompt."),
    lastModified: exports_external.number().describe("Last modified time in milliseconds since epoch."),
    fileSize: exports_external.number().optional().describe("File size in bytes. Only populated for local JSONL storage."),
    customTitle: exports_external.string().optional().describe("User-set session title via /rename."),
    firstPrompt: exports_external.string().optional().describe("First meaningful user prompt in the session."),
    gitBranch: exports_external.string().optional().describe("Git branch at the end of the session."),
    cwd: exports_external.string().optional().describe("Working directory for the session."),
    tag: exports_external.string().optional().describe("User-set session tag."),
    createdAt: exports_external.number().optional().describe("Creation time in milliseconds since epoch, extracted from the first entry's timestamp.")
  }).describe("Session metadata returned by listSessions and getSessionInfo.")), SDKMessageSchema = lazySchema(() => exports_external.union([
    SDKAssistantMessageSchema(),
    SDKUserMessageSchema(),
    SDKUserMessageReplaySchema(),
    SDKResultMessageSchema(),
    SDKSystemMessageSchema(),
    SDKPartialAssistantMessageSchema(),
    SDKCompactBoundaryMessageSchema(),
    SDKStatusMessageSchema(),
    SDKAPIRetryMessageSchema(),
    SDKLocalCommandOutputMessageSchema(),
    SDKHookStartedMessageSchema(),
    SDKHookProgressMessageSchema(),
    SDKHookResponseMessageSchema(),
    SDKToolProgressMessageSchema(),
    SDKAuthStatusMessageSchema(),
    SDKTaskNotificationMessageSchema(),
    SDKTaskStartedMessageSchema(),
    SDKTaskProgressMessageSchema(),
    SDKSessionStateChangedMessageSchema(),
    SDKFilesPersistedEventSchema(),
    SDKToolUseSummaryMessageSchema(),
    SDKRateLimitEventSchema(),
    SDKElicitationCompleteMessageSchema(),
    SDKPromptSuggestionMessageSchema()
  ])), FastModeStateSchema = lazySchema(() => exports_external.enum(["off", "cooldown", "on"]).describe("Fast mode state: off, in cooldown after rate limit, or actively enabled."));
});
