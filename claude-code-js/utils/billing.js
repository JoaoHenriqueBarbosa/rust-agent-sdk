// Original: src/utils/billing.ts
function hasConsoleBillingAccess() {
  if (isEnvTruthy(process.env.DISABLE_COST_WARNINGS))
    return !1;
  if (isClaudeAISubscriber())
    return !1;
  let authSource = getAuthTokenSource(), hasApiKey = getAnthropicApiKey() !== null;
  if (!authSource.hasToken && !hasApiKey)
    return !1;
  let config5 = getGlobalConfig(), orgRole = config5.oauthAccount?.organizationRole, workspaceRole = config5.oauthAccount?.workspaceRole;
  if (!orgRole || !workspaceRole)
    return !1;
  return ["admin", "billing"].includes(orgRole) || ["workspace_admin", "workspace_billing"].includes(workspaceRole);
}
function hasClaudeAiBillingAccess() {
  if (mockBillingAccessOverride !== null)
    return mockBillingAccessOverride;
  if (!isClaudeAISubscriber())
    return !1;
  let subscriptionType = getSubscriptionType();
  if (subscriptionType === "max" || subscriptionType === "pro")
    return !0;
  let orgRole = getGlobalConfig().oauthAccount?.organizationRole;
  return !!orgRole && ["admin", "billing", "owner", "primary_owner"].includes(orgRole);
}
var mockBillingAccessOverride = null;
var init_billing = __esm(() => {
  init_auth14();
  init_config4();
  init_envUtils();
});
