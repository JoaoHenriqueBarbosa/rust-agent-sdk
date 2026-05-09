// Original: src/utils/autoRunIssue.tsx
function AutoRunIssueNotification(t0) {
  let $3 = import_compiler_runtime357.c(8), {
    onRun,
    onCancel,
    reason
  } = t0, hasRunRef = import_react296.useRef(!1), t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = {
      context: "Confirmation"
    }, $3[0] = t1;
  else
    t1 = $3[0];
  useKeybinding("confirm:no", onCancel, t1);
  let t2, t3;
  if ($3[1] !== onRun)
    t2 = () => {
      if (!hasRunRef.current)
        hasRunRef.current = !0, onRun();
    }, t3 = [onRun], $3[1] = onRun, $3[2] = t2, $3[3] = t3;
  else
    t2 = $3[2], t3 = $3[3];
  import_react296.useEffect(t2, t3);
  let t4;
  if ($3[4] === Symbol.for("react.memo_cache_sentinel"))
    t4 = /* @__PURE__ */ jsx_dev_runtime455.jsxDEV(ThemedBox_default, {
      children: /* @__PURE__ */ jsx_dev_runtime455.jsxDEV(ThemedText, {
        bold: !0,
        children: "Running feedback capture..."
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[4] = t4;
  else
    t4 = $3[4];
  let t5;
  if ($3[5] === Symbol.for("react.memo_cache_sentinel"))
    t5 = /* @__PURE__ */ jsx_dev_runtime455.jsxDEV(ThemedBox_default, {
      children: /* @__PURE__ */ jsx_dev_runtime455.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          "Press ",
          /* @__PURE__ */ jsx_dev_runtime455.jsxDEV(KeyboardShortcutHint, {
            shortcut: "Esc",
            action: "cancel"
          }, void 0, !1, void 0, this),
          " anytime"
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[5] = t5;
  else
    t5 = $3[5];
  let t6;
  if ($3[6] !== reason)
    t6 = /* @__PURE__ */ jsx_dev_runtime455.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginTop: 1,
      children: [
        t4,
        t5,
        /* @__PURE__ */ jsx_dev_runtime455.jsxDEV(ThemedBox_default, {
          children: /* @__PURE__ */ jsx_dev_runtime455.jsxDEV(ThemedText, {
            dimColor: !0,
            children: [
              "Reason: ",
              reason
            ]
          }, void 0, !0, void 0, this)
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[6] = reason, $3[7] = t6;
  else
    t6 = $3[7];
  return t6;
}
function getAutoRunCommand(reason) {
  return "/issue";
}
function getAutoRunIssueReasonText(reason) {
  switch (reason) {
    case "feedback_survey_bad":
      return 'You responded "Bad" to the feedback survey';
    case "feedback_survey_good":
      return 'You responded "Good" to the feedback survey';
    default:
      return "Unknown reason";
  }
}
var import_compiler_runtime357, import_react296, jsx_dev_runtime455;
var init_autoRunIssue = __esm(() => {
  init_KeyboardShortcutHint();
  init_ink2();
  init_useKeybinding();
  import_compiler_runtime357 = __toESM(require_react_compiler_runtime_development(), 1), import_react296 = __toESM(require_react_development(), 1), jsx_dev_runtime455 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
