// Original: src/utils/fullscreen.ts
import { spawnSync as spawnSync2 } from "child_process";
function isTmuxControlModeEnvHeuristic() {
  if (!process.env.TMUX)
    return !1;
  if (process.env.TERM_PROGRAM !== "iTerm.app")
    return !1;
  let term = process.env.TERM ?? "";
  return !term.startsWith("screen") && !term.startsWith("tmux");
}
function probeTmuxControlModeSync() {
  if (tmuxControlModeProbed = isTmuxControlModeEnvHeuristic(), tmuxControlModeProbed)
    return;
  if (!process.env.TMUX)
    return;
  if (process.env.TERM_PROGRAM)
    return;
  let result;
  try {
    result = spawnSync2("tmux", ["display-message", "-p", "#{client_control_mode}"], { encoding: "utf8", timeout: 2000 });
  } catch {
    return;
  }
  if (result.status !== 0)
    return;
  tmuxControlModeProbed = result.stdout.trim() === "1";
}
function isTmuxControlMode() {
  if (tmuxControlModeProbed === void 0)
    probeTmuxControlModeSync();
  return tmuxControlModeProbed ?? !1;
}
function isFullscreenEnvEnabled() {
  if (isEnvDefinedFalsy(process.env.CLAUDE_CODE_NO_FLICKER))
    return !1;
  if (isEnvTruthy(process.env.CLAUDE_CODE_NO_FLICKER))
    return !0;
  if (isTmuxControlMode()) {
    if (!loggedTmuxCcDisable)
      loggedTmuxCcDisable = !0, logForDebugging("fullscreen disabled: tmux -CC (iTerm2 integration mode) detected \xB7 set CLAUDE_CODE_NO_FLICKER=1 to override");
    return !1;
  }
  return !1;
}
function isMouseTrackingEnabled() {
  return !isEnvTruthy(process.env.CLAUDE_CODE_DISABLE_MOUSE);
}
function isMouseClicksDisabled() {
  return isEnvTruthy(process.env.CLAUDE_CODE_DISABLE_MOUSE_CLICKS);
}
function isFullscreenActive() {
  return getIsInteractive() && isFullscreenEnvEnabled();
}
async function maybeGetTmuxMouseHint() {
  if (!process.env.TMUX)
    return null;
  if (!isFullscreenActive() || isTmuxControlMode())
    return null;
  if (checkedTmuxMouseHint)
    return null;
  checkedTmuxMouseHint = !0;
  let { stdout, code } = await execFileNoThrow("tmux", ["show", "-Av", "mouse"], { useCwd: !1, timeout: 2000 });
  if (code !== 0 || stdout.trim() === "on")
    return null;
  return "tmux detected \xB7 scroll with PgUp/PgDn \xB7 or add 'set -g mouse on' to ~/.tmux.conf for wheel scroll";
}
var loggedTmuxCcDisable = !1, checkedTmuxMouseHint = !1, tmuxControlModeProbed;
var init_fullscreen = __esm(() => {
  init_state();
  init_debug();
  init_envUtils();
  init_execFileNoThrow();
});
