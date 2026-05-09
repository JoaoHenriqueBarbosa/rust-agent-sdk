// Original: src/services/mcp/MCPConnectionManager.tsx
function useMcpReconnect() {
  let context7 = import_react125.useContext(MCPConnectionContext);
  if (!context7)
    throw Error("useMcpReconnect must be used within MCPConnectionManager");
  return context7.reconnectMcpServer;
}
function useMcpToggleEnabled() {
  let context7 = import_react125.useContext(MCPConnectionContext);
  if (!context7)
    throw Error("useMcpToggleEnabled must be used within MCPConnectionManager");
  return context7.toggleMcpServer;
}
function MCPConnectionManager(t0) {
  let $3 = import_compiler_runtime180.c(6), {
    children,
    dynamicMcpConfig,
    isStrictMcpConfig
  } = t0, {
    reconnectMcpServer,
    toggleMcpServer
  } = useManageMCPConnections(dynamicMcpConfig, isStrictMcpConfig), t1;
  if ($3[0] !== reconnectMcpServer || $3[1] !== toggleMcpServer)
    t1 = {
      reconnectMcpServer,
      toggleMcpServer
    }, $3[0] = reconnectMcpServer, $3[1] = toggleMcpServer, $3[2] = t1;
  else
    t1 = $3[2];
  let value = t1, t2;
  if ($3[3] !== children || $3[4] !== value)
    t2 = /* @__PURE__ */ jsx_dev_runtime225.jsxDEV(MCPConnectionContext.Provider, {
      value,
      children
    }, void 0, !1, void 0, this), $3[3] = children, $3[4] = value, $3[5] = t2;
  else
    t2 = $3[5];
  return t2;
}
var import_compiler_runtime180, import_react125, jsx_dev_runtime225, MCPConnectionContext;
var init_MCPConnectionManager = __esm(() => {
  init_useManageMCPConnections();
  import_compiler_runtime180 = __toESM(require_react_compiler_runtime_development(), 1), import_react125 = __toESM(require_react_development(), 1), jsx_dev_runtime225 = __toESM(require_react_jsx_dev_runtime_development(), 1), MCPConnectionContext = import_react125.createContext(null);
});
