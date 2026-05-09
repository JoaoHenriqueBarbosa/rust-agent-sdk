// Original: src/hooks/useGlobalKeybindings.tsx
function GlobalKeybindingHandlers({
  screen,
  setScreen,
  showAllInTranscript,
  setShowAllInTranscript,
  messageCount,
  onEnterTranscript,
  onExitTranscript,
  virtualScrollActive,
  searchBarOpen = !1
}) {
  let expandedView = useAppState((s2) => s2.expandedView), setAppState = useSetAppState(), handleToggleTodos = import_react264.useCallback(() => {
    logEvent("tengu_toggle_todos", {
      is_expanded: expandedView === "tasks"
    }), setAppState((prev) => {
      let {
        getAllInProcessTeammateTasks: getAllInProcessTeammateTasks2
      } = (init_InProcessTeammateTask(), __toCommonJS(exports_InProcessTeammateTask));
      if (count2(getAllInProcessTeammateTasks2(prev.tasks), (t2) => t2.status === "running") > 0)
        switch (prev.expandedView) {
          case "none":
            return {
              ...prev,
              expandedView: "tasks"
            };
          case "tasks":
            return {
              ...prev,
              expandedView: "teammates"
            };
          case "teammates":
            return {
              ...prev,
              expandedView: "none"
            };
        }
      return {
        ...prev,
        expandedView: prev.expandedView === "tasks" ? "none" : "tasks"
      };
    });
  }, [expandedView, setAppState]), isBriefOnly = useAppState((s_0) => s_0.isBriefOnly), handleToggleTranscript = import_react264.useCallback(() => {
    {
      let {
        isBriefEnabled: isBriefEnabled2
      } = (init_BriefTool(), __toCommonJS(exports_BriefTool));
      if (!isBriefEnabled2() && isBriefOnly && screen !== "transcript") {
        setAppState((prev_0) => {
          if (!prev_0.isBriefOnly)
            return prev_0;
          return {
            ...prev_0,
            isBriefOnly: !1
          };
        });
        return;
      }
    }
    let isEnteringTranscript = screen !== "transcript";
    if (logEvent("tengu_toggle_transcript", {
      is_entering: isEnteringTranscript,
      show_all: showAllInTranscript,
      message_count: messageCount
    }), setScreen((s_1) => s_1 === "transcript" ? "prompt" : "transcript"), setShowAllInTranscript(!1), isEnteringTranscript && onEnterTranscript)
      onEnterTranscript();
    if (!isEnteringTranscript && onExitTranscript)
      onExitTranscript();
  }, [screen, setScreen, isBriefOnly, showAllInTranscript, setShowAllInTranscript, messageCount, setAppState, onEnterTranscript, onExitTranscript]), handleToggleShowAll = import_react264.useCallback(() => {
    logEvent("tengu_transcript_toggle_show_all", {
      is_expanding: !showAllInTranscript,
      message_count: messageCount
    }), setShowAllInTranscript((prev_1) => !prev_1);
  }, [showAllInTranscript, setShowAllInTranscript, messageCount]), handleExitTranscript = import_react264.useCallback(() => {
    if (logEvent("tengu_transcript_exit", {
      show_all: showAllInTranscript,
      message_count: messageCount
    }), setScreen("prompt"), setShowAllInTranscript(!1), onExitTranscript)
      onExitTranscript();
  }, [setScreen, showAllInTranscript, setShowAllInTranscript, messageCount, onExitTranscript]), handleToggleBrief = import_react264.useCallback(() => {
    let {
      isBriefEnabled: isBriefEnabled_0
    } = (init_BriefTool(), __toCommonJS(exports_BriefTool));
    if (!isBriefEnabled_0() && !isBriefOnly)
      return;
    let next2 = !isBriefOnly;
    logEvent("tengu_brief_mode_toggled", {
      enabled: next2,
      gated: !1,
      source: "keybinding"
    }), setAppState((prev_2) => {
      if (prev_2.isBriefOnly === next2)
        return prev_2;
      return {
        ...prev_2,
        isBriefOnly: next2
      };
    });
  }, [isBriefOnly, setAppState]);
  useKeybinding("app:toggleTodos", handleToggleTodos, {
    context: "Global"
  }), useKeybinding("app:toggleTranscript", handleToggleTranscript, {
    context: "Global"
  }), useKeybinding("app:toggleBrief", handleToggleBrief, {
    context: "Global"
  }), useKeybinding("app:toggleTeammatePreview", () => {
    setAppState((prev_3) => ({
      ...prev_3,
      showTeammateMessagePreview: !prev_3.showTeammateMessagePreview
    }));
  }, {
    context: "Global"
  });
  let handleToggleTerminal = import_react264.useCallback(() => {}, []);
  useKeybinding("app:toggleTerminal", handleToggleTerminal, {
    context: "Global"
  });
  let handleRedraw = import_react264.useCallback(() => {
    instances_default.get(process.stdout)?.forceRedraw();
  }, []);
  useKeybinding("app:redraw", handleRedraw, {
    context: "Global"
  });
  let isInTranscript = screen === "transcript";
  return useKeybinding("transcript:toggleShowAll", handleToggleShowAll, {
    context: "Transcript",
    isActive: isInTranscript && !virtualScrollActive
  }), useKeybinding("transcript:exit", handleExitTranscript, {
    context: "Transcript",
    isActive: isInTranscript && !searchBarOpen
  }), null;
}
var import_react264;
var init_useGlobalKeybindings = __esm(() => {
  init_instances();
  init_useKeybinding();
  init_AppState();
  import_react264 = __toESM(require_react_development(), 1);
});
