// function: configureGlobalAgents
function configureGlobalAgents() {
  let proxyUrl = getProxyUrl(), mtlsAgent = getMTLSAgent();
  if (proxyInterceptorId !== void 0)
    axios_default.interceptors.request.eject(proxyInterceptorId), proxyInterceptorId = void 0;
  if (axios_default.defaults.proxy = void 0, axios_default.defaults.httpAgent = void 0, axios_default.defaults.httpsAgent = void 0, proxyUrl) {
    axios_default.defaults.proxy = !1;
    let proxyAgent = createHttpsProxyAgent(proxyUrl);
    proxyInterceptorId = axios_default.interceptors.request.use((config3) => {
      if (config3.url && shouldBypassProxy(config3.url))
        if (mtlsAgent)
          config3.httpsAgent = mtlsAgent, config3.httpAgent = mtlsAgent;
        else
          delete config3.httpsAgent, delete config3.httpAgent;
      else
        config3.httpsAgent = proxyAgent, config3.httpAgent = proxyAgent;
      return config3;
    }), __require("undici").setGlobalDispatcher(getProxyAgent(proxyUrl));
  } else if (mtlsAgent) {
    axios_default.defaults.httpsAgent = mtlsAgent;
    let mtlsOptions = getTLSFetchOptions();
    if (mtlsOptions.dispatcher)
      __require("undici").setGlobalDispatcher(mtlsOptions.dispatcher);
  }
}
