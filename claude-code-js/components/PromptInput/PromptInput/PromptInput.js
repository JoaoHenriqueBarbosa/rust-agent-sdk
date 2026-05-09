// function: PromptInput
function PromptInput({
  debug,
  ideSelection,
  toolPermissionContext,
  setToolPermissionContext,
  apiKeyStatus,
  commands: commands7,
  agents: agents2,
  isLoading,
  verbose,
  messages,
  onAutoUpdaterResult,
  autoUpdaterResult,
  input,
  onInputChange,
  mode,
  onModeChange,
  stashedPrompt,
  setStashedPrompt,
  submitCount,
  onShowMessageSelector,
  onMessageActionsEnter,
  mcpClients,
  pastedContents,
  setPastedContents,
  vimMode,
  setVimMode,
  showBashesDialog,
  setShowBashesDialog,
  onExit: onExit2,
  getToolUseContext,
  onSubmit: onSubmitProp,
  onAgentSubmit,
  isSearchingHistory,
  setIsSearchingHistory,
  onDismissSideQuestion,
  isSideQuestionVisible,
  helpOpen,
  setHelpOpen,
  hasSuppressedDialogs,
  isLocalJSXCommandActive = !1,
  insertTextRef,
  voiceInterimRange
}) {
  let mainLoopModel = useMainLoopModel(), isModalOverlayActive = useIsModalOverlayActive() || isLocalJSXCommandActive, [isAutoUpdating, setIsAutoUpdating] = import_react257.useState(!1), [exitMessage, setExitMessage] = import_react257.useState({
    show: !1
  }), [cursorOffset, setCursorOffset] = import_react257.useState(input.length), lastInternalInputRef = React139.useRef(input);
  if (input !== lastInternalInputRef.current)
    setCursorOffset(input.length), lastInternalInputRef.current = input;
  let trackAndSetInput = React139.useCallback((value) => {
    lastInternalInputRef.current = value, onInputChange(value);
  }, [onInputChange]);
  if (insertTextRef)
    insertTextRef.current = {
      cursorOffset,
      insert: (text2) => {
        let insertText = cursorOffset === input.length && input.length > 0 && !/\s$/.test(input) ? " " + text2 : text2, newValue = input.slice(0, cursorOffset) + insertText + input.slice(cursorOffset);
        lastInternalInputRef.current = newValue, onInputChange(newValue), setCursorOffset(cursorOffset + insertText.length);
      },
      setInputWithCursor: (value, cursor) => {
        lastInternalInputRef.current = value, onInputChange(value), setCursorOffset(cursor);
      }
    };
  let store = useAppStateStore(), setAppState = useSetAppState(), tasks2 = useAppState((s2) => s2.tasks), replBridgeConnected = useAppState((s2) => s2.replBridgeConnected), replBridgeExplicit = useAppState((s2) => s2.replBridgeExplicit), replBridgeReconnecting = useAppState((s2) => s2.replBridgeReconnecting), bridgeFooterVisible = replBridgeConnected && (replBridgeExplicit || replBridgeReconnecting), hasTungstenSession = useAppState((s2) => !1), tmuxFooterVisible = !1, bagelFooterVisible = useAppState((s2) => !1), teamContext = useAppState((s2) => s2.teamContext), queuedCommands = useCommandQueue(), promptSuggestionState = useAppState((s2) => s2.promptSuggestion), speculation = useAppState((s2) => s2.speculation), speculationSessionTimeSavedMs = useAppState((s2) => s2.speculationSessionTimeSavedMs), viewingAgentTaskId = useAppState((s2) => s2.viewingAgentTaskId), viewSelectionMode = useAppState((s2) => s2.viewSelectionMode), showSpinnerTree = useAppState((s2) => s2.expandedView) === "teammates", {
    companion: _companion,
    companionMuted
  } = getGlobalConfig(), companionFooterVisible = !!_companion && !companionMuted, briefOwnsGap = useAppState((s2) => s2.isBriefOnly) && !viewingAgentTaskId, mainLoopModel_ = useAppState((s2) => s2.mainLoopModel), mainLoopModelForSession = useAppState((s2) => s2.mainLoopModelForSession), thinkingEnabled = useAppState((s2) => s2.thinkingEnabled), isFastMode = useAppState((s2) => isFastModeEnabled() ? s2.fastMode : !1), effortValue = useAppState((s2) => s2.effortValue), viewedTeammate = getViewedTeammateTask(store.getState()), viewingAgentName = viewedTeammate?.identity.agentName, viewingAgentColor = viewedTeammate?.identity.color && AGENT_COLORS.includes(viewedTeammate.identity.color) ? viewedTeammate.identity.color : void 0, inProcessTeammates = import_react257.useMemo(() => getRunningTeammatesSorted(tasks2), [tasks2]), isTeammateMode = inProcessTeammates.length > 0 || viewedTeammate !== void 0, effectiveToolPermissionContext = import_react257.useMemo(() => {
    if (viewedTeammate)
      return {
        ...toolPermissionContext,
        mode: viewedTeammate.permissionMode
      };
    return toolPermissionContext;
  }, [viewedTeammate, toolPermissionContext]), {
    historyQuery,
    setHistoryQuery,
    historyMatch,
    historyFailedMatch
  } = useHistorySearch((entry) => {
    setPastedContents(entry.pastedContents), onSubmit(entry.display);
  }, input, trackAndSetInput, setCursorOffset, cursorOffset, onModeChange, mode, isSearchingHistory, setIsSearchingHistory, setPastedContents, pastedContents), nextPasteIdRef = import_react257.useRef(-1);
  if (nextPasteIdRef.current === -1)
    nextPasteIdRef.current = getInitialPasteId(messages);
  let pendingSpaceAfterPillRef = import_react257.useRef(!1), [showTeamsDialog, setShowTeamsDialog] = import_react257.useState(!1), [showBridgeDialog, setShowBridgeDialog] = import_react257.useState(!1), [teammateFooterIndex, setTeammateFooterIndex] = import_react257.useState(0), coordinatorTaskIndex = useAppState((s2) => s2.coordinatorTaskIndex), setCoordinatorTaskIndex = import_react257.useCallback((v2) => setAppState((prev) => {
    let next2 = typeof v2 === "function" ? v2(prev.coordinatorTaskIndex) : v2;
    if (next2 === prev.coordinatorTaskIndex)
      return prev;
    return {
      ...prev,
      coordinatorTaskIndex: next2
    };
  }), [setAppState]), coordinatorTaskCount = useCoordinatorTaskCount(), minCoordinatorIndex = import_react257.useMemo(() => Object.values(tasks2).some((t2) => isBackgroundTask(t2) && !0), [tasks2]) ? -1 : 0;
  import_react257.useEffect(() => {
    if (coordinatorTaskIndex >= coordinatorTaskCount)
      setCoordinatorTaskIndex(Math.max(minCoordinatorIndex, coordinatorTaskCount - 1));
    else if (coordinatorTaskIndex < minCoordinatorIndex)
      setCoordinatorTaskIndex(minCoordinatorIndex);
  }, [coordinatorTaskCount, coordinatorTaskIndex, minCoordinatorIndex]);
  let [isPasting, setIsPasting] = import_react257.useState(!1), [isExternalEditorActive, setIsExternalEditorActive] = import_react257.useState(!1), [showModelPicker, setShowModelPicker] = import_react257.useState(!1), [showQuickOpen, setShowQuickOpen] = import_react257.useState(!1), [showGlobalSearch, setShowGlobalSearch] = import_react257.useState(!1), [showHistoryPicker, setShowHistoryPicker] = import_react257.useState(!1), [showFastModePicker, setShowFastModePicker] = import_react257.useState(!1), [showThinkingToggle, setShowThinkingToggle] = import_react257.useState(!1), [showAutoModeOptIn, setShowAutoModeOptIn] = import_react257.useState(!1), [previousModeBeforeAuto, setPreviousModeBeforeAuto] = import_react257.useState(null), autoModeOptInTimeoutRef = import_react257.useRef(null), isCursorOnFirstLine = import_react257.useMemo(() => {
    let firstNewlineIndex = input.indexOf(`
`);
    if (firstNewlineIndex === -1)
      return !0;
    return cursorOffset <= firstNewlineIndex;
  }, [input, cursorOffset]), isCursorOnLastLine = import_react257.useMemo(() => {
    let lastNewlineIndex = input.lastIndexOf(`
`);
    if (lastNewlineIndex === -1)
      return !0;
    return cursorOffset > lastNewlineIndex;
  }, [input, cursorOffset]), cachedTeams = import_react257.useMemo(() => {
    if (!isAgentSwarmsEnabled())
      return [];
    if (isInProcessEnabled())
      return [];
    if (!teamContext)
      return [];
    let teammateCount = count2(Object.values(teamContext.teammates), (t2) => t2.name !== "team-lead");
    return [{
      name: teamContext.teamName,
      memberCount: teammateCount,
      runningCount: 0,
      idleCount: 0
    }];
  }, [teamContext]), tasksFooterVisible = (import_react257.useMemo(() => count2(Object.values(tasks2), (t2) => t2.status === "running"), [tasks2]) > 0 || !1) && !shouldHideTasksFooter(tasks2, showSpinnerTree), teamsFooterVisible = cachedTeams.length > 0, footerItems = import_react257.useMemo(() => [tasksFooterVisible && "tasks", tmuxFooterVisible && "tmux", bagelFooterVisible && "bagel", teamsFooterVisible && "teams", bridgeFooterVisible && "bridge", companionFooterVisible && "companion"].filter(Boolean), [tasksFooterVisible, tmuxFooterVisible, bagelFooterVisible, teamsFooterVisible, bridgeFooterVisible, companionFooterVisible]), rawFooterSelection = useAppState((s2) => s2.footerSelection), footerItemSelected = rawFooterSelection && footerItems.includes(rawFooterSelection) ? rawFooterSelection : null;
  import_react257.useEffect(() => {
    if (rawFooterSelection && !footerItemSelected)
      setAppState((prev) => prev.footerSelection === null ? prev : {
        ...prev,
        footerSelection: null
      });
  }, [rawFooterSelection, footerItemSelected, setAppState]);
  let tasksSelected = footerItemSelected === "tasks", tmuxSelected = footerItemSelected === "tmux", bagelSelected = footerItemSelected === "bagel", teamsSelected = footerItemSelected === "teams", bridgeSelected = footerItemSelected === "bridge";
  function selectFooterItem(item) {
    if (setAppState((prev) => prev.footerSelection === item ? prev : {
      ...prev,
      footerSelection: item
    }), item === "tasks")
      setTeammateFooterIndex(0), setCoordinatorTaskIndex(minCoordinatorIndex);
  }
  function navigateFooter(delta, exitAtStart = !1) {
    let idx = footerItemSelected ? footerItems.indexOf(footerItemSelected) : -1, next2 = footerItems[idx + delta];
    if (next2)
      return selectFooterItem(next2), !0;
    if (delta < 0 && exitAtStart)
      return selectFooterItem(null), !0;
    return !1;
  }
  let {
    suggestion: promptSuggestion,
    markAccepted,
    logOutcomeAtSubmission,
    markShown
  } = usePromptSuggestion({
    inputValue: input,
    isAssistantResponding: isLoading
  }), displayedValue = import_react257.useMemo(() => isSearchingHistory && historyMatch ? getValueFromInput(typeof historyMatch === "string" ? historyMatch : historyMatch.display) : input, [isSearchingHistory, historyMatch, input]), thinkTriggers = import_react257.useMemo(() => findThinkingTriggerPositions(displayedValue), [displayedValue]), ultraplanSessionUrl = useAppState((s2) => s2.ultraplanSessionUrl), ultraplanLaunching = useAppState((s2) => s2.ultraplanLaunching), ultraplanTriggers = import_react257.useMemo(() => [], [displayedValue, ultraplanSessionUrl, ultraplanLaunching]), ultrareviewTriggers = import_react257.useMemo(() => isUltrareviewEnabled() ? findUltrareviewTriggerPositions(displayedValue) : [], [displayedValue]), btwTriggers = import_react257.useMemo(() => findBtwTriggerPositions(displayedValue), [displayedValue]), buddyTriggers = import_react257.useMemo(() => findBuddyTriggerPositions(displayedValue), [displayedValue]), slashCommandTriggers = import_react257.useMemo(() => {
    return findSlashCommandPositions(displayedValue).filter((pos) => {
      let commandName = displayedValue.slice(pos.start + 1, pos.end);
      return hasCommand(commandName, commands7);
    });
  }, [displayedValue, commands7]), tokenBudgetTriggers = import_react257.useMemo(() => [], [displayedValue]), knownChannelsVersion2 = import_react257.useSyncExternalStore(subscribeKnownChannels, getKnownChannelsVersion), slackChannelTriggers = import_react257.useMemo(() => hasSlackMcpServer(store.getState().mcp.clients) ? findSlackChannelPositions(displayedValue) : [], [displayedValue, knownChannelsVersion2]), memberMentionHighlights = import_react257.useMemo(() => {
    if (!isAgentSwarmsEnabled())
      return [];
    if (!teamContext?.teammates)
      return [];
    let highlights = [], members = teamContext.teammates;
    if (!members)
      return highlights;
    let regex2 = /(^|\s)@([\w-]+)/g, memberValues = Object.values(members), match;
    while ((match = regex2.exec(displayedValue)) !== null) {
      let leadingSpace = match[1] ?? "", nameStart = match.index + leadingSpace.length, fullMatch = match[0].trimStart(), name3 = match[2], member = memberValues.find((t2) => t2.name === name3);
      if (member?.color) {
        let themeColor = AGENT_COLOR_TO_THEME_COLOR[member.color];
        if (themeColor)
          highlights.push({
            start: nameStart,
            end: nameStart + fullMatch.length,
            themeColor
          });
      }
    }
    return highlights;
  }, [displayedValue, teamContext]), imageRefPositions = import_react257.useMemo(() => parseReferences(displayedValue).filter((r4) => r4.match.startsWith("[Image")).map((r4) => ({
    start: r4.index,
    end: r4.index + r4.match.length
  })), [displayedValue]), cursorAtImageChip = imageRefPositions.some((r4) => r4.start === cursorOffset);
  import_react257.useEffect(() => {
    let inside = imageRefPositions.find((r4) => cursorOffset > r4.start && cursorOffset < r4.end);
    if (inside) {
      let mid = (inside.start + inside.end) / 2;
      setCursorOffset(cursorOffset < mid ? inside.start : inside.end);
    }
  }, [cursorOffset, imageRefPositions, setCursorOffset]);
  let combinedHighlights = import_react257.useMemo(() => {
    let highlights = [];
    for (let ref of imageRefPositions)
      if (cursorOffset === ref.start)
        highlights.push({
          start: ref.start,
          end: ref.end,
          color: void 0,
          inverse: !0,
          priority: 8
        });
    if (isSearchingHistory && historyMatch && !historyFailedMatch)
      highlights.push({
        start: cursorOffset,
        end: cursorOffset + historyQuery.length,
        color: "warning",
        priority: 20
      });
    for (let trigger of btwTriggers)
      highlights.push({
        start: trigger.start,
        end: trigger.end,
        color: "warning",
        priority: 15
      });
    for (let trigger of slashCommandTriggers)
      highlights.push({
        start: trigger.start,
        end: trigger.end,
        color: "suggestion",
        priority: 5
      });
    for (let trigger of tokenBudgetTriggers)
      highlights.push({
        start: trigger.start,
        end: trigger.end,
        color: "suggestion",
        priority: 5
      });
    for (let trigger of slackChannelTriggers)
      highlights.push({
        start: trigger.start,
        end: trigger.end,
        color: "suggestion",
        priority: 5
      });
    for (let mention of memberMentionHighlights)
      highlights.push({
        start: mention.start,
        end: mention.end,
        color: mention.themeColor,
        priority: 5
      });
    if (voiceInterimRange)
      highlights.push({
        start: voiceInterimRange.start,
        end: voiceInterimRange.end,
        color: void 0,
        dimColor: !0,
        priority: 1
      });
    if (isUltrathinkEnabled())
      for (let trigger of thinkTriggers)
        for (let i5 = trigger.start;i5 < trigger.end; i5++)
          highlights.push({
            start: i5,
            end: i5 + 1,
            color: getRainbowColor(i5 - trigger.start),
            shimmerColor: getRainbowColor(i5 - trigger.start, !0),
            priority: 10
          });
    for (let trigger of ultrareviewTriggers)
      for (let i5 = trigger.start;i5 < trigger.end; i5++)
        highlights.push({
          start: i5,
          end: i5 + 1,
          color: getRainbowColor(i5 - trigger.start),
          shimmerColor: getRainbowColor(i5 - trigger.start, !0),
          priority: 10
        });
    for (let trigger of buddyTriggers)
      for (let i5 = trigger.start;i5 < trigger.end; i5++)
        highlights.push({
          start: i5,
          end: i5 + 1,
          color: getRainbowColor(i5 - trigger.start),
          shimmerColor: getRainbowColor(i5 - trigger.start, !0),
          priority: 10
        });
    return highlights;
  }, [isSearchingHistory, historyQuery, historyMatch, historyFailedMatch, cursorOffset, btwTriggers, imageRefPositions, memberMentionHighlights, slashCommandTriggers, tokenBudgetTriggers, slackChannelTriggers, displayedValue, voiceInterimRange, thinkTriggers, ultraplanTriggers, ultrareviewTriggers, buddyTriggers]), {
    addNotification,
    removeNotification
  } = useNotifications();
  import_react257.useEffect(() => {
    if (thinkTriggers.length && isUltrathinkEnabled())
      addNotification({
        key: "ultrathink-active",
        text: "Effort set to high for this turn",
        priority: "immediate",
        timeoutMs: 5000
      });
    else
      removeNotification("ultrathink-active");
  }, [addNotification, removeNotification, thinkTriggers.length]), import_react257.useEffect(() => {
    removeNotification("ultraplan-active");
  }, [addNotification, removeNotification, ultraplanTriggers.length]), import_react257.useEffect(() => {
    if (isUltrareviewEnabled() && ultrareviewTriggers.length)
      addNotification({
        key: "ultrareview-active",
        text: "Run /ultrareview after Claude finishes to review these changes in the cloud",
        priority: "immediate",
        timeoutMs: 5000
      });
  }, [addNotification, ultrareviewTriggers.length]);
  let prevInputLengthRef = import_react257.useRef(input.length), peakInputLengthRef = import_react257.useRef(input.length), dismissStashHint = import_react257.useCallback(() => {
    removeNotification("stash-hint");
  }, [removeNotification]);
  import_react257.useEffect(() => {
    let prevLength = prevInputLengthRef.current, peakLength = peakInputLengthRef.current, currentLength = input.length;
    if (prevInputLengthRef.current = currentLength, currentLength > peakLength) {
      peakInputLengthRef.current = currentLength;
      return;
    }
    if (currentLength === 0) {
      peakInputLengthRef.current = 0;
      return;
    }
    let clearedSubstantialInput = peakLength >= 20 && currentLength <= 5, wasRapidClear = prevLength >= 20 && currentLength <= 5;
    if (clearedSubstantialInput && !wasRapidClear) {
      if (!getGlobalConfig().hasUsedStash)
        addNotification({
          key: "stash-hint",
          jsx: /* @__PURE__ */ jsx_dev_runtime434.jsxDEV(ThemedText, {
            dimColor: !0,
            children: [
              "Tip:",
              " ",
              /* @__PURE__ */ jsx_dev_runtime434.jsxDEV(ConfigurableShortcutHint, {
                action: "chat:stash",
                context: "Chat",
                fallback: "ctrl+s",
                description: "stash"
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this),
          priority: "immediate",
          timeoutMs: FOOTER_TEMPORARY_STATUS_TIMEOUT
        });
      peakInputLengthRef.current = currentLength;
    }
  }, [input.length, addNotification]);
  let {
    pushToBuffer,
    undo,
    canUndo,
    clearBuffer
  } = useInputBuffer({
    maxBufferSize: 50,
    debounceMs: 1000
  });
  useMaybeTruncateInput({
    input,
    pastedContents,
    onInputChange: trackAndSetInput,
    setCursorOffset,
    setPastedContents
  });
  let defaultPlaceholder = usePromptInputPlaceholder({
    input,
    submitCount,
    viewingAgentName
  }), onChange = import_react257.useCallback((value) => {
    if (value === "?") {
      logEvent("tengu_help_toggled", {}), setHelpOpen((v2) => !v2);
      return;
    }
    setHelpOpen(!1), dismissStashHint(), abortPromptSuggestion(), abortSpeculation(setAppState);
    let isSingleCharInsertion = value.length === input.length + 1, insertedAtStart = cursorOffset === 0, mode2 = getModeFromInput(value);
    if (insertedAtStart && mode2 !== "prompt") {
      if (isSingleCharInsertion) {
        onModeChange(mode2);
        return;
      }
      if (input.length === 0) {
        onModeChange(mode2);
        let valueWithoutMode = getValueFromInput(value).replaceAll("\t", "    ");
        pushToBuffer(input, cursorOffset, pastedContents), trackAndSetInput(valueWithoutMode), setCursorOffset(valueWithoutMode.length);
        return;
      }
    }
    let processedValue = value.replaceAll("\t", "    ");
    if (input !== processedValue)
      pushToBuffer(input, cursorOffset, pastedContents);
    setAppState((prev) => prev.footerSelection === null ? prev : {
      ...prev,
      footerSelection: null
    }), trackAndSetInput(processedValue);
  }, [trackAndSetInput, onModeChange, input, cursorOffset, pushToBuffer, pastedContents, dismissStashHint, setAppState]), {
    resetHistory,
    onHistoryUp,
    onHistoryDown,
    dismissSearchHint,
    historyIndex
  } = useArrowKeyHistory((value, historyMode, pastedContents2) => {
    onChange(value), onModeChange(historyMode), setPastedContents(pastedContents2);
  }, input, pastedContents, setCursorOffset, mode);
  import_react257.useEffect(() => {
    if (isSearchingHistory)
      dismissSearchHint();
  }, [isSearchingHistory, dismissSearchHint]);
  function handleHistoryUp() {
    if (suggestions.length > 1)
      return;
    if (!isCursorOnFirstLine)
      return;
    if (queuedCommands.some(isQueuedCommandEditable)) {
      popAllCommandsFromQueue();
      return;
    }
    onHistoryUp();
  }
  function handleHistoryDown() {
    if (suggestions.length > 1)
      return;
    if (!isCursorOnLastLine)
      return;
    if (onHistoryDown() && footerItems.length > 0) {
      let first = footerItems[0];
      if (selectFooterItem(first), first === "tasks" && !getGlobalConfig().hasSeenTasksHint)
        saveGlobalConfig((c3) => c3.hasSeenTasksHint ? c3 : {
          ...c3,
          hasSeenTasksHint: !0
        });
    }
  }
  let [suggestionsState, setSuggestionsStateRaw] = import_react257.useState({
    suggestions: [],
    selectedSuggestion: -1,
    commandArgumentHint: void 0
  }), setSuggestionsState = import_react257.useCallback((updater) => {
    setSuggestionsStateRaw((prev) => typeof updater === "function" ? updater(prev) : updater);
  }, []), onSubmit = import_react257.useCallback(async (inputParam, isSubmittingSlashCommand = !1) => {
    inputParam = inputParam.trimEnd();
    let state4 = store.getState();
    if (state4.footerSelection && footerItems.includes(state4.footerSelection))
      return;
    if (state4.viewSelectionMode === "selecting-agent")
      return;
    let hasImages = Object.values(pastedContents).some((c3) => c3.type === "image"), suggestionText = promptSuggestionState.text;
    if ((inputParam.trim() === "" || inputParam === suggestionText) && suggestionText && !hasImages && !state4.viewingAgentTaskId) {
      if (speculation.status === "active") {
        markAccepted(), logOutcomeAtSubmission(suggestionText, {
          skipReset: !0
        }), onSubmitProp(suggestionText, {
          setCursorOffset,
          clearBuffer,
          resetHistory
        }, {
          state: speculation,
          speculationSessionTimeSavedMs,
          setAppState
        });
        return;
      }
      if (promptSuggestionState.shownAt > 0)
        markAccepted(), inputParam = suggestionText;
    }
    if (isAgentSwarmsEnabled()) {
      let directMessage = parseDirectMemberMessage(inputParam);
      if (directMessage) {
        let result = await sendDirectMemberMessage(directMessage.recipientName, directMessage.message, teamContext, writeToMailbox);
        if (result.success) {
          addNotification({
            key: "direct-message-sent",
            text: `Sent to @${result.recipientName}`,
            priority: "immediate",
            timeoutMs: 3000
          }), trackAndSetInput(""), setCursorOffset(0), clearBuffer(), resetHistory();
          return;
        } else if (result.error === "no_team_context")
          ;
      }
    }
    if (inputParam.trim() === "" && !hasImages)
      return;
    let hasDirectorySuggestions = suggestionsState.suggestions.length > 0 && suggestionsState.suggestions.every((s2) => s2.description === "directory");
    if (suggestionsState.suggestions.length > 0 && !isSubmittingSlashCommand && !hasDirectorySuggestions) {
      logForDebugging(`[onSubmit] early return: suggestions showing (count=${suggestionsState.suggestions.length})`);
      return;
    }
    if (promptSuggestionState.text && promptSuggestionState.shownAt > 0)
      logOutcomeAtSubmission(inputParam);
    removeNotification("stash-hint");
    let activeAgent = getActiveAgentForInput(store.getState());
    if (activeAgent.type !== "leader" && onAgentSubmit) {
      logEvent("tengu_transcript_input_to_teammate", {}), await onAgentSubmit(inputParam, activeAgent.task, {
        setCursorOffset,
        clearBuffer,
        resetHistory
      });
      return;
    }
    await onSubmitProp(inputParam, {
      setCursorOffset,
      clearBuffer,
      resetHistory
    });
  }, [promptSuggestionState, speculation, speculationSessionTimeSavedMs, teamContext, store, footerItems, suggestionsState.suggestions, onSubmitProp, onAgentSubmit, clearBuffer, resetHistory, logOutcomeAtSubmission, setAppState, markAccepted, pastedContents, removeNotification]), {
    suggestions,
    selectedSuggestion,
    commandArgumentHint,
    inlineGhostText,
    maxColumnWidth
  } = useTypeahead({
    commands: commands7,
    onInputChange: trackAndSetInput,
    onSubmit,
    setCursorOffset,
    input,
    cursorOffset,
    mode,
    agents: agents2,
    setSuggestionsState,
    suggestionsState,
    suppressSuggestions: isSearchingHistory || historyIndex > 0,
    markAccepted,
    onModeChange
  }), showPromptSuggestion = mode === "prompt" && suggestions.length === 0 && promptSuggestion && !viewingAgentTaskId;
  if (showPromptSuggestion)
    markShown();
  if (promptSuggestionState.text && !promptSuggestion && promptSuggestionState.shownAt === 0 && !viewingAgentTaskId)
    logSuggestionSuppressed("timing", promptSuggestionState.text), setAppState((prev) => ({
      ...prev,
      promptSuggestion: {
        text: null,
        promptId: null,
        shownAt: 0,
        acceptedAt: 0,
        generationRequestId: null
      }
    }));
  function onImagePaste(image, mediaType, filename, dimensions, sourcePath) {
    logEvent("tengu_paste_image", {}), onModeChange("prompt");
    let pasteId = nextPasteIdRef.current++, newContent = {
      id: pasteId,
      type: "image",
      content: image,
      mediaType: mediaType || "image/png",
      filename: filename || "Pasted image",
      dimensions,
      sourcePath
    };
    cacheImagePath(newContent), storeImage(newContent), setPastedContents((prev) => ({
      ...prev,
      [pasteId]: newContent
    }));
    let prefix = pendingSpaceAfterPillRef.current ? " " : "";
    insertTextAtCursor(prefix + formatImageRef(pasteId)), pendingSpaceAfterPillRef.current = !0;
  }
  import_react257.useEffect(() => {
    let referencedIds = new Set(parseReferences(input).map((r4) => r4.id));
    setPastedContents((prev) => {
      let orphaned = Object.values(prev).filter((c3) => c3.type === "image" && !referencedIds.has(c3.id));
      if (orphaned.length === 0)
        return prev;
      let next2 = {
        ...prev
      };
      for (let img of orphaned)
        delete next2[img.id];
      return next2;
    });
  }, [input, setPastedContents]);
  function onTextPaste(rawText) {
    pendingSpaceAfterPillRef.current = !1;
    let text2 = stripAnsi(rawText).replace(/\r/g, `
`).replaceAll("\t", "    ");
    if (input.length === 0) {
      let pastedMode = getModeFromInput(text2);
      if (pastedMode !== "prompt")
        onModeChange(pastedMode), text2 = getValueFromInput(text2);
    }
    let numLines = getPastedTextRefNumLines(text2), maxLines = Math.min(rows - 10, 2);
    if (text2.length > PASTE_THRESHOLD || numLines > maxLines) {
      let pasteId = nextPasteIdRef.current++, newContent = {
        id: pasteId,
        type: "text",
        content: text2
      };
      setPastedContents((prev) => ({
        ...prev,
        [pasteId]: newContent
      })), insertTextAtCursor(formatPastedTextRef(pasteId, numLines));
    } else
      insertTextAtCursor(text2);
  }
  let lazySpaceInputFilter = import_react257.useCallback((input2, key3) => {
    if (!pendingSpaceAfterPillRef.current)
      return input2;
    if (pendingSpaceAfterPillRef.current = !1, isNonSpacePrintable(input2, key3))
      return " " + input2;
    return input2;
  }, []);
  function insertTextAtCursor(text2) {
    pushToBuffer(input, cursorOffset, pastedContents);
    let newInput = input.slice(0, cursorOffset) + text2 + input.slice(cursorOffset);
    trackAndSetInput(newInput), setCursorOffset(cursorOffset + text2.length);
  }
  let doublePressEscFromEmpty = useDoublePress(() => {}, () => onShowMessageSelector()), popAllCommandsFromQueue = import_react257.useCallback(() => {
    let result = popAllEditable(input, cursorOffset);
    if (!result)
      return !1;
    if (trackAndSetInput(result.text), onModeChange("prompt"), setCursorOffset(result.cursorOffset), result.images.length > 0)
      setPastedContents((prev) => {
        let newContents = {
          ...prev
        };
        for (let image of result.images)
          newContents[image.id] = image;
        return newContents;
      });
    return !0;
  }, [trackAndSetInput, onModeChange, input, cursorOffset, setPastedContents]);
  useIdeAtMentioned(mcpClients, function(atMentioned) {
    logEvent("tengu_ext_at_mentioned", {});
    let atMentionedText, relativePath2 = path26.relative(getCwd(), atMentioned.filePath);
    if (atMentioned.lineStart && atMentioned.lineEnd)
      atMentionedText = atMentioned.lineStart === atMentioned.lineEnd ? `@${relativePath2}#L${atMentioned.lineStart} ` : `@${relativePath2}#L${atMentioned.lineStart}-${atMentioned.lineEnd} `;
    else
      atMentionedText = `@${relativePath2} `;
    let cursorChar = input[cursorOffset - 1] ?? " ";
    if (!/\s/.test(cursorChar))
      atMentionedText = ` ${atMentionedText}`;
    insertTextAtCursor(atMentionedText);
  });
  let handleUndo = import_react257.useCallback(() => {
    if (canUndo) {
      let previousState = undo();
      if (previousState)
        trackAndSetInput(previousState.text), setCursorOffset(previousState.cursorOffset), setPastedContents(previousState.pastedContents);
    }
  }, [canUndo, undo, trackAndSetInput, setPastedContents]), handleNewline = import_react257.useCallback(() => {
    pushToBuffer(input, cursorOffset, pastedContents);
    let newInput = input.slice(0, cursorOffset) + `
` + input.slice(cursorOffset);
    trackAndSetInput(newInput), setCursorOffset(cursorOffset + 1);
  }, [input, cursorOffset, trackAndSetInput, setCursorOffset, pushToBuffer, pastedContents]), handleExternalEditor = import_react257.useCallback(async () => {
    logEvent("tengu_external_editor_used", {}), setIsExternalEditorActive(!0);
    try {
      let result = await editPromptInEditor(input, pastedContents);
      if (result.error)
        addNotification({
          key: "external-editor-error",
          text: result.error,
          color: "warning",
          priority: "high"
        });
      if (result.content !== null && result.content !== input)
        pushToBuffer(input, cursorOffset, pastedContents), trackAndSetInput(result.content), setCursorOffset(result.content.length);
    } catch (err2) {
      if (err2 instanceof Error)
        logError2(err2);
      addNotification({
        key: "external-editor-error",
        text: `External editor failed: ${errorMessage(err2)}`,
        color: "warning",
        priority: "high"
      });
    } finally {
      setIsExternalEditorActive(!1);
    }
  }, [input, cursorOffset, pastedContents, pushToBuffer, trackAndSetInput, addNotification]), handleStash = import_react257.useCallback(() => {
    if (input.trim() === "" && stashedPrompt !== void 0)
      trackAndSetInput(stashedPrompt.text), setCursorOffset(stashedPrompt.cursorOffset), setPastedContents(stashedPrompt.pastedContents), setStashedPrompt(void 0);
    else if (input.trim() !== "")
      setStashedPrompt({
        text: input,
        cursorOffset,
        pastedContents
      }), trackAndSetInput(""), setCursorOffset(0), setPastedContents({}), saveGlobalConfig((c3) => {
        if (c3.hasUsedStash)
          return c3;
        return {
          ...c3,
          hasUsedStash: !0
        };
      });
  }, [input, cursorOffset, stashedPrompt, trackAndSetInput, setStashedPrompt, pastedContents, setPastedContents]), handleModelPicker = import_react257.useCallback(() => {
    if (setShowModelPicker((prev) => !prev), helpOpen)
      setHelpOpen(!1);
  }, [helpOpen]), handleFastModePicker = import_react257.useCallback(() => {
    if (setShowFastModePicker((prev) => !prev), helpOpen)
      setHelpOpen(!1);
  }, [helpOpen]), handleThinkingToggle = import_react257.useCallback(() => {
    if (setShowThinkingToggle((prev) => !prev), helpOpen)
      setHelpOpen(!1);
  }, [helpOpen]), handleCycleMode = import_react257.useCallback(() => {
    if (isAgentSwarmsEnabled() && viewedTeammate && viewingAgentTaskId) {
      let teammateContext = {
        ...toolPermissionContext,
        mode: viewedTeammate.permissionMode
      }, nextMode2 = getNextPermissionMode(teammateContext, void 0);
      logEvent("tengu_mode_cycle", {
        to: nextMode2
      });
      let teammateTaskId = viewingAgentTaskId;
      if (setAppState((prev) => {
        let task = prev.tasks[teammateTaskId];
        if (!task || task.type !== "in_process_teammate")
          return prev;
        if (task.permissionMode === nextMode2)
          return prev;
        return {
          ...prev,
          tasks: {
            ...prev.tasks,
            [teammateTaskId]: {
              ...task,
              permissionMode: nextMode2
            }
          }
        };
      }), helpOpen)
        setHelpOpen(!1);
      return;
    }
    logForDebugging(`[auto-mode] handleCycleMode: currentMode=${toolPermissionContext.mode} isAutoModeAvailable=${toolPermissionContext.isAutoModeAvailable} showAutoModeOptIn=${showAutoModeOptIn} timeoutPending=${!!autoModeOptInTimeoutRef.current}`);
    let nextMode = getNextPermissionMode(toolPermissionContext, teamContext), isEnteringAutoModeFirstTime = !1, {
      context: preparedContext
    } = cyclePermissionMode(toolPermissionContext, teamContext);
    if (logEvent("tengu_mode_cycle", {
      to: nextMode
    }), nextMode === "plan")
      saveGlobalConfig((current) => ({
        ...current,
        lastPlanModeUse: Date.now()
      }));
    if (setAppState((prev) => ({
      ...prev,
      toolPermissionContext: {
        ...preparedContext,
        mode: nextMode
      }
    })), setToolPermissionContext({
      ...preparedContext,
      mode: nextMode
    }), syncTeammateMode(nextMode, teamContext?.teamName), helpOpen)
      setHelpOpen(!1);
  }, [toolPermissionContext, teamContext, viewingAgentTaskId, viewedTeammate, setAppState, setToolPermissionContext, helpOpen, showAutoModeOptIn]), handleAutoModeOptInAccept = import_react257.useCallback(() => {}, [helpOpen, setHelpOpen, previousModeBeforeAuto, toolPermissionContext, setAppState, setToolPermissionContext]), handleAutoModeOptInDecline = import_react257.useCallback(() => {}, [previousModeBeforeAuto, toolPermissionContext, setAppState, setToolPermissionContext]), handleImagePaste = import_react257.useCallback(() => {
    getImageFromClipboard().then((imageData) => {
      if (imageData)
        onImagePaste(imageData.base64, imageData.mediaType);
      else {
        let shortcutDisplay = getShortcutDisplay("chat:imagePaste", "Chat", "ctrl+v"), message = env3.isSSH() ? "No image found in clipboard. You're SSH'd; try scp?" : `No image found in clipboard. Use ${shortcutDisplay} to paste images.`;
        addNotification({
          key: "no-image-in-clipboard",
          text: message,
          priority: "immediate",
          timeoutMs: 1000
        });
      }
    });
  }, [addNotification, onImagePaste]), keybindingContext = useOptionalKeybindingContext();
  import_react257.useEffect(() => {
    if (!keybindingContext || isModalOverlayActive)
      return;
    return keybindingContext.registerHandler({
      action: "chat:submit",
      context: "Chat",
      handler: () => {
        onSubmit(input);
      }
    });
  }, [keybindingContext, isModalOverlayActive, onSubmit, input]);
  let chatHandlers = import_react257.useMemo(() => ({
    "chat:undo": handleUndo,
    "chat:newline": handleNewline,
    "chat:externalEditor": handleExternalEditor,
    "chat:stash": handleStash,
    "chat:modelPicker": handleModelPicker,
    "chat:thinkingToggle": handleThinkingToggle,
    "chat:cycleMode": handleCycleMode,
    "chat:imagePaste": handleImagePaste
  }), [handleUndo, handleNewline, handleExternalEditor, handleStash, handleModelPicker, handleThinkingToggle, handleCycleMode, handleImagePaste]);
  useKeybindings(chatHandlers, {
    context: "Chat",
    isActive: !isModalOverlayActive
  }), useKeybinding("chat:messageActions", () => onMessageActionsEnter?.(), {
    context: "Chat",
    isActive: !isModalOverlayActive && !isSearchingHistory
  }), useKeybinding("chat:fastMode", handleFastModePicker, {
    context: "Chat",
    isActive: !isModalOverlayActive && isFastModeEnabled() && isFastModeAvailable()
  }), useKeybinding("help:dismiss", () => {
    setHelpOpen(!1);
  }, {
    context: "Help",
    isActive: helpOpen
  });
  let quickSearchActive = !1;
  useKeybinding("app:quickOpen", () => {}, {
    context: "Global",
    isActive: quickSearchActive
  }), useKeybinding("app:globalSearch", () => {}, {
    context: "Global",
    isActive: quickSearchActive
  }), useKeybinding("history:search", () => {}, {
    context: "Global",
    isActive: !1
  }), useKeybinding("app:interrupt", () => {
    abortSpeculation(setAppState);
  }, {
    context: "Global",
    isActive: !isLoading && speculation.status === "active"
  }), useKeybindings({
    "footer:up": () => {
      navigateFooter(-1, !0);
    },
    "footer:down": () => {
      if (tasksSelected && !isTeammateMode) {
        setShowBashesDialog(!0), selectFooterItem(null);
        return;
      }
      navigateFooter(1);
    },
    "footer:next": () => {
      if (tasksSelected && isTeammateMode) {
        let totalAgents = 1 + inProcessTeammates.length;
        setTeammateFooterIndex((prev) => (prev + 1) % totalAgents);
        return;
      }
      navigateFooter(1);
    },
    "footer:previous": () => {
      if (tasksSelected && isTeammateMode) {
        let totalAgents = 1 + inProcessTeammates.length;
        setTeammateFooterIndex((prev) => (prev - 1 + totalAgents) % totalAgents);
        return;
      }
      navigateFooter(-1);
    },
    "footer:openSelected": () => {
      if (viewSelectionMode === "selecting-agent")
        return;
      switch (footerItemSelected) {
        case "companion":
          selectFooterItem(null), onSubmit("/buddy");
          break;
        case "tasks":
          if (isTeammateMode)
            if (teammateFooterIndex === 0)
              exitTeammateView(setAppState);
            else {
              let teammate = inProcessTeammates[teammateFooterIndex - 1];
              if (teammate)
                enterTeammateView(teammate.id, setAppState);
            }
          else if (coordinatorTaskIndex === 0 && coordinatorTaskCount > 0)
            exitTeammateView(setAppState);
          else {
            let selectedTaskId = getVisibleAgentTasks(tasks2)[coordinatorTaskIndex - 1]?.id;
            if (selectedTaskId)
              enterTeammateView(selectedTaskId, setAppState);
            else
              setShowBashesDialog(!0), selectFooterItem(null);
          }
          break;
        case "tmux":
          break;
        case "bagel":
          break;
        case "teams":
          setShowTeamsDialog(!0), selectFooterItem(null);
          break;
        case "bridge":
          setShowBridgeDialog(!0), selectFooterItem(null);
          break;
      }
    },
    "footer:clearSelection": () => {
      selectFooterItem(null);
    },
    "footer:close": () => {
      if (tasksSelected && coordinatorTaskIndex >= 1) {
        let task = getVisibleAgentTasks(tasks2)[coordinatorTaskIndex - 1];
        if (!task)
          return !1;
        if (viewSelectionMode === "viewing-agent" && task.id === viewingAgentTaskId) {
          onChange(input.slice(0, cursorOffset) + "x" + input.slice(cursorOffset)), setCursorOffset(cursorOffset + 1);
          return;
        }
        if (stopOrDismissAgent(task.id, setAppState), task.status !== "running")
          setCoordinatorTaskIndex((i5) => Math.max(minCoordinatorIndex, i5 - 1));
        return;
      }
      return !1;
    }
  }, {
    context: "Footer",
    isActive: !!footerItemSelected && !isModalOverlayActive
  }), use_input_default((char, key3) => {
    if (showTeamsDialog || showQuickOpen || showGlobalSearch || showHistoryPicker)
      return;
    if (getPlatform() === "macos" && isMacosOptionChar(char)) {
      let shortcut = MACOS_OPTION_SPECIAL_CHARS[char], terminalName = getNativeCSIuTerminalDisplayName();
      addNotification({
        key: "option-meta-hint",
        jsx: terminalName ? /* @__PURE__ */ jsx_dev_runtime434.jsxDEV(ThemedText, {
          dimColor: !0,
          children: [
            "To enable ",
            shortcut,
            ", set ",
            /* @__PURE__ */ jsx_dev_runtime434.jsxDEV(ThemedText, {
              bold: !0,
              children: "Option as Meta"
            }, void 0, !1, void 0, this),
            " in",
            " ",
            terminalName,
            " preferences (\u2318,)"
          ]
        }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime434.jsxDEV(ThemedText, {
          dimColor: !0,
          children: [
            "To enable ",
            shortcut,
            ", run /terminal-setup"
          ]
        }, void 0, !0, void 0, this),
        priority: "immediate",
        timeoutMs: 5000
      });
    }
    if (footerItemSelected && char && !key3.ctrl && !key3.meta && !key3.escape && !key3.return) {
      onChange(input.slice(0, cursorOffset) + char + input.slice(cursorOffset)), setCursorOffset(cursorOffset + char.length);
      return;
    }
    if (cursorOffset === 0 && (key3.escape || key3.backspace || key3.delete || key3.ctrl && char === "u"))
      onModeChange("prompt"), setHelpOpen(!1);
    if (helpOpen && input === "" && (key3.backspace || key3.delete))
      setHelpOpen(!1);
    if (key3.escape) {
      if (speculation.status === "active") {
        abortSpeculation(setAppState);
        return;
      }
      if (isSideQuestionVisible && onDismissSideQuestion) {
        onDismissSideQuestion();
        return;
      }
      if (helpOpen) {
        setHelpOpen(!1);
        return;
      }
      if (footerItemSelected)
        return;
      if (queuedCommands.some(isQueuedCommandEditable)) {
        popAllCommandsFromQueue();
        return;
      }
      if (messages.length > 0 && !input && !isLoading)
        doublePressEscFromEmpty();
    }
    if (key3.return && helpOpen)
      setHelpOpen(!1);
  });
  let swarmBanner = useSwarmBanner(), fastModeCooldown = isFastModeEnabled() ? isFastModeCooldown() : !1, showFastIcon = isFastModeEnabled() ? isFastMode && (isFastModeAvailable() || fastModeCooldown) : !1, showFastIconHint = useShowFastIconHint(showFastIcon ?? !1), effortNotificationText = briefOwnsGap ? void 0 : getEffortNotificationText(effortValue, mainLoopModel);
  import_react257.useEffect(() => {
    if (!effortNotificationText) {
      removeNotification("effort-level");
      return;
    }
    addNotification({
      key: "effort-level",
      text: effortNotificationText,
      priority: "high",
      timeoutMs: 12000
    });
  }, [effortNotificationText, addNotification, removeNotification]), useBuddyNotification();
  let companionSpeaking = useAppState((s2) => s2.companionReaction !== void 0), {
    columns,
    rows
  } = useTerminalSize(), textInputColumns = columns - 3 - companionReservedColumns(columns, companionSpeaking), maxVisibleLines = isFullscreenEnvEnabled() ? Math.max(MIN_INPUT_VIEWPORT_LINES, Math.floor(rows / 2) - PROMPT_FOOTER_LINES) : void 0, handleInputClick = import_react257.useCallback((e) => {
    if (!input || isSearchingHistory)
      return;
    let c3 = Cursor.fromText(input, textInputColumns, cursorOffset), viewportStart = c3.getViewportStartLine(maxVisibleLines), offset = c3.measuredText.getOffsetFromPosition({
      line: e.localRow + viewportStart,
      column: e.localCol
    });
    setCursorOffset(offset);
  }, [input, textInputColumns, isSearchingHistory, cursorOffset, maxVisibleLines]), handleOpenTasksDialog = import_react257.useCallback((taskId) => setShowBashesDialog(taskId ?? !0), [setShowBashesDialog]), placeholder = showPromptSuggestion && promptSuggestion ? promptSuggestion : defaultPlaceholder, isInputWrapped = import_react257.useMemo(() => input.includes(`
`), [input]), handleModelSelect = import_react257.useCallback((model, _effort) => {
    let wasFastModeDisabled = !1;
    setAppState((prev) => {
      return wasFastModeDisabled = isFastModeEnabled() && !isFastModeSupportedByModel(model) && !!prev.fastMode, {
        ...prev,
        mainLoopModel: model,
        mainLoopModelForSession: null,
        ...wasFastModeDisabled && {
          fastMode: !1
        }
      };
    }), setShowModelPicker(!1);
    let effectiveFastMode = (isFastMode ?? !1) && !wasFastModeDisabled, message = `Model set to ${modelDisplayString(model)}`;
    if (isBilledAsExtraUsage(model, effectiveFastMode, isOpus1mMergeEnabled()))
      message += " \xB7 Billed as extra usage";
    if (wasFastModeDisabled)
      message += " \xB7 Fast mode OFF";
    addNotification({
      key: "model-switched",
      jsx: /* @__PURE__ */ jsx_dev_runtime434.jsxDEV(ThemedText, {
        children: message
      }, void 0, !1, void 0, this),
      priority: "immediate",
      timeoutMs: 3000
    }), logEvent("tengu_model_picker_hotkey", {
      model
    });
  }, [setAppState, addNotification, isFastMode]), handleModelCancel = import_react257.useCallback(() => {
    setShowModelPicker(!1);
  }, []), modelPickerElement = import_react257.useMemo(() => {
    if (!showModelPicker)
      return null;
    return /* @__PURE__ */ jsx_dev_runtime434.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginTop: 1,
      children: /* @__PURE__ */ jsx_dev_runtime434.jsxDEV(ModelPicker, {
        initial: mainLoopModel_,
        sessionModel: mainLoopModelForSession,
        onSelect: handleModelSelect,
        onCancel: handleModelCancel,
        isStandaloneCommand: !0,
        showFastModeNotice: isFastModeEnabled() && isFastMode && isFastModeSupportedByModel(mainLoopModel_) && isFastModeAvailable()
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this);
  }, [showModelPicker, mainLoopModel_, mainLoopModelForSession, handleModelSelect, handleModelCancel]), handleFastModeSelect = import_react257.useCallback((result) => {
    if (setShowFastModePicker(!1), result)
      addNotification({
        key: "fast-mode-toggled",
        jsx: /* @__PURE__ */ jsx_dev_runtime434.jsxDEV(ThemedText, {
          children: result
        }, void 0, !1, void 0, this),
        priority: "immediate",
        timeoutMs: 3000
      });
  }, [addNotification]), fastModePickerElement = import_react257.useMemo(() => {
    if (!showFastModePicker)
      return null;
    return /* @__PURE__ */ jsx_dev_runtime434.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginTop: 1,
      children: /* @__PURE__ */ jsx_dev_runtime434.jsxDEV(FastModePicker, {
        onDone: handleFastModeSelect,
        unavailableReason: getFastModeUnavailableReason()
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this);
  }, [showFastModePicker, handleFastModeSelect]), handleThinkingSelect = import_react257.useCallback((enabled2) => {
    setAppState((prev) => ({
      ...prev,
      thinkingEnabled: enabled2
    })), setShowThinkingToggle(!1), logEvent("tengu_thinking_toggled_hotkey", {
      enabled: enabled2
    }), addNotification({
      key: "thinking-toggled-hotkey",
      jsx: /* @__PURE__ */ jsx_dev_runtime434.jsxDEV(ThemedText, {
        color: enabled2 ? "suggestion" : void 0,
        dimColor: !enabled2,
        children: [
          "Thinking ",
          enabled2 ? "on" : "off"
        ]
      }, void 0, !0, void 0, this),
      priority: "immediate",
      timeoutMs: 3000
    });
  }, [setAppState, addNotification]), handleThinkingCancel = import_react257.useCallback(() => {
    setShowThinkingToggle(!1);
  }, []), thinkingToggleElement = import_react257.useMemo(() => {
    if (!showThinkingToggle)
      return null;
    return /* @__PURE__ */ jsx_dev_runtime434.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginTop: 1,
      children: /* @__PURE__ */ jsx_dev_runtime434.jsxDEV(ThinkingToggle, {
        currentValue: thinkingEnabled ?? !0,
        onSelect: handleThinkingSelect,
        onCancel: handleThinkingCancel,
        isMidConversation: messages.some((m4) => m4.type === "assistant")
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this);
  }, [showThinkingToggle, thinkingEnabled, handleThinkingSelect, handleThinkingCancel, messages.length]), autoModeOptInDialog = import_react257.useMemo(() => null, [showAutoModeOptIn, handleAutoModeOptInAccept, handleAutoModeOptInDecline]);
  if (useSetPromptOverlayDialog(isFullscreenEnvEnabled() ? autoModeOptInDialog : null), showBashesDialog)
    return /* @__PURE__ */ jsx_dev_runtime434.jsxDEV(BackgroundTasksDialog, {
      onDone: () => setShowBashesDialog(!1),
      toolUseContext: getToolUseContext(messages, [], new AbortController, mainLoopModel),
      initialDetailTaskId: typeof showBashesDialog === "string" ? showBashesDialog : void 0
    }, void 0, !1, void 0, this);
  if (isAgentSwarmsEnabled() && showTeamsDialog)
    return /* @__PURE__ */ jsx_dev_runtime434.jsxDEV(TeamsDialog, {
      initialTeams: cachedTeams,
      onDone: () => {
        setShowTeamsDialog(!1);
      }
    }, void 0, !1, void 0, this);
  if (modelPickerElement)
    return modelPickerElement;
  if (fastModePickerElement)
    return fastModePickerElement;
  if (thinkingToggleElement)
    return thinkingToggleElement;
  if (showBridgeDialog)
    return /* @__PURE__ */ jsx_dev_runtime434.jsxDEV(BridgeDialog, {
      onDone: () => {
        setShowBridgeDialog(!1), selectFooterItem(null);
      }
    }, void 0, !1, void 0, this);
  let baseProps = {
    multiline: !0,
    onSubmit,
    onChange,
    value: historyMatch ? getValueFromInput(typeof historyMatch === "string" ? historyMatch : historyMatch.display) : input,
    onHistoryUp: handleHistoryUp,
    onHistoryDown: handleHistoryDown,
    onHistoryReset: resetHistory,
    placeholder,
    onExit: onExit2,
    onExitMessage: (show, key3) => setExitMessage({
      show,
      key: key3
    }),
    onImagePaste,
    columns: textInputColumns,
    maxVisibleLines,
    disableCursorMovementForUpDownKeys: suggestions.length > 0 || !!footerItemSelected,
    disableEscapeDoublePress: suggestions.length > 0,
    cursorOffset,
    onChangeCursorOffset: setCursorOffset,
    onPaste: onTextPaste,
    onIsPastingChange: setIsPasting,
    focus: !isSearchingHistory && !isModalOverlayActive && !footerItemSelected,
    showCursor: !footerItemSelected && !isSearchingHistory && !cursorAtImageChip,
    argumentHint: commandArgumentHint,
    onUndo: canUndo ? () => {
      let previousState = undo();
      if (previousState)
        trackAndSetInput(previousState.text), setCursorOffset(previousState.cursorOffset), setPastedContents(previousState.pastedContents);
    } : void 0,
    highlights: combinedHighlights,
    inlineGhostText,
    inputFilter: lazySpaceInputFilter
  }, getBorderColor = () => {
    let modeColors = {
      bash: "bashBorder"
    };
    if (modeColors[mode])
      return modeColors[mode];
    if (isInProcessTeammate())
      return "promptBorder";
    let teammateColorName = getTeammateColor();
    if (teammateColorName && AGENT_COLORS.includes(teammateColorName))
      return AGENT_COLOR_TO_THEME_COLOR[teammateColorName];
    return "promptBorder";
  };
  if (isExternalEditorActive)
    return /* @__PURE__ */ jsx_dev_runtime434.jsxDEV(ThemedBox_default, {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderColor: getBorderColor(),
      borderStyle: "round",
      borderLeft: !1,
      borderRight: !1,
      borderBottom: !0,
      width: "100%",
      children: /* @__PURE__ */ jsx_dev_runtime434.jsxDEV(ThemedText, {
        dimColor: !0,
        italic: !0,
        children: "Save and close editor to continue..."
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this);
  let textInputElement = isVimModeEnabled() ? /* @__PURE__ */ jsx_dev_runtime434.jsxDEV(VimTextInput, {
    ...baseProps,
    initialMode: vimMode,
    onModeChange: setVimMode
  }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime434.jsxDEV(TextInput, {
    ...baseProps
  }, void 0, !1, void 0, this);
  return /* @__PURE__ */ jsx_dev_runtime434.jsxDEV(ThemedBox_default, {
    flexDirection: "column",
    marginTop: briefOwnsGap ? 0 : 1,
    children: [
      !isFullscreenEnvEnabled() && /* @__PURE__ */ jsx_dev_runtime434.jsxDEV(PromptInputQueuedCommands, {}, void 0, !1, void 0, this),
      hasSuppressedDialogs && /* @__PURE__ */ jsx_dev_runtime434.jsxDEV(ThemedBox_default, {
        marginTop: 1,
        marginLeft: 2,
        children: /* @__PURE__ */ jsx_dev_runtime434.jsxDEV(ThemedText, {
          dimColor: !0,
          children: "Waiting for permission\u2026"
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime434.jsxDEV(PromptInputStashNotice, {
        hasStash: stashedPrompt !== void 0
      }, void 0, !1, void 0, this),
      swarmBanner ? /* @__PURE__ */ jsx_dev_runtime434.jsxDEV(jsx_dev_runtime434.Fragment, {
        children: [
          /* @__PURE__ */ jsx_dev_runtime434.jsxDEV(ThemedText, {
            color: swarmBanner.bgColor,
            children: swarmBanner.text ? /* @__PURE__ */ jsx_dev_runtime434.jsxDEV(jsx_dev_runtime434.Fragment, {
              children: [
                "\u2500".repeat(Math.max(0, columns - stringWidth(swarmBanner.text) - 4)),
                /* @__PURE__ */ jsx_dev_runtime434.jsxDEV(ThemedText, {
                  backgroundColor: swarmBanner.bgColor,
                  color: "inverseText",
                  children: [
                    " ",
                    swarmBanner.text,
                    " "
                  ]
                }, void 0, !0, void 0, this),
                "\u2500\u2500"
              ]
            }, void 0, !0, void 0, this) : "\u2500".repeat(columns)
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime434.jsxDEV(ThemedBox_default, {
            flexDirection: "row",
            width: "100%",
            children: [
              /* @__PURE__ */ jsx_dev_runtime434.jsxDEV(PromptInputModeIndicator, {
                mode,
                isLoading,
                viewingAgentName,
                viewingAgentColor
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime434.jsxDEV(ThemedBox_default, {
                flexGrow: 1,
                flexShrink: 1,
                onClick: handleInputClick,
                children: textInputElement
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime434.jsxDEV(ThemedText, {
            color: swarmBanner.bgColor,
            children: "\u2500".repeat(columns)
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime434.jsxDEV(ThemedBox_default, {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        borderColor: getBorderColor(),
        borderStyle: "round",
        borderLeft: !1,
        borderRight: !1,
        borderBottom: !0,
        width: "100%",
        borderText: buildBorderText(showFastIcon ?? !1, showFastIconHint, fastModeCooldown),
        children: [
          /* @__PURE__ */ jsx_dev_runtime434.jsxDEV(PromptInputModeIndicator, {
            mode,
            isLoading,
            viewingAgentName,
            viewingAgentColor
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime434.jsxDEV(ThemedBox_default, {
            flexGrow: 1,
            flexShrink: 1,
            onClick: handleInputClick,
            children: textInputElement
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime434.jsxDEV(PromptInputFooter_default, {
        apiKeyStatus,
        debug,
        exitMessage,
        vimMode: isVimModeEnabled() ? vimMode : void 0,
        mode,
        autoUpdaterResult,
        isAutoUpdating,
        verbose,
        onAutoUpdaterResult,
        onChangeIsUpdating: setIsAutoUpdating,
        suggestions,
        selectedSuggestion,
        maxColumnWidth,
        toolPermissionContext: effectiveToolPermissionContext,
        helpOpen,
        suppressHint: input.length > 0,
        isLoading,
        tasksSelected,
        teamsSelected,
        bridgeSelected,
        tmuxSelected,
        teammateFooterIndex,
        ideSelection,
        mcpClients,
        isPasting,
        isInputWrapped,
        messages,
        isSearching: isSearchingHistory,
        historyQuery,
        setHistoryQuery,
        historyFailedMatch,
        onOpenTasksDialog: isFullscreenEnvEnabled() ? handleOpenTasksDialog : void 0
      }, void 0, !1, void 0, this),
      isFullscreenEnvEnabled() ? null : autoModeOptInDialog,
      isFullscreenEnvEnabled() ? /* @__PURE__ */ jsx_dev_runtime434.jsxDEV(ThemedBox_default, {
        position: "absolute",
        marginTop: briefOwnsGap ? -2 : -1,
        height: suggestions.length === 0 && !showAutoModeOptIn ? 1 : 0,
        width: "100%",
        paddingLeft: 2,
        paddingRight: 1,
        flexDirection: "column",
        justifyContent: "flex-end",
        overflow: "hidden",
        children: /* @__PURE__ */ jsx_dev_runtime434.jsxDEV(Notifications, {
          apiKeyStatus,
          autoUpdaterResult,
          debug,
          isAutoUpdating,
          verbose,
          messages,
          onAutoUpdaterResult,
          onChangeIsUpdating: setIsAutoUpdating,
          ideSelection,
          mcpClients,
          isInputWrapped
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this) : null
    ]
  }, void 0, !0, void 0, this);
}
