// var: init_proxy
var init_proxy = __esm(() => {
  init_axios2();
  init_memoize();
  init_caCerts();
  init_debug();
  init_envUtils();
  init_mtls();
  import_https_proxy_agent = __toESM(require_dist2(), 1);
  getProxyAgent = memoize_default((uri2) => {
    let undiciMod = __require("undici"), mtlsConfig = getMTLSConfig(), caCerts = getCACertificates(), proxyOptions = {
      httpProxy: uri2,
      httpsProxy: uri2,
      noProxy: process.env.NO_PROXY || process.env.no_proxy
    };
    if (mtlsConfig || caCerts) {
      let tlsOpts = {
        ...mtlsConfig && {
          cert: mtlsConfig.cert,
          key: mtlsConfig.key,
          passphrase: mtlsConfig.passphrase
        },
        ...caCerts && { ca: caCerts }
      };
      proxyOptions.connect = tlsOpts, proxyOptions.requestTls = tlsOpts;
    }
    return new undiciMod.EnvHttpProxyAgent(proxyOptions);
  });
});
