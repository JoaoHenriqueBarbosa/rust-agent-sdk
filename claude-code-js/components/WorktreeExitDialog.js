// Original: src/components/WorktreeExitDialog.tsx
function recordWorktreeExit() {
  (init_sessionStorage(), __toCommonJS(exports_sessionStorage)).saveWorktreeState(null);
}
function WorktreeExitDialog({
  onDone,
  onCancel
}) {
  let [status2, setStatus] = import_react187.useState("loading"), [changes, setChanges] = import_react187.useState([]), [commitCount, setCommitCount] = import_react187.useState(0), [resultMessage, setResultMessage] = import_react187.useState(), worktreeSession = getCurrentWorktreeSession();
  if (import_react187.useEffect(() => {
    async function loadChanges() {
      let changeLines = [], gitStatus = await execFileNoThrow("git", ["status", "--porcelain"]);
      if (gitStatus.stdout)
        changeLines = gitStatus.stdout.split(`
`).filter((_) => _.trim() !== ""), setChanges(changeLines);
      if (worktreeSession) {
        let {
          stdout: commitsStr
        } = await execFileNoThrow("git", ["rev-list", "--count", `${worktreeSession.originalHeadCommit}..HEAD`]), count4 = parseInt(commitsStr.trim()) || 0;
        if (setCommitCount(count4), changeLines.length === 0 && count4 === 0) {
          setStatus("removing"), cleanupWorktree().then(() => {
            process.chdir(worktreeSession.originalCwd), setCwd(worktreeSession.originalCwd), recordWorktreeExit(), getPlansDirectory.cache.clear?.(), setResultMessage("Worktree removed (no changes)");
          }).catch((error44) => {
            logForDebugging(`Failed to clean up worktree: ${error44}`, {
              level: "error"
            }), setResultMessage("Worktree cleanup failed, exiting anyway");
          }).then(() => {
            setStatus("done");
          });
          return;
        } else
          setStatus("asking");
      }
    }
    loadChanges();
  }, [worktreeSession]), import_react187.useEffect(() => {
    if (status2 === "done")
      onDone(resultMessage);
  }, [status2, onDone, resultMessage]), !worktreeSession)
    return onDone("No active worktree session found", {
      display: "system"
    }), null;
  if (status2 === "loading" || status2 === "done")
    return null;
  async function handleSelect(value) {
    if (!worktreeSession)
      return;
    let hasTmux = Boolean(worktreeSession.tmuxSessionName);
    if (value === "keep" || value === "keep-with-tmux") {
      if (setStatus("keeping"), logEvent("tengu_worktree_kept", {
        commits: commitCount,
        changed_files: changes.length
      }), await keepWorktree(), process.chdir(worktreeSession.originalCwd), setCwd(worktreeSession.originalCwd), recordWorktreeExit(), getPlansDirectory.cache.clear?.(), hasTmux)
        setResultMessage(`Worktree kept. Your work is saved at ${worktreeSession.worktreePath} on branch ${worktreeSession.worktreeBranch}. Reattach to tmux session with: tmux attach -t ${worktreeSession.tmuxSessionName}`);
      else
        setResultMessage(`Worktree kept. Your work is saved at ${worktreeSession.worktreePath} on branch ${worktreeSession.worktreeBranch}`);
      setStatus("done");
    } else if (value === "keep-kill-tmux") {
      if (setStatus("keeping"), logEvent("tengu_worktree_kept", {
        commits: commitCount,
        changed_files: changes.length
      }), worktreeSession.tmuxSessionName)
        await killTmuxSession(worktreeSession.tmuxSessionName);
      await keepWorktree(), process.chdir(worktreeSession.originalCwd), setCwd(worktreeSession.originalCwd), recordWorktreeExit(), getPlansDirectory.cache.clear?.(), setResultMessage(`Worktree kept at ${worktreeSession.worktreePath} on branch ${worktreeSession.worktreeBranch}. Tmux session terminated.`), setStatus("done");
    } else if (value === "remove" || value === "remove-with-tmux") {
      if (setStatus("removing"), logEvent("tengu_worktree_removed", {
        commits: commitCount,
        changed_files: changes.length
      }), worktreeSession.tmuxSessionName)
        await killTmuxSession(worktreeSession.tmuxSessionName);
      try {
        await cleanupWorktree(), process.chdir(worktreeSession.originalCwd), setCwd(worktreeSession.originalCwd), recordWorktreeExit(), getPlansDirectory.cache.clear?.();
      } catch (error44) {
        logForDebugging(`Failed to clean up worktree: ${error44}`, {
          level: "error"
        }), setResultMessage("Worktree cleanup failed, exiting anyway"), setStatus("done");
        return;
      }
      let tmuxNote = hasTmux ? " Tmux session terminated." : "";
      if (commitCount > 0 && changes.length > 0)
        setResultMessage(`Worktree removed. ${commitCount} ${commitCount === 1 ? "commit" : "commits"} and uncommitted changes were discarded.${tmuxNote}`);
      else if (commitCount > 0)
        setResultMessage(`Worktree removed. ${commitCount} ${commitCount === 1 ? "commit" : "commits"} on ${worktreeSession.worktreeBranch} ${commitCount === 1 ? "was" : "were"} discarded.${tmuxNote}`);
      else if (changes.length > 0)
        setResultMessage(`Worktree removed. Uncommitted changes were discarded.${tmuxNote}`);
      else
        setResultMessage(`Worktree removed.${tmuxNote}`);
      setStatus("done");
    }
  }
  if (status2 === "keeping")
    return /* @__PURE__ */ jsx_dev_runtime346.jsxDEV(ThemedBox_default, {
      flexDirection: "row",
      marginY: 1,
      children: [
        /* @__PURE__ */ jsx_dev_runtime346.jsxDEV(Spinner, {}, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime346.jsxDEV(ThemedText, {
          children: "Keeping worktree\u2026"
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this);
  if (status2 === "removing")
    return /* @__PURE__ */ jsx_dev_runtime346.jsxDEV(ThemedBox_default, {
      flexDirection: "row",
      marginY: 1,
      children: [
        /* @__PURE__ */ jsx_dev_runtime346.jsxDEV(Spinner, {}, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime346.jsxDEV(ThemedText, {
          children: "Removing worktree\u2026"
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this);
  let branchName = worktreeSession.worktreeBranch, hasUncommitted = changes.length > 0, hasCommits = commitCount > 0, subtitle = "";
  if (hasUncommitted && hasCommits)
    subtitle = `You have ${changes.length} uncommitted ${changes.length === 1 ? "file" : "files"} and ${commitCount} ${commitCount === 1 ? "commit" : "commits"} on ${branchName}. All will be lost if you remove.`;
  else if (hasUncommitted)
    subtitle = `You have ${changes.length} uncommitted ${changes.length === 1 ? "file" : "files"}. These will be lost if you remove the worktree.`;
  else if (hasCommits)
    subtitle = `You have ${commitCount} ${commitCount === 1 ? "commit" : "commits"} on ${branchName}. The branch will be deleted if you remove the worktree.`;
  else
    subtitle = "You are working in a worktree. Keep it to continue working there, or remove it to clean up.";
  function handleCancel() {
    if (onCancel) {
      onCancel();
      return;
    }
    handleSelect("keep");
  }
  let removeDescription = hasUncommitted || hasCommits ? "All changes and commits will be lost." : "Clean up the worktree directory.", hasTmuxSession = Boolean(worktreeSession.tmuxSessionName), options2 = hasTmuxSession ? [{
    label: "Keep worktree and tmux session",
    value: "keep-with-tmux",
    description: `Stays at ${worktreeSession.worktreePath}. Reattach with: tmux attach -t ${worktreeSession.tmuxSessionName}`
  }, {
    label: "Keep worktree, kill tmux session",
    value: "keep-kill-tmux",
    description: `Keeps worktree at ${worktreeSession.worktreePath}, terminates tmux session.`
  }, {
    label: "Remove worktree and tmux session",
    value: "remove-with-tmux",
    description: removeDescription
  }] : [{
    label: "Keep worktree",
    value: "keep",
    description: `Stays at ${worktreeSession.worktreePath}`
  }, {
    label: "Remove worktree",
    value: "remove",
    description: removeDescription
  }];
  return /* @__PURE__ */ jsx_dev_runtime346.jsxDEV(Dialog, {
    title: "Exiting worktree session",
    subtitle,
    onCancel: handleCancel,
    children: /* @__PURE__ */ jsx_dev_runtime346.jsxDEV(Select, {
      defaultFocusValue: hasTmuxSession ? "keep-with-tmux" : "keep",
      options: options2,
      onChange: handleSelect
    }, void 0, !1, void 0, this)
  }, void 0, !1, void 0, this);
}
var import_react187, jsx_dev_runtime346;
var init_WorktreeExitDialog = __esm(() => {
  init_debug();
  init_ink2();
  init_execFileNoThrow();
  init_plans();
  init_Shell();
  init_worktree();
  init_select();
  init_Dialog();
  init_Spinner2();
  import_react187 = __toESM(require_react_development(), 1), jsx_dev_runtime346 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
