// Original: src/components/messages/AssistantThinkingMessage.tsx
function AssistantThinkingMessage(t0) {
  let $3 = import_compiler_runtime66.c(9), {
    param: t1,
    addMargin: t2,
    isTranscriptMode,
    verbose,
    hideInTranscript: t3
  } = t0, {
    thinking
  } = t1, addMargin = t2 === void 0 ? !1 : t2, hideInTranscript = t3 === void 0 ? !1 : t3;
  if (!thinking)
    return null;
  if (hideInTranscript)
    return null;
  if (!(isTranscriptMode || verbose)) {
    let t42 = addMargin ? 1 : 0, t52;
    if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
      t52 = /* @__PURE__ */ jsx_dev_runtime76.jsxDEV(ThemedText, {
        dimColor: !0,
        italic: !0,
        children: [
          "\u2234 Thinking",
          " ",
          /* @__PURE__ */ jsx_dev_runtime76.jsxDEV(CtrlOToExpand, {}, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this), $3[0] = t52;
    else
      t52 = $3[0];
    let t62;
    if ($3[1] !== t42)
      t62 = /* @__PURE__ */ jsx_dev_runtime76.jsxDEV(ThemedBox_default, {
        marginTop: t42,
        children: t52
      }, void 0, !1, void 0, this), $3[1] = t42, $3[2] = t62;
    else
      t62 = $3[2];
    return t62;
  }
  let t4 = addMargin ? 1 : 0, t5;
  if ($3[3] === Symbol.for("react.memo_cache_sentinel"))
    t5 = /* @__PURE__ */ jsx_dev_runtime76.jsxDEV(ThemedText, {
      dimColor: !0,
      italic: !0,
      children: [
        "\u2234 Thinking",
        "\u2026"
      ]
    }, void 0, !0, void 0, this), $3[3] = t5;
  else
    t5 = $3[3];
  let t6;
  if ($3[4] !== thinking)
    t6 = /* @__PURE__ */ jsx_dev_runtime76.jsxDEV(ThemedBox_default, {
      paddingLeft: 2,
      children: /* @__PURE__ */ jsx_dev_runtime76.jsxDEV(Markdown, {
        dimColor: !0,
        children: thinking
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[4] = thinking, $3[5] = t6;
  else
    t6 = $3[5];
  let t7;
  if ($3[6] !== t4 || $3[7] !== t6)
    t7 = /* @__PURE__ */ jsx_dev_runtime76.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      gap: 1,
      marginTop: t4,
      width: "100%",
      children: [
        t5,
        t6
      ]
    }, void 0, !0, void 0, this), $3[6] = t4, $3[7] = t6, $3[8] = t7;
  else
    t7 = $3[8];
  return t7;
}
var import_compiler_runtime66, jsx_dev_runtime76;
var init_AssistantThinkingMessage = __esm(() => {
  init_ink2();
  init_CtrlOToExpand();
  init_Markdown();
  import_compiler_runtime66 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime76 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
