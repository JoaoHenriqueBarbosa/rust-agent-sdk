// Original: src/components/Messages.tsx
function filterForBriefTool(messages, briefToolNames) {
  let nameSet = new Set(briefToolNames), briefToolUseIDs = /* @__PURE__ */ new Set;
  return messages.filter((msg) => {
    if (msg.type === "system")
      return msg.subtype !== "api_metrics";
    let block2 = msg.message?.content[0];
    if (msg.type === "assistant") {
      if (msg.isApiErrorMessage)
        return !0;
      if (block2?.type === "tool_use" && block2.name && nameSet.has(block2.name)) {
        if ("id" in block2)
          briefToolUseIDs.add(block2.id);
        return !0;
      }
      return !1;
    }
    if (msg.type === "user") {
      if (block2?.type === "tool_result")
        return block2.tool_use_id !== void 0 && briefToolUseIDs.has(block2.tool_use_id);
      return !msg.isMeta;
    }
    if (msg.type === "attachment") {
      let att = msg.attachment;
      return att?.type === "queued_command" && att.commandMode === "prompt" && !att.isMeta && att.origin === void 0;
    }
    return !1;
  });
}
function dropTextInBriefTurns(messages, briefToolNames) {
  let nameSet = new Set(briefToolNames), turnsWithBrief = /* @__PURE__ */ new Set, textIndexToTurn = [], turn = 0;
  for (let i5 = 0;i5 < messages.length; i5++) {
    let msg = messages[i5], block2 = msg.message?.content[0];
    if (msg.type === "user" && block2?.type !== "tool_result" && !msg.isMeta) {
      turn++;
      continue;
    }
    if (msg.type === "assistant") {
      if (block2?.type === "text")
        textIndexToTurn[i5] = turn;
      else if (block2?.type === "tool_use" && block2.name && nameSet.has(block2.name))
        turnsWithBrief.add(turn);
    }
  }
  if (turnsWithBrief.size === 0)
    return messages;
  return messages.filter((_, i5) => {
    let t2 = textIndexToTurn[i5];
    return t2 === void 0 || !turnsWithBrief.has(t2);
  });
}
function computeSliceStart(collapsed, anchorRef, cap = MAX_MESSAGES_WITHOUT_VIRTUALIZATION, step = MESSAGE_CAP_STEP) {
  let anchor = anchorRef.current, anchorIdx = anchor ? collapsed.findIndex((m4) => m4.uuid === anchor.uuid) : -1, start = anchorIdx >= 0 ? anchorIdx : anchor ? Math.min(anchor.idx, Math.max(0, collapsed.length - cap)) : 0;
  if (collapsed.length - start > cap + step)
    start = collapsed.length - cap;
  let msgAtStart = collapsed[start];
  if (msgAtStart && (anchor?.uuid !== msgAtStart.uuid || anchor.idx !== start))
    anchorRef.current = {
      uuid: msgAtStart.uuid,
      idx: start
    };
  else if (!msgAtStart && anchor)
    anchorRef.current = null;
  return start;
}
function expandKey(msg) {
  return (msg.type === "assistant" || msg.type === "user" ? getToolUseID(msg) : null) ?? msg.uuid;
}
function setsEqual(a2, b) {
  if (a2.size !== b.size)
    return !1;
  for (let item of a2)
    if (!b.has(item))
      return !1;
  return !0;
}
function shouldRenderStatically(message, streamingToolUseIDs, inProgressToolUseIDs, siblingToolUseIDs, screen, lookups) {
  if (screen === "transcript")
    return !0;
  switch (message.type) {
    case "attachment":
    case "user":
    case "assistant": {
      if (message.type === "assistant") {
        let block2 = message.message.content[0];
        if (block2?.type === "server_tool_use")
          return lookups.resolvedToolUseIDs.has(block2.id);
      }
      let toolUseID = getToolUseID(message);
      if (!toolUseID)
        return !0;
      if (streamingToolUseIDs.has(toolUseID))
        return !1;
      if (inProgressToolUseIDs.has(toolUseID))
        return !1;
      if (hasUnresolvedHooksFromLookup(toolUseID, "PostToolUse", lookups))
        return !1;
      return every(siblingToolUseIDs, lookups.resolvedToolUseIDs);
    }
    case "system":
      return message.subtype !== "api_error";
    case "grouped_tool_use":
      return message.messages.every((msg) => {
        let content = msg.message.content[0];
        return content?.type === "tool_use" && lookups.resolvedToolUseIDs.has(content.id);
      });
    case "collapsed_read_search":
      return !1;
  }
}
var import_compiler_runtime213, React84, import_react156, jsx_dev_runtime268, LogoHeader, proactiveModule3 = null, BRIEF_TOOL_NAME6, SEND_USER_FILE_TOOL_NAME2 = null, MAX_MESSAGES_TO_SHOW_IN_TRANSCRIPT_MODE = 30, MAX_MESSAGES_WITHOUT_VIRTUALIZATION = 200, MESSAGE_CAP_STEP = 50, MessagesImpl = ({
  messages,
  tools,
  commands: commands7,
  verbose,
  toolJSX,
  toolUseConfirmQueue,
  inProgressToolUseIDs,
  isMessageSelectorVisible,
  conversationId,
  screen,
  streamingToolUses,
  showAllInTranscript = !1,
  agentDefinitions,
  onOpenRateLimitOptions,
  hideLogo = !1,
  isLoading,
  hidePastThinking = !1,
  streamingThinking,
  streamingText,
  isBriefOnly = !1,
  unseenDivider,
  scrollRef,
  trackStickyPrompt,
  jumpRef,
  onSearchMatchesChange,
  scanElement,
  setPositions,
  disableRenderCap = !1,
  cursor = null,
  setCursor,
  cursorNavRef,
  renderRange
}) => {
  let {
    columns
  } = useTerminalSize(), toggleShowAllShortcut = useShortcutDisplay("transcript:toggleShowAll", "Transcript", "Ctrl+E"), normalizedMessages = import_react156.useMemo(() => normalizeMessages(messages).filter(isNotEmptyMessage), [messages]), isStreamingThinkingVisible = import_react156.useMemo(() => {
    if (!streamingThinking)
      return !1;
    if (streamingThinking.isStreaming)
      return !0;
    if (streamingThinking.streamingEndedAt)
      return Date.now() - streamingThinking.streamingEndedAt < 30000;
    return !1;
  }, [streamingThinking]), lastThinkingBlockId = import_react156.useMemo(() => {
    if (!hidePastThinking)
      return null;
    if (isStreamingThinkingVisible)
      return "streaming";
    for (let i5 = normalizedMessages.length - 1;i5 >= 0; i5--) {
      let msg = normalizedMessages[i5];
      if (msg?.type === "assistant") {
        let content = msg.message.content;
        for (let j4 = content.length - 1;j4 >= 0; j4--)
          if (content[j4]?.type === "thinking")
            return `${msg.uuid}:${j4}`;
      } else if (msg?.type === "user") {
        if (!msg.message.content.some((block2) => block2.type === "tool_result"))
          return "no-thinking";
      }
    }
    return null;
  }, [normalizedMessages, hidePastThinking, isStreamingThinkingVisible]), latestBashOutputUUID = import_react156.useMemo(() => {
    for (let i_0 = normalizedMessages.length - 1;i_0 >= 0; i_0--) {
      let msg_0 = normalizedMessages[i_0];
      if (msg_0?.type === "user") {
        let content_0 = msg_0.message.content;
        for (let block_0 of content_0)
          if (block_0.type === "text") {
            let text2 = block_0.text;
            if (text2.startsWith("<bash-stdout") || text2.startsWith("<bash-stderr"))
              return msg_0.uuid;
          }
      }
    }
    return null;
  }, [normalizedMessages]), normalizedToolUseIDs = import_react156.useMemo(() => getToolUseIDs(normalizedMessages), [normalizedMessages]), streamingToolUsesWithoutInProgress = import_react156.useMemo(() => streamingToolUses.filter((stu) => !inProgressToolUseIDs.has(stu.contentBlock.id) && !normalizedToolUseIDs.has(stu.contentBlock.id)), [streamingToolUses, inProgressToolUseIDs, normalizedToolUseIDs]), syntheticStreamingToolUseMessages = import_react156.useMemo(() => streamingToolUsesWithoutInProgress.flatMap((streamingToolUse) => {
    let msg_1 = createAssistantMessage({
      content: [streamingToolUse.contentBlock]
    });
    return msg_1.uuid = deriveUUID(streamingToolUse.contentBlock.id, 0), normalizeMessages([msg_1]);
  }), [streamingToolUsesWithoutInProgress]), isTranscriptMode = screen === "transcript", disableVirtualScroll = import_react156.useMemo(() => isEnvTruthy(process.env.CLAUDE_CODE_DISABLE_VIRTUAL_SCROLL), []), virtualScrollRuntimeGate = scrollRef != null && !disableVirtualScroll, shouldTruncate = isTranscriptMode && !showAllInTranscript && !virtualScrollRuntimeGate, sliceAnchorRef = import_react156.useRef(null), {
    collapsed: collapsed_0,
    lookups: lookups_0,
    hasTruncatedMessages: hasTruncatedMessages_0,
    hiddenMessageCount: hiddenMessageCount_0
  } = import_react156.useMemo(() => {
    let compactAwareMessages = verbose || isFullscreenEnvEnabled() ? normalizedMessages : getMessagesAfterCompactBoundary(normalizedMessages, {
      includeSnipped: !0
    }), messagesToShowNotTruncated = reorderMessagesInUI(compactAwareMessages.filter((msg_2) => msg_2.type !== "progress").filter((msg_3) => !isNullRenderingAttachment(msg_3)).filter((_) => shouldShowUserMessage(_, isTranscriptMode)), syntheticStreamingToolUseMessages), briefToolNames = [BRIEF_TOOL_NAME6, SEND_USER_FILE_TOOL_NAME2].filter((n5) => n5 !== null), dropTextToolNames = [BRIEF_TOOL_NAME6].filter((n_0) => n_0 !== null), briefFiltered = briefToolNames.length > 0 && !isTranscriptMode ? isBriefOnly ? filterForBriefTool(messagesToShowNotTruncated, briefToolNames) : dropTextToolNames.length > 0 ? dropTextInBriefTurns(messagesToShowNotTruncated, dropTextToolNames) : messagesToShowNotTruncated : messagesToShowNotTruncated, messagesToShow = shouldTruncate ? briefFiltered.slice(-MAX_MESSAGES_TO_SHOW_IN_TRANSCRIPT_MODE) : briefFiltered, hasTruncatedMessages = shouldTruncate && briefFiltered.length > MAX_MESSAGES_TO_SHOW_IN_TRANSCRIPT_MODE, {
      messages: groupedMessages
    } = applyGrouping(messagesToShow, tools, verbose), collapsed = collapseBackgroundBashNotifications(collapseHookSummaries(collapseTeammateShutdowns(collapseReadSearchGroups(groupedMessages, tools))), verbose), lookups = buildMessageLookups(normalizedMessages, messagesToShow), hiddenMessageCount = messagesToShowNotTruncated.length - MAX_MESSAGES_TO_SHOW_IN_TRANSCRIPT_MODE;
    return {
      collapsed,
      lookups,
      hasTruncatedMessages,
      hiddenMessageCount
    };
  }, [verbose, normalizedMessages, isTranscriptMode, syntheticStreamingToolUseMessages, shouldTruncate, tools, isBriefOnly]), renderableMessages = import_react156.useMemo(() => {
    let sliceStart = !virtualScrollRuntimeGate && !disableRenderCap ? computeSliceStart(collapsed_0, sliceAnchorRef) : 0;
    return renderRange ? collapsed_0.slice(renderRange[0], renderRange[1]) : sliceStart > 0 ? collapsed_0.slice(sliceStart) : collapsed_0;
  }, [collapsed_0, renderRange, virtualScrollRuntimeGate, disableRenderCap]), streamingToolUseIDs = import_react156.useMemo(() => new Set(streamingToolUses.map((__0) => __0.contentBlock.id)), [streamingToolUses]), dividerBeforeIndex = import_react156.useMemo(() => {
    if (!unseenDivider)
      return -1;
    let prefix = unseenDivider.firstUnseenUuid.slice(0, 24);
    return renderableMessages.findIndex((m4) => m4.uuid.slice(0, 24) === prefix);
  }, [unseenDivider, renderableMessages]), selectedIdx = import_react156.useMemo(() => {
    if (!cursor)
      return -1;
    return renderableMessages.findIndex((m_0) => m_0.uuid === cursor.uuid);
  }, [cursor, renderableMessages]), [expandedKeys, setExpandedKeys] = import_react156.useState(() => /* @__PURE__ */ new Set), onItemClick = import_react156.useCallback((msg_4) => {
    let k3 = expandKey(msg_4);
    setExpandedKeys((prev) => {
      let next2 = new Set(prev);
      if (next2.has(k3))
        next2.delete(k3);
      else
        next2.add(k3);
      return next2;
    });
  }, []), isItemExpanded = import_react156.useCallback((msg_5) => expandedKeys.size > 0 && expandedKeys.has(expandKey(msg_5)), [expandedKeys]), lookupsRef = import_react156.useRef(lookups_0);
  lookupsRef.current = lookups_0;
  let isItemClickable = import_react156.useCallback((msg_6) => {
    if (msg_6.type === "collapsed_read_search")
      return !0;
    if (msg_6.type === "assistant") {
      let b = msg_6.message.content[0];
      return b != null && isAdvisorBlock(b) && b.type === "advisor_tool_result" && b.content.type === "advisor_result";
    }
    if (msg_6.type !== "user")
      return !1;
    let b_0 = msg_6.message.content[0];
    if (b_0?.type !== "tool_result" || b_0.is_error || !msg_6.toolUseResult)
      return !1;
    let name3 = lookupsRef.current.toolUseByToolUseID.get(b_0.tool_use_id)?.name;
    return (name3 ? findToolByName(tools, name3) : void 0)?.isResultTruncated?.(msg_6.toolUseResult) ?? !1;
  }, [tools]), canAnimate = (!toolJSX || !!toolJSX.shouldContinueAnimation) && !toolUseConfirmQueue.length && !isMessageSelectorVisible, hasToolsInProgress = inProgressToolUseIDs.size > 0, {
    progress
  } = useTerminalNotification(), prevProgressState = import_react156.useRef(null), progressEnabled = getGlobalConfig().terminalProgressBarEnabled && !getIsRemoteMode() && !(proactiveModule3?.isProactiveActive() ?? !1);
  import_react156.useEffect(() => {
    let state3 = progressEnabled ? hasToolsInProgress ? "indeterminate" : "completed" : null;
    if (prevProgressState.current === state3)
      return;
    prevProgressState.current = state3, progress(state3);
  }, [progress, progressEnabled, hasToolsInProgress]), import_react156.useEffect(() => {
    return () => progress(null);
  }, [progress]);
  let messageKey = import_react156.useCallback((msg_7) => `${msg_7.uuid}-${conversationId}`, [conversationId]), renderMessageRow = (msg_8, index) => {
    let prevType = index > 0 ? renderableMessages[index - 1]?.type : void 0, isUserContinuation = msg_8.type === "user" && prevType === "user", hasContentAfter = msg_8.type === "collapsed_read_search" && (!!streamingText || hasContentAfterIndex(renderableMessages, index, tools, streamingToolUseIDs)), k_0 = messageKey(msg_8), row = /* @__PURE__ */ jsx_dev_runtime268.jsxDEV(MessageRow, {
      message: msg_8,
      isUserContinuation,
      hasContentAfter,
      tools,
      commands: commands7,
      verbose: verbose || isItemExpanded(msg_8) || cursor?.expanded === !0 && index === selectedIdx,
      inProgressToolUseIDs,
      streamingToolUseIDs,
      screen,
      canAnimate,
      onOpenRateLimitOptions,
      lastThinkingBlockId,
      latestBashOutputUUID,
      columns,
      isLoading,
      lookups: lookups_0
    }, k_0, !1, void 0, this), wrapped = /* @__PURE__ */ jsx_dev_runtime268.jsxDEV(MessageActionsSelectedContext.Provider, {
      value: index === selectedIdx,
      children: row
    }, k_0, !1, void 0, this);
    if (unseenDivider && index === dividerBeforeIndex)
      return [/* @__PURE__ */ jsx_dev_runtime268.jsxDEV(ThemedBox_default, {
        marginTop: 1,
        children: /* @__PURE__ */ jsx_dev_runtime268.jsxDEV(Divider, {
          title: `${unseenDivider.count} new ${plural(unseenDivider.count, "message")}`,
          width: columns,
          color: "inactive"
        }, void 0, !1, void 0, this)
      }, "unseen-divider", !1, void 0, this), wrapped];
    return wrapped;
  }, searchTextCache2 = import_react156.useRef(/* @__PURE__ */ new WeakMap), extractSearchText = import_react156.useCallback((msg_9) => {
    let cached3 = searchTextCache2.current.get(msg_9);
    if (cached3 !== void 0)
      return cached3;
    let text_0 = renderableSearchText(msg_9);
    if (msg_9.type === "user" && msg_9.toolUseResult && Array.isArray(msg_9.message.content)) {
      let tr = msg_9.message.content.find((b_1) => b_1.type === "tool_result");
      if (tr && "tool_use_id" in tr) {
        let tu = lookups_0.toolUseByToolUseID.get(tr.tool_use_id), extracted = (tu && findToolByName(tools, tu.name))?.extractSearchText?.(msg_9.toolUseResult);
        if (extracted !== void 0)
          text_0 = extracted;
      }
    }
    let lowered = text_0.toLowerCase();
    return searchTextCache2.current.set(msg_9, lowered), lowered;
  }, [tools, lookups_0]);
  return /* @__PURE__ */ jsx_dev_runtime268.jsxDEV(jsx_dev_runtime268.Fragment, {
    children: [
      !hideLogo && !(renderRange && renderRange[0] > 0) && /* @__PURE__ */ jsx_dev_runtime268.jsxDEV(LogoHeader, {
        agentDefinitions
      }, void 0, !1, void 0, this),
      hasTruncatedMessages_0 && /* @__PURE__ */ jsx_dev_runtime268.jsxDEV(Divider, {
        title: `${toggleShowAllShortcut} to show ${source_default.bold(hiddenMessageCount_0)} previous messages`,
        width: columns
      }, void 0, !1, void 0, this),
      isTranscriptMode && showAllInTranscript && hiddenMessageCount_0 > 0 && !disableRenderCap && /* @__PURE__ */ jsx_dev_runtime268.jsxDEV(Divider, {
        title: `${toggleShowAllShortcut} to hide ${source_default.bold(hiddenMessageCount_0)} previous messages`,
        width: columns
      }, void 0, !1, void 0, this),
      virtualScrollRuntimeGate ? /* @__PURE__ */ jsx_dev_runtime268.jsxDEV(InVirtualListContext.Provider, {
        value: !0,
        children: /* @__PURE__ */ jsx_dev_runtime268.jsxDEV(VirtualMessageList, {
          messages: renderableMessages,
          scrollRef,
          columns,
          itemKey: messageKey,
          renderItem: renderMessageRow,
          onItemClick,
          isItemClickable,
          isItemExpanded,
          trackStickyPrompt,
          selectedIndex: selectedIdx >= 0 ? selectedIdx : void 0,
          cursorNavRef,
          setCursor,
          jumpRef,
          onSearchMatchesChange,
          scanElement,
          setPositions,
          extractSearchText
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this) : renderableMessages.flatMap(renderMessageRow),
      streamingText && !isBriefOnly && /* @__PURE__ */ jsx_dev_runtime268.jsxDEV(ThemedBox_default, {
        alignItems: "flex-start",
        flexDirection: "row",
        marginTop: 1,
        width: "100%",
        children: /* @__PURE__ */ jsx_dev_runtime268.jsxDEV(ThemedBox_default, {
          flexDirection: "row",
          children: [
            /* @__PURE__ */ jsx_dev_runtime268.jsxDEV(ThemedBox_default, {
              minWidth: 2,
              children: /* @__PURE__ */ jsx_dev_runtime268.jsxDEV(ThemedText, {
                color: "text",
                children: BLACK_CIRCLE
              }, void 0, !1, void 0, this)
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime268.jsxDEV(ThemedBox_default, {
              flexDirection: "column",
              children: /* @__PURE__ */ jsx_dev_runtime268.jsxDEV(StreamingMarkdown, {
                children: streamingText
              }, void 0, !1, void 0, this)
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this),
      isStreamingThinkingVisible && streamingThinking && !isBriefOnly && /* @__PURE__ */ jsx_dev_runtime268.jsxDEV(ThemedBox_default, {
        marginTop: 1,
        children: /* @__PURE__ */ jsx_dev_runtime268.jsxDEV(AssistantThinkingMessage, {
          param: {
            type: "thinking",
            thinking: streamingThinking.thinking
          },
          addMargin: !1,
          isTranscriptMode: !0,
          verbose,
          hideInTranscript: !1
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this)
    ]
  }, void 0, !0, void 0, this);
}, Messages4;
var init_Messages = __esm(() => {
  init_source();
  init_state();
  init_figures2();
  init_useTerminalSize();
  init_useTerminalNotification();
  init_ink2();
  init_useShortcutDisplay();
  init_Tool();
  init_advisor();
  init_collapseBackgroundBashNotifications();
  init_collapseReadSearch();
  init_config4();
  init_envUtils();
  init_fullscreen();
  init_groupToolUses();
  init_messages3();
  init_transcriptSearch();
  init_Divider();
  init_LogoV2();
  init_Markdown();
  init_MessageRow();
  init_messageActions();
  init_AssistantThinkingMessage();
  init_nullRenderingAttachments();
  init_OffscreenFreeze();
  init_StatusNotices();
  init_VirtualMessageList();
  import_compiler_runtime213 = __toESM(require_react_compiler_runtime_development(), 1), React84 = __toESM(require_react_development(), 1), import_react156 = __toESM(require_react_development(), 1), jsx_dev_runtime268 = __toESM(require_react_jsx_dev_runtime_development(), 1), LogoHeader = React84.memo(function(t0) {
    let $3 = import_compiler_runtime213.c(3), {
      agentDefinitions
    } = t0, t1;
    if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
      t1 = /* @__PURE__ */ jsx_dev_runtime268.jsxDEV(LogoV2, {}, void 0, !1, void 0, this), $3[0] = t1;
    else
      t1 = $3[0];
    let t2;
    if ($3[1] !== agentDefinitions)
      t2 = /* @__PURE__ */ jsx_dev_runtime268.jsxDEV(OffscreenFreeze, {
        children: /* @__PURE__ */ jsx_dev_runtime268.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          gap: 1,
          children: [
            t1,
            /* @__PURE__ */ jsx_dev_runtime268.jsxDEV(React84.Suspense, {
              fallback: null,
              children: /* @__PURE__ */ jsx_dev_runtime268.jsxDEV(StatusNotices, {
                agentDefinitions
              }, void 0, !1, void 0, this)
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this), $3[1] = agentDefinitions, $3[2] = t2;
    else
      t2 = $3[2];
    return t2;
  }), BRIEF_TOOL_NAME6 = (init_prompt(), __toCommonJS(exports_prompt)).BRIEF_TOOL_NAME;
  Messages4 = React84.memo(MessagesImpl, (prev, next2) => {
    let keys3 = Object.keys(prev);
    for (let key3 of keys3) {
      if (key3 === "onOpenRateLimitOptions" || key3 === "scrollRef" || key3 === "trackStickyPrompt" || key3 === "setCursor" || key3 === "cursorNavRef" || key3 === "jumpRef" || key3 === "onSearchMatchesChange" || key3 === "scanElement" || key3 === "setPositions")
        continue;
      if (prev[key3] !== next2[key3]) {
        if (key3 === "streamingToolUses") {
          let p4 = prev.streamingToolUses, n5 = next2.streamingToolUses;
          if (p4.length === n5.length && p4.every((item, i5) => item.contentBlock === n5[i5]?.contentBlock))
            continue;
        }
        if (key3 === "inProgressToolUseIDs") {
          if (setsEqual(prev.inProgressToolUseIDs, next2.inProgressToolUseIDs))
            continue;
        }
        if (key3 === "unseenDivider") {
          let p4 = prev.unseenDivider, n5 = next2.unseenDivider;
          if (p4?.firstUnseenUuid === n5?.firstUnseenUuid && p4?.count === n5?.count)
            continue;
        }
        if (key3 === "tools") {
          let p4 = prev.tools, n5 = next2.tools;
          if (p4.length === n5.length && p4.every((tool, i5) => tool.name === n5[i5]?.name))
            continue;
        }
        return !1;
      }
    }
    return !0;
  });
});
