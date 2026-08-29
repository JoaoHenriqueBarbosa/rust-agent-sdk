// Original: src/components/PromptInput/HistorySearchInput.tsx
function HistorySearchInput(t0) {
  let $3 = import_compiler_runtime330.c(9), {
    value,
    onChange,
    historyFailedMatch
  } = t0, t1 = historyFailedMatch ? "no matching prompt:" : "search prompts:", t2;
  if ($3[0] !== t1)
    t2 = /* @__PURE__ */ jsx_dev_runtime427.jsxDEV(ThemedText, {
      dimColor: !0,
      children: t1
    }, void 0, !1, void 0, this), $3[0] = t1, $3[1] = t2;
  else
    t2 = $3[1];
  let t3 = stringWidth(value) + 1, t4;
  if ($3[2] !== onChange || $3[3] !== t3 || $3[4] !== value)
    t4 = /* @__PURE__ */ jsx_dev_runtime427.jsxDEV(TextInput, {
      value,
      onChange,
      cursorOffset: value.length,
      onChangeCursorOffset: _temp200,
      columns: t3,
      focus: !0,
      showCursor: !0,
      multiline: !1,
      dimColor: !0
    }, void 0, !1, void 0, this), $3[2] = onChange, $3[3] = t3, $3[4] = value, $3[5] = t4;
  else
    t4 = $3[5];
  let t5;
  if ($3[6] !== t2 || $3[7] !== t4)
    t5 = /* @__PURE__ */ jsx_dev_runtime427.jsxDEV(ThemedBox_default, {
      gap: 1,
      children: [
        t2,
        t4
      ]
    }, void 0, !0, void 0, this), $3[6] = t2, $3[7] = t4, $3[8] = t5;
  else
    t5 = $3[8];
  return t5;
}
function _temp200() {}
var import_compiler_runtime330, jsx_dev_runtime427, HistorySearchInput_default;
var init_HistorySearchInput = __esm(() => {
  init_stringWidth();
  init_ink2();
  init_TextInput();
  import_compiler_runtime330 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime427 = __toESM(require_react_jsx_dev_runtime_development(), 1);
  HistorySearchInput_default = HistorySearchInput;
});
