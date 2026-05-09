// function: getProxyUrl
function getProxyUrl(env4 = process.env) {
  return env4.https_proxy || env4.HTTPS_PROXY || env4.http_proxy || env4.HTTP_PROXY;
}
