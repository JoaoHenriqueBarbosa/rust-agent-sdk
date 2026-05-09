// function: createAgentWorktree
async function createAgentWorktree(slug) {
  if (validateWorktreeSlug(slug), hasWorktreeCreateHook()) {
    let hookResult = await executeWorktreeCreateHook(slug);
    return logForDebugging(`Created hook-based agent worktree at: ${hookResult.worktreePath}`), { worktreePath: hookResult.worktreePath, hookBased: !0 };
  }
  let gitRoot = findCanonicalGitRoot(getCwd());
  if (!gitRoot)
    throw Error("Cannot create agent worktree: not in a git repository and no WorktreeCreate hooks are configured. Configure WorktreeCreate/WorktreeRemove hooks in settings.json to use worktree isolation with other VCS systems.");
  let { worktreePath, worktreeBranch, headCommit, existed } = await getOrCreateWorktree(gitRoot, slug);
  if (!existed)
    logForDebugging(`Created agent worktree at: ${worktreePath} on branch: ${worktreeBranch}`), await performPostCreationSetup(gitRoot, worktreePath);
  else {
    let now2 = /* @__PURE__ */ new Date;
    await utimes2(worktreePath, now2, now2), logForDebugging(`Resuming existing agent worktree at: ${worktreePath}`);
  }
  return { worktreePath, worktreeBranch, headCommit, gitRoot };
}
