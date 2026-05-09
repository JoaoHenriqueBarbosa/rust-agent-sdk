// function: cleanupCache
function cleanupCache() {
  let entriesWithTimestamps = Array.from(cache7.entries()).map(([key3, value]) => ({
    key: key3,
    staleAt: value.staleAt.getTime()
  })).sort((a2, b) => a2.staleAt - b.staleAt), entriesToRemoveCount = Math.min(Math.max(0, cache7.size - cacheSettings.maxEntries), cache7.size);
  for (let i5 = 0;i5 < entriesToRemoveCount; i5++)
    cache7.delete(entriesWithTimestamps[i5].key);
}
