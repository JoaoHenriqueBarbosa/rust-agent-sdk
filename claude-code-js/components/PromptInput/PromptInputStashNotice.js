// Original: src/components/PromptInput/PromptInputStashNotice.tsx
function PromptInputStashNotice(t0) {
  let $3 = import_compiler_runtime334.c(1), {
    hasStash
  } = t0;
  if (!hasStash)
    return null;
  let t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = /* @__PURE__ */ jsx_dev_runtime433.jsxDEV(ThemedBox_default, {
      paddingLeft: 2,
      children: /* @__PURE__ */ jsx_dev_runtime433.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          figures_default.pointerSmall,
          " Stashed (auto-restores after submit)"
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[0] = t1;
  else
    t1 = $3[0];
  return t1;
}
var import_compiler_runtime334, jsx_dev_runtime433;
var init_PromptInputStashNotice = __esm(() => {
  init_figures();
  init_ink2();
  import_compiler_runtime334 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime433 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
