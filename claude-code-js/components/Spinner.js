// Original: src/components/Spinner.tsx
function computeGlimmerIndex(tick, width) {
  return tick % (width + 4) - 2;
}
function computeShimmerSegments(text2, glimmerIndex) {
  if (glimmerIndex < -1 || glimmerIndex >= text2.length + 1)
    return [{ text: text2, dim: !0 }];
  let segments = [], start = Math.max(0, glimmerIndex - 1), end = Math.min(text2.length, glimmerIndex + 2);
  if (start > 0)
    segments.push({ text: text2.slice(0, start), dim: !0 });
  if (segments.push({ text: text2.slice(start, end), dim: !1 }), end < text2.length)
    segments.push({ text: text2.slice(end), dim: !0 });
  return segments;
}
function SpinnerWithVerb(props) {
  let isBriefOnly = useAppState((s2) => s2.isBriefOnly), viewingAgentTaskId = useAppState((s_0) => s_0.viewingAgentTaskId), briefEnvEnabled = import_react58.useMemo(() => isEnvTruthy(process.env.CLAUDE_CODE_BRIEF), []);
  if ((getKairosActive() || getUserMsgOptIn() && (briefEnvEnabled || !0)) && isBriefOnly && !viewingAgentTaskId)
    return /* @__PURE__ */ jsx_dev_runtime70.jsxDEV(BriefSpinner, {
      mode: props.mode,
      overrideMessage: props.overrideMessage
    }, void 0, !1, void 0, this);
  return /* @__PURE__ */ jsx_dev_runtime70.jsxDEV(SpinnerWithVerbInner, {
    ...props
  }, void 0, !1, void 0, this);
}
function SpinnerWithVerbInner({
  mode,
  loadingStartTimeRef,
  totalPausedMsRef,
  pauseStartTimeRef,
  spinnerTip,
  responseLengthRef,
  overrideColor,
  overrideShimmerColor,
  overrideMessage,
  spinnerSuffix,
  verbose,
  hasActiveTools = !1,
  leaderIsIdle = !1
}) {
  let settings = useSettings(), reducedMotion = settings.prefersReducedMotion ?? !1, tasks = useAppState((s2) => s2.tasks), viewingAgentTaskId = useAppState((s_0) => s_0.viewingAgentTaskId), expandedView = useAppState((s_1) => s_1.expandedView), showExpandedTodos = expandedView === "tasks", showSpinnerTree = expandedView === "teammates", selectedIPAgentIndex = useAppState((s_2) => s_2.selectedIPAgentIndex), viewSelectionMode = useAppState((s_3) => s_3.viewSelectionMode), foregroundedTeammate = viewingAgentTaskId ? getViewedTeammateTask({
    viewingAgentTaskId,
    tasks
  }) : void 0, {
    columns
  } = useTerminalSize(), tasksV2 = useTasksV2(), [thinkingStatus, setThinkingStatus] = import_react58.useState(null), thinkingStartRef = import_react58.useRef(null);
  import_react58.useEffect(() => {
    let showDurationTimer = null, clearStatusTimer = null;
    if (mode === "thinking") {
      if (thinkingStartRef.current === null)
        thinkingStartRef.current = Date.now(), setThinkingStatus("thinking");
    } else if (thinkingStartRef.current !== null) {
      let duration3 = Date.now() - thinkingStartRef.current, elapsed = Date.now() - thinkingStartRef.current, remainingThinkingTime = Math.max(0, 2000 - elapsed);
      thinkingStartRef.current = null;
      let showDuration = () => {
        setThinkingStatus(duration3), clearStatusTimer = setTimeout(setThinkingStatus, 2000, null);
      };
      if (remainingThinkingTime > 0)
        showDurationTimer = setTimeout(showDuration, remainingThinkingTime);
      else
        showDuration();
    }
    return () => {
      if (showDurationTimer)
        clearTimeout(showDurationTimer);
      if (clearStatusTimer)
        clearTimeout(clearStatusTimer);
    };
  }, [mode]);
  let currentTodo = tasksV2?.find((task) => task.status !== "pending" && task.status !== "completed"), nextTask = findNextPendingTask(tasksV2), [randomVerb] = import_react58.useState(() => sample_default(getSpinnerVerbs())), leaderVerb = overrideMessage ?? currentTodo?.activeForm ?? currentTodo?.subject ?? randomVerb, message = (foregroundedTeammate && !foregroundedTeammate.isIdle ? foregroundedTeammate.spinnerVerb ?? randomVerb : leaderVerb) + "\u2026";
  import_react58.useEffect(() => {
    let operationId = "spinner-" + mode;
    return activityManager.startCLIActivity(operationId), () => {
      activityManager.endCLIActivity(operationId);
    };
  }, [mode]);
  let effortValue = useAppState((s_4) => s_4.effortValue), effortSuffix = getEffortSuffix(getMainLoopModel(), effortValue), runningTeammates = getAllInProcessTeammateTasks(tasks).filter((t2) => t2.status === "running"), hasRunningTeammates = runningTeammates.length > 0, allIdle = hasRunningTeammates && runningTeammates.every((t_0) => t_0.isIdle), teammateTokens = 0;
  if (!showSpinnerTree) {
    for (let task_0 of Object.values(tasks))
      if (isInProcessTeammateTask(task_0) && task_0.status === "running") {
        if (task_0.progress?.tokenCount)
          teammateTokens += task_0.progress.tokenCount;
      }
  }
  let elapsedSnapshot = pauseStartTimeRef.current !== null ? pauseStartTimeRef.current - loadingStartTimeRef.current - totalPausedMsRef.current : Date.now() - loadingStartTimeRef.current - totalPausedMsRef.current, leaderTokenCount = Math.round(responseLengthRef.current / 4), defaultColor = "claude", defaultShimmerColor = "claudeShimmer", messageColor = overrideColor ?? defaultColor, shimmerColor = overrideShimmerColor ?? defaultShimmerColor, ttftText = null;
  if (leaderIsIdle && hasRunningTeammates && !foregroundedTeammate)
    return /* @__PURE__ */ jsx_dev_runtime70.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      width: "100%",
      alignItems: "flex-start",
      children: [
        /* @__PURE__ */ jsx_dev_runtime70.jsxDEV(ThemedBox_default, {
          flexDirection: "row",
          flexWrap: "wrap",
          marginTop: 1,
          width: "100%",
          children: /* @__PURE__ */ jsx_dev_runtime70.jsxDEV(ThemedText, {
            dimColor: !0,
            children: [
              TEARDROP_ASTERISK,
              " Idle",
              !allIdle && " \xB7 teammates running"
            ]
          }, void 0, !0, void 0, this)
        }, void 0, !1, void 0, this),
        showSpinnerTree && /* @__PURE__ */ jsx_dev_runtime70.jsxDEV(TeammateSpinnerTree, {
          selectedIndex: selectedIPAgentIndex,
          isInSelectionMode: viewSelectionMode === "selecting-agent",
          allIdle,
          leaderTokenCount,
          leaderIdleText: "Idle"
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this);
  if (foregroundedTeammate?.isIdle) {
    let idleText = allIdle ? `${TEARDROP_ASTERISK} Worked for ${formatDuration(Date.now() - foregroundedTeammate.startTime)}` : `${TEARDROP_ASTERISK} Idle`;
    return /* @__PURE__ */ jsx_dev_runtime70.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      width: "100%",
      alignItems: "flex-start",
      children: [
        /* @__PURE__ */ jsx_dev_runtime70.jsxDEV(ThemedBox_default, {
          flexDirection: "row",
          flexWrap: "wrap",
          marginTop: 1,
          width: "100%",
          children: /* @__PURE__ */ jsx_dev_runtime70.jsxDEV(ThemedText, {
            dimColor: !0,
            children: idleText
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this),
        showSpinnerTree && hasRunningTeammates && /* @__PURE__ */ jsx_dev_runtime70.jsxDEV(TeammateSpinnerTree, {
          selectedIndex: selectedIPAgentIndex,
          isInSelectionMode: viewSelectionMode === "selecting-agent",
          allIdle,
          leaderVerb: leaderIsIdle ? void 0 : leaderVerb,
          leaderIdleText: leaderIsIdle ? "Idle" : void 0,
          leaderTokenCount
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this);
  }
  let contextTipsActive = !1, tipsEnabled = settings.spinnerTipsEnabled !== !1, showClearTip = tipsEnabled && elapsedSnapshot > 1800000, showBtwTip = tipsEnabled && elapsedSnapshot > 30000 && !getGlobalConfig().btwUseCount, effectiveTip = contextTipsActive ? void 0 : showClearTip && !nextTask ? "Use /clear to start fresh when switching topics and free up context" : showBtwTip && !nextTask ? "Use /btw to ask a quick side question without interrupting Claude's current work" : spinnerTip, budgetText = null;
  return /* @__PURE__ */ jsx_dev_runtime70.jsxDEV(ThemedBox_default, {
    flexDirection: "column",
    width: "100%",
    alignItems: "flex-start",
    children: [
      /* @__PURE__ */ jsx_dev_runtime70.jsxDEV(SpinnerAnimationRow, {
        mode,
        reducedMotion,
        hasActiveTools,
        responseLengthRef,
        message,
        messageColor,
        shimmerColor,
        overrideColor,
        loadingStartTimeRef,
        totalPausedMsRef,
        pauseStartTimeRef,
        spinnerSuffix,
        verbose,
        columns,
        hasRunningTeammates,
        teammateTokens,
        foregroundedTeammate,
        leaderIsIdle,
        thinkingStatus,
        effortSuffix
      }, void 0, !1, void 0, this),
      showSpinnerTree && hasRunningTeammates ? /* @__PURE__ */ jsx_dev_runtime70.jsxDEV(TeammateSpinnerTree, {
        selectedIndex: selectedIPAgentIndex,
        isInSelectionMode: viewSelectionMode === "selecting-agent",
        allIdle,
        leaderVerb: leaderIsIdle ? void 0 : leaderVerb,
        leaderIdleText: leaderIsIdle ? "Idle" : void 0,
        leaderTokenCount
      }, void 0, !1, void 0, this) : showExpandedTodos && tasksV2 && tasksV2.length > 0 ? /* @__PURE__ */ jsx_dev_runtime70.jsxDEV(ThemedBox_default, {
        width: "100%",
        flexDirection: "column",
        children: /* @__PURE__ */ jsx_dev_runtime70.jsxDEV(MessageResponse, {
          children: /* @__PURE__ */ jsx_dev_runtime70.jsxDEV(TaskListV2, {
            tasks: tasksV2
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this) : nextTask || effectiveTip || budgetText ? /* @__PURE__ */ jsx_dev_runtime70.jsxDEV(ThemedBox_default, {
        width: "100%",
        flexDirection: "column",
        children: [
          budgetText && /* @__PURE__ */ jsx_dev_runtime70.jsxDEV(MessageResponse, {
            children: /* @__PURE__ */ jsx_dev_runtime70.jsxDEV(ThemedText, {
              dimColor: !0,
              children: budgetText
            }, void 0, !1, void 0, this)
          }, void 0, !1, void 0, this),
          (nextTask || effectiveTip) && /* @__PURE__ */ jsx_dev_runtime70.jsxDEV(MessageResponse, {
            children: /* @__PURE__ */ jsx_dev_runtime70.jsxDEV(ThemedText, {
              dimColor: !0,
              children: nextTask ? `Next: ${nextTask.subject}` : `Tip: ${effectiveTip}`
            }, void 0, !1, void 0, this)
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this) : null
    ]
  }, void 0, !0, void 0, this);
}
function BriefSpinner(t0) {
  let $3 = import_compiler_runtime61.c(31), {
    mode,
    overrideMessage
  } = t0, reducedMotion = useSettings().prefersReducedMotion ?? !1, [randomVerb] = import_react58.useState(_temp43), verb = overrideMessage ?? randomVerb, connStatus = useAppState(_temp53), t1, t2;
  if ($3[0] !== mode)
    t1 = () => {
      let operationId = "spinner-" + mode;
      return activityManager.startCLIActivity(operationId), () => {
        activityManager.endCLIActivity(operationId);
      };
    }, t2 = [mode], $3[0] = mode, $3[1] = t1, $3[2] = t2;
  else
    t1 = $3[1], t2 = $3[2];
  import_react58.useEffect(t1, t2);
  let [, time3] = useAnimationFrame(reducedMotion ? null : 120), runningCount = useAppState(_temp63), showConnWarning = connStatus === "reconnecting" || connStatus === "disconnected", connText = connStatus === "reconnecting" ? "Reconnecting" : "Disconnected", dotFrame = Math.floor(time3 / 300) % 3, t3;
  if ($3[3] !== dotFrame || $3[4] !== reducedMotion)
    t3 = reducedMotion ? "\u2026  " : ".".repeat(dotFrame + 1).padEnd(3), $3[3] = dotFrame, $3[4] = reducedMotion, $3[5] = t3;
  else
    t3 = $3[5];
  let dots = t3, t4;
  if ($3[6] !== verb)
    t4 = stringWidth(verb), $3[6] = verb, $3[7] = t4;
  else
    t4 = $3[7];
  let verbWidth = t4, t5;
  if ($3[8] !== reducedMotion || $3[9] !== showConnWarning || $3[10] !== time3 || $3[11] !== verb || $3[12] !== verbWidth) {
    let glimmerIndex = reducedMotion || showConnWarning ? -100 : computeGlimmerIndex(Math.floor(time3 / SHIMMER_INTERVAL_MS), verbWidth);
    t5 = computeShimmerSegments(verb, glimmerIndex), $3[8] = reducedMotion, $3[9] = showConnWarning, $3[10] = time3, $3[11] = verb, $3[12] = verbWidth, $3[13] = t5;
  } else
    t5 = $3[13];
  let {
    before,
    shimmer,
    after
  } = t5, {
    columns
  } = useTerminalSize(), rightText = runningCount > 0 ? `${runningCount} in background` : "", t6;
  if ($3[14] !== connText || $3[15] !== showConnWarning || $3[16] !== verbWidth)
    t6 = showConnWarning ? stringWidth(connText) : verbWidth, $3[14] = connText, $3[15] = showConnWarning, $3[16] = verbWidth, $3[17] = t6;
  else
    t6 = $3[17];
  let leftWidth = t6 + 3, pad = Math.max(1, columns - 2 - leftWidth - stringWidth(rightText)), t7;
  if ($3[18] !== after || $3[19] !== before || $3[20] !== connText || $3[21] !== dots || $3[22] !== shimmer || $3[23] !== showConnWarning)
    t7 = showConnWarning ? /* @__PURE__ */ jsx_dev_runtime70.jsxDEV(ThemedText, {
      color: "error",
      children: connText + dots
    }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime70.jsxDEV(jsx_dev_runtime70.Fragment, {
      children: [
        before ? /* @__PURE__ */ jsx_dev_runtime70.jsxDEV(ThemedText, {
          dimColor: !0,
          children: before
        }, void 0, !1, void 0, this) : null,
        shimmer ? /* @__PURE__ */ jsx_dev_runtime70.jsxDEV(ThemedText, {
          children: shimmer
        }, void 0, !1, void 0, this) : null,
        after ? /* @__PURE__ */ jsx_dev_runtime70.jsxDEV(ThemedText, {
          dimColor: !0,
          children: after
        }, void 0, !1, void 0, this) : null,
        /* @__PURE__ */ jsx_dev_runtime70.jsxDEV(ThemedText, {
          dimColor: !0,
          children: dots
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[18] = after, $3[19] = before, $3[20] = connText, $3[21] = dots, $3[22] = shimmer, $3[23] = showConnWarning, $3[24] = t7;
  else
    t7 = $3[24];
  let t8;
  if ($3[25] !== pad || $3[26] !== rightText)
    t8 = rightText ? /* @__PURE__ */ jsx_dev_runtime70.jsxDEV(jsx_dev_runtime70.Fragment, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime70.jsxDEV(ThemedText, {
          children: " ".repeat(pad)
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime70.jsxDEV(ThemedText, {
          color: "subtle",
          children: rightText
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this) : null, $3[25] = pad, $3[26] = rightText, $3[27] = t8;
  else
    t8 = $3[27];
  let t9;
  if ($3[28] !== t7 || $3[29] !== t8)
    t9 = /* @__PURE__ */ jsx_dev_runtime70.jsxDEV(ThemedBox_default, {
      flexDirection: "row",
      width: "100%",
      marginTop: 1,
      paddingLeft: 2,
      children: [
        t7,
        t8
      ]
    }, void 0, !0, void 0, this), $3[28] = t7, $3[29] = t8, $3[30] = t9;
  else
    t9 = $3[30];
  return t9;
}
function _temp63(s_0) {
  return count2(Object.values(s_0.tasks), isBackgroundTask) + s_0.remoteBackgroundTaskCount;
}
function _temp53(s2) {
  return s2.remoteConnectionStatus;
}
function _temp43() {
  return sample_default(getSpinnerVerbs()) ?? "Working";
}
function BriefIdleStatus() {
  let $3 = import_compiler_runtime61.c(9), connStatus = useAppState(_temp73), runningCount = useAppState(_temp83), {
    columns
  } = useTerminalSize(), leftText = connStatus === "reconnecting" || connStatus === "disconnected" ? connStatus === "reconnecting" ? "Reconnecting\u2026" : "Disconnected" : "", rightText = runningCount > 0 ? `${runningCount} in background` : "";
  if (!leftText && !rightText) {
    let t02;
    if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
      t02 = /* @__PURE__ */ jsx_dev_runtime70.jsxDEV(ThemedBox_default, {
        height: 2
      }, void 0, !1, void 0, this), $3[0] = t02;
    else
      t02 = $3[0];
    return t02;
  }
  let pad = Math.max(1, columns - 2 - stringWidth(leftText) - stringWidth(rightText)), t0;
  if ($3[1] !== leftText)
    t0 = leftText ? /* @__PURE__ */ jsx_dev_runtime70.jsxDEV(ThemedText, {
      color: "error",
      children: leftText
    }, void 0, !1, void 0, this) : null, $3[1] = leftText, $3[2] = t0;
  else
    t0 = $3[2];
  let t1;
  if ($3[3] !== pad || $3[4] !== rightText)
    t1 = rightText ? /* @__PURE__ */ jsx_dev_runtime70.jsxDEV(jsx_dev_runtime70.Fragment, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime70.jsxDEV(ThemedText, {
          children: " ".repeat(pad)
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime70.jsxDEV(ThemedText, {
          color: "subtle",
          children: rightText
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this) : null, $3[3] = pad, $3[4] = rightText, $3[5] = t1;
  else
    t1 = $3[5];
  let t2;
  if ($3[6] !== t0 || $3[7] !== t1)
    t2 = /* @__PURE__ */ jsx_dev_runtime70.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      paddingLeft: 2,
      children: /* @__PURE__ */ jsx_dev_runtime70.jsxDEV(ThemedText, {
        children: [
          t0,
          t1
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[6] = t0, $3[7] = t1, $3[8] = t2;
  else
    t2 = $3[8];
  return t2;
}
function _temp83(s_0) {
  return count2(Object.values(s_0.tasks), isBackgroundTask) + s_0.remoteBackgroundTaskCount;
}
function _temp73(s2) {
  return s2.remoteConnectionStatus;
}
function Spinner() {
  let $3 = import_compiler_runtime61.c(8), reducedMotion = useSettings().prefersReducedMotion ?? !1, [ref, time3] = useAnimationFrame(reducedMotion ? null : 120);
  if (reducedMotion) {
    let t02;
    if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
      t02 = /* @__PURE__ */ jsx_dev_runtime70.jsxDEV(ThemedText, {
        color: "text",
        children: "\u25CF"
      }, void 0, !1, void 0, this), $3[0] = t02;
    else
      t02 = $3[0];
    let t12;
    if ($3[1] !== ref)
      t12 = /* @__PURE__ */ jsx_dev_runtime70.jsxDEV(ThemedBox_default, {
        ref,
        flexWrap: "wrap",
        height: 1,
        width: 2,
        children: t02
      }, void 0, !1, void 0, this), $3[1] = ref, $3[2] = t12;
    else
      t12 = $3[2];
    return t12;
  }
  let frame = Math.floor(time3 / 120) % SPINNER_FRAMES2.length, t0 = SPINNER_FRAMES2[frame], t1;
  if ($3[3] !== t0)
    t1 = /* @__PURE__ */ jsx_dev_runtime70.jsxDEV(ThemedText, {
      color: "text",
      children: t0
    }, void 0, !1, void 0, this), $3[3] = t0, $3[4] = t1;
  else
    t1 = $3[4];
  let t2;
  if ($3[5] !== ref || $3[6] !== t1)
    t2 = /* @__PURE__ */ jsx_dev_runtime70.jsxDEV(ThemedBox_default, {
      ref,
      flexWrap: "wrap",
      height: 1,
      width: 2,
      children: t1
    }, void 0, !1, void 0, this), $3[5] = ref, $3[6] = t1, $3[7] = t2;
  else
    t2 = $3[7];
  return t2;
}
function findNextPendingTask(tasks) {
  if (!tasks)
    return;
  let pendingTasks = tasks.filter((t2) => t2.status === "pending");
  if (pendingTasks.length === 0)
    return;
  let unresolvedIds = new Set(tasks.filter((t2) => t2.status !== "completed").map((t2) => t2.id));
  return pendingTasks.find((t2) => !t2.blockedBy.some((id) => unresolvedIds.has(id))) ?? pendingTasks[0];
}
var import_compiler_runtime61, import_react58, jsx_dev_runtime70, SHIMMER_INTERVAL_MS = 120, DEFAULT_CHARACTERS2, SPINNER_FRAMES2;
var init_Spinner2 = __esm(() => {
  init_ink2();
  init_state();
  init_envUtils();
  init_sample();
  init_format();
  init_activityManager();
  init_spinnerVerbs();
  init_MessageResponse();
  init_TaskListV2();
  init_useTasksV2();
  init_AppState();
  init_useTerminalSize();
  init_stringWidth();
  init_Spinner();
  init_SpinnerAnimationRow();
  init_useSettings();
  init_InProcessTeammateTask();
  init_effort();
  init_model();
  init_selectors();
  init_figures2();
  init_TeammateSpinnerTree();
  init_ink2();
  init_config4();
  import_compiler_runtime61 = __toESM(require_react_compiler_runtime_development(), 1), import_react58 = __toESM(require_react_development(), 1), jsx_dev_runtime70 = __toESM(require_react_jsx_dev_runtime_development(), 1);
  DEFAULT_CHARACTERS2 = getDefaultCharacters(), SPINNER_FRAMES2 = [...DEFAULT_CHARACTERS2, ...[...DEFAULT_CHARACTERS2].reverse()];
});
