// function: getCustomApiKeyStatus
function getCustomApiKeyStatus(truncatedApiKey) {
  let config5 = getGlobalConfig();
  if (config5.customApiKeyResponses?.approved?.includes(truncatedApiKey))
    return "approved";
  if (config5.customApiKeyResponses?.rejected?.includes(truncatedApiKey))
    return "rejected";
  return "new";
}
