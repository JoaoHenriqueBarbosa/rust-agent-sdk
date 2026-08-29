// function: getTLSFetchOptions
function getTLSFetchOptions() {
  let mtlsConfig = getMTLSConfig(), caCerts = getCACertificates();
  if (!mtlsConfig && !caCerts)
    return {};
  let tlsConfig = {
    ...mtlsConfig,
    ...caCerts && { ca: caCerts }
  };
  if (typeof Bun < "u")
    return { tls: tlsConfig };
  return logForDebugging("TLS: Created undici agent with custom certificates"), { dispatcher: new (__require("undici")).Agent({
    connect: {
      cert: tlsConfig.cert,
      key: tlsConfig.key,
      passphrase: tlsConfig.passphrase,
      ...tlsConfig.ca && { ca: tlsConfig.ca }
    },
    pipelining: 1
  }) };
}
