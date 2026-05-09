// Original: src/components/messages/UserToolResultMessage/UserToolErrorMessage.tsx
function UserToolErrorMessage(t0) {
  let $3 = import_compiler_runtime99.c(14), {
    progressMessagesForMessage,
    tool,
    tools,
    param,
    verbose,
    isTranscriptMode
  } = t0;
  if (typeof param.content === "string" && param.content.includes(INTERRUPT_MESSAGE_FOR_TOOL_USE)) {
    let t12;
    if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
      t12 = /* @__PURE__ */ jsx_dev_runtime110.jsxDEV(MessageResponse, {
        height: 1,
        children: /* @__PURE__ */ jsx_dev_runtime110.jsxDEV(InterruptedByUser, {}, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this), $3[0] = t12;
    else
      t12 = $3[0];
    return t12;
  }
  if (typeof param.content === "string" && param.content.startsWith(PLAN_REJECTION_PREFIX)) {
    let t12;
    if ($3[1] !== param.content)
      t12 = param.content.substring(PLAN_REJECTION_PREFIX.length), $3[1] = param.content, $3[2] = t12;
    else
      t12 = $3[2];
    let planContent = t12, t2;
    if ($3[3] !== planContent)
      t2 = /* @__PURE__ */ jsx_dev_runtime110.jsxDEV(RejectedPlanMessage, {
        plan: planContent
      }, void 0, !1, void 0, this), $3[3] = planContent, $3[4] = t2;
    else
      t2 = $3[4];
    return t2;
  }
  if (typeof param.content === "string" && param.content.startsWith(REJECT_MESSAGE_WITH_REASON_PREFIX)) {
    let t12;
    if ($3[5] === Symbol.for("react.memo_cache_sentinel"))
      t12 = /* @__PURE__ */ jsx_dev_runtime110.jsxDEV(RejectedToolUseMessage, {}, void 0, !1, void 0, this), $3[5] = t12;
    else
      t12 = $3[5];
    return t12;
  }
  let t1;
  if ($3[7] !== isTranscriptMode || $3[8] !== param.content || $3[9] !== progressMessagesForMessage || $3[10] !== tool || $3[11] !== tools || $3[12] !== verbose)
    t1 = tool?.renderToolUseErrorMessage?.(param.content, {
      progressMessagesForMessage: filterToolProgressMessages(progressMessagesForMessage),
      tools,
      verbose,
      isTranscriptMode
    }) ?? /* @__PURE__ */ jsx_dev_runtime110.jsxDEV(FallbackToolUseErrorMessage, {
      result: param.content,
      verbose
    }, void 0, !1, void 0, this), $3[7] = isTranscriptMode, $3[8] = param.content, $3[9] = progressMessagesForMessage, $3[10] = tool, $3[11] = tools, $3[12] = verbose, $3[13] = t1;
  else
    t1 = $3[13];
  return t1;
}
var import_compiler_runtime99, jsx_dev_runtime110;
var init_UserToolErrorMessage = __esm(() => {
  init_Tool();
  init_messages3();
  init_FallbackToolUseErrorMessage();
  init_InterruptedByUser();
  init_MessageResponse();
  init_RejectedPlanMessage();
  init_RejectedToolUseMessage();
  import_compiler_runtime99 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime110 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
