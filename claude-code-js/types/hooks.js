// Original: src/types/hooks.ts
function isSyncHookJSONOutput(json2) {
  return !(("async" in json2) && json2.async === !0);
}
function isAsyncHookJSONOutput(json2) {
  return "async" in json2 && json2.async === !0;
}
var promptRequestSchema, syncHookResponseSchema, hookJSONOutputSchema;
var init_hooks4 = __esm(() => {
  init_v4();
  init_agentSdkTypes();
  init_PermissionRule();
  init_PermissionUpdateSchema();
  promptRequestSchema = lazySchema(() => exports_external.object({
    prompt: exports_external.string(),
    message: exports_external.string(),
    options: exports_external.array(exports_external.object({
      key: exports_external.string(),
      label: exports_external.string(),
      description: exports_external.string().optional()
    }))
  })), syncHookResponseSchema = lazySchema(() => exports_external.object({
    continue: exports_external.boolean().describe("Whether Claude should continue after hook (default: true)").optional(),
    suppressOutput: exports_external.boolean().describe("Hide stdout from transcript (default: false)").optional(),
    stopReason: exports_external.string().describe("Message shown when continue is false").optional(),
    decision: exports_external.enum(["approve", "block"]).optional(),
    reason: exports_external.string().describe("Explanation for the decision").optional(),
    systemMessage: exports_external.string().describe("Warning message shown to the user").optional(),
    hookSpecificOutput: exports_external.union([
      exports_external.object({
        hookEventName: exports_external.literal("PreToolUse"),
        permissionDecision: permissionBehaviorSchema().optional(),
        permissionDecisionReason: exports_external.string().optional(),
        updatedInput: exports_external.record(exports_external.string(), exports_external.unknown()).optional(),
        additionalContext: exports_external.string().optional()
      }),
      exports_external.object({
        hookEventName: exports_external.literal("UserPromptSubmit"),
        additionalContext: exports_external.string().optional()
      }),
      exports_external.object({
        hookEventName: exports_external.literal("SessionStart"),
        additionalContext: exports_external.string().optional(),
        initialUserMessage: exports_external.string().optional(),
        watchPaths: exports_external.array(exports_external.string()).describe("Absolute paths to watch for FileChanged hooks").optional()
      }),
      exports_external.object({
        hookEventName: exports_external.literal("Setup"),
        additionalContext: exports_external.string().optional()
      }),
      exports_external.object({
        hookEventName: exports_external.literal("SubagentStart"),
        additionalContext: exports_external.string().optional()
      }),
      exports_external.object({
        hookEventName: exports_external.literal("PostToolUse"),
        additionalContext: exports_external.string().optional(),
        updatedMCPToolOutput: exports_external.unknown().describe("Updates the output for MCP tools").optional()
      }),
      exports_external.object({
        hookEventName: exports_external.literal("PostToolUseFailure"),
        additionalContext: exports_external.string().optional()
      }),
      exports_external.object({
        hookEventName: exports_external.literal("PermissionDenied"),
        retry: exports_external.boolean().optional()
      }),
      exports_external.object({
        hookEventName: exports_external.literal("Notification"),
        additionalContext: exports_external.string().optional()
      }),
      exports_external.object({
        hookEventName: exports_external.literal("PermissionRequest"),
        decision: exports_external.union([
          exports_external.object({
            behavior: exports_external.literal("allow"),
            updatedInput: exports_external.record(exports_external.string(), exports_external.unknown()).optional(),
            updatedPermissions: exports_external.array(permissionUpdateSchema()).optional()
          }),
          exports_external.object({
            behavior: exports_external.literal("deny"),
            message: exports_external.string().optional(),
            interrupt: exports_external.boolean().optional()
          })
        ])
      }),
      exports_external.object({
        hookEventName: exports_external.literal("Elicitation"),
        action: exports_external.enum(["accept", "decline", "cancel"]).optional(),
        content: exports_external.record(exports_external.string(), exports_external.unknown()).optional()
      }),
      exports_external.object({
        hookEventName: exports_external.literal("ElicitationResult"),
        action: exports_external.enum(["accept", "decline", "cancel"]).optional(),
        content: exports_external.record(exports_external.string(), exports_external.unknown()).optional()
      }),
      exports_external.object({
        hookEventName: exports_external.literal("CwdChanged"),
        watchPaths: exports_external.array(exports_external.string()).describe("Absolute paths to watch for FileChanged hooks").optional()
      }),
      exports_external.object({
        hookEventName: exports_external.literal("FileChanged"),
        watchPaths: exports_external.array(exports_external.string()).describe("Absolute paths to watch for FileChanged hooks").optional()
      }),
      exports_external.object({
        hookEventName: exports_external.literal("WorktreeCreate"),
        worktreePath: exports_external.string()
      })
    ]).optional()
  })), hookJSONOutputSchema = lazySchema(() => {
    let asyncHookResponseSchema = exports_external.object({
      async: exports_external.literal(!0),
      asyncTimeout: exports_external.number().optional()
    });
    return exports_external.union([asyncHookResponseSchema, syncHookResponseSchema()]);
  });
});
