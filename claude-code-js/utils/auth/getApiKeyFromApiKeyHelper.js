// function: getApiKeyFromApiKeyHelper
async function getApiKeyFromApiKeyHelper(isNonInteractiveSession) {
  if (!getConfiguredApiKeyHelper())
    return null;
  let ttl = calculateApiKeyHelperTTL();
  if (_apiKeyHelperCache) {
    if (Date.now() - _apiKeyHelperCache.timestamp < ttl)
      return _apiKeyHelperCache.value;
    if (!_apiKeyHelperInflight)
      _apiKeyHelperInflight = {
        promise: _runAndCache(isNonInteractiveSession, !1, _apiKeyHelperEpoch),
        startedAt: null
      };
    return _apiKeyHelperCache.value;
  }
  if (_apiKeyHelperInflight)
    return _apiKeyHelperInflight.promise;
  return _apiKeyHelperInflight = {
    promise: _runAndCache(isNonInteractiveSession, !0, _apiKeyHelperEpoch),
    startedAt: Date.now()
  }, _apiKeyHelperInflight.promise;
}
