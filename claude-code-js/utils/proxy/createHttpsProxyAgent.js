// function: createHttpsProxyAgent
function createHttpsProxyAgent(proxyUrl, extra = {}) {
  let mtlsConfig = getMTLSConfig(), caCerts = getCACertificates(), agentOptions = {
    ...mtlsConfig && {
      cert: mtlsConfig.cert,
      key: mtlsConfig.key,
      passphrase: mtlsConfig.passphrase
    },
    ...caCerts && { ca: caCerts }
  };
  if (isEnvTruthy(process.env.CLAUDE_CODE_PROXY_RESOLVES_HOSTS))
    agentOptions.lookup = (hostname2, options, callback) => {
      callback(null, hostname2, getAddressFamily(options));
    };
  return new import_https_proxy_agent.HttpsProxyAgent(proxyUrl, { ...agentOptions, ...extra });
}
