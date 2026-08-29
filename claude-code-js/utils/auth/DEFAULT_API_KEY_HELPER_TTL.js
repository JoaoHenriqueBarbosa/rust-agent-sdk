// var: DEFAULT_API_KEY_HELPER_TTL
var DEFAULT_API_KEY_HELPER_TTL = 300000, _apiKeyHelperCache = null, _apiKeyHelperInflight = null, _apiKeyHelperEpoch = 0, DEFAULT_AWS_STS_TTL = 3600000, AWS_AUTH_REFRESH_TIMEOUT_MS = 180000, refreshAndGetAwsCredentials, GCP_CREDENTIALS_CHECK_TIMEOUT_MS = 5000, DEFAULT_GCP_CREDENTIAL_TTL = 3600000, GCP_AUTH_REFRESH_TIMEOUT_MS = 180000, refreshGcpCredentialsIfNeeded, getApiKeyFromConfigOrMacOSKeychain, getClaudeAIOAuthTokens, lastCredentialsMtimeMs = 0, pending401Handlers, pendingRefreshCheck = null, cachedOtelHeaders = null, cachedOtelHeadersTimestamp = 0, DEFAULT_OTEL_HEADERS_DEBOUNCE_MS = 1740000, GcpCredentialsTimeoutError;
var init_auth14 = __esm(() => {
  init_source();
  init_execa();
  init_memoize();
  init_oauth();
  init_modelStrings();
  init_providers();
  init_state();
  init_mockRateLimits();
  init_client8();
  init_getOauthProfile();
  init_authFileDescriptor();
  init_authPortable();
  init_aws();
  init_awsAuthStatusManager();
  init_betas2();
  init_config4();
  init_debug();
  init_envUtils();
  init_errors();
  init_execFileNoThrow();
  init_log3();
  init_memoize2();
  init_secureStorage();
  init_keychainPrefetch();
  init_macOsKeychainHelpers();
  init_settings2();
  init_slowOperations();
  init_toolSchemaCache();
  refreshAndGetAwsCredentials = memoizeWithTTLAsync(async () => {
    let refreshed = await runAwsAuthRefresh(), credentials = await getAwsCredsFromCredentialExport();
    if (refreshed || credentials)
      await clearAwsIniCache();
    return credentials;
  }, DEFAULT_AWS_STS_TTL);
  refreshGcpCredentialsIfNeeded = memoizeWithTTLAsync(async () => {
    return await runGcpAuthRefresh();
  }, DEFAULT_GCP_CREDENTIAL_TTL);
  getApiKeyFromConfigOrMacOSKeychain = memoize_default(() => {
    if (process.platform === "darwin") {
      let prefetch = getLegacyApiKeyPrefetchResult();
      if (prefetch) {
        if (prefetch.stdout)
          return { key: prefetch.stdout, source: "/login managed key" };
      } else {
        let storageServiceName = getMacOsKeychainStorageServiceName();
        try {
          let result = execSyncWithDefaults_DEPRECATED(`security find-generic-password -a $USER -w -s "${storageServiceName}"`);
          if (result)
            return { key: result, source: "/login managed key" };
        } catch (e) {
          logError2(e);
        }
      }
    }
    let config8 = getGlobalConfig();
    if (!config8.primaryApiKey)
      return null;
    return { key: config8.primaryApiKey, source: "/login managed key" };
  });
  getClaudeAIOAuthTokens = memoize_default(() => {
    if (process.env.CLAUDE_CODE_OAUTH_TOKEN)
      return {
        accessToken: process.env.CLAUDE_CODE_OAUTH_TOKEN,
        refreshToken: null,
        expiresAt: null,
        scopes: ["user:inference"],
        subscriptionType: null,
        rateLimitTier: null
      };
    let oauthTokenFromFd = getOAuthTokenFromFileDescriptor();
    if (oauthTokenFromFd)
      return {
        accessToken: oauthTokenFromFd,
        refreshToken: null,
        expiresAt: null,
        scopes: ["user:inference"],
        subscriptionType: null,
        rateLimitTier: null
      };
    try {
      let oauthData = getSecureStorage().read()?.claudeAiOauth;
      if (!oauthData?.accessToken)
        return null;
      return oauthData;
    } catch (error44) {
      return logError2(error44), null;
    }
  });
  pending401Handlers = /* @__PURE__ */ new Map;
  GcpCredentialsTimeoutError = class GcpCredentialsTimeoutError extends Error {
  };
});
