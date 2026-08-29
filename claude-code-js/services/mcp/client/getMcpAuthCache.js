// function: getMcpAuthCache
function getMcpAuthCache() {
  if (!authCachePromise)
    authCachePromise = readFile15(getMcpAuthCachePath(), "utf-8").then((data) => jsonParse(data)).catch(() => ({}));
  return authCachePromise;
}
