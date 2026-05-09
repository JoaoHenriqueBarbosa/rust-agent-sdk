// function: getAnthropicApiKeyWithSource
function getAnthropicApiKeyWithSource(opts = {}) {
  let apiKeyEnv = isRunningOnHomespace() ? void 0 : process.env.ANTHROPIC_API_KEY;
  if (preferThirdPartyAuthentication() && apiKeyEnv)
    return {
      key: apiKeyEnv,
      source: "ANTHROPIC_API_KEY"
    };
  if (isEnvTruthy(process.env.CI)) {
    let apiKeyFromFd2 = getApiKeyFromFileDescriptor();
    if (apiKeyFromFd2)
      return {
        key: apiKeyFromFd2,
        source: "ANTHROPIC_API_KEY"
      };
    if (!apiKeyEnv && !process.env.CLAUDE_CODE_OAUTH_TOKEN && !process.env.CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR)
      throw Error("ANTHROPIC_API_KEY or CLAUDE_CODE_OAUTH_TOKEN env var is required");
    if (apiKeyEnv)
      return {
        key: apiKeyEnv,
        source: "ANTHROPIC_API_KEY"
      };
    return {
      key: null,
      source: "none"
    };
  }
  if (apiKeyEnv && getGlobalConfig().customApiKeyResponses?.approved?.includes(normalizeApiKeyForConfig(apiKeyEnv)))
    return {
      key: apiKeyEnv,
      source: "ANTHROPIC_API_KEY"
    };
  let apiKeyFromFd = getApiKeyFromFileDescriptor();
  if (apiKeyFromFd)
    return {
      key: apiKeyFromFd,
      source: "ANTHROPIC_API_KEY"
    };
  if (getConfiguredApiKeyHelper()) {
    if (opts.skipRetrievingKeyFromApiKeyHelper)
      return {
        key: null,
        source: "apiKeyHelper"
      };
    return {
      key: getApiKeyFromApiKeyHelperCached(),
      source: "apiKeyHelper"
    };
  }
  let apiKeyFromConfigOrMacOSKeychain = getApiKeyFromConfigOrMacOSKeychain();
  if (apiKeyFromConfigOrMacOSKeychain)
    return apiKeyFromConfigOrMacOSKeychain;
  return {
    key: null,
    source: "none"
  };
}
