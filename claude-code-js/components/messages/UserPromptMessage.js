// Original: src/components/messages/UserPromptMessage.tsx
function UserPromptMessage({
  addMargin,
  param: {
    text: text2
  },
  isTranscriptMode,
  timestamp
}) {
  let isBriefOnly = useAppState((s2) => s2.isBriefOnly), viewingAgentTaskId = useAppState((s_0) => s_0.viewingAgentTaskId), briefEnvEnabled = import_react66.useMemo(() => isEnvTruthy(process.env.CLAUDE_CODE_BRIEF), []), useBriefLayout = (getKairosActive() || getUserMsgOptIn() && (briefEnvEnabled || !0)) && isBriefOnly && !isTranscriptMode && !viewingAgentTaskId, displayText = import_react66.useMemo(() => {
    if (text2.length <= MAX_DISPLAY_CHARS)
      return text2;
    let head = text2.slice(0, TRUNCATE_HEAD_CHARS), tail = text2.slice(-TRUNCATE_TAIL_CHARS), hiddenLines = countCharInString(text2, `
`, TRUNCATE_HEAD_CHARS) - countCharInString(tail, `
`);
    return `${head}
\u2026 +${hiddenLines} lines \u2026
${tail}`;
  }, [text2]), isSelected = import_react66.useContext(MessageActionsSelectedContext);
  if (!text2)
    return logError2(Error("No content found in user prompt message")), null;
  return /* @__PURE__ */ jsx_dev_runtime90.jsxDEV(ThemedBox_default, {
    flexDirection: "column",
    marginTop: addMargin ? 1 : 0,
    backgroundColor: isSelected ? "messageActionsBackground" : useBriefLayout ? void 0 : "userMessageBackground",
    paddingRight: useBriefLayout ? 0 : 1,
    children: /* @__PURE__ */ jsx_dev_runtime90.jsxDEV(HighlightedThinkingText, {
      text: displayText,
      useBriefLayout,
      timestamp: useBriefLayout ? timestamp : void 0
    }, void 0, !1, void 0, this)
  }, void 0, !1, void 0, this);
}
var import_react66, jsx_dev_runtime90, MAX_DISPLAY_CHARS = 1e4, TRUNCATE_HEAD_CHARS = 2500, TRUNCATE_TAIL_CHARS = 2500;
var init_UserPromptMessage = __esm(() => {
  init_state();
  init_ink2();
  init_AppState();
  init_envUtils();
  init_log3();
  init_messageActions();
  init_HighlightedThinkingText();
  import_react66 = __toESM(require_react_development(), 1), jsx_dev_runtime90 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
