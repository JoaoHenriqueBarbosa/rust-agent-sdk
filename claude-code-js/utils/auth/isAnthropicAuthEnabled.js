// function: isAnthropicAuthEnabled
function isAnthropicAuthEnabled() {
  if (process.env.ANTHROPIC_UNIX_SOCKET)
    return !!process.env.CLAUDE_CODE_OAUTH_TOKEN;
  let is3P = isEnvTruthy(process.env.CLAUDE_CODE_USE_BEDROCK) || isEnvTruthy(process.env.CLAUDE_CODE_USE_VERTEX) || isEnvTruthy(process.env.CLAUDE_CODE_USE_FOUNDRY), apiKeyHelper = (getSettings_DEPRECATED() || {}).apiKeyHelper, hasExternalAuthToken = process.env.ANTHROPIC_AUTH_TOKEN || apiKeyHelper || process.env.CLAUDE_CODE_API_KEY_FILE_DESCRIPTOR, { source: apiKeySource } = getAnthropicApiKeyWithSource({
    skipRetrievingKeyFromApiKeyHelper: !0
  }), hasExternalApiKey = apiKeySource === "ANTHROPIC_API_KEY" || apiKeySource === "apiKeyHelper";
  return !(is3P || hasExternalAuthToken && !isManagedOAuthContext() || hasExternalApiKey && !isManagedOAuthContext());
}
