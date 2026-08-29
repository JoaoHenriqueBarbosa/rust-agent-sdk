// function: setProxy
function setProxy(options, configProxy, location) {
  let proxy = configProxy;
  if (!proxy && proxy !== !1) {
    let proxyUrl = getProxyForUrl(location);
    if (proxyUrl)
      proxy = new URL(proxyUrl);
  }
  if (proxy) {
    if (proxy.username)
      proxy.auth = (proxy.username || "") + ":" + (proxy.password || "");
    if (proxy.auth) {
      if (Boolean(proxy.auth.username || proxy.auth.password))
        proxy.auth = (proxy.auth.username || "") + ":" + (proxy.auth.password || "");
      else if (typeof proxy.auth === "object")
        throw new AxiosError_default("Invalid proxy authorization", AxiosError_default.ERR_BAD_OPTION, { proxy });
      let base643 = Buffer.from(proxy.auth, "utf8").toString("base64");
      options.headers["Proxy-Authorization"] = "Basic " + base643;
    }
    options.headers.host = options.hostname + (options.port ? ":" + options.port : "");
    let proxyHost = proxy.hostname || proxy.host;
    if (options.hostname = proxyHost, options.host = proxyHost, options.port = proxy.port, options.path = location, proxy.protocol)
      options.protocol = proxy.protocol.includes(":") ? proxy.protocol : `${proxy.protocol}:`;
  }
  options.beforeRedirects.proxy = function(redirectOptions) {
    setProxy(redirectOptions, configProxy, redirectOptions.href);
  };
}
