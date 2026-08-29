// Original: src/components/InvalidSettingsDialog.tsx
var exports_InvalidSettingsDialog = {};
__export(exports_InvalidSettingsDialog, {
  InvalidSettingsDialog: () => InvalidSettingsDialog
});
function InvalidSettingsDialog(t0) {
  let $3 = import_compiler_runtime373.c(13), {
    settingsErrors,
    onContinue,
    onExit: onExit2
  } = t0, t1;
  if ($3[0] !== onContinue || $3[1] !== onExit2)
    t1 = function(value) {
      if (value === "exit")
        onExit2();
      else
        onContinue();
    }, $3[0] = onContinue, $3[1] = onExit2, $3[2] = t1;
  else
    t1 = $3[2];
  let handleSelect = t1, t2;
  if ($3[3] !== settingsErrors)
    t2 = /* @__PURE__ */ jsx_dev_runtime474.jsxDEV(ValidationErrorsList, {
      errors: settingsErrors
    }, void 0, !1, void 0, this), $3[3] = settingsErrors, $3[4] = t2;
  else
    t2 = $3[4];
  let t3;
  if ($3[5] === Symbol.for("react.memo_cache_sentinel"))
    t3 = /* @__PURE__ */ jsx_dev_runtime474.jsxDEV(ThemedText, {
      dimColor: !0,
      children: "Files with errors are skipped entirely, not just the invalid settings."
    }, void 0, !1, void 0, this), $3[5] = t3;
  else
    t3 = $3[5];
  let t4;
  if ($3[6] === Symbol.for("react.memo_cache_sentinel"))
    t4 = [{
      label: "Exit and fix manually",
      value: "exit"
    }, {
      label: "Continue without these settings",
      value: "continue"
    }], $3[6] = t4;
  else
    t4 = $3[6];
  let t5;
  if ($3[7] !== handleSelect)
    t5 = /* @__PURE__ */ jsx_dev_runtime474.jsxDEV(Select, {
      options: t4,
      onChange: handleSelect
    }, void 0, !1, void 0, this), $3[7] = handleSelect, $3[8] = t5;
  else
    t5 = $3[8];
  let t6;
  if ($3[9] !== onExit2 || $3[10] !== t2 || $3[11] !== t5)
    t6 = /* @__PURE__ */ jsx_dev_runtime474.jsxDEV(Dialog, {
      title: "Settings Error",
      onCancel: onExit2,
      color: "warning",
      children: [
        t2,
        t3,
        t5
      ]
    }, void 0, !0, void 0, this), $3[9] = onExit2, $3[10] = t2, $3[11] = t5, $3[12] = t6;
  else
    t6 = $3[12];
  return t6;
}
var import_compiler_runtime373, jsx_dev_runtime474;
var init_InvalidSettingsDialog = __esm(() => {
  init_ink2();
  init_CustomSelect();
  init_Dialog();
  init_ValidationErrorsList();
  import_compiler_runtime373 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime474 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
