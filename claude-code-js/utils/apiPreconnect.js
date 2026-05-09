// Original: src/utils/apiPreconnect.ts
function preconnectAnthropicApi() {
  if (fired)
    return;
  if (fired = !0, isEnvTruthy(process.env.CLAUDE_CODE_USE_BEDROCK) || isEnvTruthy(process.env.CLAUDE_CODE_USE_VERTEX) || isEnvTruthy(process.env.CLAUDE_CODE_USE_FOUNDRY))
    return;
  if (process.env.HTTPS_PROXY || process.env.https_proxy || process.env.HTTP_PROXY || process.env.http_proxy || process.env.ANTHROPIC_UNIX_SOCKET || process.env.CLAUDE_CODE_CLIENT_CERT || process.env.CLAUDE_CODE_CLIENT_KEY)
    return;
  let baseUrl = process.env.ANTHROPIC_BASE_URL || getOauthConfig().BASE_API_URL;
  fetch(baseUrl, {
    method: "HEAD",
    signal: AbortSignal.timeout(1e4)
  }).catch(() => {});
}
var fired = !1;
var init_apiPreconnect = __esm(() => {
  init_oauth();
  init_envUtils();
});
