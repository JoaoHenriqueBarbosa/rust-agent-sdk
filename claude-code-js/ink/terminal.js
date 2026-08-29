// Original: src/ink/terminal.ts
function isProgressReportingAvailable() {
  if (!process.stdout.isTTY)
    return !1;
  if (process.env.WT_SESSION)
    return !1;
  if (process.env.ConEmuANSI || process.env.ConEmuPID || process.env.ConEmuTask)
    return !0;
  let version5 = import_semver.coerce(process.env.TERM_PROGRAM_VERSION);
  if (!version5)
    return !1;
  if (process.env.TERM_PROGRAM === "ghostty")
    return gte(version5.version, "1.2.0");
  if (process.env.TERM_PROGRAM === "iTerm.app")
    return gte(version5.version, "3.6.6");
  return !1;
}
function isSynchronizedOutputSupported() {
  if (process.env.TMUX)
    return !1;
  let termProgram = process.env.TERM_PROGRAM, term = process.env.TERM;
  if (termProgram === "iTerm.app" || termProgram === "WezTerm" || termProgram === "WarpTerminal" || termProgram === "ghostty" || termProgram === "contour" || termProgram === "vscode" || termProgram === "alacritty")
    return !0;
  if (term?.includes("kitty") || process.env.KITTY_WINDOW_ID)
    return !0;
  if (term === "xterm-ghostty")
    return !0;
  if (term?.startsWith("foot"))
    return !0;
  if (term?.includes("alacritty"))
    return !0;
  if (process.env.ZED_TERM)
    return !0;
  if (process.env.WT_SESSION)
    return !0;
  let vteVersion = process.env.VTE_VERSION;
  if (vteVersion) {
    if (parseInt(vteVersion, 10) >= 6800)
      return !0;
  }
  return !1;
}
function setXtversionName(name3) {
  if (xtversionName === void 0)
    xtversionName = name3;
}
function isXtermJs() {
  if (process.env.TERM_PROGRAM === "vscode")
    return !0;
  return xtversionName?.startsWith("xterm.js") ?? !1;
}
function supportsExtendedKeys() {
  return EXTENDED_KEYS_TERMINALS.includes(env3.terminal ?? "");
}
function hasCursorUpViewportYankBug() {
  return process.platform === "win32" || !!process.env.WT_SESSION;
}
function writeDiffToTerminal(terminal, diff2, skipSyncMarkers = !1) {
  if (diff2.length === 0)
    return;
  let useSync = !skipSyncMarkers, buffer = useSync ? BSU : "";
  for (let patch of diff2)
    switch (patch.type) {
      case "stdout":
        buffer += patch.content;
        break;
      case "clear":
        if (patch.count > 0)
          buffer += eraseLines(patch.count);
        break;
      case "clearTerminal":
        buffer += getClearTerminalSequence();
        break;
      case "cursorHide":
        buffer += HIDE_CURSOR;
        break;
      case "cursorShow":
        buffer += SHOW_CURSOR;
        break;
      case "cursorMove":
        buffer += cursorMove(patch.x, patch.y);
        break;
      case "cursorTo":
        buffer += cursorTo(patch.col);
        break;
      case "carriageReturn":
        buffer += "\r";
        break;
      case "hyperlink":
        buffer += link(patch.uri);
        break;
      case "styleStr":
        buffer += patch.str;
        break;
    }
  if (useSync)
    buffer += ESU;
  terminal.stdout.write(buffer);
}
var import_semver, xtversionName, EXTENDED_KEYS_TERMINALS, SYNC_OUTPUT_SUPPORTED;
var init_terminal = __esm(() => {
  init_env();
  init_clearTerminal();
  init_csi();
  init_dec();
  init_osc();
  import_semver = __toESM(require_semver2(), 1);
  EXTENDED_KEYS_TERMINALS = [
    "iTerm.app",
    "kitty",
    "WezTerm",
    "ghostty",
    "tmux",
    "windows-terminal"
  ];
  SYNC_OUTPUT_SUPPORTED = isSynchronizedOutputSupported();
});
