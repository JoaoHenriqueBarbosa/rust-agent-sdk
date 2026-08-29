// Original: src/commands/install-github-app/ExistingWorkflowStep.tsx
function ExistingWorkflowStep(t0) {
  let $3 = import_compiler_runtime175.c(16), {
    repoName,
    onSelectAction
  } = t0, t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = [{
      label: "Update workflow file with latest version",
      value: "update"
    }, {
      label: "Skip workflow update (configure secrets only)",
      value: "skip"
    }, {
      label: "Exit without making changes",
      value: "exit"
    }], $3[0] = t1;
  else
    t1 = $3[0];
  let options2 = t1, t2;
  if ($3[1] !== onSelectAction)
    t2 = (value) => {
      onSelectAction(value);
    }, $3[1] = onSelectAction, $3[2] = t2;
  else
    t2 = $3[2];
  let handleSelect = t2, t3;
  if ($3[3] !== onSelectAction)
    t3 = () => {
      onSelectAction("exit");
    }, $3[3] = onSelectAction, $3[4] = t3;
  else
    t3 = $3[4];
  let handleCancel = t3, t4;
  if ($3[5] === Symbol.for("react.memo_cache_sentinel"))
    t4 = /* @__PURE__ */ jsx_dev_runtime217.jsxDEV(ThemedText, {
      bold: !0,
      children: "Existing Workflow Found"
    }, void 0, !1, void 0, this), $3[5] = t4;
  else
    t4 = $3[5];
  let t5;
  if ($3[6] !== repoName)
    t5 = /* @__PURE__ */ jsx_dev_runtime217.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginBottom: 1,
      children: [
        t4,
        /* @__PURE__ */ jsx_dev_runtime217.jsxDEV(ThemedText, {
          dimColor: !0,
          children: [
            "Repository: ",
            repoName
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[6] = repoName, $3[7] = t5;
  else
    t5 = $3[7];
  let t6;
  if ($3[8] === Symbol.for("react.memo_cache_sentinel"))
    t6 = /* @__PURE__ */ jsx_dev_runtime217.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginBottom: 1,
      children: [
        /* @__PURE__ */ jsx_dev_runtime217.jsxDEV(ThemedText, {
          children: [
            "A Claude workflow file already exists at",
            " ",
            /* @__PURE__ */ jsx_dev_runtime217.jsxDEV(ThemedText, {
              color: "claude",
              children: ".github/workflows/claude.yml"
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime217.jsxDEV(ThemedText, {
          dimColor: !0,
          children: "What would you like to do?"
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[8] = t6;
  else
    t6 = $3[8];
  let t7;
  if ($3[9] !== handleCancel || $3[10] !== handleSelect)
    t7 = /* @__PURE__ */ jsx_dev_runtime217.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: /* @__PURE__ */ jsx_dev_runtime217.jsxDEV(Select, {
        options: options2,
        onChange: handleSelect,
        onCancel: handleCancel
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[9] = handleCancel, $3[10] = handleSelect, $3[11] = t7;
  else
    t7 = $3[11];
  let t8;
  if ($3[12] === Symbol.for("react.memo_cache_sentinel"))
    t8 = /* @__PURE__ */ jsx_dev_runtime217.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      children: /* @__PURE__ */ jsx_dev_runtime217.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          "View the latest workflow template at:",
          " ",
          /* @__PURE__ */ jsx_dev_runtime217.jsxDEV(ThemedText, {
            color: "claude",
            children: "https://github.com/anthropics/claude-code-action/blob/main/examples/claude.yml"
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[12] = t8;
  else
    t8 = $3[12];
  let t9;
  if ($3[13] !== t5 || $3[14] !== t7)
    t9 = /* @__PURE__ */ jsx_dev_runtime217.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      borderStyle: "round",
      borderDimColor: !0,
      paddingX: 1,
      children: [
        t5,
        t6,
        t7,
        t8
      ]
    }, void 0, !0, void 0, this), $3[13] = t5, $3[14] = t7, $3[15] = t9;
  else
    t9 = $3[15];
  return t9;
}
var import_compiler_runtime175, jsx_dev_runtime217;
var init_ExistingWorkflowStep = __esm(() => {
  init_CustomSelect();
  init_ink2();
  import_compiler_runtime175 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime217 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
