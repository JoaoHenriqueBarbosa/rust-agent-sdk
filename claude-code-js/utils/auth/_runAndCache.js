// function: _runAndCache
async function _runAndCache(isNonInteractiveSession, isCold, epoch) {
  try {
    let value = await _executeApiKeyHelper(isNonInteractiveSession);
    if (epoch !== _apiKeyHelperEpoch)
      return value;
    if (value !== null)
      _apiKeyHelperCache = { value, timestamp: Date.now() };
    return value;
  } catch (e) {
    if (epoch !== _apiKeyHelperEpoch)
      return " ";
    let detail = e instanceof Error ? e.message : String(e);
    if (console.error(source_default.red(`apiKeyHelper failed: ${detail}`)), logForDebugging(`Error getting API key from apiKeyHelper: ${detail}`, {
      level: "error"
    }), !isCold && _apiKeyHelperCache && _apiKeyHelperCache.value !== " ")
      return _apiKeyHelperCache = { ..._apiKeyHelperCache, timestamp: Date.now() }, _apiKeyHelperCache.value;
    return _apiKeyHelperCache = { value: " ", timestamp: Date.now() }, " ";
  } finally {
    if (epoch === _apiKeyHelperEpoch)
      _apiKeyHelperInflight = null;
  }
}
