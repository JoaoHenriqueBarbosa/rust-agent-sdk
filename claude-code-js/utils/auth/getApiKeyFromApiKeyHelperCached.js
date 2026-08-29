// function: getApiKeyFromApiKeyHelperCached
function getApiKeyFromApiKeyHelperCached() {
  return _apiKeyHelperCache?.value ?? null;
}
