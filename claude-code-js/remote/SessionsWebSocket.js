// Original: src/remote/SessionsWebSocket.ts
import { randomUUID as randomUUID34 } from "crypto";
function isSessionsMessage(value) {
  if (typeof value !== "object" || value === null || !("type" in value))
    return !1;
  return typeof value.type === "string";
}

class SessionsWebSocket {
  sessionId;
  orgUuid;
  getAccessToken;
  callbacks;
  ws = null;
  state = "closed";
  reconnectAttempts = 0;
  sessionNotFoundRetries = 0;
  pingInterval = null;
  reconnectTimer = null;
  constructor(sessionId, orgUuid, getAccessToken, callbacks) {
    this.sessionId = sessionId;
    this.orgUuid = orgUuid;
    this.getAccessToken = getAccessToken;
    this.callbacks = callbacks;
  }
  async connect() {
    if (this.state === "connecting") {
      logForDebugging("[SessionsWebSocket] Already connecting");
      return;
    }
    this.state = "connecting";
    let url3 = `${getOauthConfig().BASE_API_URL.replace("https://", "wss://")}/v1/sessions/ws/${this.sessionId}/subscribe?organization_uuid=${this.orgUuid}`;
    logForDebugging(`[SessionsWebSocket] Connecting to ${url3}`);
    let headers = {
      Authorization: `Bearer ${this.getAccessToken()}`,
      "anthropic-version": "2023-06-01"
    };
    if (typeof Bun < "u") {
      let ws = new globalThis.WebSocket(url3, {
        headers,
        proxy: getWebSocketProxyUrl(url3),
        tls: getWebSocketTLSOptions() || void 0
      });
      this.ws = ws, ws.addEventListener("open", () => {
        logForDebugging("[SessionsWebSocket] Connection opened, authenticated via headers"), this.state = "connected", this.reconnectAttempts = 0, this.sessionNotFoundRetries = 0, this.startPingInterval(), this.callbacks.onConnected?.();
      }), ws.addEventListener("message", (event) => {
        let data = typeof event.data === "string" ? event.data : String(event.data);
        this.handleMessage(data);
      }), ws.addEventListener("error", () => {
        let err2 = Error("[SessionsWebSocket] WebSocket error");
        logError2(err2), this.callbacks.onError?.(err2);
      }), ws.addEventListener("close", (event) => {
        logForDebugging(`[SessionsWebSocket] Closed: code=${event.code} reason=${event.reason}`), this.handleClose(event.code);
      }), ws.addEventListener("pong", () => {
        logForDebugging("[SessionsWebSocket] Pong received");
      });
    } else {
      let { default: WS } = await import("ws"), ws = new WS(url3, {
        headers,
        agent: getWebSocketProxyAgent(url3),
        ...getWebSocketTLSOptions()
      });
      this.ws = ws, ws.on("open", () => {
        logForDebugging("[SessionsWebSocket] Connection opened, authenticated via headers"), this.state = "connected", this.reconnectAttempts = 0, this.sessionNotFoundRetries = 0, this.startPingInterval(), this.callbacks.onConnected?.();
      }), ws.on("message", (data) => {
        this.handleMessage(data.toString());
      }), ws.on("error", (err2) => {
        logError2(Error(`[SessionsWebSocket] Error: ${err2.message}`)), this.callbacks.onError?.(err2);
      }), ws.on("close", (code, reason) => {
        logForDebugging(`[SessionsWebSocket] Closed: code=${code} reason=${reason.toString()}`), this.handleClose(code);
      }), ws.on("pong", () => {
        logForDebugging("[SessionsWebSocket] Pong received");
      });
    }
  }
  handleMessage(data) {
    try {
      let message = jsonParse(data);
      if (isSessionsMessage(message))
        this.callbacks.onMessage(message);
      else
        logForDebugging(`[SessionsWebSocket] Ignoring message type: ${typeof message === "object" && message !== null && "type" in message ? String(message.type) : "unknown"}`);
    } catch (error44) {
      logError2(Error(`[SessionsWebSocket] Failed to parse message: ${errorMessage(error44)}`));
    }
  }
  handleClose(closeCode) {
    if (this.stopPingInterval(), this.state === "closed")
      return;
    this.ws = null;
    let previousState = this.state;
    if (this.state = "closed", PERMANENT_CLOSE_CODES.has(closeCode)) {
      logForDebugging(`[SessionsWebSocket] Permanent close code ${closeCode}, not reconnecting`), this.callbacks.onClose?.();
      return;
    }
    if (closeCode === 4001) {
      if (this.sessionNotFoundRetries++, this.sessionNotFoundRetries > MAX_SESSION_NOT_FOUND_RETRIES) {
        logForDebugging(`[SessionsWebSocket] 4001 retry budget exhausted (${MAX_SESSION_NOT_FOUND_RETRIES}), not reconnecting`), this.callbacks.onClose?.();
        return;
      }
      this.scheduleReconnect(RECONNECT_DELAY_MS * this.sessionNotFoundRetries, `4001 attempt ${this.sessionNotFoundRetries}/${MAX_SESSION_NOT_FOUND_RETRIES}`);
      return;
    }
    if (previousState === "connected" && this.reconnectAttempts < MAX_RECONNECT_ATTEMPTS2)
      this.reconnectAttempts++, this.scheduleReconnect(RECONNECT_DELAY_MS, `attempt ${this.reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS2}`);
    else
      logForDebugging("[SessionsWebSocket] Not reconnecting"), this.callbacks.onClose?.();
  }
  scheduleReconnect(delay4, label) {
    this.callbacks.onReconnecting?.(), logForDebugging(`[SessionsWebSocket] Scheduling reconnect (${label}) in ${delay4}ms`), this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null, this.connect();
    }, delay4);
  }
  startPingInterval() {
    this.stopPingInterval(), this.pingInterval = setInterval(() => {
      if (this.ws && this.state === "connected")
        try {
          this.ws.ping?.();
        } catch {}
    }, PING_INTERVAL_MS2);
  }
  stopPingInterval() {
    if (this.pingInterval)
      clearInterval(this.pingInterval), this.pingInterval = null;
  }
  sendControlResponse(response7) {
    if (!this.ws || this.state !== "connected") {
      logError2(Error("[SessionsWebSocket] Cannot send: not connected"));
      return;
    }
    logForDebugging("[SessionsWebSocket] Sending control response"), this.ws.send(jsonStringify(response7));
  }
  sendControlRequest(request2) {
    if (!this.ws || this.state !== "connected") {
      logError2(Error("[SessionsWebSocket] Cannot send: not connected"));
      return;
    }
    let controlRequest = {
      type: "control_request",
      request_id: randomUUID34(),
      request: request2
    };
    logForDebugging(`[SessionsWebSocket] Sending control request: ${request2.subtype}`), this.ws.send(jsonStringify(controlRequest));
  }
  isConnected() {
    return this.state === "connected";
  }
  close() {
    if (logForDebugging("[SessionsWebSocket] Closing connection"), this.state = "closed", this.stopPingInterval(), this.reconnectTimer)
      clearTimeout(this.reconnectTimer), this.reconnectTimer = null;
    if (this.ws)
      this.ws.close(), this.ws = null;
  }
  reconnect() {
    logForDebugging("[SessionsWebSocket] Force reconnecting"), this.reconnectAttempts = 0, this.sessionNotFoundRetries = 0, this.close(), this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null, this.connect();
    }, 500);
  }
}
var RECONNECT_DELAY_MS = 2000, MAX_RECONNECT_ATTEMPTS2 = 5, PING_INTERVAL_MS2 = 30000, MAX_SESSION_NOT_FOUND_RETRIES = 3, PERMANENT_CLOSE_CODES;
var init_SessionsWebSocket = __esm(() => {
  init_oauth();
  init_debug();
  init_errors();
  init_log3();
  init_mtls();
  init_proxy();
  init_slowOperations();
  PERMANENT_CLOSE_CODES = /* @__PURE__ */ new Set([
    4003
  ]);
});
