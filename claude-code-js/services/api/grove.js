// Original: src/services/api/grove.ts
async function markGroveNoticeViewed() {
  try {
    await withOAuth401Retry(() => {
      let authHeaders = getAuthHeaders();
      if (authHeaders.error)
        throw Error(`Failed to get auth headers: ${authHeaders.error}`);
      return axios_default.post(`${getOauthConfig().BASE_API_URL}/api/oauth/account/grove_notice_viewed`, {}, {
        headers: {
          ...authHeaders.headers,
          "User-Agent": getClaudeCodeUserAgent()
        }
      });
    }), getGroveSettings.cache.clear?.();
  } catch (err2) {
    logError2(err2);
  }
}
async function updateGroveSettings(groveEnabled) {
  try {
    await withOAuth401Retry(() => {
      let authHeaders = getAuthHeaders();
      if (authHeaders.error)
        throw Error(`Failed to get auth headers: ${authHeaders.error}`);
      return axios_default.patch(`${getOauthConfig().BASE_API_URL}/api/oauth/account/settings`, {
        grove_enabled: groveEnabled
      }, {
        headers: {
          ...authHeaders.headers,
          "User-Agent": getClaudeCodeUserAgent()
        }
      });
    }), getGroveSettings.cache.clear?.();
  } catch (err2) {
    logError2(err2);
  }
}
async function isQualifiedForGrove() {
  if (!isConsumerSubscriber())
    return !1;
  let accountId = getOauthAccountInfo()?.accountUuid;
  if (!accountId)
    return !1;
  let cachedEntry = getGlobalConfig().groveConfigCache?.[accountId], now2 = Date.now();
  if (!cachedEntry)
    return logForDebugging("Grove: No cache, fetching config in background (dialog skipped this session)"), fetchAndStoreGroveConfig(accountId), !1;
  if (now2 - cachedEntry.timestamp > GROVE_CACHE_EXPIRATION_MS)
    return logForDebugging("Grove: Cache stale, returning cached data and refreshing in background"), fetchAndStoreGroveConfig(accountId), cachedEntry.grove_enabled;
  return logForDebugging("Grove: Using fresh cached config"), cachedEntry.grove_enabled;
}
async function fetchAndStoreGroveConfig(accountId) {
  try {
    let result = await getGroveNoticeConfig();
    if (!result.success)
      return;
    let groveEnabled = result.data.grove_enabled, cachedEntry = getGlobalConfig().groveConfigCache?.[accountId];
    if (cachedEntry?.grove_enabled === groveEnabled && Date.now() - cachedEntry.timestamp <= GROVE_CACHE_EXPIRATION_MS)
      return;
    saveGlobalConfig((current) => ({
      ...current,
      groveConfigCache: {
        ...current.groveConfigCache,
        [accountId]: {
          grove_enabled: groveEnabled,
          timestamp: Date.now()
        }
      }
    }));
  } catch (err2) {
    logForDebugging(`Grove: Failed to fetch and store config: ${err2}`);
  }
}
function calculateShouldShowGrove(settingsResult, configResult, showIfAlreadyViewed) {
  if (!settingsResult.success || !configResult.success)
    return !1;
  let settings = settingsResult.data, config10 = configResult.data;
  if (settings.grove_enabled !== null)
    return !1;
  if (showIfAlreadyViewed)
    return !0;
  if (!config10.notice_is_grace_period)
    return !0;
  let reminderFrequency = config10.notice_reminder_frequency;
  if (reminderFrequency !== null && settings.grove_notice_viewed_at)
    return Math.floor((Date.now() - new Date(settings.grove_notice_viewed_at).getTime()) / 86400000) >= reminderFrequency;
  else {
    let viewedAt = settings.grove_notice_viewed_at;
    return viewedAt === null || viewedAt === void 0;
  }
}
async function checkGroveForNonInteractive() {
  let [settingsResult, configResult] = await Promise.all([
    getGroveSettings(),
    getGroveNoticeConfig()
  ]);
  if (calculateShouldShowGrove(settingsResult, configResult, !1)) {
    let config10 = configResult.success ? configResult.data : null;
    if (logEvent("tengu_grove_print_viewed", {
      dismissable: config10?.notice_is_grace_period
    }), config10 === null || config10.notice_is_grace_period)
      writeToStderr(`
An update to our Consumer Terms and Privacy Policy will take effect on October 8, 2025. Run \`claude\` to review the updated terms.

`), await markGroveNoticeViewed();
    else
      writeToStderr(`
[ACTION REQUIRED] An update to our Consumer Terms and Privacy Policy has taken effect on October 8, 2025. You must run \`claude\` to review the updated terms.

`), await gracefulShutdown(1);
  }
}
var GROVE_CACHE_EXPIRATION_MS = 86400000, getGroveSettings, getGroveNoticeConfig;
var init_grove = __esm(() => {
  init_axios2();
  init_memoize();
  init_auth14();
  init_debug();
  init_gracefulShutdown();
  init_oauth();
  init_config4();
  init_http6();
  init_log3();
  getGroveSettings = memoize_default(async () => {
    if (isEssentialTrafficOnly())
      return { success: !1 };
    try {
      return { success: !0, data: (await withOAuth401Retry(() => {
        let authHeaders = getAuthHeaders();
        if (authHeaders.error)
          throw Error(`Failed to get auth headers: ${authHeaders.error}`);
        return axios_default.get(`${getOauthConfig().BASE_API_URL}/api/oauth/account/settings`, {
          headers: {
            ...authHeaders.headers,
            "User-Agent": getClaudeCodeUserAgent()
          }
        });
      })).data };
    } catch (err2) {
      return logError2(err2), getGroveSettings.cache.clear?.(), { success: !1 };
    }
  });
  getGroveNoticeConfig = memoize_default(async () => {
    if (isEssentialTrafficOnly())
      return { success: !1 };
    try {
      let response7 = await withOAuth401Retry(() => {
        let authHeaders = getAuthHeaders();
        if (authHeaders.error)
          throw Error(`Failed to get auth headers: ${authHeaders.error}`);
        return axios_default.get(`${getOauthConfig().BASE_API_URL}/api/claude_code_grove`, {
          headers: {
            ...authHeaders.headers,
            "User-Agent": getUserAgent()
          },
          timeout: 3000
        });
      }), {
        grove_enabled,
        domain_excluded,
        notice_is_grace_period,
        notice_reminder_frequency
      } = response7.data;
      return {
        success: !0,
        data: {
          grove_enabled,
          domain_excluded: domain_excluded ?? !1,
          notice_is_grace_period: notice_is_grace_period ?? !0,
          notice_reminder_frequency
        }
      };
    } catch (err2) {
      return logForDebugging(`Failed to fetch Grove notice config: ${err2}`), { success: !1 };
    }
  });
});
