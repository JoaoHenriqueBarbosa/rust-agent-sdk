// function: throttlingRetryStrategy
function throttlingRetryStrategy() {
  return {
    name: "throttlingRetryStrategy",
    retry({ response: response7 }) {
      let retryAfterInMs = getRetryAfterInMs(response7);
      if (!Number.isFinite(retryAfterInMs))
        return { skipStrategy: !0 };
      return {
        retryAfterInMs
      };
    }
  };
}
