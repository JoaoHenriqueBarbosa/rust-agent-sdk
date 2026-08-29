// function: isClaudeConfigFilePath
function isClaudeConfigFilePath(filePath) {
  if (isClaudeSettingsPath(filePath))
    return !0;
  let commandsDir = join136(getOriginalCwd(), ".claude", "commands"), agentsDir = join136(getOriginalCwd(), ".claude", "agents"), skillsDir = join136(getOriginalCwd(), ".claude", "skills");
  return pathInWorkingPath(filePath, commandsDir) || pathInWorkingPath(filePath, agentsDir) || pathInWorkingPath(filePath, skillsDir);
}
