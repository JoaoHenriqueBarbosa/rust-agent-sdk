// Original: src/components/IdleReturnDialog.tsx
function IdleReturnDialog(t0) {
  let $3 = import_compiler_runtime284.c(16), {
    idleMinutes,
    totalInputTokens,
    onDone
  } = t0, t1;
  if ($3[0] !== idleMinutes)
    t1 = formatIdleDuration(idleMinutes), $3[0] = idleMinutes, $3[1] = t1;
  else
    t1 = $3[1];
  let formattedIdle = t1, t2;
  if ($3[2] !== totalInputTokens)
    t2 = formatTokens(totalInputTokens), $3[2] = totalInputTokens, $3[3] = t2;
  else
    t2 = $3[3];
  let t3 = `You've been away ${formattedIdle} and this conversation is ${t2} tokens.`, t4;
  if ($3[4] !== onDone)
    t4 = () => onDone("dismiss"), $3[4] = onDone, $3[5] = t4;
  else
    t4 = $3[5];
  let t5;
  if ($3[6] === Symbol.for("react.memo_cache_sentinel"))
    t5 = /* @__PURE__ */ jsx_dev_runtime367.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: /* @__PURE__ */ jsx_dev_runtime367.jsxDEV(ThemedText, {
        children: "If this is a new task, clearing context will save usage and be faster."
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[6] = t5;
  else
    t5 = $3[6];
  let t6;
  if ($3[7] === Symbol.for("react.memo_cache_sentinel"))
    t6 = {
      value: "continue",
      label: "Continue this conversation"
    }, $3[7] = t6;
  else
    t6 = $3[7];
  let t7;
  if ($3[8] === Symbol.for("react.memo_cache_sentinel"))
    t7 = {
      value: "clear",
      label: "Send message as a new conversation"
    }, $3[8] = t7;
  else
    t7 = $3[8];
  let t8;
  if ($3[9] === Symbol.for("react.memo_cache_sentinel"))
    t8 = [t6, t7, {
      value: "never",
      label: "Don't ask me again"
    }], $3[9] = t8;
  else
    t8 = $3[9];
  let t9;
  if ($3[10] !== onDone)
    t9 = /* @__PURE__ */ jsx_dev_runtime367.jsxDEV(Select, {
      options: t8,
      onChange: (value) => onDone(value)
    }, void 0, !1, void 0, this), $3[10] = onDone, $3[11] = t9;
  else
    t9 = $3[11];
  let t10;
  if ($3[12] !== t3 || $3[13] !== t4 || $3[14] !== t9)
    t10 = /* @__PURE__ */ jsx_dev_runtime367.jsxDEV(Dialog, {
      title: t3,
      onCancel: t4,
      children: [
        t5,
        t9
      ]
    }, void 0, !0, void 0, this), $3[12] = t3, $3[13] = t4, $3[14] = t9, $3[15] = t10;
  else
    t10 = $3[15];
  return t10;
}
function formatIdleDuration(minutes) {
  if (minutes < 1)
    return "< 1m";
  if (minutes < 60)
    return `${Math.floor(minutes)}m`;
  let hours = Math.floor(minutes / 60), remainingMinutes = Math.floor(minutes % 60);
  if (remainingMinutes === 0)
    return `${hours}h`;
  return `${hours}h ${remainingMinutes}m`;
}
var import_compiler_runtime284, jsx_dev_runtime367;
var init_IdleReturnDialog = __esm(() => {
  init_ink2();
  init_format();
  init_CustomSelect();
  init_Dialog();
  import_compiler_runtime284 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime367 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
