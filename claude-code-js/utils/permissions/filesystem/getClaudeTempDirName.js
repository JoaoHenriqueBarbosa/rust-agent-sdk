// function: getClaudeTempDirName
function getClaudeTempDirName() {
  if (getPlatform() === "windows")
    return "claude";
  return `claude-${process.getuid?.() ?? 0}`;
}
