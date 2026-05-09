// function: clearProxyCache
function clearProxyCache() {
  getProxyAgent.cache.clear?.(), logForDebugging("Cleared proxy agent cache");
}
