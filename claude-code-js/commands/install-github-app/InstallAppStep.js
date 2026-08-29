// Original: src/commands/install-github-app/InstallAppStep.tsx
function InstallAppStep(t0) {
  let $3 = import_compiler_runtime176.c(12), {
    repoUrl,
    onSubmit
  } = t0, t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = {
      context: "Confirmation"
    }, $3[0] = t1;
  else
    t1 = $3[0];
  useKeybinding("confirm:yes", onSubmit, t1);
  let t2;
  if ($3[1] === Symbol.for("react.memo_cache_sentinel"))
    t2 = /* @__PURE__ */ jsx_dev_runtime218.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginBottom: 1,
      children: /* @__PURE__ */ jsx_dev_runtime218.jsxDEV(ThemedText, {
        bold: !0,
        children: "Install the Claude GitHub App"
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[1] = t2;
  else
    t2 = $3[1];
  let t3;
  if ($3[2] === Symbol.for("react.memo_cache_sentinel"))
    t3 = /* @__PURE__ */ jsx_dev_runtime218.jsxDEV(ThemedBox_default, {
      marginBottom: 1,
      children: /* @__PURE__ */ jsx_dev_runtime218.jsxDEV(ThemedText, {
        children: "Opening browser to install the Claude GitHub App\u2026"
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[2] = t3;
  else
    t3 = $3[2];
  let t4;
  if ($3[3] === Symbol.for("react.memo_cache_sentinel"))
    t4 = /* @__PURE__ */ jsx_dev_runtime218.jsxDEV(ThemedBox_default, {
      marginBottom: 1,
      children: /* @__PURE__ */ jsx_dev_runtime218.jsxDEV(ThemedText, {
        children: "If your browser doesn't open automatically, visit:"
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[3] = t4;
  else
    t4 = $3[3];
  let t5;
  if ($3[4] === Symbol.for("react.memo_cache_sentinel"))
    t5 = /* @__PURE__ */ jsx_dev_runtime218.jsxDEV(ThemedBox_default, {
      marginBottom: 1,
      children: /* @__PURE__ */ jsx_dev_runtime218.jsxDEV(ThemedText, {
        underline: !0,
        children: "https://github.com/apps/claude"
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[4] = t5;
  else
    t5 = $3[4];
  let t6;
  if ($3[5] !== repoUrl)
    t6 = /* @__PURE__ */ jsx_dev_runtime218.jsxDEV(ThemedBox_default, {
      marginBottom: 1,
      children: /* @__PURE__ */ jsx_dev_runtime218.jsxDEV(ThemedText, {
        children: [
          "Please install the app for repository: ",
          /* @__PURE__ */ jsx_dev_runtime218.jsxDEV(ThemedText, {
            bold: !0,
            children: repoUrl
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[5] = repoUrl, $3[6] = t6;
  else
    t6 = $3[6];
  let t7;
  if ($3[7] === Symbol.for("react.memo_cache_sentinel"))
    t7 = /* @__PURE__ */ jsx_dev_runtime218.jsxDEV(ThemedBox_default, {
      marginBottom: 1,
      children: /* @__PURE__ */ jsx_dev_runtime218.jsxDEV(ThemedText, {
        dimColor: !0,
        children: "Important: Make sure to grant access to this specific repository"
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[7] = t7;
  else
    t7 = $3[7];
  let t8;
  if ($3[8] === Symbol.for("react.memo_cache_sentinel"))
    t8 = /* @__PURE__ */ jsx_dev_runtime218.jsxDEV(ThemedBox_default, {
      children: /* @__PURE__ */ jsx_dev_runtime218.jsxDEV(ThemedText, {
        bold: !0,
        color: "permission",
        children: [
          "Press Enter once you've installed the app",
          figures_default.ellipsis
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[8] = t8;
  else
    t8 = $3[8];
  let t9;
  if ($3[9] === Symbol.for("react.memo_cache_sentinel"))
    t9 = /* @__PURE__ */ jsx_dev_runtime218.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      children: /* @__PURE__ */ jsx_dev_runtime218.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          "Having trouble? See manual setup instructions at:",
          " ",
          /* @__PURE__ */ jsx_dev_runtime218.jsxDEV(ThemedText, {
            color: "claude",
            children: GITHUB_ACTION_SETUP_DOCS_URL
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[9] = t9;
  else
    t9 = $3[9];
  let t10;
  if ($3[10] !== t6)
    t10 = /* @__PURE__ */ jsx_dev_runtime218.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      borderStyle: "round",
      borderDimColor: !0,
      paddingX: 1,
      children: [
        t2,
        t3,
        t4,
        t5,
        t6,
        t7,
        t8,
        t9
      ]
    }, void 0, !0, void 0, this), $3[10] = t6, $3[11] = t10;
  else
    t10 = $3[11];
  return t10;
}
var import_compiler_runtime176, jsx_dev_runtime218;
var init_InstallAppStep = __esm(() => {
  init_figures();
  init_ink2();
  init_useKeybinding();
  import_compiler_runtime176 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime218 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
