// Original: src/components/StatusLine.tsx
function statusLineShouldDisplay(settings) {
  return settings?.statusLine !== void 0;
}
function buildStatusLineCommandInput(permissionMode, exceeds200kTokens, settings, messages, addedDirs, mainLoopModel, vimMode) {
  let agentType = getMainThreadAgentType(), worktreeSession = getCurrentWorktreeSession(), runtimeModel = getRuntimeMainLoopModel({
    permissionMode,
    mainLoopModel,
    exceeds200kTokens
  }), outputStyleName = settings?.outputStyle || DEFAULT_OUTPUT_STYLE_NAME, currentUsage = getCurrentUsage(messages), contextWindowSize = getContextWindowForModel(runtimeModel, getSdkBetas()), contextPercentages = calculateContextPercentages(currentUsage, contextWindowSize), sessionId = getSessionId(), sessionName = getCurrentSessionTitle(sessionId), rawUtil = getRawUtilization(), rateLimits = {
    ...rawUtil.five_hour && {
      five_hour: {
        used_percentage: rawUtil.five_hour.utilization * 100,
        resets_at: rawUtil.five_hour.resets_at
      }
    },
    ...rawUtil.seven_day && {
      seven_day: {
        used_percentage: rawUtil.seven_day.utilization * 100,
        resets_at: rawUtil.seven_day.resets_at
      }
    }
  };
  return {
    ...createBaseHookInput(),
    ...sessionName && {
      session_name: sessionName
    },
    model: {
      id: runtimeModel,
      display_name: renderModelName(runtimeModel)
    },
    workspace: {
      current_dir: getCwd(),
      project_dir: getOriginalCwd(),
      added_dirs: addedDirs
    },
    version: "2.1.90",
    output_style: {
      name: outputStyleName
    },
    cost: {
      total_cost_usd: getTotalCostUSD(),
      total_duration_ms: getTotalDuration(),
      total_api_duration_ms: getTotalAPIDuration(),
      total_lines_added: getTotalLinesAdded(),
      total_lines_removed: getTotalLinesRemoved()
    },
    context_window: {
      total_input_tokens: getTotalInputTokens(),
      total_output_tokens: getTotalOutputTokens(),
      context_window_size: contextWindowSize,
      current_usage: currentUsage,
      used_percentage: contextPercentages.used,
      remaining_percentage: contextPercentages.remaining
    },
    exceeds_200k_tokens: exceeds200kTokens,
    ...(rateLimits.five_hour || rateLimits.seven_day) && {
      rate_limits: rateLimits
    },
    ...isVimModeEnabled() && {
      vim: {
        mode: vimMode ?? "INSERT"
      }
    },
    ...agentType && {
      agent: {
        name: agentType
      }
    },
    ...getIsRemoteMode() && {
      remote: {
        session_id: getSessionId()
      }
    },
    ...worktreeSession && {
      worktree: {
        name: worktreeSession.worktreeName,
        path: worktreeSession.worktreePath,
        branch: worktreeSession.worktreeBranch,
        original_cwd: worktreeSession.originalCwd,
        original_branch: worktreeSession.originalBranch
      }
    }
  };
}
function getLastAssistantMessageId(messages) {
  return getLastAssistantMessage(messages)?.uuid ?? null;
}
function StatusLineInner({
  messagesRef,
  lastAssistantMessageId,
  vimMode
}) {
  let abortControllerRef = import_react248.useRef(void 0), permissionMode = useAppState((s2) => s2.toolPermissionContext.mode), additionalWorkingDirectories = useAppState((s2) => s2.toolPermissionContext.additionalWorkingDirectories), statusLineText = useAppState((s2) => s2.statusLineText), setAppState = useSetAppState(), settings = useSettings(), {
    addNotification
  } = useNotifications(), mainLoopModel = useMainLoopModel(), settingsRef = import_react248.useRef(settings);
  settingsRef.current = settings;
  let vimModeRef = import_react248.useRef(vimMode);
  vimModeRef.current = vimMode;
  let permissionModeRef = import_react248.useRef(permissionMode);
  permissionModeRef.current = permissionMode;
  let addedDirsRef = import_react248.useRef(additionalWorkingDirectories);
  addedDirsRef.current = additionalWorkingDirectories;
  let mainLoopModelRef = import_react248.useRef(mainLoopModel);
  mainLoopModelRef.current = mainLoopModel;
  let previousStateRef = import_react248.useRef({
    messageId: null,
    exceeds200kTokens: !1,
    permissionMode,
    vimMode,
    mainLoopModel
  }), debounceTimerRef = import_react248.useRef(void 0), logNextResultRef = import_react248.useRef(!0), doUpdate = import_react248.useCallback(async () => {
    abortControllerRef.current?.abort();
    let controller = new AbortController;
    abortControllerRef.current = controller;
    let msgs = messagesRef.current, logResult2 = logNextResultRef.current;
    logNextResultRef.current = !1;
    try {
      let exceeds200kTokens = previousStateRef.current.exceeds200kTokens, currentMessageId = getLastAssistantMessageId(msgs);
      if (currentMessageId !== previousStateRef.current.messageId)
        exceeds200kTokens = doesMostRecentAssistantMessageExceed200k(msgs), previousStateRef.current.messageId = currentMessageId, previousStateRef.current.exceeds200kTokens = exceeds200kTokens;
      let statusInput = buildStatusLineCommandInput(permissionModeRef.current, exceeds200kTokens, settingsRef.current, msgs, Array.from(addedDirsRef.current.keys()), mainLoopModelRef.current, vimModeRef.current), text2 = await executeStatusLineCommand(statusInput, controller.signal, void 0, logResult2);
      if (!controller.signal.aborted)
        setAppState((prev) => {
          if (prev.statusLineText === text2)
            return prev;
          return {
            ...prev,
            statusLineText: text2
          };
        });
    } catch {}
  }, [messagesRef, setAppState]), scheduleUpdate = import_react248.useCallback(() => {
    if (debounceTimerRef.current !== void 0)
      clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout((ref, doUpdate2) => {
      ref.current = void 0, doUpdate2();
    }, 300, debounceTimerRef, doUpdate);
  }, [doUpdate]);
  import_react248.useEffect(() => {
    if (lastAssistantMessageId !== previousStateRef.current.messageId || permissionMode !== previousStateRef.current.permissionMode || vimMode !== previousStateRef.current.vimMode || mainLoopModel !== previousStateRef.current.mainLoopModel)
      previousStateRef.current.permissionMode = permissionMode, previousStateRef.current.vimMode = vimMode, previousStateRef.current.mainLoopModel = mainLoopModel, scheduleUpdate();
  }, [lastAssistantMessageId, permissionMode, vimMode, mainLoopModel, scheduleUpdate]);
  let statusLineCommand = settings?.statusLine?.command, isFirstSettingsRender = import_react248.useRef(!0);
  import_react248.useEffect(() => {
    if (isFirstSettingsRender.current) {
      isFirstSettingsRender.current = !1;
      return;
    }
    logNextResultRef.current = !0, doUpdate();
  }, [statusLineCommand, doUpdate]), import_react248.useEffect(() => {
    let statusLine = settings?.statusLine;
    if (statusLine) {
      if (logEvent("tengu_status_line_mount", {
        command_length: statusLine.command.length,
        padding: statusLine.padding
      }), settings.disableAllHooks === !0)
        logForDebugging("Status line is configured but disableAllHooks is true", {
          level: "warn"
        });
      if (!checkHasTrustDialogAccepted())
        addNotification({
          key: "statusline-trust-blocked",
          text: "statusline skipped \xB7 restart to fix",
          color: "warning",
          priority: "low"
        }), logForDebugging("Status line command skipped: workspace trust not accepted", {
          level: "warn"
        });
    }
  }, []), import_react248.useEffect(() => {
    return doUpdate(), () => {
      if (abortControllerRef.current?.abort(), debounceTimerRef.current !== void 0)
        clearTimeout(debounceTimerRef.current);
    };
  }, []);
  let paddingX = settings?.statusLine?.padding ?? 0;
  return /* @__PURE__ */ jsx_dev_runtime424.jsxDEV(ThemedBox_default, {
    paddingX,
    gap: 2,
    children: statusLineText ? /* @__PURE__ */ jsx_dev_runtime424.jsxDEV(ThemedText, {
      dimColor: !0,
      wrap: "truncate",
      children: /* @__PURE__ */ jsx_dev_runtime424.jsxDEV(Ansi, {
        children: statusLineText
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this) : isFullscreenEnvEnabled() ? /* @__PURE__ */ jsx_dev_runtime424.jsxDEV(ThemedText, {
      children: " "
    }, void 0, !1, void 0, this) : null
  }, void 0, !1, void 0, this);
}
var import_react248, jsx_dev_runtime424, StatusLine;
var init_StatusLine = __esm(() => {
  init_AppState();
  init_state();
  init_outputStyles();
  init_notifications();
  init_cost_tracker();
  init_useMainLoopModel();
  init_useSettings();
  init_ink2();
  init_claudeAiLimits();
  init_config4();
  init_context();
  init_cwd2();
  init_debug();
  init_fullscreen();
  init_hooks5();
  init_messages3();
  init_model();
  init_sessionStorage();
  init_tokens();
  init_worktree();
  init_utils16();
  import_react248 = __toESM(require_react_development(), 1), jsx_dev_runtime424 = __toESM(require_react_jsx_dev_runtime_development(), 1);
  StatusLine = import_react248.memo(StatusLineInner);
});
