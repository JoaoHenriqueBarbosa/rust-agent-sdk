// function: clearMcpAuthCache
function clearMcpAuthCache() {
  authCachePromise = null, unlink3(getMcpAuthCachePath()).catch(() => {});
}
