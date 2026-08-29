// Original: src/hooks/useHistorySearch.ts
function useHistorySearch(onAcceptHistory, currentInput, onInputChange, onCursorChange, currentCursorOffset, onModeChange, currentMode, isSearching, setIsSearching, setPastedContents, currentPastedContents) {
  let [historyQuery, setHistoryQuery] = import_react235.useState(""), [historyFailedMatch, setHistoryFailedMatch] = import_react235.useState(!1), [originalInput, setOriginalInput] = import_react235.useState(""), [originalCursorOffset, setOriginalCursorOffset] = import_react235.useState(0), [originalMode, setOriginalMode] = import_react235.useState("prompt"), [originalPastedContents, setOriginalPastedContents] = import_react235.useState({}), [historyMatch, setHistoryMatch] = import_react235.useState(void 0), historyReader = import_react235.useRef(void 0), seenPrompts = import_react235.useRef(/* @__PURE__ */ new Set), searchAbortController = import_react235.useRef(null), closeHistoryReader = import_react235.useCallback(() => {
    if (historyReader.current)
      historyReader.current.return(void 0), historyReader.current = void 0;
  }, []), reset4 = import_react235.useCallback(() => {
    setIsSearching(!1), setHistoryQuery(""), setHistoryFailedMatch(!1), setOriginalInput(""), setOriginalCursorOffset(0), setOriginalMode("prompt"), setOriginalPastedContents({}), setHistoryMatch(void 0), closeHistoryReader(), seenPrompts.current.clear();
  }, [setIsSearching, closeHistoryReader]), searchHistory = import_react235.useCallback(async (resume2, signal) => {
    if (!isSearching)
      return;
    if (historyQuery.length === 0) {
      closeHistoryReader(), seenPrompts.current.clear(), setHistoryMatch(void 0), setHistoryFailedMatch(!1), onInputChange(originalInput), onCursorChange(originalCursorOffset), onModeChange(originalMode), setPastedContents(originalPastedContents);
      return;
    }
    if (!resume2)
      closeHistoryReader(), historyReader.current = makeHistoryReader(), seenPrompts.current.clear();
    if (!historyReader.current)
      return;
    while (!0) {
      if (signal?.aborted)
        return;
      let item = await historyReader.current.next();
      if (item.done) {
        setHistoryFailedMatch(!0);
        return;
      }
      let display = item.value.display, matchPosition = display.lastIndexOf(historyQuery);
      if (matchPosition !== -1 && !seenPrompts.current.has(display)) {
        seenPrompts.current.add(display), setHistoryMatch(item.value), setHistoryFailedMatch(!1);
        let mode = getModeFromInput(display);
        onModeChange(mode), onInputChange(display), setPastedContents(item.value.pastedContents);
        let cleanMatchPosition = getValueFromInput(display).lastIndexOf(historyQuery);
        onCursorChange(cleanMatchPosition !== -1 ? cleanMatchPosition : matchPosition);
        return;
      }
    }
  }, [
    isSearching,
    historyQuery,
    closeHistoryReader,
    onInputChange,
    onCursorChange,
    onModeChange,
    setPastedContents,
    originalInput,
    originalCursorOffset,
    originalMode,
    originalPastedContents
  ]), handleStartSearch = import_react235.useCallback(() => {
    setIsSearching(!0), setOriginalInput(currentInput), setOriginalCursorOffset(currentCursorOffset), setOriginalMode(currentMode), setOriginalPastedContents(currentPastedContents), historyReader.current = makeHistoryReader(), seenPrompts.current.clear();
  }, [
    setIsSearching,
    currentInput,
    currentCursorOffset,
    currentMode,
    currentPastedContents
  ]), handleNextMatch = import_react235.useCallback(() => {
    searchHistory(!0);
  }, [searchHistory]), handleAccept = import_react235.useCallback(() => {
    if (historyMatch) {
      let mode = getModeFromInput(historyMatch.display), value = getValueFromInput(historyMatch.display);
      onInputChange(value), onModeChange(mode), setPastedContents(historyMatch.pastedContents);
    } else
      setPastedContents(originalPastedContents);
    reset4();
  }, [
    historyMatch,
    onInputChange,
    onModeChange,
    setPastedContents,
    originalPastedContents,
    reset4
  ]), handleCancel = import_react235.useCallback(() => {
    onInputChange(originalInput), onCursorChange(originalCursorOffset), setPastedContents(originalPastedContents), reset4();
  }, [
    onInputChange,
    onCursorChange,
    setPastedContents,
    originalInput,
    originalCursorOffset,
    originalPastedContents,
    reset4
  ]), handleExecute = import_react235.useCallback(() => {
    if (historyQuery.length === 0)
      onAcceptHistory({
        display: originalInput,
        pastedContents: originalPastedContents
      });
    else if (historyMatch) {
      let mode = getModeFromInput(historyMatch.display), value = getValueFromInput(historyMatch.display);
      onModeChange(mode), onAcceptHistory({
        display: value,
        pastedContents: historyMatch.pastedContents
      });
    }
    reset4();
  }, [
    historyQuery,
    historyMatch,
    onAcceptHistory,
    onModeChange,
    originalInput,
    originalPastedContents,
    reset4
  ]);
  useKeybinding("history:search", handleStartSearch, {
    context: "Global",
    isActive: !isSearching
  });
  let historySearchHandlers = import_react235.useMemo(() => ({
    "historySearch:next": handleNextMatch,
    "historySearch:accept": handleAccept,
    "historySearch:cancel": handleCancel,
    "historySearch:execute": handleExecute
  }), [handleNextMatch, handleAccept, handleCancel, handleExecute]);
  useKeybindings(historySearchHandlers, {
    context: "HistorySearch",
    isActive: isSearching
  });
  let handleKeyDown = (e) => {
    if (!isSearching)
      return;
    if (e.key === "backspace" && historyQuery === "")
      e.preventDefault(), handleCancel();
  };
  use_input_default((_input, _key, event) => {
    handleKeyDown(new KeyboardEvent(event.keypress));
  }, { isActive: isSearching });
  let searchHistoryRef = import_react235.useRef(searchHistory);
  return searchHistoryRef.current = searchHistory, import_react235.useEffect(() => {
    searchAbortController.current?.abort();
    let controller = new AbortController;
    return searchAbortController.current = controller, searchHistoryRef.current(!1, controller.signal), () => {
      controller.abort();
    };
  }, [historyQuery]), {
    historyQuery,
    setHistoryQuery,
    historyMatch,
    historyFailedMatch,
    handleKeyDown
  };
}
var import_react235;
var init_useHistorySearch = __esm(() => {
  init_history();
  init_keyboard_event();
  init_ink2();
  init_useKeybinding();
  import_react235 = __toESM(require_react_development(), 1);
});
