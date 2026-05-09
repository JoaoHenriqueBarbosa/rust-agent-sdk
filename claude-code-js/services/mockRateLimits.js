// Original: src/services/mockRateLimits.ts
function getMockHeaders() {
  return null;
}
function applyMockHeaders(headers) {
  let mock = getMockHeaders();
  if (!mock)
    return headers;
  let newHeaders = new globalThis.Headers(headers);
  return Object.entries(mock).forEach(([key, value]) => {
    if (value !== void 0)
      newHeaders.set(key, value);
  }), newHeaders;
}
function shouldProcessMockLimits() {
  return !1;
}
function getMockSubscriptionType() {
  return null;
}
function shouldUseMockSubscription() {
  return mockEnabled && mockSubscriptionType !== null && !1;
}
var mockHeaders, mockEnabled = !1, mockSubscriptionType = null, DEFAULT_MOCK_SUBSCRIPTION = "max";
var init_mockRateLimits = __esm(() => {
  init_billing();
  mockHeaders = {};
});
