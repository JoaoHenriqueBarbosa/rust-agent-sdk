// Original: src/components/messages/UserMemoryInputMessage.tsx
function getSavingMessage() {
  return sample_default(["Got it.", "Good to know.", "Noted."]);
}
function UserMemoryInputMessage(t0) {
  let $3 = import_compiler_runtime76.c(10), {
    text: text2,
    addMargin
  } = t0, t1;
  if ($3[0] !== text2)
    t1 = extractTag(text2, "user-memory-input"), $3[0] = text2, $3[1] = t1;
  else
    t1 = $3[1];
  let input = t1, t2;
  if ($3[2] === Symbol.for("react.memo_cache_sentinel"))
    t2 = getSavingMessage(), $3[2] = t2;
  else
    t2 = $3[2];
  let savingText = t2;
  if (!input)
    return null;
  let t3 = addMargin ? 1 : 0, t4;
  if ($3[3] === Symbol.for("react.memo_cache_sentinel"))
    t4 = /* @__PURE__ */ jsx_dev_runtime86.jsxDEV(ThemedText, {
      color: "remember",
      backgroundColor: "memoryBackgroundColor",
      children: "#"
    }, void 0, !1, void 0, this), $3[3] = t4;
  else
    t4 = $3[3];
  let t5;
  if ($3[4] !== input)
    t5 = /* @__PURE__ */ jsx_dev_runtime86.jsxDEV(ThemedBox_default, {
      children: [
        t4,
        /* @__PURE__ */ jsx_dev_runtime86.jsxDEV(ThemedText, {
          backgroundColor: "memoryBackgroundColor",
          color: "text",
          children: [
            " ",
            input,
            " "
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[4] = input, $3[5] = t5;
  else
    t5 = $3[5];
  let t6;
  if ($3[6] === Symbol.for("react.memo_cache_sentinel"))
    t6 = /* @__PURE__ */ jsx_dev_runtime86.jsxDEV(MessageResponse, {
      height: 1,
      children: /* @__PURE__ */ jsx_dev_runtime86.jsxDEV(ThemedText, {
        dimColor: !0,
        children: savingText
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[6] = t6;
  else
    t6 = $3[6];
  let t7;
  if ($3[7] !== t3 || $3[8] !== t5)
    t7 = /* @__PURE__ */ jsx_dev_runtime86.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginTop: t3,
      width: "100%",
      children: [
        t5,
        t6
      ]
    }, void 0, !0, void 0, this), $3[7] = t3, $3[8] = t5, $3[9] = t7;
  else
    t7 = $3[9];
  return t7;
}
var import_compiler_runtime76, jsx_dev_runtime86;
var init_UserMemoryInputMessage = __esm(() => {
  init_sample();
  init_ink2();
  init_messages3();
  init_MessageResponse();
  import_compiler_runtime76 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime86 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
