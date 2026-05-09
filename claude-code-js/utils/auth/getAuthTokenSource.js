// function: getAuthTokenSource
function getAuthTokenSource() {
  if (process.env.ANTHROPIC_AUTH_TOKEN && !isManagedOAuthContext())
    return { source: "ANTHROPIC_AUTH_TOKEN", hasToken: !0 };
  if (process.env.CLAUDE_CODE_OAUTH_TOKEN)
    return { source: "CLAUDE_CODE_OAUTH_TOKEN", hasToken: !0 };
  if (getOAuthTokenFromFileDescriptor()) {
    if (process.env.CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR)
      return {
        source: "CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR",
        hasToken: !0
      };
    return {
      source: "CCR_OAUTH_TOKEN_FILE",
      hasToken: !0
    };
  }
  if (getConfiguredApiKeyHelper() && !isManagedOAuthContext())
    return { source: "apiKeyHelper", hasToken: !0 };
  let oauthTokens = getClaudeAIOAuthTokens();
  if (shouldUseClaudeAIAuth(oauthTokens?.scopes) && oauthTokens?.accessToken)
    return { source: "claude.ai", hasToken: !0 };
  return { source: "none", hasToken: !1 };
}
