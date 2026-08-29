// Original: src/tools/ExitPlanModeTool/ExitPlanModeV2Tool.ts
import { writeFile as writeFile22 } from "fs/promises";
var permissionSetupModule = null, allowedPromptSchema, inputSchema22, _sdkInputSchema, outputSchema18, ExitPlanModeV2Tool;
var init_ExitPlanModeV2Tool = __esm(() => {
  init_v4();
  init_state();
  init_Tool();
  init_agentSwarmsEnabled();
  init_debug();
  init_inProcessTeammateHelpers();
  init_log3();
  init_plans();
  init_slowOperations();
  init_teammate();
  init_teammateMailbox();
  init_constants3();
  init_UI17();
  allowedPromptSchema = lazySchema(() => exports_external.object({
    tool: exports_external.enum(["Bash"]).describe("The tool this prompt applies to"),
    prompt: exports_external.string().describe('Semantic description of the action, e.g. "run tests", "install dependencies"')
  })), inputSchema22 = lazySchema(() => exports_external.strictObject({
    allowedPrompts: exports_external.array(allowedPromptSchema()).optional().describe("Prompt-based permissions needed to implement the plan. These describe categories of actions rather than specific commands.")
  }).passthrough()), _sdkInputSchema = lazySchema(() => inputSchema22().extend({
    plan: exports_external.string().optional().describe("The plan content (injected by normalizeToolInput from disk)"),
    planFilePath: exports_external.string().optional().describe("The plan file path (injected by normalizeToolInput)")
  })), outputSchema18 = lazySchema(() => exports_external.object({
    plan: exports_external.string().nullable().describe("The plan that was presented to the user"),
    isAgent: exports_external.boolean(),
    filePath: exports_external.string().optional().describe("The file path where the plan was saved"),
    hasTaskTool: exports_external.boolean().optional().describe("Whether the Agent tool is available in the current context"),
    planWasEdited: exports_external.boolean().optional().describe("True when the user edited the plan (CCR web UI or Ctrl+G); determines whether the plan is echoed back in tool_result"),
    awaitingLeaderApproval: exports_external.boolean().optional().describe("When true, the teammate has sent a plan approval request to the team leader"),
    requestId: exports_external.string().optional().describe("Unique identifier for the plan approval request")
  })), ExitPlanModeV2Tool = buildTool({
    name: EXIT_PLAN_MODE_V2_TOOL_NAME,
    searchHint: "present plan for approval and start coding (plan mode only)",
    maxResultSizeChars: 1e5,
    async description() {
      return "Prompts the user to exit plan mode and start coding";
    },
    async prompt() {
      return EXIT_PLAN_MODE_V2_TOOL_PROMPT;
    },
    get inputSchema() {
      return inputSchema22();
    },
    get outputSchema() {
      return outputSchema18();
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
      return !1;
    },
    requiresUserInteraction() {
      if (isTeammate())
        return !1;
      return !0;
    },
    async validateInput(_input, { getAppState, options: options2 }) {
      if (isTeammate())
        return { result: !0 };
      let mode = getAppState().toolPermissionContext.mode;
      if (mode !== "plan")
        return logEvent("tengu_exit_plan_mode_called_outside_plan", {
          model: options2.mainLoopModel,
          mode,
          hasExitedPlanModeInSession: hasExitedPlanModeInSession()
        }), {
          result: !1,
          message: "You are not in plan mode. This tool is only for exiting plan mode after writing a plan. If your plan was already approved, continue with implementation.",
          errorCode: 1
        };
      return { result: !0 };
    },
    async checkPermissions(input, context6) {
      if (isTeammate())
        return {
          behavior: "allow",
          updatedInput: input
        };
      return {
        behavior: "ask",
        message: "Exit plan mode?",
        updatedInput: input
      };
    },
    renderToolUseMessage: renderToolUseMessage18,
    renderToolResultMessage: renderToolResultMessage17,
    renderToolUseRejectedMessage: renderToolUseRejectedMessage6,
    async call(input, context6) {
      let isAgent = !!context6.agentId, filePath = getPlanFilePath(context6.agentId), inputPlan = "plan" in input && typeof input.plan === "string" ? input.plan : void 0, plan = inputPlan ?? getPlan(context6.agentId);
      if (inputPlan !== void 0 && filePath)
        await writeFile22(filePath, inputPlan, "utf-8").catch((e) => logError2(e)), persistFileSnapshotIfRemote();
      if (isTeammate() && isPlanModeRequired()) {
        if (!plan)
          throw Error(`No plan file found at ${filePath}. Please write your plan to this file before calling ExitPlanMode.`);
        let agentName = getAgentName() || "unknown", teamName = getTeamName(), requestId = generateRequestId("plan_approval", formatAgentId(agentName, teamName || "default")), approvalRequest = {
          type: "plan_approval_request",
          from: agentName,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          planFilePath: filePath,
          planContent: plan,
          requestId
        };
        await writeToMailbox("team-lead", {
          from: agentName,
          text: jsonStringify(approvalRequest),
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }, teamName);
        let appState2 = context6.getAppState(), agentTaskId = findInProcessTeammateTaskId(agentName, appState2);
        if (agentTaskId)
          setAwaitingPlanApproval(agentTaskId, context6.setAppState, !0);
        return {
          data: {
            plan,
            isAgent: !0,
            filePath,
            awaitingLeaderApproval: !0,
            requestId
          }
        };
      }
      let appState = context6.getAppState(), gateFallbackNotification = null;
      if (gateFallbackNotification)
        context6.addNotification?.({
          key: "auto-mode-gate-plan-exit-fallback",
          text: `plan exit \u2192 default \xB7 ${gateFallbackNotification}`,
          priority: "immediate",
          color: "warning",
          timeoutMs: 1e4
        });
      context6.setAppState((prev) => {
        if (prev.toolPermissionContext.mode !== "plan")
          return prev;
        setHasExitedPlanMode(!0), setNeedsPlanModeExitAttachment(!0);
        let restoreMode = prev.toolPermissionContext.prePlanMode ?? "default", restoringToAuto = restoreMode === "auto", baseContext = prev.toolPermissionContext;
        if (restoringToAuto)
          baseContext = permissionSetupModule?.stripDangerousPermissionsForAutoMode(baseContext) ?? baseContext;
        else if (prev.toolPermissionContext.strippedDangerousRules)
          baseContext = permissionSetupModule?.restoreDangerousPermissions(baseContext) ?? baseContext;
        return {
          ...prev,
          toolPermissionContext: {
            ...baseContext,
            mode: restoreMode,
            prePlanMode: void 0
          }
        };
      });
      let hasTaskTool = isAgentSwarmsEnabled() && context6.options.tools.some((t2) => toolMatchesName(t2, AGENT_TOOL_NAME));
      return {
        data: {
          plan,
          isAgent,
          filePath,
          hasTaskTool: hasTaskTool || void 0,
          planWasEdited: inputPlan !== void 0 || void 0
        }
      };
    },
    mapToolResultToToolResultBlockParam({
      isAgent,
      plan,
      filePath,
      hasTaskTool,
      planWasEdited,
      awaitingLeaderApproval,
      requestId
    }, toolUseID) {
      if (awaitingLeaderApproval)
        return {
          type: "tool_result",
          content: `Your plan has been submitted to the team lead for approval.

Plan file: ${filePath}

**What happens next:**
1. Wait for the team lead to review your plan
2. You will receive a message in your inbox with approval/rejection
3. If approved, you can proceed with implementation
4. If rejected, refine your plan based on the feedback

**Important:** Do NOT proceed until you receive approval. Check your inbox for response.

Request ID: ${requestId}`,
          tool_use_id: toolUseID
        };
      if (isAgent)
        return {
          type: "tool_result",
          content: 'User has approved the plan. There is nothing else needed from you now. Please respond with "ok"',
          tool_use_id: toolUseID
        };
      if (!plan || plan.trim() === "")
        return {
          type: "tool_result",
          content: "User has approved exiting plan mode. You can now proceed.",
          tool_use_id: toolUseID
        };
      let teamHint = hasTaskTool ? `

If this plan can be broken down into multiple independent tasks, consider using the ${TEAM_CREATE_TOOL_NAME} tool to create a team and parallelize the work.` : "";
      return {
        type: "tool_result",
        content: `User has approved your plan. You can now start coding. Start with updating your todo list if applicable

Your plan has been saved to: ${filePath}
You can refer back to it if needed during implementation.${teamHint}

## ${planWasEdited ? "Approved Plan (edited by user)" : "Approved Plan"}:
${plan}`,
        tool_use_id: toolUseID
      };
    }
  });
});
