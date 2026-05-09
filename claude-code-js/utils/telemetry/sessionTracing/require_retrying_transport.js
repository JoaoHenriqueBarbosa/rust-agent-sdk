// var: require_retrying_transport
var require_retrying_transport = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.createRetryingTransport = void 0;
  var api_1 = require_src7(), MAX_ATTEMPTS = 5, INITIAL_BACKOFF = 1000, MAX_BACKOFF = 5000, BACKOFF_MULTIPLIER = 1.5, JITTER = 0.2;
  function getJitter() {
    return Math.random() * (2 * JITTER) - JITTER;
  }

  class RetryingTransport {
    _transport;
    constructor(transport) {
      this._transport = transport;
    }
    retry(data, timeoutMillis, inMillis) {
      return new Promise((resolve26, reject2) => {
        setTimeout(() => {
          this._transport.send(data, timeoutMillis).then(resolve26, reject2);
        }, inMillis);
      });
    }
    async send(data, timeoutMillis) {
      let attempts = MAX_ATTEMPTS, nextBackoff = INITIAL_BACKOFF, deadline = Date.now() + timeoutMillis, result = await this._transport.send(data, timeoutMillis);
      while (result.status === "retryable" && attempts > 0) {
        attempts--;
        let backoff = Math.max(Math.min(nextBackoff * (1 + getJitter()), MAX_BACKOFF), 0);
        nextBackoff = nextBackoff * BACKOFF_MULTIPLIER;
        let retryInMillis = result.retryInMillis ?? backoff, remainingTimeoutMillis = deadline - Date.now();
        if (retryInMillis > remainingTimeoutMillis)
          return api_1.diag.info(`Export retry time ${Math.round(retryInMillis)}ms exceeds remaining timeout ${Math.round(remainingTimeoutMillis)}ms, not retrying further.`), result;
        api_1.diag.verbose(`Scheduling export retry in ${Math.round(retryInMillis)}ms`), result = await this.retry(data, remainingTimeoutMillis, retryInMillis);
      }
      if (result.status === "success")
        api_1.diag.verbose(`Export succeeded after ${MAX_ATTEMPTS - attempts} retry attempts.`);
      else if (result.status === "retryable")
        api_1.diag.info(`Export failed after maximum retry attempts (${MAX_ATTEMPTS}).`);
      else
        api_1.diag.info(`Export failed with non-retryable error: ${result.error}`);
      return result;
    }
    shutdown() {
      return this._transport.shutdown();
    }
  }
  function createRetryingTransport(options2) {
    return new RetryingTransport(options2.transport);
  }
  exports.createRetryingTransport = createRetryingTransport;
});
