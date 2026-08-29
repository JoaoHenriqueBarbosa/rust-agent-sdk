// var: require_dist_cjs54
var require_dist_cjs54 = __commonJS((exports) => {
  var CLOCK_SKEW_ERROR_CODES = [
    "AuthFailure",
    "InvalidSignatureException",
    "RequestExpired",
    "RequestInTheFuture",
    "RequestTimeTooSkewed",
    "SignatureDoesNotMatch"
  ], THROTTLING_ERROR_CODES = [
    "BandwidthLimitExceeded",
    "EC2ThrottledException",
    "LimitExceededException",
    "PriorRequestNotComplete",
    "ProvisionedThroughputExceededException",
    "RequestLimitExceeded",
    "RequestThrottled",
    "RequestThrottledException",
    "SlowDown",
    "ThrottledException",
    "Throttling",
    "ThrottlingException",
    "TooManyRequestsException",
    "TransactionInProgressException"
  ], TRANSIENT_ERROR_CODES = ["TimeoutError", "RequestTimeout", "RequestTimeoutException"], TRANSIENT_ERROR_STATUS_CODES = [500, 502, 503, 504], NODEJS_TIMEOUT_ERROR_CODES = ["ECONNRESET", "ECONNREFUSED", "EPIPE", "ETIMEDOUT"], NODEJS_NETWORK_ERROR_CODES = ["EHOSTUNREACH", "ENETUNREACH", "ENOTFOUND"], isRetryableByTrait = (error41) => error41?.$retryable !== void 0, isClockSkewError = (error41) => CLOCK_SKEW_ERROR_CODES.includes(error41.name), isClockSkewCorrectedError = (error41) => error41.$metadata?.clockSkewCorrected, isBrowserNetworkError = (error41) => {
    let errorMessages = /* @__PURE__ */ new Set([
      "Failed to fetch",
      "NetworkError when attempting to fetch resource",
      "The Internet connection appears to be offline",
      "Load failed",
      "Network request failed"
    ]);
    if (!(error41 && error41 instanceof TypeError))
      return !1;
    return errorMessages.has(error41.message);
  }, isThrottlingError = (error41) => error41.$metadata?.httpStatusCode === 429 || THROTTLING_ERROR_CODES.includes(error41.name) || error41.$retryable?.throttling == !0, isTransientError = (error41, depth = 0) => isRetryableByTrait(error41) || isClockSkewCorrectedError(error41) || TRANSIENT_ERROR_CODES.includes(error41.name) || NODEJS_TIMEOUT_ERROR_CODES.includes(error41?.code || "") || NODEJS_NETWORK_ERROR_CODES.includes(error41?.code || "") || TRANSIENT_ERROR_STATUS_CODES.includes(error41.$metadata?.httpStatusCode || 0) || isBrowserNetworkError(error41) || error41.cause !== void 0 && depth <= 10 && isTransientError(error41.cause, depth + 1), isServerError = (error41) => {
    if (error41.$metadata?.httpStatusCode !== void 0) {
      let statusCode = error41.$metadata.httpStatusCode;
      if (500 <= statusCode && statusCode <= 599 && !isTransientError(error41))
        return !0;
      return !1;
    }
    return !1;
  };
  exports.isBrowserNetworkError = isBrowserNetworkError;
  exports.isClockSkewCorrectedError = isClockSkewCorrectedError;
  exports.isClockSkewError = isClockSkewError;
  exports.isRetryableByTrait = isRetryableByTrait;
  exports.isServerError = isServerError;
  exports.isThrottlingError = isThrottlingError;
  exports.isTransientError = isTransientError;
});
