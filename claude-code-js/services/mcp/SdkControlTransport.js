// Original: src/services/mcp/SdkControlTransport.ts
class SdkControlClientTransport {
  serverName;
  sendMcpMessage;
  isClosed = !1;
  onclose;
  onerror;
  onmessage;
  constructor(serverName, sendMcpMessage) {
    this.serverName = serverName;
    this.sendMcpMessage = sendMcpMessage;
  }
  async start() {}
  async send(message) {
    if (this.isClosed)
      throw Error("Transport is closed");
    let response7 = await this.sendMcpMessage(this.serverName, message);
    if (this.onmessage)
      this.onmessage(response7);
  }
  async close() {
    if (this.isClosed)
      return;
    this.isClosed = !0, this.onclose?.();
  }
}
