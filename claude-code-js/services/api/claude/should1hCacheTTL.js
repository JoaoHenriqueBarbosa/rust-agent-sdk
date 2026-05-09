// function: should1hCacheTTL
function should1hCacheTTL(querySource) {
  if (getAPIProvider() === "bedrock" && isEnvTruthy(process.env.ENABLE_PROMPT_CACHING_1H_BEDROCK))
    return !0;
  let userEligible = getPromptCache1hEligible();
  if (userEligible === null)
    userEligible = isClaudeAISubscriber() && !currentLimits.isUsingOverage, setPromptCache1hEligible(userEligible);
  if (!userEligible)
    return !1;
  let allowlist = getPromptCache1hAllowlist();
  if (allowlist === null)
    allowlist = {}.allowlist ?? [], setPromptCache1hAllowlist(allowlist);
  return querySource !== void 0 && allowlist.some((pattern) => pattern.endsWith("*") ? querySource.startsWith(pattern.slice(0, -1)) : querySource === pattern);
}
