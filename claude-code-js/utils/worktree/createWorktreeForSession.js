// function: createWorktreeForSession
async function createWorktreeForSession(sessionId, slug, tmuxSessionName, options2) {
  validateWorktreeSlug(slug);
  let originalCwd = getCwd();
  if (hasWorktreeCreateHook()) {
    let hookResult = await executeWorktreeCreateHook(slug);
    logForDebugging(`Created hook-based worktree at: ${hookResult.worktreePath}`), currentWorktreeSession = {
      originalCwd,
      worktreePath: hookResult.worktreePath,
      worktreeName: slug,
      sessionId,
      tmuxSessionName,
      hookBased: !0
    };
  } else {
    let gitRoot = findGitRoot(getCwd());
    if (!gitRoot)
      throw Error("Cannot create a worktree: not in a git repository and no WorktreeCreate hooks are configured. Configure WorktreeCreate/WorktreeRemove hooks in settings.json to use worktree isolation with other VCS systems.");
    let originalBranch = await getBranch(), createStart = Date.now(), { worktreePath, worktreeBranch, headCommit, existed } = await getOrCreateWorktree(gitRoot, slug, options2), creationDurationMs;
    if (existed)
      logForDebugging(`Resuming existing worktree at: ${worktreePath}`);
    else
      logForDebugging(`Created worktree at: ${worktreePath} on branch: ${worktreeBranch}`), await performPostCreationSetup(gitRoot, worktreePath), creationDurationMs = Date.now() - createStart;
    currentWorktreeSession = {
      originalCwd,
      worktreePath,
      worktreeName: slug,
      worktreeBranch,
      originalBranch,
      originalHeadCommit: headCommit,
      sessionId,
      tmuxSessionName,
      creationDurationMs,
      usedSparsePaths: (getInitialSettings().worktree?.sparsePaths?.length ?? 0) > 0
    };
  }
  return saveCurrentProjectConfig((current) => ({
    ...current,
    activeWorktreeSession: currentWorktreeSession ?? void 0
  })), currentWorktreeSession;
}
