// function: REPL
function REPL({
  commands: initialCommands,
  debug,
  initialTools,
  initialMessages,
  pendingHookMessages,
  initialFileHistorySnapshots,
  initialContentReplacements,
  initialAgentName,
  initialAgentColor,
  mcpClients: initialMcpClients,
  dynamicMcpConfig: initialDynamicMcpConfig,
  autoConnectIdeFlag,
  strictMcpConfig = !1,
  systemPrompt: customSystemPrompt,
  appendSystemPrompt,
  onBeforeQuery,
  onTurnComplete,
  disabled = !1,
  mainThreadAgentDefinition: initialMainThreadAgentDefinition,
  disableSlashCommands = !1,
  taskListId,
  remoteSessionConfig,
  directConnectConfig,
  sshSession,
  thinkingConfig
}) {
  let isRemoteSession = !!remoteSessionConfig, titleDisabled = import_react303.useMemo(() => isEnvTruthy(process.env.CLAUDE_CODE_DISABLE_TERMINAL_TITLE), []), moreRightEnabled = import_react303.useMemo(() => !1, []), disableVirtualScroll = import_react303.useMemo(() => isEnvTruthy(process.env.CLAUDE_CODE_DISABLE_VIRTUAL_SCROLL), []), disableMessageActions = !1;
  import_react303.useEffect(() => {
    return logForDebugging(`[REPL:mount] REPL mounted, disabled=${disabled}`), () => logForDebugging("[REPL:unmount] REPL unmounting");
  }, [disabled]);
  let [mainThreadAgentDefinition, setMainThreadAgentDefinition] = import_react303.useState(initialMainThreadAgentDefinition), toolPermissionContext = useAppState((s2) => s2.toolPermissionContext), verbose = useAppState((s2) => s2.verbose), mcp2 = useAppState((s2) => s2.mcp), plugins = useAppState((s2) => s2.plugins), agentDefinitions = useAppState((s2) => s2.agentDefinitions), fileHistory = useAppState((s2) => s2.fileHistory), initialMessage = useAppState((s2) => s2.initialMessage), queuedCommands = useCommandQueue(), spinnerTip = useAppState((s2) => s2.spinnerTip), showExpandedTodos = useAppState((s2) => s2.expandedView) === "tasks", pendingWorkerRequest = useAppState((s2) => s2.pendingWorkerRequest), pendingSandboxRequest = useAppState((s2) => s2.pendingSandboxRequest), teamContext = useAppState((s2) => s2.teamContext), tasks2 = useAppState((s2) => s2.tasks), workerSandboxPermissions = useAppState((s2) => s2.workerSandboxPermissions), elicitation = useAppState((s2) => s2.elicitation), ultraplanPendingChoice = useAppState((s2) => s2.ultraplanPendingChoice), ultraplanLaunchPending = useAppState((s2) => s2.ultraplanLaunchPending), viewingAgentTaskId = useAppState((s2) => s2.viewingAgentTaskId), setAppState = useSetAppState(), viewedLocalAgent = viewingAgentTaskId ? tasks2[viewingAgentTaskId] : void 0, needsBootstrap = isLocalAgentTask(viewedLocalAgent) && viewedLocalAgent.retain && !viewedLocalAgent.diskLoaded;
  import_react303.useEffect(() => {
    if (!viewingAgentTaskId || !needsBootstrap)
      return;
    let taskId = viewingAgentTaskId;
    getAgentTranscript(asAgentId(taskId)).then((result) => {
      setAppState((prev) => {
        let t2 = prev.tasks[taskId];
        if (!isLocalAgentTask(t2) || t2.diskLoaded || !t2.retain)
          return prev;
        let live = t2.messages ?? [], liveUuids = new Set(live.map((m4) => m4.uuid)), diskOnly = result ? result.messages.filter((m4) => !liveUuids.has(m4.uuid)) : [];
        return {
          ...prev,
          tasks: {
            ...prev.tasks,
            [taskId]: {
              ...t2,
              messages: [...diskOnly, ...live],
              diskLoaded: !0
            }
          }
        };
      });
    });
  }, [viewingAgentTaskId, needsBootstrap, setAppState]);
  let store = useAppStateStore(), terminal = useTerminalNotification(), mainLoopModel = useMainLoopModel(), [localCommands, setLocalCommands] = import_react303.useState(initialCommands);
  useSkillsChange(isRemoteSession ? void 0 : getProjectRoot(), setLocalCommands);
  let proactiveActive = React152.useSyncExternalStore(proactiveModule7?.subscribeToProactiveChanges ?? PROACTIVE_NO_OP_SUBSCRIBE, proactiveModule7?.isProactiveActive ?? PROACTIVE_FALSE), isBriefOnly = useAppState((s2) => s2.isBriefOnly), localTools = import_react303.useMemo(() => getTools(toolPermissionContext), [toolPermissionContext, proactiveActive, isBriefOnly]);
  useKickOffCheckAndDisableBypassPermissionsIfNeeded(), useKickOffCheckAndDisableAutoModeIfNeeded();
  let [dynamicMcpConfig, setDynamicMcpConfig] = import_react303.useState(initialDynamicMcpConfig), onChangeDynamicMcpConfig = import_react303.useCallback((config11) => {
    setDynamicMcpConfig(config11);
  }, [setDynamicMcpConfig]), [screen, setScreen] = import_react303.useState("prompt"), [showAllInTranscript, setShowAllInTranscript] = import_react303.useState(!1), [dumpMode, setDumpMode] = import_react303.useState(!1), [editorStatus, setEditorStatus] = import_react303.useState(""), editorGenRef = import_react303.useRef(0), editorTimerRef = import_react303.useRef(void 0), editorRenderingRef = import_react303.useRef(!1), {
    addNotification,
    removeNotification
  } = useNotifications(), trySuggestBgPRIntercept = SUGGEST_BG_PR_NOOP, mcpClients = useMergedClients(initialMcpClients, mcp2.clients), [ideSelection, setIDESelection] = import_react303.useState(void 0), [ideToInstallExtension, setIDEToInstallExtension] = import_react303.useState(null), [ideInstallationStatus, setIDEInstallationStatus] = import_react303.useState(null), [showIdeOnboarding, setShowIdeOnboarding] = import_react303.useState(!1), [showModelSwitchCallout, setShowModelSwitchCallout] = import_react303.useState(() => {
    return !1;
  }), [showEffortCallout, setShowEffortCallout] = import_react303.useState(() => shouldShowEffortCallout(mainLoopModel)), showRemoteCallout = useAppState((s2) => s2.showRemoteCallout);
  useModelMigrationNotifications(), useCanSwitchToExistingSubscription(), useIDEStatusIndicator({
    ideSelection,
    mcpClients,
    ideInstallationStatus
  }), useMcpConnectivityStatus({
    mcpClients
  }), useAutoModeUnavailableNotification(), usePluginInstallationStatus(), usePluginAutoupdateNotification(), useSettingsErrors(), useRateLimitWarningNotification(mainLoopModel), useFastModeNotification(), useDeprecationWarningNotification(mainLoopModel), useNpmDeprecationNotification(), useAntOrgWarningNotification(), useInstallMessages(), useChromeExtensionNotification(), useOfficialMarketplaceNotification(), useLspInitializationNotification(), useTeammateLifecycleNotification();
  let {
    recommendation: lspRecommendation,
    handleResponse: handleLspResponse
  } = useLspPluginRecommendation(), {
    recommendation: hintRecommendation,
    handleResponse: handleHintResponse
  } = useClaudeCodeHintRecommendation(), combinedInitialTools = import_react303.useMemo(() => {
    return [...localTools, ...initialTools];
  }, [localTools, initialTools]);
  useManagePlugins({
    enabled: !isRemoteSession
  });
  let tasksV2 = useTasksV2WithCollapseEffect();
  import_react303.useEffect(() => {
    if (isRemoteSession)
      return;
    performStartupChecks(setAppState);
  }, [setAppState, isRemoteSession]), usePromptsFromClaudeInChrome(isRemoteSession ? EMPTY_MCP_CLIENTS2 : mcpClients, toolPermissionContext.mode), useSwarmInitialization(setAppState, initialMessages, {
    enabled: !isRemoteSession
  });
  let mergedTools = useMergedTools(combinedInitialTools, mcp2.tools, toolPermissionContext), {
    tools,
    allowedAgentTypes
  } = import_react303.useMemo(() => {
    if (!mainThreadAgentDefinition)
      return {
        tools: mergedTools,
        allowedAgentTypes: void 0
      };
    let resolved = resolveAgentTools(mainThreadAgentDefinition, mergedTools, !1, !0);
    return {
      tools: resolved.resolvedTools,
      allowedAgentTypes: resolved.allowedAgentTypes
    };
  }, [mainThreadAgentDefinition, mergedTools]), commandsWithPlugins = useMergedCommands(localCommands, plugins.commands), mergedCommands = useMergedCommands(commandsWithPlugins, mcp2.commands), commands7 = import_react303.useMemo(() => disableSlashCommands ? [] : mergedCommands, [disableSlashCommands, mergedCommands]);
  useIdeLogging(isRemoteSession ? EMPTY_MCP_CLIENTS2 : mcp2.clients), useIdeSelection(isRemoteSession ? EMPTY_MCP_CLIENTS2 : mcp2.clients, setIDESelection);
  let [streamMode, setStreamMode] = import_react303.useState("responding"), streamModeRef = import_react303.useRef(streamMode);
  streamModeRef.current = streamMode;
  let [streamingToolUses, setStreamingToolUses] = import_react303.useState([]), [streamingThinking, setStreamingThinking] = import_react303.useState(null);
  import_react303.useEffect(() => {
    if (streamingThinking && !streamingThinking.isStreaming && streamingThinking.streamingEndedAt) {
      let remaining = 30000 - (Date.now() - streamingThinking.streamingEndedAt);
      if (remaining > 0) {
        let timer = setTimeout(setStreamingThinking, remaining, null);
        return () => clearTimeout(timer);
      } else
        setStreamingThinking(null);
    }
  }, [streamingThinking]);
  let [abortController, setAbortController] = import_react303.useState(null), abortControllerRef = import_react303.useRef(null);
  abortControllerRef.current = abortController;
  let sendBridgeResultRef = import_react303.useRef(() => {}), restoreMessageSyncRef = import_react303.useRef(() => {}), scrollRef = import_react303.useRef(null), modalScrollRef = import_react303.useRef(null), lastUserScrollTsRef = import_react303.useRef(0), queryGuard = React152.useRef(new QueryGuard).current, isQueryActive = React152.useSyncExternalStore(queryGuard.subscribe, queryGuard.getSnapshot), [isExternalLoading, setIsExternalLoadingRaw] = React152.useState(remoteSessionConfig?.hasInitialPrompt ?? !1), isLoading = isQueryActive || isExternalLoading, [userInputOnProcessing, setUserInputOnProcessingRaw] = React152.useState(void 0), userInputBaselineRef = React152.useRef(0), userMessagePendingRef = React152.useRef(!1), loadingStartTimeRef = React152.useRef(0), totalPausedMsRef = React152.useRef(0), pauseStartTimeRef = React152.useRef(null), resetTimingRefs = React152.useCallback(() => {
    loadingStartTimeRef.current = Date.now(), totalPausedMsRef.current = 0, pauseStartTimeRef.current = null;
  }, []), wasQueryActiveRef = React152.useRef(!1);
  if (isQueryActive && !wasQueryActiveRef.current)
    resetTimingRefs();
  wasQueryActiveRef.current = isQueryActive;
  let setIsExternalLoading = React152.useCallback((value) => {
    if (setIsExternalLoadingRaw(value), value)
      resetTimingRefs();
  }, [resetTimingRefs]), swarmStartTimeRef = React152.useRef(null), swarmBudgetInfoRef = React152.useRef(void 0), focusedInputDialogRef = React152.useRef(void 0), PROMPT_SUPPRESSION_MS = 1500, [isPromptInputActive, setIsPromptInputActive] = React152.useState(!1), [autoUpdaterResult, setAutoUpdaterResult] = import_react303.useState(null);
  import_react303.useEffect(() => {
    if (autoUpdaterResult?.notifications)
      autoUpdaterResult.notifications.forEach((notification) => {
        addNotification({
          key: "auto-updater-notification",
          text: notification,
          priority: "low"
        });
      });
  }, [autoUpdaterResult, addNotification]), import_react303.useEffect(() => {
    if (isFullscreenEnvEnabled())
      maybeGetTmuxMouseHint().then((hint) => {
        if (hint)
          addNotification({
            key: "tmux-mouse-hint",
            text: hint,
            priority: "low"
          });
      });
  }, []);
  let [showUndercoverCallout, setShowUndercoverCallout] = import_react303.useState(!1);
  import_react303.useEffect(() => {}, []);
  let [toolJSX, setToolJSXInternal] = import_react303.useState(null), localJSXCommandRef = import_react303.useRef(null), setToolJSX = import_react303.useCallback((args) => {
    if (args?.isLocalJSXCommand) {
      let {
        clearLocalJSX: _,
        ...rest
      } = args;
      localJSXCommandRef.current = {
        ...rest,
        isLocalJSXCommand: !0
      }, setToolJSXInternal(rest);
      return;
    }
    if (localJSXCommandRef.current) {
      if (args?.clearLocalJSX) {
        localJSXCommandRef.current = null, setToolJSXInternal(null);
        return;
      }
      return;
    }
    if (args?.clearLocalJSX) {
      setToolJSXInternal(null);
      return;
    }
    setToolJSXInternal(args);
  }, []), [toolUseConfirmQueue, setToolUseConfirmQueue] = import_react303.useState([]), [permissionStickyFooter, setPermissionStickyFooter] = import_react303.useState(null), [sandboxPermissionRequestQueue, setSandboxPermissionRequestQueue] = import_react303.useState([]), [promptQueue, setPromptQueue] = import_react303.useState([]), sandboxBridgeCleanupRef = import_react303.useRef(/* @__PURE__ */ new Map), sessionTitle = useAppState((s2) => s2.settings.terminalTitleFromRename) !== !1 ? getCurrentSessionTitle(getSessionId()) : void 0, [haikuTitle, setHaikuTitle] = import_react303.useState(), haikuTitleAttemptedRef = import_react303.useRef((initialMessages?.length ?? 0) > 0), agentTitle = mainThreadAgentDefinition?.agentType, terminalTitle = sessionTitle ?? agentTitle ?? haikuTitle ?? "Claude Code", isWaitingForApproval = toolUseConfirmQueue.length > 0 || promptQueue.length > 0 || pendingWorkerRequest || pendingSandboxRequest, isShowingLocalJSXCommand = toolJSX?.isLocalJSXCommand === !0 && toolJSX?.jsx != null, titleIsAnimating = isLoading && !isWaitingForApproval && !isShowingLocalJSXCommand;
  import_react303.useEffect(() => {
    if (isLoading && !isWaitingForApproval && !isShowingLocalJSXCommand)
      return startPreventSleep(), () => stopPreventSleep();
  }, [isLoading, isWaitingForApproval, isShowingLocalJSXCommand]);
  let sessionStatus = isWaitingForApproval || isShowingLocalJSXCommand ? "waiting" : isLoading ? "busy" : "idle", waitingFor = sessionStatus !== "waiting" ? void 0 : toolUseConfirmQueue.length > 0 ? `approve ${toolUseConfirmQueue[0].tool.name}` : pendingWorkerRequest ? "worker request" : pendingSandboxRequest ? "sandbox request" : isShowingLocalJSXCommand ? "dialog open" : "input needed";
  import_react303.useEffect(() => {}, [sessionStatus, waitingFor]);
  let showStatusInTerminalTab = getGlobalConfig().showStatusInTerminalTab ?? !1;
  useTabStatus(titleDisabled || !showStatusInTerminalTab ? null : sessionStatus), import_react303.useEffect(() => {
    return registerLeaderToolUseConfirmQueue(setToolUseConfirmQueue), () => unregisterLeaderToolUseConfirmQueue();
  }, [setToolUseConfirmQueue]);
  let [messages, rawSetMessages] = import_react303.useState(initialMessages ?? []), messagesRef = import_react303.useRef(messages), idleHintShownRef = import_react303.useRef(!1), setMessages = import_react303.useCallback((action2) => {
    let prev = messagesRef.current, next2 = typeof action2 === "function" ? action2(messagesRef.current) : action2;
    if (messagesRef.current = next2, next2.length < userInputBaselineRef.current)
      userInputBaselineRef.current = 0;
    else if (next2.length > prev.length && userMessagePendingRef.current) {
      let delta = next2.length - prev.length;
      if ((prev.length === 0 || next2[0] === prev[0] ? next2.slice(-delta) : next2.slice(0, delta)).some(isHumanTurn))
        userMessagePendingRef.current = !1;
      else
        userInputBaselineRef.current = next2.length;
    }
    rawSetMessages(next2);
  }, []), setUserInputOnProcessing = import_react303.useCallback((input) => {
    if (input !== void 0)
      userInputBaselineRef.current = messagesRef.current.length, userMessagePendingRef.current = !0;
    else
      userMessagePendingRef.current = !1;
    setUserInputOnProcessingRaw(input);
  }, []), {
    dividerIndex,
    dividerYRef,
    onScrollAway,
    onRepin,
    jumpToNew,
    shiftDivider
  } = useUnseenDivider(messages.length), [cursor, setCursor] = import_react303.useState(null), cursorNavRef = import_react303.useRef(null), unseenDivider = import_react303.useMemo(() => computeUnseenDivider(messages, dividerIndex), [dividerIndex, messages.length]), repinScroll = import_react303.useCallback(() => {
    scrollRef.current?.scrollToBottom(), onRepin(), setCursor(null);
  }, [onRepin, setCursor]), lastMsg = messages.at(-1), lastMsgIsHuman = lastMsg != null && isHumanTurn(lastMsg);
  import_react303.useEffect(() => {
    if (lastMsgIsHuman)
      repinScroll();
  }, [lastMsgIsHuman, lastMsg, repinScroll]);
  let {
    maybeLoadOlder
  } = HISTORY_STUB, composedOnScroll = import_react303.useCallback((sticky, handle) => {
    if (lastUserScrollTsRef.current = Date.now(), sticky)
      onRepin();
    else
      onScrollAway(handle);
  }, [onRepin, onScrollAway, maybeLoadOlder, setAppState]), awaitPendingHooks = useDeferredHookMessages(pendingHookMessages, setMessages), deferredMessages = import_react303.useDeferredValue(messages), deferredBehind = messages.length - deferredMessages.length;
  if (deferredBehind > 0)
    logForDebugging(`[useDeferredValue] Messages deferred by ${deferredBehind} (${deferredMessages.length}\u2192${messages.length})`);
  let [frozenTranscriptState, setFrozenTranscriptState] = import_react303.useState(null), [inputValue, setInputValueRaw] = import_react303.useState(() => consumeEarlyInput()), inputValueRef = import_react303.useRef(inputValue);
  inputValueRef.current = inputValue;
  let insertTextRef = import_react303.useRef(null), setInputValue = import_react303.useCallback((value) => {
    if (trySuggestBgPRIntercept(inputValueRef.current, value))
      return;
    if (inputValueRef.current === "" && value !== "" && Date.now() - lastUserScrollTsRef.current >= RECENT_SCROLL_REPIN_WINDOW_MS)
      repinScroll();
    inputValueRef.current = value, setInputValueRaw(value), setIsPromptInputActive(value.trim().length > 0);
  }, [setIsPromptInputActive, repinScroll, trySuggestBgPRIntercept]);
  import_react303.useEffect(() => {
    if (inputValue.trim().length === 0)
      return;
    let timer = setTimeout(setIsPromptInputActive, PROMPT_SUPPRESSION_MS, !1);
    return () => clearTimeout(timer);
  }, [inputValue]);
  let [inputMode, setInputMode] = import_react303.useState("prompt"), [stashedPrompt, setStashedPrompt] = import_react303.useState(), handleRemoteInit = import_react303.useCallback((remoteSlashCommands) => {
    let remoteCommandSet = new Set(remoteSlashCommands);
    setLocalCommands((prev) => prev.filter((cmd) => remoteCommandSet.has(cmd.name) || REMOTE_SAFE_COMMANDS.has(cmd)));
  }, [setLocalCommands]), [inProgressToolUseIDs, setInProgressToolUseIDs] = import_react303.useState(/* @__PURE__ */ new Set), hasInterruptibleToolInProgressRef = import_react303.useRef(!1), remoteSession = useRemoteSession({
    config: remoteSessionConfig,
    setMessages,
    setIsLoading: setIsExternalLoading,
    onInit: handleRemoteInit,
    setToolUseConfirmQueue,
    tools: combinedInitialTools,
    setStreamingToolUses,
    setStreamMode,
    setInProgressToolUseIDs
  }), directConnect = useDirectConnect({
    config: directConnectConfig,
    setMessages,
    setIsLoading: setIsExternalLoading,
    setToolUseConfirmQueue,
    tools: combinedInitialTools
  }), sshRemote = useSSHSession({
    session: sshSession,
    setMessages,
    setIsLoading: setIsExternalLoading,
    setToolUseConfirmQueue,
    tools: combinedInitialTools
  }), activeRemote = sshRemote.isRemoteMode ? sshRemote : directConnect.isRemoteMode ? directConnect : remoteSession, [pastedContents, setPastedContents] = import_react303.useState({}), [submitCount, setSubmitCount] = import_react303.useState(0), responseLengthRef = import_react303.useRef(0), apiMetricsRef2 = import_react303.useRef([]), setResponseLength = import_react303.useCallback((f) => {
    let prev = responseLengthRef.current;
    if (responseLengthRef.current = f(prev), responseLengthRef.current > prev) {
      let entries2 = apiMetricsRef2.current;
      if (entries2.length > 0) {
        let lastEntry = entries2.at(-1);
        lastEntry.lastTokenTime = Date.now(), lastEntry.endResponseLength = responseLengthRef.current;
      }
    }
  }, []), [streamingText, setStreamingText] = import_react303.useState(null), showStreamingText = !(useAppState((s2) => s2.settings.prefersReducedMotion) ?? !1) && !hasCursorUpViewportYankBug(), onStreamingText = import_react303.useCallback((f) => {
    if (!showStreamingText)
      return;
    setStreamingText(f);
  }, [showStreamingText]), visibleStreamingText = streamingText && showStreamingText ? streamingText.substring(0, streamingText.lastIndexOf(`
`) + 1) || null : null, [lastQueryCompletionTime, setLastQueryCompletionTime] = import_react303.useState(0), [spinnerMessage, setSpinnerMessage] = import_react303.useState(null), [spinnerColor, setSpinnerColor] = import_react303.useState(null), [spinnerShimmerColor, setSpinnerShimmerColor] = import_react303.useState(null), [isMessageSelectorVisible, setIsMessageSelectorVisible] = import_react303.useState(!1), [messageSelectorPreselect, setMessageSelectorPreselect] = import_react303.useState(void 0), [showCostDialog, setShowCostDialog] = import_react303.useState(!1), [conversationId, setConversationId] = import_react303.useState(randomUUID42()), [idleReturnPending, setIdleReturnPending] = import_react303.useState(null), skipIdleCheckRef = import_react303.useRef(!1), lastQueryCompletionTimeRef = import_react303.useRef(lastQueryCompletionTime);
  lastQueryCompletionTimeRef.current = lastQueryCompletionTime;
  let [contentReplacementStateRef] = import_react303.useState(() => ({
    current: provisionContentReplacementState(initialMessages, initialContentReplacements)
  })), [haveShownCostDialog, setHaveShownCostDialog] = import_react303.useState(getGlobalConfig().hasAcknowledgedCostThreshold), [vimMode, setVimMode] = import_react303.useState("INSERT"), [showBashesDialog, setShowBashesDialog] = import_react303.useState(!1), [isSearchingHistory, setIsSearchingHistory] = import_react303.useState(!1), [isHelpOpen, setIsHelpOpen] = import_react303.useState(!1);
  import_react303.useEffect(() => {
    if (ultraplanPendingChoice && showBashesDialog)
      setShowBashesDialog(!1);
  }, [ultraplanPendingChoice, showBashesDialog]);
  let isTerminalFocused = useTerminalFocus(), terminalFocusRef = import_react303.useRef(isTerminalFocused);
  terminalFocusRef.current = isTerminalFocused;
  let [theme2] = useTheme(), tipPickedThisTurnRef = React152.useRef(!1), pickNewSpinnerTip = import_react303.useCallback(() => {
    if (tipPickedThisTurnRef.current)
      return;
    tipPickedThisTurnRef.current = !0;
    let newMessages = messagesRef.current.slice(bashToolsProcessedIdx.current);
    for (let tool of extractBashToolsFromMessages(newMessages))
      bashTools.current.add(tool);
    bashToolsProcessedIdx.current = messagesRef.current.length, getTipToShowOnSpinner({
      theme: theme2,
      readFileState: readFileState.current,
      bashTools: bashTools.current
    }).then(async (tip) => {
      if (tip) {
        let content = await tip.content({
          theme: theme2
        });
        setAppState((prev) => ({
          ...prev,
          spinnerTip: content
        })), recordShownTip(tip);
      } else
        setAppState((prev) => {
          if (prev.spinnerTip === void 0)
            return prev;
          return {
            ...prev,
            spinnerTip: void 0
          };
        });
    });
  }, [setAppState, theme2]), resetLoadingState = import_react303.useCallback(() => {
    setIsExternalLoading(!1), setUserInputOnProcessing(void 0), responseLengthRef.current = 0, apiMetricsRef2.current = [], setStreamingText(null), setStreamingToolUses([]), setSpinnerMessage(null), setSpinnerColor(null), setSpinnerShimmerColor(null), pickNewSpinnerTip(), endInteractionSpan(), clearSpeculativeChecks();
  }, [pickNewSpinnerTip]), hasRunningTeammates = import_react303.useMemo(() => getAllInProcessTeammateTasks(tasks2).some((t2) => t2.status === "running"), [tasks2]);
  import_react303.useEffect(() => {
    if (!hasRunningTeammates && swarmStartTimeRef.current !== null) {
      let totalMs = Date.now() - swarmStartTimeRef.current, deferredBudget = swarmBudgetInfoRef.current;
      swarmStartTimeRef.current = null, swarmBudgetInfoRef.current = void 0, setMessages((prev) => [...prev, createTurnDurationMessage(totalMs, deferredBudget, count2(prev, isLoggableMessage))]);
    }
  }, [hasRunningTeammates, setMessages]);
  let safeYoloMessageShownRef = import_react303.useRef(!1);
  import_react303.useEffect(() => {}, [toolPermissionContext.mode, setMessages]);
  let worktreeTipShownRef = import_react303.useRef(!1);
  import_react303.useEffect(() => {
    if (worktreeTipShownRef.current)
      return;
    let wt = getCurrentWorktreeSession();
    if (!wt?.creationDurationMs || wt.usedSparsePaths)
      return;
    if (wt.creationDurationMs < 15000)
      return;
    worktreeTipShownRef.current = !0;
    let secs = Math.round(wt.creationDurationMs / 1000);
    setMessages((prev) => [...prev, createSystemMessage(`Worktree creation took ${secs}s. For large repos, set \`worktree.sparsePaths\` in .claude/settings.json to check out only the directories you need \u2014 e.g. \`{"worktree": {"sparsePaths": ["src", "packages/foo"]}}\`.`, "info")]);
  }, [setMessages]);
  let onlySleepToolActive = import_react303.useMemo(() => {
    let lastAssistant = messages.findLast((m4) => m4.type === "assistant");
    if (lastAssistant?.type !== "assistant")
      return !1;
    let inProgressToolUses = lastAssistant.message.content.filter((b) => b.type === "tool_use" && inProgressToolUseIDs.has(b.id));
    return inProgressToolUses.length > 0 && inProgressToolUses.every((b) => b.type === "tool_use" && b.name === SLEEP_TOOL_NAME);
  }, [messages, inProgressToolUseIDs]), {
    onBeforeQuery: mrOnBeforeQuery,
    onTurnComplete: mrOnTurnComplete,
    render: mrRender
  } = useMoreRight({
    enabled: moreRightEnabled,
    setMessages,
    inputValue,
    setInputValue,
    setToolJSX
  }), showSpinner = (!toolJSX || toolJSX.showSpinner === !0) && toolUseConfirmQueue.length === 0 && promptQueue.length === 0 && (isLoading || userInputOnProcessing || hasRunningTeammates || getCommandQueueLength() > 0) && !pendingWorkerRequest && !onlySleepToolActive && (!visibleStreamingText || isBriefOnly), hasActivePrompt = toolUseConfirmQueue.length > 0 || promptQueue.length > 0 || sandboxPermissionRequestQueue.length > 0 || elicitation.queue.length > 0 || workerSandboxPermissions.queue.length > 0, showIssueFlagBanner = useIssueFlagBanner(messages, submitCount);
  useIDEIntegration({
    autoConnectIdeFlag,
    ideToInstallExtension,
    setDynamicMcpConfig,
    setShowIdeOnboarding,
    setIDEInstallationState: setIDEInstallationStatus
  }), useFileHistorySnapshotInit(initialFileHistorySnapshots, fileHistory, (fileHistoryState) => setAppState((prev) => ({
    ...prev,
    fileHistory: fileHistoryState
  })));
  let resume2 = import_react303.useCallback(async (sessionId, log4, entrypoint) => {
    let resumeStart = performance.now();
    try {
      let messages2 = deserializeMessages(log4.messages), sessionEndTimeoutMs = getSessionEndHookTimeoutMs();
      await executeSessionEndHooks("resume", {
        getAppState: () => store.getState(),
        setAppState,
        signal: AbortSignal.timeout(sessionEndTimeoutMs),
        timeoutMs: sessionEndTimeoutMs
      });
      let hookMessages = await processSessionStartHooks("resume", {
        sessionId,
        agentType: mainThreadAgentDefinition?.agentType,
        model: mainLoopModel
      });
      if (messages2.push(...hookMessages), entrypoint === "fork")
        copyPlanForFork(log4, asSessionId(sessionId));
      else
        copyPlanForResume(log4, asSessionId(sessionId));
      if (restoreSessionStateFromLog(log4, setAppState), log4.fileHistorySnapshots)
        copyFileHistoryForResume(log4);
      let {
        agentDefinition: restoredAgent
      } = restoreAgentFromSession(log4.agentSetting, initialMainThreadAgentDefinition, agentDefinitions);
      setMainThreadAgentDefinition(restoredAgent), setAppState((prev) => ({
        ...prev,
        agent: restoredAgent?.agentType
      })), setAppState((prev) => ({
        ...prev,
        standaloneAgentContext: computeStandaloneAgentContext(log4.agentName, log4.agentColor)
      })), updateSessionName(log4.agentName), restoreReadFileState(messages2, log4.projectPath ?? getOriginalCwd()), resetLoadingState(), setAbortController(null), setConversationId(sessionId);
      let targetSessionCosts = getStoredSessionCosts(sessionId);
      saveCurrentSessionCosts(), resetCostState(), switchSession(asSessionId(sessionId), log4.fullPath ? dirname62(log4.fullPath) : null);
      let {
        renameRecordingForSession: renameRecordingForSession2
      } = await Promise.resolve().then(() => (init_asciicast(), exports_asciicast));
      if (await renameRecordingForSession2(), await resetSessionFilePointer(), clearSessionMetadata(), restoreSessionMetadata(log4), haikuTitleAttemptedRef.current = !0, setHaikuTitle(void 0), entrypoint !== "fork")
        exitRestoredWorktree(), restoreWorktreeForResume(log4.worktreeSession), adoptResumedSessionFile(), restoreRemoteAgentTasks({
          abortController: new AbortController,
          getAppState: () => store.getState(),
          setAppState
        });
      else {
        let ws = getCurrentWorktreeSession();
        if (ws)
          saveWorktreeState(ws);
      }
      if (targetSessionCosts)
        setCostStateForRestore(targetSessionCosts);
      if (contentReplacementStateRef.current && entrypoint !== "fork")
        contentReplacementStateRef.current = reconstructContentReplacementState(messages2, log4.contentReplacements ?? []);
      setMessages(() => messages2), setToolJSX(null), setInputValue(""), logEvent("tengu_session_resumed", {
        entrypoint,
        success: !0,
        resume_duration_ms: Math.round(performance.now() - resumeStart)
      });
    } catch (error44) {
      throw logEvent("tengu_session_resumed", {
        entrypoint,
        success: !1
      }), error44;
    }
  }, [resetLoadingState, setAppState]), [initialReadFileState] = import_react303.useState(() => createFileStateCacheWithSizeLimit(READ_FILE_STATE_CACHE_SIZE)), readFileState = import_react303.useRef(initialReadFileState), bashTools = import_react303.useRef(/* @__PURE__ */ new Set), bashToolsProcessedIdx = import_react303.useRef(0), discoveredSkillNamesRef = import_react303.useRef(/* @__PURE__ */ new Set), loadedNestedMemoryPathsRef = import_react303.useRef(/* @__PURE__ */ new Set), restoreReadFileState = import_react303.useCallback((messages2, cwd2) => {
    let extracted = extractReadFilesFromMessages(messages2, cwd2, READ_FILE_STATE_CACHE_SIZE);
    readFileState.current = mergeFileStateCaches(readFileState.current, extracted);
    for (let tool of extractBashToolsFromMessages(messages2))
      bashTools.current.add(tool);
  }, []);
  import_react303.useEffect(() => {
    if (initialMessages && initialMessages.length > 0)
      restoreReadFileState(initialMessages, getOriginalCwd()), restoreRemoteAgentTasks({
        abortController: new AbortController,
        getAppState: () => store.getState(),
        setAppState
      });
  }, []);
  let {
    status: apiKeyStatus,
    reverify
  } = useApiKeyVerification(), [autoRunIssueReason, setAutoRunIssueReason] = import_react303.useState(null), [exitFlow, setExitFlow] = import_react303.useState(null), [isExiting, setIsExiting] = import_react303.useState(!1), showingCostDialog = !isLoading && showCostDialog;
  function getFocusedInputDialog() {
    if (isExiting || exitFlow)
      return;
    if (isMessageSelectorVisible)
      return "message-selector";
    if (isPromptInputActive)
      return;
    if (sandboxPermissionRequestQueue[0])
      return "sandbox-permission";
    let allowDialogsWithAnimation = !toolJSX || toolJSX.shouldContinueAnimation;
    if (allowDialogsWithAnimation && toolUseConfirmQueue[0])
      return "tool-permission";
    if (allowDialogsWithAnimation && promptQueue[0])
      return "prompt";
    if (allowDialogsWithAnimation && workerSandboxPermissions.queue[0])
      return "worker-sandbox-permission";
    if (allowDialogsWithAnimation && elicitation.queue[0])
      return "elicitation";
    if (allowDialogsWithAnimation && showingCostDialog)
      return "cost";
    if (allowDialogsWithAnimation && idleReturnPending)
      return "idle-return";
    if (allowDialogsWithAnimation && showIdeOnboarding)
      return "ide-onboarding";
    if (allowDialogsWithAnimation && showEffortCallout)
      return "effort-callout";
    if (allowDialogsWithAnimation && showRemoteCallout)
      return "remote-callout";
    if (allowDialogsWithAnimation && lspRecommendation)
      return "lsp-recommendation";
    if (allowDialogsWithAnimation && hintRecommendation)
      return "plugin-hint";
    return;
  }
  let focusedInputDialog = getFocusedInputDialog(), hasSuppressedDialogs = isPromptInputActive && (sandboxPermissionRequestQueue[0] || toolUseConfirmQueue[0] || promptQueue[0] || workerSandboxPermissions.queue[0] || elicitation.queue[0] || showingCostDialog);
  focusedInputDialogRef.current = focusedInputDialog, import_react303.useEffect(() => {
    if (!isLoading)
      return;
    let isPaused = focusedInputDialog === "tool-permission", now2 = Date.now();
    if (isPaused && pauseStartTimeRef.current === null)
      pauseStartTimeRef.current = now2;
    else if (!isPaused && pauseStartTimeRef.current !== null)
      totalPausedMsRef.current += now2 - pauseStartTimeRef.current, pauseStartTimeRef.current = null;
  }, [focusedInputDialog, isLoading]);
  let prevDialogRef = import_react303.useRef(focusedInputDialog);
  import_react303.useLayoutEffect(() => {
    if (prevDialogRef.current === "tool-permission" !== (focusedInputDialog === "tool-permission"))
      repinScroll();
    prevDialogRef.current = focusedInputDialog;
  }, [focusedInputDialog, repinScroll]);
  function onCancel() {
    if (focusedInputDialog === "elicitation")
      return;
    if (logForDebugging(`[onCancel] focusedInputDialog=${focusedInputDialog} streamMode=${streamMode}`), proactiveModule7?.pauseProactive(), queryGuard.forceEnd(), skipIdleCheckRef.current = !1, streamingText?.trim())
      setMessages((prev) => [...prev, createAssistantMessage({
        content: streamingText
      })]);
    if (resetLoadingState(), focusedInputDialog === "tool-permission")
      toolUseConfirmQueue[0]?.onAbort(), setToolUseConfirmQueue([]);
    else if (focusedInputDialog === "prompt") {
      for (let item of promptQueue)
        item.reject(Error("Prompt cancelled by user"));
      setPromptQueue([]), abortController?.abort("user-cancel");
    } else if (activeRemote.isRemoteMode)
      activeRemote.cancelRequest();
    else
      abortController?.abort("user-cancel");
    setAbortController(null), mrOnTurnComplete(messagesRef.current, !0);
  }
  let handleQueuedCommandOnCancel = import_react303.useCallback(() => {
    let result = popAllEditable(inputValue, 0);
    if (!result)
      return;
    if (setInputValue(result.text), setInputMode("prompt"), result.images.length > 0)
      setPastedContents((prev) => {
        let newContents = {
          ...prev
        };
        for (let image of result.images)
          newContents[image.id] = image;
        return newContents;
      });
  }, [setInputValue, setInputMode, inputValue, setPastedContents]), cancelRequestProps = {
    setToolUseConfirmQueue,
    onCancel,
    onAgentsKilled: () => setMessages((prev) => [...prev, createAgentsKilledMessage()]),
    isMessageSelectorVisible: isMessageSelectorVisible || !!showBashesDialog,
    screen,
    abortSignal: abortController?.signal,
    popCommandFromQueue: handleQueuedCommandOnCancel,
    vimMode,
    isLocalJSXCommand: toolJSX?.isLocalJSXCommand,
    isSearchingHistory,
    isHelpOpen,
    inputMode,
    inputValue,
    streamMode
  };
  import_react303.useEffect(() => {
    if (getTotalCostUSD() >= 5 && !showCostDialog && !haveShownCostDialog) {
      if (logEvent("tengu_cost_threshold_reached", {}), setHaveShownCostDialog(!0), hasConsoleBillingAccess())
        setShowCostDialog(!0);
    }
  }, [messages, showCostDialog, haveShownCostDialog]);
  let sandboxAskCallback = import_react303.useCallback(async (hostPattern) => {
    if (isAgentSwarmsEnabled() && isSwarmWorker()) {
      let requestId = generateSandboxRequestId(), sent = await sendSandboxPermissionRequestViaMailbox(hostPattern.host, requestId);
      return new Promise((resolveShouldAllowHost) => {
        if (!sent) {
          setSandboxPermissionRequestQueue((prev) => [...prev, {
            hostPattern,
            resolvePromise: resolveShouldAllowHost
          }]);
          return;
        }
        registerSandboxPermissionCallback({
          requestId,
          host: hostPattern.host,
          resolve: resolveShouldAllowHost
        }), setAppState((prev) => ({
          ...prev,
          pendingSandboxRequest: {
            requestId,
            host: hostPattern.host
          }
        }));
      });
    }
    return new Promise((resolveShouldAllowHost) => {
      let resolved = !1;
      function resolveOnce(allow) {
        if (resolved)
          return;
        resolved = !0, resolveShouldAllowHost(allow);
      }
      setSandboxPermissionRequestQueue((prev) => [...prev, {
        hostPattern,
        resolvePromise: resolveOnce
      }]);
    });
  }, [setAppState, store]);
  if (import_react303.useEffect(() => {
    let reason = SandboxManager2.getSandboxUnavailableReason();
    if (!reason)
      return;
    if (SandboxManager2.isSandboxRequired()) {
      process.stderr.write(`
Error: sandbox required but unavailable: ${reason}
` + `  sandbox.failIfUnavailable is set \u2014 refusing to start without a working sandbox.

`), gracefulShutdownSync(1, "other");
      return;
    }
    logForDebugging(`sandbox disabled: ${reason}`, {
      level: "warn"
    }), addNotification({
      key: "sandbox-unavailable",
      jsx: /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(jsx_dev_runtime458.Fragment, {
        children: [
          /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(ThemedText, {
            color: "warning",
            children: "sandbox disabled"
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(ThemedText, {
            dimColor: !0,
            children: " \xB7 /sandbox"
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this),
      priority: "medium"
    });
  }, [addNotification]), SandboxManager2.isSandboxingEnabled())
    SandboxManager2.initialize(sandboxAskCallback).catch((err2) => {
      process.stderr.write(`
\u274C Sandbox Error: ${errorMessage(err2)}
`), gracefulShutdownSync(1, "other");
    });
  let setToolPermissionContext = import_react303.useCallback((context7, options2) => {
    setAppState((prev) => ({
      ...prev,
      toolPermissionContext: {
        ...context7,
        mode: options2?.preserveMode ? prev.toolPermissionContext.mode : context7.mode
      }
    })), setImmediate((setToolUseConfirmQueue2) => {
      setToolUseConfirmQueue2((currentQueue) => {
        return currentQueue.forEach((item) => {
          item.recheckPermission();
        }), currentQueue;
      });
    }, setToolUseConfirmQueue);
  }, [setAppState, setToolUseConfirmQueue]);
  import_react303.useEffect(() => {
    return registerLeaderSetToolPermissionContext(setToolPermissionContext), () => unregisterLeaderSetToolPermissionContext();
  }, [setToolPermissionContext]);
  let canUseTool = useCanUseTool_default(setToolUseConfirmQueue, setToolPermissionContext), requestPrompt = import_react303.useCallback((title, toolInputSummary) => (request2) => new Promise((resolve47, reject2) => {
    setPromptQueue((prev) => [...prev, {
      request: request2,
      title,
      toolInputSummary,
      resolve: resolve47,
      reject: reject2
    }]);
  }), []), getToolUseContext = import_react303.useCallback((messages2, newMessages, abortController2, mainLoopModel2) => {
    let s2 = store.getState(), computeTools = () => {
      let state4 = store.getState(), assembled = assembleToolPool(state4.toolPermissionContext, state4.mcp.tools), merged = mergeAndFilterTools(combinedInitialTools, assembled, state4.toolPermissionContext.mode);
      if (!mainThreadAgentDefinition)
        return merged;
      return resolveAgentTools(mainThreadAgentDefinition, merged, !1, !0).resolvedTools;
    };
    return {
      abortController: abortController2,
      options: {
        commands: commands7,
        tools: computeTools(),
        debug,
        verbose: s2.verbose,
        mainLoopModel: mainLoopModel2,
        thinkingConfig: s2.thinkingEnabled !== !1 ? thinkingConfig : {
          type: "disabled"
        },
        mcpClients: mergeClients(initialMcpClients, s2.mcp.clients),
        mcpResources: s2.mcp.resources,
        ideInstallationStatus,
        isNonInteractiveSession: !1,
        dynamicMcpConfig,
        theme: theme2,
        agentDefinitions: allowedAgentTypes ? {
          ...s2.agentDefinitions,
          allowedAgentTypes
        } : s2.agentDefinitions,
        customSystemPrompt,
        appendSystemPrompt,
        refreshTools: computeTools
      },
      getAppState: () => store.getState(),
      setAppState,
      messages: messages2,
      setMessages,
      updateFileHistoryState(updater) {
        setAppState((prev) => {
          let updated = updater(prev.fileHistory);
          if (updated === prev.fileHistory)
            return prev;
          return {
            ...prev,
            fileHistory: updated
          };
        });
      },
      updateAttributionState(updater) {
        setAppState((prev) => {
          let updated = updater(prev.attribution);
          if (updated === prev.attribution)
            return prev;
          return {
            ...prev,
            attribution: updated
          };
        });
      },
      openMessageSelector: () => {
        if (!disabled)
          setIsMessageSelectorVisible(!0);
      },
      onChangeAPIKey: reverify,
      readFileState: readFileState.current,
      setToolJSX,
      addNotification,
      appendSystemMessage: (msg) => setMessages((prev) => [...prev, msg]),
      sendOSNotification: (opts) => {
        sendNotification(opts, terminal);
      },
      onChangeDynamicMcpConfig,
      onInstallIDEExtension: setIDEToInstallExtension,
      nestedMemoryAttachmentTriggers: /* @__PURE__ */ new Set,
      loadedNestedMemoryPaths: loadedNestedMemoryPathsRef.current,
      dynamicSkillDirTriggers: /* @__PURE__ */ new Set,
      discoveredSkillNames: discoveredSkillNamesRef.current,
      setResponseLength,
      pushApiMetricsEntry: void 0,
      setStreamMode,
      onCompactProgress: (event) => {
        switch (event.type) {
          case "hooks_start":
            setSpinnerColor("claudeBlue_FOR_SYSTEM_SPINNER"), setSpinnerShimmerColor("claudeBlueShimmer_FOR_SYSTEM_SPINNER"), setSpinnerMessage(event.hookType === "pre_compact" ? "Running PreCompact hooks\u2026" : event.hookType === "post_compact" ? "Running PostCompact hooks\u2026" : "Running SessionStart hooks\u2026");
            break;
          case "compact_start":
            setSpinnerMessage("Compacting conversation");
            break;
          case "compact_end":
            setSpinnerMessage(null), setSpinnerColor(null), setSpinnerShimmerColor(null);
            break;
        }
      },
      setInProgressToolUseIDs,
      setHasInterruptibleToolInProgress: (v2) => {
        hasInterruptibleToolInProgressRef.current = v2;
      },
      resume: resume2,
      setConversationId,
      requestPrompt: void 0,
      contentReplacementState: contentReplacementStateRef.current
    };
  }, [commands7, combinedInitialTools, mainThreadAgentDefinition, debug, initialMcpClients, ideInstallationStatus, dynamicMcpConfig, theme2, allowedAgentTypes, store, setAppState, reverify, addNotification, setMessages, onChangeDynamicMcpConfig, resume2, requestPrompt, disabled, customSystemPrompt, appendSystemPrompt, setConversationId]), handleBackgroundQuery = import_react303.useCallback(() => {
    abortController?.abort("background");
    let removedNotifications = removeByFilter((cmd) => cmd.mode === "task-notification");
    (async () => {
      let toolUseContext = getToolUseContext(messagesRef.current, [], new AbortController, mainLoopModel), [defaultSystemPrompt, userContext, systemContext] = await Promise.all([getSystemPrompt(toolUseContext.options.tools, mainLoopModel, Array.from(toolPermissionContext.additionalWorkingDirectories.keys()), toolUseContext.options.mcpClients), getUserContext(), getSystemContext()]), systemPrompt = buildEffectiveSystemPrompt({
        mainThreadAgentDefinition,
        toolUseContext,
        customSystemPrompt,
        defaultSystemPrompt,
        appendSystemPrompt
      });
      toolUseContext.renderedSystemPrompt = systemPrompt;
      let notificationMessages = (await getQueuedCommandAttachments(removedNotifications).catch(() => [])).map(createAttachmentMessage), existingPrompts = /* @__PURE__ */ new Set;
      for (let m4 of messagesRef.current)
        if (m4.type === "attachment" && m4.attachment.type === "queued_command" && m4.attachment.commandMode === "task-notification" && typeof m4.attachment.prompt === "string")
          existingPrompts.add(m4.attachment.prompt);
      let uniqueNotifications = notificationMessages.filter((m4) => m4.attachment.type === "queued_command" && (typeof m4.attachment.prompt !== "string" || !existingPrompts.has(m4.attachment.prompt)));
      startBackgroundSession({
        messages: [...messagesRef.current, ...uniqueNotifications],
        queryParams: {
          systemPrompt,
          userContext,
          systemContext,
          canUseTool,
          toolUseContext,
          querySource: getQuerySourceForREPL()
        },
        description: terminalTitle,
        setAppState,
        agentDefinition: mainThreadAgentDefinition
      });
    })();
  }, [abortController, mainLoopModel, toolPermissionContext, mainThreadAgentDefinition, getToolUseContext, customSystemPrompt, appendSystemPrompt, canUseTool, setAppState]), {
    handleBackgroundSession
  } = useSessionBackgrounding({
    setMessages,
    setIsLoading: setIsExternalLoading,
    resetLoadingState,
    setAbortController,
    onBackgroundQuery: handleBackgroundQuery
  }), onQueryEvent = import_react303.useCallback((event) => {
    handleMessageFromStream(event, (newMessage) => {
      if (isCompactBoundaryMessage(newMessage)) {
        if (isFullscreenEnvEnabled())
          setMessages((old) => [...getMessagesAfterCompactBoundary(old, {
            includeSnipped: !0
          }), newMessage]);
        else
          setMessages(() => [newMessage]);
        setConversationId(randomUUID42()), proactiveModule7?.setContextBlocked(!1);
      } else if (newMessage.type === "progress" && isEphemeralToolProgress(newMessage.data.type))
        setMessages((oldMessages) => {
          let last2 = oldMessages.at(-1);
          if (last2?.type === "progress" && last2.parentToolUseID === newMessage.parentToolUseID && last2.data.type === newMessage.data.type) {
            let copy2 = oldMessages.slice();
            return copy2[copy2.length - 1] = newMessage, copy2;
          }
          return [...oldMessages, newMessage];
        });
      else
        setMessages((oldMessages) => [...oldMessages, newMessage]);
      if (newMessage.type === "assistant" && "isApiErrorMessage" in newMessage && newMessage.isApiErrorMessage)
        proactiveModule7?.setContextBlocked(!0);
      else if (newMessage.type === "assistant")
        proactiveModule7?.setContextBlocked(!1);
    }, (newContent) => {
      setResponseLength((length) => length + newContent.length);
    }, setStreamMode, setStreamingToolUses, (tombstonedMessage) => {
      setMessages((oldMessages) => oldMessages.filter((m4) => m4 !== tombstonedMessage)), removeTranscriptMessage(tombstonedMessage.uuid);
    }, setStreamingThinking, (metrics) => {
      let now2 = Date.now(), baseline = responseLengthRef.current;
      apiMetricsRef2.current.push({
        ...metrics,
        firstTokenTime: now2,
        lastTokenTime: now2,
        responseLengthBaseline: baseline,
        endResponseLength: baseline
      });
    }, onStreamingText);
  }, [setMessages, setResponseLength, setStreamMode, setStreamingToolUses, setStreamingThinking, onStreamingText]), onQueryImpl = import_react303.useCallback(async (messagesIncludingNewMessages, newMessages, abortController2, shouldQuery, additionalAllowedTools, mainLoopModelParam, effort) => {
    if (shouldQuery) {
      let freshClients = mergeClients(initialMcpClients, store.getState().mcp.clients);
      diagnosticTracker.handleQueryStart(freshClients);
      let ideClient = getConnectedIdeClient(freshClients);
      if (ideClient)
        closeOpenDiffs(ideClient);
    }
    if (maybeMarkProjectOnboardingComplete(), !titleDisabled && !sessionTitle && !agentTitle && !haikuTitleAttemptedRef.current) {
      let firstUserMessage = newMessages.find((m4) => m4.type === "user" && !m4.isMeta), text2 = firstUserMessage?.type === "user" ? getContentText(firstUserMessage.message.content) : null;
      if (text2 && !text2.startsWith(`<${LOCAL_COMMAND_STDOUT_TAG}>`) && !text2.startsWith(`<${COMMAND_MESSAGE_TAG}>`) && !text2.startsWith(`<${COMMAND_NAME_TAG}>`) && !text2.startsWith(`<${BASH_INPUT_TAG}>`))
        haikuTitleAttemptedRef.current = !0, generateSessionTitle(text2, new AbortController().signal).then((title) => {
          if (title)
            setHaikuTitle(title);
          else
            haikuTitleAttemptedRef.current = !1;
        }, () => {
          haikuTitleAttemptedRef.current = !1;
        });
    }
    if (store.setState((prev) => {
      let cur = prev.toolPermissionContext.alwaysAllowRules.command;
      if (cur === additionalAllowedTools || cur?.length === additionalAllowedTools.length && cur.every((v2, i5) => v2 === additionalAllowedTools[i5]))
        return prev;
      return {
        ...prev,
        toolPermissionContext: {
          ...prev.toolPermissionContext,
          alwaysAllowRules: {
            ...prev.toolPermissionContext.alwaysAllowRules,
            command: additionalAllowedTools
          }
        }
      };
    }), !shouldQuery) {
      if (newMessages.some(isCompactBoundaryMessage))
        setConversationId(randomUUID42()), proactiveModule7?.setContextBlocked(!1);
      resetLoadingState(), setAbortController(null);
      return;
    }
    let toolUseContext = getToolUseContext(messagesIncludingNewMessages, newMessages, abortController2, mainLoopModelParam), {
      tools: freshTools,
      mcpClients: freshMcpClients
    } = toolUseContext.options;
    if (effort !== void 0) {
      let previousGetAppState = toolUseContext.getAppState;
      toolUseContext.getAppState = () => ({
        ...previousGetAppState(),
        effortValue: effort
      });
    }
    queryCheckpoint("query_context_loading_start");
    let [, , defaultSystemPrompt, baseUserContext, systemContext] = await Promise.all([
      checkAndDisableBypassPermissionsIfNeeded(toolPermissionContext, setAppState),
      void 0,
      getSystemPrompt(freshTools, mainLoopModelParam, Array.from(toolPermissionContext.additionalWorkingDirectories.keys()), freshMcpClients),
      getUserContext(),
      getSystemContext()
    ]), userContext = {
      ...baseUserContext,
      ...getCoordinatorUserContext(freshMcpClients, isScratchpadEnabled() ? getScratchpadDir() : void 0),
      ...{}
    };
    queryCheckpoint("query_context_loading_end");
    let systemPrompt = buildEffectiveSystemPrompt({
      mainThreadAgentDefinition,
      toolUseContext,
      customSystemPrompt,
      defaultSystemPrompt,
      appendSystemPrompt
    });
    toolUseContext.renderedSystemPrompt = systemPrompt, queryCheckpoint("query_query_start"), resetTurnHookDuration(), resetTurnToolDuration(), resetTurnClassifierDuration();
    for await (let event of query({
      messages: messagesIncludingNewMessages,
      systemPrompt,
      userContext,
      systemContext,
      canUseTool,
      toolUseContext,
      querySource: getQuerySourceForREPL()
    }))
      onQueryEvent(event);
    fireCompanionObserver(messagesRef.current, (reaction) => setAppState((prev) => prev.companionReaction === reaction ? prev : {
      ...prev,
      companionReaction: reaction
    })), queryCheckpoint("query_end"), resetLoadingState(), logQueryProfileReport(), await onTurnComplete?.(messagesRef.current);
  }, [initialMcpClients, resetLoadingState, getToolUseContext, toolPermissionContext, setAppState, customSystemPrompt, onTurnComplete, appendSystemPrompt, canUseTool, mainThreadAgentDefinition, onQueryEvent, sessionTitle, titleDisabled]), onQuery = import_react303.useCallback(async (newMessages, abortController2, shouldQuery, additionalAllowedTools, mainLoopModelParam, onBeforeQueryCallback, input, effort) => {
    if (isAgentSwarmsEnabled()) {
      let teamName = getTeamName(), agentName = getAgentName();
      if (teamName && agentName)
        setMemberActive(teamName, agentName, !0);
    }
    let thisGeneration = queryGuard.tryStart();
    if (thisGeneration === null) {
      logEvent("tengu_concurrent_onquery_detected", {}), newMessages.filter((m4) => m4.type === "user" && !m4.isMeta).map((_) => getContentText(_.message.content)).filter((_) => _ !== null).forEach((msg, i5) => {
        if (enqueue({
          value: msg,
          mode: "prompt"
        }), i5 === 0)
          logEvent("tengu_concurrent_onquery_enqueued", {});
      });
      return;
    }
    try {
      resetTimingRefs(), setMessages((oldMessages) => [...oldMessages, ...newMessages]), responseLengthRef.current = 0, apiMetricsRef2.current = [], setStreamingToolUses([]), setStreamingText(null);
      let latestMessages = messagesRef.current;
      if (input)
        await mrOnBeforeQuery(input, latestMessages, newMessages.length);
      if (onBeforeQueryCallback && input) {
        if (!await onBeforeQueryCallback(input, latestMessages))
          return;
      }
      await onQueryImpl(latestMessages, newMessages, abortController2, shouldQuery, additionalAllowedTools, mainLoopModelParam, effort);
    } finally {
      if (queryGuard.end(thisGeneration)) {
        setLastQueryCompletionTime(Date.now()), skipIdleCheckRef.current = !1, resetLoadingState(), await mrOnTurnComplete(messagesRef.current, abortController2.signal.aborted), sendBridgeResultRef.current();
        let budgetInfo, turnDurationMs = Date.now() - loadingStartTimeRef.current - totalPausedMsRef.current;
        if ((turnDurationMs > 30000 || budgetInfo !== void 0) && !abortController2.signal.aborted && !proactiveActive)
          if (getAllInProcessTeammateTasks(store.getState().tasks).some((t2) => t2.status === "running")) {
            if (swarmStartTimeRef.current === null)
              swarmStartTimeRef.current = loadingStartTimeRef.current;
            if (budgetInfo)
              swarmBudgetInfoRef.current = budgetInfo;
          } else
            setMessages((prev) => [...prev, createTurnDurationMessage(turnDurationMs, budgetInfo, count2(prev, isLoggableMessage))]);
        setAbortController(null);
      }
      if (abortController2.signal.reason === "user-cancel" && !queryGuard.isActive && inputValueRef.current === "" && getCommandQueueLength() === 0 && !store.getState().viewingAgentTaskId) {
        let msgs = messagesRef.current, lastUserMsg = msgs.findLast(selectableUserMessagesFilter);
        if (lastUserMsg) {
          let idx = msgs.lastIndexOf(lastUserMsg);
          if (messagesAfterAreOnlySynthetic(msgs, idx))
            removeLastFromHistory(), restoreMessageSyncRef.current(lastUserMsg);
        }
      }
    }
  }, [onQueryImpl, setAppState, resetLoadingState, queryGuard, mrOnBeforeQuery, mrOnTurnComplete]), initialMessageRef = import_react303.useRef(!1);
  import_react303.useEffect(() => {
    let pending = initialMessage;
    if (!pending || isLoading || initialMessageRef.current)
      return;
    initialMessageRef.current = !0;
    async function processInitialMessage(initialMsg) {
      if (initialMsg.clearContext) {
        let oldPlanSlug = initialMsg.message.planContent ? getPlanSlug() : void 0, {
          clearConversation: clearConversation2
        } = await Promise.resolve().then(() => (init_conversation(), exports_conversation));
        if (await clearConversation2({
          setMessages,
          readFileState: readFileState.current,
          discoveredSkillNames: discoveredSkillNamesRef.current,
          loadedNestedMemoryPaths: loadedNestedMemoryPathsRef.current,
          getAppState: () => store.getState(),
          setAppState,
          setConversationId
        }), haikuTitleAttemptedRef.current = !1, setHaikuTitle(void 0), bashTools.current.clear(), bashToolsProcessedIdx.current = 0, oldPlanSlug)
          setPlanSlug(getSessionId(), oldPlanSlug);
      }
      let shouldStorePlanForVerification = initialMsg.message.planContent && !1;
      if (setAppState((prev) => {
        let updatedToolPermissionContext = initialMsg.mode ? applyPermissionUpdates(prev.toolPermissionContext, buildPermissionUpdates(initialMsg.mode, initialMsg.allowedPrompts)) : prev.toolPermissionContext;
        return {
          ...prev,
          initialMessage: null,
          toolPermissionContext: updatedToolPermissionContext,
          ...shouldStorePlanForVerification && {
            pendingPlanVerification: {
              plan: initialMsg.message.planContent,
              verificationStarted: !1,
              verificationCompleted: !1
            }
          }
        };
      }), fileHistoryEnabled())
        fileHistoryMakeSnapshot((updater) => {
          setAppState((prev) => ({
            ...prev,
            fileHistory: updater(prev.fileHistory)
          }));
        }, initialMsg.message.uuid);
      await awaitPendingHooks();
      let content = initialMsg.message.message.content;
      if (typeof content === "string" && !initialMsg.message.planContent)
        onSubmit(content, {
          setCursorOffset: () => {},
          clearBuffer: () => {},
          resetHistory: () => {}
        });
      else {
        let newAbortController = createAbortController();
        setAbortController(newAbortController), onQuery([initialMsg.message], newAbortController, !0, [], mainLoopModel);
      }
      setTimeout((ref) => {
        ref.current = !1;
      }, 100, initialMessageRef);
    }
    processInitialMessage(pending);
  }, [initialMessage, isLoading, setMessages, setAppState, onQuery, mainLoopModel, tools]);
  let onSubmit = import_react303.useCallback(async (input, helpers3, speculationAccept, options2) => {
    if (repinScroll(), proactiveModule7?.resumeProactive(), !speculationAccept && input.trim().startsWith("/")) {
      let trimmedInput = expandPastedTextRefs(input, pastedContents).trim(), spaceIndex = trimmedInput.indexOf(" "), commandName = spaceIndex === -1 ? trimmedInput.slice(1) : trimmedInput.slice(1, spaceIndex), commandArgs = spaceIndex === -1 ? "" : trimmedInput.slice(spaceIndex + 1).trim(), matchingCommand = commands7.find((cmd) => isCommandEnabled(cmd) && (cmd.name === commandName || cmd.aliases?.includes(commandName) || getCommandName(cmd) === commandName));
      if (matchingCommand?.name === "clear" && idleHintShownRef.current)
        logEvent("tengu_idle_return_action", {
          action: "hint_converted",
          variant: idleHintShownRef.current,
          idleMinutes: Math.round((Date.now() - lastQueryCompletionTimeRef.current) / 60000),
          messageCount: messagesRef.current.length,
          totalInputTokens: getTotalInputTokens()
        }), idleHintShownRef.current = !1;
      let shouldTreatAsImmediate = queryGuard.isActive && (matchingCommand?.immediate || options2?.fromKeybinding);
      if (matchingCommand && shouldTreatAsImmediate && matchingCommand.type === "local-jsx") {
        if (input.trim() === inputValueRef.current.trim())
          setInputValue(""), helpers3.setCursorOffset(0), helpers3.clearBuffer(), setPastedContents({});
        let pastedTextRefs = parseReferences(input).filter((r4) => pastedContents[r4.id]?.type === "text"), pastedTextCount = pastedTextRefs.length, pastedTextBytes = pastedTextRefs.reduce((sum, r4) => sum + (pastedContents[r4.id]?.content.length ?? 0), 0);
        logEvent("tengu_paste_text", {
          pastedTextCount,
          pastedTextBytes
        }), logEvent("tengu_immediate_command_executed", {
          commandName: matchingCommand.name,
          fromKeybinding: options2?.fromKeybinding ?? !1
        }), (async () => {
          let doneWasCalled = !1, onDone = (result, doneOptions) => {
            doneWasCalled = !0, setToolJSX({
              jsx: null,
              shouldHidePromptInput: !1,
              clearLocalJSX: !0
            });
            let newMessages = [];
            if (result && doneOptions?.display !== "skip") {
              if (addNotification({
                key: `immediate-${matchingCommand.name}`,
                text: result,
                priority: "immediate"
              }), !isFullscreenEnvEnabled())
                newMessages.push(createCommandInputMessage(formatCommandInputTags(getCommandName(matchingCommand), commandArgs)), createCommandInputMessage(`<${LOCAL_COMMAND_STDOUT_TAG}>${escapeXml(result)}</${LOCAL_COMMAND_STDOUT_TAG}>`));
            }
            if (doneOptions?.metaMessages?.length)
              newMessages.push(...doneOptions.metaMessages.map((content) => createUserMessage({
                content,
                isMeta: !0
              })));
            if (newMessages.length)
              setMessages((prev) => [...prev, ...newMessages]);
            if (stashedPrompt !== void 0)
              setInputValue(stashedPrompt.text), helpers3.setCursorOffset(stashedPrompt.cursorOffset), setPastedContents(stashedPrompt.pastedContents), setStashedPrompt(void 0);
          }, context7 = getToolUseContext(messagesRef.current, [], createAbortController(), mainLoopModel), jsx = await (await matchingCommand.load()).call(onDone, context7, commandArgs);
          if (jsx && !doneWasCalled)
            setToolJSX({
              jsx,
              shouldHidePromptInput: !1,
              isLocalJSXCommand: !0
            });
        })();
        return;
      }
    }
    if (activeRemote.isRemoteMode && !input.trim())
      return;
    if (!options2?.fromKeybinding) {
      if (addToHistory({
        display: speculationAccept ? input : prependModeCharacterToInput(input, inputMode),
        pastedContents: speculationAccept ? {} : pastedContents
      }), inputMode === "bash")
        prependToShellHistoryCache(input.trim());
    }
    let isSlashCommand3 = !speculationAccept && input.trim().startsWith("/"), submitsNow = !isLoading || speculationAccept || activeRemote.isRemoteMode;
    if (stashedPrompt !== void 0 && !isSlashCommand3 && submitsNow)
      setInputValue(stashedPrompt.text), helpers3.setCursorOffset(stashedPrompt.cursorOffset), setPastedContents(stashedPrompt.pastedContents), setStashedPrompt(void 0);
    else if (submitsNow) {
      if (!options2?.fromKeybinding)
        setInputValue(""), helpers3.setCursorOffset(0);
      setPastedContents({});
    }
    if (submitsNow) {
      if (setInputMode("prompt"), setIDESelection(void 0), setSubmitCount((_) => _ + 1), helpers3.clearBuffer(), tipPickedThisTurnRef.current = !1, !isSlashCommand3 && inputMode === "prompt" && !speculationAccept && !activeRemote.isRemoteMode)
        setUserInputOnProcessing(input), resetTimingRefs();
    }
    if (speculationAccept) {
      let {
        queryRequired
      } = await handleSpeculationAccept(speculationAccept.state, speculationAccept.speculationSessionTimeSavedMs, speculationAccept.setAppState, input, {
        setMessages,
        readFileState,
        cwd: getOriginalCwd()
      });
      if (queryRequired) {
        let newAbortController = createAbortController();
        setAbortController(newAbortController), onQuery([], newAbortController, !0, [], mainLoopModel);
      }
      return;
    }
    if (activeRemote.isRemoteMode && !(isSlashCommand3 && commands7.find((c3) => {
      let name3 = input.trim().slice(1).split(/\s/)[0];
      return isCommandEnabled(c3) && (c3.name === name3 || c3.aliases?.includes(name3) || getCommandName(c3) === name3);
    })?.type === "local-jsx")) {
      let pastedValues = Object.values(pastedContents), imageContents = pastedValues.filter((c3) => c3.type === "image"), imagePasteIds = imageContents.length > 0 ? imageContents.map((c3) => c3.id) : void 0, messageContent = input.trim(), remoteContent = input.trim();
      if (pastedValues.length > 0) {
        let contentBlocks = [], remoteBlocks = [], trimmedInput = input.trim();
        if (trimmedInput)
          contentBlocks.push({
            type: "text",
            text: trimmedInput
          }), remoteBlocks.push({
            type: "text",
            text: trimmedInput
          });
        for (let pasted of pastedValues)
          if (pasted.type === "image") {
            let source = {
              type: "base64",
              media_type: pasted.mediaType ?? "image/png",
              data: pasted.content
            };
            contentBlocks.push({
              type: "image",
              source
            }), remoteBlocks.push({
              type: "image",
              source
            });
          } else
            contentBlocks.push({
              type: "text",
              text: pasted.content
            }), remoteBlocks.push({
              type: "text",
              text: pasted.content
            });
        messageContent = contentBlocks, remoteContent = remoteBlocks;
      }
      let userMessage = createUserMessage({
        content: messageContent,
        imagePasteIds
      });
      setMessages((prev) => [...prev, userMessage]), await activeRemote.sendMessage(remoteContent, {
        uuid: userMessage.uuid
      });
      return;
    }
    if (await awaitPendingHooks(), await handlePromptSubmit({
      input,
      helpers: helpers3,
      queryGuard,
      isExternalLoading,
      mode: inputMode,
      commands: commands7,
      onInputChange: setInputValue,
      setPastedContents,
      setToolJSX,
      getToolUseContext,
      messages: messagesRef.current,
      mainLoopModel,
      pastedContents,
      ideSelection,
      setUserInputOnProcessing,
      setAbortController,
      abortController,
      onQuery,
      setAppState,
      querySource: getQuerySourceForREPL(),
      onBeforeQuery,
      canUseTool,
      addNotification,
      setMessages,
      streamMode: streamModeRef.current,
      hasInterruptibleToolInProgress: hasInterruptibleToolInProgressRef.current
    }), (isSlashCommand3 || isLoading) && stashedPrompt !== void 0)
      setInputValue(stashedPrompt.text), helpers3.setCursorOffset(stashedPrompt.cursorOffset), setPastedContents(stashedPrompt.pastedContents), setStashedPrompt(void 0);
  }, [
    queryGuard,
    isLoading,
    isExternalLoading,
    inputMode,
    commands7,
    setInputValue,
    setInputMode,
    setPastedContents,
    setSubmitCount,
    setIDESelection,
    setToolJSX,
    getToolUseContext,
    mainLoopModel,
    pastedContents,
    ideSelection,
    setUserInputOnProcessing,
    setAbortController,
    addNotification,
    onQuery,
    stashedPrompt,
    setStashedPrompt,
    setAppState,
    onBeforeQuery,
    canUseTool,
    remoteSession,
    setMessages,
    awaitPendingHooks,
    repinScroll
  ]), onAgentSubmit = import_react303.useCallback(async (input, task, helpers3) => {
    if (isLocalAgentTask(task))
      if (appendMessageToLocalAgent(task.id, createUserMessage({
        content: input
      }), setAppState), task.status === "running")
        queuePendingMessage(task.id, input, setAppState);
      else
        resumeAgentBackground({
          agentId: task.id,
          prompt: input,
          toolUseContext: getToolUseContext(messagesRef.current, [], new AbortController, mainLoopModel),
          canUseTool
        }).catch((err2) => {
          logForDebugging(`resumeAgentBackground failed: ${errorMessage(err2)}`), addNotification({
            key: `resume-agent-failed-${task.id}`,
            jsx: /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(ThemedText, {
              color: "error",
              children: [
                "Failed to resume agent: ",
                errorMessage(err2)
              ]
            }, void 0, !0, void 0, this),
            priority: "low"
          });
        });
    else
      injectUserMessageToTeammate(task.id, input, setAppState);
    setInputValue(""), helpers3.setCursorOffset(0), helpers3.clearBuffer();
  }, [setAppState, setInputValue, getToolUseContext, canUseTool, mainLoopModel, addNotification]), handleAutoRunIssue = import_react303.useCallback(() => {
    let command19 = autoRunIssueReason ? getAutoRunCommand(autoRunIssueReason) : "/issue";
    setAutoRunIssueReason(null), onSubmit(command19, {
      setCursorOffset: () => {},
      clearBuffer: () => {},
      resetHistory: () => {}
    }).catch((err2) => {
      logForDebugging(`Auto-run ${command19} failed: ${errorMessage(err2)}`);
    });
  }, [onSubmit, autoRunIssueReason]), handleCancelAutoRunIssue = import_react303.useCallback(() => {
    setAutoRunIssueReason(null);
  }, []), onSubmitRef = import_react303.useRef(onSubmit);
  onSubmitRef.current = onSubmit;
  let handleOpenRateLimitOptions = import_react303.useCallback(() => {
    onSubmitRef.current("/rate-limit-options", {
      setCursorOffset: () => {},
      clearBuffer: () => {},
      resetHistory: () => {}
    });
  }, []), handleExit = import_react303.useCallback(async () => {
    if (setIsExiting(!0), getCurrentWorktreeSession() !== null) {
      setExitFlow(/* @__PURE__ */ jsx_dev_runtime458.jsxDEV(ExitFlow, {
        showWorktree: !0,
        onDone: () => {},
        onCancel: () => {
          setExitFlow(null), setIsExiting(!1);
        }
      }, void 0, !1, void 0, this));
      return;
    }
    let exitFlowResult = await (await exit_default.load()).call(() => {});
    if (setExitFlow(exitFlowResult), exitFlowResult === null)
      setIsExiting(!1);
  }, []), handleShowMessageSelector = import_react303.useCallback(() => {
    setIsMessageSelectorVisible((prev) => !prev);
  }, []), rewindConversationTo = import_react303.useCallback((message) => {
    let prev = messagesRef.current, messageIndex = prev.lastIndexOf(message);
    if (messageIndex === -1)
      return;
    logEvent("tengu_conversation_rewind", {
      preRewindMessageCount: prev.length,
      postRewindMessageCount: messageIndex,
      messagesRemoved: prev.length - messageIndex,
      rewindToMessageIndex: messageIndex
    }), setMessages(prev.slice(0, messageIndex)), setConversationId(randomUUID42()), resetMicrocompactState(), setAppState((prev2) => ({
      ...prev2,
      toolPermissionContext: message.permissionMode && prev2.toolPermissionContext.mode !== message.permissionMode ? {
        ...prev2.toolPermissionContext,
        mode: message.permissionMode
      } : prev2.toolPermissionContext,
      promptSuggestion: {
        text: null,
        promptId: null,
        shownAt: 0,
        acceptedAt: 0,
        generationRequestId: null
      }
    }));
  }, [setMessages, setAppState]), restoreMessageSync = import_react303.useCallback((message) => {
    rewindConversationTo(message);
    let r4 = textForResubmit(message);
    if (r4)
      setInputValue(r4.text), setInputMode(r4.mode);
    if (Array.isArray(message.message.content) && message.message.content.some((block2) => block2.type === "image")) {
      let imageBlocks = message.message.content.filter((block2) => block2.type === "image");
      if (imageBlocks.length > 0) {
        let newPastedContents = {};
        imageBlocks.forEach((block2, index2) => {
          if (block2.source.type === "base64") {
            let id = message.imagePasteIds?.[index2] ?? index2 + 1;
            newPastedContents[id] = {
              id,
              type: "image",
              content: block2.source.data,
              mediaType: block2.source.media_type
            };
          }
        }), setPastedContents(newPastedContents);
      }
    }
  }, [rewindConversationTo, setInputValue]);
  restoreMessageSyncRef.current = restoreMessageSync;
  let handleRestoreMessage = import_react303.useCallback(async (message) => {
    setImmediate((restore, message2) => restore(message2), restoreMessageSync, message);
  }, [restoreMessageSync]), findRawIndex = (uuid8) => {
    let prefix = uuid8.slice(0, 24);
    return messages.findIndex((m4) => m4.uuid.slice(0, 24) === prefix);
  }, messageActionCaps = {
    copy: (text2) => void setClipboard(text2).then((raw) => {
      if (raw)
        process.stdout.write(raw);
      addNotification({
        key: "selection-copied",
        text: "copied",
        color: "success",
        priority: "immediate",
        timeoutMs: 2000
      });
    }),
    edit: async (msg) => {
      let rawIdx = findRawIndex(msg.uuid), raw = rawIdx >= 0 ? messages[rawIdx] : void 0;
      if (!raw || !selectableUserMessagesFilter(raw))
        return;
      let noFileChanges = !await fileHistoryHasAnyChanges(fileHistory, raw.uuid), onlySynthetic = messagesAfterAreOnlySynthetic(messages, rawIdx);
      if (noFileChanges && onlySynthetic)
        onCancel(), handleRestoreMessage(raw);
      else
        setMessageSelectorPreselect(raw), setIsMessageSelectorVisible(!0);
    }
  }, {
    enter: enterMessageActions,
    handlers: messageActionHandlers
  } = useMessageActions(cursor, setCursor, cursorNavRef, messageActionCaps);
  async function onInit() {
    reverify();
    let memoryFiles = await getMemoryFiles();
    if (memoryFiles.length > 0) {
      let fileList = memoryFiles.map((f) => `  [${f.type}] ${f.path} (${f.content.length} chars)${f.parent ? ` (included by ${f.parent})` : ""}`).join(`
`);
      logForDebugging(`Loaded ${memoryFiles.length} CLAUDE.md/rules files:
${fileList}`);
    } else
      logForDebugging("No CLAUDE.md/rules files found");
    for (let file2 of memoryFiles)
      readFileState.current.set(file2.path, {
        content: file2.contentDiffersFromDisk ? file2.rawContent ?? file2.content : file2.content,
        timestamp: Date.now(),
        offset: void 0,
        limit: void 0,
        isPartialView: file2.contentDiffersFromDisk
      });
  }
  useCostSummary(useFpsMetrics()), useLogMessages(messages, messages.length === initialMessages?.length);
  let {
    sendBridgeResult
  } = useReplBridge(messages, setMessages, abortControllerRef, commands7, mainLoopModel);
  sendBridgeResultRef.current = sendBridgeResult, useAfterFirstRender();
  let hasCountedQueueUseRef = import_react303.useRef(!1);
  import_react303.useEffect(() => {
    if (queuedCommands.length < 1) {
      hasCountedQueueUseRef.current = !1;
      return;
    }
    if (hasCountedQueueUseRef.current)
      return;
    hasCountedQueueUseRef.current = !0, saveGlobalConfig((current) => ({
      ...current,
      promptQueueUseCount: (current.promptQueueUseCount ?? 0) + 1
    }));
  }, [queuedCommands.length]);
  let executeQueuedInput = import_react303.useCallback(async (queuedCommands2) => {
    await handlePromptSubmit({
      helpers: {
        setCursorOffset: () => {},
        clearBuffer: () => {},
        resetHistory: () => {}
      },
      queryGuard,
      commands: commands7,
      onInputChange: () => {},
      setPastedContents: () => {},
      setToolJSX,
      getToolUseContext,
      messages,
      mainLoopModel,
      ideSelection,
      setUserInputOnProcessing,
      setAbortController,
      onQuery,
      setAppState,
      querySource: getQuerySourceForREPL(),
      onBeforeQuery,
      canUseTool,
      addNotification,
      setMessages,
      queuedCommands: queuedCommands2
    });
  }, [queryGuard, commands7, setToolJSX, getToolUseContext, messages, mainLoopModel, ideSelection, setUserInputOnProcessing, canUseTool, setAbortController, onQuery, addNotification, setAppState, onBeforeQuery]);
  useQueueProcessor({
    executeQueuedInput,
    hasActiveLocalJsxUI: isShowingLocalJSXCommand,
    queryGuard
  }), import_react303.useEffect(() => {
    activityManager.recordUserActivity(), updateLastInteractionTime(!0);
  }, [inputValue, submitCount]), import_react303.useEffect(() => {
    if (submitCount === 1)
      startBackgroundHousekeeping();
  }, [submitCount]), import_react303.useEffect(() => {
    if (isLoading)
      return;
    if (submitCount === 0)
      return;
    if (lastQueryCompletionTime === 0)
      return;
    let timer = setTimeout((lastQueryCompletionTime2, isLoading2, toolJSX2, focusedInputDialogRef2, terminal2) => {
      if (getLastInteractionTime() > lastQueryCompletionTime2)
        return;
      let idleTimeSinceResponse = Date.now() - lastQueryCompletionTime2;
      if (!isLoading2 && !toolJSX2 && focusedInputDialogRef2.current === void 0 && idleTimeSinceResponse >= getGlobalConfig().messageIdleNotifThresholdMs)
        sendNotification({
          message: "Claude is waiting for your input",
          notificationType: "idle_prompt"
        }, terminal2);
    }, getGlobalConfig().messageIdleNotifThresholdMs, lastQueryCompletionTime, isLoading, toolJSX, focusedInputDialogRef, terminal);
    return () => clearTimeout(timer);
  }, [isLoading, toolJSX, submitCount, lastQueryCompletionTime, terminal]);
  let handleIncomingPrompt = import_react303.useCallback((content, options2) => {
    if (queryGuard.isActive)
      return !1;
    if (getCommandQueue().some((cmd) => cmd.mode === "prompt" || cmd.mode === "bash"))
      return !1;
    let newAbortController = createAbortController();
    setAbortController(newAbortController);
    let userMessage = createUserMessage({
      content,
      isMeta: options2?.isMeta ? !0 : void 0
    });
    return onQuery([userMessage], newAbortController, !0, [], mainLoopModel), !0;
  }, [onQuery, mainLoopModel, store]), voice2 = useVoiceIntegration2({
    setInputValueRaw,
    inputValueRef,
    insertTextRef
  });
  useInboxPoller({
    enabled: isAgentSwarmsEnabled(),
    isLoading,
    focusedInputDialog,
    onSubmitMessage: handleIncomingPrompt
  }), useMailboxBridge({
    isLoading,
    onSubmitMessage: handleIncomingPrompt
  }), import_react303.useEffect(() => {
    if (queuedCommands.some((cmd) => cmd.priority === "now"))
      abortControllerRef.current?.abort("interrupt");
  }, [queuedCommands]), import_react303.useEffect(() => {
    return onInit(), () => {
      diagnosticTracker.shutdown();
    };
  }, []);
  let {
    internal_eventEmitter
  } = use_stdin_default(), [remountKey, setRemountKey] = import_react303.useState(0);
  import_react303.useEffect(() => {
    let handleSuspend = () => {
      process.stdout.write(`
Claude Code has been suspended. Run \`fg\` to bring Claude Code back.
Note: ctrl + z now suspends Claude Code, ctrl + _ undoes input.
`);
    }, handleResume = () => {
      setRemountKey((prev) => prev + 1);
    };
    return internal_eventEmitter?.on("suspend", handleSuspend), internal_eventEmitter?.on("resume", handleResume), () => {
      internal_eventEmitter?.off("suspend", handleSuspend), internal_eventEmitter?.off("resume", handleResume);
    };
  }, [internal_eventEmitter]);
  let stopHookSpinnerSuffix = import_react303.useMemo(() => {
    if (!isLoading)
      return null;
    let progressMsgs = messages.filter((m4) => m4.type === "progress" && m4.data.type === "hook_progress" && (m4.data.hookEvent === "Stop" || m4.data.hookEvent === "SubagentStop"));
    if (progressMsgs.length === 0)
      return null;
    let currentToolUseID = progressMsgs.at(-1)?.toolUseID;
    if (!currentToolUseID)
      return null;
    if (messages.some((m4) => m4.type === "system" && m4.subtype === "stop_hook_summary" && m4.toolUseID === currentToolUseID))
      return null;
    let currentHooks = progressMsgs.filter((p4) => p4.toolUseID === currentToolUseID), total = currentHooks.length, completedCount = count2(messages, (m4) => {
      if (m4.type !== "attachment")
        return !1;
      let attachment = m4.attachment;
      return "hookEvent" in attachment && (attachment.hookEvent === "Stop" || attachment.hookEvent === "SubagentStop") && "toolUseID" in attachment && attachment.toolUseID === currentToolUseID;
    }), customMessage = currentHooks.find((p4) => p4.data.statusMessage)?.data.statusMessage;
    if (customMessage)
      return total === 1 ? `${customMessage}\u2026` : `${customMessage}\u2026 ${completedCount}/${total}`;
    let hookType = currentHooks[0]?.data.hookEvent === "SubagentStop" ? "subagent stop" : "stop";
    return total === 1 ? `running ${hookType} hook` : `running stop hooks\u2026 ${completedCount}/${total}`;
  }, [messages, isLoading]), handleEnterTranscript = import_react303.useCallback(() => {
    setFrozenTranscriptState({
      messagesLength: messages.length,
      streamingToolUsesLength: streamingToolUses.length
    });
  }, [messages.length, streamingToolUses.length]), handleExitTranscript = import_react303.useCallback(() => {
    setFrozenTranscriptState(null);
  }, []), virtualScrollActive = isFullscreenEnvEnabled() && !disableVirtualScroll, jumpRef = import_react303.useRef(null), [searchOpen, setSearchOpen] = import_react303.useState(!1), [searchQuery, setSearchQuery] = import_react303.useState(""), [searchCount, setSearchCount] = import_react303.useState(0), [searchCurrent, setSearchCurrent] = import_react303.useState(0), onSearchMatchesChange = import_react303.useCallback((count4, current) => {
    setSearchCount(count4), setSearchCurrent(current);
  }, []);
  use_input_default((input, key3, event) => {
    if (key3.ctrl || key3.meta)
      return;
    if (input === "/") {
      jumpRef.current?.setAnchor(), setSearchOpen(!0), event.stopImmediatePropagation();
      return;
    }
    let c3 = input[0];
    if ((c3 === "n" || c3 === "N") && input === c3.repeat(input.length) && searchCount > 0) {
      let fn = c3 === "n" ? jumpRef.current?.nextMatch : jumpRef.current?.prevMatch;
      if (fn)
        for (let i5 = 0;i5 < input.length; i5++)
          fn();
      event.stopImmediatePropagation();
    }
  }, {
    isActive: screen === "transcript" && virtualScrollActive && !searchOpen && !dumpMode
  });
  let {
    setQuery: setHighlight,
    scanElement,
    setPositions
  } = useSearchHighlight(), transcriptCols = useTerminalSize().columns, prevColsRef = React152.useRef(transcriptCols);
  React152.useEffect(() => {
    if (prevColsRef.current !== transcriptCols) {
      if (prevColsRef.current = transcriptCols, searchQuery || searchOpen)
        setSearchOpen(!1), setSearchQuery(""), setSearchCount(0), setSearchCurrent(0), jumpRef.current?.disarmSearch(), setHighlight("");
    }
  }, [transcriptCols, searchQuery, searchOpen, setHighlight]), use_input_default((input, key3, event) => {
    if (key3.ctrl || key3.meta)
      return;
    if (input === "q") {
      handleExitTranscript(), event.stopImmediatePropagation();
      return;
    }
    if (input === "[" && !dumpMode)
      setDumpMode(!0), setShowAllInTranscript(!0), event.stopImmediatePropagation();
    else if (input === "v") {
      if (event.stopImmediatePropagation(), editorRenderingRef.current)
        return;
      editorRenderingRef.current = !0;
      let gen = editorGenRef.current, setStatus = (s2) => {
        if (gen !== editorGenRef.current)
          return;
        clearTimeout(editorTimerRef.current), setEditorStatus(s2);
      };
      setStatus(`rendering ${deferredMessages.length} messages\u2026`), (async () => {
        try {
          let w2 = Math.max(80, (process.stdout.columns ?? 80) - 6), text2 = (await renderMessagesToPlainText(deferredMessages, tools, w2)).replace(/[ \t]+$/gm, ""), path27 = join147(tmpdir12(), `cc-transcript-${Date.now()}.txt`);
          await writeFile46(path27, text2);
          let opened = openFileInExternalEditor(path27);
          setStatus(opened ? `opening ${path27}` : `wrote ${path27} \xB7 no $VISUAL/$EDITOR set`);
        } catch (e) {
          setStatus(`render failed: ${e instanceof Error ? e.message : String(e)}`);
        }
        if (editorRenderingRef.current = !1, gen !== editorGenRef.current)
          return;
        editorTimerRef.current = setTimeout((s2) => s2(""), 4000, setEditorStatus);
      })();
    }
  }, {
    isActive: screen === "transcript" && virtualScrollActive && !searchOpen
  });
  let inTranscript = screen === "transcript" && virtualScrollActive;
  import_react303.useEffect(() => {
    if (!inTranscript)
      setSearchQuery(""), setSearchCount(0), setSearchCurrent(0), setSearchOpen(!1), editorGenRef.current++, clearTimeout(editorTimerRef.current), setDumpMode(!1), setEditorStatus("");
  }, [inTranscript]), import_react303.useEffect(() => {
    if (setHighlight(inTranscript ? searchQuery : ""), !inTranscript)
      setPositions(null);
  }, [inTranscript, searchQuery, setHighlight, setPositions]);
  let globalKeybindingProps = {
    screen,
    setScreen,
    showAllInTranscript,
    setShowAllInTranscript,
    messageCount: messages.length,
    onEnterTranscript: handleEnterTranscript,
    onExitTranscript: handleExitTranscript,
    virtualScrollActive,
    searchBarOpen: searchOpen
  }, transcriptMessages = frozenTranscriptState ? deferredMessages.slice(0, frozenTranscriptState.messagesLength) : deferredMessages, transcriptStreamingToolUses = frozenTranscriptState ? streamingToolUses.slice(0, frozenTranscriptState.streamingToolUsesLength) : streamingToolUses;
  if (useBackgroundTaskNavigation({
    onOpenBackgroundTasks: isShowingLocalJSXCommand ? void 0 : () => setShowBashesDialog(!0)
  }), useTeammateViewAutoExit(), screen === "transcript") {
    let transcriptScrollRef = isFullscreenEnvEnabled() && !disableVirtualScroll && !dumpMode ? scrollRef : void 0, transcriptMessagesElement = /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(Messages4, {
      messages: transcriptMessages,
      tools,
      commands: commands7,
      verbose: !0,
      toolJSX: null,
      toolUseConfirmQueue: [],
      inProgressToolUseIDs,
      isMessageSelectorVisible: !1,
      conversationId,
      screen,
      agentDefinitions,
      streamingToolUses: transcriptStreamingToolUses,
      showAllInTranscript,
      onOpenRateLimitOptions: handleOpenRateLimitOptions,
      isLoading,
      hidePastThinking: !0,
      streamingThinking,
      scrollRef: transcriptScrollRef,
      jumpRef,
      onSearchMatchesChange,
      scanElement,
      setPositions,
      disableRenderCap: dumpMode
    }, void 0, !1, void 0, this), transcriptToolJSX = toolJSX && /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      width: "100%",
      children: toolJSX.jsx
    }, void 0, !1, void 0, this), transcriptReturn = /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(KeybindingSetup, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(AnimatedTerminalTitle, {
          isAnimating: titleIsAnimating,
          title: terminalTitle,
          disabled: titleDisabled,
          noPrefix: showStatusInTerminalTab
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(GlobalKeybindingHandlers, {
          ...globalKeybindingProps
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(VoiceKeybindingHandler2, {
          voiceHandleKeyEvent: voice2.handleKeyEvent,
          stripTrailing: voice2.stripTrailing,
          resetAnchor: voice2.resetAnchor,
          isActive: !toolJSX?.isLocalJSXCommand
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(CommandKeybindingHandlers, {
          onSubmit,
          isActive: !toolJSX?.isLocalJSXCommand
        }, void 0, !1, void 0, this),
        transcriptScrollRef ? /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(ScrollKeybindingHandler, {
          scrollRef,
          isActive: focusedInputDialog !== "ultraplan-choice",
          isModal: !searchOpen,
          onScroll: () => jumpRef.current?.disarmSearch()
        }, void 0, !1, void 0, this) : null,
        /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(CancelRequestHandler, {
          ...cancelRequestProps
        }, void 0, !1, void 0, this),
        transcriptScrollRef ? /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(FullscreenLayout, {
          scrollRef,
          scrollable: /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(jsx_dev_runtime458.Fragment, {
            children: [
              transcriptMessagesElement,
              transcriptToolJSX,
              /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(SandboxViolationExpandedView, {}, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this),
          bottom: searchOpen ? /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(TranscriptSearchBar, {
            jumpRef,
            initialQuery: "",
            count: searchCount,
            current: searchCurrent,
            onClose: (q4) => {
              if (setSearchQuery(searchCount > 0 ? q4 : ""), setSearchOpen(!1), !q4)
                setSearchCount(0), setSearchCurrent(0), jumpRef.current?.setSearchQuery("");
            },
            onCancel: () => {
              setSearchOpen(!1), jumpRef.current?.setSearchQuery(""), jumpRef.current?.setSearchQuery(searchQuery), setHighlight(searchQuery);
            },
            setHighlight
          }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(TranscriptModeFooter, {
            showAllInTranscript,
            virtualScroll: !0,
            status: editorStatus || void 0,
            searchBadge: searchQuery && searchCount > 0 ? {
              current: searchCurrent,
              count: searchCount
            } : void 0
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(jsx_dev_runtime458.Fragment, {
          children: [
            transcriptMessagesElement,
            transcriptToolJSX,
            /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(SandboxViolationExpandedView, {}, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(TranscriptModeFooter, {
              showAllInTranscript,
              virtualScroll: !1,
              suppressShowAll: dumpMode,
              status: editorStatus || void 0
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this);
    if (transcriptScrollRef)
      return /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(AlternateScreen, {
        mouseTracking: isMouseTrackingEnabled(),
        children: transcriptReturn
      }, void 0, !1, void 0, this);
    return transcriptReturn;
  }
  let viewedTask = viewingAgentTaskId ? tasks2[viewingAgentTaskId] : void 0, viewedTeammateTask = viewedTask && isInProcessTeammateTask(viewedTask) ? viewedTask : void 0, viewedAgentTask = viewedTeammateTask ?? (viewedTask && isLocalAgentTask(viewedTask) ? viewedTask : void 0), displayedMessages = viewedAgentTask ? viewedAgentTask.messages ?? [] : showStreamingText || !isLoading ? messages : deferredMessages, placeholderText = userInputOnProcessing && !viewedAgentTask && displayedMessages.length <= userInputBaselineRef.current ? userInputOnProcessing : void 0, toolPermissionOverlay = focusedInputDialog === "tool-permission" ? /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(PermissionRequest, {
    onDone: () => setToolUseConfirmQueue(([_, ...tail]) => tail),
    onReject: handleQueuedCommandOnCancel,
    toolUseConfirm: toolUseConfirmQueue[0],
    toolUseContext: getToolUseContext(messages, messages, abortController ?? createAbortController(), mainLoopModel),
    verbose,
    workerBadge: toolUseConfirmQueue[0]?.workerBadge,
    setStickyFooter: isFullscreenEnvEnabled() ? setPermissionStickyFooter : void 0
  }, toolUseConfirmQueue[0]?.toolUseID, !1, void 0, this) : null, companionNarrow = transcriptCols < MIN_COLS_FOR_FULL_SPRITE, companionVisible = !toolJSX?.shouldHidePromptInput && !focusedInputDialog && !showBashesDialog, toolJsxCentered = isFullscreenEnvEnabled() && toolJSX?.isLocalJSXCommand === !0, centeredModal = toolJsxCentered ? toolJSX.jsx : null, mainReturn = /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(KeybindingSetup, {
    children: [
      /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(AnimatedTerminalTitle, {
        isAnimating: titleIsAnimating,
        title: terminalTitle,
        disabled: titleDisabled,
        noPrefix: showStatusInTerminalTab
      }, void 0, !1, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(GlobalKeybindingHandlers, {
        ...globalKeybindingProps
      }, void 0, !1, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(VoiceKeybindingHandler2, {
        voiceHandleKeyEvent: voice2.handleKeyEvent,
        stripTrailing: voice2.stripTrailing,
        resetAnchor: voice2.resetAnchor,
        isActive: !toolJSX?.isLocalJSXCommand
      }, void 0, !1, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(CommandKeybindingHandlers, {
        onSubmit,
        isActive: !toolJSX?.isLocalJSXCommand
      }, void 0, !1, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(ScrollKeybindingHandler, {
        scrollRef,
        isActive: isFullscreenEnvEnabled() && (centeredModal != null || !focusedInputDialog || focusedInputDialog === "tool-permission"),
        onScroll: centeredModal || toolPermissionOverlay || viewedAgentTask ? void 0 : composedOnScroll
      }, void 0, !1, void 0, this),
      null,
      /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(CancelRequestHandler, {
        ...cancelRequestProps
      }, void 0, !1, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(MCPConnectionManager, {
        dynamicMcpConfig,
        isStrictMcpConfig: strictMcpConfig,
        children: /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(FullscreenLayout, {
          scrollRef,
          overlay: toolPermissionOverlay,
          bottomFloat: companionVisible && !companionNarrow ? /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(CompanionFloatingBubble, {}, void 0, !1, void 0, this) : void 0,
          modal: centeredModal,
          modalScrollRef,
          dividerYRef,
          hidePill: !!viewedAgentTask,
          hideSticky: !!viewedTeammateTask,
          newMessageCount: unseenDivider?.count ?? 0,
          onPillClick: () => {
            setCursor(null), jumpToNew(scrollRef.current);
          },
          scrollable: /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(jsx_dev_runtime458.Fragment, {
            children: [
              /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(TeammateViewHeader, {}, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(Messages4, {
                messages: displayedMessages,
                tools,
                commands: commands7,
                verbose,
                toolJSX,
                toolUseConfirmQueue,
                inProgressToolUseIDs: viewedTeammateTask ? viewedTeammateTask.inProgressToolUseIDs ?? /* @__PURE__ */ new Set : inProgressToolUseIDs,
                isMessageSelectorVisible,
                conversationId,
                screen,
                streamingToolUses,
                showAllInTranscript,
                agentDefinitions,
                onOpenRateLimitOptions: handleOpenRateLimitOptions,
                isLoading,
                streamingText: isLoading && !viewedAgentTask ? visibleStreamingText : null,
                isBriefOnly: viewedAgentTask ? !1 : isBriefOnly,
                unseenDivider: viewedAgentTask ? void 0 : unseenDivider,
                scrollRef: isFullscreenEnvEnabled() ? scrollRef : void 0,
                trackStickyPrompt: isFullscreenEnvEnabled() ? !0 : void 0,
                cursor,
                setCursor,
                cursorNavRef
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(AwsAuthStatusBox, {}, void 0, !1, void 0, this),
              !disabled && placeholderText && !centeredModal && /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(UserTextMessage, {
                param: {
                  text: placeholderText,
                  type: "text"
                },
                addMargin: !0,
                verbose
              }, void 0, !1, void 0, this),
              toolJSX && !(toolJSX.isLocalJSXCommand && toolJSX.isImmediate) && !toolJsxCentered && /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(ThemedBox_default, {
                flexDirection: "column",
                width: "100%",
                children: toolJSX.jsx
              }, void 0, !1, void 0, this),
              !1,
              null,
              /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(ThemedBox_default, {
                flexGrow: 1
              }, void 0, !1, void 0, this),
              showSpinner && /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(SpinnerWithVerb, {
                mode: streamMode,
                spinnerTip,
                responseLengthRef,
                apiMetricsRef: apiMetricsRef2,
                overrideMessage: spinnerMessage,
                spinnerSuffix: stopHookSpinnerSuffix,
                verbose,
                loadingStartTimeRef,
                totalPausedMsRef,
                pauseStartTimeRef,
                overrideColor: spinnerColor,
                overrideShimmerColor: spinnerShimmerColor,
                hasActiveTools: inProgressToolUseIDs.size > 0,
                leaderIsIdle: !isLoading
              }, void 0, !1, void 0, this),
              !showSpinner && !isLoading && !userInputOnProcessing && !hasRunningTeammates && isBriefOnly && !viewedAgentTask && /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(BriefIdleStatus, {}, void 0, !1, void 0, this),
              isFullscreenEnvEnabled() && /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(PromptInputQueuedCommands, {}, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this),
          bottom: /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(ThemedBox_default, {
            flexDirection: companionNarrow ? "column" : "row",
            width: "100%",
            alignItems: companionNarrow ? void 0 : "flex-end",
            children: [
              companionNarrow && isFullscreenEnvEnabled() && companionVisible ? /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(CompanionSprite, {}, void 0, !1, void 0, this) : null,
              /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(ThemedBox_default, {
                flexDirection: "column",
                flexGrow: 1,
                children: [
                  permissionStickyFooter,
                  toolJSX?.isLocalJSXCommand && toolJSX.isImmediate && !toolJsxCentered && /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(ThemedBox_default, {
                    flexDirection: "column",
                    width: "100%",
                    children: toolJSX.jsx
                  }, void 0, !1, void 0, this),
                  !showSpinner && !toolJSX?.isLocalJSXCommand && showExpandedTodos && tasksV2 && tasksV2.length > 0 && /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(ThemedBox_default, {
                    width: "100%",
                    flexDirection: "column",
                    children: /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(TaskListV2, {
                      tasks: tasksV2,
                      isStandalone: !0
                    }, void 0, !1, void 0, this)
                  }, void 0, !1, void 0, this),
                  focusedInputDialog === "sandbox-permission" && /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(SandboxPermissionRequest, {
                    hostPattern: sandboxPermissionRequestQueue[0].hostPattern,
                    onUserResponse: (response7) => {
                      let {
                        allow,
                        persistToSettings
                      } = response7, currentRequest = sandboxPermissionRequestQueue[0];
                      if (!currentRequest)
                        return;
                      let approvedHost = currentRequest.hostPattern.host;
                      if (persistToSettings) {
                        let update2 = {
                          type: "addRules",
                          rules: [{
                            toolName: WEB_FETCH_TOOL_NAME,
                            ruleContent: `domain:${approvedHost}`
                          }],
                          behavior: allow ? "allow" : "deny",
                          destination: "localSettings"
                        };
                        setAppState((prev) => ({
                          ...prev,
                          toolPermissionContext: applyPermissionUpdate(prev.toolPermissionContext, update2)
                        })), persistPermissionUpdate(update2), SandboxManager2.refreshConfig();
                      }
                      setSandboxPermissionRequestQueue((queue2) => {
                        return queue2.filter((item) => item.hostPattern.host === approvedHost).forEach((item) => item.resolvePromise(allow)), queue2.filter((item) => item.hostPattern.host !== approvedHost);
                      });
                      let cleanups = sandboxBridgeCleanupRef.current.get(approvedHost);
                      if (cleanups) {
                        for (let fn of cleanups)
                          fn();
                        sandboxBridgeCleanupRef.current.delete(approvedHost);
                      }
                    }
                  }, sandboxPermissionRequestQueue[0].hostPattern.host, !1, void 0, this),
                  focusedInputDialog === "prompt" && /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(PromptDialog, {
                    title: promptQueue[0].title,
                    toolInputSummary: promptQueue[0].toolInputSummary,
                    request: promptQueue[0].request,
                    onRespond: (selectedKey) => {
                      let item = promptQueue[0];
                      if (!item)
                        return;
                      item.resolve({
                        prompt_response: item.request.prompt,
                        selected: selectedKey
                      }), setPromptQueue(([, ...tail]) => tail);
                    },
                    onAbort: () => {
                      let item = promptQueue[0];
                      if (!item)
                        return;
                      item.reject(Error("Prompt cancelled by user")), setPromptQueue(([, ...tail]) => tail);
                    }
                  }, promptQueue[0].request.prompt, !1, void 0, this),
                  pendingWorkerRequest && /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(WorkerPendingPermission, {
                    toolName: pendingWorkerRequest.toolName,
                    description: pendingWorkerRequest.description
                  }, void 0, !1, void 0, this),
                  pendingSandboxRequest && /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(WorkerPendingPermission, {
                    toolName: "Network Access",
                    description: `Waiting for leader to approve network access to ${pendingSandboxRequest.host}`
                  }, void 0, !1, void 0, this),
                  focusedInputDialog === "worker-sandbox-permission" && /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(SandboxPermissionRequest, {
                    hostPattern: {
                      host: workerSandboxPermissions.queue[0].host,
                      port: void 0
                    },
                    onUserResponse: (response7) => {
                      let {
                        allow,
                        persistToSettings
                      } = response7, currentRequest = workerSandboxPermissions.queue[0];
                      if (!currentRequest)
                        return;
                      let approvedHost = currentRequest.host;
                      if (sendSandboxPermissionResponseViaMailbox(currentRequest.workerName, currentRequest.requestId, approvedHost, allow, teamContext?.teamName), persistToSettings && allow) {
                        let update2 = {
                          type: "addRules",
                          rules: [{
                            toolName: WEB_FETCH_TOOL_NAME,
                            ruleContent: `domain:${approvedHost}`
                          }],
                          behavior: "allow",
                          destination: "localSettings"
                        };
                        setAppState((prev) => ({
                          ...prev,
                          toolPermissionContext: applyPermissionUpdate(prev.toolPermissionContext, update2)
                        })), persistPermissionUpdate(update2), SandboxManager2.refreshConfig();
                      }
                      setAppState((prev) => ({
                        ...prev,
                        workerSandboxPermissions: {
                          ...prev.workerSandboxPermissions,
                          queue: prev.workerSandboxPermissions.queue.slice(1)
                        }
                      }));
                    }
                  }, workerSandboxPermissions.queue[0].requestId, !1, void 0, this),
                  focusedInputDialog === "elicitation" && /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(ElicitationDialog, {
                    event: elicitation.queue[0],
                    onResponse: (action2, content) => {
                      let currentRequest = elicitation.queue[0];
                      if (!currentRequest)
                        return;
                      if (currentRequest.respond({
                        action: action2,
                        content
                      }), !(currentRequest.params.mode === "url" && action2 === "accept"))
                        setAppState((prev) => ({
                          ...prev,
                          elicitation: {
                            queue: prev.elicitation.queue.slice(1)
                          }
                        }));
                    },
                    onWaitingDismiss: (action2) => {
                      let currentRequest = elicitation.queue[0];
                      setAppState((prev) => ({
                        ...prev,
                        elicitation: {
                          queue: prev.elicitation.queue.slice(1)
                        }
                      })), currentRequest?.onWaitingDismiss?.(action2);
                    }
                  }, elicitation.queue[0].serverName + ":" + String(elicitation.queue[0].requestId), !1, void 0, this),
                  focusedInputDialog === "cost" && /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(CostThresholdDialog, {
                    onDone: () => {
                      setShowCostDialog(!1), setHaveShownCostDialog(!0), saveGlobalConfig((current) => ({
                        ...current,
                        hasAcknowledgedCostThreshold: !0
                      })), logEvent("tengu_cost_threshold_acknowledged", {});
                    }
                  }, void 0, !1, void 0, this),
                  focusedInputDialog === "idle-return" && idleReturnPending && /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(IdleReturnDialog, {
                    idleMinutes: idleReturnPending.idleMinutes,
                    totalInputTokens: getTotalInputTokens(),
                    onDone: async (action2) => {
                      let pending = idleReturnPending;
                      if (setIdleReturnPending(null), logEvent("tengu_idle_return_action", {
                        action: action2,
                        idleMinutes: Math.round(pending.idleMinutes),
                        messageCount: messagesRef.current.length,
                        totalInputTokens: getTotalInputTokens()
                      }), action2 === "dismiss") {
                        setInputValue(pending.input);
                        return;
                      }
                      if (action2 === "never")
                        saveGlobalConfig((current) => {
                          if (current.idleReturnDismissed)
                            return current;
                          return {
                            ...current,
                            idleReturnDismissed: !0
                          };
                        });
                      if (action2 === "clear") {
                        let {
                          clearConversation: clearConversation2
                        } = await Promise.resolve().then(() => (init_conversation(), exports_conversation));
                        await clearConversation2({
                          setMessages,
                          readFileState: readFileState.current,
                          discoveredSkillNames: discoveredSkillNamesRef.current,
                          loadedNestedMemoryPaths: loadedNestedMemoryPathsRef.current,
                          getAppState: () => store.getState(),
                          setAppState,
                          setConversationId
                        }), haikuTitleAttemptedRef.current = !1, setHaikuTitle(void 0), bashTools.current.clear(), bashToolsProcessedIdx.current = 0;
                      }
                      skipIdleCheckRef.current = !0, onSubmitRef.current(pending.input, {
                        setCursorOffset: () => {},
                        clearBuffer: () => {},
                        resetHistory: () => {}
                      });
                    }
                  }, void 0, !1, void 0, this),
                  focusedInputDialog === "ide-onboarding" && /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(IdeOnboardingDialog, {
                    onDone: () => setShowIdeOnboarding(!1),
                    installationStatus: ideInstallationStatus
                  }, void 0, !1, void 0, this),
                  !1,
                  !1,
                  focusedInputDialog === "effort-callout" && /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(EffortCallout, {
                    model: mainLoopModel,
                    onDone: (selection) => {
                      if (setShowEffortCallout(!1), selection !== "dismiss")
                        setAppState((prev) => ({
                          ...prev,
                          effortValue: selection
                        }));
                    }
                  }, void 0, !1, void 0, this),
                  focusedInputDialog === "remote-callout" && /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(RemoteCallout, {
                    onDone: (selection) => {
                      setAppState((prev) => {
                        if (!prev.showRemoteCallout)
                          return prev;
                        return {
                          ...prev,
                          showRemoteCallout: !1,
                          ...selection === "enable" && {
                            replBridgeEnabled: !0,
                            replBridgeExplicit: !0,
                            replBridgeOutboundOnly: !1
                          }
                        };
                      });
                    }
                  }, void 0, !1, void 0, this),
                  exitFlow,
                  focusedInputDialog === "plugin-hint" && hintRecommendation && /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(PluginHintMenu, {
                    pluginName: hintRecommendation.pluginName,
                    pluginDescription: hintRecommendation.pluginDescription,
                    marketplaceName: hintRecommendation.marketplaceName,
                    sourceCommand: hintRecommendation.sourceCommand,
                    onResponse: handleHintResponse
                  }, void 0, !1, void 0, this),
                  focusedInputDialog === "lsp-recommendation" && lspRecommendation && /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(LspRecommendationMenu, {
                    pluginName: lspRecommendation.pluginName,
                    pluginDescription: lspRecommendation.pluginDescription,
                    fileExtension: lspRecommendation.fileExtension,
                    onResponse: handleLspResponse
                  }, void 0, !1, void 0, this),
                  null,
                  null,
                  mrRender(),
                  !toolJSX?.shouldHidePromptInput && !focusedInputDialog && !isExiting && !disabled && !cursor && /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(jsx_dev_runtime458.Fragment, {
                    children: [
                      autoRunIssueReason && /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(AutoRunIssueNotification, {
                        onRun: handleAutoRunIssue,
                        onCancel: handleCancelAutoRunIssue,
                        reason: getAutoRunIssueReasonText(autoRunIssueReason)
                      }, void 0, !1, void 0, this),
                      showIssueFlagBanner && /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(IssueFlagBanner, {}, void 0, !1, void 0, this),
                      /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(PromptInput_default, {
                        debug,
                        ideSelection,
                        hasSuppressedDialogs: !!hasSuppressedDialogs,
                        isLocalJSXCommandActive: isShowingLocalJSXCommand,
                        getToolUseContext,
                        toolPermissionContext,
                        setToolPermissionContext,
                        apiKeyStatus,
                        commands: commands7,
                        agents: agentDefinitions.activeAgents,
                        isLoading,
                        onExit: handleExit,
                        verbose,
                        messages,
                        onAutoUpdaterResult: setAutoUpdaterResult,
                        autoUpdaterResult,
                        input: inputValue,
                        onInputChange: setInputValue,
                        mode: inputMode,
                        onModeChange: setInputMode,
                        stashedPrompt,
                        setStashedPrompt,
                        submitCount,
                        onShowMessageSelector: handleShowMessageSelector,
                        onMessageActionsEnter: void 0,
                        mcpClients,
                        pastedContents,
                        setPastedContents,
                        vimMode,
                        setVimMode,
                        showBashesDialog,
                        setShowBashesDialog,
                        onSubmit,
                        onAgentSubmit,
                        isSearchingHistory,
                        setIsSearchingHistory,
                        helpOpen: isHelpOpen,
                        setHelpOpen: setIsHelpOpen,
                        insertTextRef,
                        voiceInterimRange: voice2.interimRange
                      }, void 0, !1, void 0, this),
                      /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(SessionBackgroundHint, {
                        onBackgroundSession: handleBackgroundSession,
                        isLoading
                      }, void 0, !1, void 0, this)
                    ]
                  }, void 0, !0, void 0, this),
                  cursor && /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(MessageActionsBar, {
                    cursor
                  }, void 0, !1, void 0, this),
                  focusedInputDialog === "message-selector" && /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(MessageSelector, {
                    messages,
                    preselectedMessage: messageSelectorPreselect,
                    onPreRestore: onCancel,
                    onRestoreCode: async (message) => {
                      await fileHistoryRewind((updater) => {
                        setAppState((prev) => ({
                          ...prev,
                          fileHistory: updater(prev.fileHistory)
                        }));
                      }, message.uuid);
                    },
                    onSummarize: async (message, feedback2, direction = "from") => {
                      let compactMessages = getMessagesAfterCompactBoundary(messages), messageIndex = compactMessages.indexOf(message);
                      if (messageIndex === -1) {
                        setMessages((prev) => [...prev, createSystemMessage("That message is no longer in the active context (snipped or pre-compact). Choose a more recent message.", "warning")]);
                        return;
                      }
                      let newAbortController = createAbortController(), context7 = getToolUseContext(compactMessages, [], newAbortController, mainLoopModel), appState = context7.getAppState(), defaultSysPrompt = await getSystemPrompt(context7.options.tools, context7.options.mainLoopModel, Array.from(appState.toolPermissionContext.additionalWorkingDirectories.keys()), context7.options.mcpClients), systemPrompt = buildEffectiveSystemPrompt({
                        mainThreadAgentDefinition: void 0,
                        toolUseContext: context7,
                        customSystemPrompt: context7.options.customSystemPrompt,
                        defaultSystemPrompt: defaultSysPrompt,
                        appendSystemPrompt: context7.options.appendSystemPrompt
                      }), [userContext, systemContext] = await Promise.all([getUserContext(), getSystemContext()]), result = await partialCompactConversation(compactMessages, messageIndex, context7, {
                        systemPrompt,
                        userContext,
                        systemContext,
                        toolUseContext: context7,
                        forkContextMessages: compactMessages
                      }, feedback2, direction), kept = result.messagesToKeep ?? [], ordered = direction === "up_to" ? [...result.summaryMessages, ...kept] : [...kept, ...result.summaryMessages], postCompact = [result.boundaryMarker, ...ordered, ...result.attachments, ...result.hookResults];
                      if (isFullscreenEnvEnabled() && direction === "from")
                        setMessages((old) => {
                          let rawIdx = old.findIndex((m4) => m4.uuid === message.uuid);
                          return [...old.slice(0, rawIdx === -1 ? 0 : rawIdx), ...postCompact];
                        });
                      else
                        setMessages(postCompact);
                      if (proactiveModule7?.setContextBlocked(!1), setConversationId(randomUUID42()), runPostCompactCleanup(context7.options.querySource), direction === "from") {
                        let r4 = textForResubmit(message);
                        if (r4)
                          setInputValue(r4.text), setInputMode(r4.mode);
                      }
                      let historyShortcut = getShortcutDisplay("app:toggleTranscript", "Global", "ctrl+o");
                      addNotification({
                        key: "summarize-ctrl-o-hint",
                        text: `Conversation summarized (${historyShortcut} for history)`,
                        priority: "medium",
                        timeoutMs: 8000
                      });
                    },
                    onRestoreMessage: handleRestoreMessage,
                    onClose: () => {
                      setIsMessageSelectorVisible(!1), setMessageSelectorPreselect(void 0);
                    }
                  }, void 0, !1, void 0, this),
                  !1
                ]
              }, void 0, !0, void 0, this),
              !(companionNarrow && isFullscreenEnvEnabled()) && companionVisible ? /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(CompanionSprite, {}, void 0, !1, void 0, this) : null
            ]
          }, void 0, !0, void 0, this)
        }, void 0, !1, void 0, this)
      }, remountKey, !1, void 0, this)
    ]
  }, void 0, !0, void 0, this);
  if (isFullscreenEnvEnabled())
    return /* @__PURE__ */ jsx_dev_runtime458.jsxDEV(AlternateScreen, {
      mouseTracking: isMouseTrackingEnabled(),
      children: mainReturn
    }, void 0, !1, void 0, this);
  return mainReturn;
}
