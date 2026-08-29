// Original: src/components/TaskListV2.tsx
function byIdAsc(a2, b) {
  let aNum = parseInt(a2.id, 10), bNum = parseInt(b.id, 10);
  if (!isNaN(aNum) && !isNaN(bNum))
    return aNum - bNum;
  return a2.id.localeCompare(b.id);
}
function TaskListV2({
  tasks,
  isStandalone = !1
}) {
  let teamContext = useAppState((s2) => s2.teamContext), appStateTasks = useAppState((s_0) => s_0.tasks), [, forceUpdate] = React22.useState(0), {
    rows,
    columns
  } = useTerminalSize(), completionTimestampsRef = React22.useRef(/* @__PURE__ */ new Map), previousCompletedIdsRef = React22.useRef(null);
  if (previousCompletedIdsRef.current === null)
    previousCompletedIdsRef.current = new Set(tasks.filter((t2) => t2.status === "completed").map((t_0) => t_0.id));
  let maxDisplay = rows <= 10 ? 0 : Math.min(10, Math.max(3, rows - 14)), currentCompletedIds = new Set(tasks.filter((t_1) => t_1.status === "completed").map((t_2) => t_2.id)), now2 = Date.now();
  for (let id of currentCompletedIds)
    if (!previousCompletedIdsRef.current.has(id))
      completionTimestampsRef.current.set(id, now2);
  for (let id_0 of completionTimestampsRef.current.keys())
    if (!currentCompletedIds.has(id_0))
      completionTimestampsRef.current.delete(id_0);
  if (previousCompletedIdsRef.current = currentCompletedIds, React22.useEffect(() => {
    if (completionTimestampsRef.current.size === 0)
      return;
    let currentNow = Date.now(), earliestExpiry = 1 / 0;
    for (let ts of completionTimestampsRef.current.values()) {
      let expiry = ts + RECENT_COMPLETED_TTL_MS;
      if (expiry > currentNow && expiry < earliestExpiry)
        earliestExpiry = expiry;
    }
    if (earliestExpiry === 1 / 0)
      return;
    let timer = setTimeout((forceUpdate_0) => forceUpdate_0((n5) => n5 + 1), earliestExpiry - currentNow, forceUpdate);
    return () => clearTimeout(timer);
  }, [tasks]), !isTodoV2Enabled())
    return null;
  if (tasks.length === 0)
    return null;
  let teammateColors = {};
  if (isAgentSwarmsEnabled() && teamContext?.teammates) {
    for (let teammate of Object.values(teamContext.teammates))
      if (teammate.color) {
        let themeColor = AGENT_COLOR_TO_THEME_COLOR[teammate.color];
        if (themeColor)
          teammateColors[teammate.name] = themeColor;
      }
  }
  let teammateActivity = {}, activeTeammates = /* @__PURE__ */ new Set;
  if (isAgentSwarmsEnabled()) {
    for (let bgTask of Object.values(appStateTasks))
      if (isInProcessTeammateTask(bgTask) && bgTask.status === "running") {
        activeTeammates.add(bgTask.identity.agentName), activeTeammates.add(bgTask.identity.agentId);
        let activities = bgTask.progress?.recentActivities, desc = (activities && summarizeRecentActivities(activities)) ?? bgTask.progress?.lastActivity?.activityDescription;
        if (desc)
          teammateActivity[bgTask.identity.agentName] = desc, teammateActivity[bgTask.identity.agentId] = desc;
      }
  }
  let completedCount = count2(tasks, (t_3) => t_3.status === "completed"), pendingCount = count2(tasks, (t_4) => t_4.status === "pending"), inProgressCount = tasks.length - completedCount - pendingCount, unresolvedTaskIds = new Set(tasks.filter((t_5) => t_5.status !== "completed").map((t_6) => t_6.id)), needsTruncation = tasks.length > maxDisplay, visibleTasks, hiddenTasks;
  if (needsTruncation) {
    let recentCompleted = [], olderCompleted = [];
    for (let task of tasks.filter((t_7) => t_7.status === "completed")) {
      let ts_0 = completionTimestampsRef.current.get(task.id);
      if (ts_0 && now2 - ts_0 < RECENT_COMPLETED_TTL_MS)
        recentCompleted.push(task);
      else
        olderCompleted.push(task);
    }
    recentCompleted.sort(byIdAsc), olderCompleted.sort(byIdAsc);
    let inProgress = tasks.filter((t_8) => t_8.status === "in_progress").sort(byIdAsc), pending = tasks.filter((t_9) => t_9.status === "pending").sort((a2, b) => {
      let aBlocked = a2.blockedBy.some((id_1) => unresolvedTaskIds.has(id_1)), bBlocked = b.blockedBy.some((id_2) => unresolvedTaskIds.has(id_2));
      if (aBlocked !== bBlocked)
        return aBlocked ? 1 : -1;
      return byIdAsc(a2, b);
    }), prioritized = [...recentCompleted, ...inProgress, ...pending, ...olderCompleted];
    visibleTasks = prioritized.slice(0, maxDisplay), hiddenTasks = prioritized.slice(maxDisplay);
  } else
    visibleTasks = [...tasks].sort(byIdAsc), hiddenTasks = [];
  let hiddenSummary = "";
  if (hiddenTasks.length > 0) {
    let parts = [], hiddenPending = count2(hiddenTasks, (t_10) => t_10.status === "pending"), hiddenInProgress = count2(hiddenTasks, (t_11) => t_11.status === "in_progress"), hiddenCompleted = count2(hiddenTasks, (t_12) => t_12.status === "completed");
    if (hiddenInProgress > 0)
      parts.push(`${hiddenInProgress} in progress`);
    if (hiddenPending > 0)
      parts.push(`${hiddenPending} pending`);
    if (hiddenCompleted > 0)
      parts.push(`${hiddenCompleted} completed`);
    hiddenSummary = ` \u2026 +${parts.join(", ")}`;
  }
  let content = /* @__PURE__ */ jsx_dev_runtime62.jsxDEV(jsx_dev_runtime62.Fragment, {
    children: [
      visibleTasks.map((task_0) => /* @__PURE__ */ jsx_dev_runtime62.jsxDEV(TaskItem, {
        task: task_0,
        ownerColor: task_0.owner ? teammateColors[task_0.owner] : void 0,
        openBlockers: task_0.blockedBy.filter((id_3) => unresolvedTaskIds.has(id_3)),
        activity: task_0.owner ? teammateActivity[task_0.owner] : void 0,
        ownerActive: task_0.owner ? activeTeammates.has(task_0.owner) : !1,
        columns
      }, task_0.id, !1, void 0, this)),
      maxDisplay > 0 && hiddenSummary && /* @__PURE__ */ jsx_dev_runtime62.jsxDEV(ThemedText, {
        dimColor: !0,
        children: hiddenSummary
      }, void 0, !1, void 0, this)
    ]
  }, void 0, !0, void 0, this);
  if (isStandalone)
    return /* @__PURE__ */ jsx_dev_runtime62.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginTop: 1,
      marginLeft: 2,
      children: [
        /* @__PURE__ */ jsx_dev_runtime62.jsxDEV(ThemedBox_default, {
          children: /* @__PURE__ */ jsx_dev_runtime62.jsxDEV(ThemedText, {
            dimColor: !0,
            children: [
              /* @__PURE__ */ jsx_dev_runtime62.jsxDEV(ThemedText, {
                bold: !0,
                children: tasks.length
              }, void 0, !1, void 0, this),
              " tasks (",
              /* @__PURE__ */ jsx_dev_runtime62.jsxDEV(ThemedText, {
                bold: !0,
                children: completedCount
              }, void 0, !1, void 0, this),
              " done, ",
              inProgressCount > 0 && /* @__PURE__ */ jsx_dev_runtime62.jsxDEV(jsx_dev_runtime62.Fragment, {
                children: [
                  /* @__PURE__ */ jsx_dev_runtime62.jsxDEV(ThemedText, {
                    bold: !0,
                    children: inProgressCount
                  }, void 0, !1, void 0, this),
                  " in progress, "
                ]
              }, void 0, !0, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime62.jsxDEV(ThemedText, {
                bold: !0,
                children: pendingCount
              }, void 0, !1, void 0, this),
              " open)"
            ]
          }, void 0, !0, void 0, this)
        }, void 0, !1, void 0, this),
        content
      ]
    }, void 0, !0, void 0, this);
  return /* @__PURE__ */ jsx_dev_runtime62.jsxDEV(ThemedBox_default, {
    flexDirection: "column",
    children: content
  }, void 0, !1, void 0, this);
}
function getTaskIcon(status) {
  switch (status) {
    case "completed":
      return {
        icon: figures_default.tick,
        color: "success"
      };
    case "in_progress":
      return {
        icon: figures_default.squareSmallFilled,
        color: "claude"
      };
    case "pending":
      return {
        icon: figures_default.squareSmall,
        color: void 0
      };
  }
}
function TaskItem(t0) {
  let $3 = import_compiler_runtime54.c(37), {
    task,
    ownerColor,
    openBlockers,
    activity,
    ownerActive,
    columns
  } = t0, isCompleted = task.status === "completed", isInProgress = task.status === "in_progress", isBlocked = openBlockers.length > 0, t1;
  if ($3[0] !== task.status)
    t1 = getTaskIcon(task.status), $3[0] = task.status, $3[1] = t1;
  else
    t1 = $3[1];
  let {
    icon,
    color: color2
  } = t1, showActivity = isInProgress && !isBlocked && activity, showOwner = columns >= 60 && task.owner && ownerActive, t2;
  if ($3[2] !== showOwner || $3[3] !== task.owner)
    t2 = showOwner ? stringWidth(` (@${task.owner})`) : 0, $3[2] = showOwner, $3[3] = task.owner, $3[4] = t2;
  else
    t2 = $3[4];
  let ownerWidth = t2, maxSubjectWidth = Math.max(15, columns - 15 - ownerWidth), t3;
  if ($3[5] !== maxSubjectWidth || $3[6] !== task.subject)
    t3 = truncateToWidth(task.subject, maxSubjectWidth), $3[5] = maxSubjectWidth, $3[6] = task.subject, $3[7] = t3;
  else
    t3 = $3[7];
  let displaySubject = t3, maxActivityWidth = Math.max(15, columns - 15), t4;
  if ($3[8] !== activity || $3[9] !== maxActivityWidth)
    t4 = activity ? truncateToWidth(activity, maxActivityWidth) : void 0, $3[8] = activity, $3[9] = maxActivityWidth, $3[10] = t4;
  else
    t4 = $3[10];
  let displayActivity = t4, t5;
  if ($3[11] !== color2 || $3[12] !== icon)
    t5 = /* @__PURE__ */ jsx_dev_runtime62.jsxDEV(ThemedText, {
      color: color2,
      children: [
        icon,
        " "
      ]
    }, void 0, !0, void 0, this), $3[11] = color2, $3[12] = icon, $3[13] = t5;
  else
    t5 = $3[13];
  let t6 = isCompleted || isBlocked, t7;
  if ($3[14] !== displaySubject || $3[15] !== isCompleted || $3[16] !== isInProgress || $3[17] !== t6)
    t7 = /* @__PURE__ */ jsx_dev_runtime62.jsxDEV(ThemedText, {
      bold: isInProgress,
      strikethrough: isCompleted,
      dimColor: t6,
      children: displaySubject
    }, void 0, !1, void 0, this), $3[14] = displaySubject, $3[15] = isCompleted, $3[16] = isInProgress, $3[17] = t6, $3[18] = t7;
  else
    t7 = $3[18];
  let t8;
  if ($3[19] !== ownerColor || $3[20] !== showOwner || $3[21] !== task.owner)
    t8 = showOwner && /* @__PURE__ */ jsx_dev_runtime62.jsxDEV(ThemedText, {
      dimColor: !0,
      children: [
        " (",
        ownerColor ? /* @__PURE__ */ jsx_dev_runtime62.jsxDEV(ThemedText, {
          color: ownerColor,
          children: [
            "@",
            task.owner
          ]
        }, void 0, !0, void 0, this) : `@${task.owner}`,
        ")"
      ]
    }, void 0, !0, void 0, this), $3[19] = ownerColor, $3[20] = showOwner, $3[21] = task.owner, $3[22] = t8;
  else
    t8 = $3[22];
  let t9;
  if ($3[23] !== isBlocked || $3[24] !== openBlockers)
    t9 = isBlocked && /* @__PURE__ */ jsx_dev_runtime62.jsxDEV(ThemedText, {
      dimColor: !0,
      children: [
        " ",
        figures_default.pointerSmall,
        " blocked by",
        " ",
        [...openBlockers].sort(_temp14).map(_temp25).join(", ")
      ]
    }, void 0, !0, void 0, this), $3[23] = isBlocked, $3[24] = openBlockers, $3[25] = t9;
  else
    t9 = $3[25];
  let t10;
  if ($3[26] !== t5 || $3[27] !== t7 || $3[28] !== t8 || $3[29] !== t9)
    t10 = /* @__PURE__ */ jsx_dev_runtime62.jsxDEV(ThemedBox_default, {
      children: [
        t5,
        t7,
        t8,
        t9
      ]
    }, void 0, !0, void 0, this), $3[26] = t5, $3[27] = t7, $3[28] = t8, $3[29] = t9, $3[30] = t10;
  else
    t10 = $3[30];
  let t11;
  if ($3[31] !== displayActivity || $3[32] !== showActivity)
    t11 = showActivity && displayActivity && /* @__PURE__ */ jsx_dev_runtime62.jsxDEV(ThemedBox_default, {
      children: /* @__PURE__ */ jsx_dev_runtime62.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          "  ",
          displayActivity,
          figures_default.ellipsis
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[31] = displayActivity, $3[32] = showActivity, $3[33] = t11;
  else
    t11 = $3[33];
  let t12;
  if ($3[34] !== t10 || $3[35] !== t11)
    t12 = /* @__PURE__ */ jsx_dev_runtime62.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        t10,
        t11
      ]
    }, void 0, !0, void 0, this), $3[34] = t10, $3[35] = t11, $3[36] = t12;
  else
    t12 = $3[36];
  return t12;
}
function _temp25(id) {
  return `#${id}`;
}
function _temp14(a2, b) {
  return parseInt(a2, 10) - parseInt(b, 10);
}
var import_compiler_runtime54, React22, jsx_dev_runtime62, RECENT_COMPLETED_TTL_MS = 30000;
var init_TaskListV2 = __esm(() => {
  init_figures();
  init_useTerminalSize();
  init_stringWidth();
  init_ink2();
  init_AppState();
  init_agentColorManager();
  init_agentSwarmsEnabled();
  init_collapseReadSearch();
  init_format();
  init_tasks();
  init_ThemedText();
  import_compiler_runtime54 = __toESM(require_react_compiler_runtime_development(), 1), React22 = __toESM(require_react_development(), 1), jsx_dev_runtime62 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
