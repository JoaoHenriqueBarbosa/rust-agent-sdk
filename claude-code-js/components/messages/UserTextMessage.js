// Original: src/components/messages/UserTextMessage.tsx
function UserTextMessage(t0) {
  let $3 = import_compiler_runtime86.c(49), {
    addMargin,
    param,
    verbose,
    planContent,
    isTranscriptMode,
    timestamp
  } = t0;
  if (param.text.trim() === NO_CONTENT_MESSAGE)
    return null;
  if (planContent) {
    let t12;
    if ($3[0] !== addMargin || $3[1] !== planContent)
      t12 = /* @__PURE__ */ jsx_dev_runtime97.jsxDEV(UserPlanMessage, {
        addMargin,
        planContent
      }, void 0, !1, void 0, this), $3[0] = addMargin, $3[1] = planContent, $3[2] = t12;
    else
      t12 = $3[2];
    return t12;
  }
  if (extractTag(param.text, TICK_TAG))
    return null;
  if (param.text.includes(`<${LOCAL_COMMAND_CAVEAT_TAG}>`))
    return null;
  if (param.text.startsWith("<bash-stdout") || param.text.startsWith("<bash-stderr")) {
    let t12;
    if ($3[3] !== param.text || $3[4] !== verbose)
      t12 = /* @__PURE__ */ jsx_dev_runtime97.jsxDEV(UserBashOutputMessage, {
        content: param.text,
        verbose
      }, void 0, !1, void 0, this), $3[3] = param.text, $3[4] = verbose, $3[5] = t12;
    else
      t12 = $3[5];
    return t12;
  }
  if (param.text.startsWith("<local-command-stdout") || param.text.startsWith("<local-command-stderr")) {
    let t12;
    if ($3[6] !== param.text)
      t12 = /* @__PURE__ */ jsx_dev_runtime97.jsxDEV(UserLocalCommandOutputMessage, {
        content: param.text
      }, void 0, !1, void 0, this), $3[6] = param.text, $3[7] = t12;
    else
      t12 = $3[7];
    return t12;
  }
  if (param.text === INTERRUPT_MESSAGE || param.text === INTERRUPT_MESSAGE_FOR_TOOL_USE) {
    let t12;
    if ($3[8] === Symbol.for("react.memo_cache_sentinel"))
      t12 = /* @__PURE__ */ jsx_dev_runtime97.jsxDEV(MessageResponse, {
        height: 1,
        children: /* @__PURE__ */ jsx_dev_runtime97.jsxDEV(InterruptedByUser, {}, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this), $3[8] = t12;
    else
      t12 = $3[8];
    return t12;
  }
  if (param.text.includes("<bash-input>")) {
    let t12;
    if ($3[13] !== addMargin || $3[14] !== param)
      t12 = /* @__PURE__ */ jsx_dev_runtime97.jsxDEV(UserBashInputMessage, {
        addMargin,
        param
      }, void 0, !1, void 0, this), $3[13] = addMargin, $3[14] = param, $3[15] = t12;
    else
      t12 = $3[15];
    return t12;
  }
  if (param.text.includes(`<${COMMAND_MESSAGE_TAG}>`)) {
    let t12;
    if ($3[16] !== addMargin || $3[17] !== param)
      t12 = /* @__PURE__ */ jsx_dev_runtime97.jsxDEV(UserCommandMessage, {
        addMargin,
        param
      }, void 0, !1, void 0, this), $3[16] = addMargin, $3[17] = param, $3[18] = t12;
    else
      t12 = $3[18];
    return t12;
  }
  if (param.text.includes("<user-memory-input>")) {
    let t12;
    if ($3[19] !== addMargin || $3[20] !== param.text)
      t12 = /* @__PURE__ */ jsx_dev_runtime97.jsxDEV(UserMemoryInputMessage, {
        addMargin,
        text: param.text
      }, void 0, !1, void 0, this), $3[19] = addMargin, $3[20] = param.text, $3[21] = t12;
    else
      t12 = $3[21];
    return t12;
  }
  if (isAgentSwarmsEnabled() && param.text.includes(`<${TEAMMATE_MESSAGE_TAG}`)) {
    let t12;
    if ($3[22] !== addMargin || $3[23] !== isTranscriptMode || $3[24] !== param)
      t12 = /* @__PURE__ */ jsx_dev_runtime97.jsxDEV(UserTeammateMessage, {
        addMargin,
        param,
        isTranscriptMode
      }, void 0, !1, void 0, this), $3[22] = addMargin, $3[23] = isTranscriptMode, $3[24] = param, $3[25] = t12;
    else
      t12 = $3[25];
    return t12;
  }
  if (param.text.includes(`<${TASK_NOTIFICATION_TAG}`)) {
    let t12;
    if ($3[26] !== addMargin || $3[27] !== param)
      t12 = /* @__PURE__ */ jsx_dev_runtime97.jsxDEV(UserAgentNotificationMessage, {
        addMargin,
        param
      }, void 0, !1, void 0, this), $3[26] = addMargin, $3[27] = param, $3[28] = t12;
    else
      t12 = $3[28];
    return t12;
  }
  if (param.text.includes("<mcp-resource-update") || param.text.includes("<mcp-polling-update")) {
    let t12;
    if ($3[29] !== addMargin || $3[30] !== param)
      t12 = /* @__PURE__ */ jsx_dev_runtime97.jsxDEV(UserResourceUpdateMessage, {
        addMargin,
        param
      }, void 0, !1, void 0, this), $3[29] = addMargin, $3[30] = param, $3[31] = t12;
    else
      t12 = $3[31];
    return t12;
  }
  if (param.text.includes('<channel source="')) {
    let t12;
    if ($3[40] === Symbol.for("react.memo_cache_sentinel"))
      t12 = (init_UserChannelMessage(), __toCommonJS(exports_UserChannelMessage)), $3[40] = t12;
    else
      t12 = $3[40];
    let {
      UserChannelMessage: UserChannelMessage2
    } = t12, t2;
    if ($3[41] !== addMargin || $3[42] !== param)
      t2 = /* @__PURE__ */ jsx_dev_runtime97.jsxDEV(UserChannelMessage2, {
        addMargin,
        param
      }, void 0, !1, void 0, this), $3[41] = addMargin, $3[42] = param, $3[43] = t2;
    else
      t2 = $3[43];
    return t2;
  }
  let t1;
  if ($3[44] !== addMargin || $3[45] !== isTranscriptMode || $3[46] !== param || $3[47] !== timestamp)
    t1 = /* @__PURE__ */ jsx_dev_runtime97.jsxDEV(UserPromptMessage, {
      addMargin,
      param,
      isTranscriptMode,
      timestamp
    }, void 0, !1, void 0, this), $3[44] = addMargin, $3[45] = isTranscriptMode, $3[46] = param, $3[47] = timestamp, $3[48] = t1;
  else
    t1 = $3[48];
  return t1;
}
var import_compiler_runtime86, jsx_dev_runtime97;
var init_UserTextMessage = __esm(() => {
  init_xml();
  init_agentSwarmsEnabled();
  init_messages3();
  init_InterruptedByUser();
  init_MessageResponse();
  init_UserAgentNotificationMessage();
  init_UserBashInputMessage();
  init_UserBashOutputMessage();
  init_UserCommandMessage();
  init_UserLocalCommandOutputMessage();
  init_UserMemoryInputMessage();
  init_UserPlanMessage();
  init_UserPromptMessage();
  init_UserResourceUpdateMessage();
  init_UserTeammateMessage();
  import_compiler_runtime86 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime97 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
