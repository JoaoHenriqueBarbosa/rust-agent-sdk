// var: cachedEmail
var cachedEmail = null, emailFetchPromise = null, getCoreUserData, getGitEmail;
var init_user = __esm(() => {
  init_execa();
  init_memoize();
  init_state();
  init_auth14();
  init_config4();
  init_cwd2();
  init_env();
  init_envUtils();
  getCoreUserData = memoize_default((includeAnalyticsMetadata) => {
    let deviceId = getOrCreateUserID(), config10 = getGlobalConfig(), subscriptionType, rateLimitTier, firstTokenTime;
    if (includeAnalyticsMetadata) {
      if (subscriptionType = getSubscriptionType() ?? void 0, rateLimitTier = getRateLimitTier() ?? void 0, subscriptionType && config10.claudeCodeFirstTokenDate) {
        let configFirstTokenTime = new Date(config10.claudeCodeFirstTokenDate).getTime();
        if (!isNaN(configFirstTokenTime))
          firstTokenTime = configFirstTokenTime;
      }
    }
    let oauthAccount = getOauthAccountInfo(), organizationUuid = oauthAccount?.organizationUuid, accountUuid = oauthAccount?.accountUuid;
    return {
      deviceId,
      sessionId: getSessionId(),
      email: getEmail(),
      appVersion: "2.1.90",
      platform: getHostPlatformForAnalytics(),
      organizationUuid,
      accountUuid,
      userType: "external",
      subscriptionType,
      rateLimitTier,
      firstTokenTime,
      ...isEnvTruthy(process.env.GITHUB_ACTIONS) && {
        githubActionsMetadata: {
          actor: process.env.GITHUB_ACTOR,
          actorId: process.env.GITHUB_ACTOR_ID,
          repository: process.env.GITHUB_REPOSITORY,
          repositoryId: process.env.GITHUB_REPOSITORY_ID,
          repositoryOwner: process.env.GITHUB_REPOSITORY_OWNER,
          repositoryOwnerId: process.env.GITHUB_REPOSITORY_OWNER_ID
        }
      }
    };
  });
  getGitEmail = memoize_default(async () => {
    let result = await execa("git config --get user.email", {
      shell: !0,
      reject: !1,
      cwd: getCwd()
    });
    return result.exitCode === 0 && result.stdout ? result.stdout.trim() : void 0;
  });
});
