// Original: src/hooks/usePromptSuggestion.ts
function usePromptSuggestion({
  inputValue,
  isAssistantResponding
}) {
  let promptSuggestion = useAppState((s2) => s2.promptSuggestion), setAppState = useSetAppState(), isTerminalFocused = useTerminalFocus(), {
    text: suggestionText,
    promptId,
    shownAt,
    acceptedAt,
    generationRequestId
  } = promptSuggestion, suggestion = isAssistantResponding || inputValue.length > 0 ? null : suggestionText, isValidSuggestion = suggestionText && shownAt > 0, firstKeystrokeAt = import_react237.useRef(0), wasFocusedWhenShown = import_react237.useRef(!0), prevShownAt = import_react237.useRef(0);
  if (shownAt > 0 && shownAt !== prevShownAt.current)
    prevShownAt.current = shownAt, wasFocusedWhenShown.current = isTerminalFocused, firstKeystrokeAt.current = 0;
  else if (shownAt === 0)
    prevShownAt.current = 0;
  if (inputValue.length > 0 && firstKeystrokeAt.current === 0 && isValidSuggestion)
    firstKeystrokeAt.current = Date.now();
  let resetSuggestion = import_react237.useCallback(() => {
    abortSpeculation(setAppState), setAppState((prev) => ({
      ...prev,
      promptSuggestion: {
        text: null,
        promptId: null,
        shownAt: 0,
        acceptedAt: 0,
        generationRequestId: null
      }
    }));
  }, [setAppState]), markAccepted = import_react237.useCallback(() => {
    if (!isValidSuggestion)
      return;
    setAppState((prev) => ({
      ...prev,
      promptSuggestion: {
        ...prev.promptSuggestion,
        acceptedAt: Date.now()
      }
    }));
  }, [isValidSuggestion, setAppState]), markShown = import_react237.useCallback(() => {
    setAppState((prev) => {
      if (prev.promptSuggestion.shownAt !== 0 || !prev.promptSuggestion.text)
        return prev;
      return {
        ...prev,
        promptSuggestion: {
          ...prev.promptSuggestion,
          shownAt: Date.now()
        }
      };
    });
  }, [setAppState]), logOutcomeAtSubmission = import_react237.useCallback((finalInput, opts) => {
    if (!isValidSuggestion)
      return;
    let tabWasPressed = acceptedAt > shownAt, wasAccepted = tabWasPressed || finalInput === suggestionText, timeMs = wasAccepted ? acceptedAt || Date.now() : Date.now();
    if (logEvent("tengu_prompt_suggestion", {
      source: "cli",
      outcome: wasAccepted ? "accepted" : "ignored",
      prompt_id: promptId,
      ...generationRequestId && {
        generationRequestId
      },
      ...wasAccepted && {
        acceptMethod: tabWasPressed ? "tab" : "enter"
      },
      ...wasAccepted && {
        timeToAcceptMs: timeMs - shownAt
      },
      ...!wasAccepted && {
        timeToIgnoreMs: timeMs - shownAt
      },
      ...firstKeystrokeAt.current > 0 && {
        timeToFirstKeystrokeMs: firstKeystrokeAt.current - shownAt
      },
      wasFocusedWhenShown: wasFocusedWhenShown.current,
      similarity: Math.round(finalInput.length / (suggestionText?.length || 1) * 100) / 100
    }), !opts?.skipReset)
      resetSuggestion();
  }, [
    isValidSuggestion,
    acceptedAt,
    shownAt,
    suggestionText,
    promptId,
    generationRequestId,
    resetSuggestion
  ]);
  return {
    suggestion,
    markAccepted,
    markShown,
    logOutcomeAtSubmission
  };
}
var import_react237;
var init_usePromptSuggestion = __esm(() => {
  init_use_terminal_focus();
  init_speculation();
  init_AppState();
  import_react237 = __toESM(require_react_development(), 1);
});
