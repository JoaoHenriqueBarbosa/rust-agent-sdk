// function: keepWorktree
async function keepWorktree() {
  if (!currentWorktreeSession)
    return;
  try {
    let { worktreePath, originalCwd, worktreeBranch } = currentWorktreeSession;
    process.chdir(originalCwd), currentWorktreeSession = null, saveCurrentProjectConfig((current) => ({
      ...current,
      activeWorktreeSession: void 0
    })), logForDebugging(`Linked worktree preserved at: ${worktreePath}${worktreeBranch ? ` on branch: ${worktreeBranch}` : ""}`), logForDebugging(`You can continue working there by running: cd ${worktreePath}`);
  } catch (error44) {
    logForDebugging(`Error keeping worktree: ${error44}`, {
      level: "error"
    });
  }
}
