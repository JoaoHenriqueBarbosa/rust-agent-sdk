// function: reportConfigCacheStats
function reportConfigCacheStats() {
  let total = configCacheHits + configCacheMisses;
  if (total > 0)
    logEvent("tengu_config_cache_stats", {
      cache_hits: configCacheHits,
      cache_misses: configCacheMisses,
      hit_rate: configCacheHits / total
    });
  configCacheHits = 0, configCacheMisses = 0;
}
