// Original: src/utils/model/providers.ts
function getAPIProvider() {
  return isEnvTruthy(process.env.CLAUDE_CODE_USE_BEDROCK) ? "bedrock" : isEnvTruthy(process.env.CLAUDE_CODE_USE_VERTEX) ? "vertex" : isEnvTruthy(process.env.CLAUDE_CODE_USE_FOUNDRY) ? "foundry" : "firstParty";
}
function getAPIProviderForStatsig() {
  return getAPIProvider();
}
function isFirstPartyAnthropicBaseUrl() {
  let baseUrl = process.env.ANTHROPIC_BASE_URL;
  if (!baseUrl)
    return !0;
  try {
    let host = new URL(baseUrl).host;
    return ["api.anthropic.com"].includes(host);
  } catch {
    return !1;
  }
}
var init_providers = __esm(() => {
  init_envUtils();
});
