// var: require_messageWriter
var require_messageWriter = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.WriteableStreamMessageWriter = exports.AbstractMessageWriter = exports.MessageWriter = void 0;
  var ral_1 = require_ral(), Is = require_is(), semaphore_1 = require_semaphore(), events_1 = require_events(), ContentLength = "Content-Length: ", CRLF2 = `\r
`, MessageWriter;
  (function(MessageWriter2) {
    function is(value) {
      let candidate = value;
      return candidate && Is.func(candidate.dispose) && Is.func(candidate.onClose) && Is.func(candidate.onError) && Is.func(candidate.write);
    }
    MessageWriter2.is = is;
  })(MessageWriter || (exports.MessageWriter = MessageWriter = {}));

  class AbstractMessageWriter {
    constructor() {
      this.errorEmitter = new events_1.Emitter, this.closeEmitter = new events_1.Emitter;
    }
    dispose() {
      this.errorEmitter.dispose(), this.closeEmitter.dispose();
    }
    get onError() {
      return this.errorEmitter.event;
    }
    fireError(error44, message, count3) {
      this.errorEmitter.fire([this.asError(error44), message, count3]);
    }
    get onClose() {
      return this.closeEmitter.event;
    }
    fireClose() {
      this.closeEmitter.fire(void 0);
    }
    asError(error44) {
      if (error44 instanceof Error)
        return error44;
      else
        return Error(`Writer received error. Reason: ${Is.string(error44.message) ? error44.message : "unknown"}`);
    }
  }
  exports.AbstractMessageWriter = AbstractMessageWriter;
  var ResolvedMessageWriterOptions;
  (function(ResolvedMessageWriterOptions2) {
    function fromOptions(options2) {
      if (options2 === void 0 || typeof options2 === "string")
        return { charset: options2 ?? "utf-8", contentTypeEncoder: (0, ral_1.default)().applicationJson.encoder };
      else
        return { charset: options2.charset ?? "utf-8", contentEncoder: options2.contentEncoder, contentTypeEncoder: options2.contentTypeEncoder ?? (0, ral_1.default)().applicationJson.encoder };
    }
    ResolvedMessageWriterOptions2.fromOptions = fromOptions;
  })(ResolvedMessageWriterOptions || (ResolvedMessageWriterOptions = {}));

  class WriteableStreamMessageWriter extends AbstractMessageWriter {
    constructor(writable2, options2) {
      super();
      this.writable = writable2, this.options = ResolvedMessageWriterOptions.fromOptions(options2), this.errorCount = 0, this.writeSemaphore = new semaphore_1.Semaphore(1), this.writable.onError((error44) => this.fireError(error44)), this.writable.onClose(() => this.fireClose());
    }
    async write(msg) {
      return this.writeSemaphore.lock(async () => {
        return this.options.contentTypeEncoder.encode(msg, this.options).then((buffer) => {
          if (this.options.contentEncoder !== void 0)
            return this.options.contentEncoder.encode(buffer);
          else
            return buffer;
        }).then((buffer) => {
          let headers = [];
          return headers.push(ContentLength, buffer.byteLength.toString(), CRLF2), headers.push(CRLF2), this.doWrite(msg, headers, buffer);
        }, (error44) => {
          throw this.fireError(error44), error44;
        });
      });
    }
    async doWrite(msg, headers, data) {
      try {
        return await this.writable.write(headers.join(""), "ascii"), this.writable.write(data);
      } catch (error44) {
        return this.handleError(error44, msg), Promise.reject(error44);
      }
    }
    handleError(error44, msg) {
      this.errorCount++, this.fireError(error44, msg, this.errorCount);
    }
    end() {
      this.writable.end();
    }
  }
  exports.WriteableStreamMessageWriter = WriteableStreamMessageWriter;
});
