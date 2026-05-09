// function: clearMTLSCache
function clearMTLSCache() {
  getMTLSConfig.cache.clear?.(), getMTLSAgent.cache.clear?.(), logForDebugging("Cleared mTLS configuration cache");
}
