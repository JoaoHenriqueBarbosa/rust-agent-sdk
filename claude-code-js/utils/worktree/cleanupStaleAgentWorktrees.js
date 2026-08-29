// function: cleanupStaleAgentWorktrees
async function cleanupStaleAgentWorktrees(cutoffDate) {
  let gitRoot = findCanonicalGitRoot(getCwd());
  if (!gitRoot)
    return 0;
  let dir = worktreesDir(gitRoot), entries2;
  try {
    entries2 = await readdir28(dir);
  } catch {
    return 0;
  }
  let cutoffMs = cutoffDate.getTime(), currentPath = currentWorktreeSession?.worktreePath, removed = 0;
  for (let slug of entries2) {
    if (!EPHEMERAL_WORKTREE_PATTERNS.some((p4) => p4.test(slug)))
      continue;
    let worktreePath = join138(dir, slug);
    if (currentPath === worktreePath)
      continue;
    let mtimeMs;
    try {
      mtimeMs = (await stat41(worktreePath)).mtimeMs;
    } catch {
      continue;
    }
    if (mtimeMs >= cutoffMs)
      continue;
    let [status2, unpushed] = await Promise.all([
      execFileNoThrowWithCwd(gitExe(), ["--no-optional-locks", "status", "--porcelain", "-uno"], { cwd: worktreePath }),
      execFileNoThrowWithCwd(gitExe(), ["rev-list", "--max-count=1", "HEAD", "--not", "--remotes"], { cwd: worktreePath })
    ]);
    if (status2.code !== 0 || status2.stdout.trim().length > 0)
      continue;
    if (unpushed.code !== 0 || unpushed.stdout.trim().length > 0)
      continue;
    if (await removeAgentWorktree(worktreePath, worktreeBranchName(slug), gitRoot))
      removed++;
  }
  if (removed > 0)
    await execFileNoThrowWithCwd(gitExe(), ["worktree", "prune"], {
      cwd: gitRoot
    }), logForDebugging(`cleanupStaleAgentWorktrees: removed ${removed} stale worktree(s)`);
  return removed;
}
