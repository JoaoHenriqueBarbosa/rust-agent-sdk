// Original: src/services/api/usage.ts
async function fetchUtilization() {
  if (!isClaudeAISubscriber() || !hasProfileScope())
    return {};
  let tokens = getClaudeAIOAuthTokens();
  if (tokens && isOAuthTokenExpired(tokens.expiresAt))
    return null;
  let authResult = getAuthHeaders();
  if (authResult.error)
    throw Error(`Auth error: ${authResult.error}`);
  let headers = {
    "Content-Type": "application/json",
    "User-Agent": getClaudeCodeUserAgent(),
    ...authResult.headers
  }, url3 = `${getOauthConfig().BASE_API_URL}/api/oauth/usage`;
  return (await axios_default.get(url3, {
    headers,
    timeout: 5000
  })).data;
}
var init_usage = __esm(() => {
  init_axios2();
  init_oauth();
  init_auth14();
  init_http6();
  init_client8();
});
