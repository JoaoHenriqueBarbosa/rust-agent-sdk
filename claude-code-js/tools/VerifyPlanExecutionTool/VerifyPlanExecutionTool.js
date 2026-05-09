// Original: src/tools/VerifyPlanExecutionTool/VerifyPlanExecutionTool.ts
var exports_VerifyPlanExecutionTool = {};
__export(exports_VerifyPlanExecutionTool, {
  VerifyPlanExecutionTool: () => VerifyPlanExecutionTool
});
var inputSchema38, outputSchema29, VerifyPlanExecutionTool;
var init_VerifyPlanExecutionTool = __esm(() => {
  init_v4();
  init_Tool();
  inputSchema38 = lazySchema(() => exports_external.strictObject({
    plan: exports_external.string().describe("The plan text to verify. This should be the plan that was executed during the plan mode session."),
    verification_notes: exports_external.string().optional().describe("Optional notes about what was verified and the verification results.")
  })), outputSchema29 = lazySchema(() => exports_external.object({
    ok: exports_external.boolean().describe("Whether the plan execution was verified"),
    message: exports_external.string().describe("Verification result message")
  })), VerifyPlanExecutionTool = buildTool({
    name: VERIFY_PLAN_EXECUTION_TOOL_NAME,
    searchHint: "verify plan execution completion",
    maxResultSizeChars: 1e5,
    get inputSchema() {
      return inputSchema38();
    },
    get outputSchema() {
      return outputSchema29();
    },
    isEnabled() {
      return !1;
    },
    isConcurrencySafe() {
      return !0;
    },
    isReadOnly() {
      return !0;
    },
    userFacingName() {
      return "VerifyPlanExecution";
    },
    toAutoClassifierInput() {
      return "";
    },
    async description() {
      return "Verify that a plan was executed correctly. Call this tool after completing plan execution to confirm all items were addressed.";
    },
    async prompt() {
      return `Verify that a plan was executed correctly. Call this tool directly (NOT via an Agent) after completing the implementation of a plan.

Provide the plan text and optional verification notes describing what was checked and the results.

Use as few steps as possible - be efficient and direct.

When done, return your result with:
- ok: true if the condition is met
- ok: false if the condition is not met, with a message explaining what was not completed`;
    },
    mapToolResultToToolResultBlockParam(output, toolUseID) {
      return {
        tool_use_id: toolUseID,
        type: "tool_result",
        content: output.ok ? `Plan verification passed: ${output.message}` : `Plan verification failed: ${output.message}`
      };
    },
    renderToolUseMessage(input) {
      return null;
    },
    async call({ plan, verification_notes }, context6) {
      return context6.setAppState((prev) => ({
        ...prev,
        pendingPlanVerification: prev.pendingPlanVerification ? {
          ...prev.pendingPlanVerification,
          verificationStarted: !0
        } : void 0
      })), context6.setAppState((prev) => ({
        ...prev,
        pendingPlanVerification: prev.pendingPlanVerification ? {
          ...prev.pendingPlanVerification,
          verificationCompleted: !0
        } : void 0
      })), {
        data: {
          ok: !0,
          message: verification_notes || "Plan execution verified successfully."
        }
      };
    }
  });
});
