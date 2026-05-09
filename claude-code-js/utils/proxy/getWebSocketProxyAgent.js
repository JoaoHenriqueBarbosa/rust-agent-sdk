// function: getWebSocketProxyAgent
function getWebSocketProxyAgent(url3) {
  let proxyUrl = getProxyUrl();
  if (!proxyUrl)
    return;
  if (shouldBypassProxy(url3))
    return;
  return createHttpsProxyAgent(proxyUrl);
}
