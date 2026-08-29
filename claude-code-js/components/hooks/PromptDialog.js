// Original: src/components/hooks/PromptDialog.tsx
function PromptDialog(t0) {
  let $3 = import_compiler_runtime313.c(15), {
    title,
    toolInputSummary,
    request: request2,
    onRespond,
    onAbort
  } = t0, t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = {
      isActive: !0
    }, $3[0] = t1;
  else
    t1 = $3[0];
  useKeybinding("app:interrupt", onAbort, t1);
  let t2;
  if ($3[1] !== request2.options)
    t2 = request2.options.map(_temp192), $3[1] = request2.options, $3[2] = t2;
  else
    t2 = $3[2];
  let options2 = t2, t3;
  if ($3[3] !== toolInputSummary)
    t3 = toolInputSummary ? /* @__PURE__ */ jsx_dev_runtime402.jsxDEV(ThemedText, {
      dimColor: !0,
      children: toolInputSummary
    }, void 0, !1, void 0, this) : void 0, $3[3] = toolInputSummary, $3[4] = t3;
  else
    t3 = $3[4];
  let t4;
  if ($3[5] !== onRespond)
    t4 = (value) => {
      onRespond(value);
    }, $3[5] = onRespond, $3[6] = t4;
  else
    t4 = $3[6];
  let t5;
  if ($3[7] !== options2 || $3[8] !== t4)
    t5 = /* @__PURE__ */ jsx_dev_runtime402.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      paddingY: 1,
      children: /* @__PURE__ */ jsx_dev_runtime402.jsxDEV(Select, {
        options: options2,
        onChange: t4
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[7] = options2, $3[8] = t4, $3[9] = t5;
  else
    t5 = $3[9];
  let t6;
  if ($3[10] !== request2.message || $3[11] !== t3 || $3[12] !== t5 || $3[13] !== title)
    t6 = /* @__PURE__ */ jsx_dev_runtime402.jsxDEV(PermissionDialog, {
      title,
      subtitle: request2.message,
      titleRight: t3,
      children: t5
    }, void 0, !1, void 0, this), $3[10] = request2.message, $3[11] = t3, $3[12] = t5, $3[13] = title, $3[14] = t6;
  else
    t6 = $3[14];
  return t6;
}
function _temp192(opt) {
  return {
    label: opt.label,
    value: opt.key,
    description: opt.description
  };
}
var import_compiler_runtime313, jsx_dev_runtime402;
var init_PromptDialog = __esm(() => {
  init_ink2();
  init_useKeybinding();
  init_select();
  init_PermissionDialog();
  import_compiler_runtime313 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime402 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
