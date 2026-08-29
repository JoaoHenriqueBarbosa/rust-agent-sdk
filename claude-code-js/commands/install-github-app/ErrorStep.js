// Original: src/commands/install-github-app/ErrorStep.tsx
function ErrorStep(t0) {
  let $3 = import_compiler_runtime174.c(15), {
    error: error44,
    errorReason,
    errorInstructions
  } = t0, t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = /* @__PURE__ */ jsx_dev_runtime216.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginBottom: 1,
      children: /* @__PURE__ */ jsx_dev_runtime216.jsxDEV(ThemedText, {
        bold: !0,
        children: "Install GitHub App"
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[0] = t1;
  else
    t1 = $3[0];
  let t2;
  if ($3[1] !== error44)
    t2 = /* @__PURE__ */ jsx_dev_runtime216.jsxDEV(ThemedText, {
      color: "error",
      children: [
        "Error: ",
        error44
      ]
    }, void 0, !0, void 0, this), $3[1] = error44, $3[2] = t2;
  else
    t2 = $3[2];
  let t3;
  if ($3[3] !== errorReason)
    t3 = errorReason && /* @__PURE__ */ jsx_dev_runtime216.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      children: /* @__PURE__ */ jsx_dev_runtime216.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          "Reason: ",
          errorReason
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[3] = errorReason, $3[4] = t3;
  else
    t3 = $3[4];
  let t4;
  if ($3[5] !== errorInstructions)
    t4 = errorInstructions && errorInstructions.length > 0 && /* @__PURE__ */ jsx_dev_runtime216.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginTop: 1,
      children: [
        /* @__PURE__ */ jsx_dev_runtime216.jsxDEV(ThemedText, {
          dimColor: !0,
          children: "How to fix:"
        }, void 0, !1, void 0, this),
        errorInstructions.map(_temp99)
      ]
    }, void 0, !0, void 0, this), $3[5] = errorInstructions, $3[6] = t4;
  else
    t4 = $3[6];
  let t5;
  if ($3[7] === Symbol.for("react.memo_cache_sentinel"))
    t5 = /* @__PURE__ */ jsx_dev_runtime216.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      children: /* @__PURE__ */ jsx_dev_runtime216.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          "For manual setup instructions, see:",
          " ",
          /* @__PURE__ */ jsx_dev_runtime216.jsxDEV(ThemedText, {
            color: "claude",
            children: GITHUB_ACTION_SETUP_DOCS_URL
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[7] = t5;
  else
    t5 = $3[7];
  let t6;
  if ($3[8] !== t2 || $3[9] !== t3 || $3[10] !== t4)
    t6 = /* @__PURE__ */ jsx_dev_runtime216.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      borderStyle: "round",
      paddingX: 1,
      children: [
        t1,
        t2,
        t3,
        t4,
        t5
      ]
    }, void 0, !0, void 0, this), $3[8] = t2, $3[9] = t3, $3[10] = t4, $3[11] = t6;
  else
    t6 = $3[11];
  let t7;
  if ($3[12] === Symbol.for("react.memo_cache_sentinel"))
    t7 = /* @__PURE__ */ jsx_dev_runtime216.jsxDEV(ThemedBox_default, {
      marginLeft: 3,
      children: /* @__PURE__ */ jsx_dev_runtime216.jsxDEV(ThemedText, {
        dimColor: !0,
        children: "Press any key to exit"
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[12] = t7;
  else
    t7 = $3[12];
  let t8;
  if ($3[13] !== t6)
    t8 = /* @__PURE__ */ jsx_dev_runtime216.jsxDEV(jsx_dev_runtime216.Fragment, {
      children: [
        t6,
        t7
      ]
    }, void 0, !0, void 0, this), $3[13] = t6, $3[14] = t8;
  else
    t8 = $3[14];
  return t8;
}
function _temp99(instruction, index) {
  return /* @__PURE__ */ jsx_dev_runtime216.jsxDEV(ThemedBox_default, {
    marginLeft: 2,
    children: [
      /* @__PURE__ */ jsx_dev_runtime216.jsxDEV(ThemedText, {
        dimColor: !0,
        children: "\u2022 "
      }, void 0, !1, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime216.jsxDEV(ThemedText, {
        children: instruction
      }, void 0, !1, void 0, this)
    ]
  }, index, !0, void 0, this);
}
var import_compiler_runtime174, jsx_dev_runtime216;
var init_ErrorStep = __esm(() => {
  init_ink2();
  import_compiler_runtime174 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime216 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
