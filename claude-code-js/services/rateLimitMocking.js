// Original: src/services/rateLimitMocking.ts
function processRateLimitHeaders(headers) {
  if (shouldProcessMockLimits())
    return applyMockHeaders(headers);
  return headers;
}
function shouldProcessRateLimits(isSubscriber) {
  return isSubscriber || shouldProcessMockLimits();
}
function isMockRateLimitError(error44) {
  return shouldProcessMockLimits() && error44.status === 429;
}
var init_rateLimitMocking = __esm(() => {
  init_sdk();
  init_mockRateLimits();
});
