// Original: src/commands/plan/index.ts
var plan, plan_default;
var init_plan2 = __esm(() => {
  plan = {
    type: "local-jsx",
    name: "plan",
    description: "Enable plan mode or view the current session plan",
    argumentHint: "[open|<description>]",
    load: () => Promise.resolve().then(() => (init_plan(), exports_plan))
  }, plan_default = plan;
});
