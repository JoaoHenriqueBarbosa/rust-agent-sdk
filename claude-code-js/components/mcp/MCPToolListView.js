// Original: src/components/mcp/MCPToolListView.tsx
function MCPToolListView(t0) {
  let $3 = import_compiler_runtime184.c(21), {
    server,
    onSelectTool,
    onBack
  } = t0, mcpTools = useAppState(_temp106), t1;
  bb0: {
    if (server.client.type !== "connected") {
      let t23;
      if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
        t23 = [], $3[0] = t23;
      else
        t23 = $3[0];
      t1 = t23;
      break bb0;
    }
    let t22;
    if ($3[1] !== mcpTools || $3[2] !== server.name)
      t22 = filterToolsByServer(mcpTools, server.name), $3[1] = mcpTools, $3[2] = server.name, $3[3] = t22;
    else
      t22 = $3[3];
    t1 = t22;
  }
  let serverTools = t1, t2;
  if ($3[4] !== server.name || $3[5] !== serverTools) {
    let t32;
    if ($3[7] !== server.name)
      t32 = (tool, index) => {
        let toolName = getMcpDisplayName(tool.name, server.name), fullDisplayName = tool.userFacingName ? tool.userFacingName({}) : toolName, displayName = extractMcpToolDisplayName(fullDisplayName), isReadOnly = tool.isReadOnly?.({}) ?? !1, isDestructive = tool.isDestructive?.({}) ?? !1, isOpenWorld = tool.isOpenWorld?.({}) ?? !1, annotations = [];
        if (isReadOnly)
          annotations.push("read-only");
        if (isDestructive)
          annotations.push("destructive");
        if (isOpenWorld)
          annotations.push("open-world");
        return {
          label: displayName,
          value: index.toString(),
          description: annotations.length > 0 ? annotations.join(", ") : void 0,
          descriptionColor: isDestructive ? "error" : isReadOnly ? "success" : void 0
        };
      }, $3[7] = server.name, $3[8] = t32;
    else
      t32 = $3[8];
    t2 = serverTools.map(t32), $3[4] = server.name, $3[5] = serverTools, $3[6] = t2;
  } else
    t2 = $3[6];
  let toolOptions = t2, t3 = `Tools for ${server.name}`, t4 = serverTools.length, t5;
  if ($3[9] !== serverTools.length)
    t5 = plural(serverTools.length, "tool"), $3[9] = serverTools.length, $3[10] = t5;
  else
    t5 = $3[10];
  let t6 = `${t4} ${t5}`, t7;
  if ($3[11] !== onBack || $3[12] !== onSelectTool || $3[13] !== serverTools || $3[14] !== toolOptions)
    t7 = serverTools.length === 0 ? /* @__PURE__ */ jsx_dev_runtime231.jsxDEV(ThemedText, {
      dimColor: !0,
      children: "No tools available"
    }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime231.jsxDEV(Select, {
      options: toolOptions,
      onChange: (value) => {
        let index_0 = parseInt(value), tool_0 = serverTools[index_0];
        if (tool_0)
          onSelectTool(tool_0, index_0);
      },
      onCancel: onBack
    }, void 0, !1, void 0, this), $3[11] = onBack, $3[12] = onSelectTool, $3[13] = serverTools, $3[14] = toolOptions, $3[15] = t7;
  else
    t7 = $3[15];
  let t8;
  if ($3[16] !== onBack || $3[17] !== t3 || $3[18] !== t6 || $3[19] !== t7)
    t8 = /* @__PURE__ */ jsx_dev_runtime231.jsxDEV(Dialog, {
      title: t3,
      subtitle: t6,
      onCancel: onBack,
      inputGuide: _temp236,
      children: t7
    }, void 0, !1, void 0, this), $3[16] = onBack, $3[17] = t3, $3[18] = t6, $3[19] = t7, $3[20] = t8;
  else
    t8 = $3[20];
  return t8;
}
function _temp236(exitState) {
  return exitState.pending ? /* @__PURE__ */ jsx_dev_runtime231.jsxDEV(ThemedText, {
    children: [
      "Press ",
      exitState.keyName,
      " again to exit"
    ]
  }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime231.jsxDEV(Byline, {
    children: [
      /* @__PURE__ */ jsx_dev_runtime231.jsxDEV(KeyboardShortcutHint, {
        shortcut: "\u2191\u2193",
        action: "navigate"
      }, void 0, !1, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime231.jsxDEV(KeyboardShortcutHint, {
        shortcut: "Enter",
        action: "select"
      }, void 0, !1, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime231.jsxDEV(ConfigurableShortcutHint, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "back"
      }, void 0, !1, void 0, this)
    ]
  }, void 0, !0, void 0, this);
}
function _temp106(s2) {
  return s2.mcp.tools;
}
var import_compiler_runtime184, jsx_dev_runtime231;
var init_MCPToolListView = __esm(() => {
  init_ink2();
  init_mcpStringUtils();
  init_utils7();
  init_AppState();
  init_ConfigurableShortcutHint();
  init_CustomSelect();
  init_Byline();
  init_Dialog();
  init_KeyboardShortcutHint();
  import_compiler_runtime184 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime231 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
