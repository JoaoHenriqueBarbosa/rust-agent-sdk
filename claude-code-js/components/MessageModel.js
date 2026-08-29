// Original: src/components/MessageModel.tsx
function MessageModel(t0) {
  let $3 = import_compiler_runtime206.c(5), {
    message,
    isTranscriptMode
  } = t0;
  if (!(isTranscriptMode && message.type === "assistant" && message.message.model && message.message.content.some(_temp124)))
    return null;
  let t1 = stringWidth(message.message.model) + 8, t2;
  if ($3[0] !== message.message.model)
    t2 = /* @__PURE__ */ jsx_dev_runtime260.jsxDEV(ThemedText, {
      dimColor: !0,
      children: message.message.model
    }, void 0, !1, void 0, this), $3[0] = message.message.model, $3[1] = t2;
  else
    t2 = $3[1];
  let t3;
  if ($3[2] !== t1 || $3[3] !== t2)
    t3 = /* @__PURE__ */ jsx_dev_runtime260.jsxDEV(ThemedBox_default, {
      minWidth: t1,
      children: t2
    }, void 0, !1, void 0, this), $3[2] = t1, $3[3] = t2, $3[4] = t3;
  else
    t3 = $3[4];
  return t3;
}
function _temp124(c3) {
  return c3.type === "text";
}
var import_compiler_runtime206, jsx_dev_runtime260;
var init_MessageModel = __esm(() => {
  init_stringWidth();
  init_ink2();
  import_compiler_runtime206 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime260 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
