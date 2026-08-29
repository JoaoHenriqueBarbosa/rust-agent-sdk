// Original: src/utils/permissions/PermissionPromptToolResultSchema.ts
function permissionPromptToolResultToPermissionDecision(result, tool, input, toolUseContext) {
  let decisionReason = {
    type: "permissionPromptTool",
    permissionPromptToolName: tool.name,
    toolResult: result
  };
  if (result.behavior === "allow") {
    let updatedPermissions = result.updatedPermissions;
    if (updatedPermissions)
      toolUseContext.setAppState((prev) => ({
        ...prev,
        toolPermissionContext: applyPermissionUpdates(prev.toolPermissionContext, updatedPermissions)
      })), persistPermissionUpdates(updatedPermissions);
    let updatedInput = Object.keys(result.updatedInput).length > 0 ? result.updatedInput : input;
    return {
      ...result,
      updatedInput,
      decisionReason
    };
  } else if (result.behavior === "deny" && result.interrupt)
    logForDebugging(`SDK permission prompt deny+interrupt: tool=${tool.name} message=${result.message}`), toolUseContext.abortController.abort();
  return {
    ...result,
    decisionReason
  };
}
var inputSchema41, decisionClassificationField, PermissionAllowResultSchema, PermissionDenyResultSchema, outputSchema33;
var init_PermissionPromptToolResultSchema = __esm(() => {
  init_v4();
  init_debug();
  init_PermissionUpdate();
  init_PermissionUpdateSchema();
  inputSchema41 = lazySchema(() => v4_default.object({
    tool_name: v4_default.string().describe("The name of the tool requesting permission"),
    input: v4_default.record(v4_default.string(), v4_default.unknown()).describe("The input for the tool"),
    tool_use_id: v4_default.string().optional().describe("The unique tool use request ID")
  })), decisionClassificationField = lazySchema(() => v4_default.enum(["user_temporary", "user_permanent", "user_reject"]).optional().catch(void 0)), PermissionAllowResultSchema = lazySchema(() => v4_default.object({
    behavior: v4_default.literal("allow"),
    updatedInput: v4_default.record(v4_default.string(), v4_default.unknown()),
    updatedPermissions: v4_default.array(permissionUpdateSchema()).optional().catch((ctx) => {
      logForDebugging(`Malformed updatedPermissions from SDK host ignored: ${ctx.error.issues[0]?.message ?? "unknown"}`, { level: "warn" });
      return;
    }),
    toolUseID: v4_default.string().optional(),
    decisionClassification: decisionClassificationField()
  })), PermissionDenyResultSchema = lazySchema(() => v4_default.object({
    behavior: v4_default.literal("deny"),
    message: v4_default.string(),
    interrupt: v4_default.boolean().optional(),
    toolUseID: v4_default.string().optional(),
    decisionClassification: decisionClassificationField()
  })), outputSchema33 = lazySchema(() => v4_default.union([PermissionAllowResultSchema(), PermissionDenyResultSchema()]));
});
