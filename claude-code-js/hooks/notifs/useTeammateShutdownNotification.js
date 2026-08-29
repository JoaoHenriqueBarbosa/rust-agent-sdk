// Original: src/hooks/notifs/useTeammateShutdownNotification.ts
function parseCount(notif) {
  if (!("text" in notif))
    return 1;
  let match = notif.text.match(/^(\d+)/);
  return match?.[1] ? parseInt(match[1], 10) : 1;
}
function foldSpawn(acc, _incoming) {
  return makeSpawnNotif(parseCount(acc) + 1);
}
function makeSpawnNotif(count4) {
  return {
    key: "teammate-spawn",
    text: count4 === 1 ? "1 agent spawned" : `${count4} agents spawned`,
    priority: "low",
    timeoutMs: 5000,
    fold: foldSpawn
  };
}
function foldShutdown(acc, _incoming) {
  return makeShutdownNotif(parseCount(acc) + 1);
}
function makeShutdownNotif(count4) {
  return {
    key: "teammate-shutdown",
    text: count4 === 1 ? "1 agent shut down" : `${count4} agents shut down`,
    priority: "low",
    timeoutMs: 5000,
    fold: foldShutdown
  };
}
function useTeammateLifecycleNotification() {
  let tasks2 = useAppState((s2) => s2.tasks), { addNotification } = useNotifications(), seenRunningRef = import_react294.useRef(/* @__PURE__ */ new Set), seenCompletedRef = import_react294.useRef(/* @__PURE__ */ new Set);
  import_react294.useEffect(() => {
    if (getIsRemoteMode())
      return;
    for (let [id, task] of Object.entries(tasks2)) {
      if (!isInProcessTeammateTask(task))
        continue;
      if (task.status === "running" && !seenRunningRef.current.has(id))
        seenRunningRef.current.add(id), addNotification(makeSpawnNotif(1));
      if (task.status === "completed" && !seenCompletedRef.current.has(id))
        seenCompletedRef.current.add(id), addNotification(makeShutdownNotif(1));
    }
  }, [tasks2, addNotification]);
}
var import_react294;
var init_useTeammateShutdownNotification = __esm(() => {
  init_state();
  init_notifications();
  init_AppState();
  import_react294 = __toESM(require_react_development(), 1);
});
