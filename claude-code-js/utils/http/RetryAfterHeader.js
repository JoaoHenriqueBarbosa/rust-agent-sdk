// var: RetryAfterHeader
var RetryAfterHeader = "Retry-After", AllRetryAfterHeaders;
var init_throttlingRetryStrategy = __esm(() => {
  init_helpers();
  AllRetryAfterHeaders = ["retry-after-ms", "x-ms-retry-after-ms", RetryAfterHeader];
});
