// Original: src/components/LanguagePicker.tsx
function LanguagePicker(t0) {
  let $3 = import_compiler_runtime140.c(13), {
    initialLanguage,
    onComplete,
    onCancel
  } = t0, [language, setLanguage] = import_react102.useState(initialLanguage), [cursorOffset, setCursorOffset] = import_react102.useState((initialLanguage ?? "").length), t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = {
      context: "Settings"
    }, $3[0] = t1;
  else
    t1 = $3[0];
  useKeybinding("confirm:no", onCancel, t1);
  let t2;
  if ($3[1] !== language || $3[2] !== onComplete)
    t2 = function() {
      let trimmed = language?.trim();
      onComplete(trimmed || void 0);
    }, $3[1] = language, $3[2] = onComplete, $3[3] = t2;
  else
    t2 = $3[3];
  let handleSubmit = t2, t3;
  if ($3[4] === Symbol.for("react.memo_cache_sentinel"))
    t3 = /* @__PURE__ */ jsx_dev_runtime177.jsxDEV(ThemedText, {
      children: "Enter your preferred response and voice language:"
    }, void 0, !1, void 0, this), $3[4] = t3;
  else
    t3 = $3[4];
  let t4;
  if ($3[5] === Symbol.for("react.memo_cache_sentinel"))
    t4 = /* @__PURE__ */ jsx_dev_runtime177.jsxDEV(ThemedText, {
      children: figures_default.pointer
    }, void 0, !1, void 0, this), $3[5] = t4;
  else
    t4 = $3[5];
  let t5 = language ?? "", t6;
  if ($3[6] !== cursorOffset || $3[7] !== handleSubmit || $3[8] !== t5)
    t6 = /* @__PURE__ */ jsx_dev_runtime177.jsxDEV(ThemedBox_default, {
      flexDirection: "row",
      gap: 1,
      children: [
        t4,
        /* @__PURE__ */ jsx_dev_runtime177.jsxDEV(TextInput, {
          value: t5,
          onChange: setLanguage,
          onSubmit: handleSubmit,
          focus: !0,
          showCursor: !0,
          placeholder: `e.g., Japanese, \u65E5\u672C\u8A9E, Espa\xF1ol${figures_default.ellipsis}`,
          columns: 60,
          cursorOffset,
          onChangeCursorOffset: setCursorOffset
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[6] = cursorOffset, $3[7] = handleSubmit, $3[8] = t5, $3[9] = t6;
  else
    t6 = $3[9];
  let t7;
  if ($3[10] === Symbol.for("react.memo_cache_sentinel"))
    t7 = /* @__PURE__ */ jsx_dev_runtime177.jsxDEV(ThemedText, {
      dimColor: !0,
      children: "Leave empty for default (English)"
    }, void 0, !1, void 0, this), $3[10] = t7;
  else
    t7 = $3[10];
  let t8;
  if ($3[11] !== t6)
    t8 = /* @__PURE__ */ jsx_dev_runtime177.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      gap: 1,
      children: [
        t3,
        t6,
        t7
      ]
    }, void 0, !0, void 0, this), $3[11] = t6, $3[12] = t8;
  else
    t8 = $3[12];
  return t8;
}
var import_compiler_runtime140, import_react102, jsx_dev_runtime177;
var init_LanguagePicker = __esm(() => {
  init_figures();
  init_ink2();
  init_useKeybinding();
  init_TextInput();
  import_compiler_runtime140 = __toESM(require_react_compiler_runtime_development(), 1), import_react102 = __toESM(require_react_development(), 1), jsx_dev_runtime177 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
