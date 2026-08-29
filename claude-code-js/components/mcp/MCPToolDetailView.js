// Original: src/components/mcp/MCPToolDetailView.tsx
function MCPToolDetailView(t0) {
  let $3 = import_compiler_runtime183.c(44), {
    tool,
    server,
    onBack
  } = t0, [toolDescription, setToolDescription] = import_react129.default.useState(""), t1, toolName;
  if ($3[0] !== server.name || $3[1] !== tool) {
    toolName = getMcpDisplayName(tool.name, server.name);
    let fullDisplayName = tool.userFacingName ? tool.userFacingName({}) : toolName;
    t1 = extractMcpToolDisplayName(fullDisplayName), $3[0] = server.name, $3[1] = tool, $3[2] = t1, $3[3] = toolName;
  } else
    t1 = $3[2], toolName = $3[3];
  let displayName = t1, t2;
  if ($3[4] !== tool)
    t2 = tool.isReadOnly?.({}) ?? !1, $3[4] = tool, $3[5] = t2;
  else
    t2 = $3[5];
  let isReadOnly = t2, t3;
  if ($3[6] !== tool)
    t3 = tool.isDestructive?.({}) ?? !1, $3[6] = tool, $3[7] = t3;
  else
    t3 = $3[7];
  let isDestructive = t3, t4;
  if ($3[8] !== tool)
    t4 = tool.isOpenWorld?.({}) ?? !1, $3[8] = tool, $3[9] = t4;
  else
    t4 = $3[9];
  let isOpenWorld = t4, t5, t6;
  if ($3[10] !== tool)
    t5 = () => {
      (async function() {
        try {
          let desc = await tool.description({}, {
            isNonInteractiveSession: !1,
            toolPermissionContext: {
              mode: "default",
              additionalWorkingDirectories: /* @__PURE__ */ new Map,
              alwaysAllowRules: {},
              alwaysDenyRules: {},
              alwaysAskRules: {},
              isBypassPermissionsModeAvailable: !1
            },
            tools: []
          });
          setToolDescription(desc);
        } catch {
          setToolDescription("Failed to load description");
        }
      })();
    }, t6 = [tool], $3[10] = tool, $3[11] = t5, $3[12] = t6;
  else
    t5 = $3[11], t6 = $3[12];
  import_react129.default.useEffect(t5, t6);
  let t7;
  if ($3[13] !== isReadOnly)
    t7 = isReadOnly && /* @__PURE__ */ jsx_dev_runtime230.jsxDEV(ThemedText, {
      color: "success",
      children: " [read-only]"
    }, void 0, !1, void 0, this), $3[13] = isReadOnly, $3[14] = t7;
  else
    t7 = $3[14];
  let t8;
  if ($3[15] !== isDestructive)
    t8 = isDestructive && /* @__PURE__ */ jsx_dev_runtime230.jsxDEV(ThemedText, {
      color: "error",
      children: " [destructive]"
    }, void 0, !1, void 0, this), $3[15] = isDestructive, $3[16] = t8;
  else
    t8 = $3[16];
  let t9;
  if ($3[17] !== isOpenWorld)
    t9 = isOpenWorld && /* @__PURE__ */ jsx_dev_runtime230.jsxDEV(ThemedText, {
      dimColor: !0,
      children: " [open-world]"
    }, void 0, !1, void 0, this), $3[17] = isOpenWorld, $3[18] = t9;
  else
    t9 = $3[18];
  let t10;
  if ($3[19] !== displayName || $3[20] !== t7 || $3[21] !== t8 || $3[22] !== t9)
    t10 = /* @__PURE__ */ jsx_dev_runtime230.jsxDEV(jsx_dev_runtime230.Fragment, {
      children: [
        displayName,
        t7,
        t8,
        t9
      ]
    }, void 0, !0, void 0, this), $3[19] = displayName, $3[20] = t7, $3[21] = t8, $3[22] = t9, $3[23] = t10;
  else
    t10 = $3[23];
  let titleContent = t10, t11;
  if ($3[24] === Symbol.for("react.memo_cache_sentinel"))
    t11 = /* @__PURE__ */ jsx_dev_runtime230.jsxDEV(ThemedText, {
      bold: !0,
      children: "Tool name: "
    }, void 0, !1, void 0, this), $3[24] = t11;
  else
    t11 = $3[24];
  let t12;
  if ($3[25] !== toolName)
    t12 = /* @__PURE__ */ jsx_dev_runtime230.jsxDEV(ThemedBox_default, {
      children: [
        t11,
        /* @__PURE__ */ jsx_dev_runtime230.jsxDEV(ThemedText, {
          dimColor: !0,
          children: toolName
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[25] = toolName, $3[26] = t12;
  else
    t12 = $3[26];
  let t13;
  if ($3[27] === Symbol.for("react.memo_cache_sentinel"))
    t13 = /* @__PURE__ */ jsx_dev_runtime230.jsxDEV(ThemedText, {
      bold: !0,
      children: "Full name: "
    }, void 0, !1, void 0, this), $3[27] = t13;
  else
    t13 = $3[27];
  let t14;
  if ($3[28] !== tool.name)
    t14 = /* @__PURE__ */ jsx_dev_runtime230.jsxDEV(ThemedBox_default, {
      children: [
        t13,
        /* @__PURE__ */ jsx_dev_runtime230.jsxDEV(ThemedText, {
          dimColor: !0,
          children: tool.name
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[28] = tool.name, $3[29] = t14;
  else
    t14 = $3[29];
  let t15;
  if ($3[30] !== toolDescription)
    t15 = toolDescription && /* @__PURE__ */ jsx_dev_runtime230.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginTop: 1,
      children: [
        /* @__PURE__ */ jsx_dev_runtime230.jsxDEV(ThemedText, {
          bold: !0,
          children: "Description:"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime230.jsxDEV(ThemedText, {
          wrap: "wrap",
          children: toolDescription
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[30] = toolDescription, $3[31] = t15;
  else
    t15 = $3[31];
  let t16;
  if ($3[32] !== tool.inputJSONSchema)
    t16 = tool.inputJSONSchema && tool.inputJSONSchema.properties && Object.keys(tool.inputJSONSchema.properties).length > 0 && /* @__PURE__ */ jsx_dev_runtime230.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginTop: 1,
      children: [
        /* @__PURE__ */ jsx_dev_runtime230.jsxDEV(ThemedText, {
          bold: !0,
          children: "Parameters:"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime230.jsxDEV(ThemedBox_default, {
          marginLeft: 2,
          flexDirection: "column",
          children: Object.entries(tool.inputJSONSchema.properties).map((t172) => {
            let [key3, value] = t172, isRequired = tool.inputJSONSchema?.required?.includes(key3);
            return /* @__PURE__ */ jsx_dev_runtime230.jsxDEV(ThemedText, {
              children: [
                "\u2022 ",
                key3,
                isRequired && /* @__PURE__ */ jsx_dev_runtime230.jsxDEV(ThemedText, {
                  dimColor: !0,
                  children: " (required)"
                }, void 0, !1, void 0, this),
                ":",
                " ",
                /* @__PURE__ */ jsx_dev_runtime230.jsxDEV(ThemedText, {
                  dimColor: !0,
                  children: typeof value === "object" && value && "type" in value ? String(value.type) : "unknown"
                }, void 0, !1, void 0, this),
                typeof value === "object" && value && "description" in value && /* @__PURE__ */ jsx_dev_runtime230.jsxDEV(ThemedText, {
                  dimColor: !0,
                  children: [
                    " - ",
                    String(value.description)
                  ]
                }, void 0, !0, void 0, this)
              ]
            }, key3, !0, void 0, this);
          })
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[32] = tool.inputJSONSchema, $3[33] = t16;
  else
    t16 = $3[33];
  let t17;
  if ($3[34] !== t12 || $3[35] !== t14 || $3[36] !== t15 || $3[37] !== t16)
    t17 = /* @__PURE__ */ jsx_dev_runtime230.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        t12,
        t14,
        t15,
        t16
      ]
    }, void 0, !0, void 0, this), $3[34] = t12, $3[35] = t14, $3[36] = t15, $3[37] = t16, $3[38] = t17;
  else
    t17 = $3[38];
  let t18;
  if ($3[39] !== onBack || $3[40] !== server.name || $3[41] !== t17 || $3[42] !== titleContent)
    t18 = /* @__PURE__ */ jsx_dev_runtime230.jsxDEV(Dialog, {
      title: titleContent,
      subtitle: server.name,
      onCancel: onBack,
      inputGuide: _temp104,
      children: t17
    }, void 0, !1, void 0, this), $3[39] = onBack, $3[40] = server.name, $3[41] = t17, $3[42] = titleContent, $3[43] = t18;
  else
    t18 = $3[43];
  return t18;
}
function _temp104(exitState) {
  return exitState.pending ? /* @__PURE__ */ jsx_dev_runtime230.jsxDEV(ThemedText, {
    children: [
      "Press ",
      exitState.keyName,
      " again to exit"
    ]
  }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime230.jsxDEV(ConfigurableShortcutHint, {
    action: "confirm:no",
    context: "Confirmation",
    fallback: "Esc",
    description: "go back"
  }, void 0, !1, void 0, this);
}
var import_compiler_runtime183, import_react129, jsx_dev_runtime230;
var init_MCPToolDetailView = __esm(() => {
  init_ink2();
  init_mcpStringUtils();
  init_ConfigurableShortcutHint();
  init_Dialog();
  import_compiler_runtime183 = __toESM(require_react_compiler_runtime_development(), 1), import_react129 = __toESM(require_react_development(), 1), jsx_dev_runtime230 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
