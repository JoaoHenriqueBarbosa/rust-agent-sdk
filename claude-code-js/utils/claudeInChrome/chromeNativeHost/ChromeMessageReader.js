// class: ChromeMessageReader
class ChromeMessageReader {
  buffer = Buffer.alloc(0);
  pendingResolve = null;
  closed = !1;
  constructor() {
    process.stdin.on("data", (chunk2) => {
      this.buffer = Buffer.concat([this.buffer, chunk2]), this.tryProcessMessage();
    }), process.stdin.on("end", () => {
      if (this.closed = !0, this.pendingResolve)
        this.pendingResolve(null), this.pendingResolve = null;
    }), process.stdin.on("error", () => {
      if (this.closed = !0, this.pendingResolve)
        this.pendingResolve(null), this.pendingResolve = null;
    });
  }
  tryProcessMessage() {
    if (!this.pendingResolve)
      return;
    if (this.buffer.length < 4)
      return;
    let length = this.buffer.readUInt32LE(0);
    if (length === 0 || length > MAX_MESSAGE_SIZE) {
      log3(`Invalid message length: ${length}`), this.pendingResolve(null), this.pendingResolve = null;
      return;
    }
    if (this.buffer.length < 4 + length)
      return;
    let messageBytes = this.buffer.subarray(4, 4 + length);
    this.buffer = this.buffer.subarray(4 + length);
    let message = messageBytes.toString("utf-8");
    this.pendingResolve(message), this.pendingResolve = null;
  }
  async read() {
    if (this.closed)
      return null;
    if (this.buffer.length >= 4) {
      let length = this.buffer.readUInt32LE(0);
      if (length > 0 && length <= MAX_MESSAGE_SIZE && this.buffer.length >= 4 + length) {
        let messageBytes = this.buffer.subarray(4, 4 + length);
        return this.buffer = this.buffer.subarray(4 + length), messageBytes.toString("utf-8");
      }
    }
    return new Promise((resolve45) => {
      this.pendingResolve = resolve45, this.tryProcessMessage();
    });
  }
}
