// Original: src/components/PromptInput/PromptInputFooterLeftSide.tsx
function ProactiveCountdown() {
  let $3 = import_compiler_runtime332.c(7), nextTickAt = import_react251.useSyncExternalStore(proactiveModule5?.subscribeToProactiveChanges ?? NO_OP_SUBSCRIBE, proactiveModule5?.getNextTickAt ?? NULL, NULL), [remainingSeconds, setRemainingSeconds] = import_react251.useState(null), t0, t1;
  if ($3[0] !== nextTickAt)
    t0 = () => {
      if (nextTickAt === null) {
        setRemainingSeconds(null);
        return;
      }
      let update2 = function() {
        let remaining = Math.max(0, Math.ceil((nextTickAt - Date.now()) / 1000));
        setRemainingSeconds(remaining);
      };
      update2();
      let interval = setInterval(update2, 1000);
      return () => clearInterval(interval);
    }, t1 = [nextTickAt], $3[0] = nextTickAt, $3[1] = t0, $3[2] = t1;
  else
    t0 = $3[1], t1 = $3[2];
  if (import_react251.useEffect(t0, t1), remainingSeconds === null)
    return null;
  let t2 = remainingSeconds * 1000, t3;
  if ($3[3] !== t2)
    t3 = formatDuration(t2, {
      mostSignificantOnly: !0
    }), $3[3] = t2, $3[4] = t3;
  else
    t3 = $3[4];
  let t4;
  if ($3[5] !== t3)
    t4 = /* @__PURE__ */ jsx_dev_runtime429.jsxDEV(ThemedText, {
      dimColor: !0,
      children: [
        "waiting",
        " ",
        t3
      ]
    }, void 0, !0, void 0, this), $3[5] = t3, $3[6] = t4;
  else
    t4 = $3[6];
  return t4;
}
function PromptInputFooterLeftSide(t0) {
  let $3 = import_compiler_runtime332.c(27), {
    exitMessage,
    vimMode,
    mode,
    toolPermissionContext,
    suppressHint,
    isLoading,
    tasksSelected,
    teamsSelected,
    tmuxSelected,
    teammateFooterIndex,
    isPasting,
    isSearching,
    historyQuery,
    setHistoryQuery,
    historyFailedMatch,
    onOpenTasksDialog
  } = t0;
  if (exitMessage.show) {
    let t12;
    if ($3[0] !== exitMessage.key)
      t12 = /* @__PURE__ */ jsx_dev_runtime429.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          "Press ",
          exitMessage.key,
          " again to exit"
        ]
      }, "exit-message", !0, void 0, this), $3[0] = exitMessage.key, $3[1] = t12;
    else
      t12 = $3[1];
    return t12;
  }
  if (isPasting) {
    let t12;
    if ($3[2] === Symbol.for("react.memo_cache_sentinel"))
      t12 = /* @__PURE__ */ jsx_dev_runtime429.jsxDEV(ThemedText, {
        dimColor: !0,
        children: "Pasting text\u2026"
      }, "pasting-message", !1, void 0, this), $3[2] = t12;
    else
      t12 = $3[2];
    return t12;
  }
  let t1;
  if ($3[3] !== isSearching || $3[4] !== vimMode)
    t1 = isVimModeEnabled() && vimMode === "INSERT" && !isSearching, $3[3] = isSearching, $3[4] = vimMode, $3[5] = t1;
  else
    t1 = $3[5];
  let showVim = t1, t2;
  if ($3[6] !== historyFailedMatch || $3[7] !== historyQuery || $3[8] !== isSearching || $3[9] !== setHistoryQuery)
    t2 = isSearching && /* @__PURE__ */ jsx_dev_runtime429.jsxDEV(HistorySearchInput_default, {
      value: historyQuery,
      onChange: setHistoryQuery,
      historyFailedMatch
    }, void 0, !1, void 0, this), $3[6] = historyFailedMatch, $3[7] = historyQuery, $3[8] = isSearching, $3[9] = setHistoryQuery, $3[10] = t2;
  else
    t2 = $3[10];
  let t3;
  if ($3[11] !== showVim)
    t3 = showVim ? /* @__PURE__ */ jsx_dev_runtime429.jsxDEV(ThemedText, {
      dimColor: !0,
      children: "-- INSERT --"
    }, "vim-insert", !1, void 0, this) : null, $3[11] = showVim, $3[12] = t3;
  else
    t3 = $3[12];
  let t4 = !suppressHint && !showVim, t5;
  if ($3[13] !== isLoading || $3[14] !== mode || $3[15] !== onOpenTasksDialog || $3[16] !== t4 || $3[17] !== tasksSelected || $3[18] !== teammateFooterIndex || $3[19] !== teamsSelected || $3[20] !== tmuxSelected || $3[21] !== toolPermissionContext)
    t5 = /* @__PURE__ */ jsx_dev_runtime429.jsxDEV(ModeIndicator, {
      mode,
      toolPermissionContext,
      showHint: t4,
      isLoading,
      tasksSelected,
      teamsSelected,
      teammateFooterIndex,
      tmuxSelected,
      onOpenTasksDialog
    }, void 0, !1, void 0, this), $3[13] = isLoading, $3[14] = mode, $3[15] = onOpenTasksDialog, $3[16] = t4, $3[17] = tasksSelected, $3[18] = teammateFooterIndex, $3[19] = teamsSelected, $3[20] = tmuxSelected, $3[21] = toolPermissionContext, $3[22] = t5;
  else
    t5 = $3[22];
  let t6;
  if ($3[23] !== t2 || $3[24] !== t3 || $3[25] !== t5)
    t6 = /* @__PURE__ */ jsx_dev_runtime429.jsxDEV(ThemedBox_default, {
      justifyContent: "flex-start",
      gap: 1,
      children: [
        t2,
        t3,
        t5
      ]
    }, void 0, !0, void 0, this), $3[23] = t2, $3[24] = t3, $3[25] = t5, $3[26] = t6;
  else
    t6 = $3[26];
  return t6;
}
function ModeIndicator({
  mode,
  toolPermissionContext,
  showHint,
  isLoading,
  tasksSelected,
  teamsSelected,
  tmuxSelected,
  teammateFooterIndex,
  onOpenTasksDialog
}) {
  let {
    columns
  } = useTerminalSize(), modeCycleShortcut = useShortcutDisplay("chat:cycleMode", "Chat", "shift+tab"), tasks2 = useAppState((s2) => s2.tasks), teamContext = useAppState((s_0) => s_0.teamContext), store = useAppStateStore(), [remoteSessionUrl] = import_react251.useState(() => store.getState().remoteSessionUrl), viewSelectionMode = useAppState((s_1) => s_1.viewSelectionMode), viewingAgentTaskId = useAppState((s_2) => s_2.viewingAgentTaskId), expandedView = useAppState((s_3) => s_3.expandedView), showSpinnerTree = expandedView === "teammates", prStatus = usePrStatus(isLoading, isPrStatusEnabled()), hasTmuxSession = useAppState((s_4) => !1), nextTickAt = import_react251.useSyncExternalStore(proactiveModule5?.subscribeToProactiveChanges ?? NO_OP_SUBSCRIBE, proactiveModule5?.getNextTickAt ?? NULL, NULL), voiceEnabled = useVoiceEnabled(), voiceState = useVoiceState((s_5) => s_5.voiceState), voiceWarmingUp = useVoiceState((s_6) => s_6.voiceWarmingUp), hasSelection2 = useHasSelection(), selGetState = useSelection().getState, hasNextTick = nextTickAt !== null, isCoordinator = !1, runningTaskCount = import_react251.useMemo(() => count2(Object.values(tasks2), (t2) => isBackgroundTask(t2) && !0), [tasks2]), tasksV2 = useTasksV2(), hasTaskItems = tasksV2 !== void 0 && tasksV2.length > 0, escShortcut = useShortcutDisplay("chat:cancel", "Chat", "esc").toLowerCase(), todosShortcut = useShortcutDisplay("app:toggleTodos", "Global", "ctrl+t"), killAgentsShortcut = useShortcutDisplay("chat:killAgents", "Chat", "ctrl+x ctrl+k"), voiceKeyShortcut = useShortcutDisplay("voice:pushToTalk", "Chat", "Space"), [voiceHintUnderCap] = import_react251.useState(() => (getGlobalConfig().voiceFooterHintSeenCount ?? 0) < MAX_VOICE_HINT_SHOWS), voiceHintIncrementedRef = import_react251.useRef(!1);
  import_react251.useEffect(() => {
    {
      if (!voiceEnabled || !voiceHintUnderCap)
        return;
      if (voiceHintIncrementedRef?.current)
        return;
      if (voiceHintIncrementedRef)
        voiceHintIncrementedRef.current = !0;
      let newCount = (getGlobalConfig().voiceFooterHintSeenCount ?? 0) + 1;
      saveGlobalConfig((prev) => {
        if ((prev.voiceFooterHintSeenCount ?? 0) >= newCount)
          return prev;
        return {
          ...prev,
          voiceFooterHintSeenCount: newCount
        };
      });
    }
  }, [voiceEnabled, voiceHintUnderCap]);
  let isKillAgentsConfirmShowing = useAppState((s_7) => s_7.notifications.current?.key === "kill-agents-confirm"), hasTeams = isAgentSwarmsEnabled() && !isInProcessEnabled() && teamContext !== void 0 && count2(Object.values(teamContext.teammates), (t_0) => t_0.name !== "team-lead") > 0;
  if (mode === "bash")
    return /* @__PURE__ */ jsx_dev_runtime429.jsxDEV(ThemedText, {
      color: "bashBorder",
      children: "! for bash mode"
    }, void 0, !1, void 0, this);
  let currentMode = toolPermissionContext?.mode, hasActiveMode = !isDefaultMode(currentMode), viewedTask = viewingAgentTaskId ? tasks2[viewingAgentTaskId] : void 0, isViewingTeammate = viewSelectionMode === "viewing-agent" && viewedTask?.type === "in_process_teammate", isViewingCompletedTeammate = isViewingTeammate && viewedTask != null && viewedTask.status !== "running", hasBackgroundTasks = runningTaskCount > 0 || isViewingTeammate, primaryItemCount = (hasActiveMode ? 1 : 0) + (hasBackgroundTasks ? 1 : 0) + (hasTeams ? 1 : 0), shouldShowPrStatus = isPrStatusEnabled() && prStatus.number !== null && prStatus.reviewState !== null && prStatus.url !== null && primaryItemCount < 2 && (primaryItemCount === 0 || columns >= 80), shouldShowModeHint = primaryItemCount < 2, hasTeammatePills = !showSpinnerTree && hasBackgroundTasks && Object.values(tasks2).some((t_1) => t_1.type === "in_process_teammate") || !showSpinnerTree && isViewingTeammate, modePart = currentMode && hasActiveMode && !getIsRemoteMode() ? /* @__PURE__ */ jsx_dev_runtime429.jsxDEV(ThemedText, {
    color: getModeColor(currentMode),
    children: [
      permissionModeSymbol(currentMode),
      " ",
      permissionModeTitle(currentMode).toLowerCase(),
      " on",
      shouldShowModeHint && /* @__PURE__ */ jsx_dev_runtime429.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          " ",
          /* @__PURE__ */ jsx_dev_runtime429.jsxDEV(KeyboardShortcutHint, {
            shortcut: modeCycleShortcut,
            action: "cycle",
            parens: !0
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime429.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          " ",
          "(dev)"
        ]
      }, void 0, !0, void 0, this)
    ]
  }, "mode", !0, void 0, this) : null, parts = [
    ...remoteSessionUrl ? [/* @__PURE__ */ jsx_dev_runtime429.jsxDEV(Link, {
      url: remoteSessionUrl,
      children: /* @__PURE__ */ jsx_dev_runtime429.jsxDEV(ThemedText, {
        color: "ide",
        children: [
          figures_default.circleDouble,
          " remote"
        ]
      }, void 0, !0, void 0, this)
    }, "remote", !1, void 0, this)] : [],
    ...[],
    ...isAgentSwarmsEnabled() && hasTeams ? [/* @__PURE__ */ jsx_dev_runtime429.jsxDEV(TeamStatus, {
      teamsSelected,
      showHint: showHint && !hasBackgroundTasks
    }, "teams", !1, void 0, this)] : [],
    ...shouldShowPrStatus ? [/* @__PURE__ */ jsx_dev_runtime429.jsxDEV(PrBadge, {
      number: prStatus.number,
      url: prStatus.url,
      reviewState: prStatus.reviewState
    }, "pr-status", !1, void 0, this)] : []
  ], hasAnyInProcessTeammates = Object.values(tasks2).some((t_2) => t_2.type === "in_process_teammate" && t_2.status === "running"), hasRunningAgentTasks = Object.values(tasks2).some((t_3) => t_3.type === "local_agent" && t_3.status === "running"), hintParts = showHint ? getSpinnerHintParts(isLoading, escShortcut, todosShortcut, killAgentsShortcut, hasTaskItems, expandedView, hasAnyInProcessTeammates, hasRunningAgentTasks, isKillAgentsConfirmShowing) : [];
  if (isViewingCompletedTeammate)
    parts.push(/* @__PURE__ */ jsx_dev_runtime429.jsxDEV(ThemedText, {
      dimColor: !0,
      children: /* @__PURE__ */ jsx_dev_runtime429.jsxDEV(KeyboardShortcutHint, {
        shortcut: escShortcut,
        action: "return to team lead"
      }, void 0, !1, void 0, this)
    }, "esc-return", !1, void 0, this));
  else if (hasNextTick)
    parts.push(/* @__PURE__ */ jsx_dev_runtime429.jsxDEV(ProactiveCountdown, {}, "proactive", !1, void 0, this));
  else if (!hasTeammatePills && showHint)
    parts.push(...hintParts);
  if (hasTeammatePills) {
    let otherParts = [...modePart ? [modePart] : [], ...parts, ...isViewingCompletedTeammate ? [] : hintParts];
    return /* @__PURE__ */ jsx_dev_runtime429.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        /* @__PURE__ */ jsx_dev_runtime429.jsxDEV(ThemedBox_default, {
          children: /* @__PURE__ */ jsx_dev_runtime429.jsxDEV(BackgroundTaskStatus, {
            tasksSelected,
            isViewingTeammate,
            teammateFooterIndex,
            isLeaderIdle: !isLoading,
            onOpenDialog: onOpenTasksDialog
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this),
        otherParts.length > 0 && /* @__PURE__ */ jsx_dev_runtime429.jsxDEV(ThemedBox_default, {
          children: /* @__PURE__ */ jsx_dev_runtime429.jsxDEV(Byline, {
            children: otherParts
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this);
  }
  let hasCoordinatorTasks = !1, tasksPart = hasBackgroundTasks && !hasTeammatePills && !shouldHideTasksFooter(tasks2, showSpinnerTree) ? /* @__PURE__ */ jsx_dev_runtime429.jsxDEV(BackgroundTaskStatus, {
    tasksSelected,
    isViewingTeammate,
    teammateFooterIndex,
    isLeaderIdle: !isLoading,
    onOpenDialog: onOpenTasksDialog
  }, void 0, !1, void 0, this) : null;
  if (parts.length === 0 && !tasksPart && !modePart && showHint)
    parts.push(/* @__PURE__ */ jsx_dev_runtime429.jsxDEV(ThemedText, {
      dimColor: !0,
      children: "? for shortcuts"
    }, "shortcuts-hint", !1, void 0, this));
  let copyOnSelect = getGlobalConfig().copyOnSelect ?? !0, selectionHintHasContent = hasSelection2 && (!copyOnSelect || isXtermJs());
  if (voiceEnabled && voiceWarmingUp)
    parts.push(/* @__PURE__ */ jsx_dev_runtime429.jsxDEV(VoiceWarmupHint, {}, "voice-warmup", !1, void 0, this));
  else if (isFullscreenEnvEnabled() && selectionHintHasContent) {
    let isMac = getPlatform() === "macos", altClickFailed = isMac && (selGetState()?.lastPressHadAlt ?? !1);
    parts.push(/* @__PURE__ */ jsx_dev_runtime429.jsxDEV(ThemedText, {
      dimColor: !0,
      children: /* @__PURE__ */ jsx_dev_runtime429.jsxDEV(Byline, {
        children: [
          !copyOnSelect && /* @__PURE__ */ jsx_dev_runtime429.jsxDEV(KeyboardShortcutHint, {
            shortcut: "ctrl+c",
            action: "copy"
          }, void 0, !1, void 0, this),
          isXtermJs() && (altClickFailed ? /* @__PURE__ */ jsx_dev_runtime429.jsxDEV(ThemedText, {
            children: "set macOptionClickForcesSelection in VS Code settings"
          }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime429.jsxDEV(KeyboardShortcutHint, {
            shortcut: isMac ? "option+click" : "shift+click",
            action: "native select"
          }, void 0, !1, void 0, this))
        ]
      }, void 0, !0, void 0, this)
    }, "selection-copy", !1, void 0, this));
  } else if (parts.length > 0 && showHint && voiceEnabled && voiceState === "idle" && hintParts.length === 0 && voiceHintUnderCap)
    parts.push(/* @__PURE__ */ jsx_dev_runtime429.jsxDEV(ThemedText, {
      dimColor: !0,
      children: [
        "hold ",
        voiceKeyShortcut,
        " to speak"
      ]
    }, "voice-hint", !0, void 0, this));
  if ((tasksPart || hasCoordinatorTasks) && showHint && !hasTeams)
    parts.push(/* @__PURE__ */ jsx_dev_runtime429.jsxDEV(ThemedText, {
      dimColor: !0,
      children: tasksSelected ? /* @__PURE__ */ jsx_dev_runtime429.jsxDEV(KeyboardShortcutHint, {
        shortcut: "Enter",
        action: "view tasks"
      }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime429.jsxDEV(KeyboardShortcutHint, {
        shortcut: "\u2193",
        action: "manage"
      }, void 0, !1, void 0, this)
    }, "manage-tasks", !1, void 0, this));
  if (parts.length === 0 && !tasksPart && !modePart)
    return isFullscreenEnvEnabled() ? /* @__PURE__ */ jsx_dev_runtime429.jsxDEV(ThemedText, {
      children: " "
    }, void 0, !1, void 0, this) : null;
  return /* @__PURE__ */ jsx_dev_runtime429.jsxDEV(ThemedBox_default, {
    height: 1,
    overflow: "hidden",
    children: [
      modePart && /* @__PURE__ */ jsx_dev_runtime429.jsxDEV(ThemedBox_default, {
        flexShrink: 0,
        children: [
          modePart,
          (tasksPart || parts.length > 0) && /* @__PURE__ */ jsx_dev_runtime429.jsxDEV(ThemedText, {
            dimColor: !0,
            children: " \xB7 "
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this),
      tasksPart && /* @__PURE__ */ jsx_dev_runtime429.jsxDEV(ThemedBox_default, {
        flexShrink: 0,
        children: [
          tasksPart,
          parts.length > 0 && /* @__PURE__ */ jsx_dev_runtime429.jsxDEV(ThemedText, {
            dimColor: !0,
            children: " \xB7 "
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this),
      parts.length > 0 && /* @__PURE__ */ jsx_dev_runtime429.jsxDEV(ThemedText, {
        wrap: "truncate",
        children: /* @__PURE__ */ jsx_dev_runtime429.jsxDEV(Byline, {
          children: parts
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this)
    ]
  }, void 0, !0, void 0, this);
}
function getSpinnerHintParts(isLoading, escShortcut, todosShortcut, killAgentsShortcut, hasTaskItems, expandedView, hasTeammates, hasRunningAgentTasks, isKillAgentsConfirmShowing) {
  let toggleAction;
  if (hasTeammates)
    switch (expandedView) {
      case "none":
        toggleAction = "show tasks";
        break;
      case "tasks":
        toggleAction = "show teammates";
        break;
      case "teammates":
        toggleAction = "hide";
        break;
    }
  else
    toggleAction = expandedView === "tasks" ? "hide tasks" : "show tasks";
  let showToggleHint = hasTaskItems || hasTeammates;
  return [...isLoading ? [/* @__PURE__ */ jsx_dev_runtime429.jsxDEV(ThemedText, {
    dimColor: !0,
    children: /* @__PURE__ */ jsx_dev_runtime429.jsxDEV(KeyboardShortcutHint, {
      shortcut: escShortcut,
      action: "interrupt"
    }, void 0, !1, void 0, this)
  }, "esc", !1, void 0, this)] : [], ...!isLoading && hasRunningAgentTasks && !isKillAgentsConfirmShowing ? [/* @__PURE__ */ jsx_dev_runtime429.jsxDEV(ThemedText, {
    dimColor: !0,
    children: /* @__PURE__ */ jsx_dev_runtime429.jsxDEV(KeyboardShortcutHint, {
      shortcut: killAgentsShortcut,
      action: "stop agents"
    }, void 0, !1, void 0, this)
  }, "kill-agents", !1, void 0, this)] : [], ...showToggleHint ? [/* @__PURE__ */ jsx_dev_runtime429.jsxDEV(ThemedText, {
    dimColor: !0,
    children: /* @__PURE__ */ jsx_dev_runtime429.jsxDEV(KeyboardShortcutHint, {
      shortcut: todosShortcut,
      action: toggleAction
    }, void 0, !1, void 0, this)
  }, "toggle-tasks", !1, void 0, this)] : []];
}
function isPrStatusEnabled() {
  return getGlobalConfig().prStatusFooterEnabled ?? !0;
}
var import_compiler_runtime332, import_react251, jsx_dev_runtime429, proactiveModule5 = null, NO_OP_SUBSCRIBE = (_cb) => () => {}, NULL = () => null, MAX_VOICE_HINT_SHOWS = 3;
var init_PromptInputFooterLeftSide = __esm(() => {
  init_ink2();
  init_figures();
  init_utils16();
  init_useShortcutDisplay();
  init_PermissionMode();
  init_BackgroundTaskStatus();
  init_LocalAgentTask();
  init_CoordinatorAgentStatus();
  init_taskStatusUtils();
  init_agentSwarmsEnabled();
  init_TeamStatus();
  init_registry();
  init_AppState();
  init_state();
  init_HistorySearchInput();
  init_usePrStatus();
  init_KeyboardShortcutHint();
  init_Byline();
  init_useTerminalSize();
  init_useTasksV2();
  init_format();
  init_VoiceIndicator();
  init_useVoiceEnabled();
  init_voice();
  init_fullscreen();
  init_terminal();
  init_use_selection();
  init_config4();
  init_platform();
  init_PrBadge();
  import_compiler_runtime332 = __toESM(require_react_compiler_runtime_development(), 1), import_react251 = __toESM(require_react_development(), 1), jsx_dev_runtime429 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
