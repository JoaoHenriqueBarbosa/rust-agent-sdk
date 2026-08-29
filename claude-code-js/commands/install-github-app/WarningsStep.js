// Original: src/commands/install-github-app/WarningsStep.tsx
function WarningsStep(t0) {
  let $3 = import_compiler_runtime178.c(8), {
    warnings,
    onContinue
  } = t0, t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = {
      context: "Confirmation"
    }, $3[0] = t1;
  else
    t1 = $3[0];
  useKeybinding("confirm:yes", onContinue, t1);
  let t2;
  if ($3[1] === Symbol.for("react.memo_cache_sentinel"))
    t2 = /* @__PURE__ */ jsx_dev_runtime221.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginBottom: 1,
      children: [
        /* @__PURE__ */ jsx_dev_runtime221.jsxDEV(ThemedText, {
          bold: !0,
          children: [
            figures_default.warning,
            " Setup Warnings"
          ]
        }, void 0, !0, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime221.jsxDEV(ThemedText, {
          dimColor: !0,
          children: "We found some potential issues, but you can continue anyway"
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[1] = t2;
  else
    t2 = $3[1];
  let t3;
  if ($3[2] !== warnings)
    t3 = warnings.map(_temp233), $3[2] = warnings, $3[3] = t3;
  else
    t3 = $3[3];
  let t4;
  if ($3[4] === Symbol.for("react.memo_cache_sentinel"))
    t4 = /* @__PURE__ */ jsx_dev_runtime221.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      children: /* @__PURE__ */ jsx_dev_runtime221.jsxDEV(ThemedText, {
        bold: !0,
        color: "permission",
        children: "Press Enter to continue anyway, or Ctrl+C to exit and fix issues"
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[4] = t4;
  else
    t4 = $3[4];
  let t5;
  if ($3[5] === Symbol.for("react.memo_cache_sentinel"))
    t5 = /* @__PURE__ */ jsx_dev_runtime221.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      children: /* @__PURE__ */ jsx_dev_runtime221.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          "You can also try the manual setup steps if needed:",
          " ",
          /* @__PURE__ */ jsx_dev_runtime221.jsxDEV(ThemedText, {
            color: "claude",
            children: GITHUB_ACTION_SETUP_DOCS_URL
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[5] = t5;
  else
    t5 = $3[5];
  let t6;
  if ($3[6] !== t3)
    t6 = /* @__PURE__ */ jsx_dev_runtime221.jsxDEV(jsx_dev_runtime221.Fragment, {
      children: /* @__PURE__ */ jsx_dev_runtime221.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        borderStyle: "round",
        paddingX: 1,
        children: [
          t2,
          t3,
          t4,
          t5
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[6] = t3, $3[7] = t6;
  else
    t6 = $3[7];
  return t6;
}
function _temp233(warning, index) {
  return /* @__PURE__ */ jsx_dev_runtime221.jsxDEV(ThemedBox_default, {
    flexDirection: "column",
    marginBottom: 1,
    children: [
      /* @__PURE__ */ jsx_dev_runtime221.jsxDEV(ThemedText, {
        color: "warning",
        bold: !0,
        children: warning.title
      }, void 0, !1, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime221.jsxDEV(ThemedText, {
        children: warning.message
      }, void 0, !1, void 0, this),
      warning.instructions.length > 0 && /* @__PURE__ */ jsx_dev_runtime221.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        marginLeft: 2,
        marginTop: 1,
        children: warning.instructions.map(_temp100)
      }, void 0, !1, void 0, this)
    ]
  }, index, !0, void 0, this);
}
function _temp100(instruction, i5) {
  return /* @__PURE__ */ jsx_dev_runtime221.jsxDEV(ThemedText, {
    dimColor: !0,
    children: [
      "\u2022 ",
      instruction
    ]
  }, i5, !0, void 0, this);
}
var import_compiler_runtime178, jsx_dev_runtime221;
var init_WarningsStep = __esm(() => {
  init_figures();
  init_ink2();
  init_useKeybinding();
  import_compiler_runtime178 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime221 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
