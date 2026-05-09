// function: updatePersistentCache
async function updatePersistentCache() {
  try {
    if (!polyfills2.localStorage)
      return;
    await polyfills2.localStorage.setItem(cacheSettings.cacheKey, JSON.stringify(Array.from(cache7.entries())));
  } catch (e) {}
}
