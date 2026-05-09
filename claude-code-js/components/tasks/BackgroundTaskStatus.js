// Original: src/components/tasks/BackgroundTaskStatus.tsx
function BackgroundTaskStatus(t0) {
  let $3 = import_compiler_runtime328.c(48), {
    tasksSelected,
    isViewingTeammate,
    teammateFooterIndex: t1,
    isLeaderIdle: t2,
    onOpenDialog
  } = t0, teammateFooterIndex = t1 === void 0 ? 0 : t1, isLeaderIdle = t2 === void 0 ? !1 : t2, setAppState = useSetAppState(), {
    columns
  } = useTerminalSize(), tasks2 = useAppState(_temp198), viewingAgentTaskId = useAppState(_temp281), t3;
  if ($3[0] !== tasks2)
    t3 = Object.values(tasks2 ?? {}).filter(_temp353), $3[0] = tasks2, $3[1] = t3;
  else
    t3 = $3[1];
  let runningTasks = t3, showSpinnerTree = useAppState(_temp440) === "teammates", allTeammates = !showSpinnerTree && runningTasks.length > 0 && runningTasks.every(_temp528), t4;
  if ($3[2] !== runningTasks)
    t4 = runningTasks.filter(_temp622).sort(_temp720), $3[2] = runningTasks, $3[3] = t4;
  else
    t4 = $3[3];
  let teammateEntries = t4, t5;
  if ($3[4] !== isLeaderIdle)
    t5 = {
      name: "main",
      color: void 0,
      isIdle: isLeaderIdle,
      taskId: void 0
    }, $3[4] = isLeaderIdle, $3[5] = t5;
  else
    t5 = $3[5];
  let mainPill = t5, t6;
  if ($3[6] !== mainPill || $3[7] !== tasksSelected || $3[8] !== teammateEntries) {
    let teammatePills = teammateEntries.map(_temp817);
    if (!tasksSelected)
      teammatePills.sort(_temp915);
    t6 = [mainPill, ...teammatePills].map(_temp07), $3[6] = mainPill, $3[7] = tasksSelected, $3[8] = teammateEntries, $3[9] = t6;
  } else
    t6 = $3[9];
  let allPills = t6, t7;
  if ($3[10] !== allPills)
    t7 = allPills.map(_temp135), $3[10] = allPills, $3[11] = t7;
  else
    t7 = $3[11];
  let pillWidths = t7;
  if (allTeammates || !showSpinnerTree && isViewingTeammate) {
    let selectedIdx = tasksSelected ? teammateFooterIndex : -1, t82;
    if ($3[12] !== teammateEntries || $3[13] !== viewingAgentTaskId)
      t82 = viewingAgentTaskId ? teammateEntries.findIndex((t_3) => t_3.id === viewingAgentTaskId) + 1 : 0, $3[12] = teammateEntries, $3[13] = viewingAgentTaskId, $3[14] = t82;
    else
      t82 = $3[14];
    let viewedIdx = t82, availableWidth = Math.max(20, columns - 20 - 4), t92 = selectedIdx >= 0 ? selectedIdx : 0, t102;
    if ($3[15] !== availableWidth || $3[16] !== pillWidths || $3[17] !== t92)
      t102 = calculateHorizontalScrollWindow(pillWidths, availableWidth, 2, t92), $3[15] = availableWidth, $3[16] = pillWidths, $3[17] = t92, $3[18] = t102;
    else
      t102 = $3[18];
    let {
      startIndex,
      endIndex,
      showLeftArrow,
      showRightArrow
    } = t102, t112;
    if ($3[19] !== allPills || $3[20] !== endIndex || $3[21] !== startIndex)
      t112 = allPills.slice(startIndex, endIndex), $3[19] = allPills, $3[20] = endIndex, $3[21] = startIndex, $3[22] = t112;
    else
      t112 = $3[22];
    let visiblePills = t112, t12;
    if ($3[23] !== showLeftArrow)
      t12 = showLeftArrow && /* @__PURE__ */ jsx_dev_runtime425.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          figures_default.arrowLeft,
          " "
        ]
      }, void 0, !0, void 0, this), $3[23] = showLeftArrow, $3[24] = t12;
    else
      t12 = $3[24];
    let t13;
    if ($3[25] !== selectedIdx || $3[26] !== setAppState || $3[27] !== viewedIdx || $3[28] !== visiblePills)
      t13 = visiblePills.map((pill_1, i_1) => {
        let needsSeparator = i_1 > 0;
        return /* @__PURE__ */ jsx_dev_runtime425.jsxDEV(React136.Fragment, {
          children: [
            needsSeparator && /* @__PURE__ */ jsx_dev_runtime425.jsxDEV(ThemedText, {
              children: " "
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime425.jsxDEV(AgentPill, {
              name: pill_1.name,
              color: pill_1.color,
              isSelected: selectedIdx === pill_1.idx,
              isViewed: viewedIdx === pill_1.idx,
              isIdle: pill_1.isIdle,
              onClick: () => pill_1.taskId ? enterTeammateView(pill_1.taskId, setAppState) : exitTeammateView(setAppState)
            }, void 0, !1, void 0, this)
          ]
        }, pill_1.name, !0, void 0, this);
      }), $3[25] = selectedIdx, $3[26] = setAppState, $3[27] = viewedIdx, $3[28] = visiblePills, $3[29] = t13;
    else
      t13 = $3[29];
    let t14;
    if ($3[30] !== showRightArrow)
      t14 = showRightArrow && /* @__PURE__ */ jsx_dev_runtime425.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          " ",
          figures_default.arrowRight
        ]
      }, void 0, !0, void 0, this), $3[30] = showRightArrow, $3[31] = t14;
    else
      t14 = $3[31];
    let t15;
    if ($3[32] === Symbol.for("react.memo_cache_sentinel"))
      t15 = /* @__PURE__ */ jsx_dev_runtime425.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          " \xB7 ",
          /* @__PURE__ */ jsx_dev_runtime425.jsxDEV(KeyboardShortcutHint, {
            shortcut: "shift + \u2193",
            action: "expand"
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this), $3[32] = t15;
    else
      t15 = $3[32];
    let t16;
    if ($3[33] !== t12 || $3[34] !== t13 || $3[35] !== t14)
      t16 = /* @__PURE__ */ jsx_dev_runtime425.jsxDEV(jsx_dev_runtime425.Fragment, {
        children: [
          t12,
          t13,
          t14,
          t15
        ]
      }, void 0, !0, void 0, this), $3[33] = t12, $3[34] = t13, $3[35] = t14, $3[36] = t16;
    else
      t16 = $3[36];
    return t16;
  }
  if (shouldHideTasksFooter(tasks2 ?? {}, showSpinnerTree))
    return null;
  if (runningTasks.length === 0)
    return null;
  let t8;
  if ($3[37] !== runningTasks)
    t8 = getPillLabel(runningTasks), $3[37] = runningTasks, $3[38] = t8;
  else
    t8 = $3[38];
  let t9;
  if ($3[39] !== onOpenDialog || $3[40] !== t8 || $3[41] !== tasksSelected)
    t9 = /* @__PURE__ */ jsx_dev_runtime425.jsxDEV(SummaryPill, {
      selected: tasksSelected,
      onClick: onOpenDialog,
      children: t8
    }, void 0, !1, void 0, this), $3[39] = onOpenDialog, $3[40] = t8, $3[41] = tasksSelected, $3[42] = t9;
  else
    t9 = $3[42];
  let t10;
  if ($3[43] !== runningTasks)
    t10 = pillNeedsCta(runningTasks) && /* @__PURE__ */ jsx_dev_runtime425.jsxDEV(ThemedText, {
      dimColor: !0,
      children: [
        " \xB7 ",
        figures_default.arrowDown,
        " to view"
      ]
    }, void 0, !0, void 0, this), $3[43] = runningTasks, $3[44] = t10;
  else
    t10 = $3[44];
  let t11;
  if ($3[45] !== t10 || $3[46] !== t9)
    t11 = /* @__PURE__ */ jsx_dev_runtime425.jsxDEV(jsx_dev_runtime425.Fragment, {
      children: [
        t9,
        t10
      ]
    }, void 0, !0, void 0, this), $3[45] = t10, $3[46] = t9, $3[47] = t11;
  else
    t11 = $3[47];
  return t11;
}
function _temp135(pill_0, i_0) {
  let pillText = `@${pill_0.name}`;
  return stringWidth(pillText) + (i_0 > 0 ? 1 : 0);
}
function _temp07(pill, i5) {
  return {
    ...pill,
    idx: i5
  };
}
function _temp915(a_0, b_0) {
  if (a_0.isIdle !== b_0.isIdle)
    return a_0.isIdle ? 1 : -1;
  return 0;
}
function _temp817(t_2) {
  return {
    name: t_2.identity.agentName,
    color: getAgentThemeColor(t_2.identity.color),
    isIdle: t_2.isIdle,
    taskId: t_2.id
  };
}
function _temp720(a2, b) {
  return a2.identity.agentName.localeCompare(b.identity.agentName);
}
function _temp622(t_1) {
  return t_1.type === "in_process_teammate";
}
function _temp528(t_0) {
  return t_0.type === "in_process_teammate";
}
function _temp440(s_1) {
  return s_1.expandedView;
}
function _temp353(t2) {
  return isBackgroundTask(t2);
}
function _temp281(s_0) {
  return s_0.viewingAgentTaskId;
}
function _temp198(s2) {
  return s2.tasks;
}
function AgentPill(t0) {
  let $3 = import_compiler_runtime328.c(19), {
    name: name3,
    color: color3,
    isSelected,
    isViewed,
    isIdle,
    onClick
  } = t0, [hover, setHover] = import_react249.useState(!1), highlighted = isSelected || hover, label;
  if (highlighted) {
    let t12;
    if ($3[0] !== color3 || $3[1] !== isViewed || $3[2] !== name3)
      t12 = color3 ? /* @__PURE__ */ jsx_dev_runtime425.jsxDEV(ThemedText, {
        backgroundColor: color3,
        color: "inverseText",
        bold: isViewed,
        children: [
          "@",
          name3
        ]
      }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime425.jsxDEV(ThemedText, {
        color: "background",
        inverse: !0,
        bold: isViewed,
        children: [
          "@",
          name3
        ]
      }, void 0, !0, void 0, this), $3[0] = color3, $3[1] = isViewed, $3[2] = name3, $3[3] = t12;
    else
      t12 = $3[3];
    label = t12;
  } else if (isIdle) {
    let t12;
    if ($3[4] !== isViewed || $3[5] !== name3)
      t12 = /* @__PURE__ */ jsx_dev_runtime425.jsxDEV(ThemedText, {
        dimColor: !0,
        bold: isViewed,
        children: [
          "@",
          name3
        ]
      }, void 0, !0, void 0, this), $3[4] = isViewed, $3[5] = name3, $3[6] = t12;
    else
      t12 = $3[6];
    label = t12;
  } else if (isViewed) {
    let t12;
    if ($3[7] !== color3 || $3[8] !== name3)
      t12 = /* @__PURE__ */ jsx_dev_runtime425.jsxDEV(ThemedText, {
        color: color3,
        bold: !0,
        children: [
          "@",
          name3
        ]
      }, void 0, !0, void 0, this), $3[7] = color3, $3[8] = name3, $3[9] = t12;
    else
      t12 = $3[9];
    label = t12;
  } else {
    let t12 = !color3, t22;
    if ($3[10] !== color3 || $3[11] !== name3 || $3[12] !== t12)
      t22 = /* @__PURE__ */ jsx_dev_runtime425.jsxDEV(ThemedText, {
        color: color3,
        dimColor: t12,
        children: [
          "@",
          name3
        ]
      }, void 0, !0, void 0, this), $3[10] = color3, $3[11] = name3, $3[12] = t12, $3[13] = t22;
    else
      t22 = $3[13];
    label = t22;
  }
  if (!onClick)
    return label;
  let t1, t2;
  if ($3[14] === Symbol.for("react.memo_cache_sentinel"))
    t1 = () => setHover(!0), t2 = () => setHover(!1), $3[14] = t1, $3[15] = t2;
  else
    t1 = $3[14], t2 = $3[15];
  let t3;
  if ($3[16] !== label || $3[17] !== onClick)
    t3 = /* @__PURE__ */ jsx_dev_runtime425.jsxDEV(ThemedBox_default, {
      onClick,
      onMouseEnter: t1,
      onMouseLeave: t2,
      children: label
    }, void 0, !1, void 0, this), $3[16] = label, $3[17] = onClick, $3[18] = t3;
  else
    t3 = $3[18];
  return t3;
}
function SummaryPill(t0) {
  let $3 = import_compiler_runtime328.c(8), {
    selected,
    onClick,
    children
  } = t0, [hover, setHover] = import_react249.useState(!1), t1 = selected || hover, t2;
  if ($3[0] !== children || $3[1] !== t1)
    t2 = /* @__PURE__ */ jsx_dev_runtime425.jsxDEV(ThemedText, {
      color: "background",
      inverse: t1,
      children
    }, void 0, !1, void 0, this), $3[0] = children, $3[1] = t1, $3[2] = t2;
  else
    t2 = $3[2];
  let label = t2;
  if (!onClick)
    return label;
  let t3, t4;
  if ($3[3] === Symbol.for("react.memo_cache_sentinel"))
    t3 = () => setHover(!0), t4 = () => setHover(!1), $3[3] = t3, $3[4] = t4;
  else
    t3 = $3[3], t4 = $3[4];
  let t5;
  if ($3[5] !== label || $3[6] !== onClick)
    t5 = /* @__PURE__ */ jsx_dev_runtime425.jsxDEV(ThemedBox_default, {
      onClick,
      onMouseEnter: t3,
      onMouseLeave: t4,
      children: label
    }, void 0, !1, void 0, this), $3[5] = label, $3[6] = onClick, $3[7] = t5;
  else
    t5 = $3[7];
  return t5;
}
function getAgentThemeColor(colorName) {
  if (!colorName)
    return;
  if (AGENT_COLORS.includes(colorName))
    return AGENT_COLOR_TO_THEME_COLOR[colorName];
  return;
}
var import_compiler_runtime328, React136, import_react249, jsx_dev_runtime425;
var init_BackgroundTaskStatus = __esm(() => {
  init_figures();
  init_useTerminalSize();
  init_stringWidth();
  init_AppState();
  init_teammateViewHelpers();
  init_pillLabel();
  init_ink2();
  init_agentColorManager();
  init_KeyboardShortcutHint();
  init_taskStatusUtils();
  import_compiler_runtime328 = __toESM(require_react_compiler_runtime_development(), 1), React136 = __toESM(require_react_development(), 1), import_react249 = __toESM(require_react_development(), 1), jsx_dev_runtime425 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
