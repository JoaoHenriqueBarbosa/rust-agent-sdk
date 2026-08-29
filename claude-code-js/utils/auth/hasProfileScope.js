// function: hasProfileScope
function hasProfileScope() {
  return getClaudeAIOAuthTokens()?.scopes?.includes(CLAUDE_AI_PROFILE_SCOPE) ?? !1;
}
