// Original: src/components/WorkflowMultiselectDialog.tsx
function renderInputGuide(exitState) {
  if (exitState.pending)
    return /* @__PURE__ */ jsx_dev_runtime210.jsxDEV(ThemedText, {
      children: [
        "Press ",
        exitState.keyName,
        " again to exit"
      ]
    }, void 0, !0, void 0, this);
  return /* @__PURE__ */ jsx_dev_runtime210.jsxDEV(Byline, {
    children: [
      /* @__PURE__ */ jsx_dev_runtime210.jsxDEV(KeyboardShortcutHint, {
        shortcut: "\u2191\u2193",
        action: "navigate"
      }, void 0, !1, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime210.jsxDEV(KeyboardShortcutHint, {
        shortcut: "Space",
        action: "toggle"
      }, void 0, !1, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime210.jsxDEV(KeyboardShortcutHint, {
        shortcut: "Enter",
        action: "confirm"
      }, void 0, !1, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime210.jsxDEV(ConfigurableShortcutHint, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "cancel"
      }, void 0, !1, void 0, this)
    ]
  }, void 0, !0, void 0, this);
}
function WorkflowMultiselectDialog(t0) {
  let $3 = import_compiler_runtime168.c(14), {
    onSubmit,
    defaultSelections
  } = t0, [showError, setShowError] = import_react116.useState(!1), t1;
  if ($3[0] !== onSubmit)
    t1 = (selectedValues) => {
      if (selectedValues.length === 0) {
        setShowError(!0);
        return;
      }
      setShowError(!1), onSubmit(selectedValues);
    }, $3[0] = onSubmit, $3[1] = t1;
  else
    t1 = $3[1];
  let handleSubmit = t1, t2;
  if ($3[2] === Symbol.for("react.memo_cache_sentinel"))
    t2 = () => {
      setShowError(!1);
    }, $3[2] = t2;
  else
    t2 = $3[2];
  let handleChange4 = t2, t3;
  if ($3[3] === Symbol.for("react.memo_cache_sentinel"))
    t3 = () => {
      setShowError(!0);
    }, $3[3] = t3;
  else
    t3 = $3[3];
  let handleCancel = t3, t4;
  if ($3[4] === Symbol.for("react.memo_cache_sentinel"))
    t4 = /* @__PURE__ */ jsx_dev_runtime210.jsxDEV(ThemedBox_default, {
      children: /* @__PURE__ */ jsx_dev_runtime210.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          "More workflow examples (issue triage, CI fixes, etc.) at:",
          " ",
          /* @__PURE__ */ jsx_dev_runtime210.jsxDEV(Link, {
            url: "https://github.com/anthropics/claude-code-action/blob/main/examples/",
            children: "https://github.com/anthropics/claude-code-action/blob/main/examples/"
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[4] = t4;
  else
    t4 = $3[4];
  let t5;
  if ($3[5] === Symbol.for("react.memo_cache_sentinel"))
    t5 = WORKFLOWS.map(_temp98), $3[5] = t5;
  else
    t5 = $3[5];
  let t6;
  if ($3[6] !== defaultSelections || $3[7] !== handleSubmit)
    t6 = /* @__PURE__ */ jsx_dev_runtime210.jsxDEV(SelectMulti, {
      options: t5,
      defaultValue: defaultSelections,
      onSubmit: handleSubmit,
      onChange: handleChange4,
      onCancel: handleCancel,
      hideIndexes: !0
    }, void 0, !1, void 0, this), $3[6] = defaultSelections, $3[7] = handleSubmit, $3[8] = t6;
  else
    t6 = $3[8];
  let t7;
  if ($3[9] !== showError)
    t7 = showError && /* @__PURE__ */ jsx_dev_runtime210.jsxDEV(ThemedBox_default, {
      children: /* @__PURE__ */ jsx_dev_runtime210.jsxDEV(ThemedText, {
        color: "error",
        children: "You must select at least one workflow to continue"
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[9] = showError, $3[10] = t7;
  else
    t7 = $3[10];
  let t8;
  if ($3[11] !== t6 || $3[12] !== t7)
    t8 = /* @__PURE__ */ jsx_dev_runtime210.jsxDEV(Dialog, {
      title: "Select GitHub workflows to install",
      subtitle: "We'll create a workflow file in your repository for each one you select.",
      onCancel: handleCancel,
      inputGuide: renderInputGuide,
      children: [
        t4,
        t6,
        t7
      ]
    }, void 0, !0, void 0, this), $3[11] = t6, $3[12] = t7, $3[13] = t8;
  else
    t8 = $3[13];
  return t8;
}
function _temp98(workflow) {
  return {
    label: workflow.label,
    value: workflow.value
  };
}
var import_compiler_runtime168, import_react116, jsx_dev_runtime210, WORKFLOWS;
var init_WorkflowMultiselectDialog = __esm(() => {
  init_ink2();
  init_ConfigurableShortcutHint();
  init_SelectMulti();
  init_Byline();
  init_Dialog();
  init_KeyboardShortcutHint();
  import_compiler_runtime168 = __toESM(require_react_compiler_runtime_development(), 1), import_react116 = __toESM(require_react_development(), 1), jsx_dev_runtime210 = __toESM(require_react_jsx_dev_runtime_development(), 1), WORKFLOWS = [{
    value: "claude",
    label: "@Claude Code - Tag @claude in issues and PR comments"
  }, {
    value: "claude-review",
    label: "Claude Code Review - Automated code review on new PRs"
  }];
});
