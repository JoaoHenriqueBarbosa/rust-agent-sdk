// Original: src/components/Message.tsx
function MessageImpl(t0) {
  let $3 = import_compiler_runtime103.c(94), {
    message,
    lookups,
    containerWidth,
    addMargin,
    tools,
    commands: commands7,
    verbose,
    inProgressToolUseIDs,
    progressMessagesForMessage,
    shouldAnimate,
    shouldShowDot,
    style,
    width,
    isTranscriptMode,
    onOpenRateLimitOptions,
    isActiveCollapsedGroup,
    isUserContinuation: t1,
    lastThinkingBlockId,
    latestBashOutputUUID
  } = t0, isUserContinuation = t1 === void 0 ? !1 : t1;
  switch (message.type) {
    case "attachment": {
      let t2;
      if ($3[0] !== addMargin || $3[1] !== isTranscriptMode || $3[2] !== message.attachment || $3[3] !== verbose)
        t2 = /* @__PURE__ */ jsx_dev_runtime115.jsxDEV(AttachmentMessage, {
          addMargin,
          attachment: message.attachment,
          verbose,
          isTranscriptMode
        }, void 0, !1, void 0, this), $3[0] = addMargin, $3[1] = isTranscriptMode, $3[2] = message.attachment, $3[3] = verbose, $3[4] = t2;
      else
        t2 = $3[4];
      return t2;
    }
    case "assistant": {
      let t2 = containerWidth ?? "100%", t3;
      if ($3[5] !== addMargin || $3[6] !== commands7 || $3[7] !== inProgressToolUseIDs || $3[8] !== isTranscriptMode || $3[9] !== lastThinkingBlockId || $3[10] !== lookups || $3[11] !== message.advisorModel || $3[12] !== message.message.content || $3[13] !== message.uuid || $3[14] !== onOpenRateLimitOptions || $3[15] !== progressMessagesForMessage || $3[16] !== shouldAnimate || $3[17] !== shouldShowDot || $3[18] !== tools || $3[19] !== verbose || $3[20] !== width) {
        let t42;
        if ($3[22] !== addMargin || $3[23] !== commands7 || $3[24] !== inProgressToolUseIDs || $3[25] !== isTranscriptMode || $3[26] !== lastThinkingBlockId || $3[27] !== lookups || $3[28] !== message.advisorModel || $3[29] !== message.uuid || $3[30] !== onOpenRateLimitOptions || $3[31] !== progressMessagesForMessage || $3[32] !== shouldAnimate || $3[33] !== shouldShowDot || $3[34] !== tools || $3[35] !== verbose || $3[36] !== width)
          t42 = (_, index_0) => /* @__PURE__ */ jsx_dev_runtime115.jsxDEV(AssistantMessageBlock, {
            param: _,
            addMargin,
            tools,
            commands: commands7,
            verbose,
            inProgressToolUseIDs,
            progressMessagesForMessage,
            shouldAnimate,
            shouldShowDot,
            width,
            inProgressToolCallCount: inProgressToolUseIDs.size,
            isTranscriptMode,
            lookups,
            onOpenRateLimitOptions,
            thinkingBlockId: `${message.uuid}:${index_0}`,
            lastThinkingBlockId,
            advisorModel: message.advisorModel
          }, index_0, !1, void 0, this), $3[22] = addMargin, $3[23] = commands7, $3[24] = inProgressToolUseIDs, $3[25] = isTranscriptMode, $3[26] = lastThinkingBlockId, $3[27] = lookups, $3[28] = message.advisorModel, $3[29] = message.uuid, $3[30] = onOpenRateLimitOptions, $3[31] = progressMessagesForMessage, $3[32] = shouldAnimate, $3[33] = shouldShowDot, $3[34] = tools, $3[35] = verbose, $3[36] = width, $3[37] = t42;
        else
          t42 = $3[37];
        t3 = message.message.content.map(t42), $3[5] = addMargin, $3[6] = commands7, $3[7] = inProgressToolUseIDs, $3[8] = isTranscriptMode, $3[9] = lastThinkingBlockId, $3[10] = lookups, $3[11] = message.advisorModel, $3[12] = message.message.content, $3[13] = message.uuid, $3[14] = onOpenRateLimitOptions, $3[15] = progressMessagesForMessage, $3[16] = shouldAnimate, $3[17] = shouldShowDot, $3[18] = tools, $3[19] = verbose, $3[20] = width, $3[21] = t3;
      } else
        t3 = $3[21];
      let t4;
      if ($3[38] !== t2 || $3[39] !== t3)
        t4 = /* @__PURE__ */ jsx_dev_runtime115.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          width: t2,
          children: t3
        }, void 0, !1, void 0, this), $3[38] = t2, $3[39] = t3, $3[40] = t4;
      else
        t4 = $3[40];
      return t4;
    }
    case "user": {
      if (message.isCompactSummary) {
        let t22 = isTranscriptMode ? "transcript" : "prompt", t32;
        if ($3[41] !== message || $3[42] !== t22)
          t32 = /* @__PURE__ */ jsx_dev_runtime115.jsxDEV(CompactSummary, {
            message,
            screen: t22
          }, void 0, !1, void 0, this), $3[41] = message, $3[42] = t22, $3[43] = t32;
        else
          t32 = $3[43];
        return t32;
      }
      let imageIndices;
      if ($3[44] !== message.imagePasteIds || $3[45] !== message.message.content) {
        imageIndices = [];
        let imagePosition = 0;
        for (let param of message.message.content)
          if (param.type === "image") {
            let id = message.imagePasteIds?.[imagePosition];
            imagePosition++, imageIndices.push(id ?? imagePosition);
          } else
            imageIndices.push(imagePosition);
        $3[44] = message.imagePasteIds, $3[45] = message.message.content, $3[46] = imageIndices;
      } else
        imageIndices = $3[46];
      let isLatestBashOutput = latestBashOutputUUID === message.uuid, t2 = containerWidth ?? "100%", t3;
      if ($3[47] !== addMargin || $3[48] !== imageIndices || $3[49] !== isTranscriptMode || $3[50] !== isUserContinuation || $3[51] !== lookups || $3[52] !== message || $3[53] !== progressMessagesForMessage || $3[54] !== style || $3[55] !== tools || $3[56] !== verbose)
        t3 = message.message.content.map((param_0, index) => /* @__PURE__ */ jsx_dev_runtime115.jsxDEV(UserMessage, {
          message,
          addMargin,
          tools,
          progressMessagesForMessage,
          param: param_0,
          style,
          verbose,
          imageIndex: imageIndices[index],
          isUserContinuation,
          lookups,
          isTranscriptMode
        }, index, !1, void 0, this)), $3[47] = addMargin, $3[48] = imageIndices, $3[49] = isTranscriptMode, $3[50] = isUserContinuation, $3[51] = lookups, $3[52] = message, $3[53] = progressMessagesForMessage, $3[54] = style, $3[55] = tools, $3[56] = verbose, $3[57] = t3;
      else
        t3 = $3[57];
      let t4;
      if ($3[58] !== t2 || $3[59] !== t3)
        t4 = /* @__PURE__ */ jsx_dev_runtime115.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          width: t2,
          children: t3
        }, void 0, !1, void 0, this), $3[58] = t2, $3[59] = t3, $3[60] = t4;
      else
        t4 = $3[60];
      let content = t4, t5;
      if ($3[61] !== content || $3[62] !== isLatestBashOutput)
        t5 = isLatestBashOutput ? /* @__PURE__ */ jsx_dev_runtime115.jsxDEV(ExpandShellOutputProvider, {
          children: content
        }, void 0, !1, void 0, this) : content, $3[61] = content, $3[62] = isLatestBashOutput, $3[63] = t5;
      else
        t5 = $3[63];
      return t5;
    }
    case "system": {
      if (message.subtype === "compact_boundary") {
        if (isFullscreenEnvEnabled())
          return null;
        let t22;
        if ($3[64] === Symbol.for("react.memo_cache_sentinel"))
          t22 = /* @__PURE__ */ jsx_dev_runtime115.jsxDEV(CompactBoundaryMessage, {}, void 0, !1, void 0, this), $3[64] = t22;
        else
          t22 = $3[64];
        return t22;
      }
      if (message.subtype === "microcompact_boundary")
        return null;
      if (message.subtype === "local_command") {
        let t22;
        if ($3[68] !== message.content)
          t22 = {
            type: "text",
            text: message.content
          }, $3[68] = message.content, $3[69] = t22;
        else
          t22 = $3[69];
        let t3;
        if ($3[70] !== addMargin || $3[71] !== isTranscriptMode || $3[72] !== t22 || $3[73] !== verbose)
          t3 = /* @__PURE__ */ jsx_dev_runtime115.jsxDEV(UserTextMessage, {
            addMargin,
            param: t22,
            verbose,
            isTranscriptMode
          }, void 0, !1, void 0, this), $3[70] = addMargin, $3[71] = isTranscriptMode, $3[72] = t22, $3[73] = verbose, $3[74] = t3;
        else
          t3 = $3[74];
        return t3;
      }
      let t2;
      if ($3[75] !== addMargin || $3[76] !== isTranscriptMode || $3[77] !== message || $3[78] !== verbose)
        t2 = /* @__PURE__ */ jsx_dev_runtime115.jsxDEV(SystemTextMessage, {
          message,
          addMargin,
          verbose,
          isTranscriptMode
        }, void 0, !1, void 0, this), $3[75] = addMargin, $3[76] = isTranscriptMode, $3[77] = message, $3[78] = verbose, $3[79] = t2;
      else
        t2 = $3[79];
      return t2;
    }
    case "grouped_tool_use": {
      let t2;
      if ($3[80] !== inProgressToolUseIDs || $3[81] !== lookups || $3[82] !== message || $3[83] !== shouldAnimate || $3[84] !== tools)
        t2 = /* @__PURE__ */ jsx_dev_runtime115.jsxDEV(GroupedToolUseContent, {
          message,
          tools,
          lookups,
          inProgressToolUseIDs,
          shouldAnimate
        }, void 0, !1, void 0, this), $3[80] = inProgressToolUseIDs, $3[81] = lookups, $3[82] = message, $3[83] = shouldAnimate, $3[84] = tools, $3[85] = t2;
      else
        t2 = $3[85];
      return t2;
    }
    case "collapsed_read_search": {
      let t2 = verbose || isTranscriptMode, t3;
      if ($3[86] !== inProgressToolUseIDs || $3[87] !== isActiveCollapsedGroup || $3[88] !== lookups || $3[89] !== message || $3[90] !== shouldAnimate || $3[91] !== t2 || $3[92] !== tools)
        t3 = /* @__PURE__ */ jsx_dev_runtime115.jsxDEV(OffscreenFreeze, {
          children: /* @__PURE__ */ jsx_dev_runtime115.jsxDEV(CollapsedReadSearchContent, {
            message,
            inProgressToolUseIDs,
            shouldAnimate,
            verbose: t2,
            tools,
            lookups,
            isActiveGroup: isActiveCollapsedGroup
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this), $3[86] = inProgressToolUseIDs, $3[87] = isActiveCollapsedGroup, $3[88] = lookups, $3[89] = message, $3[90] = shouldAnimate, $3[91] = t2, $3[92] = tools, $3[93] = t3;
      else
        t3 = $3[93];
      return t3;
    }
  }
}
function UserMessage(t0) {
  let $3 = import_compiler_runtime103.c(20), {
    message,
    addMargin,
    tools,
    progressMessagesForMessage,
    param,
    style,
    verbose,
    imageIndex,
    isUserContinuation,
    lookups,
    isTranscriptMode
  } = t0, {
    columns
  } = useTerminalSize();
  switch (param.type) {
    case "text": {
      let t1;
      if ($3[0] !== addMargin || $3[1] !== isTranscriptMode || $3[2] !== message.planContent || $3[3] !== message.timestamp || $3[4] !== param || $3[5] !== verbose)
        t1 = /* @__PURE__ */ jsx_dev_runtime115.jsxDEV(UserTextMessage, {
          addMargin,
          param,
          verbose,
          planContent: message.planContent,
          isTranscriptMode,
          timestamp: message.timestamp
        }, void 0, !1, void 0, this), $3[0] = addMargin, $3[1] = isTranscriptMode, $3[2] = message.planContent, $3[3] = message.timestamp, $3[4] = param, $3[5] = verbose, $3[6] = t1;
      else
        t1 = $3[6];
      return t1;
    }
    case "image": {
      let t1 = addMargin && !isUserContinuation, t2;
      if ($3[7] !== imageIndex || $3[8] !== t1)
        t2 = /* @__PURE__ */ jsx_dev_runtime115.jsxDEV(UserImageMessage, {
          imageId: imageIndex,
          addMargin: t1
        }, void 0, !1, void 0, this), $3[7] = imageIndex, $3[8] = t1, $3[9] = t2;
      else
        t2 = $3[9];
      return t2;
    }
    case "tool_result": {
      let t1 = columns - 5, t2;
      if ($3[10] !== isTranscriptMode || $3[11] !== lookups || $3[12] !== message || $3[13] !== param || $3[14] !== progressMessagesForMessage || $3[15] !== style || $3[16] !== t1 || $3[17] !== tools || $3[18] !== verbose)
        t2 = /* @__PURE__ */ jsx_dev_runtime115.jsxDEV(UserToolResultMessage, {
          param,
          message,
          lookups,
          progressMessagesForMessage,
          style,
          tools,
          verbose,
          width: t1,
          isTranscriptMode
        }, void 0, !1, void 0, this), $3[10] = isTranscriptMode, $3[11] = lookups, $3[12] = message, $3[13] = param, $3[14] = progressMessagesForMessage, $3[15] = style, $3[16] = t1, $3[17] = tools, $3[18] = verbose, $3[19] = t2;
      else
        t2 = $3[19];
      return t2;
    }
    default:
      return;
  }
}
function AssistantMessageBlock(t0) {
  let $3 = import_compiler_runtime103.c(45), {
    param,
    addMargin,
    tools,
    commands: commands7,
    verbose,
    inProgressToolUseIDs,
    progressMessagesForMessage,
    shouldAnimate,
    shouldShowDot,
    width,
    inProgressToolCallCount,
    isTranscriptMode,
    lookups,
    onOpenRateLimitOptions,
    thinkingBlockId,
    lastThinkingBlockId,
    advisorModel
  } = t0;
  switch (param.type) {
    case "tool_use": {
      let t1;
      if ($3[9] !== addMargin || $3[10] !== commands7 || $3[11] !== inProgressToolCallCount || $3[12] !== inProgressToolUseIDs || $3[13] !== isTranscriptMode || $3[14] !== lookups || $3[15] !== param || $3[16] !== progressMessagesForMessage || $3[17] !== shouldAnimate || $3[18] !== shouldShowDot || $3[19] !== tools || $3[20] !== verbose)
        t1 = /* @__PURE__ */ jsx_dev_runtime115.jsxDEV(AssistantToolUseMessage, {
          param,
          addMargin,
          tools,
          commands: commands7,
          verbose,
          inProgressToolUseIDs,
          progressMessagesForMessage,
          shouldAnimate,
          shouldShowDot,
          inProgressToolCallCount,
          lookups,
          isTranscriptMode
        }, void 0, !1, void 0, this), $3[9] = addMargin, $3[10] = commands7, $3[11] = inProgressToolCallCount, $3[12] = inProgressToolUseIDs, $3[13] = isTranscriptMode, $3[14] = lookups, $3[15] = param, $3[16] = progressMessagesForMessage, $3[17] = shouldAnimate, $3[18] = shouldShowDot, $3[19] = tools, $3[20] = verbose, $3[21] = t1;
      else
        t1 = $3[21];
      return t1;
    }
    case "text": {
      let t1;
      if ($3[22] !== addMargin || $3[23] !== onOpenRateLimitOptions || $3[24] !== param || $3[25] !== shouldShowDot || $3[26] !== verbose || $3[27] !== width)
        t1 = /* @__PURE__ */ jsx_dev_runtime115.jsxDEV(AssistantTextMessage, {
          param,
          addMargin,
          shouldShowDot,
          verbose,
          width,
          onOpenRateLimitOptions
        }, void 0, !1, void 0, this), $3[22] = addMargin, $3[23] = onOpenRateLimitOptions, $3[24] = param, $3[25] = shouldShowDot, $3[26] = verbose, $3[27] = width, $3[28] = t1;
      else
        t1 = $3[28];
      return t1;
    }
    case "redacted_thinking": {
      if (!isTranscriptMode && !verbose)
        return null;
      let t1;
      if ($3[29] !== addMargin)
        t1 = /* @__PURE__ */ jsx_dev_runtime115.jsxDEV(AssistantRedactedThinkingMessage, {
          addMargin
        }, void 0, !1, void 0, this), $3[29] = addMargin, $3[30] = t1;
      else
        t1 = $3[30];
      return t1;
    }
    case "thinking": {
      if (!isTranscriptMode && !verbose)
        return null;
      let t1 = isTranscriptMode && !(!lastThinkingBlockId || thinkingBlockId === lastThinkingBlockId), t2;
      if ($3[31] !== addMargin || $3[32] !== isTranscriptMode || $3[33] !== param || $3[34] !== t1 || $3[35] !== verbose)
        t2 = /* @__PURE__ */ jsx_dev_runtime115.jsxDEV(AssistantThinkingMessage, {
          addMargin,
          param,
          isTranscriptMode,
          verbose,
          hideInTranscript: t1
        }, void 0, !1, void 0, this), $3[31] = addMargin, $3[32] = isTranscriptMode, $3[33] = param, $3[34] = t1, $3[35] = verbose, $3[36] = t2;
      else
        t2 = $3[36];
      return t2;
    }
    case "server_tool_use":
    case "advisor_tool_result": {
      if (isAdvisorBlock(param)) {
        let t1 = verbose || isTranscriptMode, t2;
        if ($3[37] !== addMargin || $3[38] !== advisorModel || $3[39] !== lookups.erroredToolUseIDs || $3[40] !== lookups.resolvedToolUseIDs || $3[41] !== param || $3[42] !== shouldAnimate || $3[43] !== t1)
          t2 = /* @__PURE__ */ jsx_dev_runtime115.jsxDEV(AdvisorMessage, {
            block: param,
            addMargin,
            resolvedToolUseIDs: lookups.resolvedToolUseIDs,
            erroredToolUseIDs: lookups.erroredToolUseIDs,
            shouldAnimate,
            verbose: t1,
            advisorModel
          }, void 0, !1, void 0, this), $3[37] = addMargin, $3[38] = advisorModel, $3[39] = lookups.erroredToolUseIDs, $3[40] = lookups.resolvedToolUseIDs, $3[41] = param, $3[42] = shouldAnimate, $3[43] = t1, $3[44] = t2;
        else
          t2 = $3[44];
        return t2;
      }
      return logError2(Error(`Unable to render server tool block: ${param.type}`)), null;
    }
    default:
      return logError2(Error(`Unable to render message type: ${param.type}`)), null;
  }
}
function hasThinkingContent(m4) {
  if (m4.type !== "assistant" || !m4.message)
    return !1;
  return m4.message.content.some((b) => b.type === "thinking" || b.type === "redacted_thinking");
}
function areMessagePropsEqual(prev, next) {
  if (prev.message.uuid !== next.message.uuid)
    return !1;
  if (prev.lastThinkingBlockId !== next.lastThinkingBlockId && hasThinkingContent(next.message))
    return !1;
  if (prev.verbose !== next.verbose)
    return !1;
  let prevIsLatest = prev.latestBashOutputUUID === prev.message.uuid, nextIsLatest = next.latestBashOutputUUID === next.message.uuid;
  if (prevIsLatest !== nextIsLatest)
    return !1;
  if (prev.isTranscriptMode !== next.isTranscriptMode)
    return !1;
  if (prev.containerWidth !== next.containerWidth)
    return !1;
  if (prev.isStatic && next.isStatic)
    return !0;
  return !1;
}
var import_compiler_runtime103, React35, jsx_dev_runtime115, Message4;
var init_Message3 = __esm(() => {
  init_useTerminalSize();
  init_ink2();
  init_advisor();
  init_fullscreen();
  init_log3();
  init_CompactSummary();
  init_AdvisorMessage();
  init_AssistantRedactedThinkingMessage();
  init_AssistantTextMessage();
  init_AssistantThinkingMessage();
  init_AssistantToolUseMessage();
  init_AttachmentMessage();
  init_CollapsedReadSearchContent();
  init_CompactBoundaryMessage();
  init_GroupedToolUseContent();
  init_SystemTextMessage();
  init_UserImageMessage();
  init_UserTextMessage();
  init_UserToolResultMessage();
  init_OffscreenFreeze();
  init_ExpandShellOutputContext();
  import_compiler_runtime103 = __toESM(require_react_compiler_runtime_development(), 1), React35 = __toESM(require_react_development(), 1), jsx_dev_runtime115 = __toESM(require_react_jsx_dev_runtime_development(), 1);
  Message4 = React35.memo(MessageImpl, areMessagePropsEqual);
});
