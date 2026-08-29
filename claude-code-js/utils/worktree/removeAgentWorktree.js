// function: removeAgentWorktree
async function removeAgentWorktree(worktreePath, worktreeBranch, gitRoot, hookBased) {
  if (hookBased) {
    let hookRan = await executeWorktreeRemoveHook(worktreePath);
    if (hookRan)
      logForDebugging(`Removed hook-based agent worktree at: ${worktreePath}`);
    else
      logForDebugging(`No WorktreeRemove hook configured, hook-based agent worktree left at: ${worktreePath}`, { level: "warn" });
    return hookRan;
  }
  if (!gitRoot)
    return logForDebugging("Cannot remove agent worktree: no git root provided", {
      level: "error"
    }), !1;
  let { code: removeCode, stderr: removeError } = await execFileNoThrowWithCwd(gitExe(), ["worktree", "remove", "--force", worktreePath], { cwd: gitRoot });
  if (removeCode !== 0)
    return logForDebugging(`Failed to remove agent worktree: ${removeError}`, {
      level: "error"
    }), !1;
  if (logForDebugging(`Removed agent worktree at: ${worktreePath}`), !worktreeBranch)
    return !0;
  let { code: deleteBranchCode, stderr: deleteBranchError } = await execFileNoThrowWithCwd(gitExe(), ["branch", "-D", worktreeBranch], {
    cwd: gitRoot
  });
  if (deleteBranchCode !== 0)
    logForDebugging(`Could not delete agent worktree branch: ${deleteBranchError}`, { level: "error" });
  return !0;
}
