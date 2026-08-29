// function: getAccountInformation
function getAccountInformation() {
  if (getAPIProvider() !== "firstParty")
    return;
  let { source: authTokenSource } = getAuthTokenSource(), accountInfo = {};
  if (authTokenSource === "CLAUDE_CODE_OAUTH_TOKEN" || authTokenSource === "CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR")
    accountInfo.tokenSource = authTokenSource;
  else if (isClaudeAISubscriber())
    accountInfo.subscription = getSubscriptionName();
  else
    accountInfo.tokenSource = authTokenSource;
  let { key: apiKey, source: apiKeySource } = getAnthropicApiKeyWithSource();
  if (apiKey)
    accountInfo.apiKeySource = apiKeySource;
  if (authTokenSource === "claude.ai" || apiKeySource === "/login managed key") {
    let orgName = getOauthAccountInfo()?.organizationName;
    if (orgName)
      accountInfo.organization = orgName;
  }
  let email3 = getOauthAccountInfo()?.emailAddress;
  if ((authTokenSource === "claude.ai" || apiKeySource === "/login managed key") && email3)
    accountInfo.email = email3;
  return accountInfo;
}
