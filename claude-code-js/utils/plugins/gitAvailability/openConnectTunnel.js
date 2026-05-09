// function: openConnectTunnel
function openConnectTunnel(opts) {
  let { destHost, destPort } = opts, bare = stripBrackets(destHost);
  if (!isValidHost(bare))
    return Promise.reject(Error(`Invalid destination host for CONNECT: ${JSON.stringify(destHost)}`));
  if (!Number.isInteger(destPort) || destPort < 1 || destPort > 65535)
    return Promise.reject(Error(`Invalid destination port: ${destPort}`));
  let authority = isIP(bare) === 6 ? `[${bare}]:${destPort}` : `${bare}:${destPort}`;
  return new Promise((resolve15, reject) => {
    let sock = opts.dial(), settled = !1, fail = (err) => {
      if (settled)
        return;
      settled = !0, sock.destroy(), reject(err);
    }, onClose = () => fail(Error("Proxy closed during CONNECT handshake"));
    sock.setTimeout(opts.timeoutMs ?? CONNECT_TIMEOUT_MS, () => fail(Error("CONNECT handshake timed out"))), sock.once("error", fail), sock.once("close", onClose), sock.once(opts.readyEvent, () => {
      sock.write(`CONNECT ${authority} HTTP/1.1\r
Host: ${authority}\r
` + (opts.authHeader ? `Proxy-Authorization: ${opts.authHeader}\r
` : "") + `\r
`);
      let buf = "", onData = (chunk) => {
        buf += chunk.toString("latin1");
        let end = buf.indexOf(`\r
\r
`);
        if (end === -1) {
          if (buf.length > 16384)
            fail(Error("CONNECT response header too large"));
          return;
        }
        sock.pause(), sock.removeListener("data", onData);
        let statusLine = buf.slice(0, buf.indexOf(`\r
`));
        if (!/^HTTP\/1\.[01] 2\d\d(?:\s|$)/.test(statusLine))
          return fail(Error(`Proxy refused CONNECT: ${statusLine.trim()}`));
        let rest = buf.slice(end + 4);
        if (rest.length)
          sock.unshift(Buffer.from(rest, "latin1"));
        settled = !0, sock.setTimeout(0), sock.removeListener("error", fail), sock.removeListener("close", onClose), resolve15(sock);
      };
      sock.on("data", onData);
    });
  });
}
