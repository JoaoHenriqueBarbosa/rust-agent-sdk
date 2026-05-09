// var: require_dist_cjs69
var require_dist_cjs69 = __commonJS((exports) => {
  var utilRetry = require_dist_cjs55(), protocolHttp = require_dist_cjs67(), serviceErrorClassification = require_dist_cjs54(), uuid3 = require_dist_cjs31(), utilMiddleware = require_dist_cjs30(), smithyClient = require_dist_cjs68(), isStreamingPayload = require_isStreamingPayload(), serde3 = require_serde(), asSdkError = (error41) => {
    if (error41 instanceof Error)
      return error41;
    if (error41 instanceof Object)
      return Object.assign(Error(), error41);
    if (typeof error41 === "string")
      return Error(error41);
    return Error(`AWS SDK error wrapper for ${error41}`);
  }, getDefaultRetryQuota = (initialRetryTokens, options) => {
    let MAX_CAPACITY = initialRetryTokens, noRetryIncrement = utilRetry.NO_RETRY_INCREMENT, retryCost = utilRetry.RETRY_COST, timeoutRetryCost = utilRetry.TIMEOUT_RETRY_COST, availableCapacity = initialRetryTokens, getCapacityAmount = (error41) => error41.name === "TimeoutError" ? timeoutRetryCost : retryCost, hasRetryTokens = (error41) => getCapacityAmount(error41) <= availableCapacity;
    return Object.freeze({
      hasRetryTokens,
      retrieveRetryTokens: (error41) => {
        if (!hasRetryTokens(error41))
          throw Error("No retry token available");
        let capacityAmount = getCapacityAmount(error41);
        return availableCapacity -= capacityAmount, capacityAmount;
      },
      releaseRetryTokens: (capacityReleaseAmount) => {
        availableCapacity += capacityReleaseAmount ?? noRetryIncrement, availableCapacity = Math.min(availableCapacity, MAX_CAPACITY);
      }
    });
  }, defaultDelayDecider = (delayBase, attempts) => Math.floor(Math.min(utilRetry.MAXIMUM_RETRY_DELAY, Math.random() * 2 ** attempts * delayBase)), defaultRetryDecider = (error41) => {
    if (!error41)
      return !1;
    return serviceErrorClassification.isRetryableByTrait(error41) || serviceErrorClassification.isClockSkewError(error41) || serviceErrorClassification.isThrottlingError(error41) || serviceErrorClassification.isTransientError(error41);
  };

  class StandardRetryStrategy {
    maxAttemptsProvider;
    retryDecider;
    delayDecider;
    retryQuota;
    mode = utilRetry.RETRY_MODES.STANDARD;
    constructor(maxAttemptsProvider, options) {
      this.maxAttemptsProvider = maxAttemptsProvider, this.retryDecider = options?.retryDecider ?? defaultRetryDecider, this.delayDecider = options?.delayDecider ?? defaultDelayDecider, this.retryQuota = options?.retryQuota ?? getDefaultRetryQuota(utilRetry.INITIAL_RETRY_TOKENS);
    }
    shouldRetry(error41, attempts, maxAttempts) {
      return attempts < maxAttempts && this.retryDecider(error41) && this.retryQuota.hasRetryTokens(error41);
    }
    async getMaxAttempts() {
      let maxAttempts;
      try {
        maxAttempts = await this.maxAttemptsProvider();
      } catch (error41) {
        maxAttempts = utilRetry.DEFAULT_MAX_ATTEMPTS;
      }
      return maxAttempts;
    }
    async retry(next, args, options) {
      let retryTokenAmount, attempts = 0, totalDelay = 0, maxAttempts = await this.getMaxAttempts(), { request: request2 } = args;
      if (protocolHttp.HttpRequest.isInstance(request2))
        request2.headers[utilRetry.INVOCATION_ID_HEADER] = uuid3.v4();
      while (!0)
        try {
          if (protocolHttp.HttpRequest.isInstance(request2))
            request2.headers[utilRetry.REQUEST_HEADER] = `attempt=${attempts + 1}; max=${maxAttempts}`;
          if (options?.beforeRequest)
            await options.beforeRequest();
          let { response: response2, output } = await next(args);
          if (options?.afterRequest)
            options.afterRequest(response2);
          return this.retryQuota.releaseRetryTokens(retryTokenAmount), output.$metadata.attempts = attempts + 1, output.$metadata.totalRetryDelay = totalDelay, { response: response2, output };
        } catch (e) {
          let err = asSdkError(e);
          if (attempts++, this.shouldRetry(err, attempts, maxAttempts)) {
            retryTokenAmount = this.retryQuota.retrieveRetryTokens(err);
            let delayFromDecider = this.delayDecider(serviceErrorClassification.isThrottlingError(err) ? utilRetry.THROTTLING_RETRY_DELAY_BASE : utilRetry.DEFAULT_RETRY_DELAY_BASE, attempts), delayFromResponse = getDelayFromRetryAfterHeader(err.$response), delay = Math.max(delayFromResponse || 0, delayFromDecider);
            totalDelay += delay, await new Promise((resolve8) => setTimeout(resolve8, delay));
            continue;
          }
          if (!err.$metadata)
            err.$metadata = {};
          throw err.$metadata.attempts = attempts, err.$metadata.totalRetryDelay = totalDelay, err;
        }
    }
  }
  var getDelayFromRetryAfterHeader = (response2) => {
    if (!protocolHttp.HttpResponse.isInstance(response2))
      return;
    let retryAfterHeaderName = Object.keys(response2.headers).find((key) => key.toLowerCase() === "retry-after");
    if (!retryAfterHeaderName)
      return;
    let retryAfter = response2.headers[retryAfterHeaderName], retryAfterSeconds = Number(retryAfter);
    if (!Number.isNaN(retryAfterSeconds))
      return retryAfterSeconds * 1000;
    return new Date(retryAfter).getTime() - Date.now();
  };

  class AdaptiveRetryStrategy extends StandardRetryStrategy {
    rateLimiter;
    constructor(maxAttemptsProvider, options) {
      let { rateLimiter, ...superOptions } = options ?? {};
      super(maxAttemptsProvider, superOptions);
      this.rateLimiter = rateLimiter ?? new utilRetry.DefaultRateLimiter, this.mode = utilRetry.RETRY_MODES.ADAPTIVE;
    }
    async retry(next, args) {
      return super.retry(next, args, {
        beforeRequest: async () => {
          return this.rateLimiter.getSendToken();
        },
        afterRequest: (response2) => {
          this.rateLimiter.updateClientSendingRate(response2);
        }
      });
    }
  }
  var ENV_MAX_ATTEMPTS = "AWS_MAX_ATTEMPTS", CONFIG_MAX_ATTEMPTS = "max_attempts", NODE_MAX_ATTEMPT_CONFIG_OPTIONS = {
    environmentVariableSelector: (env4) => {
      let value = env4[ENV_MAX_ATTEMPTS];
      if (!value)
        return;
      let maxAttempt = parseInt(value);
      if (Number.isNaN(maxAttempt))
        throw Error(`Environment variable ${ENV_MAX_ATTEMPTS} mast be a number, got "${value}"`);
      return maxAttempt;
    },
    configFileSelector: (profile2) => {
      let value = profile2[CONFIG_MAX_ATTEMPTS];
      if (!value)
        return;
      let maxAttempt = parseInt(value);
      if (Number.isNaN(maxAttempt))
        throw Error(`Shared config file entry ${CONFIG_MAX_ATTEMPTS} mast be a number, got "${value}"`);
      return maxAttempt;
    },
    default: utilRetry.DEFAULT_MAX_ATTEMPTS
  }, resolveRetryConfig = (input) => {
    let { retryStrategy, retryMode } = input, maxAttempts = utilMiddleware.normalizeProvider(input.maxAttempts ?? utilRetry.DEFAULT_MAX_ATTEMPTS), controller = retryStrategy ? Promise.resolve(retryStrategy) : void 0, getDefault = async () => await utilMiddleware.normalizeProvider(retryMode)() === utilRetry.RETRY_MODES.ADAPTIVE ? new utilRetry.AdaptiveRetryStrategy(maxAttempts) : new utilRetry.StandardRetryStrategy(maxAttempts);
    return Object.assign(input, {
      maxAttempts,
      retryStrategy: () => controller ??= getDefault()
    });
  }, ENV_RETRY_MODE = "AWS_RETRY_MODE", CONFIG_RETRY_MODE = "retry_mode", NODE_RETRY_MODE_CONFIG_OPTIONS = {
    environmentVariableSelector: (env4) => env4[ENV_RETRY_MODE],
    configFileSelector: (profile2) => profile2[CONFIG_RETRY_MODE],
    default: utilRetry.DEFAULT_RETRY_MODE
  }, omitRetryHeadersMiddleware = () => (next) => async (args) => {
    let { request: request2 } = args;
    if (protocolHttp.HttpRequest.isInstance(request2))
      delete request2.headers[utilRetry.INVOCATION_ID_HEADER], delete request2.headers[utilRetry.REQUEST_HEADER];
    return next(args);
  }, omitRetryHeadersMiddlewareOptions = {
    name: "omitRetryHeadersMiddleware",
    tags: ["RETRY", "HEADERS", "OMIT_RETRY_HEADERS"],
    relation: "before",
    toMiddleware: "awsAuthMiddleware",
    override: !0
  }, getOmitRetryHeadersPlugin = (options) => ({
    applyToStack: (clientStack) => {
      clientStack.addRelativeTo(omitRetryHeadersMiddleware(), omitRetryHeadersMiddlewareOptions);
    }
  });
  function parseRetryAfterHeader(response2, logger2) {
    if (!protocolHttp.HttpResponse.isInstance(response2))
      return;
    for (let header of Object.keys(response2.headers)) {
      let h2 = header.toLowerCase();
      if (h2 === "retry-after") {
        let retryAfter = response2.headers[header], retryAfterSeconds = NaN;
        if (retryAfter.endsWith("GMT"))
          try {
            retryAfterSeconds = (serde3.parseRfc7231DateTime(retryAfter).getTime() - Date.now()) / 1000;
          } catch (e) {
            logger2?.trace?.("Failed to parse retry-after header"), logger2?.trace?.(e);
          }
        else if (retryAfter.match(/ GMT, ((\d+)|(\d+\.\d+))$/))
          retryAfterSeconds = Number(retryAfter.match(/ GMT, ([\d.]+)$/)?.[1]);
        else if (retryAfter.match(/^((\d+)|(\d+\.\d+))$/))
          retryAfterSeconds = Number(retryAfter);
        else if (Date.parse(retryAfter) >= Date.now())
          retryAfterSeconds = (Date.parse(retryAfter) - Date.now()) / 1000;
        if (isNaN(retryAfterSeconds))
          return;
        return new Date(Date.now() + retryAfterSeconds * 1000);
      } else if (h2 === "x-amz-retry-after") {
        let v = response2.headers[header], backoffMilliseconds = Number(v);
        if (isNaN(backoffMilliseconds)) {
          logger2?.trace?.(`Failed to parse x-amz-retry-after=${v}`);
          return;
        }
        return new Date(Date.now() + backoffMilliseconds);
      }
    }
  }
  function getRetryAfterHint(response2, logger2) {
    return parseRetryAfterHeader(response2, logger2);
  }
  var retryMiddleware = (options) => (next, context) => async (args) => {
    let retryStrategy = await options.retryStrategy(), maxAttempts = await options.maxAttempts();
    if (isRetryStrategyV2(retryStrategy)) {
      retryStrategy = retryStrategy;
      let retryToken = await retryStrategy.acquireInitialRetryToken((context.partition_id ?? "") + (context.__retryLongPoll ? ":longpoll" : "")), lastError = Error(), attempts = 0, totalRetryDelay = 0, { request: request2 } = args, isRequest2 = protocolHttp.HttpRequest.isInstance(request2);
      if (isRequest2)
        request2.headers[utilRetry.INVOCATION_ID_HEADER] = uuid3.v4();
      while (!0)
        try {
          if (isRequest2)
            request2.headers[utilRetry.REQUEST_HEADER] = `attempt=${attempts + 1}; max=${maxAttempts}`;
          let { response: response2, output } = await next(args);
          return retryStrategy.recordSuccess(retryToken), output.$metadata.attempts = attempts + 1, output.$metadata.totalRetryDelay = totalRetryDelay, { response: response2, output };
        } catch (e) {
          let retryErrorInfo = getRetryErrorInfo(e, options.logger);
          if (lastError = asSdkError(e), isRequest2 && isStreamingPayload.isStreamingPayload(request2))
            throw (context.logger instanceof smithyClient.NoOpLogger ? console : context.logger)?.warn("An error was encountered in a non-retryable streaming request."), lastError;
          try {
            retryToken = await retryStrategy.refreshRetryTokenForRetry(retryToken, retryErrorInfo);
          } catch (refreshError) {
            if (typeof refreshError.$backoff === "number")
              await cooldown(refreshError.$backoff);
            if (!lastError.$metadata)
              lastError.$metadata = {};
            throw lastError.$metadata.attempts = attempts + 1, lastError.$metadata.totalRetryDelay = totalRetryDelay, lastError;
          }
          attempts = retryToken.getRetryCount();
          let delay = retryToken.getRetryDelay();
          totalRetryDelay += delay, await cooldown(delay);
        }
    } else {
      if (retryStrategy = retryStrategy, retryStrategy?.mode)
        context.userAgent = [...context.userAgent || [], ["cfg/retry-mode", retryStrategy.mode]];
      return retryStrategy.retry(next, args);
    }
  }, cooldown = (ms) => new Promise((resolve8) => setTimeout(resolve8, ms)), isRetryStrategyV2 = (retryStrategy) => typeof retryStrategy.acquireInitialRetryToken < "u" && typeof retryStrategy.refreshRetryTokenForRetry < "u" && typeof retryStrategy.recordSuccess < "u", getRetryErrorInfo = (error41, logger2) => {
    let errorInfo = {
      error: error41,
      errorType: getRetryErrorType(error41)
    }, retryAfterHint = parseRetryAfterHeader(error41.$response, logger2);
    if (retryAfterHint)
      errorInfo.retryAfterHint = retryAfterHint;
    return errorInfo;
  }, getRetryErrorType = (error41) => {
    if (serviceErrorClassification.isThrottlingError(error41))
      return "THROTTLING";
    if (serviceErrorClassification.isTransientError(error41))
      return "TRANSIENT";
    if (serviceErrorClassification.isServerError(error41))
      return "SERVER_ERROR";
    return "CLIENT_ERROR";
  }, retryMiddlewareOptions = {
    name: "retryMiddleware",
    tags: ["RETRY"],
    step: "finalizeRequest",
    priority: "high",
    override: !0
  }, getRetryPlugin = (options) => ({
    applyToStack: (clientStack) => {
      clientStack.add(retryMiddleware(options), retryMiddlewareOptions);
    }
  });
  exports.AdaptiveRetryStrategy = AdaptiveRetryStrategy;
  exports.CONFIG_MAX_ATTEMPTS = CONFIG_MAX_ATTEMPTS;
  exports.CONFIG_RETRY_MODE = CONFIG_RETRY_MODE;
  exports.ENV_MAX_ATTEMPTS = ENV_MAX_ATTEMPTS;
  exports.ENV_RETRY_MODE = ENV_RETRY_MODE;
  exports.NODE_MAX_ATTEMPT_CONFIG_OPTIONS = NODE_MAX_ATTEMPT_CONFIG_OPTIONS;
  exports.NODE_RETRY_MODE_CONFIG_OPTIONS = NODE_RETRY_MODE_CONFIG_OPTIONS;
  exports.StandardRetryStrategy = StandardRetryStrategy;
  exports.defaultDelayDecider = defaultDelayDecider;
  exports.defaultRetryDecider = defaultRetryDecider;
  exports.getOmitRetryHeadersPlugin = getOmitRetryHeadersPlugin;
  exports.getRetryAfterHint = getRetryAfterHint;
  exports.getRetryPlugin = getRetryPlugin;
  exports.omitRetryHeadersMiddleware = omitRetryHeadersMiddleware;
  exports.omitRetryHeadersMiddlewareOptions = omitRetryHeadersMiddlewareOptions;
  exports.resolveRetryConfig = resolveRetryConfig;
  exports.retryMiddleware = retryMiddleware;
  exports.retryMiddlewareOptions = retryMiddlewareOptions;
});
