// Original: src/commands/agents/agents.tsx
var exports_agents = {};
__export(exports_agents, {
  call: () => call48
});
async function call48(onDone, context7) {
  let permissionContext = context7.getAppState().toolPermissionContext, tools = getTools(permissionContext);
  return /* @__PURE__ */ jsx_dev_runtime338.jsxDEV(AgentsMenu, {
    tools,
    onExit: onDone
  }, void 0, !1, void 0, this);
}
var jsx_dev_runtime338;
var init_agents = __esm(() => {
  init_AgentsMenu();
  init_tools2();
  jsx_dev_runtime338 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
