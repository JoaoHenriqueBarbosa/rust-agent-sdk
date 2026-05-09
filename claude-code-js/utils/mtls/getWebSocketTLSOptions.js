// function: getWebSocketTLSOptions
function getWebSocketTLSOptions() {
  let mtlsConfig = getMTLSConfig(), caCerts = getCACertificates();
  if (!mtlsConfig && !caCerts)
    return;
  return {
    ...mtlsConfig,
    ...caCerts && { ca: caCerts }
  };
}
