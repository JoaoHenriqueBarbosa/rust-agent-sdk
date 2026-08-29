// Original: src/components/messages/AdvisorMessage.tsx
function AdvisorMessage(t0) {
  let $3 = import_compiler_runtime41.c(30), {
    block: block2,
    addMargin,
    resolvedToolUseIDs,
    erroredToolUseIDs,
    shouldAnimate,
    verbose,
    advisorModel
  } = t0;
  if (block2.type === "server_tool_use") {
    let t12;
    if ($3[0] !== block2.input)
      t12 = block2.input && Object.keys(block2.input).length > 0 ? jsonStringify(block2.input) : null, $3[0] = block2.input, $3[1] = t12;
    else
      t12 = $3[1];
    let input = t12, t2 = addMargin ? 1 : 0, t3;
    if ($3[2] !== block2.id || $3[3] !== resolvedToolUseIDs)
      t3 = resolvedToolUseIDs.has(block2.id), $3[2] = block2.id, $3[3] = resolvedToolUseIDs, $3[4] = t3;
    else
      t3 = $3[4];
    let t4 = !t3, t5;
    if ($3[5] !== block2.id || $3[6] !== erroredToolUseIDs)
      t5 = erroredToolUseIDs.has(block2.id), $3[5] = block2.id, $3[6] = erroredToolUseIDs, $3[7] = t5;
    else
      t5 = $3[7];
    let t6;
    if ($3[8] !== shouldAnimate || $3[9] !== t4 || $3[10] !== t5)
      t6 = /* @__PURE__ */ jsx_dev_runtime47.jsxDEV(ToolUseLoader, {
        shouldAnimate,
        isUnresolved: t4,
        isError: t5
      }, void 0, !1, void 0, this), $3[8] = shouldAnimate, $3[9] = t4, $3[10] = t5, $3[11] = t6;
    else
      t6 = $3[11];
    let t7;
    if ($3[12] === Symbol.for("react.memo_cache_sentinel"))
      t7 = /* @__PURE__ */ jsx_dev_runtime47.jsxDEV(ThemedText, {
        bold: !0,
        children: "Advising"
      }, void 0, !1, void 0, this), $3[12] = t7;
    else
      t7 = $3[12];
    let t8;
    if ($3[13] !== advisorModel)
      t8 = advisorModel ? /* @__PURE__ */ jsx_dev_runtime47.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          " using ",
          renderModelName(advisorModel)
        ]
      }, void 0, !0, void 0, this) : null, $3[13] = advisorModel, $3[14] = t8;
    else
      t8 = $3[14];
    let t9;
    if ($3[15] !== input)
      t9 = input ? /* @__PURE__ */ jsx_dev_runtime47.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          " \xB7 ",
          input
        ]
      }, void 0, !0, void 0, this) : null, $3[15] = input, $3[16] = t9;
    else
      t9 = $3[16];
    let t10;
    if ($3[17] !== t2 || $3[18] !== t6 || $3[19] !== t8 || $3[20] !== t9)
      t10 = /* @__PURE__ */ jsx_dev_runtime47.jsxDEV(ThemedBox_default, {
        marginTop: t2,
        paddingRight: 2,
        flexDirection: "row",
        children: [
          t6,
          t7,
          t8,
          t9
        ]
      }, void 0, !0, void 0, this), $3[17] = t2, $3[18] = t6, $3[19] = t8, $3[20] = t9, $3[21] = t10;
    else
      t10 = $3[21];
    return t10;
  }
  let body;
  bb0:
    switch (block2.content.type) {
      case "advisor_tool_result_error": {
        let t12;
        if ($3[22] !== block2.content.error_code)
          t12 = /* @__PURE__ */ jsx_dev_runtime47.jsxDEV(ThemedText, {
            color: "error",
            children: [
              "Advisor unavailable (",
              block2.content.error_code,
              ")"
            ]
          }, void 0, !0, void 0, this), $3[22] = block2.content.error_code, $3[23] = t12;
        else
          t12 = $3[23];
        body = t12;
        break bb0;
      }
      case "advisor_result": {
        let t12;
        if ($3[24] !== block2.content.text || $3[25] !== verbose)
          t12 = verbose ? /* @__PURE__ */ jsx_dev_runtime47.jsxDEV(ThemedText, {
            dimColor: !0,
            children: block2.content.text
          }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime47.jsxDEV(ThemedText, {
            dimColor: !0,
            children: [
              figures_default.tick,
              " Advisor has reviewed the conversation and will apply the feedback ",
              /* @__PURE__ */ jsx_dev_runtime47.jsxDEV(CtrlOToExpand, {}, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this), $3[24] = block2.content.text, $3[25] = verbose, $3[26] = t12;
        else
          t12 = $3[26];
        body = t12;
        break bb0;
      }
      case "advisor_redacted_result": {
        let t12;
        if ($3[27] === Symbol.for("react.memo_cache_sentinel"))
          t12 = /* @__PURE__ */ jsx_dev_runtime47.jsxDEV(ThemedText, {
            dimColor: !0,
            children: [
              figures_default.tick,
              " Advisor has reviewed the conversation and will apply the feedback"
            ]
          }, void 0, !0, void 0, this), $3[27] = t12;
        else
          t12 = $3[27];
        body = t12;
      }
    }
  let t1;
  if ($3[28] !== body)
    t1 = /* @__PURE__ */ jsx_dev_runtime47.jsxDEV(ThemedBox_default, {
      paddingRight: 2,
      children: /* @__PURE__ */ jsx_dev_runtime47.jsxDEV(MessageResponse, {
        children: body
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[28] = body, $3[29] = t1;
  else
    t1 = $3[29];
  return t1;
}
var import_compiler_runtime41, jsx_dev_runtime47;
var init_AdvisorMessage = __esm(() => {
  init_figures();
  init_ink2();
  init_model();
  init_slowOperations();
  init_CtrlOToExpand();
  init_MessageResponse();
  init_ToolUseLoader();
  import_compiler_runtime41 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime47 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
