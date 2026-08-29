// Original: src/services/api/withRetry.ts
function shouldRetry529(querySource) {
  return querySource === void 0 || FOREGROUND_529_RETRY_SOURCES.has(querySource);
}
function isPersistentRetryEnabled() {
  return !1;
}
function isTransientCapacityError(error44) {
  return is529Error(error44) || error44 instanceof APIError && error44.status === 429;
}
function isStaleConnectionError(error44) {
  if (!(error44 instanceof APIConnectionError))
    return !1;
  let details = extractConnectionErrorDetails(error44);
  return details?.code === "ECONNRESET" || details?.code === "EPIPE";
}
async function* withRetry(getClient, operation, options2) {
  let maxRetries = getMaxRetries(options2), retryContext = {
    model: options2.model,
    thinkingConfig: options2.thinkingConfig,
    ...isFastModeEnabled() && { fastMode: options2.fastMode }
  }, client15 = null, consecutive529Errors = options2.initialConsecutive529Errors ?? 0, lastError, persistentAttempt = 0;
  for (let attempt = 1;attempt <= maxRetries + 1; attempt++) {
    if (options2.signal?.aborted)
      throw new APIUserAbortError;
    let wasFastModeActive = isFastModeEnabled() ? retryContext.fastMode && !isFastModeCooldown() : !1;
    try {
      let isStaleConnection = isStaleConnectionError(lastError);
      if (client15 === null || lastError instanceof APIError && lastError.status === 401 || isOAuthTokenRevokedError(lastError) || isBedrockAuthError(lastError) || isVertexAuthError(lastError) || isStaleConnection) {
        if (lastError instanceof APIError && lastError.status === 401 || isOAuthTokenRevokedError(lastError)) {
          let failedAccessToken = getClaudeAIOAuthTokens()?.accessToken;
          if (failedAccessToken)
            await handleOAuth401Error(failedAccessToken);
        }
        client15 = await getClient();
      }
      return await operation(client15, attempt, retryContext);
    } catch (error44) {
      if (lastError = error44, logForDebugging(`API error (attempt ${attempt}/${maxRetries + 1}): ${error44 instanceof APIError ? `${error44.status} ${error44.message}` : errorMessage(error44)}`, { level: "error" }), wasFastModeActive && !isPersistentRetryEnabled() && error44 instanceof APIError && (error44.status === 429 || is529Error(error44))) {
        let overageReason = error44.headers?.get("anthropic-ratelimit-unified-overage-disabled-reason");
        if (overageReason !== null && overageReason !== void 0) {
          handleFastModeOverageRejection(overageReason), retryContext.fastMode = !1;
          continue;
        }
        let retryAfterMs = getRetryAfterMs(error44);
        if (retryAfterMs !== null && retryAfterMs < SHORT_RETRY_THRESHOLD_MS) {
          await sleep3(retryAfterMs, options2.signal, { abortError });
          continue;
        }
        let cooldownMs = Math.max(retryAfterMs ?? DEFAULT_FAST_MODE_FALLBACK_HOLD_MS, MIN_COOLDOWN_MS), cooldownReason = is529Error(error44) ? "overloaded" : "rate_limit";
        if (triggerFastModeCooldown(Date.now() + cooldownMs, cooldownReason), isFastModeEnabled())
          retryContext.fastMode = !1;
        continue;
      }
      if (wasFastModeActive && isFastModeNotEnabledError(error44)) {
        handleFastModeRejectedByAPI(), retryContext.fastMode = !1;
        continue;
      }
      if (is529Error(error44) && !shouldRetry529(options2.querySource))
        throw logEvent("tengu_api_529_background_dropped", {
          query_source: options2.querySource
        }), new CannotRetryError(error44, retryContext);
      if (is529Error(error44) && (process.env.FALLBACK_FOR_ALL_PRIMARY_MODELS || !isClaudeAISubscriber() && isNonCustomOpusModel(options2.model))) {
        if (consecutive529Errors++, consecutive529Errors >= MAX_529_RETRIES) {
          if (options2.fallbackModel)
            throw logEvent("tengu_api_opus_fallback_triggered", {
              original_model: options2.model,
              fallback_model: options2.fallbackModel,
              provider: getAPIProviderForStatsig()
            }), new FallbackTriggeredError(options2.model, options2.fallbackModel);
          if (!process.env.IS_SANDBOX && !isPersistentRetryEnabled())
            throw logEvent("tengu_api_custom_529_overloaded_error", {}), new CannotRetryError(Error(REPEATED_529_ERROR_MESSAGE), retryContext);
        }
      }
      let persistent = isPersistentRetryEnabled() && isTransientCapacityError(error44);
      if (attempt > maxRetries && !persistent)
        throw new CannotRetryError(error44, retryContext);
      if (!(handleAwsCredentialError(error44) || handleGcpCredentialError(error44)) && (!(error44 instanceof APIError) || !shouldRetry(error44)))
        throw new CannotRetryError(error44, retryContext);
      if (error44 instanceof APIError) {
        let overflowData = parseMaxTokensContextOverflowError(error44);
        if (overflowData) {
          let { inputTokens, contextLimit } = overflowData, safetyBuffer = 1000, availableContext = Math.max(0, contextLimit - inputTokens - 1000);
          if (availableContext < FLOOR_OUTPUT_TOKENS)
            throw logError2(Error(`availableContext ${availableContext} is less than FLOOR_OUTPUT_TOKENS ${FLOOR_OUTPUT_TOKENS}`)), error44;
          let minRequired = (retryContext.thinkingConfig.type === "enabled" ? retryContext.thinkingConfig.budgetTokens : 0) + 1, adjustedMaxTokens = Math.max(FLOOR_OUTPUT_TOKENS, availableContext, minRequired);
          retryContext.maxTokensOverride = adjustedMaxTokens, logEvent("tengu_max_tokens_context_overflow_adjustment", {
            inputTokens,
            contextLimit,
            adjustedMaxTokens,
            attempt
          });
          continue;
        }
      }
      let retryAfter = getRetryAfter(error44), delayMs;
      if (persistent && error44 instanceof APIError && error44.status === 429)
        persistentAttempt++, delayMs = getRateLimitResetDelayMs(error44) ?? Math.min(getRetryDelay(persistentAttempt, retryAfter, PERSISTENT_MAX_BACKOFF_MS), PERSISTENT_RESET_CAP_MS);
      else if (persistent)
        persistentAttempt++, delayMs = Math.min(getRetryDelay(persistentAttempt, retryAfter, PERSISTENT_MAX_BACKOFF_MS), PERSISTENT_RESET_CAP_MS);
      else
        delayMs = getRetryDelay(attempt, retryAfter);
      let reportedAttempt = persistent ? persistentAttempt : attempt;
      if (logEvent("tengu_api_retry", {
        attempt: reportedAttempt,
        delayMs,
        error: error44.message,
        status: error44.status,
        provider: getAPIProviderForStatsig()
      }), persistent) {
        if (delayMs > 60000)
          logEvent("tengu_api_persistent_retry_wait", {
            status: error44.status,
            delayMs,
            attempt: reportedAttempt,
            provider: getAPIProviderForStatsig()
          });
        let remaining = delayMs;
        while (remaining > 0) {
          if (options2.signal?.aborted)
            throw new APIUserAbortError;
          if (error44 instanceof APIError)
            yield createSystemAPIErrorMessage(error44, remaining, reportedAttempt, maxRetries);
          let chunk = Math.min(remaining, HEARTBEAT_INTERVAL_MS);
          await sleep3(chunk, options2.signal, { abortError }), remaining -= chunk;
        }
        if (attempt >= maxRetries)
          attempt = maxRetries;
      } else {
        if (error44 instanceof APIError)
          yield createSystemAPIErrorMessage(error44, delayMs, attempt, maxRetries);
        await sleep3(delayMs, options2.signal, { abortError });
      }
    }
  }
  throw new CannotRetryError(lastError, retryContext);
}
function getRetryAfter(error44) {
  return (error44.headers?.["retry-after"] || error44.headers?.get?.("retry-after")) ?? null;
}
function getRetryDelay(attempt, retryAfterHeader, maxDelayMs = 32000) {
  if (retryAfterHeader) {
    let seconds = parseInt(retryAfterHeader, 10);
    if (!isNaN(seconds))
      return seconds * 1000;
  }
  let baseDelay = Math.min(BASE_DELAY_MS * Math.pow(2, attempt - 1), maxDelayMs), jitter = Math.random() * 0.25 * baseDelay;
  return baseDelay + jitter;
}
function parseMaxTokensContextOverflowError(error44) {
  if (error44.status !== 400 || !error44.message)
    return;
  if (!error44.message.includes("input length and `max_tokens` exceed context limit"))
    return;
  let regex2 = /input length and `max_tokens` exceed context limit: (\d+) \+ (\d+) > (\d+)/, match = error44.message.match(regex2);
  if (!match || match.length !== 4)
    return;
  if (!match[1] || !match[2] || !match[3]) {
    logError2(Error("Unable to parse max_tokens from max_tokens exceed context limit error message"));
    return;
  }
  let inputTokens = parseInt(match[1], 10), maxTokens = parseInt(match[2], 10), contextLimit = parseInt(match[3], 10);
  if (isNaN(inputTokens) || isNaN(maxTokens) || isNaN(contextLimit))
    return;
  return { inputTokens, maxTokens, contextLimit };
}
function isFastModeNotEnabledError(error44) {
  if (!(error44 instanceof APIError))
    return !1;
  return error44.status === 400 && (error44.message?.includes("Fast mode is not enabled") ?? !1);
}
function is529Error(error44) {
  if (!(error44 instanceof APIError))
    return !1;
  return error44.status === 529 || (error44.message?.includes('"type":"overloaded_error"') ?? !1);
}
function isOAuthTokenRevokedError(error44) {
  return error44 instanceof APIError && error44.status === 403 && (error44.message?.includes("OAuth token has been revoked") ?? !1);
}
function isBedrockAuthError(error44) {
  if (isEnvTruthy(process.env.CLAUDE_CODE_USE_BEDROCK)) {
    if (isAwsCredentialsProviderError(error44) || error44 instanceof APIError && error44.status === 403)
      return !0;
  }
  return !1;
}
function handleAwsCredentialError(error44) {
  if (isBedrockAuthError(error44))
    return clearAwsCredentialsCache(), !0;
  return !1;
}
function isGoogleAuthLibraryCredentialError(error44) {
  if (!(error44 instanceof Error))
    return !1;
  let msg = error44.message;
  return msg.includes("Could not load the default credentials") || msg.includes("Could not refresh access token") || msg.includes("invalid_grant");
}
function isVertexAuthError(error44) {
  if (isEnvTruthy(process.env.CLAUDE_CODE_USE_VERTEX)) {
    if (isGoogleAuthLibraryCredentialError(error44))
      return !0;
    if (error44 instanceof APIError && error44.status === 401)
      return !0;
  }
  return !1;
}
function handleGcpCredentialError(error44) {
  if (isVertexAuthError(error44))
    return clearGcpCredentialsCache(), !0;
  return !1;
}
function shouldRetry(error44) {
  if (isMockRateLimitError(error44))
    return !1;
  if (isPersistentRetryEnabled() && isTransientCapacityError(error44))
    return !0;
  if (isEnvTruthy(process.env.CLAUDE_CODE_REMOTE) && (error44.status === 401 || error44.status === 403))
    return !0;
  if (error44.message?.includes('"type":"overloaded_error"'))
    return !0;
  if (parseMaxTokensContextOverflowError(error44))
    return !0;
  let shouldRetryHeader = error44.headers?.get("x-should-retry");
  if (shouldRetryHeader === "true" && (!isClaudeAISubscriber() || isEnterpriseSubscriber()))
    return !0;
  if (shouldRetryHeader === "false") {
    let is5xxError = error44.status !== void 0 && error44.status >= 500;
    return !1;
  }
  if (error44 instanceof APIConnectionError)
    return !0;
  if (!error44.status)
    return !1;
  if (error44.status === 408)
    return !0;
  if (error44.status === 409)
    return !0;
  if (error44.status === 429)
    return !isClaudeAISubscriber() || isEnterpriseSubscriber();
  if (error44.status === 401)
    return clearApiKeyHelperCache(), !0;
  if (isOAuthTokenRevokedError(error44))
    return !0;
  if (error44.status && error44.status >= 500)
    return !0;
  return !1;
}
function getDefaultMaxRetries() {
  if (process.env.CLAUDE_CODE_MAX_RETRIES)
    return parseInt(process.env.CLAUDE_CODE_MAX_RETRIES, 10);
  return DEFAULT_MAX_RETRIES2;
}
function getMaxRetries(options2) {
  return options2.maxRetries ?? getDefaultMaxRetries();
}
function getRetryAfterMs(error44) {
  let retryAfter = getRetryAfter(error44);
  if (retryAfter) {
    let seconds = parseInt(retryAfter, 10);
    if (!isNaN(seconds))
      return seconds * 1000;
  }
  return null;
}
function getRateLimitResetDelayMs(error44) {
  let resetHeader = error44.headers?.get?.("anthropic-ratelimit-unified-reset");
  if (!resetHeader)
    return null;
  let resetUnixSec = Number(resetHeader);
  if (!Number.isFinite(resetUnixSec))
    return null;
  let delayMs = resetUnixSec * 1000 - Date.now();
  if (delayMs <= 0)
    return null;
  return Math.min(delayMs, PERSISTENT_RESET_CAP_MS);
}
var abortError = () => new APIUserAbortError, DEFAULT_MAX_RETRIES2 = 10, FLOOR_OUTPUT_TOKENS = 3000, MAX_529_RETRIES = 3, BASE_DELAY_MS = 500, FOREGROUND_529_RETRY_SOURCES, PERSISTENT_MAX_BACKOFF_MS = 300000, PERSISTENT_RESET_CAP_MS = 21600000, HEARTBEAT_INTERVAL_MS = 30000, CannotRetryError, FallbackTriggeredError, DEFAULT_FAST_MODE_FALLBACK_HOLD_MS = 1800000, SHORT_RETRY_THRESHOLD_MS = 20000, MIN_COOLDOWN_MS = 600000;
var init_withRetry = __esm(() => {
  init_sdk();
  init_aws();
  init_debug();
  init_log3();
  init_messages3();
  init_providers();
  init_auth14();
  init_envUtils();
  init_errors();
  init_fastMode();
  init_model();
  init_proxy();
  init_rateLimitMocking();
  init_errors11();
  init_errorUtils();
  FOREGROUND_529_RETRY_SOURCES = /* @__PURE__ */ new Set([
    "repl_main_thread",
    "repl_main_thread:outputStyle:custom",
    "repl_main_thread:outputStyle:Explanatory",
    "repl_main_thread:outputStyle:Learning",
    "sdk",
    "agent:custom",
    "agent:default",
    "agent:builtin",
    "compact",
    "hook_agent",
    "hook_prompt",
    "verification_agent",
    "side_question",
    "auto_mode",
    ...[]
  ]);
  CannotRetryError = class CannotRetryError extends Error {
    originalError;
    retryContext;
    constructor(originalError, retryContext) {
      let message = errorMessage(originalError);
      super(message);
      this.originalError = originalError;
      this.retryContext = retryContext;
      if (this.name = "RetryError", originalError instanceof Error && originalError.stack)
        this.stack = originalError.stack;
    }
  };
  FallbackTriggeredError = class FallbackTriggeredError extends Error {
    originalModel;
    fallbackModel;
    constructor(originalModel, fallbackModel) {
      super(`Model fallback triggered: ${originalModel} -> ${fallbackModel}`);
      this.originalModel = originalModel;
      this.fallbackModel = fallbackModel;
      this.name = "FallbackTriggeredError";
    }
  };
});
