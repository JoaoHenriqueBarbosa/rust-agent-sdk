// class: DefaultManagedIdentityRetryPolicy
class DefaultManagedIdentityRetryPolicy {
  constructor() {
    this.linearRetryStrategy = new LinearRetryStrategy;
  }
  static get DEFAULT_MANAGED_IDENTITY_RETRY_DELAY_MS() {
    return DEFAULT_MANAGED_IDENTITY_RETRY_DELAY_MS;
  }
  async pauseForRetry(httpStatusCode, currentRetry, logger10, retryAfterHeader) {
    if (DEFAULT_MANAGED_IDENTITY_HTTP_STATUS_CODES_TO_RETRY_ON.includes(httpStatusCode) && currentRetry < DEFAULT_MANAGED_IDENTITY_MAX_RETRIES) {
      let retryAfterDelay = this.linearRetryStrategy.calculateDelay(retryAfterHeader, DefaultManagedIdentityRetryPolicy.DEFAULT_MANAGED_IDENTITY_RETRY_DELAY_MS);
      return logger10.verbose(`Retrying request in ${retryAfterDelay}ms (retry attempt: ${currentRetry + 1})`, ""), await new Promise((resolve9) => {
        return setTimeout(resolve9, retryAfterDelay);
      }), !0;
    }
    return !1;
  }
}
