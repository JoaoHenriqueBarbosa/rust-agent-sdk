// var: defaultRetryPolicyName
var defaultRetryPolicyName = "defaultRetryPolicy";
var init_defaultRetryPolicy = __esm(() => {
  init_exponentialRetryStrategy();
  init_throttlingRetryStrategy();
  init_retryPolicy();
});
