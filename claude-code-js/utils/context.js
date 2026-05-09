// Original: src/utils/context.ts
function is1mContextDisabled() {
  return isEnvTruthy(process.env.CLAUDE_CODE_DISABLE_1M_CONTEXT);
}
function has1mContext(model) {
  if (is1mContextDisabled())
    return !1;
  return /\[1m\]/i.test(model);
}
function modelSupports1M(model) {
  if (is1mContextDisabled())
    return !1;
  let canonical = getCanonicalName(model);
  return canonical.includes("claude-sonnet-4") || canonical.includes("opus-4-6");
}
function getContextWindowForModel(model, betas) {
  if (has1mContext(model))
    return 1e6;
  let cap = getModelCapability(model);
  if (cap?.max_input_tokens && cap.max_input_tokens >= 1e5) {
    if (cap.max_input_tokens > MODEL_CONTEXT_WINDOW_DEFAULT && is1mContextDisabled())
      return MODEL_CONTEXT_WINDOW_DEFAULT;
    return cap.max_input_tokens;
  }
  if (betas?.includes(CONTEXT_1M_BETA_HEADER) && modelSupports1M(model))
    return 1e6;
  if (getSonnet1mExpTreatmentEnabled(model))
    return 1e6;
  return MODEL_CONTEXT_WINDOW_DEFAULT;
}
function getSonnet1mExpTreatmentEnabled(model) {
  if (is1mContextDisabled())
    return !1;
  if (has1mContext(model))
    return !1;
  if (!getCanonicalName(model).includes("sonnet-4-6"))
    return !1;
  return getGlobalConfig().clientDataCache?.coral_reef_sonnet === "true";
}
function calculateContextPercentages(currentUsage, contextWindowSize) {
  if (!currentUsage)
    return { used: null, remaining: null };
  let totalInputTokens = currentUsage.input_tokens + currentUsage.cache_creation_input_tokens + currentUsage.cache_read_input_tokens, usedPercentage = Math.round(totalInputTokens / contextWindowSize * 100), clampedUsed = Math.min(100, Math.max(0, usedPercentage));
  return {
    used: clampedUsed,
    remaining: 100 - clampedUsed
  };
}
function getModelMaxOutputTokens(model) {
  let defaultTokens, upperLimit, m4 = getCanonicalName(model);
  if (m4.includes("opus-4-6"))
    defaultTokens = 64000, upperLimit = 128000;
  else if (m4.includes("sonnet-4-6"))
    defaultTokens = 32000, upperLimit = 128000;
  else if (m4.includes("opus-4-5") || m4.includes("sonnet-4") || m4.includes("haiku-4"))
    defaultTokens = 32000, upperLimit = 64000;
  else if (m4.includes("opus-4-1") || m4.includes("opus-4"))
    defaultTokens = 32000, upperLimit = 32000;
  else if (m4.includes("claude-3-opus"))
    defaultTokens = 4096, upperLimit = 4096;
  else if (m4.includes("claude-3-sonnet"))
    defaultTokens = 8192, upperLimit = 8192;
  else if (m4.includes("claude-3-haiku"))
    defaultTokens = 4096, upperLimit = 4096;
  else if (m4.includes("3-5-sonnet") || m4.includes("3-5-haiku"))
    defaultTokens = 8192, upperLimit = 8192;
  else if (m4.includes("3-7-sonnet"))
    defaultTokens = 32000, upperLimit = 64000;
  else
    defaultTokens = MAX_OUTPUT_TOKENS_DEFAULT, upperLimit = MAX_OUTPUT_TOKENS_UPPER_LIMIT;
  let cap = getModelCapability(model);
  if (cap?.max_tokens && cap.max_tokens >= 4096)
    upperLimit = cap.max_tokens, defaultTokens = Math.min(defaultTokens, upperLimit);
  return { default: defaultTokens, upperLimit };
}
function getMaxThinkingTokensForModel(model) {
  return getModelMaxOutputTokens(model).upperLimit - 1;
}
var MODEL_CONTEXT_WINDOW_DEFAULT = 200000, COMPACT_MAX_OUTPUT_TOKENS = 20000, MAX_OUTPUT_TOKENS_DEFAULT = 32000, MAX_OUTPUT_TOKENS_UPPER_LIMIT = 64000, CAPPED_DEFAULT_MAX_TOKENS = 8000;
var init_context = __esm(() => {
  init_betas();
  init_config4();
  init_envUtils();
  init_model();
  init_modelCapabilities();
});
