// Original: src/services/mcpServerApproval.tsx
async function handleMcpjsonServerApprovals(root3) {
  let {
    servers: projectServers
  } = getMcpConfigsByScope("project"), pendingServers = Object.keys(projectServers).filter((serverName) => getProjectMcpServerStatus(serverName) === "pending");
  if (pendingServers.length === 0)
    return;
  await new Promise((resolve47) => {
    let done = () => void resolve47();
    if (pendingServers.length === 1 && pendingServers[0] !== void 0) {
      let serverName = pendingServers[0];
      root3.render(/* @__PURE__ */ jsx_dev_runtime463.jsxDEV(AppStateProvider, {
        children: /* @__PURE__ */ jsx_dev_runtime463.jsxDEV(KeybindingSetup, {
          children: /* @__PURE__ */ jsx_dev_runtime463.jsxDEV(MCPServerApprovalDialog, {
            serverName,
            onDone: done
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this));
    } else
      root3.render(/* @__PURE__ */ jsx_dev_runtime463.jsxDEV(AppStateProvider, {
        children: /* @__PURE__ */ jsx_dev_runtime463.jsxDEV(KeybindingSetup, {
          children: /* @__PURE__ */ jsx_dev_runtime463.jsxDEV(MCPServerMultiselectDialog, {
            serverNames: pendingServers,
            onDone: done
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this));
  });
}
var jsx_dev_runtime463;
var init_mcpServerApproval = __esm(() => {
  init_MCPServerApprovalDialog();
  init_MCPServerMultiselectDialog();
  init_KeybindingProviderSetup();
  init_AppState();
  init_config8();
  init_utils7();
  jsx_dev_runtime463 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
