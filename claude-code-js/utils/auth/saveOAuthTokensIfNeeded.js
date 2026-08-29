// function: saveOAuthTokensIfNeeded
function saveOAuthTokensIfNeeded(tokens) {
  if (!shouldUseClaudeAIAuth(tokens.scopes))
    return logEvent("tengu_oauth_tokens_not_claude_ai", {}), { success: !0 };
  if (!tokens.refreshToken || !tokens.expiresAt)
    return logEvent("tengu_oauth_tokens_inference_only", {}), { success: !0 };
  let secureStorage = getSecureStorage(), storageBackend = secureStorage.name;
  try {
    let storageData = secureStorage.read() || {}, existingOauth = storageData.claudeAiOauth;
    storageData.claudeAiOauth = {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt: tokens.expiresAt,
      scopes: tokens.scopes,
      subscriptionType: tokens.subscriptionType ?? existingOauth?.subscriptionType ?? null,
      rateLimitTier: tokens.rateLimitTier ?? existingOauth?.rateLimitTier ?? null
    };
    let updateStatus = secureStorage.update(storageData);
    if (updateStatus.success)
      logEvent("tengu_oauth_tokens_saved", { storageBackend });
    else
      logEvent("tengu_oauth_tokens_save_failed", { storageBackend });
    return getClaudeAIOAuthTokens.cache?.clear?.(), clearBetasCaches(), clearToolSchemaCache(), updateStatus;
  } catch (error44) {
    return logError2(error44), logEvent("tengu_oauth_tokens_save_exception", {
      storageBackend,
      error: errorMessage(error44)
    }), { success: !1, warning: "Failed to save OAuth tokens" };
  }
}
