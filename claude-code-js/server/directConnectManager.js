// Original: src/server/directConnectManager.ts
function isStdoutMessage(value) {
  return typeof value === "object" && value !== null && "type" in value && typeof value.type === "string";
}

class DirectConnectSessionManager {
  ws = null;
  config;
  callbacks;
  constructor(config11, callbacks) {
    this.config = config11, this.callbacks = callbacks;
  }
  connect() {
    let headers = {};
    if (this.config.authToken)
      headers.authorization = `Bearer ${this.config.authToken}`;
    this.ws = new WebSocket(this.config.wsUrl, {
      headers
    }), this.ws.addEventListener("open", () => {
      this.callbacks.onConnected?.();
    }), this.ws.addEventListener("message", (event) => {
      let lines2 = (typeof event.data === "string" ? event.data : "").split(`
`).filter((l3) => l3.trim());
      for (let line of lines2) {
        let raw;
        try {
          raw = jsonParse(line);
        } catch {
          continue;
        }
        if (!isStdoutMessage(raw))
          continue;
        let parsed = raw;
        if (parsed.type === "control_request") {
          if (parsed.request.subtype === "can_use_tool")
            this.callbacks.onPermissionRequest(parsed.request, parsed.request_id);
          else
            logForDebugging(`[DirectConnect] Unsupported control request subtype: ${parsed.request.subtype}`), this.sendErrorResponse(parsed.request_id, `Unsupported control request subtype: ${parsed.request.subtype}`);
          continue;
        }
        if (parsed.type !== "control_response" && parsed.type !== "keep_alive" && parsed.type !== "control_cancel_request" && parsed.type !== "streamlined_text" && parsed.type !== "streamlined_tool_use_summary" && !(parsed.type === "system" && parsed.subtype === "post_turn_summary"))
          this.callbacks.onMessage(parsed);
      }
    }), this.ws.addEventListener("close", () => {
      this.callbacks.onDisconnected?.();
    }), this.ws.addEventListener("error", () => {
      this.callbacks.onError?.(Error("WebSocket connection error"));
    });
  }
  sendMessage(content) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN)
      return !1;
    let message = jsonStringify({
      type: "user",
      message: {
        role: "user",
        content
      },
      parent_tool_use_id: null,
      session_id: ""
    });
    return this.ws.send(message), !0;
  }
  respondToPermissionRequest(requestId, result) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN)
      return;
    let response7 = jsonStringify({
      type: "control_response",
      response: {
        subtype: "success",
        request_id: requestId,
        response: {
          behavior: result.behavior,
          ...result.behavior === "allow" ? { updatedInput: result.updatedInput } : { message: result.message }
        }
      }
    });
    this.ws.send(response7);
  }
  sendInterrupt() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN)
      return;
    let request2 = jsonStringify({
      type: "control_request",
      request_id: crypto.randomUUID(),
      request: {
        subtype: "interrupt"
      }
    });
    this.ws.send(request2);
  }
  sendErrorResponse(requestId, error44) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN)
      return;
    let response7 = jsonStringify({
      type: "control_response",
      response: {
        subtype: "error",
        request_id: requestId,
        error: error44
      }
    });
    this.ws.send(response7);
  }
  disconnect() {
    if (this.ws)
      this.ws.close(), this.ws = null;
  }
  isConnected() {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}
var init_directConnectManager = __esm(() => {
  init_debug();
  init_slowOperations();
});
