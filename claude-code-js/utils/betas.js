// Original: src/utils/betas.ts
function partitionBetasByAllowlist(betas) {
  let allowed = [], disallowed = [];
  for (let beta of betas)
    if (ALLOWED_SDK_BETAS.includes(beta))
      allowed.push(beta);
    else
      disallowed.push(beta);
  return { allowed, disallowed };
}
function filterAllowedSdkBetas(sdkBetas) {
  if (!sdkBetas || sdkBetas.length === 0)
    return;
  if (isClaudeAISubscriber()) {
    console.warn("Warning: Custom betas are only available for API key users. Ignoring provided betas.");
    return;
  }
  let { allowed, disallowed } = partitionBetasByAllowlist(sdkBetas);
  for (let beta of disallowed)
    console.warn(`Warning: Beta header '${beta}' is not allowed. Only the following betas are supported: ${ALLOWED_SDK_BETAS.join(", ")}`);
  return allowed.length > 0 ? allowed : void 0;
}
function modelSupportsISP(model) {
  let supported3P = get3PModelCapabilityOverride(model, "interleaved_thinking");
  if (supported3P !== void 0)
    return supported3P;
  let canonical = getCanonicalName(model), provider5 = getAPIProvider();
  if (provider5 === "foundry")
    return !0;
  if (provider5 === "firstParty")
    return !canonical.includes("claude-3-");
  return canonical.includes("claude-opus-4") || canonical.includes("claude-sonnet-4");
}
function vertexModelSupportsWebSearch(model) {
  let canonical = getCanonicalName(model);
  return canonical.includes("claude-opus-4") || canonical.includes("claude-sonnet-4") || canonical.includes("claude-haiku-4");
}
function modelSupportsContextManagement(model) {
  let canonical = getCanonicalName(model), provider5 = getAPIProvider();
  if (provider5 === "foundry")
    return !0;
  if (provider5 === "firstParty")
    return !canonical.includes("claude-3-");
  return canonical.includes("claude-opus-4") || canonical.includes("claude-sonnet-4") || canonical.includes("claude-haiku-4");
}
function modelSupportsStructuredOutputs(model) {
  let canonical = getCanonicalName(model), provider5 = getAPIProvider();
  if (provider5 !== "firstParty" && provider5 !== "foundry")
    return !1;
  return canonical.includes("claude-sonnet-4-6") || canonical.includes("claude-sonnet-4-5") || canonical.includes("claude-opus-4-1") || canonical.includes("claude-opus-4-5") || canonical.includes("claude-opus-4-6") || canonical.includes("claude-haiku-4-5");
}
function modelSupportsAutoMode(_model) {
  return !1;
}
function getToolSearchBetaHeader() {
  let provider5 = getAPIProvider();
  if (provider5 === "vertex" || provider5 === "bedrock")
    return TOOL_SEARCH_BETA_HEADER_3P;
  return TOOL_SEARCH_BETA_HEADER_1P;
}
function shouldIncludeFirstPartyOnlyBetas() {
  return (getAPIProvider() === "firstParty" || getAPIProvider() === "foundry") && !isEnvTruthy(process.env.CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS);
}
function shouldUseGlobalCacheScope() {
  return getAPIProvider() === "firstParty" && !isEnvTruthy(process.env.CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS);
}
function getMergedBetas(model, options) {
  let baseBetas = [...getModelBetas(model)];
  if (options?.isAgenticQuery) {
    if (!baseBetas.includes(CLAUDE_CODE_20250219_BETA_HEADER))
      baseBetas.push(CLAUDE_CODE_20250219_BETA_HEADER);
  }
  let sdkBetas = getSdkBetas();
  if (!sdkBetas || sdkBetas.length === 0)
    return baseBetas;
  return [...baseBetas, ...sdkBetas.filter((b) => !baseBetas.includes(b))];
}
function clearBetasCaches() {
  getAllModelBetas.cache?.clear?.(), getModelBetas.cache?.clear?.(), getBedrockExtraBodyParamsBetas.cache?.clear?.();
}
var ALLOWED_SDK_BETAS, getAllModelBetas, getModelBetas, getBedrockExtraBodyParamsBetas;
var init_betas2 = __esm(() => {
  init_memoize();
  init_state();
  init_betas();
  init_oauth();
  init_auth14();
  init_context();
  init_envUtils();
  init_model();
  init_modelSupportOverrides();
  init_providers();
  init_settings2();
  ALLOWED_SDK_BETAS = [CONTEXT_1M_BETA_HEADER];
  getAllModelBetas = memoize_default((model) => {
    let betaHeaders = [], isHaiku = getCanonicalName(model).includes("haiku"), provider5 = getAPIProvider(), includeFirstPartyOnlyBetas = shouldIncludeFirstPartyOnlyBetas();
    if (!isHaiku)
      betaHeaders.push(CLAUDE_CODE_20250219_BETA_HEADER);
    if (isClaudeAISubscriber())
      betaHeaders.push(OAUTH_BETA_HEADER);
    if (has1mContext(model))
      betaHeaders.push(CONTEXT_1M_BETA_HEADER);
    if (!isEnvTruthy(process.env.DISABLE_INTERLEAVED_THINKING) && modelSupportsISP(model))
      betaHeaders.push(INTERLEAVED_THINKING_BETA_HEADER);
    if (includeFirstPartyOnlyBetas && modelSupportsISP(model) && !getIsNonInteractiveSession() && getInitialSettings().showThinkingSummaries !== !0)
      betaHeaders.push(REDACT_THINKING_BETA_HEADER);
    SUMMARIZE_CONNECTOR_TEXT_BETA_HEADER;
    let antOptedIntoToolClearing = isEnvTruthy(process.env.USE_API_CONTEXT_MANAGEMENT) && !1, thinkingPreservationEnabled = modelSupportsContextManagement(model);
    if (shouldIncludeFirstPartyOnlyBetas() && (antOptedIntoToolClearing || thinkingPreservationEnabled))
      betaHeaders.push(CONTEXT_MANAGEMENT_BETA_HEADER);
    if (provider5 === "vertex" && vertexModelSupportsWebSearch(model))
      betaHeaders.push(WEB_SEARCH_BETA_HEADER);
    if (provider5 === "foundry")
      betaHeaders.push(WEB_SEARCH_BETA_HEADER);
    if (includeFirstPartyOnlyBetas)
      betaHeaders.push(PROMPT_CACHING_SCOPE_BETA_HEADER);
    if (process.env.ANTHROPIC_BETAS)
      betaHeaders.push(...process.env.ANTHROPIC_BETAS.split(",").map((_) => _.trim()).filter(Boolean));
    return betaHeaders;
  }), getModelBetas = memoize_default((model) => {
    let modelBetas = getAllModelBetas(model);
    if (getAPIProvider() === "bedrock")
      return modelBetas.filter((b) => !BEDROCK_EXTRA_PARAMS_HEADERS.has(b));
    return modelBetas;
  }), getBedrockExtraBodyParamsBetas = memoize_default((model) => {
    return getAllModelBetas(model).filter((b) => BEDROCK_EXTRA_PARAMS_HEADERS.has(b));
  });
});
