// Original: src/ink/clearTerminal.ts
function isWindowsTerminal() {
  return process.platform === "win32" && !!process.env.WT_SESSION;
}
function isMintty() {
  if (process.env.TERM_PROGRAM === "mintty")
    return !0;
  if (process.platform === "win32" && process.env.MSYSTEM)
    return !0;
  return !1;
}
function isModernWindowsTerminal() {
  if (isWindowsTerminal())
    return !0;
  if (process.platform === "win32" && process.env.TERM_PROGRAM === "vscode" && process.env.TERM_PROGRAM_VERSION)
    return !0;
  if (isMintty())
    return !0;
  return !1;
}
function getClearTerminalSequence() {
  if (process.platform === "win32")
    if (isModernWindowsTerminal())
      return ERASE_SCREEN + ERASE_SCROLLBACK + CURSOR_HOME;
    else
      return ERASE_SCREEN + CURSOR_HOME_WINDOWS;
  return ERASE_SCREEN + ERASE_SCROLLBACK + CURSOR_HOME;
}
var CURSOR_HOME_WINDOWS, clearTerminal;
var init_clearTerminal = __esm(() => {
  init_csi();
  CURSOR_HOME_WINDOWS = csi(0, "f");
  clearTerminal = getClearTerminalSequence();
});
