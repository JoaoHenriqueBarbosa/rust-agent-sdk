// Original: src/tools/EnterPlanModeTool/EnterPlanModeTool.ts
var inputSchema27, outputSchema21, EnterPlanModeTool;
var init_EnterPlanModeTool = __esm(() => {
  init_v4();
  init_state();
  init_Tool();
  init_PermissionUpdate();
  init_permissionSetup();
  init_planModeV2();
  init_prompt14();
  init_UI19();
  inputSchema27 = lazySchema(() => exports_external.strictObject({})), outputSchema21 = lazySchema(() => exports_external.object({
    message: exports_external.string().describe("Confirmation that plan mode was entered")
  })), EnterPlanModeTool = buildTool({
    name: ENTER_PLAN_MODE_TOOL_NAME,
    searchHint: "switch to plan mode to design an approach before coding",
    maxResultSizeChars: 1e5,
    async description() {
      return "Requests permission to enter plan mode for complex tasks requiring exploration and design";
    },
    async prompt() {
      return getEnterPlanModeToolPrompt();
    },
    get inputSchema() {
      return inputSchema27();
    },
    get outputSchema() {
      return outputSchema21();
    },
    userFacingName() {
      return "";
    },
    shouldDefer: !0,
    isEnabled() {
      if (getAllowedChannels().length > 0)
        return !1;
      return !0;
    },
    isConcurrencySafe() {
      return !0;
    },
    isReadOnly() {
      return !0;
    },
    renderToolUseMessage: renderToolUseMessage20,
    renderToolResultMessage: renderToolResultMessage19,
    renderToolUseRejectedMessage: renderToolUseRejectedMessage7,
    async call(_input, context6) {
      if (context6.agentId)
        throw Error("EnterPlanMode tool cannot be used in agent contexts");
      let appState = context6.getAppState();
      return handlePlanModeTransition(appState.toolPermissionContext.mode, "plan"), context6.setAppState((prev) => ({
        ...prev,
        toolPermissionContext: applyPermissionUpdate(prepareContextForPlanMode(prev.toolPermissionContext), { type: "setMode", mode: "plan", destination: "session" })
      })), {
        data: {
          message: "Entered plan mode. You should now focus on exploring the codebase and designing an implementation approach."
        }
      };
    },
    mapToolResultToToolResultBlockParam({ message }, toolUseID) {
      return {
        type: "tool_result",
        content: isPlanModeInterviewPhaseEnabled() ? `${message}

DO NOT write or edit any files except the plan file. Detailed workflow instructions will follow.` : `${message}

In plan mode, you should:
1. Thoroughly explore the codebase to understand existing patterns
2. Identify similar features and architectural approaches
3. Consider multiple approaches and their trade-offs
4. Use AskUserQuestion if you need to clarify the approach
5. Design a concrete implementation strategy
6. When ready, use ExitPlanMode to present your plan for approval

Remember: DO NOT write or edit any files yet. This is a read-only exploration and planning phase.`,
        tool_use_id: toolUseID
      };
    }
  });
});
