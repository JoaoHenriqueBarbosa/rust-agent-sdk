// function: markAsRecentlyUsed
function markAsRecentlyUsed(correlationId, data) {
  correlationCache.delete(correlationId), correlationCache.set(correlationId, data);
}
