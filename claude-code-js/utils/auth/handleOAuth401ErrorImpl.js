// function: handleOAuth401ErrorImpl
async function handleOAuth401ErrorImpl(failedAccessToken) {
  clearOAuthTokenCache();
  let currentTokens = await getClaudeAIOAuthTokensAsync();
  if (!currentTokens?.refreshToken)
    return !1;
  if (currentTokens.accessToken !== failedAccessToken)
    return logEvent("tengu_oauth_401_recovered_from_keychain", {}), !0;
  return checkAndRefreshOAuthTokenIfNeeded(0, !0);
}
