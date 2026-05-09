// Original: src/commands/hooks/hooks.tsx
var exports_hooks = {};
__export(exports_hooks, {
  call: () => call45
});
var jsx_dev_runtime313, call45 = async (onDone, context7) => {
  logEvent("tengu_hooks_command", {});
  let permissionContext = context7.getAppState().toolPermissionContext, toolNames = getTools(permissionContext).map((tool) => tool.name);
  return /* @__PURE__ */ jsx_dev_runtime313.jsxDEV(HooksConfigMenu, {
    toolNames,
    onExit: onDone
  }, void 0, !1, void 0, this);
};
var init_hooks2 = __esm(() => {
  init_HooksConfigMenu();
  init_tools2();
  jsx_dev_runtime313 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
