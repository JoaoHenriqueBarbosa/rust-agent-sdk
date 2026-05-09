// var: require_ril
var require_ril = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  var util_1 = __require("util"), api_1 = require_api();

  class MessageBuffer extends api_1.AbstractMessageBuffer {
    constructor(encoding = "utf-8") {
      super(encoding);
    }
    emptyBuffer() {
      return MessageBuffer.emptyBuffer;
    }
    fromString(value, encoding) {
      return Buffer.from(value, encoding);
    }
    toString(value, encoding) {
      if (value instanceof Buffer)
        return value.toString(encoding);
      else
        return new util_1.TextDecoder(encoding).decode(value);
    }
    asNative(buffer, length) {
      if (length === void 0)
        return buffer instanceof Buffer ? buffer : Buffer.from(buffer);
      else
        return buffer instanceof Buffer ? buffer.slice(0, length) : Buffer.from(buffer, 0, length);
    }
    allocNative(length) {
      return Buffer.allocUnsafe(length);
    }
  }
  MessageBuffer.emptyBuffer = Buffer.allocUnsafe(0);

  class ReadableStreamWrapper {
    constructor(stream10) {
      this.stream = stream10;
    }
    onClose(listener2) {
      return this.stream.on("close", listener2), api_1.Disposable.create(() => this.stream.off("close", listener2));
    }
    onError(listener2) {
      return this.stream.on("error", listener2), api_1.Disposable.create(() => this.stream.off("error", listener2));
    }
    onEnd(listener2) {
      return this.stream.on("end", listener2), api_1.Disposable.create(() => this.stream.off("end", listener2));
    }
    onData(listener2) {
      return this.stream.on("data", listener2), api_1.Disposable.create(() => this.stream.off("data", listener2));
    }
  }

  class WritableStreamWrapper {
    constructor(stream10) {
      this.stream = stream10;
    }
    onClose(listener2) {
      return this.stream.on("close", listener2), api_1.Disposable.create(() => this.stream.off("close", listener2));
    }
    onError(listener2) {
      return this.stream.on("error", listener2), api_1.Disposable.create(() => this.stream.off("error", listener2));
    }
    onEnd(listener2) {
      return this.stream.on("end", listener2), api_1.Disposable.create(() => this.stream.off("end", listener2));
    }
    write(data, encoding) {
      return new Promise((resolve28, reject2) => {
        let callback = (error44) => {
          if (error44 === void 0 || error44 === null)
            resolve28();
          else
            reject2(error44);
        };
        if (typeof data === "string")
          this.stream.write(data, encoding, callback);
        else
          this.stream.write(data, callback);
      });
    }
    end() {
      this.stream.end();
    }
  }
  var _ril = Object.freeze({
    messageBuffer: Object.freeze({
      create: (encoding) => new MessageBuffer(encoding)
    }),
    applicationJson: Object.freeze({
      encoder: Object.freeze({
        name: "application/json",
        encode: (msg, options2) => {
          try {
            return Promise.resolve(Buffer.from(JSON.stringify(msg, void 0, 0), options2.charset));
          } catch (err2) {
            return Promise.reject(err2);
          }
        }
      }),
      decoder: Object.freeze({
        name: "application/json",
        decode: (buffer, options2) => {
          try {
            if (buffer instanceof Buffer)
              return Promise.resolve(JSON.parse(buffer.toString(options2.charset)));
            else
              return Promise.resolve(JSON.parse(new util_1.TextDecoder(options2.charset).decode(buffer)));
          } catch (err2) {
            return Promise.reject(err2);
          }
        }
      })
    }),
    stream: Object.freeze({
      asReadableStream: (stream10) => new ReadableStreamWrapper(stream10),
      asWritableStream: (stream10) => new WritableStreamWrapper(stream10)
    }),
    console,
    timer: Object.freeze({
      setTimeout(callback, ms, ...args) {
        let handle = setTimeout(callback, ms, ...args);
        return { dispose: () => clearTimeout(handle) };
      },
      setImmediate(callback, ...args) {
        let handle = setImmediate(callback, ...args);
        return { dispose: () => clearImmediate(handle) };
      },
      setInterval(callback, ms, ...args) {
        let handle = setInterval(callback, ms, ...args);
        return { dispose: () => clearInterval(handle) };
      }
    })
  });
  function RIL() {
    return _ril;
  }
  (function(RIL2) {
    function install() {
      api_1.RAL.install(_ril);
    }
    RIL2.install = install;
  })(RIL || (RIL = {}));
  exports.default = RIL;
});
