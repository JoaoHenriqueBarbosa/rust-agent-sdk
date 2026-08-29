// function: startHttpProxyServer
async function startHttpProxyServer(sandboxAskCallback) {
  return httpProxyServer = createHttpProxyServer({
    filter: (port, host) => filterNetworkRequest(port, host, sandboxAskCallback),
    getMitmSocketPath,
    parentProxy
  }), new Promise((resolve17, reject) => {
    if (!httpProxyServer) {
      reject(Error("HTTP proxy server undefined before listen"));
      return;
    }
    let server = httpProxyServer;
    server.once("error", reject), server.once("listening", () => {
      let address = server.address();
      if (address && typeof address === "object")
        server.unref(), logForDebugging2(`HTTP proxy listening on localhost:${address.port}`), resolve17(address.port);
      else
        reject(Error("Failed to get proxy server address"));
    }), server.listen(0, "127.0.0.1");
  });
}
