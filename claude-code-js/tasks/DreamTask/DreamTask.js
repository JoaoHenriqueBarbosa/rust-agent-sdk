// Original: src/tasks/DreamTask/DreamTask.ts
function isDreamTask(task) {
  return typeof task === "object" && task !== null && "type" in task && task.type === "dream";
}
function registerDreamTask(setAppState, opts) {
  let id = generateTaskId("dream"), task = {
    ...createTaskStateBase(id, "dream", "dreaming"),
    type: "dream",
    status: "running",
    phase: "starting",
    sessionsReviewing: opts.sessionsReviewing,
    filesTouched: [],
    turns: [],
    abortController: opts.abortController,
    priorMtime: opts.priorMtime
  };
  return registerTask(task, setAppState), id;
}
function addDreamTurn(taskId, turn, touchedPaths, setAppState) {
  updateTaskState(taskId, setAppState, (task) => {
    let seen = new Set(task.filesTouched), newTouched = touchedPaths.filter((p4) => !seen.has(p4) && seen.add(p4));
    if (turn.text === "" && turn.toolUseCount === 0 && newTouched.length === 0)
      return task;
    return {
      ...task,
      phase: newTouched.length > 0 ? "updating" : task.phase,
      filesTouched: newTouched.length > 0 ? [...task.filesTouched, ...newTouched] : task.filesTouched,
      turns: task.turns.slice(-(MAX_TURNS - 1)).concat(turn)
    };
  });
}
function completeDreamTask(taskId, setAppState) {
  updateTaskState(taskId, setAppState, (task) => ({
    ...task,
    status: "completed",
    endTime: Date.now(),
    notified: !0,
    abortController: void 0
  }));
}
function failDreamTask(taskId, setAppState) {
  updateTaskState(taskId, setAppState, (task) => ({
    ...task,
    status: "failed",
    endTime: Date.now(),
    notified: !0,
    abortController: void 0
  }));
}
var MAX_TURNS = 30, DreamTask;
var init_DreamTask = __esm(() => {
  init_consolidationLock();
  init_Task();
  init_framework();
  DreamTask = {
    name: "DreamTask",
    type: "dream",
    async kill(taskId, setAppState) {
      let priorMtime;
      if (updateTaskState(taskId, setAppState, (task) => {
        if (task.status !== "running")
          return task;
        return task.abortController?.abort(), priorMtime = task.priorMtime, {
          ...task,
          status: "killed",
          endTime: Date.now(),
          notified: !0,
          abortController: void 0
        };
      }), priorMtime !== void 0)
        await rollbackConsolidationLock(priorMtime);
    }
  };
});
