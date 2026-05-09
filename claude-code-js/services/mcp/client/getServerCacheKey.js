// function: getServerCacheKey
function getServerCacheKey(name3, serverRef) {
  return `${name3}-${jsonStringify(serverRef)}`;
}
