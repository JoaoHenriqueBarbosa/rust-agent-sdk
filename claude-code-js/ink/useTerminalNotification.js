// Original: src/ink/useTerminalNotification.ts
function useTerminalNotification() {
  let writeRaw = import_react11.useContext(TerminalWriteContext);
  if (!writeRaw)
    throw Error("useTerminalNotification must be used within TerminalWriteProvider");
  let notifyITerm2 = import_react11.useCallback(({ message, title }) => {
    let displayString = title ? `${title}:
${message}` : message;
    writeRaw(wrapForMultiplexer(osc(OSC.ITERM2, `

${displayString}`)));
  }, [writeRaw]), notifyKitty = import_react11.useCallback(({
    message,
    title,
    id
  }) => {
    writeRaw(wrapForMultiplexer(osc(OSC.KITTY, `i=${id}:d=0:p=title`, title))), writeRaw(wrapForMultiplexer(osc(OSC.KITTY, `i=${id}:p=body`, message))), writeRaw(wrapForMultiplexer(osc(OSC.KITTY, `i=${id}:d=1:a=focus`, "")));
  }, [writeRaw]), notifyGhostty = import_react11.useCallback(({ message, title }) => {
    writeRaw(wrapForMultiplexer(osc(OSC.GHOSTTY, "notify", title, message)));
  }, [writeRaw]), notifyBell = import_react11.useCallback(() => {
    writeRaw(BEL);
  }, [writeRaw]), progress = import_react11.useCallback((state3, percentage) => {
    if (!isProgressReportingAvailable())
      return;
    if (!state3) {
      writeRaw(wrapForMultiplexer(osc(OSC.ITERM2, ITERM2.PROGRESS, PROGRESS.CLEAR, "")));
      return;
    }
    let pct = Math.max(0, Math.min(100, Math.round(percentage ?? 0)));
    switch (state3) {
      case "completed":
        writeRaw(wrapForMultiplexer(osc(OSC.ITERM2, ITERM2.PROGRESS, PROGRESS.CLEAR, "")));
        break;
      case "error":
        writeRaw(wrapForMultiplexer(osc(OSC.ITERM2, ITERM2.PROGRESS, PROGRESS.ERROR, pct)));
        break;
      case "indeterminate":
        writeRaw(wrapForMultiplexer(osc(OSC.ITERM2, ITERM2.PROGRESS, PROGRESS.INDETERMINATE, "")));
        break;
      case "running":
        writeRaw(wrapForMultiplexer(osc(OSC.ITERM2, ITERM2.PROGRESS, PROGRESS.SET, pct)));
        break;
      case null:
        break;
    }
  }, [writeRaw]);
  return import_react11.useMemo(() => ({ notifyITerm2, notifyKitty, notifyGhostty, notifyBell, progress }), [notifyITerm2, notifyKitty, notifyGhostty, notifyBell, progress]);
}
var import_react11, TerminalWriteContext, TerminalWriteProvider;
var init_useTerminalNotification = __esm(() => {
  init_terminal();
  init_ansi();
  init_osc();
  import_react11 = __toESM(require_react_development(), 1), TerminalWriteContext = import_react11.createContext(null), TerminalWriteProvider = TerminalWriteContext.Provider;
});
