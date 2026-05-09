// function: defaultRetryPolicy
function defaultRetryPolicy(options = {}) {
  return {
    name: defaultRetryPolicyName,
    sendRequest: retryPolicy([throttlingRetryStrategy(), exponentialRetryStrategy(options)], {
      maxRetries: options.maxRetries ?? DEFAULT_RETRY_POLICY_COUNT
    }).sendRequest
  };
}
