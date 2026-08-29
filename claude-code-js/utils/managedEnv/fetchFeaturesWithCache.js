// function: fetchFeaturesWithCache
async function fetchFeaturesWithCache({
  instance,
  allowStale,
  timeout,
  skipCache
}) {
  let key3 = getKey(instance), cacheKey = getCacheKey(instance), now2 = /* @__PURE__ */ new Date, minStaleAt = new Date(now2.getTime() - cacheSettings.maxAge + cacheSettings.staleTTL);
  await initializeCache();
  let existing = !cacheSettings.disableCache && !skipCache ? cache7.get(cacheKey) : void 0;
  if (existing && (allowStale || existing.staleAt > now2) && existing.staleAt > minStaleAt) {
    if (existing.sse)
      supportsSSE.add(key3);
    if (existing.staleAt < now2)
      fetchFeatures(instance);
    else
      startAutoRefresh(instance);
    return {
      data: existing.data,
      success: !0,
      source: "cache"
    };
  } else
    return await promiseTimeout(fetchFeatures(instance), timeout) || {
      data: null,
      success: !1,
      source: "timeout",
      error: Error("Timeout")
    };
}
