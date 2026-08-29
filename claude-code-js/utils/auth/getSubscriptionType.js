// function: getSubscriptionType
function getSubscriptionType() {
  if (shouldUseMockSubscription())
    return getMockSubscriptionType();
  if (!isAnthropicAuthEnabled())
    return null;
  let oauthTokens = getClaudeAIOAuthTokens();
  if (!oauthTokens)
    return null;
  return oauthTokens.subscriptionType ?? null;
}
