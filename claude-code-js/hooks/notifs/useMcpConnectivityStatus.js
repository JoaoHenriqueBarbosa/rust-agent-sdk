// Original: src/hooks/notifs/useMcpConnectivityStatus.tsx
function useMcpConnectivityStatus(t0) {
  let $3 = import_compiler_runtime345.c(4), {
    mcpClients: t1
  } = t0, mcpClients = t1 === void 0 ? EMPTY_MCP_CLIENTS : t1, {
    addNotification
  } = useNotifications(), t2, t3;
  if ($3[0] !== addNotification || $3[1] !== mcpClients)
    t2 = () => {
      if (getIsRemoteMode())
        return;
      let failedLocalClients = mcpClients.filter(_temp209), failedClaudeAiClients = mcpClients.filter(_temp285), needsAuthLocalServers = mcpClients.filter(_temp354), needsAuthClaudeAiServers = mcpClients.filter(_temp441);
      if (failedLocalClients.length === 0 && failedClaudeAiClients.length === 0 && needsAuthLocalServers.length === 0 && needsAuthClaudeAiServers.length === 0)
        return;
      if (failedLocalClients.length > 0)
        addNotification({
          key: "mcp-failed",
          jsx: /* @__PURE__ */ jsx_dev_runtime444.jsxDEV(jsx_dev_runtime444.Fragment, {
            children: [
              /* @__PURE__ */ jsx_dev_runtime444.jsxDEV(ThemedText, {
                color: "error",
                children: [
                  failedLocalClients.length,
                  " MCP",
                  " ",
                  failedLocalClients.length === 1 ? "server" : "servers",
                  " failed"
                ]
              }, void 0, !0, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime444.jsxDEV(ThemedText, {
                dimColor: !0,
                children: " \xB7 /mcp"
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this),
          priority: "medium"
        });
      if (failedClaudeAiClients.length > 0)
        addNotification({
          key: "mcp-claudeai-failed",
          jsx: /* @__PURE__ */ jsx_dev_runtime444.jsxDEV(jsx_dev_runtime444.Fragment, {
            children: [
              /* @__PURE__ */ jsx_dev_runtime444.jsxDEV(ThemedText, {
                color: "error",
                children: [
                  failedClaudeAiClients.length,
                  " claude.ai",
                  " ",
                  failedClaudeAiClients.length === 1 ? "connector" : "connectors",
                  " ",
                  "unavailable"
                ]
              }, void 0, !0, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime444.jsxDEV(ThemedText, {
                dimColor: !0,
                children: " \xB7 /mcp"
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this),
          priority: "medium"
        });
      if (needsAuthLocalServers.length > 0)
        addNotification({
          key: "mcp-needs-auth",
          jsx: /* @__PURE__ */ jsx_dev_runtime444.jsxDEV(jsx_dev_runtime444.Fragment, {
            children: [
              /* @__PURE__ */ jsx_dev_runtime444.jsxDEV(ThemedText, {
                color: "warning",
                children: [
                  needsAuthLocalServers.length,
                  " MCP",
                  " ",
                  needsAuthLocalServers.length === 1 ? "server needs" : "servers need",
                  " ",
                  "auth"
                ]
              }, void 0, !0, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime444.jsxDEV(ThemedText, {
                dimColor: !0,
                children: " \xB7 /mcp"
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this),
          priority: "medium"
        });
      if (needsAuthClaudeAiServers.length > 0)
        addNotification({
          key: "mcp-claudeai-needs-auth",
          jsx: /* @__PURE__ */ jsx_dev_runtime444.jsxDEV(jsx_dev_runtime444.Fragment, {
            children: [
              /* @__PURE__ */ jsx_dev_runtime444.jsxDEV(ThemedText, {
                color: "warning",
                children: [
                  needsAuthClaudeAiServers.length,
                  " claude.ai",
                  " ",
                  needsAuthClaudeAiServers.length === 1 ? "connector needs" : "connectors need",
                  " ",
                  "auth"
                ]
              }, void 0, !0, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime444.jsxDEV(ThemedText, {
                dimColor: !0,
                children: " \xB7 /mcp"
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this),
          priority: "medium"
        });
    }, t3 = [addNotification, mcpClients], $3[0] = addNotification, $3[1] = mcpClients, $3[2] = t2, $3[3] = t3;
  else
    t2 = $3[2], t3 = $3[3];
  import_react286.useEffect(t2, t3);
}
function _temp441(client_2) {
  return client_2.type === "needs-auth" && client_2.config.type === "claudeai-proxy" && hasClaudeAiMcpEverConnected(client_2.name);
}
function _temp354(client_1) {
  return client_1.type === "needs-auth" && client_1.config.type !== "claudeai-proxy";
}
function _temp285(client_0) {
  return client_0.type === "failed" && client_0.config.type === "claudeai-proxy" && hasClaudeAiMcpEverConnected(client_0.name);
}
function _temp209(client16) {
  return client16.type === "failed" && client16.config.type !== "sse-ide" && client16.config.type !== "ws-ide" && client16.config.type !== "claudeai-proxy";
}
var import_compiler_runtime345, import_react286, jsx_dev_runtime444, EMPTY_MCP_CLIENTS;
var init_useMcpConnectivityStatus = __esm(() => {
  init_notifications();
  init_state();
  init_ink2();
  init_claudeai();
  import_compiler_runtime345 = __toESM(require_react_compiler_runtime_development(), 1), import_react286 = __toESM(require_react_development(), 1), jsx_dev_runtime444 = __toESM(require_react_jsx_dev_runtime_development(), 1), EMPTY_MCP_CLIENTS = [];
});
