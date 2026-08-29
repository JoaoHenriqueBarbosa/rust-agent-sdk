// function: onNewFeatureData
function onNewFeatureData(key3, cacheKey, data) {
  let version6 = data.dateUpdated || "", staleAt = new Date(Date.now() + cacheSettings.staleTTL), existing = !cacheSettings.disableCache ? cache7.get(cacheKey) : void 0;
  if (existing && version6 && existing.version === version6) {
    existing.staleAt = staleAt, updatePersistentCache();
    return;
  }
  if (!cacheSettings.disableCache)
    cache7.set(cacheKey, {
      data,
      version: version6,
      staleAt,
      sse: supportsSSE.has(key3)
    }), cleanupCache();
  updatePersistentCache();
  let instances2 = subscribedInstances.get(key3);
  instances2 && instances2.forEach((instance) => refreshInstance(instance, data));
}
