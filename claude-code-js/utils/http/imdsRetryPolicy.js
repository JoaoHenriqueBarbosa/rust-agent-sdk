// function: imdsRetryPolicy
function imdsRetryPolicy(msiRetryConfig) {
  return retryPolicy2([
    {
      name: "imdsRetryPolicy",
      retry: ({ retryCount, response: response7 }) => {
        if (response7?.status !== 404 && response7?.status !== 410)
          return { skipStrategy: !0 };
        let initialDelayMs = response7?.status === 410 ? Math.max(MIN_DELAY_FOR_410_MS, msiRetryConfig.startDelayInMs) : msiRetryConfig.startDelayInMs;
        return calculateRetryDelay2(retryCount, {
          retryDelayInMs: initialDelayMs,
          maxRetryDelayInMs: DEFAULT_CLIENT_MAX_RETRY_INTERVAL2
        });
      }
    }
  ], {
    maxRetries: msiRetryConfig.maxRetries
  });
}
