// Original: src/components/mcp/MCPSettings.tsx
function MCPSettings(t0) {
  let $3 = import_compiler_runtime185.c(66), {
    onComplete
  } = t0, mcp = useAppState(_temp107), agentDefinitions = useAppState(_temp237), mcpClients = mcp.clients, t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = {
      type: "list"
    }, $3[0] = t1;
  else
    t1 = $3[0];
  let [viewState, setViewState] = import_react130.default.useState(t1), t2;
  if ($3[1] === Symbol.for("react.memo_cache_sentinel"))
    t2 = [], $3[1] = t2;
  else
    t2 = $3[1];
  let [servers, setServers] = import_react130.default.useState(t2), t3;
  if ($3[2] !== agentDefinitions.allAgents)
    t3 = extractAgentMcpServers(agentDefinitions.allAgents), $3[2] = agentDefinitions.allAgents, $3[3] = t3;
  else
    t3 = $3[3];
  let agentMcpServers = t3, t4;
  if ($3[4] !== mcpClients)
    t4 = mcpClients.filter(_temp325).sort(_temp422), $3[4] = mcpClients, $3[5] = t4;
  else
    t4 = $3[5];
  let filteredClients = t4, t5, t6;
  if ($3[6] !== filteredClients || $3[7] !== mcp.tools)
    t5 = () => {
      let cancelled = !1;
      return async function() {
        let serverInfos = await Promise.all(filteredClients.map(async (client_0) => {
          let scope = client_0.config.scope, isSSE = client_0.config.type === "sse", isHTTP = client_0.config.type === "http", isClaudeAIProxy = client_0.config.type === "claudeai-proxy", isAuthenticated = void 0;
          if (isSSE || isHTTP) {
            let tokens = await new ClaudeAuthProvider(client_0.name, client_0.config).tokens(), hasSessionAuth = getSessionIngressAuthToken() !== null && client_0.type === "connected", hasToolsAndConnected = client_0.type === "connected" && filterToolsByServer(mcp.tools, client_0.name).length > 0;
            isAuthenticated = Boolean(tokens) || hasSessionAuth || hasToolsAndConnected;
          }
          let baseInfo = {
            name: client_0.name,
            client: client_0,
            scope
          };
          if (isClaudeAIProxy)
            return {
              ...baseInfo,
              transport: "claudeai-proxy",
              isAuthenticated: !1,
              config: client_0.config
            };
          else if (isSSE)
            return {
              ...baseInfo,
              transport: "sse",
              isAuthenticated,
              config: client_0.config
            };
          else if (isHTTP)
            return {
              ...baseInfo,
              transport: "http",
              isAuthenticated,
              config: client_0.config
            };
          else
            return {
              ...baseInfo,
              transport: "stdio",
              config: client_0.config
            };
        }));
        if (cancelled)
          return;
        setServers(serverInfos);
      }(), () => {
        cancelled = !0;
      };
    }, t6 = [filteredClients, mcp.tools], $3[6] = filteredClients, $3[7] = mcp.tools, $3[8] = t5, $3[9] = t6;
  else
    t5 = $3[8], t6 = $3[9];
  import_react130.default.useEffect(t5, t6);
  let t7, t8;
  if ($3[10] !== agentMcpServers.length || $3[11] !== filteredClients.length || $3[12] !== onComplete || $3[13] !== servers.length)
    t7 = () => {
      if (servers.length === 0 && filteredClients.length > 0)
        return;
      if (servers.length === 0 && agentMcpServers.length === 0)
        onComplete("No MCP servers configured. Please run /doctor if this is unexpected. Otherwise, run `claude mcp --help` or visit https://code.claude.com/docs/en/mcp to learn more.");
    }, t8 = [servers.length, filteredClients.length, agentMcpServers.length, onComplete], $3[10] = agentMcpServers.length, $3[11] = filteredClients.length, $3[12] = onComplete, $3[13] = servers.length, $3[14] = t7, $3[15] = t8;
  else
    t7 = $3[14], t8 = $3[15];
  switch (import_react130.useEffect(t7, t8), viewState.type) {
    case "list": {
      let t10, t9;
      if ($3[16] === Symbol.for("react.memo_cache_sentinel"))
        t9 = (server) => setViewState({
          type: "server-menu",
          server
        }), t10 = (agentServer) => setViewState({
          type: "agent-server-menu",
          agentServer
        }), $3[16] = t10, $3[17] = t9;
      else
        t10 = $3[16], t9 = $3[17];
      let t11;
      if ($3[18] !== agentMcpServers || $3[19] !== onComplete || $3[20] !== servers || $3[21] !== viewState.defaultTab)
        t11 = /* @__PURE__ */ jsx_dev_runtime232.jsxDEV(MCPListPanel, {
          servers,
          agentServers: agentMcpServers,
          onSelectServer: t9,
          onSelectAgentServer: t10,
          onComplete,
          defaultTab: viewState.defaultTab
        }, void 0, !1, void 0, this), $3[18] = agentMcpServers, $3[19] = onComplete, $3[20] = servers, $3[21] = viewState.defaultTab, $3[22] = t11;
      else
        t11 = $3[22];
      return t11;
    }
    case "server-menu": {
      let t9;
      if ($3[23] !== mcp.tools || $3[24] !== viewState.server.name)
        t9 = filterToolsByServer(mcp.tools, viewState.server.name), $3[23] = mcp.tools, $3[24] = viewState.server.name, $3[25] = t9;
      else
        t9 = $3[25];
      let serverTools_0 = t9, defaultTab = viewState.server.transport === "claudeai-proxy" ? "claude.ai" : "Claude Code";
      if (viewState.server.transport === "stdio") {
        let t10;
        if ($3[26] !== viewState.server)
          t10 = () => setViewState({
            type: "server-tools",
            server: viewState.server
          }), $3[26] = viewState.server, $3[27] = t10;
        else
          t10 = $3[27];
        let t11;
        if ($3[28] !== defaultTab)
          t11 = () => setViewState({
            type: "list",
            defaultTab
          }), $3[28] = defaultTab, $3[29] = t11;
        else
          t11 = $3[29];
        let t12;
        if ($3[30] !== onComplete || $3[31] !== serverTools_0.length || $3[32] !== t10 || $3[33] !== t11 || $3[34] !== viewState.server)
          t12 = /* @__PURE__ */ jsx_dev_runtime232.jsxDEV(MCPStdioServerMenu, {
            server: viewState.server,
            serverToolsCount: serverTools_0.length,
            onViewTools: t10,
            onCancel: t11,
            onComplete
          }, void 0, !1, void 0, this), $3[30] = onComplete, $3[31] = serverTools_0.length, $3[32] = t10, $3[33] = t11, $3[34] = viewState.server, $3[35] = t12;
        else
          t12 = $3[35];
        return t12;
      } else {
        let t10;
        if ($3[36] !== viewState.server)
          t10 = () => setViewState({
            type: "server-tools",
            server: viewState.server
          }), $3[36] = viewState.server, $3[37] = t10;
        else
          t10 = $3[37];
        let t11;
        if ($3[38] !== defaultTab)
          t11 = () => setViewState({
            type: "list",
            defaultTab
          }), $3[38] = defaultTab, $3[39] = t11;
        else
          t11 = $3[39];
        let t12;
        if ($3[40] !== onComplete || $3[41] !== serverTools_0.length || $3[42] !== t10 || $3[43] !== t11 || $3[44] !== viewState.server)
          t12 = /* @__PURE__ */ jsx_dev_runtime232.jsxDEV(MCPRemoteServerMenu, {
            server: viewState.server,
            serverToolsCount: serverTools_0.length,
            onViewTools: t10,
            onCancel: t11,
            onComplete
          }, void 0, !1, void 0, this), $3[40] = onComplete, $3[41] = serverTools_0.length, $3[42] = t10, $3[43] = t11, $3[44] = viewState.server, $3[45] = t12;
        else
          t12 = $3[45];
        return t12;
      }
    }
    case "server-tools": {
      let t10, t9;
      if ($3[46] !== viewState.server)
        t9 = (_, index) => setViewState({
          type: "server-tool-detail",
          server: viewState.server,
          toolIndex: index
        }), t10 = () => setViewState({
          type: "server-menu",
          server: viewState.server
        }), $3[46] = viewState.server, $3[47] = t10, $3[48] = t9;
      else
        t10 = $3[47], t9 = $3[48];
      let t11;
      if ($3[49] !== t10 || $3[50] !== t9 || $3[51] !== viewState.server)
        t11 = /* @__PURE__ */ jsx_dev_runtime232.jsxDEV(MCPToolListView, {
          server: viewState.server,
          onSelectTool: t9,
          onBack: t10
        }, void 0, !1, void 0, this), $3[49] = t10, $3[50] = t9, $3[51] = viewState.server, $3[52] = t11;
      else
        t11 = $3[52];
      return t11;
    }
    case "server-tool-detail": {
      let t9;
      if ($3[53] !== mcp.tools || $3[54] !== viewState.server.name)
        t9 = filterToolsByServer(mcp.tools, viewState.server.name), $3[53] = mcp.tools, $3[54] = viewState.server.name, $3[55] = t9;
      else
        t9 = $3[55];
      let tool = t9[viewState.toolIndex];
      if (!tool)
        return setViewState({
          type: "server-tools",
          server: viewState.server
        }), null;
      let t10;
      if ($3[56] !== viewState.server)
        t10 = () => setViewState({
          type: "server-tools",
          server: viewState.server
        }), $3[56] = viewState.server, $3[57] = t10;
      else
        t10 = $3[57];
      let t11;
      if ($3[58] !== t10 || $3[59] !== tool || $3[60] !== viewState.server)
        t11 = /* @__PURE__ */ jsx_dev_runtime232.jsxDEV(MCPToolDetailView, {
          tool,
          server: viewState.server,
          onBack: t10
        }, void 0, !1, void 0, this), $3[58] = t10, $3[59] = tool, $3[60] = viewState.server, $3[61] = t11;
      else
        t11 = $3[61];
      return t11;
    }
    case "agent-server-menu": {
      let t9;
      if ($3[62] === Symbol.for("react.memo_cache_sentinel"))
        t9 = () => setViewState({
          type: "list",
          defaultTab: "Agents"
        }), $3[62] = t9;
      else
        t9 = $3[62];
      let t10;
      if ($3[63] !== onComplete || $3[64] !== viewState.agentServer)
        t10 = /* @__PURE__ */ jsx_dev_runtime232.jsxDEV(MCPAgentServerMenu, {
          agentServer: viewState.agentServer,
          onCancel: t9,
          onComplete
        }, void 0, !1, void 0, this), $3[63] = onComplete, $3[64] = viewState.agentServer, $3[65] = t10;
      else
        t10 = $3[65];
      return t10;
    }
  }
}
function _temp422(a2, b) {
  return a2.name.localeCompare(b.name);
}
function _temp325(client15) {
  return client15.name !== "ide";
}
function _temp237(s_0) {
  return s_0.agentDefinitions;
}
function _temp107(s2) {
  return s2.mcp;
}
var import_compiler_runtime185, import_react130, jsx_dev_runtime232;
var init_MCPSettings = __esm(() => {
  init_auth17();
  init_utils7();
  init_AppState();
  init_sessionIngressAuth();
  init_MCPAgentServerMenu();
  init_MCPListPanel();
  init_MCPRemoteServerMenu();
  init_MCPStdioServerMenu();
  init_MCPToolDetailView();
  init_MCPToolListView();
  import_compiler_runtime185 = __toESM(require_react_compiler_runtime_development(), 1), import_react130 = __toESM(require_react_development(), 1), jsx_dev_runtime232 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
