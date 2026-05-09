// Original: src/services/analytics/growthbook.ts
var exports_growthbook = {};
__export(exports_growthbook, {
  stopPeriodicGrowthBookRefresh: () => stopPeriodicGrowthBookRefresh,
  setupPeriodicGrowthBookRefresh: () => setupPeriodicGrowthBookRefresh,
  setGrowthBookConfigOverride: () => setGrowthBookConfigOverride,
  resetGrowthBook: () => resetGrowthBook,
  refreshGrowthBookFeatures: () => refreshGrowthBookFeatures,
  refreshGrowthBookAfterAuthChange: () => refreshGrowthBookAfterAuthChange,
  onGrowthBookRefresh: () => onGrowthBookRefresh,
  initializeGrowthBook: () => initializeGrowthBook,
  hasGrowthBookEnvOverride: () => hasGrowthBookEnvOverride,
  getGrowthBookConfigOverrides: () => getGrowthBookConfigOverrides,
  getFeatureValue_DEPRECATED: () => getFeatureValue_DEPRECATED,
  getFeatureValue_CACHED_WITH_REFRESH: () => getFeatureValue_CACHED_WITH_REFRESH,
  getFeatureValue_CACHED_MAY_BE_STALE: () => getFeatureValue_CACHED_MAY_BE_STALE,
  getDynamicConfig_CACHED_MAY_BE_STALE: () => getDynamicConfig_CACHED_MAY_BE_STALE,
  getDynamicConfig_BLOCKS_ON_INIT: () => getDynamicConfig_BLOCKS_ON_INIT,
  getApiBaseUrlHost: () => getApiBaseUrlHost,
  getAllGrowthBookFeatures: () => getAllGrowthBookFeatures,
  clearGrowthBookConfigOverrides: () => clearGrowthBookConfigOverrides,
  checkStatsigFeatureGate_CACHED_MAY_BE_STALE: () => checkStatsigFeatureGate_CACHED_MAY_BE_STALE,
  checkSecurityRestrictionGate: () => checkSecurityRestrictionGate,
  checkGate_CACHED_OR_BLOCKING: () => checkGate_CACHED_OR_BLOCKING
});
function callSafe(listener2) {
  try {
    Promise.resolve(listener2()).catch((e) => {
      logError2(e);
    });
  } catch (e) {
    logError2(e);
  }
}
function onGrowthBookRefresh(listener2) {
  let subscribed = !0, unsubscribe2 = refreshed.subscribe(() => callSafe(listener2));
  if (remoteEvalFeatureValues.size > 0)
    queueMicrotask(() => {
      if (subscribed && remoteEvalFeatureValues.size > 0)
        callSafe(listener2);
    });
  return () => {
    subscribed = !1, unsubscribe2();
  };
}
function getEnvOverrides() {
  if (!envOverridesParsed)
    envOverridesParsed = !0;
  return envOverrides;
}
function hasGrowthBookEnvOverride(feature) {
  let overrides = getEnvOverrides();
  return overrides !== null && feature in overrides;
}
function getConfigOverrides() {
  return;
}
function getAllGrowthBookFeatures() {
  if (remoteEvalFeatureValues.size > 0)
    return Object.fromEntries(remoteEvalFeatureValues);
  return getGlobalConfig().cachedGrowthBookFeatures ?? {};
}
function getGrowthBookConfigOverrides() {
  return getConfigOverrides() ?? {};
}
function setGrowthBookConfigOverride(feature, value) {
  return;
}
function clearGrowthBookConfigOverrides() {
  return;
}
function logExposureForFeature(_feature) {}
async function processRemoteEvalPayload(gbClient) {
  let payload = gbClient.getPayload();
  if (!payload?.features || Object.keys(payload.features).length === 0)
    return !1;
  experimentDataByFeature.clear();
  let transformedFeatures = {};
  for (let [key3, feature] of Object.entries(payload.features)) {
    let f = feature;
    if ("value" in f && !("defaultValue" in f))
      transformedFeatures[key3] = {
        ...f,
        defaultValue: f.value
      };
    else
      transformedFeatures[key3] = f;
    if (f.source === "experiment" && f.experimentResult) {
      let { experimentResult: expResult, experiment: exp } = f;
      if (exp?.key && expResult.variationId !== void 0)
        experimentDataByFeature.set(key3, {
          experimentId: exp.key,
          variationId: expResult.variationId
        });
    }
  }
  await gbClient.setPayload({
    ...payload,
    features: transformedFeatures
  }), remoteEvalFeatureValues.clear();
  for (let [key3, feature] of Object.entries(transformedFeatures)) {
    let v2 = "value" in feature ? feature.value : feature.defaultValue;
    if (v2 !== void 0)
      remoteEvalFeatureValues.set(key3, v2);
  }
  return !0;
}
function syncRemoteEvalToDisk() {
  let fresh = Object.fromEntries(remoteEvalFeatureValues), config11 = getGlobalConfig();
  if (isEqual_default(config11.cachedGrowthBookFeatures, fresh))
    return;
  saveGlobalConfig((current) => ({
    ...current,
    cachedGrowthBookFeatures: fresh
  }));
}
function isGrowthBookEnabled() {
  return !1;
}
function getApiBaseUrlHost() {
  let baseUrl = process.env.ANTHROPIC_BASE_URL;
  if (!baseUrl)
    return;
  try {
    let host = new URL(baseUrl).host;
    if (host === "api.anthropic.com")
      return;
    return host;
  } catch {
    return;
  }
}
function getUserAttributes() {
  let user = getUserForGrowthBook(), email3 = user.email, apiBaseUrlHost = getApiBaseUrlHost();
  return {
    id: user.deviceId,
    sessionId: user.sessionId,
    deviceID: user.deviceId,
    platform: user.platform,
    ...apiBaseUrlHost && { apiBaseUrlHost },
    ...user.organizationUuid && { organizationUUID: user.organizationUuid },
    ...user.accountUuid && { accountUUID: user.accountUuid },
    ...user.userType && { userType: user.userType },
    ...user.subscriptionType && { subscriptionType: user.subscriptionType },
    ...user.rateLimitTier && { rateLimitTier: user.rateLimitTier },
    ...user.firstTokenTime && { firstTokenTime: user.firstTokenTime },
    ...email3 && { email: email3 },
    ...user.appVersion && { appVersion: user.appVersion },
    ...user.githubActionsMetadata && {
      githubActionsMetadata: user.githubActionsMetadata
    }
  };
}
async function getFeatureValueInternal(feature, defaultValue, logExposure) {
  let overrides = getEnvOverrides();
  if (overrides && feature in overrides)
    return overrides[feature];
  let configOverrides = getConfigOverrides();
  if (configOverrides && feature in configOverrides)
    return configOverrides[feature];
  if (!isGrowthBookEnabled())
    return defaultValue;
  let growthBookClient = await initializeGrowthBook();
  if (!growthBookClient)
    return defaultValue;
  let result;
  if (remoteEvalFeatureValues.has(feature))
    result = remoteEvalFeatureValues.get(feature);
  else
    result = growthBookClient.getFeatureValue(feature, defaultValue);
  if (logExposure)
    logExposureForFeature(feature);
  return result;
}
async function getFeatureValue_DEPRECATED(feature, defaultValue) {
  return getFeatureValueInternal(feature, defaultValue, !0);
}
function getFeatureValue_CACHED_MAY_BE_STALE(feature, defaultValue) {
  let overrides = getEnvOverrides();
  if (overrides && feature in overrides)
    return overrides[feature];
  let configOverrides = getConfigOverrides();
  if (configOverrides && feature in configOverrides)
    return configOverrides[feature];
  if (!isGrowthBookEnabled())
    return defaultValue;
  if (experimentDataByFeature.has(feature))
    logExposureForFeature(feature);
  else
    pendingExposures.add(feature);
  if (remoteEvalFeatureValues.has(feature))
    return remoteEvalFeatureValues.get(feature);
  try {
    let cached3 = getGlobalConfig().cachedGrowthBookFeatures?.[feature];
    return cached3 !== void 0 ? cached3 : defaultValue;
  } catch {
    return defaultValue;
  }
}
function getFeatureValue_CACHED_WITH_REFRESH(feature, defaultValue, _refreshIntervalMs) {
  return getFeatureValue_CACHED_MAY_BE_STALE(feature, defaultValue);
}
function checkStatsigFeatureGate_CACHED_MAY_BE_STALE(gate) {
  let overrides = getEnvOverrides();
  if (overrides && gate in overrides)
    return Boolean(overrides[gate]);
  let configOverrides = getConfigOverrides();
  if (configOverrides && gate in configOverrides)
    return Boolean(configOverrides[gate]);
  if (!isGrowthBookEnabled())
    return !1;
  if (experimentDataByFeature.has(gate))
    logExposureForFeature(gate);
  else
    pendingExposures.add(gate);
  let config11 = getGlobalConfig(), gbCached = config11.cachedGrowthBookFeatures?.[gate];
  if (gbCached !== void 0)
    return Boolean(gbCached);
  return config11.cachedStatsigGates?.[gate] ?? !1;
}
async function checkSecurityRestrictionGate(gate) {
  let overrides = getEnvOverrides();
  if (overrides && gate in overrides)
    return Boolean(overrides[gate]);
  let configOverrides = getConfigOverrides();
  if (configOverrides && gate in configOverrides)
    return Boolean(configOverrides[gate]);
  if (!isGrowthBookEnabled())
    return !1;
  if (reinitializingPromise)
    await reinitializingPromise;
  let config11 = getGlobalConfig(), statsigCached = config11.cachedStatsigGates?.[gate];
  if (statsigCached !== void 0)
    return Boolean(statsigCached);
  let gbCached = config11.cachedGrowthBookFeatures?.[gate];
  if (gbCached !== void 0)
    return Boolean(gbCached);
  return !1;
}
async function checkGate_CACHED_OR_BLOCKING(gate) {
  let overrides = getEnvOverrides();
  if (overrides && gate in overrides)
    return Boolean(overrides[gate]);
  let configOverrides = getConfigOverrides();
  if (configOverrides && gate in configOverrides)
    return Boolean(configOverrides[gate]);
  if (!isGrowthBookEnabled())
    return !1;
  if (getGlobalConfig().cachedGrowthBookFeatures?.[gate] === !0) {
    if (experimentDataByFeature.has(gate))
      logExposureForFeature(gate);
    else
      pendingExposures.add(gate);
    return !0;
  }
  return getFeatureValueInternal(gate, !1, !0);
}
function refreshGrowthBookAfterAuthChange() {
  if (!isGrowthBookEnabled())
    return;
  try {
    resetGrowthBook(), refreshed.emit(), reinitializingPromise = initializeGrowthBook().catch((error44) => {
      return logError2(toError(error44)), null;
    }).finally(() => {
      reinitializingPromise = null;
    });
  } catch (error44) {
    throw error44;
  }
}
function resetGrowthBook() {
  if (stopPeriodicGrowthBookRefresh(), currentBeforeExitHandler)
    process.off("beforeExit", currentBeforeExitHandler), currentBeforeExitHandler = null;
  if (currentExitHandler)
    process.off("exit", currentExitHandler), currentExitHandler = null;
  client15?.destroy(), client15 = null, clientCreatedWithAuth = !1, reinitializingPromise = null, experimentDataByFeature.clear(), pendingExposures.clear(), loggedExposures.clear(), remoteEvalFeatureValues.clear(), getGrowthBookClient.cache?.clear?.(), initializeGrowthBook.cache?.clear?.(), envOverrides = null, envOverridesParsed = !1;
}
async function refreshGrowthBookFeatures() {
  if (!isGrowthBookEnabled())
    return;
  try {
    let growthBookClient = await initializeGrowthBook();
    if (!growthBookClient)
      return;
    if (await growthBookClient.refreshFeatures(), growthBookClient !== client15)
      return;
    let hadFeatures = await processRemoteEvalPayload(growthBookClient);
    if (growthBookClient !== client15)
      return;
    if (hadFeatures)
      syncRemoteEvalToDisk(), refreshed.emit();
  } catch (error44) {
    throw error44;
  }
}
function setupPeriodicGrowthBookRefresh() {
  if (!isGrowthBookEnabled())
    return;
  if (refreshInterval)
    clearInterval(refreshInterval);
  if (refreshInterval = setInterval(() => {
    refreshGrowthBookFeatures();
  }, GROWTHBOOK_REFRESH_INTERVAL_MS), refreshInterval.unref?.(), !beforeExitListener)
    beforeExitListener = () => {
      stopPeriodicGrowthBookRefresh();
    }, process.once("beforeExit", beforeExitListener);
}
function stopPeriodicGrowthBookRefresh() {
  if (refreshInterval)
    clearInterval(refreshInterval), refreshInterval = null;
  if (beforeExitListener)
    process.removeListener("beforeExit", beforeExitListener), beforeExitListener = null;
}
async function getDynamicConfig_BLOCKS_ON_INIT(configName, defaultValue) {
  return getFeatureValue_DEPRECATED(configName, defaultValue);
}
function getDynamicConfig_CACHED_MAY_BE_STALE(configName, defaultValue) {
  return getFeatureValue_CACHED_MAY_BE_STALE(configName, defaultValue);
}
var client15 = null, currentBeforeExitHandler = null, currentExitHandler = null, clientCreatedWithAuth = !1, experimentDataByFeature, remoteEvalFeatureValues, pendingExposures, loggedExposures, reinitializingPromise = null, refreshed, envOverrides = null, envOverridesParsed = !1, getGrowthBookClient, initializeGrowthBook, GROWTHBOOK_REFRESH_INTERVAL_MS = 21600000, refreshInterval = null, beforeExitListener = null;
var init_growthbook = __esm(() => {
  init_esm36();
  init_lodash();
  init_state();
  init_config4();
  init_debug();
  init_errors();
  init_http6();
  init_log3();
  init_slowOperations();
  init_user();
  experimentDataByFeature = /* @__PURE__ */ new Map, remoteEvalFeatureValues = /* @__PURE__ */ new Map, pendingExposures = /* @__PURE__ */ new Set, loggedExposures = /* @__PURE__ */ new Set, refreshed = createSignal();
  getGrowthBookClient = memoize_default(() => {
    if (!isGrowthBookEnabled())
      return null;
    let attributes2 = getUserAttributes(), clientKey = getGrowthBookClientKey(), baseUrl = "https://api.anthropic.com/", authHeaders = checkHasTrustDialogAccepted() || getSessionTrustAccepted() || getIsNonInteractiveSession() ? getAuthHeaders() : { headers: {}, error: "trust not established" }, hasAuth = !authHeaders.error;
    clientCreatedWithAuth = hasAuth;
    let thisClient = new GrowthBook({
      apiHost: baseUrl,
      clientKey,
      attributes: attributes2,
      remoteEval: !0,
      cacheKeyAttributes: ["id", "organizationUUID"],
      ...authHeaders.error ? {} : { apiHostRequestHeaders: authHeaders.headers },
      ...{}
    });
    if (client15 = thisClient, !hasAuth)
      return { client: thisClient, initialized: Promise.resolve() };
    let initialized5 = thisClient.init({ timeout: 5000 }).then(async (result) => {
      if (client15 !== thisClient)
        return;
      let hadFeatures = await processRemoteEvalPayload(thisClient);
      if (client15 !== thisClient)
        return;
      if (hadFeatures) {
        for (let feature of pendingExposures)
          logExposureForFeature(feature);
        pendingExposures.clear(), syncRemoteEvalToDisk(), refreshed.emit();
      }
    }).catch((error44) => {});
    return currentBeforeExitHandler = () => client15?.destroy(), currentExitHandler = () => client15?.destroy(), process.on("beforeExit", currentBeforeExitHandler), process.on("exit", currentExitHandler), { client: thisClient, initialized: initialized5 };
  }), initializeGrowthBook = memoize_default(async () => {
    let clientWrapper = getGrowthBookClient();
    if (!clientWrapper)
      return null;
    if (!clientCreatedWithAuth) {
      if (checkHasTrustDialogAccepted() || getSessionTrustAccepted() || getIsNonInteractiveSession()) {
        if (!getAuthHeaders().error) {
          if (resetGrowthBook(), clientWrapper = getGrowthBookClient(), !clientWrapper)
            return null;
        }
      }
    }
    return await clientWrapper.initialized, setupPeriodicGrowthBookRefresh(), clientWrapper.client;
  });
});
