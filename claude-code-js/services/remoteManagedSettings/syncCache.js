// Original: src/services/remoteManagedSettings/syncCache.ts
function resetSyncCache2() {
  cached2 = void 0, resetSyncCache();
}
function isRemoteManagedSettingsEligible() {
  if (cached2 !== void 0)
    return cached2;
  if (getAPIProvider() !== "firstParty")
    return cached2 = setEligibility(!1);
  if (!isFirstPartyAnthropicBaseUrl())
    return cached2 = setEligibility(!1);
  if (process.env.CLAUDE_CODE_ENTRYPOINT === "local-agent")
    return cached2 = setEligibility(!1);
  let tokens = getClaudeAIOAuthTokens();
  if (tokens?.accessToken && tokens.subscriptionType === null)
    return cached2 = setEligibility(!0);
  if (tokens?.accessToken && tokens.scopes?.includes(CLAUDE_AI_INFERENCE_SCOPE) && (tokens.subscriptionType === "enterprise" || tokens.subscriptionType === "team"))
    return cached2 = setEligibility(!0);
  try {
    let { key: apiKey } = getAnthropicApiKeyWithSource({
      skipRetrievingKeyFromApiKeyHelper: !0
    });
    if (apiKey)
      return cached2 = setEligibility(!0);
  } catch {}
  return cached2 = setEligibility(!1);
}
var cached2;
var init_syncCache = __esm(() => {
  init_oauth();
  init_auth14();
  init_providers();
  init_syncCacheState();
});
