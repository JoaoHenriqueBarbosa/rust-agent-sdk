// function: connectViaParentProxy
function connectViaParentProxy(proxyUrl, destHost, destPort) {
  let proxyHost = stripBrackets(proxyUrl.hostname), proxyPort = Number(proxyUrl.port) || (proxyUrl.protocol === "https:" ? 443 : 80), useTls = proxyUrl.protocol === "https:";
  return openConnectTunnel({
    destHost,
    destPort,
    authHeader: proxyAuthHeader(proxyUrl),
    readyEvent: useTls ? "secureConnect" : "connect",
    dial: () => useTls ? tlsConnect({
      host: proxyHost,
      port: proxyPort,
      ...isIP(proxyHost) ? {} : { servername: proxyHost }
    }) : netConnect(proxyPort, proxyHost)
  });
}
