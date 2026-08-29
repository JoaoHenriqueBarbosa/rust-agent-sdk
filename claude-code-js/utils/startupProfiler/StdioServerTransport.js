// class: StdioServerTransport
class StdioServerTransport {
  constructor(_stdin = process2.stdin, _stdout = process2.stdout) {
    this._stdin = _stdin, this._stdout = _stdout, this._readBuffer = new ReadBuffer, this._started = !1, this._ondata = (chunk) => {
      this._readBuffer.append(chunk), this.processReadBuffer();
    }, this._onerror = (error41) => {
      this.onerror?.(error41);
    };
  }
  async start() {
    if (this._started)
      throw Error("StdioServerTransport already started! If using Server class, note that connect() calls start() automatically.");
    this._started = !0, this._stdin.on("data", this._ondata), this._stdin.on("error", this._onerror);
  }
  processReadBuffer() {
    while (!0)
      try {
        let message = this._readBuffer.readMessage();
        if (message === null)
          break;
        this.onmessage?.(message);
      } catch (error41) {
        this.onerror?.(error41);
      }
  }
  async close() {
    if (this._stdin.off("data", this._ondata), this._stdin.off("error", this._onerror), this._stdin.listenerCount("data") === 0)
      this._stdin.pause();
    this._readBuffer.clear(), this.onclose?.();
  }
  send(message) {
    return new Promise((resolve2) => {
      let json2 = serializeMessage(message);
      if (this._stdout.write(json2))
        resolve2();
      else
        this._stdout.once("drain", resolve2);
    });
  }
}
