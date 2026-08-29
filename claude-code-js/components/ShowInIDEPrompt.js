// Original: src/components/ShowInIDEPrompt.tsx
import { basename as basename45, relative as relative28 } from "path";
function ShowInIDEPrompt(t0) {
  let $3 = import_compiler_runtime297.c(36), {
    onChange,
    options: options2,
    input,
    filePath,
    ideName,
    symlinkTarget,
    rejectFeedback,
    acceptFeedback,
    setFocusedOption,
    onInputModeToggle,
    focusedOption,
    yesInputMode,
    noInputMode
  } = t0, t1;
  if ($3[0] !== ideName)
    t1 = /* @__PURE__ */ jsx_dev_runtime381.jsxDEV(ThemedText, {
      bold: !0,
      color: "permission",
      children: [
        "Opened changes in ",
        ideName,
        " \u29C9"
      ]
    }, void 0, !0, void 0, this), $3[0] = ideName, $3[1] = t1;
  else
    t1 = $3[1];
  let t2;
  if ($3[2] !== symlinkTarget)
    t2 = symlinkTarget && /* @__PURE__ */ jsx_dev_runtime381.jsxDEV(ThemedText, {
      color: "warning",
      children: relative28(getCwd(), symlinkTarget).startsWith("..") ? `This will modify ${symlinkTarget} (outside working directory) via a symlink` : `Symlink target: ${symlinkTarget}`
    }, void 0, !1, void 0, this), $3[2] = symlinkTarget, $3[3] = t2;
  else
    t2 = $3[3];
  let t3;
  if ($3[4] === Symbol.for("react.memo_cache_sentinel"))
    t3 = isSupportedVSCodeTerminal() && /* @__PURE__ */ jsx_dev_runtime381.jsxDEV(ThemedText, {
      dimColor: !0,
      children: "Save file to continue\u2026"
    }, void 0, !1, void 0, this), $3[4] = t3;
  else
    t3 = $3[4];
  let t4;
  if ($3[5] !== filePath)
    t4 = basename45(filePath), $3[5] = filePath, $3[6] = t4;
  else
    t4 = $3[6];
  let t5;
  if ($3[7] !== t4)
    t5 = /* @__PURE__ */ jsx_dev_runtime381.jsxDEV(ThemedText, {
      children: [
        "Do you want to make this edit to",
        " ",
        /* @__PURE__ */ jsx_dev_runtime381.jsxDEV(ThemedText, {
          bold: !0,
          children: t4
        }, void 0, !1, void 0, this),
        "?"
      ]
    }, void 0, !0, void 0, this), $3[7] = t4, $3[8] = t5;
  else
    t5 = $3[8];
  let t6;
  if ($3[9] !== acceptFeedback || $3[10] !== input || $3[11] !== onChange || $3[12] !== options2 || $3[13] !== rejectFeedback)
    t6 = (value) => {
      let selected = options2.find((opt) => opt.value === value);
      if (selected) {
        if (selected.option.type === "reject") {
          let trimmedFeedback = rejectFeedback.trim();
          onChange(selected.option, input, trimmedFeedback || void 0);
          return;
        }
        if (selected.option.type === "accept-once") {
          let trimmedFeedback_0 = acceptFeedback.trim();
          onChange(selected.option, input, trimmedFeedback_0 || void 0);
          return;
        }
        onChange(selected.option, input);
      }
    }, $3[9] = acceptFeedback, $3[10] = input, $3[11] = onChange, $3[12] = options2, $3[13] = rejectFeedback, $3[14] = t6;
  else
    t6 = $3[14];
  let t7;
  if ($3[15] !== input || $3[16] !== onChange)
    t7 = () => onChange({
      type: "reject"
    }, input), $3[15] = input, $3[16] = onChange, $3[17] = t7;
  else
    t7 = $3[17];
  let t8;
  if ($3[18] !== setFocusedOption)
    t8 = (value_0) => setFocusedOption(value_0), $3[18] = setFocusedOption, $3[19] = t8;
  else
    t8 = $3[19];
  let t9;
  if ($3[20] !== onInputModeToggle || $3[21] !== options2 || $3[22] !== t6 || $3[23] !== t7 || $3[24] !== t8)
    t9 = /* @__PURE__ */ jsx_dev_runtime381.jsxDEV(Select, {
      options: options2,
      inlineDescriptions: !0,
      onChange: t6,
      onCancel: t7,
      onFocus: t8,
      onInputModeToggle
    }, void 0, !1, void 0, this), $3[20] = onInputModeToggle, $3[21] = options2, $3[22] = t6, $3[23] = t7, $3[24] = t8, $3[25] = t9;
  else
    t9 = $3[25];
  let t10;
  if ($3[26] !== t5 || $3[27] !== t9)
    t10 = /* @__PURE__ */ jsx_dev_runtime381.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        t5,
        t9
      ]
    }, void 0, !0, void 0, this), $3[26] = t5, $3[27] = t9, $3[28] = t10;
  else
    t10 = $3[28];
  let t11 = (focusedOption === "yes" && !yesInputMode || focusedOption === "no" && !noInputMode) && " \xB7 Tab to amend", t12;
  if ($3[29] !== t11)
    t12 = /* @__PURE__ */ jsx_dev_runtime381.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      children: /* @__PURE__ */ jsx_dev_runtime381.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          "Esc to cancel",
          t11
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[29] = t11, $3[30] = t12;
  else
    t12 = $3[30];
  let t13;
  if ($3[31] !== t1 || $3[32] !== t10 || $3[33] !== t12 || $3[34] !== t2)
    t13 = /* @__PURE__ */ jsx_dev_runtime381.jsxDEV(Pane, {
      color: "permission",
      children: /* @__PURE__ */ jsx_dev_runtime381.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        gap: 1,
        children: [
          t1,
          t2,
          t3,
          t10,
          t12
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[31] = t1, $3[32] = t10, $3[33] = t12, $3[34] = t2, $3[35] = t13;
  else
    t13 = $3[35];
  return t13;
}
var import_compiler_runtime297, jsx_dev_runtime381;
var init_ShowInIDEPrompt = __esm(() => {
  init_ink2();
  init_cwd2();
  init_ide();
  init_CustomSelect();
  init_Pane();
  import_compiler_runtime297 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime381 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
