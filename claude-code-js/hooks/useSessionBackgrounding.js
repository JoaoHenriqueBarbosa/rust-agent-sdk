// Original: src/hooks/useSessionBackgrounding.ts
function useSessionBackgrounding({
  setMessages,
  setIsLoading,
  resetLoadingState,
  setAbortController,
  onBackgroundQuery
}) {
  let foregroundedTaskId = useAppState((s2) => s2.foregroundedTaskId), foregroundedTask = useAppState((s2) => s2.foregroundedTaskId ? s2.tasks[s2.foregroundedTaskId] : void 0), setAppState = useSetAppState(), lastSyncedMessagesLengthRef = import_react280.useRef(0), handleBackgroundSession = import_react280.useCallback(() => {
    if (foregroundedTaskId) {
      setAppState((prev) => {
        let taskId = prev.foregroundedTaskId;
        if (!taskId)
          return prev;
        let task = prev.tasks[taskId];
        if (!task)
          return { ...prev, foregroundedTaskId: void 0 };
        return {
          ...prev,
          foregroundedTaskId: void 0,
          tasks: {
            ...prev.tasks,
            [taskId]: { ...task, isBackgrounded: !0 }
          }
        };
      }), setMessages([]), resetLoadingState(), setAbortController(null);
      return;
    }
    onBackgroundQuery();
  }, [
    foregroundedTaskId,
    setAppState,
    setMessages,
    resetLoadingState,
    setAbortController,
    onBackgroundQuery
  ]);
  return import_react280.useEffect(() => {
    if (!foregroundedTaskId) {
      lastSyncedMessagesLengthRef.current = 0;
      return;
    }
    if (!foregroundedTask || foregroundedTask.type !== "local_agent") {
      setAppState((prev) => ({ ...prev, foregroundedTaskId: void 0 })), resetLoadingState(), lastSyncedMessagesLengthRef.current = 0;
      return;
    }
    let taskMessages = foregroundedTask.messages ?? [];
    if (taskMessages.length !== lastSyncedMessagesLengthRef.current)
      lastSyncedMessagesLengthRef.current = taskMessages.length, setMessages([...taskMessages]);
    if (foregroundedTask.status === "running") {
      let taskAbortController = foregroundedTask.abortController;
      if (taskAbortController?.signal.aborted) {
        setAppState((prev) => {
          if (!prev.foregroundedTaskId)
            return prev;
          let task = prev.tasks[prev.foregroundedTaskId];
          if (!task)
            return { ...prev, foregroundedTaskId: void 0 };
          return {
            ...prev,
            foregroundedTaskId: void 0,
            tasks: {
              ...prev.tasks,
              [prev.foregroundedTaskId]: { ...task, isBackgrounded: !0 }
            }
          };
        }), resetLoadingState(), setAbortController(null), lastSyncedMessagesLengthRef.current = 0;
        return;
      }
      if (setIsLoading(!0), taskAbortController)
        setAbortController(taskAbortController);
    } else
      setAppState((prev) => {
        let taskId = prev.foregroundedTaskId;
        if (!taskId)
          return prev;
        let task = prev.tasks[taskId];
        if (!task)
          return { ...prev, foregroundedTaskId: void 0 };
        return {
          ...prev,
          foregroundedTaskId: void 0,
          tasks: { ...prev.tasks, [taskId]: { ...task, isBackgrounded: !0 } }
        };
      }), resetLoadingState(), setAbortController(null), lastSyncedMessagesLengthRef.current = 0;
  }, [
    foregroundedTaskId,
    foregroundedTask,
    setAppState,
    setMessages,
    setIsLoading,
    resetLoadingState,
    setAbortController
  ]), {
    handleBackgroundSession
  };
}
var import_react280;
var init_useSessionBackgrounding = __esm(() => {
  init_AppState();
  import_react280 = __toESM(require_react_development(), 1);
});
