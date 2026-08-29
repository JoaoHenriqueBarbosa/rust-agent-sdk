// Original: src/components/PromptInput/PromptInputFooter.tsx
function PromptInputFooter({
  apiKeyStatus,
  debug,
  exitMessage,
  vimMode,
  mode,
  autoUpdaterResult,
  isAutoUpdating,
  verbose,
  onAutoUpdaterResult,
  onChangeIsUpdating,
  suggestions,
  selectedSuggestion,
  maxColumnWidth,
  toolPermissionContext,
  helpOpen,
  suppressHint: suppressHintFromProps,
  isLoading,
  tasksSelected,
  teamsSelected,
  bridgeSelected,
  tmuxSelected,
  teammateFooterIndex,
  ideSelection,
  mcpClients,
  isPasting = !1,
  isInputWrapped = !1,
  messages,
  isSearching,
  historyQuery,
  setHistoryQuery,
  historyFailedMatch,
  onOpenTasksDialog
}) {
  let settings = useSettings(), {
    columns,
    rows
  } = useTerminalSize(), messagesRef = import_react252.useRef(messages);
  messagesRef.current = messages;
  let lastAssistantMessageId = import_react252.useMemo(() => getLastAssistantMessageId(messages), [messages]), isNarrow = columns < 80, isFullscreen = isFullscreenEnvEnabled(), isShort = isFullscreen && rows < 24, coordinatorTaskCount = useCoordinatorTaskCount(), coordinatorTaskIndex = useAppState((s2) => s2.coordinatorTaskIndex), pillSelected = tasksSelected && (coordinatorTaskCount === 0 || coordinatorTaskIndex < 0), suppressHint = suppressHintFromProps || statusLineShouldDisplay(settings) || isSearching, overlayData = import_react252.useMemo(() => isFullscreen && suggestions.length ? {
    suggestions,
    selectedSuggestion,
    maxColumnWidth
  } : null, [isFullscreen, suggestions, selectedSuggestion, maxColumnWidth]);
  if (useSetPromptOverlay(overlayData), suggestions.length && !isFullscreen)
    return /* @__PURE__ */ jsx_dev_runtime430.jsxDEV(ThemedBox_default, {
      paddingX: 2,
      paddingY: 0,
      children: /* @__PURE__ */ jsx_dev_runtime430.jsxDEV(PromptInputFooterSuggestions, {
        suggestions,
        selectedSuggestion,
        maxColumnWidth
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this);
  if (helpOpen)
    return /* @__PURE__ */ jsx_dev_runtime430.jsxDEV(PromptInputHelpMenu, {
      dimColor: !0,
      fixedWidth: !0,
      paddingX: 2
    }, void 0, !1, void 0, this);
  return /* @__PURE__ */ jsx_dev_runtime430.jsxDEV(jsx_dev_runtime430.Fragment, {
    children: [
      /* @__PURE__ */ jsx_dev_runtime430.jsxDEV(ThemedBox_default, {
        flexDirection: isNarrow ? "column" : "row",
        justifyContent: isNarrow ? "flex-start" : "space-between",
        paddingX: 2,
        gap: isNarrow ? 0 : 1,
        children: [
          /* @__PURE__ */ jsx_dev_runtime430.jsxDEV(ThemedBox_default, {
            flexDirection: "column",
            flexShrink: isNarrow ? 0 : 1,
            children: [
              mode === "prompt" && !isShort && !exitMessage.show && !isPasting && statusLineShouldDisplay(settings) && /* @__PURE__ */ jsx_dev_runtime430.jsxDEV(StatusLine, {
                messagesRef,
                lastAssistantMessageId,
                vimMode
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime430.jsxDEV(PromptInputFooterLeftSide, {
                exitMessage,
                vimMode,
                mode,
                toolPermissionContext,
                suppressHint,
                isLoading,
                tasksSelected: pillSelected,
                teamsSelected,
                teammateFooterIndex,
                tmuxSelected,
                isPasting,
                isSearching,
                historyQuery,
                setHistoryQuery,
                historyFailedMatch,
                onOpenTasksDialog
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime430.jsxDEV(ThemedBox_default, {
            flexShrink: 1,
            gap: 1,
            children: [
              isFullscreen ? null : /* @__PURE__ */ jsx_dev_runtime430.jsxDEV(Notifications, {
                apiKeyStatus,
                autoUpdaterResult,
                debug,
                isAutoUpdating,
                verbose,
                messages,
                onAutoUpdaterResult,
                onChangeIsUpdating,
                ideSelection,
                mcpClients,
                isInputWrapped,
                isNarrow
              }, void 0, !1, void 0, this),
              !1,
              /* @__PURE__ */ jsx_dev_runtime430.jsxDEV(BridgeStatusIndicator, {
                bridgeSelected
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this)
        ]
      }, void 0, !0, void 0, this),
      !1
    ]
  }, void 0, !0, void 0, this);
}
function BridgeStatusIndicator({
  bridgeSelected
}) {
  return null;
}
var import_react252, jsx_dev_runtime430, PromptInputFooter_default;
var init_PromptInputFooter = __esm(() => {
  init_promptOverlayContext();
  init_useSettings();
  init_useTerminalSize();
  init_ink2();
  init_AppState();
  init_fullscreen();
  init_undercover();
  init_CoordinatorAgentStatus();
  init_StatusLine();
  init_Notifications();
  init_PromptInputFooterLeftSide();
  init_PromptInputFooterSuggestions();
  init_PromptInputHelpMenu();
  import_react252 = __toESM(require_react_development(), 1), jsx_dev_runtime430 = __toESM(require_react_jsx_dev_runtime_development(), 1);
  PromptInputFooter_default = import_react252.memo(PromptInputFooter);
});
