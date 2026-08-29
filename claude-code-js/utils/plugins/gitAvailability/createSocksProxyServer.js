// function: createSocksProxyServer
function createSocksProxyServer(options) {
  let socksServer = createServer2();
  return socksServer.setRulesetValidator(async (conn) => {
    try {
      let { destAddress: hostname2, destPort: port } = conn;
      if (!isValidHost(hostname2))
        return logForDebugging2(`Rejecting malformed SOCKS host: ${JSON.stringify(hostname2)}`, { level: "error" }), !1;
      if (logForDebugging2(`Connection request to ${hostname2}:${port}`), !await options.filter(port, hostname2))
        return logForDebugging2(`Connection blocked to ${hostname2}:${port}`, {
          level: "error"
        }), !1;
      return logForDebugging2(`Connection allowed to ${hostname2}:${port}`), !0;
    } catch (error44) {
      return logForDebugging2(`Error validating connection: ${error44}`, {
        level: "error"
      }), !1;
    }
  }), socksServer.setConnectionHandler((conn, sendStatus) => {
    let { destAddress: host, destPort: port } = conn, clientGone = !1, upstreamRef;
    conn.socket.once("close", () => {
      clientGone = !0, upstreamRef?.destroy();
    }), conn.socket.on("error", () => upstreamRef?.destroy());
    let parentUrl = options.parentProxy && !shouldBypassParentProxy(options.parentProxy, host) ? selectParentProxyUrl(options.parentProxy, { isHttps: !0 }) : void 0;
    (parentUrl ? connectViaParentProxy(parentUrl, host, port) : dialDirect(host, port)).then((upstream) => {
      if (upstreamRef = upstream, upstream.on("error", () => conn.socket.destroy()), clientGone) {
        upstream.destroy();
        return;
      }
      sendStatus("REQUEST_GRANTED"), upstream.pipe(conn.socket), conn.socket.pipe(upstream), upstream.on("close", () => conn.socket.destroy());
    }).catch((err) => {
      if (logForDebugging2(`SOCKS connect to ${host}:${port} failed: ${err.message}`, { level: "error" }), !clientGone)
        try {
          sendStatus("HOST_UNREACHABLE");
        } catch {}
    });
  }), {
    server: socksServer,
    getPort() {
      try {
        let serverInternal = socksServer?.server;
        if (serverInternal && typeof serverInternal?.address === "function") {
          let address = serverInternal.address();
          if (address && typeof address === "object" && "port" in address)
            return address.port;
        }
      } catch (error44) {
        logForDebugging2(`Error getting port: ${error44}`, { level: "error" });
      }
      return;
    },
    listen(port, hostname2) {
      return new Promise((resolve15, reject) => {
        let serverInternal = socksServer?.server;
        serverInternal?.once("error", reject);
        let listeningCallback = () => {
          serverInternal?.removeListener("error", reject);
          let actualPort = this.getPort();
          if (actualPort)
            logForDebugging2(`SOCKS proxy listening on ${hostname2}:${actualPort}`), resolve15(actualPort);
          else
            reject(Error("Failed to get SOCKS proxy server port"));
        };
        socksServer.listen(port, hostname2, listeningCallback);
      });
    },
    async close() {
      return new Promise((resolve15, reject) => {
        socksServer.close((error44) => {
          if (error44) {
            let errorMessage2 = error44.message?.toLowerCase() || "";
            if (!(errorMessage2.includes("not running") || errorMessage2.includes("already closed") || errorMessage2.includes("not listening"))) {
              reject(error44);
              return;
            }
          }
          resolve15();
        });
      });
    },
    unref() {
      try {
        let serverInternal = socksServer?.server;
        if (serverInternal && typeof serverInternal?.unref === "function")
          serverInternal.unref();
      } catch (error44) {
        logForDebugging2(`Error calling unref: ${error44}`, { level: "error" });
      }
    }
  };
}
