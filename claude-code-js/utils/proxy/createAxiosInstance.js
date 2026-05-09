// function: createAxiosInstance
function createAxiosInstance(extra = {}) {
  let proxyUrl = getProxyUrl(), mtlsAgent = getMTLSAgent(), instance = axios_default.create({ proxy: !1 });
  if (!proxyUrl) {
    if (mtlsAgent)
      instance.defaults.httpsAgent = mtlsAgent;
    return instance;
  }
  let proxyAgent = createHttpsProxyAgent(proxyUrl, extra);
  return instance.interceptors.request.use((config3) => {
    if (config3.url && shouldBypassProxy(config3.url))
      config3.httpsAgent = mtlsAgent, config3.httpAgent = mtlsAgent;
    else
      config3.httpsAgent = proxyAgent, config3.httpAgent = proxyAgent;
    return config3;
  }), instance;
}
