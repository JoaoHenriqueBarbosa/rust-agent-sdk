// Original: src/components/MessageTimestamp.tsx
function MessageTimestamp(t0) {
  let $3 = import_compiler_runtime207.c(10), {
    message,
    isTranscriptMode
  } = t0;
  if (!(isTranscriptMode && message.timestamp && message.type === "assistant" && message.message.content.some(_temp126)))
    return null;
  let T0, formattedTimestamp, t1;
  if ($3[0] !== message.timestamp)
    formattedTimestamp = new Date(message.timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: !0
    }), T0 = ThemedBox_default, t1 = stringWidth(formattedTimestamp), $3[0] = message.timestamp, $3[1] = T0, $3[2] = formattedTimestamp, $3[3] = t1;
  else
    T0 = $3[1], formattedTimestamp = $3[2], t1 = $3[3];
  let t2;
  if ($3[4] !== formattedTimestamp)
    t2 = /* @__PURE__ */ jsx_dev_runtime261.jsxDEV(ThemedText, {
      dimColor: !0,
      children: formattedTimestamp
    }, void 0, !1, void 0, this), $3[4] = formattedTimestamp, $3[5] = t2;
  else
    t2 = $3[5];
  let t3;
  if ($3[6] !== T0 || $3[7] !== t1 || $3[8] !== t2)
    t3 = /* @__PURE__ */ jsx_dev_runtime261.jsxDEV(T0, {
      minWidth: t1,
      children: t2
    }, void 0, !1, void 0, this), $3[6] = T0, $3[7] = t1, $3[8] = t2, $3[9] = t3;
  else
    t3 = $3[9];
  return t3;
}
function _temp126(c3) {
  return c3.type === "text";
}
var import_compiler_runtime207, jsx_dev_runtime261;
var init_MessageTimestamp = __esm(() => {
  init_stringWidth();
  init_ink2();
  import_compiler_runtime207 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime261 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
