// function: startSocksProxyServer
async function startSocksProxyServer(sandboxAskCallback) {
  return socksProxyServer = createSocksProxyServer({
    filter: (port, host) => filterNetworkRequest(port, host, sandboxAskCallback),
    parentProxy
  }), new Promise((resolve17, reject) => {
    if (!socksProxyServer) {
      reject(Error("SOCKS proxy server undefined before listen"));
      return;
    }
    socksProxyServer.listen(0, "127.0.0.1").then((port) => {
      socksProxyServer?.unref(), resolve17(port);
    }).catch(reject);
  });
}
