// Original: src/components/messages/AssistantRedactedThinkingMessage.tsx
function AssistantRedactedThinkingMessage(t0) {
  let $3 = import_compiler_runtime42.c(3), {
    addMargin: t1
  } = t0, t2 = (t1 === void 0 ? !1 : t1) ? 1 : 0, t3;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t3 = /* @__PURE__ */ jsx_dev_runtime48.jsxDEV(ThemedText, {
      dimColor: !0,
      italic: !0,
      children: "\u273B Thinking\u2026"
    }, void 0, !1, void 0, this), $3[0] = t3;
  else
    t3 = $3[0];
  let t4;
  if ($3[1] !== t2)
    t4 = /* @__PURE__ */ jsx_dev_runtime48.jsxDEV(ThemedBox_default, {
      marginTop: t2,
      children: t3
    }, void 0, !1, void 0, this), $3[1] = t2, $3[2] = t4;
  else
    t4 = $3[2];
  return t4;
}
var import_compiler_runtime42, jsx_dev_runtime48;
var init_AssistantRedactedThinkingMessage = __esm(() => {
  init_ink2();
  import_compiler_runtime42 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime48 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
