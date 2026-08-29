// function: _setGlobalConfigCacheForTesting
function _setGlobalConfigCacheForTesting(config5) {
  globalConfigCache.config = config5, globalConfigCache.mtime = config5 ? Date.now() : 0;
}
