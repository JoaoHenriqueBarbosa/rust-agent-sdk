// Original: src/utils/getWorktreePaths.ts
import { sep as sep28 } from "path";
async function getWorktreePaths(cwd2) {
  let startTime = Date.now(), { stdout, code } = await execFileNoThrowWithCwd(gitExe(), ["worktree", "list", "--porcelain"], {
    cwd: cwd2,
    preserveOutputOnError: !1
  }), durationMs = Date.now() - startTime;
  if (code !== 0)
    return logEvent("tengu_worktree_detection", {
      duration_ms: durationMs,
      worktree_count: 0,
      success: !1
    }), [];
  let worktreePaths = stdout.split(`
`).filter((line) => line.startsWith("worktree ")).map((line) => line.slice(9).normalize("NFC"));
  logEvent("tengu_worktree_detection", {
    duration_ms: durationMs,
    worktree_count: worktreePaths.length,
    success: !0
  });
  let currentWorktree = worktreePaths.find((path25) => cwd2 === path25 || cwd2.startsWith(path25 + sep28)), otherWorktrees = worktreePaths.filter((path25) => path25 !== currentWorktree).sort((a2, b) => a2.localeCompare(b));
  return currentWorktree ? [currentWorktree, ...otherWorktrees] : otherWorktrees;
}
var init_getWorktreePaths = __esm(() => {
  init_execFileNoThrow();
  init_git();
});
