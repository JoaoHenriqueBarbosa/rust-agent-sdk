// Original: src/commands/hooks/index.ts
var hooks, hooks_default;
var init_hooks3 = __esm(() => {
  hooks = {
    type: "local-jsx",
    name: "hooks",
    description: "View hook configurations for tool events",
    immediate: !0,
    load: () => Promise.resolve().then(() => (init_hooks2(), exports_hooks))
  }, hooks_default = hooks;
});
