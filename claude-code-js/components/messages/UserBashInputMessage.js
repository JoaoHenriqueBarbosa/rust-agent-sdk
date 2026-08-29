// Original: src/components/messages/UserBashInputMessage.tsx
function UserBashInputMessage(t0) {
  let $3 = import_compiler_runtime70.c(8), {
    param: t1,
    addMargin
  } = t0, {
    text: text2
  } = t1, t2;
  if ($3[0] !== text2)
    t2 = extractTag(text2, "bash-input"), $3[0] = text2, $3[1] = t2;
  else
    t2 = $3[1];
  let input = t2;
  if (!input)
    return null;
  let t3 = addMargin ? 1 : 0, t4;
  if ($3[2] === Symbol.for("react.memo_cache_sentinel"))
    t4 = /* @__PURE__ */ jsx_dev_runtime80.jsxDEV(ThemedText, {
      color: "bashBorder",
      children: "! "
    }, void 0, !1, void 0, this), $3[2] = t4;
  else
    t4 = $3[2];
  let t5;
  if ($3[3] !== input)
    t5 = /* @__PURE__ */ jsx_dev_runtime80.jsxDEV(ThemedText, {
      color: "text",
      children: input
    }, void 0, !1, void 0, this), $3[3] = input, $3[4] = t5;
  else
    t5 = $3[4];
  let t6;
  if ($3[5] !== t3 || $3[6] !== t5)
    t6 = /* @__PURE__ */ jsx_dev_runtime80.jsxDEV(ThemedBox_default, {
      flexDirection: "row",
      marginTop: t3,
      backgroundColor: "bashMessageBackgroundColor",
      paddingRight: 1,
      children: [
        t4,
        t5
      ]
    }, void 0, !0, void 0, this), $3[5] = t3, $3[6] = t5, $3[7] = t6;
  else
    t6 = $3[7];
  return t6;
}
var import_compiler_runtime70, jsx_dev_runtime80;
var init_UserBashInputMessage = __esm(() => {
  init_ink2();
  init_messages3();
  import_compiler_runtime70 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime80 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
