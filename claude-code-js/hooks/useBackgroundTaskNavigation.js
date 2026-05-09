// Original: src/hooks/useBackgroundTaskNavigation.ts
function stepTeammateSelection(delta, setAppState) {
  setAppState((prev) => {
    let currentCount = getRunningTeammatesSorted(prev.tasks).length;
    if (currentCount === 0)
      return prev;
    if (prev.expandedView !== "teammates")
      return {
        ...prev,
        expandedView: "teammates",
        viewSelectionMode: "selecting-agent",
        selectedIPAgentIndex: -1
      };
    let maxIdx = currentCount, cur = prev.selectedIPAgentIndex, next2 = delta === 1 ? cur >= maxIdx ? -1 : cur + 1 : cur <= -1 ? maxIdx : cur - 1;
    return {
      ...prev,
      selectedIPAgentIndex: next2,
      viewSelectionMode: "selecting-agent"
    };
  });
}
function useBackgroundTaskNavigation(options2) {
  let tasks2 = useAppState((s2) => s2.tasks), viewSelectionMode = useAppState((s2) => s2.viewSelectionMode), viewingAgentTaskId = useAppState((s2) => s2.viewingAgentTaskId), selectedIPAgentIndex = useAppState((s2) => s2.selectedIPAgentIndex), setAppState = useSetAppState(), teammateTasks = getRunningTeammatesSorted(tasks2), teammateCount = teammateTasks.length, hasNonTeammateBackgroundTasks = Object.values(tasks2).some((t2) => isBackgroundTask(t2) && t2.type !== "in_process_teammate"), prevTeammateCountRef = import_react266.useRef(teammateCount);
  import_react266.useEffect(() => {
    let prevCount = prevTeammateCountRef.current;
    prevTeammateCountRef.current = teammateCount, setAppState((prev) => {
      let currentCount = getRunningTeammatesSorted(prev.tasks).length;
      if (currentCount === 0 && prevCount > 0 && prev.selectedIPAgentIndex !== -1) {
        if (prev.viewSelectionMode === "viewing-agent")
          return {
            ...prev,
            selectedIPAgentIndex: -1
          };
        return {
          ...prev,
          selectedIPAgentIndex: -1,
          viewSelectionMode: "none"
        };
      }
      let maxIndex = prev.expandedView === "teammates" ? currentCount : currentCount - 1;
      if (currentCount > 0 && prev.selectedIPAgentIndex > maxIndex)
        return {
          ...prev,
          selectedIPAgentIndex: maxIndex
        };
      return prev;
    });
  }, [teammateCount, setAppState]);
  let getSelectedTeammate = () => {
    if (teammateCount === 0)
      return null;
    let task = teammateTasks[selectedIPAgentIndex];
    if (!task)
      return null;
    return { taskId: task.id, task };
  }, handleKeyDown = (e) => {
    if (e.key === "escape" && viewSelectionMode === "viewing-agent") {
      e.preventDefault();
      let taskId = viewingAgentTaskId;
      if (taskId) {
        let task = tasks2[taskId];
        if (isInProcessTeammateTask(task) && task.status === "running") {
          task.currentWorkAbortController?.abort();
          return;
        }
      }
      exitTeammateView(setAppState);
      return;
    }
    if (e.key === "escape" && viewSelectionMode === "selecting-agent") {
      e.preventDefault(), setAppState((prev) => ({
        ...prev,
        viewSelectionMode: "none",
        selectedIPAgentIndex: -1
      }));
      return;
    }
    if (e.shift && (e.key === "up" || e.key === "down")) {
      if (e.preventDefault(), teammateCount > 0)
        stepTeammateSelection(e.key === "down" ? 1 : -1, setAppState);
      else if (hasNonTeammateBackgroundTasks)
        options2?.onOpenBackgroundTasks?.();
      return;
    }
    if (e.key === "f" && viewSelectionMode === "selecting-agent" && teammateCount > 0) {
      e.preventDefault();
      let selected = getSelectedTeammate();
      if (selected)
        enterTeammateView(selected.taskId, setAppState);
      return;
    }
    if (e.key === "return" && viewSelectionMode === "selecting-agent") {
      if (e.preventDefault(), selectedIPAgentIndex === -1)
        exitTeammateView(setAppState);
      else if (selectedIPAgentIndex >= teammateCount)
        setAppState((prev) => ({
          ...prev,
          expandedView: "none",
          viewSelectionMode: "none",
          selectedIPAgentIndex: -1
        }));
      else {
        let selected = getSelectedTeammate();
        if (selected)
          enterTeammateView(selected.taskId, setAppState);
      }
      return;
    }
    if (e.key === "k" && viewSelectionMode === "selecting-agent" && selectedIPAgentIndex >= 0) {
      e.preventDefault();
      let selected = getSelectedTeammate();
      if (selected && selected.task.status === "running")
        InProcessTeammateTask.kill(selected.taskId, setAppState);
      return;
    }
  };
  return use_input_default((_input, _key, event) => {
    handleKeyDown(new KeyboardEvent(event.keypress));
  }), { handleKeyDown };
}
var import_react266;
var init_useBackgroundTaskNavigation = __esm(() => {
  init_keyboard_event();
  init_ink2();
  init_AppState();
  init_teammateViewHelpers();
  init_InProcessTeammateTask();
  import_react266 = __toESM(require_react_development(), 1);
});
