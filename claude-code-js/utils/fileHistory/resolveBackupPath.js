// function: resolveBackupPath
function resolveBackupPath(backupFileName, sessionId) {
  let configDir = getClaudeConfigHomeDir();
  return join74(configDir, "file-history", sessionId || getSessionId(), backupFileName);
}
