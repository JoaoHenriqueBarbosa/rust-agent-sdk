// var: DEFAULT_CLIENT_RETRY_INTERVAL
var DEFAULT_CLIENT_RETRY_INTERVAL = 1000, DEFAULT_CLIENT_MAX_RETRY_INTERVAL = 64000;
var init_exponentialRetryStrategy = __esm(() => {
  init_delay();
  init_throttlingRetryStrategy();
});
