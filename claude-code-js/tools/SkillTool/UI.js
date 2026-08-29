// Original: src/tools/SkillTool/UI.tsx
function renderToolResultMessage5(output) {
  if ("status" in output && output.status === "forked")
    return /* @__PURE__ */ jsx_dev_runtime120.jsxDEV(MessageResponse, {
      height: 1,
      children: /* @__PURE__ */ jsx_dev_runtime120.jsxDEV(ThemedText, {
        children: /* @__PURE__ */ jsx_dev_runtime120.jsxDEV(Byline, {
          children: ["Done"]
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this);
  let parts = ["Successfully loaded skill"];
  if ("allowedTools" in output && output.allowedTools && output.allowedTools.length > 0) {
    let count3 = output.allowedTools.length;
    parts.push(`${count3} ${plural(count3, "tool")} allowed`);
  }
  if ("model" in output && output.model)
    parts.push(output.model);
  return /* @__PURE__ */ jsx_dev_runtime120.jsxDEV(MessageResponse, {
    height: 1,
    children: /* @__PURE__ */ jsx_dev_runtime120.jsxDEV(ThemedText, {
      children: /* @__PURE__ */ jsx_dev_runtime120.jsxDEV(Byline, {
        children: parts
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this)
  }, void 0, !1, void 0, this);
}
function renderToolUseMessage6({
  skill
}, {
  commands: commands7
}) {
  if (!skill)
    return null;
  return commands7?.find((c3) => c3.name === skill)?.loadedFrom === "commands_DEPRECATED" ? `/${skill}` : skill;
}
function renderToolUseProgressMessage4(progressMessages, {
  tools,
  verbose
}) {
  if (!progressMessages.length)
    return /* @__PURE__ */ jsx_dev_runtime120.jsxDEV(MessageResponse, {
      height: 1,
      children: /* @__PURE__ */ jsx_dev_runtime120.jsxDEV(ThemedText, {
        dimColor: !0,
        children: INITIALIZING_TEXT2
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this);
  let displayedMessages = verbose ? progressMessages : progressMessages.slice(-MAX_PROGRESS_MESSAGES_TO_SHOW2), hiddenCount = progressMessages.length - displayedMessages.length, {
    inProgressToolUseIDs
  } = buildSubagentLookups(progressMessages.map((pm) => pm.data));
  return /* @__PURE__ */ jsx_dev_runtime120.jsxDEV(MessageResponse, {
    children: /* @__PURE__ */ jsx_dev_runtime120.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        /* @__PURE__ */ jsx_dev_runtime120.jsxDEV(SubAgentProvider, {
          children: displayedMessages.map((progressMessage) => /* @__PURE__ */ jsx_dev_runtime120.jsxDEV(ThemedBox_default, {
            height: 1,
            overflow: "hidden",
            children: /* @__PURE__ */ jsx_dev_runtime120.jsxDEV(Message4, {
              message: progressMessage.data.message,
              lookups: EMPTY_LOOKUPS,
              addMargin: !1,
              tools,
              commands: [],
              verbose,
              inProgressToolUseIDs,
              progressMessagesForMessage: [],
              shouldAnimate: !1,
              shouldShowDot: !1,
              style: "condensed",
              isTranscriptMode: !1,
              isStatic: !0
            }, void 0, !1, void 0, this)
          }, progressMessage.uuid, !1, void 0, this))
        }, void 0, !1, void 0, this),
        hiddenCount > 0 && /* @__PURE__ */ jsx_dev_runtime120.jsxDEV(ThemedText, {
          dimColor: !0,
          children: [
            "+",
            hiddenCount,
            " more tool ",
            plural(hiddenCount, "use")
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this)
  }, void 0, !1, void 0, this);
}
function renderToolUseRejectedMessage2(_input, {
  progressMessagesForMessage,
  tools,
  verbose
}) {
  return /* @__PURE__ */ jsx_dev_runtime120.jsxDEV(jsx_dev_runtime120.Fragment, {
    children: [
      renderToolUseProgressMessage4(progressMessagesForMessage, {
        tools,
        verbose
      }),
      /* @__PURE__ */ jsx_dev_runtime120.jsxDEV(FallbackToolUseRejectedMessage, {}, void 0, !1, void 0, this)
    ]
  }, void 0, !0, void 0, this);
}
function renderToolUseErrorMessage2(result, {
  progressMessagesForMessage,
  tools,
  verbose
}) {
  return /* @__PURE__ */ jsx_dev_runtime120.jsxDEV(jsx_dev_runtime120.Fragment, {
    children: [
      renderToolUseProgressMessage4(progressMessagesForMessage, {
        tools,
        verbose
      }),
      /* @__PURE__ */ jsx_dev_runtime120.jsxDEV(FallbackToolUseErrorMessage, {
        result,
        verbose
      }, void 0, !1, void 0, this)
    ]
  }, void 0, !0, void 0, this);
}
var jsx_dev_runtime120, MAX_PROGRESS_MESSAGES_TO_SHOW2 = 3, INITIALIZING_TEXT2 = "Initializing\u2026";
var init_UI5 = __esm(() => {
  init_CtrlOToExpand();
  init_FallbackToolUseErrorMessage();
  init_FallbackToolUseRejectedMessage();
  init_Byline();
  init_Message3();
  init_MessageResponse();
  init_ink2();
  init_messages3();
  jsx_dev_runtime120 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
