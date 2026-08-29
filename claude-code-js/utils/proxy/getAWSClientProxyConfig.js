// function: getAWSClientProxyConfig
async function getAWSClientProxyConfig() {
  let proxyUrl = getProxyUrl();
  if (!proxyUrl)
    return {};
  let [{ NodeHttpHandler: NodeHttpHandler2 }, { defaultProvider: defaultProvider3 }] = await Promise.all([
    Promise.resolve().then(() => __toESM(require_dist_cjs5(), 1)),
    Promise.resolve().then(() => (init_dist_es14(), exports_dist_es9))
  ]), agent = createHttpsProxyAgent(proxyUrl), requestHandler = new NodeHttpHandler2({
    httpAgent: agent,
    httpsAgent: agent
  });
  return {
    requestHandler,
    credentials: defaultProvider3({
      clientConfig: { requestHandler }
    })
  };
}
