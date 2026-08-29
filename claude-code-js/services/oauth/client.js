// Original: src/services/oauth/client.ts
function shouldUseClaudeAIAuth(scopes) {
  return Boolean(scopes?.includes(CLAUDE_AI_INFERENCE_SCOPE));
}
function parseScopes(scopeString) {
  return scopeString?.split(" ").filter(Boolean) ?? [];
}
function buildAuthUrl({
  codeChallenge,
  state,
  port,
  isManual,
  loginWithClaudeAi,
  inferenceOnly,
  orgUUID,
  loginHint,
  loginMethod
}) {
  let authUrlBase = loginWithClaudeAi ? getOauthConfig().CLAUDE_AI_AUTHORIZE_URL : getOauthConfig().CONSOLE_AUTHORIZE_URL, authUrl = new URL(authUrlBase);
  authUrl.searchParams.append("code", "true"), authUrl.searchParams.append("client_id", getOauthConfig().CLIENT_ID), authUrl.searchParams.append("response_type", "code"), authUrl.searchParams.append("redirect_uri", isManual ? getOauthConfig().MANUAL_REDIRECT_URL : `http://localhost:${port}/callback`);
  let scopesToUse = inferenceOnly ? [CLAUDE_AI_INFERENCE_SCOPE] : ALL_OAUTH_SCOPES;
  if (authUrl.searchParams.append("scope", scopesToUse.join(" ")), authUrl.searchParams.append("code_challenge", codeChallenge), authUrl.searchParams.append("code_challenge_method", "S256"), authUrl.searchParams.append("state", state), orgUUID)
    authUrl.searchParams.append("orgUUID", orgUUID);
  if (loginHint)
    authUrl.searchParams.append("login_hint", loginHint);
  if (loginMethod)
    authUrl.searchParams.append("login_method", loginMethod);
  return authUrl.toString();
}
async function exchangeCodeForTokens(authorizationCode, state, codeVerifier, port, useManualRedirect = !1, expiresIn) {
  let requestBody = {
    grant_type: "authorization_code",
    code: authorizationCode,
    redirect_uri: useManualRedirect ? getOauthConfig().MANUAL_REDIRECT_URL : `http://localhost:${port}/callback`,
    client_id: getOauthConfig().CLIENT_ID,
    code_verifier: codeVerifier,
    state
  };
  if (expiresIn !== void 0)
    requestBody.expires_in = expiresIn;
  let response4 = await axios_default.post(getOauthConfig().TOKEN_URL, requestBody, {
    headers: { "Content-Type": "application/json" },
    timeout: 15000
  });
  if (response4.status !== 200)
    throw Error(response4.status === 401 ? "Authentication failed: Invalid authorization code" : `Token exchange failed (${response4.status}): ${response4.statusText}`);
  return logEvent("tengu_oauth_token_exchange_success", {}), response4.data;
}
async function refreshOAuthToken(refreshToken, { scopes: requestedScopes } = {}) {
  let requestBody = {
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: getOauthConfig().CLIENT_ID,
    scope: ((requestedScopes?.length) ? requestedScopes : CLAUDE_AI_OAUTH_SCOPES).join(" ")
  };
  try {
    let response4 = await axios_default.post(getOauthConfig().TOKEN_URL, requestBody, {
      headers: { "Content-Type": "application/json" },
      timeout: 15000
    });
    if (response4.status !== 200)
      throw Error(`Token refresh failed: ${response4.statusText}`);
    let data = response4.data, {
      access_token: accessToken,
      refresh_token: newRefreshToken = refreshToken,
      expires_in: expiresIn
    } = data, expiresAt = Date.now() + expiresIn * 1000, scopes = parseScopes(data.scope);
    logEvent("tengu_oauth_token_refresh_success", {});
    let config5 = getGlobalConfig(), existing = getClaudeAIOAuthTokens(), profileInfo = config5.oauthAccount?.billingType !== void 0 && config5.oauthAccount?.accountCreatedAt !== void 0 && config5.oauthAccount?.subscriptionCreatedAt !== void 0 && existing?.subscriptionType != null && existing?.rateLimitTier != null ? null : await fetchProfileInfo(accessToken);
    if (profileInfo && config5.oauthAccount) {
      let updates = {};
      if (profileInfo.displayName !== void 0)
        updates.displayName = profileInfo.displayName;
      if (typeof profileInfo.hasExtraUsageEnabled === "boolean")
        updates.hasExtraUsageEnabled = profileInfo.hasExtraUsageEnabled;
      if (profileInfo.billingType !== null)
        updates.billingType = profileInfo.billingType;
      if (profileInfo.accountCreatedAt !== void 0)
        updates.accountCreatedAt = profileInfo.accountCreatedAt;
      if (profileInfo.subscriptionCreatedAt !== void 0)
        updates.subscriptionCreatedAt = profileInfo.subscriptionCreatedAt;
      if (Object.keys(updates).length > 0)
        saveGlobalConfig((current) => ({
          ...current,
          oauthAccount: current.oauthAccount ? { ...current.oauthAccount, ...updates } : current.oauthAccount
        }));
    }
    return {
      accessToken,
      refreshToken: newRefreshToken,
      expiresAt,
      scopes,
      subscriptionType: profileInfo?.subscriptionType ?? existing?.subscriptionType ?? null,
      rateLimitTier: profileInfo?.rateLimitTier ?? existing?.rateLimitTier ?? null,
      profile: profileInfo?.rawProfile,
      tokenAccount: data.account ? {
        uuid: data.account.uuid,
        emailAddress: data.account.email_address,
        organizationUuid: data.organization?.uuid
      } : void 0
    };
  } catch (error41) {
    let responseBody = axios_default.isAxiosError(error41) && error41.response?.data ? JSON.stringify(error41.response.data) : void 0;
    throw logEvent("tengu_oauth_token_refresh_failure", {
      error: error41.message,
      ...responseBody && {
        responseBody
      }
    }), error41;
  }
}
async function fetchAndStoreUserRoles(accessToken) {
  let response4 = await axios_default.get(getOauthConfig().ROLES_URL, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (response4.status !== 200)
    throw Error(`Failed to fetch user roles: ${response4.statusText}`);
  let data = response4.data;
  if (!getGlobalConfig().oauthAccount)
    throw Error("OAuth account information not found in config");
  saveGlobalConfig((current) => ({
    ...current,
    oauthAccount: current.oauthAccount ? {
      ...current.oauthAccount,
      organizationRole: data.organization_role,
      workspaceRole: data.workspace_role,
      organizationName: data.organization_name
    } : current.oauthAccount
  })), logEvent("tengu_oauth_roles_stored", {
    org_role: data.organization_role
  });
}
async function createAndStoreApiKey(accessToken) {
  try {
    let response4 = await axios_default.post(getOauthConfig().API_KEY_URL, null, {
      headers: { Authorization: `Bearer ${accessToken}` }
    }), apiKey = response4.data?.raw_key;
    if (apiKey)
      return await saveApiKey(apiKey), logEvent("tengu_oauth_api_key", {
        status: "success",
        statusCode: response4.status
      }), apiKey;
    return null;
  } catch (error41) {
    throw logEvent("tengu_oauth_api_key", {
      status: "failure",
      error: error41 instanceof Error ? error41.message : String(error41)
    }), error41;
  }
}
function isOAuthTokenExpired(expiresAt) {
  if (expiresAt === null)
    return !1;
  let bufferTime = 300000;
  return Date.now() + bufferTime >= expiresAt;
}
async function fetchProfileInfo(accessToken) {
  let profile4 = await getOauthProfileFromOauthToken(accessToken), orgType = profile4?.organization?.organization_type, subscriptionType = null;
  switch (orgType) {
    case "claude_max":
      subscriptionType = "max";
      break;
    case "claude_pro":
      subscriptionType = "pro";
      break;
    case "claude_enterprise":
      subscriptionType = "enterprise";
      break;
    case "claude_team":
      subscriptionType = "team";
      break;
    default:
      subscriptionType = null;
      break;
  }
  let result = {
    subscriptionType,
    rateLimitTier: profile4?.organization?.rate_limit_tier ?? null,
    hasExtraUsageEnabled: profile4?.organization?.has_extra_usage_enabled ?? null,
    billingType: profile4?.organization?.billing_type ?? null
  };
  if (profile4?.account?.display_name)
    result.displayName = profile4.account.display_name;
  if (profile4?.account?.created_at)
    result.accountCreatedAt = profile4.account.created_at;
  if (profile4?.organization?.subscription_created_at)
    result.subscriptionCreatedAt = profile4.organization.subscription_created_at;
  return logEvent("tengu_oauth_profile_fetch_success", {}), { ...result, rawProfile: profile4 };
}
async function getOrganizationUUID() {
  let orgUUID = getGlobalConfig().oauthAccount?.organizationUuid;
  if (orgUUID)
    return orgUUID;
  let accessToken = getClaudeAIOAuthTokens()?.accessToken;
  if (accessToken === void 0 || !hasProfileScope())
    return null;
  let profileOrgUUID = (await getOauthProfileFromOauthToken(accessToken))?.organization?.uuid;
  if (!profileOrgUUID)
    return null;
  return profileOrgUUID;
}
async function populateOAuthAccountInfoIfNeeded() {
  let envAccountUuid = process.env.CLAUDE_CODE_ACCOUNT_UUID, envUserEmail = process.env.CLAUDE_CODE_USER_EMAIL, envOrganizationUuid = process.env.CLAUDE_CODE_ORGANIZATION_UUID, hasEnvVars = Boolean(envAccountUuid && envUserEmail && envOrganizationUuid);
  if (envAccountUuid && envUserEmail && envOrganizationUuid) {
    if (!getGlobalConfig().oauthAccount)
      storeOAuthAccountInfo({
        accountUuid: envAccountUuid,
        emailAddress: envUserEmail,
        organizationUuid: envOrganizationUuid
      });
  }
  await checkAndRefreshOAuthTokenIfNeeded();
  let config5 = getGlobalConfig();
  if (config5.oauthAccount && config5.oauthAccount.billingType !== void 0 && config5.oauthAccount.accountCreatedAt !== void 0 && config5.oauthAccount.subscriptionCreatedAt !== void 0 || !isClaudeAISubscriber() || !hasProfileScope())
    return !1;
  let tokens = getClaudeAIOAuthTokens();
  if (tokens?.accessToken) {
    let profile4 = await getOauthProfileFromOauthToken(tokens.accessToken);
    if (profile4) {
      if (hasEnvVars)
        logForDebugging("OAuth profile fetch succeeded, overriding env var account info", { level: "info" });
      return storeOAuthAccountInfo({
        accountUuid: profile4.account.uuid,
        emailAddress: profile4.account.email,
        organizationUuid: profile4.organization.uuid,
        displayName: profile4.account.display_name || void 0,
        hasExtraUsageEnabled: profile4.organization.has_extra_usage_enabled ?? !1,
        billingType: profile4.organization.billing_type ?? void 0,
        accountCreatedAt: profile4.account.created_at,
        subscriptionCreatedAt: profile4.organization.subscription_created_at ?? void 0
      }), !0;
    }
  }
  return !1;
}
function storeOAuthAccountInfo({
  accountUuid,
  emailAddress,
  organizationUuid,
  displayName,
  hasExtraUsageEnabled,
  billingType,
  accountCreatedAt,
  subscriptionCreatedAt
}) {
  let accountInfo = {
    accountUuid,
    emailAddress,
    organizationUuid,
    hasExtraUsageEnabled,
    billingType,
    accountCreatedAt,
    subscriptionCreatedAt
  };
  if (displayName)
    accountInfo.displayName = displayName;
  saveGlobalConfig((current) => {
    if (current.oauthAccount?.accountUuid === accountInfo.accountUuid && current.oauthAccount?.emailAddress === accountInfo.emailAddress && current.oauthAccount?.organizationUuid === accountInfo.organizationUuid && current.oauthAccount?.displayName === accountInfo.displayName && current.oauthAccount?.hasExtraUsageEnabled === accountInfo.hasExtraUsageEnabled && current.oauthAccount?.billingType === accountInfo.billingType && current.oauthAccount?.accountCreatedAt === accountInfo.accountCreatedAt && current.oauthAccount?.subscriptionCreatedAt === accountInfo.subscriptionCreatedAt)
      return current;
    return { ...current, oauthAccount: accountInfo };
  });
}
var init_client8 = __esm(() => {
  init_axios2();
  init_oauth();
  init_auth14();
  init_config4();
  init_debug();
  init_getOauthProfile();
});
