// function: isCacheExpired
function isCacheExpired(lastUpdatedAt, cacheRetentionDays) {
  let cacheExpirationTimestamp = Number(lastUpdatedAt) + cacheRetentionDays * 24 * 60 * 60 * 1000;
  return Date.now() > cacheExpirationTimestamp;
}
