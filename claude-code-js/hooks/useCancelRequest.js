// Original: src/hooks/useCancelRequest.ts
function CancelRequestHandler(props) {
  let {
    setToolUseConfirmQueue,
    onCancel,
    onAgentsKilled,
    isMessageSelectorVisible,
    screen,
    abortSignal,
    popCommandFromQueue,
    vimMode,
    isLocalJSXCommand,
    isSearchingHistory,
    isHelpOpen,
    inputMode,
    inputValue,
    streamMode
  } = props, store = useAppStateStore(), setAppState = useSetAppState(), queuedCommandsLength = useCommandQueue().length, { addNotification, removeNotification } = useNotifications(), lastKillAgentsPressRef = import_react265.useRef(0), viewSelectionMode = useAppState((s2) => s2.viewSelectionMode), handleCancel = import_react265.useCallback(() => {
    let cancelProps = {
      source: "escape",
      streamMode
    };
    if (abortSignal !== void 0 && !abortSignal.aborted) {
      logEvent("tengu_cancel", cancelProps), setToolUseConfirmQueue(() => []), onCancel();
      return;
    }
    if (hasCommandsInQueue()) {
      if (popCommandFromQueue) {
        popCommandFromQueue();
        return;
      }
    }
    logEvent("tengu_cancel", cancelProps), setToolUseConfirmQueue(() => []), onCancel();
  }, [
    abortSignal,
    popCommandFromQueue,
    setToolUseConfirmQueue,
    onCancel,
    streamMode
  ]), isOverlayActive = useIsOverlayActive(), canCancelRunningTask = abortSignal !== void 0 && !abortSignal.aborted, hasQueuedCommands = queuedCommandsLength > 0, isInSpecialModeWithEmptyInput = inputMode !== void 0 && inputMode !== "prompt" && !inputValue, isViewingTeammate = viewSelectionMode === "viewing-agent", isContextActive = screen !== "transcript" && !isSearchingHistory && !isMessageSelectorVisible && !isLocalJSXCommand && !isHelpOpen && !isOverlayActive && !(isVimModeEnabled() && vimMode === "INSERT"), isEscapeActive = isContextActive && (canCancelRunningTask || hasQueuedCommands) && !isInSpecialModeWithEmptyInput && !isViewingTeammate, isCtrlCActive = isContextActive && (canCancelRunningTask || hasQueuedCommands || isViewingTeammate);
  useKeybinding("chat:cancel", handleCancel, {
    context: "Chat",
    isActive: isEscapeActive
  });
  let killAllAgentsAndNotify = import_react265.useCallback(() => {
    let tasks2 = store.getState().tasks, running = Object.entries(tasks2).filter(([, t2]) => t2.type === "local_agent" && t2.status === "running");
    if (running.length === 0)
      return !1;
    killAllRunningAgentTasks(tasks2, setAppState);
    let descriptions = [];
    for (let [taskId, task] of running)
      markAgentsNotified(taskId, setAppState), descriptions.push(task.description), emitTaskTerminatedSdk(taskId, "stopped", {
        toolUseId: task.toolUseId,
        summary: task.description
      });
    let summary = descriptions.length === 1 ? `Background agent "${descriptions[0]}" was stopped by the user.` : `${descriptions.length} background agents were stopped by the user: ${descriptions.map((d) => `"${d}"`).join(", ")}.`;
    return enqueuePendingNotification({ value: summary, mode: "task-notification" }), onAgentsKilled(), !0;
  }, [store, setAppState, onAgentsKilled]), handleInterrupt = import_react265.useCallback(() => {
    if (isViewingTeammate)
      killAllAgentsAndNotify(), exitTeammateView(setAppState);
    if (canCancelRunningTask || hasQueuedCommands)
      handleCancel();
  }, [
    isViewingTeammate,
    killAllAgentsAndNotify,
    setAppState,
    canCancelRunningTask,
    hasQueuedCommands,
    handleCancel
  ]);
  useKeybinding("app:interrupt", handleInterrupt, {
    context: "Global",
    isActive: isCtrlCActive
  });
  let handleKillAgents = import_react265.useCallback(() => {
    let tasks2 = store.getState().tasks;
    if (!Object.values(tasks2).some((t2) => t2.type === "local_agent" && t2.status === "running")) {
      addNotification({
        key: "kill-agents-none",
        text: "No background agents running",
        priority: "immediate",
        timeoutMs: 2000
      });
      return;
    }
    let now2 = Date.now();
    if (now2 - lastKillAgentsPressRef.current <= KILL_AGENTS_CONFIRM_WINDOW_MS) {
      lastKillAgentsPressRef.current = 0, removeNotification("kill-agents-confirm"), logEvent("tengu_cancel", {
        source: "kill_agents"
      }), clearCommandQueue(), killAllAgentsAndNotify();
      return;
    }
    lastKillAgentsPressRef.current = now2;
    let shortcut = getShortcutDisplay("chat:killAgents", "Chat", "ctrl+x ctrl+k");
    addNotification({
      key: "kill-agents-confirm",
      text: `Press ${shortcut} again to stop background agents`,
      priority: "immediate",
      timeoutMs: KILL_AGENTS_CONFIRM_WINDOW_MS
    });
  }, [store, addNotification, removeNotification, killAllAgentsAndNotify]);
  return useKeybinding("chat:killAgents", handleKillAgents, {
    context: "Chat"
  }), null;
}
var import_react265, KILL_AGENTS_CONFIRM_WINDOW_MS = 3000;
var init_useCancelRequest = __esm(() => {
  init_AppState();
  init_utils16();
  init_notifications();
  init_overlayContext();
  init_useCommandQueue();
  init_shortcutFormat();
  init_useKeybinding();
  init_teammateViewHelpers();
  init_LocalAgentTask();
  init_messageQueueManager();
  init_sdkEventQueue();
  import_react265 = __toESM(require_react_development(), 1);
});
