// Original: src/cli/transports/WebSocketTransport.ts
class WebSocketTransport2 {
  ws = null;
  lastSentId = null;
  url;
  state = "idle";
  onData;
  onCloseCallback;
  onConnectCallback;
  headers;
  sessionId;
  autoReconnect;
  isBridge;
  reconnectAttempts = 0;
  reconnectStartTime = null;
  reconnectTimer = null;
  lastReconnectAttemptTime = null;
  lastActivityTime = 0;
  pingInterval = null;
  pongReceived = !0;
  keepAliveInterval = null;
  messageBuffer;
  isBunWs = !1;
  connectStartTime = 0;
  refreshHeaders;
  constructor(url3, headers = {}, sessionId, refreshHeaders, options2) {
    this.url = url3, this.headers = headers, this.sessionId = sessionId, this.refreshHeaders = refreshHeaders, this.autoReconnect = options2?.autoReconnect ?? !0, this.isBridge = options2?.isBridge ?? !1, this.messageBuffer = new CircularBuffer(DEFAULT_MAX_BUFFER_SIZE);
  }
  async connect() {
    if (this.state !== "idle" && this.state !== "reconnecting") {
      logForDebugging(`WebSocketTransport: Cannot connect, current state is ${this.state}`, { level: "error" }), logForDiagnosticsNoPII("error", "cli_websocket_connect_failed");
      return;
    }
    this.state = "reconnecting", this.connectStartTime = Date.now(), logForDebugging(`WebSocketTransport: Opening ${this.url.href}`), logForDiagnosticsNoPII("info", "cli_websocket_connect_opening");
    let headers = { ...this.headers };
    if (this.lastSentId)
      headers["X-Last-Request-Id"] = this.lastSentId, logForDebugging(`WebSocketTransport: Adding X-Last-Request-Id header: ${this.lastSentId}`);
    if (typeof Bun < "u") {
      let ws = new globalThis.WebSocket(this.url.href, {
        headers,
        proxy: getWebSocketProxyUrl(this.url.href),
        tls: getWebSocketTLSOptions() || void 0
      });
      this.ws = ws, this.isBunWs = !0, ws.addEventListener("open", this.onBunOpen), ws.addEventListener("message", this.onBunMessage), ws.addEventListener("error", this.onBunError), ws.addEventListener("close", this.onBunClose), ws.addEventListener("pong", this.onPong);
    } else {
      let { default: WS } = await import("ws"), ws = new WS(this.url.href, {
        headers,
        agent: getWebSocketProxyAgent(this.url.href),
        ...getWebSocketTLSOptions()
      });
      this.ws = ws, this.isBunWs = !1, ws.on("open", this.onNodeOpen), ws.on("message", this.onNodeMessage), ws.on("error", this.onNodeError), ws.on("close", this.onNodeClose), ws.on("pong", this.onPong);
    }
  }
  onBunOpen = () => {
    if (this.handleOpenEvent(), this.lastSentId)
      this.replayBufferedMessages("");
  };
  onBunMessage = (event) => {
    let message = typeof event.data === "string" ? event.data : String(event.data);
    if (this.lastActivityTime = Date.now(), logForDiagnosticsNoPII("info", "cli_websocket_message_received", {
      length: message.length
    }), this.onData)
      this.onData(message);
  };
  onBunError = () => {
    logForDebugging("WebSocketTransport: Error", {
      level: "error"
    }), logForDiagnosticsNoPII("error", "cli_websocket_connect_error");
  };
  onBunClose = (event) => {
    let isClean = event.code === 1000 || event.code === 1001;
    logForDebugging(`WebSocketTransport: Closed: ${event.code}`, isClean ? void 0 : { level: "error" }), logForDiagnosticsNoPII("error", "cli_websocket_connect_closed"), this.handleConnectionError(event.code);
  };
  onNodeOpen = () => {
    let ws = this.ws;
    if (this.handleOpenEvent(), !ws)
      return;
    let upgradeResponse = ws.upgradeReq;
    if (upgradeResponse?.headers?.["x-last-request-id"]) {
      let serverLastId = upgradeResponse.headers["x-last-request-id"];
      this.replayBufferedMessages(serverLastId);
    }
  };
  onNodeMessage = (data) => {
    let message = data.toString();
    if (this.lastActivityTime = Date.now(), logForDiagnosticsNoPII("info", "cli_websocket_message_received", {
      length: message.length
    }), this.onData)
      this.onData(message);
  };
  onNodeError = (err2) => {
    logForDebugging(`WebSocketTransport: Error: ${err2.message}`, {
      level: "error"
    }), logForDiagnosticsNoPII("error", "cli_websocket_connect_error");
  };
  onNodeClose = (code, _reason) => {
    let isClean = code === 1000 || code === 1001;
    logForDebugging(`WebSocketTransport: Closed: ${code}`, isClean ? void 0 : { level: "error" }), logForDiagnosticsNoPII("error", "cli_websocket_connect_closed"), this.handleConnectionError(code);
  };
  onPong = () => {
    this.pongReceived = !0;
  };
  handleOpenEvent() {
    let connectDuration = Date.now() - this.connectStartTime;
    if (logForDebugging("WebSocketTransport: Connected"), logForDiagnosticsNoPII("info", "cli_websocket_connect_connected", {
      duration_ms: connectDuration
    }), this.isBridge && this.reconnectStartTime !== null)
      logEvent("tengu_ws_transport_reconnected", {
        attempts: this.reconnectAttempts,
        downtimeMs: Date.now() - this.reconnectStartTime
      });
    this.reconnectAttempts = 0, this.reconnectStartTime = null, this.lastReconnectAttemptTime = null, this.lastActivityTime = Date.now(), this.state = "connected", this.onConnectCallback?.(), this.startPingInterval(), this.startKeepaliveInterval(), registerSessionActivityCallback(() => {
      this.write({ type: "keep_alive" });
    });
  }
  sendLine(line) {
    if (!this.ws || this.state !== "connected")
      return logForDebugging("WebSocketTransport: Not connected"), logForDiagnosticsNoPII("info", "cli_websocket_send_not_connected"), !1;
    try {
      return this.ws.send(line), this.lastActivityTime = Date.now(), !0;
    } catch (error44) {
      return logForDebugging(`WebSocketTransport: Failed to send: ${error44}`, {
        level: "error"
      }), logForDiagnosticsNoPII("error", "cli_websocket_send_error"), this.handleConnectionError(), !1;
    }
  }
  removeWsListeners(ws) {
    if (this.isBunWs) {
      let nws = ws;
      nws.removeEventListener("open", this.onBunOpen), nws.removeEventListener("message", this.onBunMessage), nws.removeEventListener("error", this.onBunError), nws.removeEventListener("close", this.onBunClose), nws.removeEventListener("pong", this.onPong);
    } else {
      let nws = ws;
      nws.off("open", this.onNodeOpen), nws.off("message", this.onNodeMessage), nws.off("error", this.onNodeError), nws.off("close", this.onNodeClose), nws.off("pong", this.onPong);
    }
  }
  doDisconnect() {
    if (this.stopPingInterval(), this.stopKeepaliveInterval(), unregisterSessionActivityCallback(), this.ws)
      this.removeWsListeners(this.ws), this.ws.close(), this.ws = null;
  }
  handleConnectionError(closeCode) {
    if (logForDebugging(`WebSocketTransport: Disconnected from ${this.url.href}` + (closeCode != null ? ` (code ${closeCode})` : "")), logForDiagnosticsNoPII("info", "cli_websocket_disconnected"), this.isBridge)
      logEvent("tengu_ws_transport_closed", {
        closeCode,
        msSinceLastActivity: this.lastActivityTime > 0 ? Date.now() - this.lastActivityTime : -1,
        wasConnected: this.state === "connected",
        reconnectAttempts: this.reconnectAttempts
      });
    if (this.doDisconnect(), this.state === "closing" || this.state === "closed")
      return;
    let headersRefreshed = !1;
    if (closeCode === 4003 && this.refreshHeaders) {
      let freshHeaders = this.refreshHeaders();
      if (freshHeaders.Authorization !== this.headers.Authorization)
        Object.assign(this.headers, freshHeaders), headersRefreshed = !0, logForDebugging("WebSocketTransport: 4003 received but headers refreshed, scheduling reconnect"), logForDiagnosticsNoPII("info", "cli_websocket_4003_token_refreshed");
    }
    if (closeCode != null && PERMANENT_CLOSE_CODES2.has(closeCode) && !headersRefreshed) {
      logForDebugging(`WebSocketTransport: Permanent close code ${closeCode}, not reconnecting`, { level: "error" }), logForDiagnosticsNoPII("error", "cli_websocket_permanent_close", {
        closeCode
      }), this.state = "closed", this.onCloseCallback?.(closeCode);
      return;
    }
    if (!this.autoReconnect) {
      this.state = "closed", this.onCloseCallback?.(closeCode);
      return;
    }
    let now2 = Date.now();
    if (!this.reconnectStartTime)
      this.reconnectStartTime = now2;
    if (this.lastReconnectAttemptTime !== null && now2 - this.lastReconnectAttemptTime > SLEEP_DETECTION_THRESHOLD_MS)
      logForDebugging(`WebSocketTransport: Detected system sleep (${Math.round((now2 - this.lastReconnectAttemptTime) / 1000)}s gap), resetting reconnection budget`), logForDiagnosticsNoPII("info", "cli_websocket_sleep_detected", {
        gapMs: now2 - this.lastReconnectAttemptTime
      }), this.reconnectStartTime = now2, this.reconnectAttempts = 0;
    this.lastReconnectAttemptTime = now2;
    let elapsed = now2 - this.reconnectStartTime;
    if (elapsed < DEFAULT_RECONNECT_GIVE_UP_MS) {
      if (this.reconnectTimer)
        clearTimeout(this.reconnectTimer), this.reconnectTimer = null;
      if (!headersRefreshed && this.refreshHeaders) {
        let freshHeaders = this.refreshHeaders();
        Object.assign(this.headers, freshHeaders), logForDebugging("WebSocketTransport: Refreshed headers for reconnect");
      }
      this.state = "reconnecting", this.reconnectAttempts++;
      let baseDelay = Math.min(DEFAULT_BASE_RECONNECT_DELAY * Math.pow(2, this.reconnectAttempts - 1), DEFAULT_MAX_RECONNECT_DELAY), delay4 = Math.max(0, baseDelay + baseDelay * 0.25 * (2 * Math.random() - 1));
      if (logForDebugging(`WebSocketTransport: Reconnecting in ${Math.round(delay4)}ms (attempt ${this.reconnectAttempts}, ${Math.round(elapsed / 1000)}s elapsed)`), logForDiagnosticsNoPII("error", "cli_websocket_reconnect_attempt", {
        reconnectAttempts: this.reconnectAttempts
      }), this.isBridge)
        logEvent("tengu_ws_transport_reconnecting", {
          attempt: this.reconnectAttempts,
          elapsedMs: elapsed,
          delayMs: Math.round(delay4)
        });
      this.reconnectTimer = setTimeout(() => {
        this.reconnectTimer = null, this.connect();
      }, delay4);
    } else if (logForDebugging(`WebSocketTransport: Reconnection time budget exhausted after ${Math.round(elapsed / 1000)}s for ${this.url.href}`, { level: "error" }), logForDiagnosticsNoPII("error", "cli_websocket_reconnect_exhausted", {
      reconnectAttempts: this.reconnectAttempts,
      elapsedMs: elapsed
    }), this.state = "closed", this.onCloseCallback)
      this.onCloseCallback(closeCode);
  }
  close() {
    if (this.reconnectTimer)
      clearTimeout(this.reconnectTimer), this.reconnectTimer = null;
    this.stopPingInterval(), this.stopKeepaliveInterval(), unregisterSessionActivityCallback(), this.state = "closing", this.doDisconnect();
  }
  replayBufferedMessages(lastId) {
    let messages = this.messageBuffer.toArray();
    if (messages.length === 0)
      return;
    let startIndex = 0;
    if (lastId) {
      let lastConfirmedIndex = messages.findIndex((message) => ("uuid" in message) && message.uuid === lastId);
      if (lastConfirmedIndex >= 0) {
        startIndex = lastConfirmedIndex + 1;
        let remaining = messages.slice(startIndex);
        if (this.messageBuffer.clear(), this.messageBuffer.addAll(remaining), remaining.length === 0)
          this.lastSentId = null;
        logForDebugging(`WebSocketTransport: Evicted ${startIndex} confirmed messages, ${remaining.length} remaining`), logForDiagnosticsNoPII("info", "cli_websocket_evicted_confirmed_messages", {
          evicted: startIndex,
          remaining: remaining.length
        });
      }
    }
    let messagesToReplay = messages.slice(startIndex);
    if (messagesToReplay.length === 0) {
      logForDebugging("WebSocketTransport: No new messages to replay"), logForDiagnosticsNoPII("info", "cli_websocket_no_messages_to_replay");
      return;
    }
    logForDebugging(`WebSocketTransport: Replaying ${messagesToReplay.length} buffered messages`), logForDiagnosticsNoPII("info", "cli_websocket_messages_to_replay", {
      count: messagesToReplay.length
    });
    for (let message of messagesToReplay) {
      let line = jsonStringify(message) + `
`;
      if (!this.sendLine(line)) {
        this.handleConnectionError();
        break;
      }
    }
  }
  isConnectedStatus() {
    return this.state === "connected";
  }
  isClosedStatus() {
    return this.state === "closed";
  }
  setOnData(callback) {
    this.onData = callback;
  }
  setOnConnect(callback) {
    this.onConnectCallback = callback;
  }
  setOnClose(callback) {
    this.onCloseCallback = callback;
  }
  getStateLabel() {
    return this.state;
  }
  async write(message) {
    if ("uuid" in message && typeof message.uuid === "string")
      this.messageBuffer.add(message), this.lastSentId = message.uuid;
    let line = jsonStringify(message) + `
`;
    if (this.state !== "connected")
      return;
    let sessionLabel = this.sessionId ? ` session=${this.sessionId}` : "", detailLabel = this.getControlMessageDetailLabel(message);
    logForDebugging(`WebSocketTransport: Sending message type=${message.type}${sessionLabel}${detailLabel}`), this.sendLine(line);
  }
  getControlMessageDetailLabel(message) {
    if (message.type === "control_request") {
      let { request_id, request: request2 } = message, toolName = request2.subtype === "can_use_tool" ? request2.tool_name : "";
      return ` subtype=${request2.subtype} request_id=${request_id}${toolName ? ` tool=${toolName}` : ""}`;
    }
    if (message.type === "control_response") {
      let { subtype, request_id } = message.response;
      return ` subtype=${subtype} request_id=${request_id}`;
    }
    return "";
  }
  startPingInterval() {
    this.stopPingInterval(), this.pongReceived = !0;
    let lastTickTime = Date.now();
    this.pingInterval = setInterval(() => {
      if (this.state === "connected" && this.ws) {
        let now2 = Date.now(), gap = now2 - lastTickTime;
        if (lastTickTime = now2, gap > SLEEP_DETECTION_THRESHOLD_MS) {
          logForDebugging(`WebSocketTransport: ${Math.round(gap / 1000)}s tick gap detected \u2014 process was suspended, forcing reconnect`), logForDiagnosticsNoPII("info", "cli_websocket_sleep_detected_on_ping", { gapMs: gap }), this.handleConnectionError();
          return;
        }
        if (!this.pongReceived) {
          logForDebugging("WebSocketTransport: No pong received, connection appears dead", { level: "error" }), logForDiagnosticsNoPII("error", "cli_websocket_pong_timeout"), this.handleConnectionError();
          return;
        }
        this.pongReceived = !1;
        try {
          this.ws.ping?.();
        } catch (error44) {
          logForDebugging(`WebSocketTransport: Ping failed: ${error44}`, {
            level: "error"
          }), logForDiagnosticsNoPII("error", "cli_websocket_ping_failed");
        }
      }
    }, DEFAULT_PING_INTERVAL);
  }
  stopPingInterval() {
    if (this.pingInterval)
      clearInterval(this.pingInterval), this.pingInterval = null;
  }
  startKeepaliveInterval() {
    if (this.stopKeepaliveInterval(), isEnvTruthy(process.env.CLAUDE_CODE_REMOTE))
      return;
    this.keepAliveInterval = setInterval(() => {
      if (this.state === "connected" && this.ws)
        try {
          this.ws.send(KEEP_ALIVE_FRAME), this.lastActivityTime = Date.now(), logForDebugging("WebSocketTransport: Sent periodic keep_alive data frame");
        } catch (error44) {
          logForDebugging(`WebSocketTransport: Periodic keep_alive failed: ${error44}`, { level: "error" }), logForDiagnosticsNoPII("error", "cli_websocket_keepalive_failed");
        }
    }, DEFAULT_KEEPALIVE_INTERVAL);
  }
  stopKeepaliveInterval() {
    if (this.keepAliveInterval)
      clearInterval(this.keepAliveInterval), this.keepAliveInterval = null;
  }
}
var KEEP_ALIVE_FRAME = `{"type":"keep_alive"}
`, DEFAULT_MAX_BUFFER_SIZE = 1000, DEFAULT_BASE_RECONNECT_DELAY = 1000, DEFAULT_MAX_RECONNECT_DELAY = 30000, DEFAULT_RECONNECT_GIVE_UP_MS = 600000, DEFAULT_PING_INTERVAL = 1e4, DEFAULT_KEEPALIVE_INTERVAL = 300000, SLEEP_DETECTION_THRESHOLD_MS, PERMANENT_CLOSE_CODES2;
var init_WebSocketTransport = __esm(() => {
  init_debug();
  init_diagLogs();
  init_envUtils();
  init_mtls();
  init_proxy();
  init_sessionActivity();
  init_slowOperations();
  SLEEP_DETECTION_THRESHOLD_MS = DEFAULT_MAX_RECONNECT_DELAY * 2, PERMANENT_CLOSE_CODES2 = /* @__PURE__ */ new Set([
    1002,
    4001,
    4003
  ]);
});
