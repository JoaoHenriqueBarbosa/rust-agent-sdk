// function: createCacheError
function createCacheError(e) {
  if (!(e instanceof Error))
    return new CacheError(cacheErrorUnknown);
  if (e.name === "QuotaExceededError" || e.name === "NS_ERROR_DOM_QUOTA_REACHED" || e.message.includes("exceeded the quota"))
    return new CacheError(cacheQuotaExceeded);
  else
    return new CacheError(e.name, e.message);
}
