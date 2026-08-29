// Original: src/components/messages/UserToolResultMessage/UserToolResultMessage.tsx
function UserToolResultMessage(t0) {
  let $3 = import_compiler_runtime102.c(28), {
    param,
    message,
    lookups,
    progressMessagesForMessage,
    style,
    tools,
    verbose,
    width,
    isTranscriptMode
  } = t0, toolUse = useGetToolFromMessages(param.tool_use_id, tools, lookups);
  if (!toolUse)
    return null;
  if (typeof param.content === "string" && param.content.startsWith(CANCEL_MESSAGE)) {
    let t12;
    if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
      t12 = /* @__PURE__ */ jsx_dev_runtime113.jsxDEV(UserToolCanceledMessage, {}, void 0, !1, void 0, this), $3[0] = t12;
    else
      t12 = $3[0];
    return t12;
  }
  if (typeof param.content === "string" && param.content.startsWith(REJECT_MESSAGE) || param.content === INTERRUPT_MESSAGE_FOR_TOOL_USE) {
    let t12 = toolUse.toolUse.input, t2;
    if ($3[1] !== isTranscriptMode || $3[2] !== lookups || $3[3] !== progressMessagesForMessage || $3[4] !== style || $3[5] !== t12 || $3[6] !== toolUse.tool || $3[7] !== tools || $3[8] !== verbose)
      t2 = /* @__PURE__ */ jsx_dev_runtime113.jsxDEV(UserToolRejectMessage, {
        input: t12,
        progressMessagesForMessage,
        tool: toolUse.tool,
        tools,
        lookups,
        style,
        verbose,
        isTranscriptMode
      }, void 0, !1, void 0, this), $3[1] = isTranscriptMode, $3[2] = lookups, $3[3] = progressMessagesForMessage, $3[4] = style, $3[5] = t12, $3[6] = toolUse.tool, $3[7] = tools, $3[8] = verbose, $3[9] = t2;
    else
      t2 = $3[9];
    return t2;
  }
  if (param.is_error) {
    let t12;
    if ($3[10] !== isTranscriptMode || $3[11] !== param || $3[12] !== progressMessagesForMessage || $3[13] !== toolUse.tool || $3[14] !== tools || $3[15] !== verbose)
      t12 = /* @__PURE__ */ jsx_dev_runtime113.jsxDEV(UserToolErrorMessage, {
        progressMessagesForMessage,
        tool: toolUse.tool,
        tools,
        param,
        verbose,
        isTranscriptMode
      }, void 0, !1, void 0, this), $3[10] = isTranscriptMode, $3[11] = param, $3[12] = progressMessagesForMessage, $3[13] = toolUse.tool, $3[14] = tools, $3[15] = verbose, $3[16] = t12;
    else
      t12 = $3[16];
    return t12;
  }
  let t1;
  if ($3[17] !== isTranscriptMode || $3[18] !== lookups || $3[19] !== message || $3[20] !== progressMessagesForMessage || $3[21] !== style || $3[22] !== toolUse.tool || $3[23] !== toolUse.toolUse.id || $3[24] !== tools || $3[25] !== verbose || $3[26] !== width)
    t1 = /* @__PURE__ */ jsx_dev_runtime113.jsxDEV(UserToolSuccessMessage, {
      message,
      lookups,
      toolUseID: toolUse.toolUse.id,
      progressMessagesForMessage,
      style,
      tool: toolUse.tool,
      tools,
      verbose,
      width,
      isTranscriptMode
    }, void 0, !1, void 0, this), $3[17] = isTranscriptMode, $3[18] = lookups, $3[19] = message, $3[20] = progressMessagesForMessage, $3[21] = style, $3[22] = toolUse.tool, $3[23] = toolUse.toolUse.id, $3[24] = tools, $3[25] = verbose, $3[26] = width, $3[27] = t1;
  else
    t1 = $3[27];
  return t1;
}
var import_compiler_runtime102, jsx_dev_runtime113;
var init_UserToolResultMessage = __esm(() => {
  init_messages3();
  init_UserToolCanceledMessage();
  init_UserToolErrorMessage();
  init_UserToolRejectMessage();
  init_UserToolSuccessMessage();
  init_utils11();
  import_compiler_runtime102 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime113 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
