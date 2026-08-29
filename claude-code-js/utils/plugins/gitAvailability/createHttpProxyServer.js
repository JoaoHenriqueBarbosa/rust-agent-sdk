// function: createHttpProxyServer
function createHttpProxyServer(options) {
  let server = createServer();
  return server.on("connect", async (req, socket, head) => {
    socket.on("error", (err) => {
      logForDebugging2(`Client socket error: ${err.message}`, { level: "error" });
    });
    let clientGone = !1;
    socket.once("close", () => {
      clientGone = !0;
    });
    try {
      let target = parseConnectTarget(req.url);
      if (!target) {
        logForDebugging2(`Invalid CONNECT request: ${req.url}`, {
          level: "error"
        }), socket.end(`HTTP/1.1 400 Bad Request\r
\r
`);
        return;
      }
      let { hostname: hostname2, port } = target;
      if (!await options.filter(port, hostname2, socket)) {
        logForDebugging2(`Connection blocked to ${hostname2}:${port}`, {
          level: "error"
        }), socket.end(`HTTP/1.1 403 Forbidden\r
Content-Type: text/plain\r
X-Proxy-Error: blocked-by-allowlist\r
\r
Connection blocked by network allowlist`);
        return;
      }
      let mitmSocketPath = options.getMitmSocketPath?.(hostname2), parentUrl = !mitmSocketPath && options.parentProxy && !shouldBypassParentProxy(options.parentProxy, hostname2) ? selectParentProxyUrl(options.parentProxy, { isHttps: !0 }) : void 0, upstream;
      try {
        if (mitmSocketPath)
          logForDebugging2(`Routing CONNECT ${hostname2}:${port} through MITM proxy at ${mitmSocketPath}`), upstream = await openConnectTunnel({
            dial: () => connect({ path: mitmSocketPath }),
            readyEvent: "connect",
            destHost: hostname2,
            destPort: port
          });
        else if (parentUrl)
          upstream = await connectViaParentProxy(parentUrl, hostname2, port);
        else
          upstream = await dialDirect(hostname2, port);
      } catch (err) {
        logForDebugging2(`CONNECT tunnel failed: ${err.message}`, {
          level: "error"
        }), socket.end(`HTTP/1.1 502 Bad Gateway\r
\r
`);
        return;
      }
      if (clientGone) {
        upstream.on("error", () => {}), upstream.destroy();
        return;
      }
      if (socket.write(`HTTP/1.1 200 Connection Established\r
\r
`), head.length)
        upstream.write(head);
      upstream.pipe(socket), socket.pipe(upstream), upstream.on("error", (err) => {
        logForDebugging2(`CONNECT tunnel failed: ${err.message}`, {
          level: "error"
        }), socket.destroy();
      }), socket.on("close", () => upstream.destroy()), upstream.on("close", () => socket.destroy());
    } catch (err) {
      logForDebugging2(`Error handling CONNECT: ${err}`, { level: "error" }), socket.end(`HTTP/1.1 500 Internal Server Error\r
\r
`);
    }
  }), server.on("request", async (req, res) => {
    try {
      let url3 = new URL3(req.url), hostname2 = stripBrackets(url3.hostname), port = url3.port ? parseInt(url3.port, 10) : url3.protocol === "https:" ? 443 : 80;
      if (!await options.filter(port, hostname2, req.socket)) {
        logForDebugging2(`HTTP request blocked to ${hostname2}:${port}`, {
          level: "error"
        }), res.writeHead(403, {
          "Content-Type": "text/plain",
          "X-Proxy-Error": "blocked-by-allowlist"
        }), res.end("Connection blocked by network allowlist");
        return;
      }
      if (req.socket.destroyed)
        return;
      let fwdHeaders = { ...stripHopByHop(req.headers), host: url3.host }, mitmSocketPath = options.getMitmSocketPath?.(hostname2), parentUrl = !mitmSocketPath && options.parentProxy && !shouldBypassParentProxy(options.parentProxy, hostname2) ? selectParentProxyUrl(options.parentProxy, {
        isHttps: url3.protocol === "https:"
      }) : void 0, absUrl = `${url3.protocol}//${url3.host}${url3.pathname}${url3.search}`, proxyReq;
      if (mitmSocketPath) {
        logForDebugging2(`Routing HTTP ${req.method} ${hostname2}:${port} through MITM proxy at ${mitmSocketPath}`);
        let mitmAgent = new Agent({
          socketPath: mitmSocketPath
        });
        proxyReq = httpRequest10({
          agent: mitmAgent,
          path: absUrl,
          method: req.method,
          headers: fwdHeaders
        }, (proxyRes) => {
          res.writeHead(proxyRes.statusCode, stripHopByHop(proxyRes.headers)), proxyRes.pipe(res);
        });
      } else if (parentUrl) {
        let parentHost = stripBrackets(parentUrl.hostname), parentPort = Number(parentUrl.port) || (parentUrl.protocol === "https:" ? 443 : 80), auth13 = proxyAuthHeader(parentUrl);
        proxyReq = (parentUrl.protocol === "https:" ? httpsRequest : httpRequest10)({
          hostname: parentHost,
          port: parentPort,
          path: absUrl,
          method: req.method,
          headers: auth13 ? { ...fwdHeaders, "proxy-authorization": auth13 } : fwdHeaders
        }, (proxyRes) => {
          res.writeHead(proxyRes.statusCode, stripHopByHop(proxyRes.headers)), proxyRes.pipe(res);
        });
      } else
        proxyReq = (url3.protocol === "https:" ? httpsRequest : httpRequest10)({
          hostname: hostname2,
          port,
          path: url3.pathname + url3.search,
          method: req.method,
          headers: fwdHeaders
        }, (proxyRes) => {
          res.writeHead(proxyRes.statusCode, stripHopByHop(proxyRes.headers)), proxyRes.pipe(res);
        });
      proxyReq.on("error", (err) => {
        if (logForDebugging2(`Proxy request failed: ${err.message}`, {
          level: "error"
        }), !res.headersSent)
          res.writeHead(502, { "Content-Type": "text/plain" }), res.end("Bad Gateway");
        else
          res.destroy();
      }), res.on("close", () => proxyReq.destroy()), req.pipe(proxyReq);
    } catch (err) {
      if (logForDebugging2(`Error handling HTTP request: ${err}`, { level: "error" }), !res.headersSent)
        res.writeHead(500, { "Content-Type": "text/plain" }), res.end("Internal Server Error");
      else
        res.destroy();
    }
  }), server;
}
