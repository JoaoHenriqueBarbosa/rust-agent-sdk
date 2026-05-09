// Original: src/ink/hooks/use-terminal-title.ts
function useTerminalTitle(title) {
  let writeRaw = import_react23.useContext(TerminalWriteContext);
  import_react23.useEffect(() => {
    if (title === null || !writeRaw)
      return;
    let clean = stripAnsi(title);
    if (process.platform === "win32")
      process.title = clean;
    else
      writeRaw(osc(OSC.SET_TITLE_AND_ICON, clean));
  }, [title, writeRaw]);
}
var import_react23;
var init_use_terminal_title = __esm(() => {
  init_strip_ansi();
  init_osc();
  init_useTerminalNotification();
  import_react23 = __toESM(require_react_development(), 1);
});
