// Original: src/utils/crossProjectResume.ts
import { sep as sep29 } from "path";
function checkCrossProjectResume(log3, showAllProjects, worktreePaths) {
  let currentCwd2 = getOriginalCwd();
  if (!showAllProjects || !log3.projectPath || log3.projectPath === currentCwd2)
    return { isCrossProject: !1 };
  {
    let sessionId2 = getSessionIdFromLog(log3);
    return {
      isCrossProject: !0,
      isSameRepoWorktree: !1,
      command: `cd ${quote([log3.projectPath])} && claude --resume ${sessionId2}`,
      projectPath: log3.projectPath
    };
  }
  if (worktreePaths.some((wt) => log3.projectPath === wt || log3.projectPath.startsWith(wt + sep29)))
    return {
      isCrossProject: !0,
      isSameRepoWorktree: !0,
      projectPath: log3.projectPath
    };
  let sessionId = getSessionIdFromLog(log3);
  return {
    isCrossProject: !0,
    isSameRepoWorktree: !1,
    command: `cd ${quote([log3.projectPath])} && claude --resume ${sessionId}`,
    projectPath: log3.projectPath
  };
}
var init_crossProjectResume = __esm(() => {
  init_state();
  init_shellQuote();
  init_sessionStorage();
});
