// Original: src/components/PromptInput/usePromptInputPlaceholder.ts
function usePromptInputPlaceholder({
  input,
  submitCount,
  viewingAgentName
}) {
  let queuedCommands = useCommandQueue(), promptSuggestionEnabled = useAppState((s2) => s2.promptSuggestionEnabled);
  return import_react255.useMemo(() => {
    if (input !== "")
      return;
    if (viewingAgentName)
      return `Message @${viewingAgentName.length > MAX_TEAMMATE_NAME_LENGTH ? viewingAgentName.slice(0, MAX_TEAMMATE_NAME_LENGTH - 3) + "..." : viewingAgentName}\u2026`;
    if (queuedCommands.some(isQueuedCommandEditable) && (getGlobalConfig().queuedCommandUpHintCount || 0) < NUM_TIMES_QUEUE_HINT_SHOWN)
      return "Press up to edit queued messages";
    if (submitCount < 1 && promptSuggestionEnabled && !proactiveModule6?.isProactiveActive())
      return getExampleCommandFromCache();
  }, [
    input,
    queuedCommands,
    submitCount,
    promptSuggestionEnabled,
    viewingAgentName
  ]);
}
var import_react255, proactiveModule6 = null, NUM_TIMES_QUEUE_HINT_SHOWN = 3, MAX_TEAMMATE_NAME_LENGTH = 20;
var init_usePromptInputPlaceholder = __esm(() => {
  init_useCommandQueue();
  init_AppState();
  init_config4();
  init_exampleCommands();
  init_messageQueueManager();
  import_react255 = __toESM(require_react_development(), 1);
});
