// Original: src/components/InterruptedByUser.tsx
function InterruptedByUser() {
  let $3 = import_compiler_runtime36.c(1), t0;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t0 = /* @__PURE__ */ jsx_dev_runtime41.jsxDEV(jsx_dev_runtime41.Fragment, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime41.jsxDEV(ThemedText, {
          dimColor: !0,
          children: "Interrupted "
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime41.jsxDEV(ThemedText, {
          dimColor: !0,
          children: "\xB7 What should Claude do instead?"
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[0] = t0;
  else
    t0 = $3[0];
  return t0;
}
var import_compiler_runtime36, jsx_dev_runtime41;
var init_InterruptedByUser = __esm(() => {
  init_ink2();
  import_compiler_runtime36 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime41 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
