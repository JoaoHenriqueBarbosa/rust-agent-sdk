// function: isManagedOAuthContext
function isManagedOAuthContext() {
  return isEnvTruthy(process.env.CLAUDE_CODE_REMOTE) || process.env.CLAUDE_CODE_ENTRYPOINT === "claude-desktop";
}
