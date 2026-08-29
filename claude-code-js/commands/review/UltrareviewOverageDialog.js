// Original: src/commands/review/UltrareviewOverageDialog.tsx
function UltrareviewOverageDialog(t0) {
  let $3 = import_compiler_runtime218.c(15), {
    onProceed,
    onCancel
  } = t0, [isLaunching, setIsLaunching] = import_react160.useState(!1), t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = new AbortController, $3[0] = t1;
  else
    t1 = $3[0];
  let abortControllerRef = import_react160.useRef(t1), t2;
  if ($3[1] !== onCancel || $3[2] !== onProceed)
    t2 = (value) => {
      if (value === "proceed")
        setIsLaunching(!0), onProceed(abortControllerRef.current.signal).catch(() => setIsLaunching(!1));
      else
        onCancel();
    }, $3[1] = onCancel, $3[2] = onProceed, $3[3] = t2;
  else
    t2 = $3[3];
  let handleSelect = t2, t3;
  if ($3[4] !== onCancel)
    t3 = () => {
      abortControllerRef.current.abort(), onCancel();
    }, $3[4] = onCancel, $3[5] = t3;
  else
    t3 = $3[5];
  let handleCancel = t3, t4;
  if ($3[6] === Symbol.for("react.memo_cache_sentinel"))
    t4 = [{
      label: "Proceed with Extra Usage billing",
      value: "proceed"
    }, {
      label: "Cancel",
      value: "cancel"
    }], $3[6] = t4;
  else
    t4 = $3[6];
  let options2 = t4, t5;
  if ($3[7] === Symbol.for("react.memo_cache_sentinel"))
    t5 = /* @__PURE__ */ jsx_dev_runtime274.jsxDEV(ThemedText, {
      children: "Your free ultrareviews for this organization are used. Further reviews bill as Extra Usage (pay-per-use)."
    }, void 0, !1, void 0, this), $3[7] = t5;
  else
    t5 = $3[7];
  let t6;
  if ($3[8] !== handleCancel || $3[9] !== handleSelect || $3[10] !== isLaunching)
    t6 = /* @__PURE__ */ jsx_dev_runtime274.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      gap: 1,
      children: [
        t5,
        isLaunching ? /* @__PURE__ */ jsx_dev_runtime274.jsxDEV(ThemedText, {
          color: "background",
          children: "Launching\u2026"
        }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime274.jsxDEV(Select, {
          options: options2,
          onChange: handleSelect,
          onCancel: handleCancel
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[8] = handleCancel, $3[9] = handleSelect, $3[10] = isLaunching, $3[11] = t6;
  else
    t6 = $3[11];
  let t7;
  if ($3[12] !== handleCancel || $3[13] !== t6)
    t7 = /* @__PURE__ */ jsx_dev_runtime274.jsxDEV(Dialog, {
      title: "Ultrareview billing",
      onCancel: handleCancel,
      color: "background",
      children: t6
    }, void 0, !1, void 0, this), $3[12] = handleCancel, $3[13] = t6, $3[14] = t7;
  else
    t7 = $3[14];
  return t7;
}
var import_compiler_runtime218, import_react160, jsx_dev_runtime274;
var init_UltrareviewOverageDialog = __esm(() => {
  init_select();
  init_Dialog();
  init_ink2();
  import_compiler_runtime218 = __toESM(require_react_compiler_runtime_development(), 1), import_react160 = __toESM(require_react_development(), 1), jsx_dev_runtime274 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
