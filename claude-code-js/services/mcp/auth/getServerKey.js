// function: getServerKey
function getServerKey(serverName, serverConfig) {
  let configJson = jsonStringify({
    type: serverConfig.type,
    url: serverConfig.url,
    headers: serverConfig.headers || {}
  }), hash = createHash9("sha256").update(configJson).digest("hex").substring(0, 16);
  return `${serverName}|${hash}`;
}
