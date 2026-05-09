// function: loadEnvironmentProxyValue
function loadEnvironmentProxyValue() {
  if (!process)
    return;
  let httpsProxy = getEnvironmentValue(HTTPS_PROXY), allProxy = getEnvironmentValue(ALL_PROXY), httpProxy = getEnvironmentValue(HTTP_PROXY);
  return httpsProxy || allProxy || httpProxy;
}
