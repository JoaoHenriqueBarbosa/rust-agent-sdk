// Original: src/components/PressEnterToContinue.tsx
function PressEnterToContinue() {
  let $3 = import_compiler_runtime155.c(1), t0;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t0 = /* @__PURE__ */ jsx_dev_runtime195.jsxDEV(ThemedText, {
      color: "permission",
      children: [
        "Press ",
        /* @__PURE__ */ jsx_dev_runtime195.jsxDEV(ThemedText, {
          bold: !0,
          children: "Enter"
        }, void 0, !1, void 0, this),
        " to continue\u2026"
      ]
    }, void 0, !0, void 0, this), $3[0] = t0;
  else
    t0 = $3[0];
  return t0;
}
var import_compiler_runtime155, jsx_dev_runtime195;
var init_PressEnterToContinue = __esm(() => {
  init_ink2();
  import_compiler_runtime155 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime195 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
