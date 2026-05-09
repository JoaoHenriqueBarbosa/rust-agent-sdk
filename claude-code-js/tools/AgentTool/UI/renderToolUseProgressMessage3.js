// function: renderToolUseProgressMessage3
function renderToolUseProgressMessage3(progressMessages, {
  tools,
  verbose,
  terminalSize,
  inProgressToolCallCount,
  isTranscriptMode = !1
}) {
  if (!progressMessages.length)
    return /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(MessageResponse, {
      height: 1,
      children: /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(ThemedText, {
        dimColor: !0,
        children: INITIALIZING_TEXT
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this);
  let toolToolRenderLinesEstimate = (inProgressToolCallCount ?? 1) * ESTIMATED_LINES_PER_TOOL + TERMINAL_BUFFER_LINES, shouldUseCondensedMode = !isTranscriptMode && terminalSize && terminalSize.rows && terminalSize.rows < toolToolRenderLinesEstimate, getProgressStats = () => {
    let toolUseCount = count2(progressMessages, (msg) => {
      if (!hasProgressMessage(msg.data))
        return !1;
      return msg.data.message.message.content.some((content) => content.type === "tool_use");
    }), latestAssistant = progressMessages.findLast((msg) => hasProgressMessage(msg.data) && msg.data.message.type === "assistant"), tokens = null;
    if (latestAssistant?.data.message.type === "assistant") {
      let usage = latestAssistant.data.message.message.usage;
      tokens = (usage.cache_creation_input_tokens ?? 0) + (usage.cache_read_input_tokens ?? 0) + usage.input_tokens + usage.output_tokens;
    }
    return {
      toolUseCount,
      tokens
    };
  };
  if (shouldUseCondensedMode) {
    let {
      toolUseCount,
      tokens
    } = getProgressStats();
    return /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(MessageResponse, {
      height: 1,
      children: /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          "In progress\u2026 \xB7 ",
          /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(ThemedText, {
            bold: !0,
            children: toolUseCount
          }, void 0, !1, void 0, this),
          " tool",
          " ",
          toolUseCount === 1 ? "use" : "uses",
          tokens && ` \xB7 ${formatNumber(tokens)} tokens`,
          " \xB7",
          " ",
          /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(ConfigurableShortcutHint, {
            action: "app:toggleTranscript",
            context: "Global",
            fallback: "ctrl+o",
            description: "expand",
            parens: !0
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this);
  }
  let processedMessages = processProgressMessages(progressMessages, tools, !0), displayedMessages = isTranscriptMode ? processedMessages : processedMessages.slice(-MAX_PROGRESS_MESSAGES_TO_SHOW), hiddenMessages = isTranscriptMode ? [] : processedMessages.slice(0, Math.max(0, processedMessages.length - MAX_PROGRESS_MESSAGES_TO_SHOW)), hiddenToolUseCount = count2(hiddenMessages, (m4) => {
    if (m4.type === "summary")
      return m4.searchCount + m4.readCount + m4.replCount > 0;
    let data = m4.message.data;
    if (!hasProgressMessage(data))
      return !1;
    return data.message.message.content.some((content) => content.type === "tool_use");
  }), firstData = progressMessages[0]?.data, prompt = firstData && hasProgressMessage(firstData) ? firstData.prompt : void 0;
  if (displayedMessages.length === 0 && !(isTranscriptMode && prompt))
    return /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(MessageResponse, {
      height: 1,
      children: /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(ThemedText, {
        dimColor: !0,
        children: INITIALIZING_TEXT
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this);
  let {
    lookups: subagentLookups,
    inProgressToolUseIDs: collapsedInProgressIDs
  } = buildSubagentLookups(progressMessages.filter((pm) => hasProgressMessage(pm.data)).map((pm) => pm.data));
  return /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(MessageResponse, {
    children: /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(SubAgentProvider, {
          children: [
            isTranscriptMode && prompt && /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(ThemedBox_default, {
              marginBottom: 1,
              children: /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(AgentPromptDisplay, {
                prompt
              }, void 0, !1, void 0, this)
            }, void 0, !1, void 0, this),
            displayedMessages.map((processed) => {
              if (processed.type === "summary") {
                let summaryText = getSearchReadSummaryText(processed.searchCount, processed.readCount, processed.isActive, processed.replCount);
                return /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(ThemedBox_default, {
                  height: 1,
                  overflow: "hidden",
                  children: /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(ThemedText, {
                    dimColor: !0,
                    children: summaryText
                  }, void 0, !1, void 0, this)
                }, processed.uuid, !1, void 0, this);
              }
              return /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(Message4, {
                message: processed.message.data.message,
                lookups: subagentLookups,
                addMargin: !1,
                tools,
                commands: [],
                verbose,
                inProgressToolUseIDs: collapsedInProgressIDs,
                progressMessagesForMessage: [],
                shouldAnimate: !1,
                shouldShowDot: !1,
                style: "condensed",
                isTranscriptMode: !1,
                isStatic: !0
              }, processed.message.uuid, !1, void 0, this);
            })
          ]
        }, void 0, !0, void 0, this),
        hiddenToolUseCount > 0 && /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(ThemedText, {
          dimColor: !0,
          children: [
            "+",
            hiddenToolUseCount,
            " more tool",
            " ",
            hiddenToolUseCount === 1 ? "use" : "uses",
            " ",
            /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(CtrlOToExpand, {}, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this)
  }, void 0, !1, void 0, this);
}
