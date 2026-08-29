// Original: src/hooks/useTasksV2.ts
import { watch as watch2 } from "fs";

class TasksV2Store {
  #tasks = void 0;
  #hidden = !1;
  #watcher = null;
  #watchedDir = null;
  #hideTimer = null;
  #debounceTimer = null;
  #pollTimer = null;
  #unsubscribeTasksUpdated = null;
  #changed = createSignal();
  #subscriberCount = 0;
  #started = !1;
  getSnapshot = () => {
    return this.#hidden ? void 0 : this.#tasks;
  };
  subscribe = (fn) => {
    let unsubscribe = this.#changed.subscribe(fn);
    if (this.#subscriberCount++, !this.#started)
      this.#started = !0, this.#unsubscribeTasksUpdated = onTasksUpdated(this.#debouncedFetch), this.#fetch();
    let unsubscribed = !1;
    return () => {
      if (unsubscribed)
        return;
      if (unsubscribed = !0, unsubscribe(), this.#subscriberCount--, this.#subscriberCount === 0)
        this.#stop();
    };
  };
  #notify() {
    this.#changed.emit();
  }
  #rewatch(dir) {
    if (dir === this.#watchedDir && this.#watcher !== null)
      return;
    this.#watcher?.close(), this.#watcher = null, this.#watchedDir = dir;
    try {
      this.#watcher = watch2(dir, this.#debouncedFetch), this.#watcher.unref();
    } catch {}
  }
  #debouncedFetch = () => {
    if (this.#debounceTimer)
      clearTimeout(this.#debounceTimer);
    this.#debounceTimer = setTimeout(() => void this.#fetch(), DEBOUNCE_MS), this.#debounceTimer.unref();
  };
  #fetch = async () => {
    let taskListId = getTaskListId();
    this.#rewatch(getTasksDir(taskListId));
    let current = (await listTasks(taskListId)).filter((t2) => !t2.metadata?._internal);
    this.#tasks = current;
    let hasIncomplete = current.some((t2) => t2.status !== "completed");
    if (hasIncomplete || current.length === 0)
      this.#hidden = current.length === 0, this.#clearHideTimer();
    else if (this.#hideTimer === null && !this.#hidden)
      this.#hideTimer = setTimeout(this.#onHideTimerFired.bind(this, taskListId), HIDE_DELAY_MS), this.#hideTimer.unref();
    if (this.#notify(), this.#pollTimer)
      clearTimeout(this.#pollTimer), this.#pollTimer = null;
    if (hasIncomplete)
      this.#pollTimer = setTimeout(this.#debouncedFetch, FALLBACK_POLL_MS), this.#pollTimer.unref();
  };
  #onHideTimerFired(scheduledForTaskListId) {
    this.#hideTimer = null;
    let currentId = getTaskListId();
    if (currentId !== scheduledForTaskListId)
      return;
    listTasks(currentId).then(async (tasksToCheck) => {
      if (tasksToCheck.length > 0 && tasksToCheck.every((t2) => t2.status === "completed"))
        await resetTaskList(currentId), this.#tasks = [], this.#hidden = !0;
      this.#notify();
    });
  }
  #clearHideTimer() {
    if (this.#hideTimer)
      clearTimeout(this.#hideTimer), this.#hideTimer = null;
  }
  #stop() {
    if (this.#watcher?.close(), this.#watcher = null, this.#watchedDir = null, this.#unsubscribeTasksUpdated?.(), this.#unsubscribeTasksUpdated = null, this.#clearHideTimer(), this.#debounceTimer)
      clearTimeout(this.#debounceTimer);
    if (this.#pollTimer)
      clearTimeout(this.#pollTimer);
    this.#debounceTimer = null, this.#pollTimer = null, this.#started = !1;
  }
}
function getStore2() {
  return _store ??= new TasksV2Store;
}
function useTasksV2() {
  let teamContext = useAppState((s2) => s2.teamContext), store = isTodoV2Enabled() && (!teamContext || isTeamLead(teamContext)) ? getStore2() : null;
  return import_react51.useSyncExternalStore(store ? store.subscribe : NOOP_SUBSCRIBE, store ? store.getSnapshot : NOOP_SNAPSHOT);
}
function useTasksV2WithCollapseEffect() {
  let tasks = useTasksV2(), setAppState = useSetAppState(), hidden2 = tasks === void 0;
  return import_react51.useEffect(() => {
    if (!hidden2)
      return;
    setAppState((prev) => {
      if (prev.expandedView !== "tasks")
        return prev;
      return { ...prev, expandedView: "none" };
    });
  }, [hidden2, setAppState]), tasks;
}
var import_react51, HIDE_DELAY_MS = 5000, DEBOUNCE_MS = 50, FALLBACK_POLL_MS = 5000, _store = null, NOOP = () => {}, NOOP_SUBSCRIBE = () => NOOP, NOOP_SNAPSHOT = () => {
  return;
};
var init_useTasksV2 = __esm(() => {
  init_AppState();
  init_tasks();
  init_teammate();
  import_react51 = __toESM(require_react_development(), 1);
});
