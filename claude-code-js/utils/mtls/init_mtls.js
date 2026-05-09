// var: init_mtls
var init_mtls = __esm(() => {
  init_memoize();
  init_caCerts();
  init_debug();
  init_fsOperations();
  getMTLSConfig = memoize_default(() => {
    let config2 = {};
    if (process.env.CLAUDE_CODE_CLIENT_CERT)
      try {
        config2.cert = getFsImplementation().readFileSync(process.env.CLAUDE_CODE_CLIENT_CERT, { encoding: "utf8" }), logForDebugging("mTLS: Loaded client certificate from CLAUDE_CODE_CLIENT_CERT");
      } catch (error41) {
        logForDebugging(`mTLS: Failed to load client certificate: ${error41}`, {
          level: "error"
        });
      }
    if (process.env.CLAUDE_CODE_CLIENT_KEY)
      try {
        config2.key = getFsImplementation().readFileSync(process.env.CLAUDE_CODE_CLIENT_KEY, { encoding: "utf8" }), logForDebugging("mTLS: Loaded client key from CLAUDE_CODE_CLIENT_KEY");
      } catch (error41) {
        logForDebugging(`mTLS: Failed to load client key: ${error41}`, {
          level: "error"
        });
      }
    if (process.env.CLAUDE_CODE_CLIENT_KEY_PASSPHRASE)
      config2.passphrase = process.env.CLAUDE_CODE_CLIENT_KEY_PASSPHRASE, logForDebugging("mTLS: Using client key passphrase");
    if (Object.keys(config2).length === 0)
      return;
    return config2;
  }), getMTLSAgent = memoize_default(() => {
    let mtlsConfig = getMTLSConfig(), caCerts = getCACertificates();
    if (!mtlsConfig && !caCerts)
      return;
    let agentOptions = {
      ...mtlsConfig,
      ...caCerts && { ca: caCerts },
      keepAlive: !0
    };
    return logForDebugging("mTLS: Creating HTTPS agent with custom certificates"), new HttpsAgent(agentOptions);
  });
});
