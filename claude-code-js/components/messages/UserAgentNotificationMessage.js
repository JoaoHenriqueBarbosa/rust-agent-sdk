// Original: src/components/messages/UserAgentNotificationMessage.tsx
function getStatusColor(status) {
  switch (status) {
    case "completed":
      return "success";
    case "failed":
      return "error";
    case "killed":
      return "warning";
    default:
      return "text";
  }
}
function UserAgentNotificationMessage(t0) {
  let $3 = import_compiler_runtime69.c(12), {
    addMargin,
    param: t1
  } = t0, {
    text: text2
  } = t1, t2;
  if ($3[0] !== text2)
    t2 = extractTag(text2, "summary"), $3[0] = text2, $3[1] = t2;
  else
    t2 = $3[1];
  let summary = t2;
  if (!summary)
    return null;
  let t3;
  if ($3[2] !== text2) {
    let status = extractTag(text2, "status");
    t3 = getStatusColor(status), $3[2] = text2, $3[3] = t3;
  } else
    t3 = $3[3];
  let color2 = t3, t4 = addMargin ? 1 : 0, t5;
  if ($3[4] !== color2)
    t5 = /* @__PURE__ */ jsx_dev_runtime79.jsxDEV(ThemedText, {
      color: color2,
      children: BLACK_CIRCLE
    }, void 0, !1, void 0, this), $3[4] = color2, $3[5] = t5;
  else
    t5 = $3[5];
  let t6;
  if ($3[6] !== summary || $3[7] !== t5)
    t6 = /* @__PURE__ */ jsx_dev_runtime79.jsxDEV(ThemedText, {
      children: [
        t5,
        " ",
        summary
      ]
    }, void 0, !0, void 0, this), $3[6] = summary, $3[7] = t5, $3[8] = t6;
  else
    t6 = $3[8];
  let t7;
  if ($3[9] !== t4 || $3[10] !== t6)
    t7 = /* @__PURE__ */ jsx_dev_runtime79.jsxDEV(ThemedBox_default, {
      marginTop: t4,
      children: t6
    }, void 0, !1, void 0, this), $3[9] = t4, $3[10] = t6, $3[11] = t7;
  else
    t7 = $3[11];
  return t7;
}
var import_compiler_runtime69, jsx_dev_runtime79;
var init_UserAgentNotificationMessage = __esm(() => {
  init_figures2();
  init_ink2();
  init_messages3();
  import_compiler_runtime69 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime79 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
