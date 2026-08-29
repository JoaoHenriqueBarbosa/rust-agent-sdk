// Original: src/components/tasks/taskStatusUtils.tsx
function getTaskStatusIcon(status2, options2) {
  let {
    isIdle,
    awaitingApproval,
    hasError,
    shutdownRequested
  } = options2 ?? {};
  if (hasError)
    return figures_default.cross;
  if (awaitingApproval)
    return figures_default.questionMarkPrefix;
  if (shutdownRequested)
    return figures_default.warning;
  if (status2 === "running") {
    if (isIdle)
      return figures_default.ellipsis;
    return figures_default.play;
  }
  if (status2 === "completed")
    return figures_default.tick;
  if (status2 === "failed" || status2 === "killed")
    return figures_default.cross;
  return figures_default.bullet;
}
function getTaskStatusColor(status2, options2) {
  let {
    isIdle,
    awaitingApproval,
    hasError,
    shutdownRequested
  } = options2 ?? {};
  if (hasError)
    return "error";
  if (awaitingApproval)
    return "warning";
  if (shutdownRequested)
    return "warning";
  if (isIdle)
    return "background";
  if (status2 === "completed")
    return "success";
  if (status2 === "failed")
    return "error";
  if (status2 === "killed")
    return "warning";
  return "background";
}
function describeTeammateActivity(t2) {
  if (t2.shutdownRequested)
    return "stopping";
  if (t2.awaitingPlanApproval)
    return "awaiting approval";
  if (t2.isIdle)
    return "idle";
  return (t2.progress?.recentActivities && summarizeRecentActivities(t2.progress.recentActivities)) ?? t2.progress?.lastActivity?.activityDescription ?? "working";
}
function shouldHideTasksFooter(tasks, showSpinnerTree) {
  if (!showSpinnerTree)
    return !1;
  let hasVisibleTask = !1;
  for (let t2 of Object.values(tasks)) {
    if (!isBackgroundTask(t2))
      continue;
    if (hasVisibleTask = !0, t2.type !== "in_process_teammate")
      return !1;
  }
  return hasVisibleTask;
}
var init_taskStatusUtils = __esm(() => {
  init_figures();
  init_LocalAgentTask();
  init_collapseReadSearch();
});
