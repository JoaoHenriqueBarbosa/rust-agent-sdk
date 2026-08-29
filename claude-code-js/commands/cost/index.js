// Original: src/commands/cost/index.ts
var cost, cost_default;
var init_cost2 = __esm(() => {
  init_auth14();
  cost = {
    type: "local",
    name: "cost",
    description: "Show the total cost and duration of the current session",
    get isHidden() {
      return isClaudeAISubscriber();
    },
    supportsNonInteractive: !0,
    load: () => Promise.resolve().then(() => (init_cost(), exports_cost))
  }, cost_default = cost;
});
