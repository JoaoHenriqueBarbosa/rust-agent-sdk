// Original: src/hooks/useArrowKeyHistory.tsx
async function loadHistoryEntries(minCount, modeFilter) {
  let target = Math.ceil(minCount / HISTORY_CHUNK_SIZE) * HISTORY_CHUNK_SIZE;
  if (pendingLoad && pendingLoadTarget >= target && pendingLoadModeFilter === modeFilter)
    return pendingLoad;
  if (pendingLoad)
    await pendingLoad;
  pendingLoadTarget = target, pendingLoadModeFilter = modeFilter, pendingLoad = (async () => {
    let entries2 = [], loaded = 0;
    for await (let entry of getHistory()) {
      if (modeFilter) {
        if (getModeFromInput(entry.display) !== modeFilter)
          continue;
      }
      if (entries2.push(entry), loaded++, loaded >= pendingLoadTarget)
        break;
    }
    return entries2;
  })();
  try {
    return await pendingLoad;
  } finally {
    pendingLoad = null, pendingLoadTarget = 0, pendingLoadModeFilter = void 0;
  }
}
function useArrowKeyHistory(onSetInput, currentInput, pastedContents, setCursorOffset, currentMode) {
  let [historyIndex, setHistoryIndex] = import_react234.useState(0), [lastShownHistoryEntry, setLastShownHistoryEntry] = import_react234.useState(void 0), hasShownSearchHintRef = import_react234.useRef(!1), {
    addNotification,
    removeNotification
  } = useNotifications(), historyCache = import_react234.useRef([]), historyCacheModeFilter = import_react234.useRef(void 0), historyIndexRef = import_react234.useRef(0), initialModeFilterRef = import_react234.useRef(void 0), currentInputRef = import_react234.useRef(currentInput), pastedContentsRef = import_react234.useRef(pastedContents), currentModeRef = import_react234.useRef(currentMode);
  currentInputRef.current = currentInput, pastedContentsRef.current = pastedContents, currentModeRef.current = currentMode;
  let setInputWithCursor = import_react234.useCallback((value, mode, contents, cursorToStart = !1) => {
    onSetInput(value, mode, contents), setCursorOffset?.(cursorToStart ? 0 : value.length);
  }, [onSetInput, setCursorOffset]), updateInput = import_react234.useCallback((input, cursorToStart_0 = !1) => {
    if (!input || !input.display)
      return;
    let mode_0 = getModeFromInput(input.display), value_0 = mode_0 === "bash" ? input.display.slice(1) : input.display;
    setInputWithCursor(value_0, mode_0, input.pastedContents ?? {}, cursorToStart_0);
  }, [setInputWithCursor]), showSearchHint = import_react234.useCallback(() => {
    addNotification({
      key: "search-history-hint",
      jsx: /* @__PURE__ */ jsx_dev_runtime412.jsxDEV(ThemedText, {
        dimColor: !0,
        children: /* @__PURE__ */ jsx_dev_runtime412.jsxDEV(ConfigurableShortcutHint, {
          action: "history:search",
          context: "Global",
          fallback: "ctrl+r",
          description: "search history"
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this),
      priority: "immediate",
      timeoutMs: FOOTER_TEMPORARY_STATUS_TIMEOUT
    });
  }, [addNotification]), onHistoryUp = import_react234.useCallback(() => {
    let targetIndex = historyIndexRef.current;
    historyIndexRef.current++;
    let inputAtPress = currentInputRef.current, pastedContentsAtPress = pastedContentsRef.current, modeAtPress = currentModeRef.current;
    if (targetIndex === 0) {
      initialModeFilterRef.current = modeAtPress === "bash" ? modeAtPress : void 0;
      let hasInput = inputAtPress.trim() !== "";
      setLastShownHistoryEntry(hasInput ? {
        display: inputAtPress,
        pastedContents: pastedContentsAtPress,
        mode: modeAtPress
      } : void 0);
    }
    let modeFilter = initialModeFilterRef.current;
    (async () => {
      let neededCount = targetIndex + 1;
      if (historyCacheModeFilter.current !== modeFilter)
        historyCache.current = [], historyCacheModeFilter.current = modeFilter, historyIndexRef.current = 0;
      if (historyCache.current.length < neededCount) {
        let entries2 = await loadHistoryEntries(neededCount, modeFilter);
        if (entries2.length > historyCache.current.length)
          historyCache.current = entries2;
      }
      if (targetIndex >= historyCache.current.length) {
        historyIndexRef.current--;
        return;
      }
      let newIndex = targetIndex + 1;
      if (setHistoryIndex(newIndex), updateInput(historyCache.current[targetIndex], !0), newIndex >= 2 && !hasShownSearchHintRef.current)
        hasShownSearchHintRef.current = !0, showSearchHint();
    })();
  }, [updateInput, showSearchHint]), onHistoryDown = import_react234.useCallback(() => {
    let currentIndex = historyIndexRef.current;
    if (currentIndex > 1)
      historyIndexRef.current--, setHistoryIndex(currentIndex - 1), updateInput(historyCache.current[currentIndex - 2]);
    else if (currentIndex === 1)
      if (historyIndexRef.current = 0, setHistoryIndex(0), lastShownHistoryEntry) {
        let savedMode = lastShownHistoryEntry.mode;
        if (savedMode)
          setInputWithCursor(lastShownHistoryEntry.display, savedMode, lastShownHistoryEntry.pastedContents ?? {});
        else
          updateInput(lastShownHistoryEntry);
      } else
        setInputWithCursor("", initialModeFilterRef.current ?? "prompt", {});
    return currentIndex <= 0;
  }, [lastShownHistoryEntry, updateInput, setInputWithCursor]), resetHistory = import_react234.useCallback(() => {
    setLastShownHistoryEntry(void 0), setHistoryIndex(0), historyIndexRef.current = 0, initialModeFilterRef.current = void 0, removeNotification("search-history-hint"), historyCache.current = [], historyCacheModeFilter.current = void 0;
  }, [removeNotification]), dismissSearchHint = import_react234.useCallback(() => {
    removeNotification("search-history-hint");
  }, [removeNotification]);
  return {
    historyIndex,
    setHistoryIndex,
    onHistoryUp,
    onHistoryDown,
    resetHistory,
    dismissSearchHint
  };
}
var import_react234, jsx_dev_runtime412, HISTORY_CHUNK_SIZE = 10, pendingLoad = null, pendingLoadTarget = 0, pendingLoadModeFilter = void 0;
var init_useArrowKeyHistory = __esm(() => {
  init_notifications();
  init_ConfigurableShortcutHint();
  init_Notifications();
  init_history();
  init_ink2();
  import_react234 = __toESM(require_react_development(), 1), jsx_dev_runtime412 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
