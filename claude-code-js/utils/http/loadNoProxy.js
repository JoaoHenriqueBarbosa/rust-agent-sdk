// function: loadNoProxy
function loadNoProxy() {
  let noProxy = getEnvironmentValue(NO_PROXY);
  if (noProxyListLoaded = !0, noProxy)
    return noProxy.split(",").map((item) => item.trim()).filter((item) => item.length);
  return [];
}
