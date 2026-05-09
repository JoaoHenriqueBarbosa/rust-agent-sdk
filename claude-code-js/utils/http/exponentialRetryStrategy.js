// function: exponentialRetryStrategy
function exponentialRetryStrategy(options = {}) {
  let retryInterval = options.retryDelayInMs ?? DEFAULT_CLIENT_RETRY_INTERVAL, maxRetryInterval = options.maxRetryDelayInMs ?? DEFAULT_CLIENT_MAX_RETRY_INTERVAL;
  return {
    name: "exponentialRetryStrategy",
    retry({ retryCount, response: response7, responseError }) {
      let matchedSystemError = isSystemError(responseError), ignoreSystemErrors = matchedSystemError && options.ignoreSystemErrors, isExponential = isExponentialRetryResponse(response7), ignoreExponentialResponse = isExponential && options.ignoreHttpStatusCodes;
      if (response7 && (isThrottlingRetryResponse(response7) || !isExponential) || ignoreExponentialResponse || ignoreSystemErrors)
        return { skipStrategy: !0 };
      if (responseError && !matchedSystemError && !isExponential)
        return { errorToThrow: responseError };
      return calculateRetryDelay(retryCount, {
        retryDelayInMs: retryInterval,
        maxRetryDelayInMs: maxRetryInterval
      });
    }
  };
}
