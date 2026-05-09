// var: require_retry2
var require_retry2 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.getRetryConfig = getRetryConfig;
  async function getRetryConfig(err) {
    let config8 = getConfig2(err);
    if (!err || !err.config || !config8 && !err.config.retry)
      return { shouldRetry: !1 };
    config8 = config8 || {}, config8.currentRetryAttempt = config8.currentRetryAttempt || 0, config8.retry = config8.retry === void 0 || config8.retry === null ? 3 : config8.retry, config8.httpMethodsToRetry = config8.httpMethodsToRetry || [
      "GET",
      "HEAD",
      "PUT",
      "OPTIONS",
      "DELETE"
    ], config8.noResponseRetries = config8.noResponseRetries === void 0 || config8.noResponseRetries === null ? 2 : config8.noResponseRetries, config8.retryDelayMultiplier = config8.retryDelayMultiplier ? config8.retryDelayMultiplier : 2, config8.timeOfFirstRequest = config8.timeOfFirstRequest ? config8.timeOfFirstRequest : Date.now(), config8.totalTimeout = config8.totalTimeout ? config8.totalTimeout : Number.MAX_SAFE_INTEGER, config8.maxRetryDelay = config8.maxRetryDelay ? config8.maxRetryDelay : Number.MAX_SAFE_INTEGER;
    let retryRanges = [
      [100, 199],
      [408, 408],
      [429, 429],
      [500, 599]
    ];
    if (config8.statusCodesToRetry = config8.statusCodesToRetry || retryRanges, err.config.retryConfig = config8, !await (config8.shouldRetry || shouldRetryRequest)(err))
      return { shouldRetry: !1, config: err.config };
    let delay4 = getNextRetryDelay(config8);
    err.config.retryConfig.currentRetryAttempt += 1;
    let backoff = config8.retryBackoff ? config8.retryBackoff(err, delay4) : new Promise((resolve9) => {
      setTimeout(resolve9, delay4);
    });
    if (config8.onRetryAttempt)
      config8.onRetryAttempt(err);
    return await backoff, { shouldRetry: !0, config: err.config };
  }
  function shouldRetryRequest(err) {
    var _a2;
    let config8 = getConfig2(err);
    if (err.name === "AbortError" || ((_a2 = err.error) === null || _a2 === void 0 ? void 0 : _a2.name) === "AbortError")
      return !1;
    if (!config8 || config8.retry === 0)
      return !1;
    if (!err.response && (config8.currentRetryAttempt || 0) >= config8.noResponseRetries)
      return !1;
    if (!err.config.method || config8.httpMethodsToRetry.indexOf(err.config.method.toUpperCase()) < 0)
      return !1;
    if (err.response && err.response.status) {
      let isInRange2 = !1;
      for (let [min, max] of config8.statusCodesToRetry) {
        let status = err.response.status;
        if (status >= min && status <= max) {
          isInRange2 = !0;
          break;
        }
      }
      if (!isInRange2)
        return !1;
    }
    if (config8.currentRetryAttempt = config8.currentRetryAttempt || 0, config8.currentRetryAttempt >= config8.retry)
      return !1;
    return !0;
  }
  function getConfig2(err) {
    if (err && err.config && err.config.retryConfig)
      return err.config.retryConfig;
    return;
  }
  function getNextRetryDelay(config8) {
    var _a2;
    let calculatedDelay = (config8.currentRetryAttempt ? 0 : (_a2 = config8.retryDelay) !== null && _a2 !== void 0 ? _a2 : 100) + (Math.pow(config8.retryDelayMultiplier, config8.currentRetryAttempt) - 1) / 2 * 1000, maxAllowableDelay = config8.totalTimeout - (Date.now() - config8.timeOfFirstRequest);
    return Math.min(calculatedDelay, maxAllowableDelay, config8.maxRetryDelay);
  }
});
