// function: refreshFeatures
async function refreshFeatures({
  instance,
  timeout,
  skipCache,
  allowStale,
  backgroundSync
}) {
  if (!backgroundSync)
    cacheSettings.backgroundSync = !1;
  return fetchFeaturesWithCache({
    instance,
    allowStale,
    timeout,
    skipCache
  });
}
