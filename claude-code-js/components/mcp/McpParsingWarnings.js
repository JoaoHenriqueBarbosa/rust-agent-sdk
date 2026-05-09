// Original: src/components/mcp/McpParsingWarnings.tsx
function McpConfigErrorSection(t0) {
  let $3 = import_compiler_runtime154.c(26), {
    scope,
    parsingErrors,
    warnings
  } = t0, hasErrors = parsingErrors.length > 0, hasWarnings = warnings.length > 0;
  if (!hasErrors && !hasWarnings)
    return null;
  let t1;
  if ($3[0] !== hasErrors || $3[1] !== hasWarnings)
    t1 = (hasErrors || hasWarnings) && /* @__PURE__ */ jsx_dev_runtime194.jsxDEV(ThemedText, {
      color: hasErrors ? "error" : "warning",
      children: [
        "[",
        hasErrors ? "Failed to parse" : "Contains warnings",
        "]",
        " "
      ]
    }, void 0, !0, void 0, this), $3[0] = hasErrors, $3[1] = hasWarnings, $3[2] = t1;
  else
    t1 = $3[2];
  let t2;
  if ($3[3] !== scope)
    t2 = getScopeLabel(scope), $3[3] = scope, $3[4] = t2;
  else
    t2 = $3[4];
  let t3;
  if ($3[5] !== t2)
    t3 = /* @__PURE__ */ jsx_dev_runtime194.jsxDEV(ThemedText, {
      children: t2
    }, void 0, !1, void 0, this), $3[5] = t2, $3[6] = t3;
  else
    t3 = $3[6];
  let t4;
  if ($3[7] !== t1 || $3[8] !== t3)
    t4 = /* @__PURE__ */ jsx_dev_runtime194.jsxDEV(ThemedBox_default, {
      children: [
        t1,
        t3
      ]
    }, void 0, !0, void 0, this), $3[7] = t1, $3[8] = t3, $3[9] = t4;
  else
    t4 = $3[9];
  let t5;
  if ($3[10] === Symbol.for("react.memo_cache_sentinel"))
    t5 = /* @__PURE__ */ jsx_dev_runtime194.jsxDEV(ThemedText, {
      dimColor: !0,
      children: "Location: "
    }, void 0, !1, void 0, this), $3[10] = t5;
  else
    t5 = $3[10];
  let t6;
  if ($3[11] !== scope)
    t6 = describeMcpConfigFilePath(scope), $3[11] = scope, $3[12] = t6;
  else
    t6 = $3[12];
  let t7;
  if ($3[13] !== t6)
    t7 = /* @__PURE__ */ jsx_dev_runtime194.jsxDEV(ThemedBox_default, {
      children: [
        t5,
        /* @__PURE__ */ jsx_dev_runtime194.jsxDEV(ThemedText, {
          dimColor: !0,
          children: t6
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[13] = t6, $3[14] = t7;
  else
    t7 = $3[14];
  let t8;
  if ($3[15] !== parsingErrors)
    t8 = parsingErrors.map(_temp80), $3[15] = parsingErrors, $3[16] = t8;
  else
    t8 = $3[16];
  let t9;
  if ($3[17] !== warnings)
    t9 = warnings.map(_temp226), $3[17] = warnings, $3[18] = t9;
  else
    t9 = $3[18];
  let t10;
  if ($3[19] !== t8 || $3[20] !== t9)
    t10 = /* @__PURE__ */ jsx_dev_runtime194.jsxDEV(ThemedBox_default, {
      marginLeft: 1,
      flexDirection: "column",
      children: [
        t8,
        t9
      ]
    }, void 0, !0, void 0, this), $3[19] = t8, $3[20] = t9, $3[21] = t10;
  else
    t10 = $3[21];
  let t11;
  if ($3[22] !== t10 || $3[23] !== t4 || $3[24] !== t7)
    t11 = /* @__PURE__ */ jsx_dev_runtime194.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginTop: 1,
      children: [
        t4,
        t7,
        t10
      ]
    }, void 0, !0, void 0, this), $3[22] = t10, $3[23] = t4, $3[24] = t7, $3[25] = t11;
  else
    t11 = $3[25];
  return t11;
}
function _temp226(warning, i_0) {
  let serverName_0 = warning.mcpErrorMetadata?.serverName;
  return /* @__PURE__ */ jsx_dev_runtime194.jsxDEV(ThemedBox_default, {
    children: /* @__PURE__ */ jsx_dev_runtime194.jsxDEV(ThemedText, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime194.jsxDEV(ThemedText, {
          dimColor: !0,
          children: "\u2514 "
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime194.jsxDEV(ThemedText, {
          color: "warning",
          children: "[Warning]"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime194.jsxDEV(ThemedText, {
          dimColor: !0,
          children: [
            " ",
            serverName_0 && `[${serverName_0}] `,
            warning.path && warning.path !== "" ? `${warning.path}: ` : "",
            warning.message
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this)
  }, `warning-${i_0}`, !1, void 0, this);
}
function _temp80(error44, i5) {
  let serverName = error44.mcpErrorMetadata?.serverName;
  return /* @__PURE__ */ jsx_dev_runtime194.jsxDEV(ThemedBox_default, {
    children: /* @__PURE__ */ jsx_dev_runtime194.jsxDEV(ThemedText, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime194.jsxDEV(ThemedText, {
          dimColor: !0,
          children: "\u2514 "
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime194.jsxDEV(ThemedText, {
          color: "error",
          children: "[Error]"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime194.jsxDEV(ThemedText, {
          dimColor: !0,
          children: [
            " ",
            serverName && `[${serverName}] `,
            error44.path && error44.path !== "" ? `${error44.path}: ` : "",
            error44.message
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this)
  }, `error-${i5}`, !1, void 0, this);
}
function McpParsingWarnings() {
  let $3 = import_compiler_runtime154.c(6), t0;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t0 = {
      scope: "user",
      config: getMcpConfigsByScope("user")
    }, $3[0] = t0;
  else
    t0 = $3[0];
  let t1;
  if ($3[1] === Symbol.for("react.memo_cache_sentinel"))
    t1 = {
      scope: "project",
      config: getMcpConfigsByScope("project")
    }, $3[1] = t1;
  else
    t1 = $3[1];
  let t2;
  if ($3[2] === Symbol.for("react.memo_cache_sentinel"))
    t2 = {
      scope: "local",
      config: getMcpConfigsByScope("local")
    }, $3[2] = t2;
  else
    t2 = $3[2];
  let t3;
  if ($3[3] === Symbol.for("react.memo_cache_sentinel"))
    t3 = [t0, t1, t2, {
      scope: "enterprise",
      config: getMcpConfigsByScope("enterprise")
    }], $3[3] = t3;
  else
    t3 = $3[3];
  let scopes = t3, hasParsingErrors = scopes.some(_temp319), hasWarnings = scopes.some(_temp417);
  if (!hasParsingErrors && !hasWarnings)
    return null;
  let t4;
  if ($3[4] === Symbol.for("react.memo_cache_sentinel"))
    t4 = /* @__PURE__ */ jsx_dev_runtime194.jsxDEV(ThemedText, {
      bold: !0,
      children: "MCP Config Diagnostics"
    }, void 0, !1, void 0, this), $3[4] = t4;
  else
    t4 = $3[4];
  let t5;
  if ($3[5] === Symbol.for("react.memo_cache_sentinel"))
    t5 = /* @__PURE__ */ jsx_dev_runtime194.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginTop: 1,
      marginBottom: 1,
      children: [
        t4,
        /* @__PURE__ */ jsx_dev_runtime194.jsxDEV(ThemedBox_default, {
          marginTop: 1,
          children: /* @__PURE__ */ jsx_dev_runtime194.jsxDEV(ThemedText, {
            dimColor: !0,
            children: [
              "For help configuring MCP servers, see:",
              " ",
              /* @__PURE__ */ jsx_dev_runtime194.jsxDEV(Link, {
                url: "https://code.claude.com/docs/en/mcp",
                children: "https://code.claude.com/docs/en/mcp"
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this)
        }, void 0, !1, void 0, this),
        scopes.map(_temp512)
      ]
    }, void 0, !0, void 0, this), $3[5] = t5;
  else
    t5 = $3[5];
  return t5;
}
function _temp512(t0) {
  let {
    scope,
    config: config_1
  } = t0;
  return /* @__PURE__ */ jsx_dev_runtime194.jsxDEV(McpConfigErrorSection, {
    scope,
    parsingErrors: filterErrors(config_1.errors, "fatal"),
    warnings: filterErrors(config_1.errors, "warning")
  }, scope, !1, void 0, this);
}
function _temp417(t0) {
  let {
    config: config_0
  } = t0;
  return filterErrors(config_0.errors, "warning").length > 0;
}
function _temp319(t0) {
  let {
    config: config11
  } = t0;
  return filterErrors(config11.errors, "fatal").length > 0;
}
function filterErrors(errors8, severity) {
  return errors8.filter((e) => e.mcpErrorMetadata?.severity === severity);
}
var import_compiler_runtime154, jsx_dev_runtime194;
var init_McpParsingWarnings = __esm(() => {
  init_config8();
  init_utils7();
  init_ink2();
  import_compiler_runtime154 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime194 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
