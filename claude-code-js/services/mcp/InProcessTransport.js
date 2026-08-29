// Original: src/services/mcp/InProcessTransport.ts
var exports_InProcessTransport = {};
__export(exports_InProcessTransport, {
  createLinkedTransportPair: () => createLinkedTransportPair
});

class InProcessTransport {
  peer;
  closed = !1;
  onclose;
  onerror;
  onmessage;
  _setPeer(peer) {
    this.peer = peer;
  }
  async start() {}
  async send(message) {
    if (this.closed)
      throw Error("Transport is closed");
    queueMicrotask(() => {
      this.peer?.onmessage?.(message);
    });
  }
  async close() {
    if (this.closed)
      return;
    if (this.closed = !0, this.onclose?.(), this.peer && !this.peer.closed)
      this.peer.closed = !0, this.peer.onclose?.();
  }
}
function createLinkedTransportPair() {
  let a2 = new InProcessTransport, b = new InProcessTransport;
  return a2._setPeer(b), b._setPeer(a2), [a2, b];
}
