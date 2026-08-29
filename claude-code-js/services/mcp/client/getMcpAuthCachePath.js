// function: getMcpAuthCachePath
function getMcpAuthCachePath() {
  return join58(getClaudeConfigHomeDir(), "mcp-needs-auth-cache.json");
}
