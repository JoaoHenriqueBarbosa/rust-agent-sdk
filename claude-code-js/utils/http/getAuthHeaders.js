// function: getAuthHeaders
function getAuthHeaders() {
  if (isClaudeAISubscriber()) {
    let oauthTokens = getClaudeAIOAuthTokens();
    if (!oauthTokens?.accessToken)
      return {
        headers: {},
        error: "No OAuth token available"
      };
    return {
      headers: {
        Authorization: `Bearer ${oauthTokens.accessToken}`,
        "anthropic-beta": OAUTH_BETA_HEADER
      }
    };
  }
  let apiKey = getAnthropicApiKey();
  if (!apiKey)
    return {
      headers: {},
      error: "No API key available"
    };
  return {
    headers: {
      "x-api-key": apiKey
    }
  };
}
