// function: clearOAuthTokenCache
function clearOAuthTokenCache() {
  getClaudeAIOAuthTokens.cache?.clear?.(), clearKeychainCache();
}
