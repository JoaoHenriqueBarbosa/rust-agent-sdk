// Original: src/hooks/useApiKeyVerification.ts
function useApiKeyVerification() {
  let [status2, setStatus] = import_react263.useState(() => {
    if (!isAnthropicAuthEnabled() || isClaudeAISubscriber())
      return "valid";
    let { key: key3, source } = getAnthropicApiKeyWithSource({
      skipRetrievingKeyFromApiKeyHelper: !0
    });
    if (key3 || source === "apiKeyHelper")
      return "loading";
    return "missing";
  }), [error44, setError] = import_react263.useState(null), verify = import_react263.useCallback(async () => {
    if (!isAnthropicAuthEnabled() || isClaudeAISubscriber()) {
      setStatus("valid");
      return;
    }
    await getApiKeyFromApiKeyHelper(getIsNonInteractiveSession());
    let { key: apiKey, source } = getAnthropicApiKeyWithSource();
    if (!apiKey) {
      if (source === "apiKeyHelper") {
        setStatus("error"), setError(Error("API key helper did not return a valid key"));
        return;
      }
      setStatus("missing");
      return;
    }
    try {
      let newStatus = await verifyApiKey(apiKey, !1) ? "valid" : "invalid";
      setStatus(newStatus);
      return;
    } catch (error45) {
      setError(error45), setStatus("error");
      return;
    }
  }, []);
  return {
    status: status2,
    reverify: verify,
    error: error44
  };
}
var import_react263;
var init_useApiKeyVerification = __esm(() => {
  init_state();
  init_claude();
  init_auth14();
  import_react263 = __toESM(require_react_development(), 1);
});
