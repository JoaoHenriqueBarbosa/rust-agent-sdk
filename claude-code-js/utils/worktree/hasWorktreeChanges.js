// function: hasWorktreeChanges
async function hasWorktreeChanges(worktreePath, headCommit) {
  let { code: statusCode, stdout: statusOutput } = await execFileNoThrowWithCwd(gitExe(), ["status", "--porcelain"], {
    cwd: worktreePath
  });
  if (statusCode !== 0)
    return !0;
  if (statusOutput.trim().length > 0)
    return !0;
  let { code: revListCode, stdout: revListOutput } = await execFileNoThrowWithCwd(gitExe(), ["rev-list", "--count", `${headCommit}..HEAD`], { cwd: worktreePath });
  if (revListCode !== 0)
    return !0;
  if (parseInt(revListOutput.trim(), 10) > 0)
    return !0;
  return !1;
}
