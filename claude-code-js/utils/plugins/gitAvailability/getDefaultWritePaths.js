// function: getDefaultWritePaths
function getDefaultWritePaths() {
  let homeDir = homedir14();
  return [
    "/dev/stdout",
    "/dev/stderr",
    "/dev/null",
    "/dev/tty",
    "/dev/dtracehelper",
    "/dev/autofs_nowait",
    "/tmp/claude",
    "/private/tmp/claude",
    path13.join(homeDir, ".npm/_logs"),
    path13.join(homeDir, ".claude/debug")
  ];
}
