// Original: src/components/messages/UserToolResultMessage/UserToolSuccessMessage.tsx
function UserToolSuccessMessage({
  message,
  lookups,
  toolUseID,
  progressMessagesForMessage,
  style,
  tool,
  tools,
  verbose,
  width,
  isTranscriptMode
}) {
  let [theme] = useTheme(), isBriefOnly = useAppState((s2) => s2.isBriefOnly), [classifierRule] = React33.useState(() => getClassifierApproval(toolUseID)), [yoloReason] = React33.useState(() => getYoloClassifierApproval(toolUseID));
  if (React33.useEffect(() => {
    deleteClassifierApproval(toolUseID);
  }, [toolUseID]), !message.toolUseResult || !tool)
    return null;
  let parsedOutput = tool.outputSchema?.safeParse(message.toolUseResult);
  if (parsedOutput && !parsedOutput.success)
    return null;
  let toolResult = parsedOutput?.data ?? message.toolUseResult, renderedMessage = tool.renderToolResultMessage?.(toolResult, filterToolProgressMessages(progressMessagesForMessage), {
    style,
    theme,
    tools,
    verbose,
    isTranscriptMode,
    isBriefOnly,
    input: lookups.toolUseByToolUseID.get(toolUseID)?.input
  }) ?? null;
  if (renderedMessage === null)
    return null;
  let rendersAsAssistantText = tool.userFacingName(void 0) === "";
  return /* @__PURE__ */ jsx_dev_runtime112.jsxDEV(ThemedBox_default, {
    flexDirection: "column",
    children: [
      /* @__PURE__ */ jsx_dev_runtime112.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        width: rendersAsAssistantText ? void 0 : width,
        children: [
          renderedMessage,
          null,
          null
        ]
      }, void 0, !0, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime112.jsxDEV(SentryErrorBoundary, {
        children: /* @__PURE__ */ jsx_dev_runtime112.jsxDEV(HookProgressMessage, {
          hookEvent: "PostToolUse",
          lookups,
          toolUseID,
          verbose,
          isTranscriptMode
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this)
    ]
  }, void 0, !0, void 0, this);
}
var React33, jsx_dev_runtime112;
var init_UserToolSuccessMessage = __esm(() => {
  init_SentryErrorBoundary();
  init_ink2();
  init_AppState();
  init_Tool();
  init_classifierApprovals();
  init_MessageResponse();
  init_HookProgressMessage();
  React33 = __toESM(require_react_development(), 1), jsx_dev_runtime112 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
