// function: setProxyAgentOnRequest
function setProxyAgentOnRequest(request2, cachedAgents, proxyUrl) {
  if (request2.agent)
    return;
  let isInsecure = new URL(request2.url).protocol !== "https:";
  if (request2.tlsSettings)
    logger11.warning("TLS settings are not supported in combination with custom Proxy, certificates provided to the client will be ignored.");
  let headers = request2.headers.toJSON();
  if (isInsecure) {
    if (!cachedAgents.httpProxyAgent)
      cachedAgents.httpProxyAgent = new import_http_proxy_agent.HttpProxyAgent(proxyUrl, { headers });
    request2.agent = cachedAgents.httpProxyAgent;
  } else {
    if (!cachedAgents.httpsProxyAgent)
      cachedAgents.httpsProxyAgent = new import_https_proxy_agent2.HttpsProxyAgent(proxyUrl, { headers });
    request2.agent = cachedAgents.httpsProxyAgent;
  }
}
