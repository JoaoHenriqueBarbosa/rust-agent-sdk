// Original: src/cli/handlers/auth.ts
var exports_auth2 = {};
__export(exports_auth2, {
  installOAuthTokens: () => installOAuthTokens,
  authStatus: () => authStatus,
  authLogout: () => authLogout,
  authLogin: () => authLogin
});
async function installOAuthTokens(tokens) {
  await performLogout({ clearOnboarding: !1 });
  let profile7 = tokens.profile ?? await getOauthProfileFromOauthToken(tokens.accessToken);
  if (profile7)
    storeOAuthAccountInfo({
      accountUuid: profile7.account.uuid,
      emailAddress: profile7.account.email,
      organizationUuid: profile7.organization.uuid,
      displayName: profile7.account.display_name || void 0,
      hasExtraUsageEnabled: profile7.organization.has_extra_usage_enabled ?? void 0,
      billingType: profile7.organization.billing_type ?? void 0,
      subscriptionCreatedAt: profile7.organization.subscription_created_at ?? void 0,
      accountCreatedAt: profile7.account.created_at
    });
  else if (tokens.tokenAccount)
    storeOAuthAccountInfo({
      accountUuid: tokens.tokenAccount.uuid,
      emailAddress: tokens.tokenAccount.emailAddress,
      organizationUuid: tokens.tokenAccount.organizationUuid
    });
  let storageResult = saveOAuthTokensIfNeeded(tokens);
  if (clearOAuthTokenCache(), storageResult.warning)
    logEvent("tengu_oauth_storage_warning", {
      warning: storageResult.warning
    });
  if (await fetchAndStoreUserRoles(tokens.accessToken).catch((err2) => logForDebugging(String(err2), { level: "error" })), shouldUseClaudeAIAuth(tokens.scopes))
    await fetchAndStoreClaudeCodeFirstTokenDate().catch((err2) => logForDebugging(String(err2), { level: "error" }));
  else if (!await createAndStoreApiKey(tokens.accessToken))
    throw Error("Unable to create API key. The server accepted the request but did not return a key.");
  await clearAuthRelatedCaches();
}
async function authLogin({
  email: email3,
  sso,
  console: useConsole,
  claudeai
}) {
  if (useConsole && claudeai)
    process.stderr.write(`Error: --console and --claudeai cannot be used together.
`), process.exit(1);
  let settings = getInitialSettings(), loginWithClaudeAi = settings.forceLoginMethod ? settings.forceLoginMethod === "claudeai" : !useConsole, orgUUID = settings.forceLoginOrgUUID, envRefreshToken = process.env.CLAUDE_CODE_OAUTH_REFRESH_TOKEN;
  if (envRefreshToken) {
    let envScopes = process.env.CLAUDE_CODE_OAUTH_SCOPES;
    if (!envScopes)
      process.stderr.write(`CLAUDE_CODE_OAUTH_SCOPES is required when using CLAUDE_CODE_OAUTH_REFRESH_TOKEN.
Set it to the space-separated scopes the refresh token was issued with
(e.g. "user:inference" or "user:profile user:inference user:sessions:claude_code user:mcp_servers").
`), process.exit(1);
    let scopes = envScopes.split(/\s+/).filter(Boolean);
    try {
      logEvent("tengu_login_from_refresh_token", {});
      let tokens = await refreshOAuthToken(envRefreshToken, { scopes });
      await installOAuthTokens(tokens);
      let orgResult = await validateForceLoginOrg();
      if (!orgResult.valid)
        process.stderr.write(orgResult.message + `
`), process.exit(1);
      saveGlobalConfig((current) => {
        if (current.hasCompletedOnboarding)
          return current;
        return { ...current, hasCompletedOnboarding: !0 };
      }), logEvent("tengu_oauth_success", {
        loginWithClaudeAi: shouldUseClaudeAIAuth(tokens.scopes)
      }), process.stdout.write(`Login successful.
`), process.exit(0);
    } catch (err2) {
      logError2(err2);
      let sslHint = getSSLErrorHint(err2);
      process.stderr.write(`Login failed: ${errorMessage(err2)}
${sslHint ? sslHint + `
` : ""}`), process.exit(1);
    }
  }
  let resolvedLoginMethod = sso ? "sso" : void 0, oauthService = new OAuthService;
  try {
    logEvent("tengu_oauth_flow_start", { loginWithClaudeAi });
    let result = await oauthService.startOAuthFlow(async (url3) => {
      process.stdout.write(`Opening browser to sign in\u2026
`), process.stdout.write(`If the browser didn't open, visit: ${url3}
`);
    }, {
      loginWithClaudeAi,
      loginHint: email3,
      loginMethod: resolvedLoginMethod,
      orgUUID
    });
    await installOAuthTokens(result);
    let orgResult = await validateForceLoginOrg();
    if (!orgResult.valid)
      process.stderr.write(orgResult.message + `
`), process.exit(1);
    logEvent("tengu_oauth_success", { loginWithClaudeAi }), process.stdout.write(`Login successful.
`), process.exit(0);
  } catch (err2) {
    logError2(err2);
    let sslHint = getSSLErrorHint(err2);
    process.stderr.write(`Login failed: ${errorMessage(err2)}
${sslHint ? sslHint + `
` : ""}`), process.exit(1);
  } finally {
    oauthService.cleanup();
  }
}
async function authStatus(opts) {
  let { source: authTokenSource, hasToken } = getAuthTokenSource(), { source: apiKeySource } = getAnthropicApiKeyWithSource(), hasApiKeyEnvVar = !!process.env.ANTHROPIC_API_KEY && !isRunningOnHomespace(), oauthAccount = getOauthAccountInfo(), subscriptionType = getSubscriptionType(), using3P = isUsing3PServices(), loggedIn = hasToken || apiKeySource !== "none" || hasApiKeyEnvVar || using3P, authMethod = "none";
  if (using3P)
    authMethod = "third_party";
  else if (authTokenSource === "claude.ai")
    authMethod = "claude.ai";
  else if (authTokenSource === "apiKeyHelper")
    authMethod = "api_key_helper";
  else if (authTokenSource !== "none")
    authMethod = "oauth_token";
  else if (apiKeySource === "ANTHROPIC_API_KEY" || hasApiKeyEnvVar)
    authMethod = "api_key";
  else if (apiKeySource === "/login managed key")
    authMethod = "claude.ai";
  if (opts.text) {
    let properties = [
      ...buildAccountProperties(),
      ...buildAPIProviderProperties()
    ], hasAuthProperty = !1;
    for (let prop of properties) {
      let value = typeof prop.value === "string" ? prop.value : Array.isArray(prop.value) ? prop.value.join(", ") : null;
      if (value === null || value === "none")
        continue;
      if (hasAuthProperty = !0, prop.label)
        process.stdout.write(`${prop.label}: ${value}
`);
      else
        process.stdout.write(`${value}
`);
    }
    if (!hasAuthProperty && hasApiKeyEnvVar)
      process.stdout.write(`API key: ANTHROPIC_API_KEY
`);
    if (!loggedIn)
      process.stdout.write(`Not logged in. Run claude auth login to authenticate.
`);
  } else {
    let apiProvider = getAPIProvider(), resolvedApiKeySource = apiKeySource !== "none" ? apiKeySource : hasApiKeyEnvVar ? "ANTHROPIC_API_KEY" : null, output = {
      loggedIn,
      authMethod,
      apiProvider
    };
    if (resolvedApiKeySource)
      output.apiKeySource = resolvedApiKeySource;
    if (authMethod === "claude.ai")
      output.email = oauthAccount?.emailAddress ?? null, output.orgId = oauthAccount?.organizationUuid ?? null, output.orgName = oauthAccount?.organizationName ?? null, output.subscriptionType = subscriptionType ?? null;
    process.stdout.write(jsonStringify(output, null, 2) + `
`);
  }
  process.exit(loggedIn ? 0 : 1);
}
async function authLogout() {
  try {
    await performLogout({ clearOnboarding: !1 });
  } catch {
    process.stderr.write(`Failed to log out.
`), process.exit(1);
  }
  process.stdout.write(`Successfully logged out from your Anthropic account.
`), process.exit(0);
}
var init_auth18 = __esm(() => {
  init_logout();
  init_errorUtils();
  init_firstTokenDate();
  init_client8();
  init_getOauthProfile();
  init_oauth2();
  init_auth14();
  init_config4();
  init_debug();
  init_envUtils();
  init_errors();
  init_log3();
  init_providers();
  init_settings2();
  init_slowOperations();
  init_status();
});
