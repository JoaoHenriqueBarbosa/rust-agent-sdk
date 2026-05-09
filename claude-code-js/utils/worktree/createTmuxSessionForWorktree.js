// function: createTmuxSessionForWorktree
async function createTmuxSessionForWorktree(sessionName, worktreePath) {
  let { code, stderr } = await execFileNoThrow("tmux", [
    "new-session",
    "-d",
    "-s",
    sessionName,
    "-c",
    worktreePath
  ]);
  if (code !== 0)
    return { created: !1, error: stderr };
  return { created: !0 };
}
