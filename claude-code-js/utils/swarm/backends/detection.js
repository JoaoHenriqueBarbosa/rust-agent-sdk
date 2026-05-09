// Original: src/utils/swarm/backends/detection.ts
var exports_detection = {};
__export(exports_detection, {
  resetDetectionCache: () => resetDetectionCache,
  isTmuxAvailable: () => isTmuxAvailable,
  isIt2CliAvailable: () => isIt2CliAvailable,
  isInsideTmuxSync: () => isInsideTmuxSync,
  isInsideTmux: () => isInsideTmux,
  isInITerm2: () => isInITerm2,
  getLeaderPaneId: () => getLeaderPaneId,
  IT2_COMMAND: () => IT2_COMMAND
});
function isInsideTmuxSync() {
  return !!ORIGINAL_USER_TMUX;
}
async function isInsideTmux() {
  if (isInsideTmuxCached !== null)
    return isInsideTmuxCached;
  return isInsideTmuxCached = !!ORIGINAL_USER_TMUX, isInsideTmuxCached;
}
function getLeaderPaneId() {
  return ORIGINAL_TMUX_PANE || null;
}
async function isTmuxAvailable() {
  return (await execFileNoThrow(TMUX_COMMAND, ["-V"])).code === 0;
}
function isInITerm2() {
  if (isInITerm2Cached !== null)
    return isInITerm2Cached;
  let termProgram = process.env.TERM_PROGRAM, hasItermSessionId = !!process.env.ITERM_SESSION_ID, terminalIsITerm = env3.terminal === "iTerm.app";
  return isInITerm2Cached = termProgram === "iTerm.app" || hasItermSessionId || terminalIsITerm, isInITerm2Cached;
}
async function isIt2CliAvailable() {
  return (await execFileNoThrow(IT2_COMMAND, ["session", "list"])).code === 0;
}
function resetDetectionCache() {
  isInsideTmuxCached = null, isInITerm2Cached = null;
}
var ORIGINAL_USER_TMUX, ORIGINAL_TMUX_PANE, isInsideTmuxCached = null, isInITerm2Cached = null, IT2_COMMAND = "it2";
var init_detection = __esm(() => {
  init_env();
  init_execFileNoThrow();
  ORIGINAL_USER_TMUX = process.env.TMUX, ORIGINAL_TMUX_PANE = process.env.TMUX_PANE;
});
