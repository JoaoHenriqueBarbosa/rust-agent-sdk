// Original: src/commands/resume/resume.tsx
var exports_resume = {};
__export(exports_resume, {
  filterResumableSessions: () => filterResumableSessions,
  call: () => call30
});
function resumeHelpMessage(result) {
  switch (result.resultType) {
    case "sessionNotFound":
      return `Session ${source_default.bold(result.arg)} was not found.`;
    case "multipleMatches":
      return `Found ${result.count} sessions matching ${source_default.bold(result.arg)}. Please use /resume to pick a specific session.`;
  }
}
function ResumeError(t0) {
  let $3 = import_compiler_runtime217.c(10), {
    message,
    args,
    onDone
  } = t0, t1, t2;
  if ($3[0] !== onDone)
    t1 = () => {
      let timer = setTimeout(onDone, 0);
      return () => clearTimeout(timer);
    }, t2 = [onDone], $3[0] = onDone, $3[1] = t1, $3[2] = t2;
  else
    t1 = $3[1], t2 = $3[2];
  React88.useEffect(t1, t2);
  let t3;
  if ($3[3] !== args)
    t3 = /* @__PURE__ */ jsx_dev_runtime273.jsxDEV(ThemedText, {
      dimColor: !0,
      children: [
        figures_default.pointer,
        " /resume ",
        args
      ]
    }, void 0, !0, void 0, this), $3[3] = args, $3[4] = t3;
  else
    t3 = $3[4];
  let t4;
  if ($3[5] !== message)
    t4 = /* @__PURE__ */ jsx_dev_runtime273.jsxDEV(MessageResponse, {
      children: /* @__PURE__ */ jsx_dev_runtime273.jsxDEV(ThemedText, {
        children: message
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[5] = message, $3[6] = t4;
  else
    t4 = $3[6];
  let t5;
  if ($3[7] !== t3 || $3[8] !== t4)
    t5 = /* @__PURE__ */ jsx_dev_runtime273.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        t3,
        t4
      ]
    }, void 0, !0, void 0, this), $3[7] = t3, $3[8] = t4, $3[9] = t5;
  else
    t5 = $3[9];
  return t5;
}
function ResumeCommand({
  onDone,
  onResume
}) {
  let [logs2, setLogs] = React88.useState([]), [worktreePaths, setWorktreePaths] = React88.useState([]), [loading, setLoading] = React88.useState(!0), [resuming, setResuming] = React88.useState(!1), [showAllProjects, setShowAllProjects] = React88.useState(!1), {
    rows
  } = useTerminalSize(), insideModal = useIsInsideModal(), loadLogs = React88.useCallback(async (allProjects, paths2) => {
    setLoading(!0);
    try {
      let allLogs = allProjects ? await loadAllProjectsMessageLogs() : await loadSameRepoMessageLogs(paths2), resumable = filterResumableSessions(allLogs, getSessionId());
      if (resumable.length === 0) {
        onDone("No conversations found to resume");
        return;
      }
      setLogs(resumable);
    } catch (_err) {
      onDone("Failed to load conversations");
    } finally {
      setLoading(!1);
    }
  }, [onDone]);
  React88.useEffect(() => {
    async function init2() {
      let paths_0 = await getWorktreePaths(getOriginalCwd());
      setWorktreePaths(paths_0), loadLogs(!1, paths_0);
    }
    init2();
  }, [loadLogs]);
  let handleToggleAllProjects = React88.useCallback(() => {
    let newValue = !showAllProjects;
    setShowAllProjects(newValue), loadLogs(newValue, worktreePaths);
  }, [showAllProjects, loadLogs, worktreePaths]);
  async function handleSelect(log3) {
    let sessionId = validateUuid2(getSessionIdFromLog(log3));
    if (!sessionId) {
      onDone("Failed to resume conversation");
      return;
    }
    let fullLog = isLiteLog(log3) ? await loadFullLog(log3) : log3, crossProjectCheck = checkCrossProjectResume(fullLog, showAllProjects, worktreePaths);
    if (crossProjectCheck.isCrossProject) {
      if (crossProjectCheck.isSameRepoWorktree) {
        setResuming(!0), onResume(sessionId, fullLog, "slash_command_picker");
        return;
      }
      let raw = await setClipboard(crossProjectCheck.command);
      if (raw)
        process.stdout.write(raw);
      let message = ["", "This conversation is from a different directory.", "", "To resume, run:", `  ${crossProjectCheck.command}`, "", "(Command copied to clipboard)", ""].join(`
`);
      onDone(message, {
        display: "user"
      });
      return;
    }
    setResuming(!0), onResume(sessionId, fullLog, "slash_command_picker");
  }
  function handleCancel() {
    onDone("Resume cancelled", {
      display: "system"
    });
  }
  if (loading)
    return /* @__PURE__ */ jsx_dev_runtime273.jsxDEV(ThemedBox_default, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime273.jsxDEV(Spinner, {}, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime273.jsxDEV(ThemedText, {
          children: " Loading conversations\u2026"
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this);
  if (resuming)
    return /* @__PURE__ */ jsx_dev_runtime273.jsxDEV(ThemedBox_default, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime273.jsxDEV(Spinner, {}, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime273.jsxDEV(ThemedText, {
          children: " Resuming conversation\u2026"
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this);
  return /* @__PURE__ */ jsx_dev_runtime273.jsxDEV(LogSelector, {
    logs: logs2,
    maxHeight: insideModal ? Math.floor(rows / 2) : rows - 2,
    onCancel: handleCancel,
    onSelect: handleSelect,
    onLogsChanged: () => loadLogs(showAllProjects, worktreePaths),
    showAllProjects,
    onToggleAllProjects: handleToggleAllProjects,
    onAgenticSearch: agenticSessionSearch
  }, void 0, !1, void 0, this);
}
function filterResumableSessions(logs2, currentSessionId) {
  return logs2.filter((l3) => !l3.isSidechain && getSessionIdFromLog(l3) !== currentSessionId);
}
var import_compiler_runtime217, React88, jsx_dev_runtime273, call30 = async (onDone, context7, args) => {
  let onResume = async (sessionId, log3, entrypoint) => {
    try {
      await context7.resume?.(sessionId, log3, entrypoint), onDone(void 0, {
        display: "skip"
      });
    } catch (error44) {
      logError2(error44), onDone(`Failed to resume: ${error44.message}`);
    }
  }, arg = args?.trim();
  if (!arg)
    return /* @__PURE__ */ jsx_dev_runtime273.jsxDEV(ResumeCommand, {
      onDone,
      onResume
    }, Date.now(), !1, void 0, this);
  let worktreePaths = await getWorktreePaths(getOriginalCwd()), logs2 = await loadSameRepoMessageLogs(worktreePaths);
  if (logs2.length === 0)
    return /* @__PURE__ */ jsx_dev_runtime273.jsxDEV(ResumeError, {
      message: "No conversations found to resume.",
      args: arg,
      onDone: () => onDone("No conversations found to resume.")
    }, void 0, !1, void 0, this);
  let maybeSessionId = validateUuid2(arg);
  if (maybeSessionId) {
    let matchingLogs = logs2.filter((l3) => getSessionIdFromLog(l3) === maybeSessionId).sort((a2, b) => b.modified.getTime() - a2.modified.getTime());
    if (matchingLogs.length > 0) {
      let log3 = matchingLogs[0], fullLog = isLiteLog(log3) ? await loadFullLog(log3) : log3;
      return onResume(maybeSessionId, fullLog, "slash_command_session_id"), null;
    }
    let directLog = await getLastSessionLog(maybeSessionId);
    if (directLog)
      return onResume(maybeSessionId, directLog, "slash_command_session_id"), null;
  }
  if (isCustomTitleEnabled()) {
    let titleMatches = await searchSessionsByCustomTitle(arg, {
      exact: !0
    });
    if (titleMatches.length === 1) {
      let log3 = titleMatches[0], sessionId = getSessionIdFromLog(log3);
      if (sessionId) {
        let fullLog = isLiteLog(log3) ? await loadFullLog(log3) : log3;
        return onResume(sessionId, fullLog, "slash_command_title"), null;
      }
    }
    if (titleMatches.length > 1) {
      let message2 = resumeHelpMessage({
        resultType: "multipleMatches",
        arg,
        count: titleMatches.length
      });
      return /* @__PURE__ */ jsx_dev_runtime273.jsxDEV(ResumeError, {
        message: message2,
        args: arg,
        onDone: () => onDone(message2)
      }, void 0, !1, void 0, this);
    }
  }
  let message = resumeHelpMessage({
    resultType: "sessionNotFound",
    arg
  });
  return /* @__PURE__ */ jsx_dev_runtime273.jsxDEV(ResumeError, {
    message,
    args: arg,
    onDone: () => onDone(message)
  }, void 0, !1, void 0, this);
};
var init_resume = __esm(() => {
  init_source();
  init_figures();
  init_state();
  init_LogSelector();
  init_MessageResponse();
  init_Spinner2();
  init_modalContext();
  init_useTerminalSize();
  init_osc();
  init_ink2();
  init_agenticSessionSearch();
  init_crossProjectResume();
  init_getWorktreePaths();
  init_log3();
  init_sessionStorage();
  init_uuid();
  import_compiler_runtime217 = __toESM(require_react_compiler_runtime_development(), 1), React88 = __toESM(require_react_development(), 1), jsx_dev_runtime273 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
