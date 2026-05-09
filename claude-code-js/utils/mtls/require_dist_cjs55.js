// var: require_dist_cjs55
var require_dist_cjs55 = __commonJS((exports) => {
  var serviceErrorClassification = require_dist_cjs54();
  exports.RETRY_MODES = void 0;
  (function(RETRY_MODES) {
    RETRY_MODES.STANDARD = "standard", RETRY_MODES.ADAPTIVE = "adaptive";
  })(exports.RETRY_MODES || (exports.RETRY_MODES = {}));
  var DEFAULT_MAX_ATTEMPTS = 3, DEFAULT_RETRY_MODE = exports.RETRY_MODES.STANDARD;

  class DefaultRateLimiter {
    static setTimeoutFn = setTimeout;
    beta;
    minCapacity;
    minFillRate;
    scaleConstant;
    smooth;
    enabled = !1;
    availableTokens = 0;
    lastMaxRate = 0;
    measuredTxRate = 0;
    requestCount = 0;
    fillRate;
    lastThrottleTime;
    lastTimestamp = 0;
    lastTxRateBucket;
    maxCapacity;
    timeWindow = 0;
    constructor(options) {
      this.beta = options?.beta ?? 0.7, this.minCapacity = options?.minCapacity ?? 1, this.minFillRate = options?.minFillRate ?? 0.5, this.scaleConstant = options?.scaleConstant ?? 0.4, this.smooth = options?.smooth ?? 0.8, this.lastThrottleTime = this.getCurrentTimeInSeconds(), this.lastTxRateBucket = Math.floor(this.getCurrentTimeInSeconds()), this.fillRate = this.minFillRate, this.maxCapacity = this.minCapacity;
    }
    async getSendToken() {
      return this.acquireTokenBucket(1);
    }
    updateClientSendingRate(response2) {
      let calculatedRate;
      this.updateMeasuredRate();
      let retryErrorInfo = response2;
      if (retryErrorInfo?.errorType === "THROTTLING" || serviceErrorClassification.isThrottlingError(retryErrorInfo?.error ?? response2)) {
        let rateToUse = !this.enabled ? this.measuredTxRate : Math.min(this.measuredTxRate, this.fillRate);
        this.lastMaxRate = rateToUse, this.calculateTimeWindow(), this.lastThrottleTime = this.getCurrentTimeInSeconds(), calculatedRate = this.cubicThrottle(rateToUse), this.enableTokenBucket();
      } else
        this.calculateTimeWindow(), calculatedRate = this.cubicSuccess(this.getCurrentTimeInSeconds());
      let newRate = Math.min(calculatedRate, 2 * this.measuredTxRate);
      this.updateTokenBucketRate(newRate);
    }
    getCurrentTimeInSeconds() {
      return Date.now() / 1000;
    }
    async acquireTokenBucket(amount) {
      if (!this.enabled)
        return;
      if (this.refillTokenBucket(), amount > this.availableTokens) {
        let delay = (amount - this.availableTokens) / this.fillRate * 1000;
        await new Promise((resolve8) => DefaultRateLimiter.setTimeoutFn(resolve8, delay));
      }
      this.availableTokens = this.availableTokens - amount;
    }
    refillTokenBucket() {
      let timestamp = this.getCurrentTimeInSeconds();
      if (!this.lastTimestamp) {
        this.lastTimestamp = timestamp;
        return;
      }
      let fillAmount = (timestamp - this.lastTimestamp) * this.fillRate;
      this.availableTokens = Math.min(this.maxCapacity, this.availableTokens + fillAmount), this.lastTimestamp = timestamp;
    }
    calculateTimeWindow() {
      this.timeWindow = this.getPrecise(Math.pow(this.lastMaxRate * (1 - this.beta) / this.scaleConstant, 0.3333333333333333));
    }
    cubicThrottle(rateToUse) {
      return this.getPrecise(rateToUse * this.beta);
    }
    cubicSuccess(timestamp) {
      return this.getPrecise(this.scaleConstant * Math.pow(timestamp - this.lastThrottleTime - this.timeWindow, 3) + this.lastMaxRate);
    }
    enableTokenBucket() {
      this.enabled = !0;
    }
    updateTokenBucketRate(newRate) {
      this.refillTokenBucket(), this.fillRate = Math.max(newRate, this.minFillRate), this.maxCapacity = Math.max(newRate, this.minCapacity), this.availableTokens = Math.min(this.availableTokens, this.maxCapacity);
    }
    updateMeasuredRate() {
      let t = this.getCurrentTimeInSeconds(), timeBucket = Math.floor(t * 2) / 2;
      if (this.requestCount++, timeBucket > this.lastTxRateBucket) {
        let currentRate = this.requestCount / (timeBucket - this.lastTxRateBucket);
        this.measuredTxRate = this.getPrecise(currentRate * this.smooth + this.measuredTxRate * (1 - this.smooth)), this.requestCount = 0, this.lastTxRateBucket = timeBucket;
      }
    }
    getPrecise(num) {
      return parseFloat(num.toFixed(8));
    }
  }
  var DEFAULT_RETRY_DELAY_BASE = 100, MAXIMUM_RETRY_DELAY = 20000, THROTTLING_RETRY_DELAY_BASE = 500, INITIAL_RETRY_TOKENS = 500, RETRY_COST = 5, TIMEOUT_RETRY_COST = 10, NO_RETRY_INCREMENT = 1, INVOCATION_ID_HEADER = "amz-sdk-invocation-id", REQUEST_HEADER = "amz-sdk-request";

  class Retry {
    static v2026 = typeof process < "u" && process.env?.SMITHY_NEW_RETRIES_2026 === "true";
    static delay() {
      return Retry.v2026 ? 50 : 100;
    }
    static throttlingDelay() {
      return Retry.v2026 ? 1000 : 500;
    }
    static cost() {
      return Retry.v2026 ? 14 : 5;
    }
    static throttlingCost() {
      return Retry.v2026 ? 5 : 10;
    }
    static modifiedCostType() {
      return Retry.v2026 ? "THROTTLING" : "TRANSIENT";
    }
  }

  class DefaultRetryBackoffStrategy {
    x = Retry.delay();
    computeNextBackoffDelay(i2) {
      let b = Math.random(), r = 2, t_i = b * Math.min(this.x * 2 ** i2, MAXIMUM_RETRY_DELAY);
      return Math.floor(t_i);
    }
    setDelayBase(delay) {
      this.x = delay;
    }
  }

  class DefaultRetryToken {
    delay;
    count;
    cost;
    longPoll;
    constructor(delay, count3, cost, longPoll) {
      this.delay = delay, this.count = count3, this.cost = cost, this.longPoll = longPoll;
    }
    getRetryCount() {
      return this.count;
    }
    getRetryDelay() {
      return Math.min(MAXIMUM_RETRY_DELAY, this.delay);
    }
    getRetryCost() {
      return this.cost;
    }
    isLongPoll() {
      return this.longPoll;
    }
  }

  class StandardRetryStrategy {
    mode = exports.RETRY_MODES.STANDARD;
    capacity = INITIAL_RETRY_TOKENS;
    retryBackoffStrategy;
    maxAttemptsProvider;
    baseDelay;
    constructor(arg1) {
      if (typeof arg1 === "number")
        this.maxAttemptsProvider = async () => arg1;
      else if (typeof arg1 === "function")
        this.maxAttemptsProvider = arg1;
      else if (arg1 && typeof arg1 === "object")
        this.maxAttemptsProvider = async () => arg1.maxAttempts, this.baseDelay = arg1.baseDelay, this.retryBackoffStrategy = arg1.backoff;
      this.maxAttemptsProvider ??= async () => DEFAULT_MAX_ATTEMPTS, this.baseDelay ??= Retry.delay(), this.retryBackoffStrategy ??= new DefaultRetryBackoffStrategy;
    }
    async acquireInitialRetryToken(retryTokenScope) {
      return new DefaultRetryToken(Retry.delay(), 0, void 0, Retry.v2026 && retryTokenScope.includes(":longpoll"));
    }
    async refreshRetryTokenForRetry(token, errorInfo) {
      let maxAttempts = await this.getMaxAttempts(), shouldRetry = this.shouldRetry(token, errorInfo, maxAttempts);
      if (shouldRetry || token.isLongPoll?.()) {
        let errorType = errorInfo.errorType;
        this.retryBackoffStrategy.setDelayBase(errorType === "THROTTLING" ? Retry.throttlingDelay() : this.baseDelay);
        let delayFromErrorType = this.retryBackoffStrategy.computeNextBackoffDelay(token.getRetryCount()), retryDelay = delayFromErrorType;
        if (errorInfo.retryAfterHint instanceof Date)
          retryDelay = Math.max(delayFromErrorType, Math.min(errorInfo.retryAfterHint.getTime() - Date.now(), delayFromErrorType + 5000));
        if (!shouldRetry)
          throw Object.assign(Error("No retry token available"), { $backoff: Retry.v2026 ? retryDelay : 0 });
        else {
          let capacityCost = this.getCapacityCost(errorType);
          return this.capacity -= capacityCost, new DefaultRetryToken(retryDelay, token.getRetryCount() + 1, capacityCost, token.isLongPoll?.() ?? !1);
        }
      }
      throw Error("No retry token available");
    }
    recordSuccess(token) {
      this.capacity = Math.min(INITIAL_RETRY_TOKENS, this.capacity + (token.getRetryCost() ?? NO_RETRY_INCREMENT));
    }
    getCapacity() {
      return this.capacity;
    }
    async getMaxAttempts() {
      try {
        return await this.maxAttemptsProvider();
      } catch (error41) {
        return console.warn(`Max attempts provider could not resolve. Using default of ${DEFAULT_MAX_ATTEMPTS}`), DEFAULT_MAX_ATTEMPTS;
      }
    }
    shouldRetry(tokenToRenew, errorInfo, maxAttempts) {
      return tokenToRenew.getRetryCount() + 1 < maxAttempts && this.capacity >= this.getCapacityCost(errorInfo.errorType) && this.isRetryableError(errorInfo.errorType);
    }
    getCapacityCost(errorType) {
      return errorType === Retry.modifiedCostType() ? Retry.throttlingCost() : Retry.cost();
    }
    isRetryableError(errorType) {
      return errorType === "THROTTLING" || errorType === "TRANSIENT";
    }
  }

  class AdaptiveRetryStrategy {
    mode = exports.RETRY_MODES.ADAPTIVE;
    rateLimiter;
    standardRetryStrategy;
    constructor(maxAttemptsProvider, options) {
      let { rateLimiter } = options ?? {};
      this.rateLimiter = rateLimiter ?? new DefaultRateLimiter, this.standardRetryStrategy = options ? new StandardRetryStrategy({
        maxAttempts: typeof maxAttemptsProvider === "number" ? maxAttemptsProvider : 3,
        ...options
      }) : new StandardRetryStrategy(maxAttemptsProvider);
    }
    async acquireInitialRetryToken(retryTokenScope) {
      return await this.rateLimiter.getSendToken(), this.standardRetryStrategy.acquireInitialRetryToken(retryTokenScope);
    }
    async refreshRetryTokenForRetry(tokenToRenew, errorInfo) {
      return this.rateLimiter.updateClientSendingRate(errorInfo), this.standardRetryStrategy.refreshRetryTokenForRetry(tokenToRenew, errorInfo);
    }
    recordSuccess(token) {
      this.rateLimiter.updateClientSendingRate({}), this.standardRetryStrategy.recordSuccess(token);
    }
  }

  class ConfiguredRetryStrategy extends StandardRetryStrategy {
    computeNextBackoffDelay;
    constructor(maxAttempts, computeNextBackoffDelay = Retry.delay()) {
      super(typeof maxAttempts === "function" ? maxAttempts : async () => maxAttempts);
      if (typeof computeNextBackoffDelay === "number")
        this.computeNextBackoffDelay = () => computeNextBackoffDelay;
      else
        this.computeNextBackoffDelay = computeNextBackoffDelay;
    }
    async refreshRetryTokenForRetry(tokenToRenew, errorInfo) {
      let token = await super.refreshRetryTokenForRetry(tokenToRenew, errorInfo);
      return token.getRetryDelay = () => this.computeNextBackoffDelay(token.getRetryCount()), token;
    }
  }
  exports.AdaptiveRetryStrategy = AdaptiveRetryStrategy;
  exports.ConfiguredRetryStrategy = ConfiguredRetryStrategy;
  exports.DEFAULT_MAX_ATTEMPTS = DEFAULT_MAX_ATTEMPTS;
  exports.DEFAULT_RETRY_DELAY_BASE = DEFAULT_RETRY_DELAY_BASE;
  exports.DEFAULT_RETRY_MODE = DEFAULT_RETRY_MODE;
  exports.DefaultRateLimiter = DefaultRateLimiter;
  exports.INITIAL_RETRY_TOKENS = INITIAL_RETRY_TOKENS;
  exports.INVOCATION_ID_HEADER = INVOCATION_ID_HEADER;
  exports.MAXIMUM_RETRY_DELAY = MAXIMUM_RETRY_DELAY;
  exports.NO_RETRY_INCREMENT = NO_RETRY_INCREMENT;
  exports.REQUEST_HEADER = REQUEST_HEADER;
  exports.RETRY_COST = RETRY_COST;
  exports.Retry = Retry;
  exports.StandardRetryStrategy = StandardRetryStrategy;
  exports.THROTTLING_RETRY_DELAY_BASE = THROTTLING_RETRY_DELAY_BASE;
  exports.TIMEOUT_RETRY_COST = TIMEOUT_RETRY_COST;
});
