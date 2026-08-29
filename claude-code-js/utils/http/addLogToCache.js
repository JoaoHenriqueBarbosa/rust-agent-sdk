// function: addLogToCache
function addLogToCache(correlationId, loggedMessage) {
  let currentTime = Date.now(), data = correlationCache.get(correlationId);
  if (data)
    markAsRecentlyUsed(correlationId, data);
  else if (data = { logs: [], firstEventTime: currentTime }, correlationCache.set(correlationId, data), correlationCache.size > CACHE_CAPACITY) {
    let firstKey = correlationCache.keys().next().value;
    if (firstKey)
      correlationCache.delete(firstKey);
  }
  if (data.logs.push({
    ...loggedMessage,
    milliseconds: currentTime - data.firstEventTime
  }), data.logs.length > MAX_LOGS_PER_CORRELATION)
    data.logs.shift();
}
