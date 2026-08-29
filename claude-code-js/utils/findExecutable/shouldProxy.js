// function: shouldProxy
function shouldProxy(hostname2, port) {
  var NO_PROXY = getEnv2("no_proxy").toLowerCase();
  if (!NO_PROXY)
    return !0;
  if (NO_PROXY === "*")
    return !1;
  return NO_PROXY.split(/[,\s]/).every(function(proxy) {
    if (!proxy)
      return !0;
    var parsedProxy = proxy.match(/^(.+):(\d+)$/), parsedProxyHostname = parsedProxy ? parsedProxy[1] : proxy, parsedProxyPort = parsedProxy ? parseInt(parsedProxy[2]) : 0;
    if (parsedProxyPort && parsedProxyPort !== port)
      return !0;
    if (!/^[.*]/.test(parsedProxyHostname))
      return hostname2 !== parsedProxyHostname;
    if (parsedProxyHostname.charAt(0) === "*")
      parsedProxyHostname = parsedProxyHostname.slice(1);
    return !hostname2.endsWith(parsedProxyHostname);
  });
}
