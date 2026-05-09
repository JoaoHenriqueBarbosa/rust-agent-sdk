// class: StdioClientTransport
class StdioClientTransport {
  constructor(server) {
    if (this._readBuffer = new ReadBuffer, this._stderrStream = null, this._serverParams = server, server.stderr === "pipe" || server.stderr === "overlapped")
      this._stderrStream = new PassThrough3;
  }
  async start() {
    if (this._process)
      throw Error("StdioClientTransport already started! If using Client class, note that connect() calls start() automatically.");
    return new Promise((resolve24, reject2) => {
      if (this._process = import_cross_spawn2.default(this._serverParams.command, this._serverParams.args ?? [], {
        env: {
          ...getDefaultEnvironment(),
          ...this._serverParams.env
        },
        stdio: ["pipe", "pipe", this._serverParams.stderr ?? "inherit"],
        shell: !1,
        windowsHide: process22.platform === "win32",
        cwd: this._serverParams.cwd
      }), this._process.on("error", (error44) => {
        reject2(error44), this.onerror?.(error44);
      }), this._process.on("spawn", () => {
        resolve24();
      }), this._process.on("close", (_code) => {
        this._process = void 0, this.onclose?.();
      }), this._process.stdin?.on("error", (error44) => {
        this.onerror?.(error44);
      }), this._process.stdout?.on("data", (chunk) => {
        this._readBuffer.append(chunk), this.processReadBuffer();
      }), this._process.stdout?.on("error", (error44) => {
        this.onerror?.(error44);
      }), this._stderrStream && this._process.stderr)
        this._process.stderr.pipe(this._stderrStream);
    });
  }
  get stderr() {
    if (this._stderrStream)
      return this._stderrStream;
    return this._process?.stderr ?? null;
  }
  get pid() {
    return this._process?.pid ?? null;
  }
  processReadBuffer() {
    while (!0)
      try {
        let message = this._readBuffer.readMessage();
        if (message === null)
          break;
        this.onmessage?.(message);
      } catch (error44) {
        this.onerror?.(error44);
      }
  }
  async close() {
    if (this._process) {
      let processToClose = this._process;
      this._process = void 0;
      let closePromise = new Promise((resolve24) => {
        processToClose.once("close", () => {
          resolve24();
        });
      });
      try {
        processToClose.stdin?.end();
      } catch {}
      if (await Promise.race([closePromise, new Promise((resolve24) => setTimeout(resolve24, 2000).unref())]), processToClose.exitCode === null) {
        try {
          processToClose.kill("SIGTERM");
        } catch {}
        await Promise.race([closePromise, new Promise((resolve24) => setTimeout(resolve24, 2000).unref())]);
      }
      if (processToClose.exitCode === null)
        try {
          processToClose.kill("SIGKILL");
        } catch {}
    }
    this._readBuffer.clear();
  }
  send(message) {
    return new Promise((resolve24) => {
      if (!this._process?.stdin)
        throw Error("Not connected");
      let json2 = serializeMessage(message);
      if (this._process.stdin.write(json2))
        resolve24();
      else
        this._process.stdin.once("drain", resolve24);
    });
  }
}
