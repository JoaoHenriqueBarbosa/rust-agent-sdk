// function: useTypeahead
function useTypeahead({
  commands: commands7,
  onInputChange,
  onSubmit,
  setCursorOffset,
  input,
  cursorOffset,
  mode,
  agents: agents2,
  setSuggestionsState,
  suggestionsState: {
    suggestions,
    selectedSuggestion,
    commandArgumentHint
  },
  suppressSuggestions = !1,
  markAccepted,
  onModeChange
}) {
  let {
    addNotification
  } = useNotifications(), thinkingToggleShortcut = useShortcutDisplay("chat:thinkingToggle", "Chat", "alt+t"), [suggestionType, setSuggestionType] = import_react238.useState("none"), allCommandsMaxWidth = import_react238.useMemo(() => {
    let visibleCommands = commands7.filter((cmd) => !cmd.isHidden);
    if (visibleCommands.length === 0)
      return;
    return Math.max(...visibleCommands.map((cmd) => getCommandName(cmd).length)) + 6;
  }, [commands7]), [maxColumnWidth, setMaxColumnWidth] = import_react238.useState(void 0), mcpResources = useAppState((s2) => s2.mcp.resources), store = useAppStateStore(), promptSuggestion = useAppState((s2) => s2.promptSuggestion), isViewingTeammate = useAppState((s2) => !!s2.viewingAgentTaskId), keybindingContext = useOptionalKeybindingContext(), [inlineGhostText, setInlineGhostText] = import_react238.useState(void 0), syncPromptGhostText = import_react238.useMemo(() => {
    if (mode !== "prompt" || suppressSuggestions)
      return;
    let midInputCommand = findMidInputSlashCommand(input, cursorOffset);
    if (!midInputCommand)
      return;
    let match = getBestCommandMatch(midInputCommand.partialCommand, commands7);
    if (!match)
      return;
    return {
      text: match.suffix,
      fullCommand: match.fullCommand,
      insertPosition: midInputCommand.startPos + 1 + midInputCommand.partialCommand.length
    };
  }, [input, cursorOffset, mode, commands7, suppressSuggestions]), effectiveGhostText = suppressSuggestions ? void 0 : mode === "prompt" ? syncPromptGhostText : inlineGhostText, cursorOffsetRef = import_react238.useRef(cursorOffset);
  cursorOffsetRef.current = cursorOffset;
  let latestSearchTokenRef = import_react238.useRef(null), prevInputRef = import_react238.useRef(""), latestPathTokenRef = import_react238.useRef(""), latestBashInputRef = import_react238.useRef(""), latestSlackTokenRef = import_react238.useRef(""), suggestionsRef = import_react238.useRef(suggestions);
  suggestionsRef.current = suggestions;
  let dismissedForInputRef = import_react238.useRef(null), clearSuggestions = import_react238.useCallback(() => {
    setSuggestionsState(() => ({
      commandArgumentHint: void 0,
      suggestions: [],
      selectedSuggestion: -1
    })), setSuggestionType("none"), setMaxColumnWidth(void 0), setInlineGhostText(void 0);
  }, [setSuggestionsState]), fetchFileSuggestions = import_react238.useCallback(async (searchToken, isAtSymbol = !1) => {
    latestSearchTokenRef.current = searchToken;
    let combinedItems = await generateUnifiedSuggestions(searchToken, mcpResources, agents2, isAtSymbol);
    if (latestSearchTokenRef.current !== searchToken)
      return;
    if (combinedItems.length === 0) {
      setSuggestionsState(() => ({
        commandArgumentHint: void 0,
        suggestions: [],
        selectedSuggestion: -1
      })), setSuggestionType("none"), setMaxColumnWidth(void 0);
      return;
    }
    setSuggestionsState((prev) => ({
      commandArgumentHint: void 0,
      suggestions: combinedItems,
      selectedSuggestion: getPreservedSelection(prev.suggestions, prev.selectedSuggestion, combinedItems)
    })), setSuggestionType(combinedItems.length > 0 ? "file" : "none"), setMaxColumnWidth(void 0);
  }, [mcpResources, setSuggestionsState, setSuggestionType, setMaxColumnWidth, agents2]);
  import_react238.useEffect(() => {
    return startBackgroundCacheRefresh(), onIndexBuildComplete(() => {
      let token = latestSearchTokenRef.current;
      if (token !== null)
        latestSearchTokenRef.current = null, fetchFileSuggestions(token, token === "");
    });
  }, [fetchFileSuggestions]);
  let debouncedFetchFileSuggestions = useDebounceCallback(fetchFileSuggestions, 50), fetchSlackChannels = import_react238.useCallback(async (partial2) => {
    latestSlackTokenRef.current = partial2;
    let channels = await getSlackChannelSuggestions(store.getState().mcp.clients, partial2);
    if (latestSlackTokenRef.current !== partial2)
      return;
    setSuggestionsState((prev) => ({
      commandArgumentHint: void 0,
      suggestions: channels,
      selectedSuggestion: getPreservedSelection(prev.suggestions, prev.selectedSuggestion, channels)
    })), setSuggestionType(channels.length > 0 ? "slack-channel" : "none"), setMaxColumnWidth(void 0);
  }, [setSuggestionsState]), debouncedFetchSlackChannels = useDebounceCallback(fetchSlackChannels, 150), updateSuggestions = import_react238.useCallback(async (value, inputCursorOffset) => {
    let effectiveCursorOffset = inputCursorOffset ?? cursorOffsetRef.current;
    if (suppressSuggestions) {
      debouncedFetchFileSuggestions.cancel(), clearSuggestions();
      return;
    }
    if (mode === "prompt") {
      let midInputCommand = findMidInputSlashCommand(value, effectiveCursorOffset);
      if (midInputCommand) {
        if (getBestCommandMatch(midInputCommand.partialCommand, commands7)) {
          setSuggestionsState(() => ({
            commandArgumentHint: void 0,
            suggestions: [],
            selectedSuggestion: -1
          })), setSuggestionType("none"), setMaxColumnWidth(void 0);
          return;
        }
      }
    }
    if (mode === "bash" && value.trim()) {
      latestBashInputRef.current = value;
      let historyMatch = await getShellHistoryCompletion(value);
      if (latestBashInputRef.current !== value)
        return;
      if (historyMatch) {
        setInlineGhostText({
          text: historyMatch.suffix,
          fullCommand: historyMatch.fullCommand,
          insertPosition: value.length
        }), setSuggestionsState(() => ({
          commandArgumentHint: void 0,
          suggestions: [],
          selectedSuggestion: -1
        })), setSuggestionType("none"), setMaxColumnWidth(void 0);
        return;
      } else
        setInlineGhostText(void 0);
    }
    let atMatch = mode !== "bash" ? value.substring(0, effectiveCursorOffset).match(/(^|\s)@([\w-]*)$/) : null;
    if (atMatch) {
      let partialName = (atMatch[2] ?? "").toLowerCase(), state4 = store.getState(), members = [], seen = /* @__PURE__ */ new Set;
      if (isAgentSwarmsEnabled() && state4.teamContext)
        for (let t2 of Object.values(state4.teamContext.teammates ?? {})) {
          if (t2.name === TEAM_LEAD_NAME)
            continue;
          if (!t2.name.toLowerCase().startsWith(partialName))
            continue;
          seen.add(t2.name), members.push({
            id: `dm-${t2.name}`,
            displayText: `@${t2.name}`,
            description: "send message"
          });
        }
      for (let [name3, agentId] of state4.agentNameRegistry) {
        if (seen.has(name3))
          continue;
        if (!name3.toLowerCase().startsWith(partialName))
          continue;
        let status2 = state4.tasks[agentId]?.status;
        members.push({
          id: `dm-${name3}`,
          displayText: `@${name3}`,
          description: status2 ? `send message \xB7 ${status2}` : "send message"
        });
      }
      if (members.length > 0) {
        debouncedFetchFileSuggestions.cancel(), setSuggestionsState((prev) => ({
          commandArgumentHint: void 0,
          suggestions: members,
          selectedSuggestion: getPreservedSelection(prev.suggestions, prev.selectedSuggestion, members)
        })), setSuggestionType("agent"), setMaxColumnWidth(void 0);
        return;
      }
    }
    if (mode === "prompt") {
      let hashMatch = value.substring(0, effectiveCursorOffset).match(HASH_CHANNEL_RE);
      if (hashMatch && hasSlackMcpServer(store.getState().mcp.clients)) {
        debouncedFetchSlackChannels(hashMatch[2]);
        return;
      } else if (suggestionType === "slack-channel")
        debouncedFetchSlackChannels.cancel(), clearSuggestions();
    }
    let hasAtSymbol = value.substring(0, effectiveCursorOffset).match(HAS_AT_SYMBOL_RE), isAtEndWithWhitespace = effectiveCursorOffset === value.length && effectiveCursorOffset > 0 && value.length > 0 && value[effectiveCursorOffset - 1] === " ";
    if (mode === "prompt" && isCommandInput(value) && effectiveCursorOffset > 0) {
      let parsedCommand = extractCommandNameAndArgs(value);
      if (parsedCommand && parsedCommand.commandName === "add-dir" && parsedCommand.args) {
        let {
          args
        } = parsedCommand;
        if (args.match(/\s+$/)) {
          debouncedFetchFileSuggestions.cancel(), clearSuggestions();
          return;
        }
        let dirSuggestions = await getDirectoryCompletions(args);
        if (dirSuggestions.length > 0) {
          setSuggestionsState((prev) => ({
            suggestions: dirSuggestions,
            selectedSuggestion: getPreservedSelection(prev.suggestions, prev.selectedSuggestion, dirSuggestions),
            commandArgumentHint: void 0
          })), setSuggestionType("directory");
          return;
        }
        debouncedFetchFileSuggestions.cancel(), clearSuggestions();
        return;
      }
      if (parsedCommand && parsedCommand.commandName === "resume" && parsedCommand.args !== void 0 && value.includes(" ")) {
        let {
          args
        } = parsedCommand, suggestions2 = (await searchSessionsByCustomTitle(args, {
          limit: 10
        })).map((log4) => {
          let sessionId = getSessionIdFromLog(log4);
          return {
            id: `resume-title-${sessionId}`,
            displayText: log4.customTitle,
            description: formatLogMetadata(log4),
            metadata: {
              sessionId
            }
          };
        });
        if (suggestions2.length > 0) {
          setSuggestionsState((prev) => ({
            suggestions: suggestions2,
            selectedSuggestion: getPreservedSelection(prev.suggestions, prev.selectedSuggestion, suggestions2),
            commandArgumentHint: void 0
          })), setSuggestionType("custom-title");
          return;
        }
        clearSuggestions();
        return;
      }
    }
    if (mode === "prompt" && isCommandInput(value) && effectiveCursorOffset > 0 && !hasCommandWithArguments(isAtEndWithWhitespace, value)) {
      let commandArgumentHint2 = void 0;
      if (value.length > 1) {
        let spaceIndex = value.indexOf(" "), commandName = spaceIndex === -1 ? value.slice(1) : value.slice(1, spaceIndex), hasRealArguments = spaceIndex !== -1 && value.slice(spaceIndex + 1).trim().length > 0, hasExactlyOneTrailingSpace = spaceIndex !== -1 && value.length === spaceIndex + 1;
        if (spaceIndex !== -1) {
          let exactMatch = commands7.find((cmd) => getCommandName(cmd) === commandName);
          if (exactMatch || hasRealArguments) {
            if (exactMatch?.argumentHint && hasExactlyOneTrailingSpace)
              commandArgumentHint2 = exactMatch.argumentHint;
            else if (exactMatch?.type === "prompt" && exactMatch.argNames?.length && value.endsWith(" ")) {
              let argsText = value.slice(spaceIndex + 1), typedArgs = parseArguments2(argsText);
              commandArgumentHint2 = generateProgressiveArgumentHint(exactMatch.argNames, typedArgs);
            }
            setSuggestionsState(() => ({
              commandArgumentHint: commandArgumentHint2,
              suggestions: [],
              selectedSuggestion: -1
            })), setSuggestionType("none"), setMaxColumnWidth(void 0);
            return;
          }
        }
      }
      let commandItems = generateCommandSuggestions(value, commands7);
      if (setSuggestionsState(() => ({
        commandArgumentHint: commandArgumentHint2,
        suggestions: commandItems,
        selectedSuggestion: commandItems.length > 0 ? 0 : -1
      })), setSuggestionType(commandItems.length > 0 ? "command" : "none"), commandItems.length > 0)
        setMaxColumnWidth(allCommandsMaxWidth);
      return;
    }
    if (suggestionType === "command")
      debouncedFetchFileSuggestions.cancel(), clearSuggestions();
    else if (isCommandInput(value) && hasCommandWithArguments(isAtEndWithWhitespace, value))
      setSuggestionsState((prev) => prev.commandArgumentHint ? {
        ...prev,
        commandArgumentHint: void 0
      } : prev);
    if (suggestionType === "custom-title")
      clearSuggestions();
    if (suggestionType === "agent" && suggestionsRef.current.some((s2) => s2.id?.startsWith("dm-"))) {
      if (!value.substring(0, effectiveCursorOffset).match(/(^|\s)@([\w-]*)$/))
        clearSuggestions();
    }
    if (hasAtSymbol && mode !== "bash") {
      let completionToken = extractCompletionToken(value, effectiveCursorOffset, !0);
      if (completionToken && completionToken.token.startsWith("@")) {
        let searchToken = extractSearchToken(completionToken);
        if (isPathLikeToken(searchToken)) {
          latestPathTokenRef.current = searchToken;
          let pathSuggestions = await getPathCompletions(searchToken, {
            maxResults: 10
          });
          if (latestPathTokenRef.current !== searchToken)
            return;
          if (pathSuggestions.length > 0) {
            setSuggestionsState((prev) => ({
              suggestions: pathSuggestions,
              selectedSuggestion: getPreservedSelection(prev.suggestions, prev.selectedSuggestion, pathSuggestions),
              commandArgumentHint: void 0
            })), setSuggestionType("directory");
            return;
          }
        }
        if (latestSearchTokenRef.current === searchToken)
          return;
        debouncedFetchFileSuggestions(searchToken, !0);
        return;
      }
    }
    if (suggestionType === "file") {
      let completionToken = extractCompletionToken(value, effectiveCursorOffset, !0);
      if (completionToken) {
        let searchToken = extractSearchToken(completionToken);
        if (latestSearchTokenRef.current === searchToken)
          return;
        debouncedFetchFileSuggestions(searchToken, !1);
      } else
        debouncedFetchFileSuggestions.cancel(), clearSuggestions();
    }
    if (suggestionType === "shell") {
      let inputSnapshot = suggestionsRef.current[0]?.metadata?.inputSnapshot;
      if (mode !== "bash" || value !== inputSnapshot)
        debouncedFetchFileSuggestions.cancel(), clearSuggestions();
    }
  }, [
    suggestionType,
    commands7,
    setSuggestionsState,
    clearSuggestions,
    debouncedFetchFileSuggestions,
    debouncedFetchSlackChannels,
    mode,
    suppressSuggestions,
    allCommandsMaxWidth
  ]);
  import_react238.useEffect(() => {
    if (dismissedForInputRef.current === input)
      return;
    if (prevInputRef.current !== input)
      prevInputRef.current = input, latestSearchTokenRef.current = null;
    dismissedForInputRef.current = null, updateSuggestions(input);
  }, [input, updateSuggestions]);
  let handleTab = import_react238.useCallback(async () => {
    if (effectiveGhostText) {
      if (mode === "bash") {
        onInputChange(effectiveGhostText.fullCommand), setCursorOffset(effectiveGhostText.fullCommand.length), setInlineGhostText(void 0);
        return;
      }
      let midInputCommand = findMidInputSlashCommand(input, cursorOffset);
      if (midInputCommand) {
        let before2 = input.slice(0, midInputCommand.startPos), after2 = input.slice(midInputCommand.startPos + midInputCommand.token.length), newInput = before2 + "/" + effectiveGhostText.fullCommand + " " + after2, newCursorOffset = midInputCommand.startPos + 1 + effectiveGhostText.fullCommand.length + 1;
        onInputChange(newInput), setCursorOffset(newCursorOffset);
        return;
      }
    }
    if (suggestions.length > 0) {
      debouncedFetchFileSuggestions.cancel(), debouncedFetchSlackChannels.cancel();
      let index2 = selectedSuggestion === -1 ? 0 : selectedSuggestion, suggestion = suggestions[index2];
      if (suggestionType === "command" && index2 < suggestions.length) {
        if (suggestion)
          applyCommandSuggestion(suggestion, !1, commands7, onInputChange, setCursorOffset, onSubmit), clearSuggestions();
      } else if (suggestionType === "custom-title" && suggestions.length > 0) {
        if (suggestion) {
          let newInput = buildResumeInputFromSuggestion(suggestion);
          onInputChange(newInput), setCursorOffset(newInput.length), clearSuggestions();
        }
      } else if (suggestionType === "directory" && suggestions.length > 0) {
        let suggestion2 = suggestions[index2];
        if (suggestion2) {
          let isInCommandContext = isCommandInput(input), newInput;
          if (isInCommandContext) {
            let spaceIndex = input.indexOf(" "), commandPart = input.slice(0, spaceIndex + 1), cmdSuffix = isPathMetadata(suggestion2.metadata) && suggestion2.metadata.type === "directory" ? "/" : " ";
            if (newInput = commandPart + suggestion2.id + cmdSuffix, onInputChange(newInput), setCursorOffset(newInput.length), isPathMetadata(suggestion2.metadata) && suggestion2.metadata.type === "directory")
              setSuggestionsState((prev) => ({
                ...prev,
                commandArgumentHint: void 0
              })), updateSuggestions(newInput, newInput.length);
            else
              clearSuggestions();
          } else {
            let completionToken = extractCompletionToken(input, cursorOffset, !0) ?? extractCompletionToken(input, cursorOffset, !1);
            if (completionToken) {
              let isDir = isPathMetadata(suggestion2.metadata) && suggestion2.metadata.type === "directory", result = applyDirectorySuggestion(input, suggestion2.id, completionToken.startPos, completionToken.token.length, isDir);
              if (newInput = result.newInput, onInputChange(newInput), setCursorOffset(result.cursorPos), isDir)
                setSuggestionsState((prev) => ({
                  ...prev,
                  commandArgumentHint: void 0
                })), updateSuggestions(newInput, result.cursorPos);
              else
                clearSuggestions();
            } else
              clearSuggestions();
          }
        }
      } else if (suggestionType === "shell" && suggestions.length > 0) {
        let suggestion2 = suggestions[index2];
        if (suggestion2) {
          let metadata = suggestion2.metadata;
          applyShellSuggestion(suggestion2, input, cursorOffset, onInputChange, setCursorOffset, metadata?.completionType), clearSuggestions();
        }
      } else if (suggestionType === "agent" && suggestions.length > 0 && suggestions[index2]?.id?.startsWith("dm-")) {
        let suggestion2 = suggestions[index2];
        if (suggestion2)
          applyTriggerSuggestion(suggestion2, input, cursorOffset, DM_MEMBER_RE, onInputChange, setCursorOffset), clearSuggestions();
      } else if (suggestionType === "slack-channel" && suggestions.length > 0) {
        let suggestion2 = suggestions[index2];
        if (suggestion2)
          applyTriggerSuggestion(suggestion2, input, cursorOffset, HASH_CHANNEL_RE, onInputChange, setCursorOffset), clearSuggestions();
      } else if (suggestionType === "file" && suggestions.length > 0) {
        let completionToken = extractCompletionToken(input, cursorOffset, !0);
        if (!completionToken) {
          clearSuggestions();
          return;
        }
        let commonPrefix = findLongestCommonPrefix(suggestions), hasAtPrefix = completionToken.token.startsWith("@"), effectiveTokenLength;
        if (completionToken.isQuoted)
          effectiveTokenLength = completionToken.token.slice(2).replace(/"$/, "").length;
        else if (hasAtPrefix)
          effectiveTokenLength = completionToken.token.length - 1;
        else
          effectiveTokenLength = completionToken.token.length;
        if (commonPrefix.length > effectiveTokenLength) {
          let replacementValue = formatReplacementValue({
            displayText: commonPrefix,
            mode,
            hasAtPrefix,
            needsQuotes: !1,
            isQuoted: completionToken.isQuoted,
            isComplete: !1
          });
          applyFileSuggestion(replacementValue, input, completionToken.token, completionToken.startPos, onInputChange, setCursorOffset), updateSuggestions(input.replace(completionToken.token, replacementValue), cursorOffset);
        } else if (index2 < suggestions.length) {
          let suggestion2 = suggestions[index2];
          if (suggestion2) {
            let needsQuotes = suggestion2.displayText.includes(" "), replacementValue = formatReplacementValue({
              displayText: suggestion2.displayText,
              mode,
              hasAtPrefix,
              needsQuotes,
              isQuoted: completionToken.isQuoted,
              isComplete: !0
            });
            applyFileSuggestion(replacementValue, input, completionToken.token, completionToken.startPos, onInputChange, setCursorOffset), clearSuggestions();
          }
        }
      }
    } else if (input.trim() !== "") {
      let suggestionType2, suggestionItems;
      if (mode === "bash") {
        suggestionType2 = "shell";
        let bashSuggestions = await generateBashSuggestions(input, cursorOffset);
        if (bashSuggestions.length === 1) {
          let suggestion = bashSuggestions[0];
          if (suggestion) {
            let metadata = suggestion.metadata;
            applyShellSuggestion(suggestion, input, cursorOffset, onInputChange, setCursorOffset, metadata?.completionType);
          }
          suggestionItems = [];
        } else
          suggestionItems = bashSuggestions;
      } else {
        suggestionType2 = "file";
        let completionInfo = extractCompletionToken(input, cursorOffset, !0);
        if (completionInfo) {
          let isAtSymbol = completionInfo.token.startsWith("@"), searchToken = isAtSymbol ? completionInfo.token.substring(1) : completionInfo.token;
          suggestionItems = await generateUnifiedSuggestions(searchToken, mcpResources, agents2, isAtSymbol);
        } else
          suggestionItems = [];
      }
      if (suggestionItems.length > 0)
        setSuggestionsState((prev) => ({
          commandArgumentHint: void 0,
          suggestions: suggestionItems,
          selectedSuggestion: getPreservedSelection(prev.suggestions, prev.selectedSuggestion, suggestionItems)
        })), setSuggestionType(suggestionType2), setMaxColumnWidth(void 0);
    }
  }, [suggestions, selectedSuggestion, input, suggestionType, commands7, mode, onInputChange, setCursorOffset, onSubmit, clearSuggestions, cursorOffset, updateSuggestions, mcpResources, setSuggestionsState, agents2, debouncedFetchFileSuggestions, debouncedFetchSlackChannels, effectiveGhostText]), handleEnter = import_react238.useCallback(() => {
    if (selectedSuggestion < 0 || suggestions.length === 0)
      return;
    let suggestion = suggestions[selectedSuggestion];
    if (suggestionType === "command" && selectedSuggestion < suggestions.length) {
      if (suggestion)
        applyCommandSuggestion(suggestion, !0, commands7, onInputChange, setCursorOffset, onSubmit), debouncedFetchFileSuggestions.cancel(), clearSuggestions();
    } else if (suggestionType === "custom-title" && selectedSuggestion < suggestions.length) {
      if (suggestion) {
        let newInput = buildResumeInputFromSuggestion(suggestion);
        onInputChange(newInput), setCursorOffset(newInput.length), onSubmit(newInput, !0), debouncedFetchFileSuggestions.cancel(), clearSuggestions();
      }
    } else if (suggestionType === "shell" && selectedSuggestion < suggestions.length) {
      let suggestion2 = suggestions[selectedSuggestion];
      if (suggestion2) {
        let metadata = suggestion2.metadata;
        applyShellSuggestion(suggestion2, input, cursorOffset, onInputChange, setCursorOffset, metadata?.completionType), debouncedFetchFileSuggestions.cancel(), clearSuggestions();
      }
    } else if (suggestionType === "agent" && selectedSuggestion < suggestions.length && suggestion?.id?.startsWith("dm-"))
      applyTriggerSuggestion(suggestion, input, cursorOffset, DM_MEMBER_RE, onInputChange, setCursorOffset), debouncedFetchFileSuggestions.cancel(), clearSuggestions();
    else if (suggestionType === "slack-channel" && selectedSuggestion < suggestions.length) {
      if (suggestion)
        applyTriggerSuggestion(suggestion, input, cursorOffset, HASH_CHANNEL_RE, onInputChange, setCursorOffset), debouncedFetchSlackChannels.cancel(), clearSuggestions();
    } else if (suggestionType === "file" && selectedSuggestion < suggestions.length) {
      let completionInfo = extractCompletionToken(input, cursorOffset, !0);
      if (completionInfo) {
        if (suggestion) {
          let hasAtPrefix = completionInfo.token.startsWith("@"), needsQuotes = suggestion.displayText.includes(" "), replacementValue = formatReplacementValue({
            displayText: suggestion.displayText,
            mode,
            hasAtPrefix,
            needsQuotes,
            isQuoted: completionInfo.isQuoted,
            isComplete: !0
          });
          applyFileSuggestion(replacementValue, input, completionInfo.token, completionInfo.startPos, onInputChange, setCursorOffset), debouncedFetchFileSuggestions.cancel(), clearSuggestions();
        }
      }
    } else if (suggestionType === "directory" && selectedSuggestion < suggestions.length) {
      if (suggestion) {
        if (isCommandInput(input)) {
          debouncedFetchFileSuggestions.cancel(), clearSuggestions();
          return;
        }
        let completionToken = extractCompletionToken(input, cursorOffset, !0) ?? extractCompletionToken(input, cursorOffset, !1);
        if (completionToken) {
          let isDir = isPathMetadata(suggestion.metadata) && suggestion.metadata.type === "directory", result = applyDirectorySuggestion(input, suggestion.id, completionToken.startPos, completionToken.token.length, isDir);
          onInputChange(result.newInput), setCursorOffset(result.cursorPos);
        }
        debouncedFetchFileSuggestions.cancel(), clearSuggestions();
      }
    }
  }, [suggestions, selectedSuggestion, suggestionType, commands7, input, cursorOffset, mode, onInputChange, setCursorOffset, onSubmit, clearSuggestions, debouncedFetchFileSuggestions, debouncedFetchSlackChannels]), handleAutocompleteAccept = import_react238.useCallback(() => {
    handleTab();
  }, [handleTab]), handleAutocompleteDismiss = import_react238.useCallback(() => {
    debouncedFetchFileSuggestions.cancel(), debouncedFetchSlackChannels.cancel(), clearSuggestions(), dismissedForInputRef.current = input;
  }, [debouncedFetchFileSuggestions, debouncedFetchSlackChannels, clearSuggestions, input]), handleAutocompletePrevious = import_react238.useCallback(() => {
    setSuggestionsState((prev) => ({
      ...prev,
      selectedSuggestion: prev.selectedSuggestion <= 0 ? suggestions.length - 1 : prev.selectedSuggestion - 1
    }));
  }, [suggestions.length, setSuggestionsState]), handleAutocompleteNext = import_react238.useCallback(() => {
    setSuggestionsState((prev) => ({
      ...prev,
      selectedSuggestion: prev.selectedSuggestion >= suggestions.length - 1 ? 0 : prev.selectedSuggestion + 1
    }));
  }, [suggestions.length, setSuggestionsState]), autocompleteHandlers = import_react238.useMemo(() => ({
    "autocomplete:accept": handleAutocompleteAccept,
    "autocomplete:dismiss": handleAutocompleteDismiss,
    "autocomplete:previous": handleAutocompletePrevious,
    "autocomplete:next": handleAutocompleteNext
  }), [handleAutocompleteAccept, handleAutocompleteDismiss, handleAutocompletePrevious, handleAutocompleteNext]), isAutocompleteActive = suggestions.length > 0 || !!effectiveGhostText, isModalOverlayActive = useIsModalOverlayActive();
  useRegisterOverlay("autocomplete", isAutocompleteActive), useRegisterKeybindingContext("Autocomplete", isAutocompleteActive), useKeybindings(autocompleteHandlers, {
    context: "Autocomplete",
    isActive: isAutocompleteActive && !isModalOverlayActive
  });
  function acceptSuggestionText(text2) {
    let detectedMode = getModeFromInput(text2);
    if (detectedMode !== "prompt" && onModeChange) {
      onModeChange(detectedMode);
      let stripped = getValueFromInput(text2);
      onInputChange(stripped), setCursorOffset(stripped.length);
    } else
      onInputChange(text2), setCursorOffset(text2.length);
  }
  let handleKeyDown = (e) => {
    if (e.key === "right" && !isViewingTeammate) {
      let { text: suggestionText, shownAt: suggestionShownAt } = promptSuggestion;
      if (suggestionText && suggestionShownAt > 0 && input === "") {
        markAccepted(), acceptSuggestionText(suggestionText), e.stopImmediatePropagation();
        return;
      }
    }
    if (e.key === "tab" && !e.shift) {
      if (suggestions.length > 0 || effectiveGhostText)
        return;
      let { text: suggestionText, shownAt: suggestionShownAt } = promptSuggestion;
      if (suggestionText && suggestionShownAt > 0 && input === "" && !isViewingTeammate) {
        e.preventDefault(), markAccepted(), acceptSuggestionText(suggestionText);
        return;
      }
      if (input.trim() === "")
        e.preventDefault(), addNotification({
          key: "thinking-toggle-hint",
          jsx: /* @__PURE__ */ jsx_dev_runtime413.jsxDEV(ThemedText, {
            dimColor: !0,
            children: [
              "Use ",
              thinkingToggleShortcut,
              " to toggle thinking"
            ]
          }, void 0, !0, void 0, this),
          priority: "immediate",
          timeoutMs: 3000
        });
      return;
    }
    if (suggestions.length === 0)
      return;
    let hasPendingChord = keybindingContext?.pendingChord != null;
    if (e.ctrl && e.key === "n" && !hasPendingChord) {
      e.preventDefault(), handleAutocompleteNext();
      return;
    }
    if (e.ctrl && e.key === "p" && !hasPendingChord) {
      e.preventDefault(), handleAutocompletePrevious();
      return;
    }
    if (e.key === "return" && !e.shift && !e.meta)
      e.preventDefault(), handleEnter();
  };
  return use_input_default((_input, _key, event) => {
    let kbEvent = new KeyboardEvent(event.keypress);
    if (handleKeyDown(kbEvent), kbEvent.didStopImmediatePropagation())
      event.stopImmediatePropagation();
  }), {
    suggestions,
    selectedSuggestion,
    suggestionType,
    maxColumnWidth,
    commandArgumentHint,
    inlineGhostText: effectiveGhostText,
    handleKeyDown
  };
}
