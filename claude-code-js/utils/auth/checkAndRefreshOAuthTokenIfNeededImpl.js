// function: checkAndRefreshOAuthTokenIfNeededImpl
async function checkAndRefreshOAuthTokenIfNeededImpl(retryCount, force) {
  await invalidateOAuthCacheIfDiskChanged();
  let tokens = getClaudeAIOAuthTokens();
  if (!force) {
    if (!tokens?.refreshToken || !isOAuthTokenExpired(tokens.expiresAt))
      return !1;
  }
  if (!tokens?.refreshToken)
    return !1;
  if (!shouldUseClaudeAIAuth(tokens.scopes))
    return !1;
  getClaudeAIOAuthTokens.cache?.clear?.(), clearKeychainCache();
  let freshTokens = await getClaudeAIOAuthTokensAsync();
  if (!freshTokens?.refreshToken || !isOAuthTokenExpired(freshTokens.expiresAt))
    return !1;
  let claudeDir = getClaudeConfigHomeDir();
  await mkdir4(claudeDir, { recursive: !0 });
  let release;
  try {
    logEvent("tengu_oauth_token_refresh_lock_acquiring", {}), release = await lock(claudeDir), logEvent("tengu_oauth_token_refresh_lock_acquired", {});
  } catch (err) {
    if (err.code === "ELOCKED") {
      if (retryCount < 5)
        return logEvent("tengu_oauth_token_refresh_lock_retry", {
          retryCount: retryCount + 1
        }), await sleep3(1000 + Math.random() * 1000), checkAndRefreshOAuthTokenIfNeededImpl(retryCount + 1, force);
      return logEvent("tengu_oauth_token_refresh_lock_retry_limit_reached", {
        maxRetries: 5
      }), !1;
    }
    return logError2(err), logEvent("tengu_oauth_token_refresh_lock_error", {
      error: errorMessage(err)
    }), !1;
  }
  try {
    getClaudeAIOAuthTokens.cache?.clear?.(), clearKeychainCache();
    let lockedTokens = await getClaudeAIOAuthTokensAsync();
    if (!lockedTokens?.refreshToken || !isOAuthTokenExpired(lockedTokens.expiresAt))
      return logEvent("tengu_oauth_token_refresh_race_resolved", {}), !1;
    logEvent("tengu_oauth_token_refresh_starting", {});
    let refreshedTokens = await refreshOAuthToken(lockedTokens.refreshToken, {
      scopes: shouldUseClaudeAIAuth(lockedTokens.scopes) ? void 0 : lockedTokens.scopes
    });
    return saveOAuthTokensIfNeeded(refreshedTokens), getClaudeAIOAuthTokens.cache?.clear?.(), clearKeychainCache(), !0;
  } catch (error44) {
    logError2(error44), getClaudeAIOAuthTokens.cache?.clear?.(), clearKeychainCache();
    let currentTokens = await getClaudeAIOAuthTokensAsync();
    if (currentTokens && !isOAuthTokenExpired(currentTokens.expiresAt))
      return logEvent("tengu_oauth_token_refresh_race_recovered", {}), !0;
    return !1;
  } finally {
    logEvent("tengu_oauth_token_refresh_lock_releasing", {}), await release(), logEvent("tengu_oauth_token_refresh_lock_released", {});
  }
}
