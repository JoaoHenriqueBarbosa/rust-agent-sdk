// Original: src/components/mcp/MCPReconnect.tsx
function MCPReconnect(t0) {
  let $3 = import_compiler_runtime181.c(25), {
    serverName,
    onComplete
  } = t0, [theme] = useTheme(), store = useAppStateStore(), reconnectMcpServer = useMcpReconnect(), [isReconnecting, setIsReconnecting] = import_react126.useState(!0), [error44, setError] = import_react126.useState(null), t1, t2;
  if ($3[0] !== onComplete || $3[1] !== reconnectMcpServer || $3[2] !== serverName || $3[3] !== store)
    t1 = () => {
      (async function() {
        try {
          if (!store.getState().mcp.clients.find((c3) => c3.name === serverName)) {
            setError(`MCP server "${serverName}" not found`), setIsReconnecting(!1), onComplete(`MCP server "${serverName}" not found`);
            return;
          }
          let result = await reconnectMcpServer(serverName);
          bb43:
            switch (result.client.type) {
              case "connected": {
                setIsReconnecting(!1), onComplete(`Successfully reconnected to ${serverName}`);
                break bb43;
              }
              case "needs-auth": {
                setError(`${serverName} requires authentication`), setIsReconnecting(!1), onComplete(`${serverName} requires authentication. Use /mcp to authenticate.`);
                break bb43;
              }
              case "pending":
              case "failed":
              case "disabled":
                setError(`Failed to reconnect to ${serverName}`), setIsReconnecting(!1), onComplete(`Failed to reconnect to ${serverName}`);
            }
        } catch (t3) {
          let err2 = t3, errorMessage3 = err2 instanceof Error ? err2.message : String(err2);
          setError(errorMessage3), setIsReconnecting(!1), onComplete(`Error: ${errorMessage3}`);
        }
      })();
    }, t2 = [serverName, reconnectMcpServer, store, onComplete], $3[0] = onComplete, $3[1] = reconnectMcpServer, $3[2] = serverName, $3[3] = store, $3[4] = t1, $3[5] = t2;
  else
    t1 = $3[4], t2 = $3[5];
  if (import_react126.useEffect(t1, t2), isReconnecting) {
    let t3;
    if ($3[6] !== serverName)
      t3 = /* @__PURE__ */ jsx_dev_runtime226.jsxDEV(ThemedText, {
        color: "text",
        children: [
          "Reconnecting to ",
          /* @__PURE__ */ jsx_dev_runtime226.jsxDEV(ThemedText, {
            bold: !0,
            children: serverName
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this), $3[6] = serverName, $3[7] = t3;
    else
      t3 = $3[7];
    let t4;
    if ($3[8] === Symbol.for("react.memo_cache_sentinel"))
      t4 = /* @__PURE__ */ jsx_dev_runtime226.jsxDEV(ThemedBox_default, {
        children: [
          /* @__PURE__ */ jsx_dev_runtime226.jsxDEV(Spinner, {}, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime226.jsxDEV(ThemedText, {
            children: " Establishing connection to MCP server"
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this), $3[8] = t4;
    else
      t4 = $3[8];
    let t5;
    if ($3[9] !== t3)
      t5 = /* @__PURE__ */ jsx_dev_runtime226.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        gap: 1,
        padding: 1,
        children: [
          t3,
          t4
        ]
      }, void 0, !0, void 0, this), $3[9] = t3, $3[10] = t5;
    else
      t5 = $3[10];
    return t5;
  }
  if (error44) {
    let t3;
    if ($3[11] !== theme)
      t3 = color("error", theme)(figures_default.cross), $3[11] = theme, $3[12] = t3;
    else
      t3 = $3[12];
    let t4;
    if ($3[13] !== t3)
      t4 = /* @__PURE__ */ jsx_dev_runtime226.jsxDEV(ThemedText, {
        children: [
          t3,
          " "
        ]
      }, void 0, !0, void 0, this), $3[13] = t3, $3[14] = t4;
    else
      t4 = $3[14];
    let t5;
    if ($3[15] !== serverName)
      t5 = /* @__PURE__ */ jsx_dev_runtime226.jsxDEV(ThemedText, {
        color: "error",
        children: [
          "Failed to reconnect to ",
          serverName
        ]
      }, void 0, !0, void 0, this), $3[15] = serverName, $3[16] = t5;
    else
      t5 = $3[16];
    let t6;
    if ($3[17] !== t4 || $3[18] !== t5)
      t6 = /* @__PURE__ */ jsx_dev_runtime226.jsxDEV(ThemedBox_default, {
        children: [
          t4,
          t5
        ]
      }, void 0, !0, void 0, this), $3[17] = t4, $3[18] = t5, $3[19] = t6;
    else
      t6 = $3[19];
    let t7;
    if ($3[20] !== error44)
      t7 = /* @__PURE__ */ jsx_dev_runtime226.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          "Error: ",
          error44
        ]
      }, void 0, !0, void 0, this), $3[20] = error44, $3[21] = t7;
    else
      t7 = $3[21];
    let t8;
    if ($3[22] !== t6 || $3[23] !== t7)
      t8 = /* @__PURE__ */ jsx_dev_runtime226.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        gap: 1,
        padding: 1,
        children: [
          t6,
          t7
        ]
      }, void 0, !0, void 0, this), $3[22] = t6, $3[23] = t7, $3[24] = t8;
    else
      t8 = $3[24];
    return t8;
  }
  return null;
}
var import_compiler_runtime181, import_react126, jsx_dev_runtime226;
var init_MCPReconnect = __esm(() => {
  init_figures();
  init_ink2();
  init_MCPConnectionManager();
  init_AppState();
  init_Spinner2();
  import_compiler_runtime181 = __toESM(require_react_compiler_runtime_development(), 1), import_react126 = __toESM(require_react_development(), 1), jsx_dev_runtime226 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
