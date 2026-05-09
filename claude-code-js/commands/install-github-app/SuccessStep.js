// Original: src/commands/install-github-app/SuccessStep.tsx
function SuccessStep(t0) {
  let $3 = import_compiler_runtime177.c(21), {
    secretExists,
    useExistingSecret,
    secretName,
    skipWorkflow: t1
  } = t0, skipWorkflow = t1 === void 0 ? !1 : t1, t2;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t2 = /* @__PURE__ */ jsx_dev_runtime220.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginBottom: 1,
      children: [
        /* @__PURE__ */ jsx_dev_runtime220.jsxDEV(ThemedText, {
          bold: !0,
          children: "Install GitHub App"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime220.jsxDEV(ThemedText, {
          dimColor: !0,
          children: "Success"
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[0] = t2;
  else
    t2 = $3[0];
  let t3;
  if ($3[1] !== skipWorkflow)
    t3 = !skipWorkflow && /* @__PURE__ */ jsx_dev_runtime220.jsxDEV(ThemedText, {
      color: "success",
      children: "\u2713 GitHub Actions workflow created!"
    }, void 0, !1, void 0, this), $3[1] = skipWorkflow, $3[2] = t3;
  else
    t3 = $3[2];
  let t4;
  if ($3[3] !== secretExists || $3[4] !== useExistingSecret)
    t4 = secretExists && useExistingSecret && /* @__PURE__ */ jsx_dev_runtime220.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      children: /* @__PURE__ */ jsx_dev_runtime220.jsxDEV(ThemedText, {
        color: "success",
        children: "\u2713 Using existing ANTHROPIC_API_KEY secret"
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[3] = secretExists, $3[4] = useExistingSecret, $3[5] = t4;
  else
    t4 = $3[5];
  let t5;
  if ($3[6] !== secretExists || $3[7] !== secretName || $3[8] !== useExistingSecret)
    t5 = (!secretExists || !useExistingSecret) && /* @__PURE__ */ jsx_dev_runtime220.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      children: /* @__PURE__ */ jsx_dev_runtime220.jsxDEV(ThemedText, {
        color: "success",
        children: [
          "\u2713 API key saved as ",
          secretName,
          " secret"
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[6] = secretExists, $3[7] = secretName, $3[8] = useExistingSecret, $3[9] = t5;
  else
    t5 = $3[9];
  let t6;
  if ($3[10] === Symbol.for("react.memo_cache_sentinel"))
    t6 = /* @__PURE__ */ jsx_dev_runtime220.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      children: /* @__PURE__ */ jsx_dev_runtime220.jsxDEV(ThemedText, {
        children: "Next steps:"
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[10] = t6;
  else
    t6 = $3[10];
  let t7;
  if ($3[11] !== skipWorkflow)
    t7 = skipWorkflow ? /* @__PURE__ */ jsx_dev_runtime220.jsxDEV(jsx_dev_runtime220.Fragment, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime220.jsxDEV(ThemedText, {
          children: "1. Install the Claude GitHub App if you haven't already"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime220.jsxDEV(ThemedText, {
          children: "2. Your workflow file was kept unchanged"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime220.jsxDEV(ThemedText, {
          children: "3. API key is configured and ready to use"
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime220.jsxDEV(jsx_dev_runtime220.Fragment, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime220.jsxDEV(ThemedText, {
          children: "1. A pre-filled PR page has been created"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime220.jsxDEV(ThemedText, {
          children: "2. Install the Claude GitHub App if you haven't already"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime220.jsxDEV(ThemedText, {
          children: "3. Merge the PR to enable Claude PR assistance"
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[11] = skipWorkflow, $3[12] = t7;
  else
    t7 = $3[12];
  let t8;
  if ($3[13] !== t3 || $3[14] !== t4 || $3[15] !== t5 || $3[16] !== t7)
    t8 = /* @__PURE__ */ jsx_dev_runtime220.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      borderStyle: "round",
      paddingX: 1,
      children: [
        t2,
        t3,
        t4,
        t5,
        t6,
        t7
      ]
    }, void 0, !0, void 0, this), $3[13] = t3, $3[14] = t4, $3[15] = t5, $3[16] = t7, $3[17] = t8;
  else
    t8 = $3[17];
  let t9;
  if ($3[18] === Symbol.for("react.memo_cache_sentinel"))
    t9 = /* @__PURE__ */ jsx_dev_runtime220.jsxDEV(ThemedBox_default, {
      marginLeft: 3,
      children: /* @__PURE__ */ jsx_dev_runtime220.jsxDEV(ThemedText, {
        dimColor: !0,
        children: "Press any key to exit"
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[18] = t9;
  else
    t9 = $3[18];
  let t10;
  if ($3[19] !== t8)
    t10 = /* @__PURE__ */ jsx_dev_runtime220.jsxDEV(jsx_dev_runtime220.Fragment, {
      children: [
        t8,
        t9
      ]
    }, void 0, !0, void 0, this), $3[19] = t8, $3[20] = t10;
  else
    t10 = $3[20];
  return t10;
}
var import_compiler_runtime177, jsx_dev_runtime220;
var init_SuccessStep = __esm(() => {
  init_ink2();
  import_compiler_runtime177 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime220 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
