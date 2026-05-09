// Original: src/commands/status/index.ts
var status, status_default;
var init_status3 = __esm(() => {
  status = {
    type: "local-jsx",
    name: "status",
    description: "Show Claude Code status including version, model, account, API connectivity, and tool statuses",
    immediate: !0,
    load: () => Promise.resolve().then(() => (init_status2(), exports_status))
  }, status_default = status;
});
