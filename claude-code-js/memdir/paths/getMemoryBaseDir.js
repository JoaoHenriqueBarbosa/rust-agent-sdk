// function: getMemoryBaseDir
function getMemoryBaseDir() {
  if (process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR)
    return process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR;
  return getClaudeConfigHomeDir();
}
