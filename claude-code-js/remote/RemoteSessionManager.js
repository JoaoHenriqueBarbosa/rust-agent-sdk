// Original: src/remote/RemoteSessionManager.ts
function isSDKMessage(message) {
  return message.type !== "control_request" && message.type !== "control_response" && message.type !== "control_cancel_request";
}

class RemoteSessionManager {
  config;
  callbacks;
  websocket = null;
  pendingPermissionRequests = /* @__PURE__ */ new Map;
  constructor(config11, callbacks) {
    this.config = config11;
    this.callbacks = callbacks;
  }
  connect() {
    logForDebugging(`[RemoteSessionManager] Connecting to session ${this.config.sessionId}`);
    let wsCallbacks = {
      onMessage: (message) => this.handleMessage(message),
      onConnected: () => {
        logForDebugging("[RemoteSessionManager] Connected"), this.callbacks.onConnected?.();
      },
      onClose: () => {
        logForDebugging("[RemoteSessionManager] Disconnected"), this.callbacks.onDisconnected?.();
      },
      onReconnecting: () => {
        logForDebugging("[RemoteSessionManager] Reconnecting"), this.callbacks.onReconnecting?.();
      },
      onError: (error44) => {
        logError2(error44), this.callbacks.onError?.(error44);
      }
    };
    this.websocket = new SessionsWebSocket(this.config.sessionId, this.config.orgUuid, this.config.getAccessToken, wsCallbacks), this.websocket.connect();
  }
  handleMessage(message) {
    if (message.type === "control_request") {
      this.handleControlRequest(message);
      return;
    }
    if (message.type === "control_cancel_request") {
      let { request_id } = message, pendingRequest = this.pendingPermissionRequests.get(request_id);
      logForDebugging(`[RemoteSessionManager] Permission request cancelled: ${request_id}`), this.pendingPermissionRequests.delete(request_id), this.callbacks.onPermissionCancelled?.(request_id, pendingRequest?.tool_use_id);
      return;
    }
    if (message.type === "control_response") {
      logForDebugging("[RemoteSessionManager] Received control response");
      return;
    }
    if (isSDKMessage(message))
      this.callbacks.onMessage(message);
  }
  handleControlRequest(request2) {
    let { request_id, request: inner } = request2;
    if (inner.subtype === "can_use_tool")
      logForDebugging(`[RemoteSessionManager] Permission request for tool: ${inner.tool_name}`), this.pendingPermissionRequests.set(request_id, inner), this.callbacks.onPermissionRequest(inner, request_id);
    else {
      logForDebugging(`[RemoteSessionManager] Unsupported control request subtype: ${inner.subtype}`);
      let response7 = {
        type: "control_response",
        response: {
          subtype: "error",
          request_id,
          error: `Unsupported control request subtype: ${inner.subtype}`
        }
      };
      this.websocket?.sendControlResponse(response7);
    }
  }
  async sendMessage(content, opts) {
    logForDebugging(`[RemoteSessionManager] Sending message to session ${this.config.sessionId}`);
    let success2 = await sendEventToRemoteSession(this.config.sessionId, content, opts);
    if (!success2)
      logError2(Error(`[RemoteSessionManager] Failed to send message to session ${this.config.sessionId}`));
    return success2;
  }
  respondToPermissionRequest(requestId, result) {
    if (!this.pendingPermissionRequests.get(requestId)) {
      logError2(Error(`[RemoteSessionManager] No pending permission request with ID: ${requestId}`));
      return;
    }
    this.pendingPermissionRequests.delete(requestId);
    let response7 = {
      type: "control_response",
      response: {
        subtype: "success",
        request_id: requestId,
        response: {
          behavior: result.behavior,
          ...result.behavior === "allow" ? { updatedInput: result.updatedInput } : { message: result.message }
        }
      }
    };
    logForDebugging(`[RemoteSessionManager] Sending permission response: ${result.behavior}`), this.websocket?.sendControlResponse(response7);
  }
  isConnected() {
    return this.websocket?.isConnected() ?? !1;
  }
  cancelSession() {
    logForDebugging("[RemoteSessionManager] Sending interrupt signal"), this.websocket?.sendControlRequest({ subtype: "interrupt" });
  }
  getSessionId() {
    return this.config.sessionId;
  }
  disconnect() {
    logForDebugging("[RemoteSessionManager] Disconnecting"), this.websocket?.close(), this.websocket = null, this.pendingPermissionRequests.clear();
  }
  reconnect() {
    logForDebugging("[RemoteSessionManager] Reconnecting WebSocket"), this.websocket?.reconnect();
  }
}
function createRemoteSessionConfig(sessionId, getAccessToken, orgUuid, hasInitialPrompt = !1, viewerOnly = !1) {
  return {
    sessionId,
    getAccessToken,
    orgUuid,
    hasInitialPrompt,
    viewerOnly
  };
}
var init_RemoteSessionManager = __esm(() => {
  init_debug();
  init_log3();
  init_api2();
  init_SessionsWebSocket();
});
