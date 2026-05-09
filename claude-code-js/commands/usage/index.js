// Original: src/commands/usage/index.ts
var usage_default;
var init_usage3 = __esm(() => {
  usage_default = {
    type: "local-jsx",
    name: "usage",
    description: "Show plan usage limits",
    availability: ["claude-ai"],
    load: () => Promise.resolve().then(() => (init_usage2(), exports_usage))
  };
});
