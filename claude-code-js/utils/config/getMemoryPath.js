// function: getMemoryPath
function getMemoryPath(memoryType) {
  let cwd2 = getOriginalCwd();
  switch (memoryType) {
    case "User":
      return join20(getClaudeConfigHomeDir(), "CLAUDE.md");
    case "Local":
      return join20(cwd2, "CLAUDE.local.md");
    case "Project":
      return join20(cwd2, "CLAUDE.md");
    case "Managed":
      return join20(getManagedFilePath(), "CLAUDE.md");
    case "AutoMem":
      return getAutoMemEntrypoint();
  }
  return "";
}
