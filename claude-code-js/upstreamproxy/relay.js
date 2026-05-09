// Original: src/upstreamproxy/relay.ts
import { createServer as createServer8 } from "net";
function encodeChunk(data) {
  let len = data.length, varint = [], n6 = len;
  while (n6 > 127)
    varint.push(n6 & 127 | 128), n6 >>>= 7;
  varint.push(n6);
  let out = new Uint8Array(1 + varint.length + len);
  return out[0] = 10, out.set(varint, 1), out.set(data, 1 + varint.length), out;
}
function decodeChunk(buf) {
  if (buf.length === 0)
    return new Uint8Array(0);
  if (buf[0] !== 10)
    return null;
  let len = 0, shift = 0, i5 = 1;
  while (i5 < buf.length) {
    let b = buf[i5];
    if (len |= (b & 127) << shift, i5++, (b & 128) === 0)
      break;
    if (shift += 7, shift > 28)
      return null;
  }
  if (i5 + len > buf.length)
    return null;
  return buf.subarray(i5, i5 + len);
}
function newConnState() {
  return {
    connectBuf: Buffer.alloc(0),
    pending: [],
    wsOpen: !1,
    established: !1,
    closed: !1
  };
}
async function startUpstreamProxyRelay(opts) {
  let authHeader = "Basic " + Buffer.from(`${opts.sessionId}:${opts.token}`).toString("base64"), wsAuthHeader = `Bearer ${opts.token}`, relay = typeof Bun < "u" ? startBunRelay(opts.wsUrl, authHeader, wsAuthHeader) : await startNodeRelay(opts.wsUrl, authHeader, wsAuthHeader);
  return logForDebugging(`[upstreamproxy] relay listening on 127.0.0.1:${relay.port}`), relay;
}
function startBunRelay(wsUrl, authHeader, wsAuthHeader) {
  let server = Bun.listen({
    hostname: "127.0.0.1",
    port: 0,
    socket: {
      open(sock) {
        sock.data = { ...newConnState(), writeBuf: [] };
      },
      data(sock, data) {
        let st = sock.data;
        handleData({
          write: (payload) => {
            let bytes = typeof payload === "string" ? Buffer.from(payload, "utf8") : payload;
            if (st.writeBuf.length > 0) {
              st.writeBuf.push(bytes);
              return;
            }
            let n6 = sock.write(bytes);
            if (n6 < bytes.length)
              st.writeBuf.push(bytes.subarray(n6));
          },
          end: () => sock.end()
        }, st, data, wsUrl, authHeader, wsAuthHeader);
      },
      drain(sock) {
        let st = sock.data;
        while (st.writeBuf.length > 0) {
          let chunk2 = st.writeBuf[0], n6 = sock.write(chunk2);
          if (n6 < chunk2.length) {
            st.writeBuf[0] = chunk2.subarray(n6);
            return;
          }
          st.writeBuf.shift();
        }
      },
      close(sock) {
        cleanupConn(sock.data);
      },
      error(sock, err2) {
        logForDebugging(`[upstreamproxy] client socket error: ${err2.message}`), cleanupConn(sock.data);
      }
    }
  });
  return {
    port: server.port,
    stop: () => server.stop(!0)
  };
}
async function startNodeRelay(wsUrl, authHeader, wsAuthHeader) {
  nodeWSCtor = (await import("ws")).default;
  let states = /* @__PURE__ */ new WeakMap, server = createServer8((sock) => {
    let st = newConnState();
    states.set(sock, st);
    let adapter3 = {
      write: (payload) => {
        sock.write(typeof payload === "string" ? payload : Buffer.from(payload));
      },
      end: () => sock.end()
    };
    sock.on("data", (data) => handleData(adapter3, st, data, wsUrl, authHeader, wsAuthHeader)), sock.on("close", () => cleanupConn(states.get(sock))), sock.on("error", (err2) => {
      logForDebugging(`[upstreamproxy] client socket error: ${err2.message}`), cleanupConn(states.get(sock));
    });
  });
  return new Promise((resolve45, reject2) => {
    server.once("error", reject2), server.listen(0, "127.0.0.1", () => {
      let addr = server.address();
      if (addr === null || typeof addr === "string") {
        reject2(Error("upstreamproxy: server has no TCP address"));
        return;
      }
      resolve45({
        port: addr.port,
        stop: () => server.close()
      });
    });
  });
}
function handleData(sock, st, data, wsUrl, authHeader, wsAuthHeader) {
  if (!st.ws) {
    st.connectBuf = Buffer.concat([st.connectBuf, data]);
    let headerEnd = st.connectBuf.indexOf(`\r
\r
`);
    if (headerEnd === -1) {
      if (st.connectBuf.length > 8192)
        sock.write(`HTTP/1.1 400 Bad Request\r
\r
`), sock.end();
      return;
    }
    let firstLine = st.connectBuf.subarray(0, headerEnd).toString("utf8").split(`\r
`)[0] ?? "";
    if (!firstLine.match(/^CONNECT\s+(\S+)\s+HTTP\/1\.[01]$/i)) {
      sock.write(`HTTP/1.1 405 Method Not Allowed\r
\r
`), sock.end();
      return;
    }
    let trailing = st.connectBuf.subarray(headerEnd + 4);
    if (trailing.length > 0)
      st.pending.push(Buffer.from(trailing));
    st.connectBuf = Buffer.alloc(0), openTunnel(sock, st, firstLine, wsUrl, authHeader, wsAuthHeader);
    return;
  }
  if (!st.wsOpen) {
    st.pending.push(Buffer.from(data));
    return;
  }
  forwardToWs(st.ws, data);
}
function openTunnel(sock, st, connectLine, wsUrl, authHeader, wsAuthHeader) {
  let headers = {
    "Content-Type": "application/proto",
    Authorization: wsAuthHeader
  }, ws;
  if (nodeWSCtor)
    ws = new nodeWSCtor(wsUrl, {
      headers,
      agent: getWebSocketProxyAgent(wsUrl),
      ...getWebSocketTLSOptions()
    });
  else
    ws = new globalThis.WebSocket(wsUrl, {
      headers,
      proxy: getWebSocketProxyUrl(wsUrl),
      tls: getWebSocketTLSOptions() || void 0
    });
  ws.binaryType = "arraybuffer", st.ws = ws, ws.onopen = () => {
    let head = `${connectLine}\r
Proxy-Authorization: ${authHeader}\r
\r
`;
    ws.send(encodeChunk(Buffer.from(head, "utf8"))), st.wsOpen = !0;
    for (let buf of st.pending)
      forwardToWs(ws, buf);
    st.pending = [], st.pinger = setInterval(sendKeepalive, PING_INTERVAL_MS, ws);
  }, ws.onmessage = (ev) => {
    let raw = ev.data instanceof ArrayBuffer ? new Uint8Array(ev.data) : new Uint8Array(Buffer.from(ev.data)), payload = decodeChunk(raw);
    if (payload && payload.length > 0)
      st.established = !0, sock.write(payload);
  }, ws.onerror = (ev) => {
    let msg = "message" in ev ? String(ev.message) : "websocket error";
    if (logForDebugging(`[upstreamproxy] ws error: ${msg}`), st.closed)
      return;
    if (st.closed = !0, !st.established)
      sock.write(`HTTP/1.1 502 Bad Gateway\r
\r
`);
    sock.end(), cleanupConn(st);
  }, ws.onclose = () => {
    if (st.closed)
      return;
    st.closed = !0, sock.end(), cleanupConn(st);
  };
}
function sendKeepalive(ws) {
  if (ws.readyState === WebSocket.OPEN)
    ws.send(encodeChunk(new Uint8Array(0)));
}
function forwardToWs(ws, data) {
  if (ws.readyState !== WebSocket.OPEN)
    return;
  for (let off = 0;off < data.length; off += MAX_CHUNK_BYTES) {
    let slice = data.subarray(off, off + MAX_CHUNK_BYTES);
    ws.send(encodeChunk(slice));
  }
}
function cleanupConn(st) {
  if (!st)
    return;
  if (st.pinger)
    clearInterval(st.pinger);
  if (st.ws && st.ws.readyState <= WebSocket.OPEN)
    try {
      st.ws.close();
    } catch {}
  st.ws = void 0;
}
var nodeWSCtor, MAX_CHUNK_BYTES = 524288, PING_INTERVAL_MS = 30000;
var init_relay = __esm(() => {
  init_debug();
  init_mtls();
  init_proxy();
});
