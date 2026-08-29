// function: isClaudeAISubscriber
function isClaudeAISubscriber() {
  if (!isAnthropicAuthEnabled())
    return !1;
  return shouldUseClaudeAIAuth(getClaudeAIOAuthTokens()?.scopes);
}
