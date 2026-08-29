// var: init_signals2
var init_signals2 = __esm(() => {
  signals = [];
  signals.push("SIGHUP", "SIGINT", "SIGTERM");
  if (process.platform !== "win32")
    signals.push("SIGALRM", "SIGABRT", "SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
  if (process.platform === "linux")
    signals.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT");
});
