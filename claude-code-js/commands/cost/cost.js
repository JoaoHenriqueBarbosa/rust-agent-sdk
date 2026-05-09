// Original: src/commands/cost/cost.ts
var exports_cost = {};
__export(exports_cost, {
  call: () => call17
});
var call17 = async () => {
  if (isClaudeAISubscriber()) {
    let value;
    if (currentLimits.isUsingOverage)
      value = "You are currently using your overages to power your Claude Code usage. We will automatically switch you back to your subscription rate limits when they reset";
    else
      value = "You are currently using your subscription to power your Claude Code usage";
    return { type: "text", value };
  }
  return { type: "text", value: formatTotalCost() };
};
var init_cost = __esm(() => {
  init_cost_tracker();
  init_claudeAiLimits();
  init_auth14();
});
