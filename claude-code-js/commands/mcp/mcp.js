// Original: src/commands/mcp/mcp.tsx
var exports_mcp = {};
__export(exports_mcp, {
  call: () => call26
});
function MCPToggle(t0) {
  let $3 = import_compiler_runtime194.c(7), {
    action: action2,
    target,
    onComplete
  } = t0, mcpClients = useAppState(_temp111), toggleMcpServer = useMcpToggleEnabled(), didRun = import_react140.useRef(!1), t1, t2;
  if ($3[0] !== action2 || $3[1] !== mcpClients || $3[2] !== onComplete || $3[3] !== target || $3[4] !== toggleMcpServer)
    t1 = () => {
      if (didRun.current)
        return;
      didRun.current = !0;
      let isEnabling = action2 === "enable", clients = mcpClients.filter(_temp240), toToggle = target === "all" ? clients.filter((c_0) => isEnabling ? c_0.type === "disabled" : c_0.type !== "disabled") : clients.filter((c_1) => c_1.name === target);
      if (toToggle.length === 0) {
        onComplete(target === "all" ? `All MCP servers are already ${isEnabling ? "enabled" : "disabled"}` : `MCP server "${target}" not found`);
        return;
      }
      for (let s_0 of toToggle)
        toggleMcpServer(s_0.name);
      onComplete(target === "all" ? `${isEnabling ? "Enabled" : "Disabled"} ${toToggle.length} MCP server(s)` : `MCP server "${target}" ${isEnabling ? "enabled" : "disabled"}`);
    }, t2 = [action2, target, mcpClients, toggleMcpServer, onComplete], $3[0] = action2, $3[1] = mcpClients, $3[2] = onComplete, $3[3] = target, $3[4] = toggleMcpServer, $3[5] = t1, $3[6] = t2;
  else
    t1 = $3[5], t2 = $3[6];
  return import_react140.useEffect(t1, t2), null;
}
function _temp240(c3) {
  return c3.name !== "ide";
}
function _temp111(s2) {
  return s2.mcp.clients;
}
async function call26(onDone, _context, args) {
  if (args) {
    let parts = args.trim().split(/\s+/);
    if (parts[0] === "no-redirect")
      return /* @__PURE__ */ jsx_dev_runtime245.jsxDEV(MCPSettings, {
        onComplete: onDone
      }, void 0, !1, void 0, this);
    if (parts[0] === "reconnect" && parts[1])
      return /* @__PURE__ */ jsx_dev_runtime245.jsxDEV(MCPReconnect, {
        serverName: parts.slice(1).join(" "),
        onComplete: onDone
      }, void 0, !1, void 0, this);
    if (parts[0] === "enable" || parts[0] === "disable")
      return /* @__PURE__ */ jsx_dev_runtime245.jsxDEV(MCPToggle, {
        action: parts[0],
        target: parts.length > 1 ? parts.slice(1).join(" ") : "all",
        onComplete: onDone
      }, void 0, !1, void 0, this);
  }
  return /* @__PURE__ */ jsx_dev_runtime245.jsxDEV(MCPSettings, {
    onComplete: onDone
  }, void 0, !1, void 0, this);
}
var import_compiler_runtime194, import_react140, jsx_dev_runtime245;
var init_mcp2 = __esm(() => {
  init_mcp();
  init_MCPReconnect();
  init_MCPConnectionManager();
  init_AppState();
  init_PluginSettings();
  import_compiler_runtime194 = __toESM(require_react_compiler_runtime_development(), 1), import_react140 = __toESM(require_react_development(), 1), jsx_dev_runtime245 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
