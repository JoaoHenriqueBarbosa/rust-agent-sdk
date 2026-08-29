// class: ImdsRetryPolicy
class ImdsRetryPolicy {
  constructor() {
    this.exponentialRetryStrategy = new ExponentialRetryStrategy(ImdsRetryPolicy.MIN_EXPONENTIAL_BACKOFF_MS, ImdsRetryPolicy.MAX_EXPONENTIAL_BACKOFF_MS, ImdsRetryPolicy.EXPONENTIAL_DELTA_BACKOFF_MS);
  }
  static get MIN_EXPONENTIAL_BACKOFF_MS() {
    return MIN_EXPONENTIAL_BACKOFF_MS;
  }
  static get MAX_EXPONENTIAL_BACKOFF_MS() {
    return MAX_EXPONENTIAL_BACKOFF_MS;
  }
  static get EXPONENTIAL_DELTA_BACKOFF_MS() {
    return EXPONENTIAL_DELTA_BACKOFF_MS;
  }
  static get HTTP_STATUS_GONE_RETRY_AFTER_MS() {
    return HTTP_STATUS_GONE_RETRY_AFTER_MS;
  }
  set isNewRequest(value) {
    this._isNewRequest = value;
  }
  async pauseForRetry(httpStatusCode, currentRetry, logger10) {
    if (this._isNewRequest)
      this._isNewRequest = !1, this.maxRetries = httpStatusCode === exports_Constants.HTTP_GONE ? LINEAR_STRATEGY_NUM_RETRIES : EXPONENTIAL_STRATEGY_NUM_RETRIES;
    if ((HTTP_STATUS_400_CODES_FOR_EXPONENTIAL_STRATEGY.includes(httpStatusCode) || httpStatusCode >= exports_Constants.HTTP_SERVER_ERROR_RANGE_START && httpStatusCode <= exports_Constants.HTTP_SERVER_ERROR_RANGE_END && currentRetry < this.maxRetries) && currentRetry < this.maxRetries) {
      let retryAfterDelay = httpStatusCode === exports_Constants.HTTP_GONE ? ImdsRetryPolicy.HTTP_STATUS_GONE_RETRY_AFTER_MS : this.exponentialRetryStrategy.calculateDelay(currentRetry);
      return logger10.verbose(`Retrying request in ${retryAfterDelay}ms (retry attempt: ${currentRetry + 1})`, ""), await new Promise((resolve9) => {
        return setTimeout(resolve9, retryAfterDelay);
      }), !0;
    }
    return !1;
  }
}
