// Original: src/tools/ExitWorktreeTool/ExitWorktreeTool.ts
async function countWorktreeChanges(worktreePath, originalHeadCommit) {
  let status = await execFileNoThrow("git", [
    "-C",
    worktreePath,
    "status",
    "--porcelain"
  ]);
  if (status.code !== 0)
    return null;
  let changedFiles = count2(status.stdout.split(`
`), (l3) => l3.trim() !== "");
  if (!originalHeadCommit)
    return null;
  let revList = await execFileNoThrow("git", [
    "-C",
    worktreePath,
    "rev-list",
    "--count",
    `${originalHeadCommit}..HEAD`
  ]);
  if (revList.code !== 0)
    return null;
  let commits = parseInt(revList.stdout.trim(), 10) || 0;
  return { changedFiles, commits };
}
function restoreSessionToOriginalCwd(originalCwd, projectRootIsWorktree) {
  if (setCwd(originalCwd), setOriginalCwd(originalCwd), projectRootIsWorktree)
    setProjectRoot(originalCwd), updateHooksConfigSnapshot();
  saveWorktreeState(null), clearSystemPromptSections(), clearMemoryFileCaches(), getPlansDirectory.cache.clear?.();
}
var inputSchema29, outputSchema23, ExitWorktreeTool;
var init_ExitWorktreeTool = __esm(() => {
  init_v4();
  init_state();
  init_systemPromptSections();
  init_Tool();
  init_claudemd();
  init_execFileNoThrow();
  init_hooksConfigSnapshot();
  init_plans();
  init_Shell();
  init_sessionStorage();
  init_worktree();
  init_UI21();
  inputSchema29 = lazySchema(() => exports_external.strictObject({
    action: exports_external.enum(["keep", "remove"]).describe('"keep" leaves the worktree and branch on disk; "remove" deletes both.'),
    discard_changes: exports_external.boolean().optional().describe('Required true when action is "remove" and the worktree has uncommitted files or unmerged commits. The tool will refuse and list them otherwise.')
  })), outputSchema23 = lazySchema(() => exports_external.object({
    action: exports_external.enum(["keep", "remove"]),
    originalCwd: exports_external.string(),
    worktreePath: exports_external.string(),
    worktreeBranch: exports_external.string().optional(),
    tmuxSessionName: exports_external.string().optional(),
    discardedFiles: exports_external.number().optional(),
    discardedCommits: exports_external.number().optional(),
    message: exports_external.string()
  }));
  ExitWorktreeTool = buildTool({
    name: EXIT_WORKTREE_TOOL_NAME,
    searchHint: "exit a worktree session and return to the original directory",
    maxResultSizeChars: 1e5,
    async description() {
      return "Exits a worktree session created by EnterWorktree and restores the original working directory";
    },
    async prompt() {
      return getExitWorktreeToolPrompt();
    },
    get inputSchema() {
      return inputSchema29();
    },
    get outputSchema() {
      return outputSchema23();
    },
    userFacingName() {
      return "Exiting worktree";
    },
    shouldDefer: !0,
    isDestructive(input) {
      return input.action === "remove";
    },
    toAutoClassifierInput(input) {
      return input.action;
    },
    async validateInput(input) {
      let session = getCurrentWorktreeSession();
      if (!session)
        return {
          result: !1,
          message: "No-op: there is no active EnterWorktree session to exit. This tool only operates on worktrees created by EnterWorktree in the current session \u2014 it will not touch worktrees created manually or in a previous session. No filesystem changes were made.",
          errorCode: 1
        };
      if (input.action === "remove" && !input.discard_changes) {
        let summary = await countWorktreeChanges(session.worktreePath, session.originalHeadCommit);
        if (summary === null)
          return {
            result: !1,
            message: `Could not verify worktree state at ${session.worktreePath}. Refusing to remove without explicit confirmation. Re-invoke with discard_changes: true to proceed \u2014 or use action: "keep" to preserve the worktree.`,
            errorCode: 3
          };
        let { changedFiles, commits } = summary;
        if (changedFiles > 0 || commits > 0) {
          let parts = [];
          if (changedFiles > 0)
            parts.push(`${changedFiles} uncommitted ${changedFiles === 1 ? "file" : "files"}`);
          if (commits > 0)
            parts.push(`${commits} ${commits === 1 ? "commit" : "commits"} on ${session.worktreeBranch ?? "the worktree branch"}`);
          return {
            result: !1,
            message: `Worktree has ${parts.join(" and ")}. Removing will discard this work permanently. Confirm with the user, then re-invoke with discard_changes: true \u2014 or use action: "keep" to preserve the worktree.`,
            errorCode: 2
          };
        }
      }
      return { result: !0 };
    },
    renderToolUseMessage: renderToolUseMessage22,
    renderToolResultMessage: renderToolResultMessage21,
    async call(input) {
      let session = getCurrentWorktreeSession();
      if (!session)
        throw Error("Not in a worktree session");
      let {
        originalCwd,
        worktreePath,
        worktreeBranch,
        tmuxSessionName,
        originalHeadCommit
      } = session, projectRootIsWorktree = getProjectRoot() === getOriginalCwd(), { changedFiles, commits } = await countWorktreeChanges(worktreePath, originalHeadCommit) ?? { changedFiles: 0, commits: 0 };
      if (input.action === "keep") {
        await keepWorktree(), restoreSessionToOriginalCwd(originalCwd, projectRootIsWorktree), logEvent("tengu_worktree_kept", {
          mid_session: !0,
          commits,
          changed_files: changedFiles
        });
        let tmuxNote = tmuxSessionName ? ` Tmux session ${tmuxSessionName} is still running; reattach with: tmux attach -t ${tmuxSessionName}` : "";
        return {
          data: {
            action: "keep",
            originalCwd,
            worktreePath,
            worktreeBranch,
            tmuxSessionName,
            message: `Exited worktree. Your work is preserved at ${worktreePath}${worktreeBranch ? ` on branch ${worktreeBranch}` : ""}. Session is now back in ${originalCwd}.${tmuxNote}`
          }
        };
      }
      if (tmuxSessionName)
        await killTmuxSession(tmuxSessionName);
      await cleanupWorktree(), restoreSessionToOriginalCwd(originalCwd, projectRootIsWorktree), logEvent("tengu_worktree_removed", {
        mid_session: !0,
        commits,
        changed_files: changedFiles
      });
      let discardParts = [];
      if (commits > 0)
        discardParts.push(`${commits} ${commits === 1 ? "commit" : "commits"}`);
      if (changedFiles > 0)
        discardParts.push(`${changedFiles} uncommitted ${changedFiles === 1 ? "file" : "files"}`);
      let discardNote = discardParts.length > 0 ? ` Discarded ${discardParts.join(" and ")}.` : "";
      return {
        data: {
          action: "remove",
          originalCwd,
          worktreePath,
          worktreeBranch,
          discardedFiles: changedFiles,
          discardedCommits: commits,
          message: `Exited and removed worktree at ${worktreePath}.${discardNote} Session is now back in ${originalCwd}.`
        }
      };
    },
    mapToolResultToToolResultBlockParam({ message }, toolUseID) {
      return {
        type: "tool_result",
        content: message,
        tool_use_id: toolUseID
      };
    }
  });
});
