// function: initializeCache
async function initializeCache() {
  if (cacheInitialized)
    return;
  cacheInitialized = !0;
  try {
    if (polyfills2.localStorage) {
      let value = await polyfills2.localStorage.getItem(cacheSettings.cacheKey);
      if (!cacheSettings.disableCache && value) {
        let parsed = JSON.parse(value);
        if (parsed && Array.isArray(parsed))
          parsed.forEach(([key3, data]) => {
            cache7.set(key3, {
              ...data,
              staleAt: new Date(data.staleAt)
            });
          });
        cleanupCache();
      }
    }
  } catch (e) {}
  if (!cacheSettings.disableIdleStreams) {
    let cleanupFn = helpers2.startIdleListener();
    if (cleanupFn)
      helpers2.stopIdleListener = cleanupFn;
  }
}
