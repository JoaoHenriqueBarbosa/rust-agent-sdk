// Original: src/components/MessageRow.tsx
function hasContentAfterIndex(messages, index, tools, streamingToolUseIDs) {
  for (let i5 = index + 1;i5 < messages.length; i5++) {
    let msg = messages[i5];
    if (msg?.type === "assistant") {
      let content = msg.message.content[0];
      if (content?.type === "thinking" || content?.type === "redacted_thinking")
        continue;
      if (content?.type === "tool_use") {
        if (getToolSearchOrReadInfo(content.name, content.input, tools).isCollapsible)
          continue;
        if (streamingToolUseIDs.has(content.id))
          continue;
      }
      return !0;
    }
    if (msg?.type === "system" || msg?.type === "attachment")
      continue;
    if (msg?.type === "user") {
      if (msg.message.content[0]?.type === "tool_result")
        continue;
    }
    if (msg?.type === "grouped_tool_use") {
      let firstInput = msg.messages[0]?.message.content[0]?.input;
      if (getToolSearchOrReadInfo(msg.toolName, firstInput, tools).isCollapsible)
        continue;
    }
    return !0;
  }
  return !1;
}
function MessageRowImpl(t0) {
  let $3 = import_compiler_runtime208.c(64), {
    message: msg,
    isUserContinuation,
    hasContentAfter,
    tools,
    commands: commands7,
    verbose,
    inProgressToolUseIDs,
    streamingToolUseIDs,
    screen,
    canAnimate,
    onOpenRateLimitOptions,
    lastThinkingBlockId,
    latestBashOutputUUID,
    columns,
    isLoading,
    lookups
  } = t0, isTranscriptMode = screen === "transcript", isGrouped = msg.type === "grouped_tool_use", isCollapsed = msg.type === "collapsed_read_search", t1;
  if ($3[0] !== hasContentAfter || $3[1] !== inProgressToolUseIDs || $3[2] !== isCollapsed || $3[3] !== isLoading || $3[4] !== msg)
    t1 = isCollapsed && (hasAnyToolInProgress(msg, inProgressToolUseIDs) || isLoading && !hasContentAfter), $3[0] = hasContentAfter, $3[1] = inProgressToolUseIDs, $3[2] = isCollapsed, $3[3] = isLoading, $3[4] = msg, $3[5] = t1;
  else
    t1 = $3[5];
  let isActiveCollapsedGroup = t1, t2;
  if ($3[6] !== isCollapsed || $3[7] !== isGrouped || $3[8] !== msg)
    t2 = isGrouped ? msg.displayMessage : isCollapsed ? getDisplayMessageFromCollapsed(msg) : msg, $3[6] = isCollapsed, $3[7] = isGrouped, $3[8] = msg, $3[9] = t2;
  else
    t2 = $3[9];
  let displayMsg = t2, t3;
  if ($3[10] !== isCollapsed || $3[11] !== isGrouped || $3[12] !== lookups || $3[13] !== msg)
    t3 = isGrouped || isCollapsed ? [] : getProgressMessagesFromLookup(msg, lookups), $3[10] = isCollapsed, $3[11] = isGrouped, $3[12] = lookups, $3[13] = msg, $3[14] = t3;
  else
    t3 = $3[14];
  let progressMessagesForMessage = t3, t4;
  if ($3[15] !== inProgressToolUseIDs || $3[16] !== isCollapsed || $3[17] !== isGrouped || $3[18] !== lookups || $3[19] !== msg || $3[20] !== screen || $3[21] !== streamingToolUseIDs) {
    let siblingToolUseIDs = isGrouped || isCollapsed ? EMPTY_STRING_SET : getSiblingToolUseIDsFromLookup(msg, lookups);
    t4 = shouldRenderStatically(msg, streamingToolUseIDs, inProgressToolUseIDs, siblingToolUseIDs, screen, lookups), $3[15] = inProgressToolUseIDs, $3[16] = isCollapsed, $3[17] = isGrouped, $3[18] = lookups, $3[19] = msg, $3[20] = screen, $3[21] = streamingToolUseIDs, $3[22] = t4;
  } else
    t4 = $3[22];
  let isStatic = t4, shouldAnimate = !1;
  if (canAnimate)
    if (isGrouped) {
      let t52;
      if ($3[23] !== inProgressToolUseIDs || $3[24] !== msg.messages) {
        let t62;
        if ($3[26] !== inProgressToolUseIDs)
          t62 = (m4) => {
            let content = m4.message.content[0];
            return content?.type === "tool_use" && inProgressToolUseIDs.has(content.id);
          }, $3[26] = inProgressToolUseIDs, $3[27] = t62;
        else
          t62 = $3[27];
        t52 = msg.messages.some(t62), $3[23] = inProgressToolUseIDs, $3[24] = msg.messages, $3[25] = t52;
      } else
        t52 = $3[25];
      shouldAnimate = t52;
    } else if (isCollapsed) {
      let t52;
      if ($3[28] !== inProgressToolUseIDs || $3[29] !== msg)
        t52 = hasAnyToolInProgress(msg, inProgressToolUseIDs), $3[28] = inProgressToolUseIDs, $3[29] = msg, $3[30] = t52;
      else
        t52 = $3[30];
      shouldAnimate = t52;
    } else {
      let t52;
      if ($3[31] !== inProgressToolUseIDs || $3[32] !== msg) {
        let toolUseID = getToolUseID(msg);
        t52 = !toolUseID || inProgressToolUseIDs.has(toolUseID), $3[31] = inProgressToolUseIDs, $3[32] = msg, $3[33] = t52;
      } else
        t52 = $3[33];
      shouldAnimate = t52;
    }
  let t5;
  if ($3[34] !== displayMsg || $3[35] !== isTranscriptMode)
    t5 = isTranscriptMode && displayMsg.type === "assistant" && displayMsg.message.content.some(_temp127) && (displayMsg.timestamp || displayMsg.message.model), $3[34] = displayMsg, $3[35] = isTranscriptMode, $3[36] = t5;
  else
    t5 = $3[36];
  let hasMetadata = t5, t6 = !hasMetadata, t7 = hasMetadata ? void 0 : columns, t8;
  if ($3[37] !== commands7 || $3[38] !== inProgressToolUseIDs || $3[39] !== isActiveCollapsedGroup || $3[40] !== isStatic || $3[41] !== isTranscriptMode || $3[42] !== isUserContinuation || $3[43] !== lastThinkingBlockId || $3[44] !== latestBashOutputUUID || $3[45] !== lookups || $3[46] !== msg || $3[47] !== onOpenRateLimitOptions || $3[48] !== progressMessagesForMessage || $3[49] !== shouldAnimate || $3[50] !== t6 || $3[51] !== t7 || $3[52] !== tools || $3[53] !== verbose)
    t8 = /* @__PURE__ */ jsx_dev_runtime262.jsxDEV(Message4, {
      message: msg,
      lookups,
      addMargin: t6,
      containerWidth: t7,
      tools,
      commands: commands7,
      verbose,
      inProgressToolUseIDs,
      progressMessagesForMessage,
      shouldAnimate,
      shouldShowDot: !0,
      isTranscriptMode,
      isStatic,
      onOpenRateLimitOptions,
      isActiveCollapsedGroup,
      isUserContinuation,
      lastThinkingBlockId,
      latestBashOutputUUID
    }, void 0, !1, void 0, this), $3[37] = commands7, $3[38] = inProgressToolUseIDs, $3[39] = isActiveCollapsedGroup, $3[40] = isStatic, $3[41] = isTranscriptMode, $3[42] = isUserContinuation, $3[43] = lastThinkingBlockId, $3[44] = latestBashOutputUUID, $3[45] = lookups, $3[46] = msg, $3[47] = onOpenRateLimitOptions, $3[48] = progressMessagesForMessage, $3[49] = shouldAnimate, $3[50] = t6, $3[51] = t7, $3[52] = tools, $3[53] = verbose, $3[54] = t8;
  else
    t8 = $3[54];
  let messageEl = t8;
  if (!hasMetadata) {
    let t92;
    if ($3[55] !== messageEl)
      t92 = /* @__PURE__ */ jsx_dev_runtime262.jsxDEV(OffscreenFreeze, {
        children: messageEl
      }, void 0, !1, void 0, this), $3[55] = messageEl, $3[56] = t92;
    else
      t92 = $3[56];
    return t92;
  }
  let t9;
  if ($3[57] !== displayMsg || $3[58] !== isTranscriptMode)
    t9 = /* @__PURE__ */ jsx_dev_runtime262.jsxDEV(ThemedBox_default, {
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: 1,
      marginTop: 1,
      children: [
        /* @__PURE__ */ jsx_dev_runtime262.jsxDEV(MessageTimestamp, {
          message: displayMsg,
          isTranscriptMode
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime262.jsxDEV(MessageModel, {
          message: displayMsg,
          isTranscriptMode
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[57] = displayMsg, $3[58] = isTranscriptMode, $3[59] = t9;
  else
    t9 = $3[59];
  let t10;
  if ($3[60] !== columns || $3[61] !== messageEl || $3[62] !== t9)
    t10 = /* @__PURE__ */ jsx_dev_runtime262.jsxDEV(OffscreenFreeze, {
      children: /* @__PURE__ */ jsx_dev_runtime262.jsxDEV(ThemedBox_default, {
        width: columns,
        flexDirection: "column",
        children: [
          t9,
          messageEl
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[60] = columns, $3[61] = messageEl, $3[62] = t9, $3[63] = t10;
  else
    t10 = $3[63];
  return t10;
}
function _temp127(c3) {
  return c3.type === "text";
}
function isMessageStreaming(msg, streamingToolUseIDs) {
  if (msg.type === "grouped_tool_use")
    return msg.messages.some((m4) => {
      let content = m4.message.content[0];
      return content?.type === "tool_use" && streamingToolUseIDs.has(content.id);
    });
  if (msg.type === "collapsed_read_search")
    return getToolUseIdsFromCollapsedGroup(msg).some((id) => streamingToolUseIDs.has(id));
  let toolUseID = getToolUseID(msg);
  return !!toolUseID && streamingToolUseIDs.has(toolUseID);
}
function allToolsResolved(msg, resolvedToolUseIDs) {
  if (msg.type === "grouped_tool_use")
    return msg.messages.every((m4) => {
      let content = m4.message.content[0];
      return content?.type === "tool_use" && resolvedToolUseIDs.has(content.id);
    });
  if (msg.type === "collapsed_read_search")
    return getToolUseIdsFromCollapsedGroup(msg).every((id) => resolvedToolUseIDs.has(id));
  if (msg.type === "assistant") {
    let block2 = msg.message.content[0];
    if (block2?.type === "server_tool_use")
      return resolvedToolUseIDs.has(block2.id);
  }
  let toolUseID = getToolUseID(msg);
  return !toolUseID || resolvedToolUseIDs.has(toolUseID);
}
function areMessageRowPropsEqual(prev, next2) {
  if (prev.message !== next2.message)
    return !1;
  if (prev.screen !== next2.screen)
    return !1;
  if (prev.verbose !== next2.verbose)
    return !1;
  if (prev.message.type === "collapsed_read_search" && next2.screen !== "transcript")
    return !1;
  if (prev.columns !== next2.columns)
    return !1;
  let prevIsLatestBash = prev.latestBashOutputUUID === prev.message.uuid, nextIsLatestBash = next2.latestBashOutputUUID === next2.message.uuid;
  if (prevIsLatestBash !== nextIsLatestBash)
    return !1;
  if (prev.lastThinkingBlockId !== next2.lastThinkingBlockId && hasThinkingContent(next2.message))
    return !1;
  let isStreaming = isMessageStreaming(prev.message, prev.streamingToolUseIDs), isResolved = allToolsResolved(prev.message, prev.lookups.resolvedToolUseIDs);
  if (isStreaming || !isResolved)
    return !1;
  return !0;
}
var import_compiler_runtime208, React80, jsx_dev_runtime262, MessageRow;
var init_MessageRow = __esm(() => {
  init_ink2();
  init_collapseReadSearch();
  init_messages3();
  init_Message3();
  init_MessageModel();
  init_Messages();
  init_MessageTimestamp();
  init_OffscreenFreeze();
  import_compiler_runtime208 = __toESM(require_react_compiler_runtime_development(), 1), React80 = __toESM(require_react_development(), 1), jsx_dev_runtime262 = __toESM(require_react_jsx_dev_runtime_development(), 1);
  MessageRow = React80.memo(MessageRowImpl, areMessageRowPropsEqual);
});
