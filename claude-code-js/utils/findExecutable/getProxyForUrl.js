// function: getProxyForUrl
function getProxyForUrl(url3) {
  var parsedUrl = (typeof url3 === "string" ? parseUrl(url3) : url3) || {}, proto2 = parsedUrl.protocol, hostname2 = parsedUrl.host, port = parsedUrl.port;
  if (typeof hostname2 !== "string" || !hostname2 || typeof proto2 !== "string")
    return "";
  if (proto2 = proto2.split(":", 1)[0], hostname2 = hostname2.replace(/:\d*$/, ""), port = parseInt(port) || DEFAULT_PORTS[proto2] || 0, !shouldProxy(hostname2, port))
    return "";
  var proxy = getEnv2(proto2 + "_proxy") || getEnv2("all_proxy");
  if (proxy && proxy.indexOf("://") === -1)
    proxy = proto2 + "://" + proxy;
  return proxy;
}
