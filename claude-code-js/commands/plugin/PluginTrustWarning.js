// Original: src/commands/plugin/PluginTrustWarning.tsx
function PluginTrustWarning() {
  let $3 = import_compiler_runtime187.c(3), t0;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t0 = getPluginTrustMessage(), $3[0] = t0;
  else
    t0 = $3[0];
  let customMessage = t0, t1;
  if ($3[1] === Symbol.for("react.memo_cache_sentinel"))
    t1 = /* @__PURE__ */ jsx_dev_runtime236.jsxDEV(ThemedText, {
      color: "claude",
      children: [
        figures_default.warning,
        " "
      ]
    }, void 0, !0, void 0, this), $3[1] = t1;
  else
    t1 = $3[1];
  let t2;
  if ($3[2] === Symbol.for("react.memo_cache_sentinel"))
    t2 = /* @__PURE__ */ jsx_dev_runtime236.jsxDEV(ThemedBox_default, {
      marginBottom: 1,
      children: [
        t1,
        /* @__PURE__ */ jsx_dev_runtime236.jsxDEV(ThemedText, {
          dimColor: !0,
          italic: !0,
          children: [
            "Make sure you trust a plugin before installing, updating, or using it. Anthropic does not control what MCP servers, files, or other software are included in plugins and cannot verify that they will work as intended or that they won't change. See each plugin's homepage for more information.",
            customMessage ? ` ${customMessage}` : ""
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[2] = t2;
  else
    t2 = $3[2];
  return t2;
}
var import_compiler_runtime187, jsx_dev_runtime236;
var init_PluginTrustWarning = __esm(() => {
  init_figures();
  init_ink2();
  init_marketplaceHelpers();
  import_compiler_runtime187 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime236 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
