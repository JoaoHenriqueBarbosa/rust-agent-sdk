// Original: src/components/HelpV2/General.tsx
function General() {
  let $3 = import_compiler_runtime164.c(2), t0;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t0 = /* @__PURE__ */ jsx_dev_runtime205.jsxDEV(ThemedBox_default, {
      children: /* @__PURE__ */ jsx_dev_runtime205.jsxDEV(ThemedText, {
        children: "Claude understands your codebase, makes edits with your permission, and executes commands \u2014 right from your terminal."
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[0] = t0;
  else
    t0 = $3[0];
  let t1;
  if ($3[1] === Symbol.for("react.memo_cache_sentinel"))
    t1 = /* @__PURE__ */ jsx_dev_runtime205.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      paddingY: 1,
      gap: 1,
      children: [
        t0,
        /* @__PURE__ */ jsx_dev_runtime205.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          children: [
            /* @__PURE__ */ jsx_dev_runtime205.jsxDEV(ThemedBox_default, {
              children: /* @__PURE__ */ jsx_dev_runtime205.jsxDEV(ThemedText, {
                bold: !0,
                children: "Shortcuts"
              }, void 0, !1, void 0, this)
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime205.jsxDEV(PromptInputHelpMenu, {
              gap: 2,
              fixedWidth: !0
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[1] = t1;
  else
    t1 = $3[1];
  return t1;
}
var import_compiler_runtime164, jsx_dev_runtime205;
var init_General = __esm(() => {
  init_ink2();
  init_PromptInputHelpMenu();
  import_compiler_runtime164 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime205 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
