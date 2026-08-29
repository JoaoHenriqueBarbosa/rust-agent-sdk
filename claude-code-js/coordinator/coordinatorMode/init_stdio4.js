// var: init_stdio4
var init_stdio4 = __esm(() => {
  init_stdio();
  import_cross_spawn2 = __toESM(require_cross_spawn(), 1), DEFAULT_INHERITED_ENV_VARS = process22.platform === "win32" ? [
    "APPDATA",
    "HOMEDRIVE",
    "HOMEPATH",
    "LOCALAPPDATA",
    "PATH",
    "PROCESSOR_ARCHITECTURE",
    "SYSTEMDRIVE",
    "SYSTEMROOT",
    "TEMP",
    "USERNAME",
    "USERPROFILE",
    "PROGRAMFILES"
  ] : ["HOME", "LOGNAME", "PATH", "SHELL", "TERM", "USER"];
});
