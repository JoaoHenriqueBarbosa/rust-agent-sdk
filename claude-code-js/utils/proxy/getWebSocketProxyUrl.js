// function: getWebSocketProxyUrl
function getWebSocketProxyUrl(url3) {
  let proxyUrl = getProxyUrl();
  if (!proxyUrl)
    return;
  if (shouldBypassProxy(url3))
    return;
  return proxyUrl;
}
