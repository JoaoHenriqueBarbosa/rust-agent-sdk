// function: retryPolicy2
function retryPolicy2(strategies, options = { maxRetries: DEFAULT_RETRY_POLICY_COUNT2 }) {
  return retryPolicy(strategies, {
    logger: retryPolicyLogger2,
    ...options
  });
}
