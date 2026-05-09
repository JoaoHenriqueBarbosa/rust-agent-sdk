// function: getRateLimitTier
function getRateLimitTier() {
  if (!isAnthropicAuthEnabled())
    return null;
  let oauthTokens = getClaudeAIOAuthTokens();
  if (!oauthTokens)
    return null;
  return oauthTokens.rateLimitTier ?? null;
}
