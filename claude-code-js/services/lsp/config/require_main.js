// var: require_main
var require_main = __commonJS((exports) => {
  var __createBinding2 = exports && exports.__createBinding || (Object.create ? function(o5, m4, k3, k22) {
    if (k22 === void 0)
      k22 = k3;
    var desc = Object.getOwnPropertyDescriptor(m4, k3);
    if (!desc || ("get" in desc ? !m4.__esModule : desc.writable || desc.configurable))
      desc = { enumerable: !0, get: function() {
        return m4[k3];
      } };
    Object.defineProperty(o5, k22, desc);
  } : function(o5, m4, k3, k22) {
    if (k22 === void 0)
      k22 = k3;
    o5[k22] = m4[k3];
  }), __exportStar2 = exports && exports.__exportStar || function(m4, exports2) {
    for (var p4 in m4)
      if (p4 !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p4))
        __createBinding2(exports2, m4, p4);
  };
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.createMessageConnection = exports.createServerSocketTransport = exports.createClientSocketTransport = exports.createServerPipeTransport = exports.createClientPipeTransport = exports.generateRandomPipeName = exports.StreamMessageWriter = exports.StreamMessageReader = exports.SocketMessageWriter = exports.SocketMessageReader = exports.PortMessageWriter = exports.PortMessageReader = exports.IPCMessageWriter = exports.IPCMessageReader = void 0;
  var ril_1 = require_ril();
  ril_1.default.install();
  var path17 = __require("path"), os6 = __require("os"), crypto_1 = __require("crypto"), net_1 = __require("net"), api_1 = require_api();
  __exportStar2(require_api(), exports);

  class IPCMessageReader extends api_1.AbstractMessageReader {
    constructor(process23) {
      super();
      this.process = process23;
      let eventEmitter = this.process;
      eventEmitter.on("error", (error44) => this.fireError(error44)), eventEmitter.on("close", () => this.fireClose());
    }
    listen(callback) {
      return this.process.on("message", callback), api_1.Disposable.create(() => this.process.off("message", callback));
    }
  }
  exports.IPCMessageReader = IPCMessageReader;

  class IPCMessageWriter extends api_1.AbstractMessageWriter {
    constructor(process23) {
      super();
      this.process = process23, this.errorCount = 0;
      let eventEmitter = this.process;
      eventEmitter.on("error", (error44) => this.fireError(error44)), eventEmitter.on("close", () => this.fireClose);
    }
    write(msg) {
      try {
        if (typeof this.process.send === "function")
          this.process.send(msg, void 0, void 0, (error44) => {
            if (error44)
              this.errorCount++, this.handleError(error44, msg);
            else
              this.errorCount = 0;
          });
        return Promise.resolve();
      } catch (error44) {
        return this.handleError(error44, msg), Promise.reject(error44);
      }
    }
    handleError(error44, msg) {
      this.errorCount++, this.fireError(error44, msg, this.errorCount);
    }
    end() {}
  }
  exports.IPCMessageWriter = IPCMessageWriter;

  class PortMessageReader extends api_1.AbstractMessageReader {
    constructor(port) {
      super();
      this.onData = new api_1.Emitter, port.on("close", () => this.fireClose), port.on("error", (error44) => this.fireError(error44)), port.on("message", (message) => {
        this.onData.fire(message);
      });
    }
    listen(callback) {
      return this.onData.event(callback);
    }
  }
  exports.PortMessageReader = PortMessageReader;

  class PortMessageWriter extends api_1.AbstractMessageWriter {
    constructor(port) {
      super();
      this.port = port, this.errorCount = 0, port.on("close", () => this.fireClose()), port.on("error", (error44) => this.fireError(error44));
    }
    write(msg) {
      try {
        return this.port.postMessage(msg), Promise.resolve();
      } catch (error44) {
        return this.handleError(error44, msg), Promise.reject(error44);
      }
    }
    handleError(error44, msg) {
      this.errorCount++, this.fireError(error44, msg, this.errorCount);
    }
    end() {}
  }
  exports.PortMessageWriter = PortMessageWriter;

  class SocketMessageReader extends api_1.ReadableStreamMessageReader {
    constructor(socket, encoding = "utf-8") {
      super((0, ril_1.default)().stream.asReadableStream(socket), encoding);
    }
  }
  exports.SocketMessageReader = SocketMessageReader;

  class SocketMessageWriter extends api_1.WriteableStreamMessageWriter {
    constructor(socket, options2) {
      super((0, ril_1.default)().stream.asWritableStream(socket), options2);
      this.socket = socket;
    }
    dispose() {
      super.dispose(), this.socket.destroy();
    }
  }
  exports.SocketMessageWriter = SocketMessageWriter;

  class StreamMessageReader extends api_1.ReadableStreamMessageReader {
    constructor(readable2, encoding) {
      super((0, ril_1.default)().stream.asReadableStream(readable2), encoding);
    }
  }
  exports.StreamMessageReader = StreamMessageReader;

  class StreamMessageWriter extends api_1.WriteableStreamMessageWriter {
    constructor(writable2, options2) {
      super((0, ril_1.default)().stream.asWritableStream(writable2), options2);
    }
  }
  exports.StreamMessageWriter = StreamMessageWriter;
  var XDG_RUNTIME_DIR = process.env.XDG_RUNTIME_DIR, safeIpcPathLengths = /* @__PURE__ */ new Map([
    ["linux", 107],
    ["darwin", 103]
  ]);
  function generateRandomPipeName() {
    let randomSuffix = (0, crypto_1.randomBytes)(21).toString("hex");
    if (process.platform === "win32")
      return `\\\\.\\pipe\\vscode-jsonrpc-${randomSuffix}-sock`;
    let result;
    if (XDG_RUNTIME_DIR)
      result = path17.join(XDG_RUNTIME_DIR, `vscode-ipc-${randomSuffix}.sock`);
    else
      result = path17.join(os6.tmpdir(), `vscode-${randomSuffix}.sock`);
    let limit = safeIpcPathLengths.get(process.platform);
    if (limit !== void 0 && result.length > limit)
      (0, ril_1.default)().console.warn(`WARNING: IPC handle "${result}" is longer than ${limit} characters.`);
    return result;
  }
  exports.generateRandomPipeName = generateRandomPipeName;
  function createClientPipeTransport(pipeName, encoding = "utf-8") {
    let connectResolve, connected = new Promise((resolve28, _reject) => {
      connectResolve = resolve28;
    });
    return new Promise((resolve28, reject2) => {
      let server = (0, net_1.createServer)((socket) => {
        server.close(), connectResolve([
          new SocketMessageReader(socket, encoding),
          new SocketMessageWriter(socket, encoding)
        ]);
      });
      server.on("error", reject2), server.listen(pipeName, () => {
        server.removeListener("error", reject2), resolve28({
          onConnected: () => {
            return connected;
          }
        });
      });
    });
  }
  exports.createClientPipeTransport = createClientPipeTransport;
  function createServerPipeTransport(pipeName, encoding = "utf-8") {
    let socket = (0, net_1.createConnection)(pipeName);
    return [
      new SocketMessageReader(socket, encoding),
      new SocketMessageWriter(socket, encoding)
    ];
  }
  exports.createServerPipeTransport = createServerPipeTransport;
  function createClientSocketTransport(port, encoding = "utf-8") {
    let connectResolve, connected = new Promise((resolve28, _reject) => {
      connectResolve = resolve28;
    });
    return new Promise((resolve28, reject2) => {
      let server = (0, net_1.createServer)((socket) => {
        server.close(), connectResolve([
          new SocketMessageReader(socket, encoding),
          new SocketMessageWriter(socket, encoding)
        ]);
      });
      server.on("error", reject2), server.listen(port, "127.0.0.1", () => {
        server.removeListener("error", reject2), resolve28({
          onConnected: () => {
            return connected;
          }
        });
      });
    });
  }
  exports.createClientSocketTransport = createClientSocketTransport;
  function createServerSocketTransport(port, encoding = "utf-8") {
    let socket = (0, net_1.createConnection)(port, "127.0.0.1");
    return [
      new SocketMessageReader(socket, encoding),
      new SocketMessageWriter(socket, encoding)
    ];
  }
  exports.createServerSocketTransport = createServerSocketTransport;
  function isReadableStream5(value) {
    let candidate = value;
    return candidate.read !== void 0 && candidate.addListener !== void 0;
  }
  function isWritableStream3(value) {
    let candidate = value;
    return candidate.write !== void 0 && candidate.addListener !== void 0;
  }
  function createMessageConnection(input, output, logger34, options2) {
    if (!logger34)
      logger34 = api_1.NullLogger;
    let reader = isReadableStream5(input) ? new StreamMessageReader(input) : input, writer = isWritableStream3(output) ? new StreamMessageWriter(output) : output;
    if (api_1.ConnectionStrategy.is(options2))
      options2 = { connectionStrategy: options2 };
    return (0, api_1.createMessageConnection)(reader, writer, logger34, options2);
  }
  exports.createMessageConnection = createMessageConnection;
});
