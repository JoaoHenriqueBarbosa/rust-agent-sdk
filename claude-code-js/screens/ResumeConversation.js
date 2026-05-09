// Original: src/screens/ResumeConversation.tsx
var exports_ResumeConversation = {};
__export(exports_ResumeConversation, {
  ResumeConversation: () => ResumeConversation
});
import { dirname as dirname63 } from "path";
function parsePrIdentifier(value) {
  let directNumber = parseInt(value, 10);
  if (!isNaN(directNumber) && directNumber > 0)
    return directNumber;
  let urlMatch = value.match(/github\.com\/[^/]+\/[^/]+\/pull\/(\d+)/);
  if (urlMatch?.[1])
    return parseInt(urlMatch[1], 10);
  return null;
}
function ResumeConversation({
  commands: commands7,
  worktreePaths,
  initialTools,
  mcpClients,
  dynamicMcpConfig,
  debug,
  mainThreadAgentDefinition,
  autoConnectIdeFlag,
  strictMcpConfig = !1,
  systemPrompt,
  appendSystemPrompt,
  initialSearchQuery,
  disableSlashCommands = !1,
  forkSession,
  taskListId,
  filterByPr,
  thinkingConfig,
  onTurnComplete
}) {
  let {
    rows
  } = useTerminalSize(), agentDefinitions = useAppState((s2) => s2.agentDefinitions), setAppState = useSetAppState(), [logs2, setLogs] = import_react315.default.useState([]), [loading, setLoading] = import_react315.default.useState(!0), [resuming, setResuming] = import_react315.default.useState(!1), [showAllProjects, setShowAllProjects] = import_react315.default.useState(!1), [resumeData, setResumeData] = import_react315.default.useState(null), [crossProjectCommand, setCrossProjectCommand] = import_react315.default.useState(null), sessionLogResultRef = import_react315.default.useRef(null), logCountRef = import_react315.default.useRef(0), filteredLogs = import_react315.default.useMemo(() => {
    let result = logs2.filter((l3) => !l3.isSidechain);
    if (filterByPr !== void 0) {
      if (filterByPr === !0)
        result = result.filter((l_0) => l_0.prNumber !== void 0);
      else if (typeof filterByPr === "number")
        result = result.filter((l_1) => l_1.prNumber === filterByPr);
      else if (typeof filterByPr === "string") {
        let prNumber = parsePrIdentifier(filterByPr);
        if (prNumber !== null)
          result = result.filter((l_2) => l_2.prNumber === prNumber);
      }
    }
    return result;
  }, [logs2, filterByPr]), isResumeWithRenameEnabled = isCustomTitleEnabled();
  import_react315.default.useEffect(() => {
    loadSameRepoMessageLogsProgressive(worktreePaths).then((result_0) => {
      sessionLogResultRef.current = result_0, logCountRef.current = result_0.logs.length, setLogs(result_0.logs), setLoading(!1);
    }).catch((error44) => {
      logError2(error44), setLoading(!1);
    });
  }, [worktreePaths]);
  let loadMoreLogs = import_react315.default.useCallback((count4) => {
    let ref = sessionLogResultRef.current;
    if (!ref || ref.nextIndex >= ref.allStatLogs.length)
      return;
    enrichLogs(ref.allStatLogs, ref.nextIndex, count4).then((result_1) => {
      if (ref.nextIndex = result_1.nextIndex, result_1.logs.length > 0) {
        let offset = logCountRef.current;
        result_1.logs.forEach((log4, i5) => {
          log4.value = offset + i5;
        }), setLogs((prev) => prev.concat(result_1.logs)), logCountRef.current += result_1.logs.length;
      } else if (ref.nextIndex < ref.allStatLogs.length)
        loadMoreLogs(count4);
    });
  }, []), loadLogs = import_react315.default.useCallback((allProjects) => {
    setLoading(!0), (allProjects ? loadAllProjectsMessageLogsProgressive() : loadSameRepoMessageLogsProgressive(worktreePaths)).then((result_2) => {
      sessionLogResultRef.current = result_2, logCountRef.current = result_2.logs.length, setLogs(result_2.logs);
    }).catch((error_0) => {
      logError2(error_0);
    }).finally(() => {
      setLoading(!1);
    });
  }, [worktreePaths]), handleToggleAllProjects = import_react315.default.useCallback(() => {
    let newValue = !showAllProjects;
    setShowAllProjects(newValue), loadLogs(newValue);
  }, [showAllProjects, loadLogs]);
  function onCancel() {
    process.exit(1);
  }
  async function onSelect(log_0) {
    setResuming(!0);
    let resumeStart = performance.now(), crossProjectCheck = checkCrossProjectResume(log_0, showAllProjects, worktreePaths);
    if (crossProjectCheck.isCrossProject) {
      if (!crossProjectCheck.isSameRepoWorktree) {
        let raw = await setClipboard(crossProjectCheck.command);
        if (raw)
          process.stdout.write(raw);
        setCrossProjectCommand(crossProjectCheck.command);
        return;
      }
    }
    try {
      let result_3 = await loadConversationForResume(log_0, void 0);
      if (!result_3)
        throw Error("Failed to load conversation");
      if (result_3.sessionId && !forkSession)
        switchSession(asSessionId(result_3.sessionId), log_0.fullPath ? dirname63(log_0.fullPath) : null), await renameRecordingForSession(), await resetSessionFilePointer(), restoreCostStateForSession(result_3.sessionId);
      else if (forkSession && result_3.contentReplacements?.length)
        await recordContentReplacement(result_3.contentReplacements);
      let {
        agentDefinition: resolvedAgentDef
      } = restoreAgentFromSession(result_3.agentSetting, mainThreadAgentDefinition, agentDefinitions);
      setAppState((prev_1) => ({
        ...prev_1,
        agent: resolvedAgentDef?.agentType
      }));
      let standaloneAgentContext = computeStandaloneAgentContext(result_3.agentName, result_3.agentColor);
      if (standaloneAgentContext)
        setAppState((prev_2) => ({
          ...prev_2,
          standaloneAgentContext
        }));
      if (updateSessionName(result_3.agentName), restoreSessionMetadata(forkSession ? {
        ...result_3,
        worktreeSession: void 0
      } : result_3), !forkSession) {
        if (restoreWorktreeForResume(result_3.worktreeSession), result_3.sessionId)
          adoptResumedSessionFile();
      }
      logEvent("tengu_session_resumed", {
        entrypoint: "picker",
        success: !0,
        resume_duration_ms: Math.round(performance.now() - resumeStart)
      }), setLogs([]), setResumeData({
        messages: result_3.messages,
        fileHistorySnapshots: result_3.fileHistorySnapshots,
        contentReplacements: result_3.contentReplacements,
        agentName: result_3.agentName,
        agentColor: result_3.agentColor === "default" ? void 0 : result_3.agentColor,
        mainThreadAgentDefinition: resolvedAgentDef
      });
    } catch (e) {
      throw logEvent("tengu_session_resumed", {
        entrypoint: "picker",
        success: !1
      }), logError2(e), e;
    }
  }
  if (crossProjectCommand)
    return /* @__PURE__ */ jsx_dev_runtime478.jsxDEV(CrossProjectMessage, {
      command: crossProjectCommand
    }, void 0, !1, void 0, this);
  if (resumeData)
    return /* @__PURE__ */ jsx_dev_runtime478.jsxDEV(REPL, {
      debug,
      commands: commands7,
      initialTools,
      initialMessages: resumeData.messages,
      initialFileHistorySnapshots: resumeData.fileHistorySnapshots,
      initialContentReplacements: resumeData.contentReplacements,
      initialAgentName: resumeData.agentName,
      initialAgentColor: resumeData.agentColor,
      mcpClients,
      dynamicMcpConfig,
      strictMcpConfig,
      systemPrompt,
      appendSystemPrompt,
      mainThreadAgentDefinition: resumeData.mainThreadAgentDefinition,
      autoConnectIdeFlag,
      disableSlashCommands,
      taskListId,
      thinkingConfig,
      onTurnComplete
    }, void 0, !1, void 0, this);
  if (loading)
    return /* @__PURE__ */ jsx_dev_runtime478.jsxDEV(ThemedBox_default, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime478.jsxDEV(Spinner, {}, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime478.jsxDEV(ThemedText, {
          children: " Loading conversations\u2026"
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this);
  if (resuming)
    return /* @__PURE__ */ jsx_dev_runtime478.jsxDEV(ThemedBox_default, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime478.jsxDEV(Spinner, {}, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime478.jsxDEV(ThemedText, {
          children: " Resuming conversation\u2026"
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this);
  if (filteredLogs.length === 0)
    return /* @__PURE__ */ jsx_dev_runtime478.jsxDEV(NoConversationsMessage, {}, void 0, !1, void 0, this);
  return /* @__PURE__ */ jsx_dev_runtime478.jsxDEV(LogSelector, {
    logs: filteredLogs,
    maxHeight: rows,
    onCancel,
    onSelect,
    onLogsChanged: isResumeWithRenameEnabled ? () => loadLogs(showAllProjects) : void 0,
    onLoadMore: loadMoreLogs,
    initialSearchQuery,
    showAllProjects,
    onToggleAllProjects: handleToggleAllProjects,
    onAgenticSearch: agenticSessionSearch
  }, void 0, !1, void 0, this);
}
function NoConversationsMessage() {
  let $3 = import_compiler_runtime377.c(2), t0;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t0 = {
      context: "Global"
    }, $3[0] = t0;
  else
    t0 = $3[0];
  useKeybinding("app:interrupt", _temp307, t0);
  let t1;
  if ($3[1] === Symbol.for("react.memo_cache_sentinel"))
    t1 = /* @__PURE__ */ jsx_dev_runtime478.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        /* @__PURE__ */ jsx_dev_runtime478.jsxDEV(ThemedText, {
          children: "No conversations found to resume."
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime478.jsxDEV(ThemedText, {
          dimColor: !0,
          children: "Press Ctrl+C to exit and start a new conversation."
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[1] = t1;
  else
    t1 = $3[1];
  return t1;
}
function _temp307() {
  process.exit(1);
}
function CrossProjectMessage(t0) {
  let $3 = import_compiler_runtime377.c(8), {
    command: command19
  } = t0, t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = [], $3[0] = t1;
  else
    t1 = $3[0];
  import_react315.default.useEffect(_temp357, t1);
  let t2;
  if ($3[1] === Symbol.for("react.memo_cache_sentinel"))
    t2 = /* @__PURE__ */ jsx_dev_runtime478.jsxDEV(ThemedText, {
      children: "This conversation is from a different directory."
    }, void 0, !1, void 0, this), $3[1] = t2;
  else
    t2 = $3[1];
  let t3;
  if ($3[2] === Symbol.for("react.memo_cache_sentinel"))
    t3 = /* @__PURE__ */ jsx_dev_runtime478.jsxDEV(ThemedText, {
      children: "To resume, run:"
    }, void 0, !1, void 0, this), $3[2] = t3;
  else
    t3 = $3[2];
  let t4;
  if ($3[3] !== command19)
    t4 = /* @__PURE__ */ jsx_dev_runtime478.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        t3,
        /* @__PURE__ */ jsx_dev_runtime478.jsxDEV(ThemedText, {
          children: [
            " ",
            command19
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[3] = command19, $3[4] = t4;
  else
    t4 = $3[4];
  let t5;
  if ($3[5] === Symbol.for("react.memo_cache_sentinel"))
    t5 = /* @__PURE__ */ jsx_dev_runtime478.jsxDEV(ThemedText, {
      dimColor: !0,
      children: "(Command copied to clipboard)"
    }, void 0, !1, void 0, this), $3[5] = t5;
  else
    t5 = $3[5];
  let t6;
  if ($3[6] !== t4)
    t6 = /* @__PURE__ */ jsx_dev_runtime478.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      gap: 1,
      children: [
        t2,
        t4,
        t5
      ]
    }, void 0, !0, void 0, this), $3[6] = t4, $3[7] = t6;
  else
    t6 = $3[7];
  return t6;
}
function _temp357() {
  let timeout2 = setTimeout(_temp2102, 100);
  return () => clearTimeout(timeout2);
}
function _temp2102() {
  process.exit(0);
}
var import_compiler_runtime377, import_react315, jsx_dev_runtime478;
var init_ResumeConversation = __esm(() => {
  init_useTerminalSize();
  init_state();
  init_LogSelector();
  init_Spinner2();
  init_cost_tracker();
  init_osc();
  init_ink2();
  init_useKeybinding();
  init_AppState();
  init_ids();
  init_agenticSessionSearch();
  init_asciicast();
  init_concurrentSessions();
  init_conversationRecovery();
  init_crossProjectResume();
  init_log3();
  init_sessionRestore();
  init_sessionStorage();
  init_REPL();
  import_compiler_runtime377 = __toESM(require_react_compiler_runtime_development(), 1), import_react315 = __toESM(require_react_development(), 1), jsx_dev_runtime478 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
