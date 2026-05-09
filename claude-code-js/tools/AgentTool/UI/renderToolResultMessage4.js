// function: renderToolResultMessage4
function renderToolResultMessage4(data, progressMessagesForMessage, {
  tools,
  verbose,
  theme,
  isTranscriptMode = !1
}) {
  let internal2 = data;
  if (internal2.status === "remote_launched")
    return /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(MessageResponse, {
        height: 1,
        children: /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(ThemedText, {
          children: [
            "Remote agent launched",
            " ",
            /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(ThemedText, {
              dimColor: !0,
              children: [
                "\xB7 ",
                internal2.taskId,
                " \xB7 ",
                internal2.sessionUrl
              ]
            }, void 0, !0, void 0, this)
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this);
  if (data.status === "async_launched") {
    let {
      prompt: prompt2
    } = data;
    return /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(MessageResponse, {
          height: 1,
          children: /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(ThemedText, {
            children: [
              "Backgrounded agent",
              !isTranscriptMode && /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(ThemedText, {
                dimColor: !0,
                children: [
                  " (",
                  /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(Byline, {
                    children: [
                      /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(KeyboardShortcutHint, {
                        shortcut: "\u2193",
                        action: "manage"
                      }, void 0, !1, void 0, this),
                      prompt2 && /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(ConfigurableShortcutHint, {
                        action: "app:toggleTranscript",
                        context: "Global",
                        fallback: "ctrl+o",
                        description: "expand"
                      }, void 0, !1, void 0, this)
                    ]
                  }, void 0, !0, void 0, this),
                  ")"
                ]
              }, void 0, !0, void 0, this)
            ]
          }, void 0, !0, void 0, this)
        }, void 0, !1, void 0, this),
        isTranscriptMode && prompt2 && /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(MessageResponse, {
          children: /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(AgentPromptDisplay, {
            prompt: prompt2,
            theme
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this);
  }
  if (data.status !== "completed")
    return null;
  let {
    agentId,
    totalDurationMs,
    totalToolUseCount,
    totalTokens,
    usage,
    content,
    prompt
  } = data, completionMessage = `Done (${[totalToolUseCount === 1 ? "1 tool use" : `${totalToolUseCount} tool uses`, formatNumber(totalTokens) + " tokens", formatDuration(totalDurationMs)].join(" \xB7 ")})`, finalAssistantMessage = createAssistantMessage({
    content: completionMessage,
    usage: {
      ...usage,
      inference_geo: null,
      iterations: null,
      speed: null
    }
  });
  return /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(ThemedBox_default, {
    flexDirection: "column",
    children: [
      !1,
      isTranscriptMode && prompt && /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(MessageResponse, {
        children: /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(AgentPromptDisplay, {
          prompt,
          theme
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this),
      isTranscriptMode ? /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(SubAgentProvider, {
        children: /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(VerboseAgentTranscript, {
          progressMessages: progressMessagesForMessage,
          tools,
          verbose
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this) : null,
      isTranscriptMode && content && content.length > 0 && /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(MessageResponse, {
        children: /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(AgentResponseDisplay, {
          content,
          theme
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(MessageResponse, {
        height: 1,
        children: /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(Message4, {
          message: finalAssistantMessage,
          lookups: EMPTY_LOOKUPS,
          addMargin: !1,
          tools,
          commands: [],
          verbose,
          inProgressToolUseIDs: /* @__PURE__ */ new Set,
          progressMessagesForMessage: [],
          shouldAnimate: !1,
          shouldShowDot: !1,
          isTranscriptMode: !1,
          isStatic: !0
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this),
      !isTranscriptMode && /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          "  ",
          /* @__PURE__ */ jsx_dev_runtime116.jsxDEV(CtrlOToExpand, {}, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this)
    ]
  }, void 0, !0, void 0, this);
}
