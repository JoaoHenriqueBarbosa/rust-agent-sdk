// function: cleanupWorktree
async function cleanupWorktree() {
  if (!currentWorktreeSession)
    return;
  try {
    let { worktreePath, originalCwd, worktreeBranch, hookBased } = currentWorktreeSession;
    if (process.chdir(originalCwd), hookBased)
      if (await executeWorktreeRemoveHook(worktreePath))
        logForDebugging(`Removed hook-based worktree at: ${worktreePath}`);
      else
        logForDebugging(`No WorktreeRemove hook configured, hook-based worktree left at: ${worktreePath}`, { level: "warn" });
    else {
      let { code: removeCode, stderr: removeError } = await execFileNoThrowWithCwd(gitExe(), ["worktree", "remove", "--force", worktreePath], { cwd: originalCwd });
      if (removeCode !== 0)
        logForDebugging(`Failed to remove linked worktree: ${removeError}`, {
          level: "error"
        });
      else
        logForDebugging(`Removed linked worktree at: ${worktreePath}`);
    }
    if (currentWorktreeSession = null, saveCurrentProjectConfig((current) => ({
      ...current,
      activeWorktreeSession: void 0
    })), !hookBased && worktreeBranch) {
      await sleep3(100);
      let { code: deleteBranchCode, stderr: deleteBranchError } = await execFileNoThrowWithCwd(gitExe(), ["branch", "-D", worktreeBranch], { cwd: originalCwd });
      if (deleteBranchCode !== 0)
        logForDebugging(`Could not delete worktree branch: ${deleteBranchError}`, { level: "error" });
      else
        logForDebugging(`Deleted worktree branch: ${worktreeBranch}`);
    }
    logForDebugging("Linked worktree cleaned up completely");
  } catch (error44) {
    logForDebugging(`Error cleaning up worktree: ${error44}`, {
      level: "error"
    });
  }
}
