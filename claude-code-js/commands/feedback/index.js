// Original: src/commands/feedback/index.ts
var feedback, feedback_default;
var init_feedback2 = __esm(() => {
  init_policyLimits();
  init_envUtils();
  feedback = {
    aliases: ["bug"],
    type: "local-jsx",
    name: "feedback",
    description: "Submit feedback about Claude Code",
    argumentHint: "[report]",
    isEnabled: () => !(isEnvTruthy(process.env.CLAUDE_CODE_USE_BEDROCK) || isEnvTruthy(process.env.CLAUDE_CODE_USE_VERTEX) || isEnvTruthy(process.env.CLAUDE_CODE_USE_FOUNDRY) || isEnvTruthy(process.env.DISABLE_FEEDBACK_COMMAND) || isEnvTruthy(process.env.DISABLE_BUG_COMMAND) || isEssentialTrafficOnly() || !1 || !isPolicyAllowed("allow_product_feedback")),
    load: () => Promise.resolve().then(() => (init_feedback(), exports_feedback))
  }, feedback_default = feedback;
});
