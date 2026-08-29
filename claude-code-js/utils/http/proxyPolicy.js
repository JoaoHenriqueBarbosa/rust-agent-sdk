// function: proxyPolicy
function proxyPolicy(proxySettings, options) {
  if (!noProxyListLoaded)
    globalNoProxyList.push(...loadNoProxy());
  let defaultProxy = proxySettings ? getUrlFromProxySettings(proxySettings) : getDefaultProxySettingsInternal(), cachedAgents = {};
  return {
    name: proxyPolicyName,
    async sendRequest(request2, next) {
      if (!request2.proxySettings && defaultProxy && !isBypassed(request2.url, options?.customNoProxyList ?? globalNoProxyList, options?.customNoProxyList ? void 0 : globalBypassedMap))
        setProxyAgentOnRequest(request2, cachedAgents, defaultProxy);
      else if (request2.proxySettings)
        setProxyAgentOnRequest(request2, cachedAgents, getUrlFromProxySettings(request2.proxySettings));
      return next(request2);
    }
  };
}
