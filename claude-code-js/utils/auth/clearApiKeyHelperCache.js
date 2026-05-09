// function: clearApiKeyHelperCache
function clearApiKeyHelperCache() {
  _apiKeyHelperEpoch++, _apiKeyHelperCache = null, _apiKeyHelperInflight = null;
}
