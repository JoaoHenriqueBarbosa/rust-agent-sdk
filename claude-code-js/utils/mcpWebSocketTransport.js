// Original: src/utils/mcpWebSocketTransport.ts
class WebSocketTransport {
  ws;
  started = !1;
  opened;
  isBun = typeof Bun < "u";
  constructor(ws) {
    this.ws = ws;
    if (this.opened = new Promise((resolve25, reject2) => {
      if (this.ws.readyState === WS_OPEN)
        resolve25();
      else if (this.isBun) {
        let nws = this.ws, onOpen = () => {
          nws.removeEventListener("open", onOpen), nws.removeEventListener("error", onError), resolve25();
        }, onError = (event) => {
          nws.removeEventListener("open", onOpen), nws.removeEventListener("error", onError), logForDiagnosticsNoPII("error", "mcp_websocket_connect_fail"), reject2(event);
        };
        nws.addEventListener("open", onOpen), nws.addEventListener("error", onError);
      } else {
        let nws = this.ws;
        nws.on("open", () => {
          resolve25();
        }), nws.on("error", (error44) => {
          logForDiagnosticsNoPII("error", "mcp_websocket_connect_fail"), reject2(error44);
        });
      }
    }), this.isBun) {
      let nws = this.ws;
      nws.addEventListener("message", this.onBunMessage), nws.addEventListener("error", this.onBunError), nws.addEventListener("close", this.onBunClose);
    } else {
      let nws = this.ws;
      nws.on("message", this.onNodeMessage), nws.on("error", this.onNodeError), nws.on("close", this.onNodeClose);
    }
  }
  onclose;
  onerror;
  onmessage;
  onBunMessage = (event) => {
    try {
      let data = typeof event.data === "string" ? event.data : String(event.data), messageObj = jsonParse(data), message = JSONRPCMessageSchema.parse(messageObj);
      this.onmessage?.(message);
    } catch (error44) {
      this.handleError(error44);
    }
  };
  onBunError = () => {
    this.handleError(Error("WebSocket error"));
  };
  onBunClose = () => {
    this.handleCloseCleanup();
  };
  onNodeMessage = (data) => {
    try {
      let messageObj = jsonParse(data.toString("utf-8")), message = JSONRPCMessageSchema.parse(messageObj);
      this.onmessage?.(message);
    } catch (error44) {
      this.handleError(error44);
    }
  };
  onNodeError = (error44) => {
    this.handleError(error44);
  };
  onNodeClose = () => {
    this.handleCloseCleanup();
  };
  handleError(error44) {
    logForDiagnosticsNoPII("error", "mcp_websocket_message_fail"), this.onerror?.(toError(error44));
  }
  handleCloseCleanup() {
    if (this.onclose?.(), this.isBun) {
      let nws = this.ws;
      nws.removeEventListener("message", this.onBunMessage), nws.removeEventListener("error", this.onBunError), nws.removeEventListener("close", this.onBunClose);
    } else {
      let nws = this.ws;
      nws.off("message", this.onNodeMessage), nws.off("error", this.onNodeError), nws.off("close", this.onNodeClose);
    }
  }
  async start() {
    if (this.started)
      throw Error("Start can only be called once per transport.");
    if (await this.opened, this.ws.readyState !== WS_OPEN)
      throw logForDiagnosticsNoPII("error", "mcp_websocket_start_not_opened"), Error("WebSocket is not open. Cannot start transport.");
    this.started = !0;
  }
  async close() {
    if (this.ws.readyState === WS_OPEN || this.ws.readyState === WS_CONNECTING)
      this.ws.close();
    this.handleCloseCleanup();
  }
  async send(message) {
    if (this.ws.readyState !== WS_OPEN)
      throw logForDiagnosticsNoPII("error", "mcp_websocket_send_not_opened"), Error("WebSocket is not open. Cannot send message.");
    let json2 = jsonStringify(message);
    try {
      if (this.isBun)
        this.ws.send(json2);
      else
        await new Promise((resolve25, reject2) => {
          this.ws.send(json2, (error44) => {
            if (error44)
              reject2(error44);
            else
              resolve25();
          });
        });
    } catch (error44) {
      throw this.handleError(error44), error44;
    }
  }
}
var WS_CONNECTING = 0, WS_OPEN = 1;
var init_mcpWebSocketTransport = __esm(() => {
  init_types();
  init_diagLogs();
  init_errors();
  init_slowOperations();
});
