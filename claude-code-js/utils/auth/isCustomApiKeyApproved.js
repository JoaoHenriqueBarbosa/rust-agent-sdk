// function: isCustomApiKeyApproved
function isCustomApiKeyApproved(apiKey) {
  let config8 = getGlobalConfig(), normalizedKey = normalizeApiKeyForConfig(apiKey);
  return config8.customApiKeyResponses?.approved?.includes(normalizedKey) ?? !1;
}
