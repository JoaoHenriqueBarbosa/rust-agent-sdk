// var: require_messageReader
var require_messageReader = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.ReadableStreamMessageReader = exports.AbstractMessageReader = exports.MessageReader = void 0;
  var ral_1 = require_ral(), Is = require_is(), events_1 = require_events(), semaphore_1 = require_semaphore(), MessageReader;
  (function(MessageReader2) {
    function is(value) {
      let candidate = value;
      return candidate && Is.func(candidate.listen) && Is.func(candidate.dispose) && Is.func(candidate.onError) && Is.func(candidate.onClose) && Is.func(candidate.onPartialMessage);
    }
    MessageReader2.is = is;
  })(MessageReader || (exports.MessageReader = MessageReader = {}));

  class AbstractMessageReader {
    constructor() {
      this.errorEmitter = new events_1.Emitter, this.closeEmitter = new events_1.Emitter, this.partialMessageEmitter = new events_1.Emitter;
    }
    dispose() {
      this.errorEmitter.dispose(), this.closeEmitter.dispose();
    }
    get onError() {
      return this.errorEmitter.event;
    }
    fireError(error44) {
      this.errorEmitter.fire(this.asError(error44));
    }
    get onClose() {
      return this.closeEmitter.event;
    }
    fireClose() {
      this.closeEmitter.fire(void 0);
    }
    get onPartialMessage() {
      return this.partialMessageEmitter.event;
    }
    firePartialMessage(info) {
      this.partialMessageEmitter.fire(info);
    }
    asError(error44) {
      if (error44 instanceof Error)
        return error44;
      else
        return Error(`Reader received error. Reason: ${Is.string(error44.message) ? error44.message : "unknown"}`);
    }
  }
  exports.AbstractMessageReader = AbstractMessageReader;
  var ResolvedMessageReaderOptions;
  (function(ResolvedMessageReaderOptions2) {
    function fromOptions(options2) {
      let charset, result, contentDecoder, contentDecoders = /* @__PURE__ */ new Map, contentTypeDecoder, contentTypeDecoders = /* @__PURE__ */ new Map;
      if (options2 === void 0 || typeof options2 === "string")
        charset = options2 ?? "utf-8";
      else {
        if (charset = options2.charset ?? "utf-8", options2.contentDecoder !== void 0)
          contentDecoder = options2.contentDecoder, contentDecoders.set(contentDecoder.name, contentDecoder);
        if (options2.contentDecoders !== void 0)
          for (let decoder of options2.contentDecoders)
            contentDecoders.set(decoder.name, decoder);
        if (options2.contentTypeDecoder !== void 0)
          contentTypeDecoder = options2.contentTypeDecoder, contentTypeDecoders.set(contentTypeDecoder.name, contentTypeDecoder);
        if (options2.contentTypeDecoders !== void 0)
          for (let decoder of options2.contentTypeDecoders)
            contentTypeDecoders.set(decoder.name, decoder);
      }
      if (contentTypeDecoder === void 0)
        contentTypeDecoder = (0, ral_1.default)().applicationJson.decoder, contentTypeDecoders.set(contentTypeDecoder.name, contentTypeDecoder);
      return { charset, contentDecoder, contentDecoders, contentTypeDecoder, contentTypeDecoders };
    }
    ResolvedMessageReaderOptions2.fromOptions = fromOptions;
  })(ResolvedMessageReaderOptions || (ResolvedMessageReaderOptions = {}));

  class ReadableStreamMessageReader extends AbstractMessageReader {
    constructor(readable2, options2) {
      super();
      this.readable = readable2, this.options = ResolvedMessageReaderOptions.fromOptions(options2), this.buffer = (0, ral_1.default)().messageBuffer.create(this.options.charset), this._partialMessageTimeout = 1e4, this.nextMessageLength = -1, this.messageToken = 0, this.readSemaphore = new semaphore_1.Semaphore(1);
    }
    set partialMessageTimeout(timeout) {
      this._partialMessageTimeout = timeout;
    }
    get partialMessageTimeout() {
      return this._partialMessageTimeout;
    }
    listen(callback) {
      this.nextMessageLength = -1, this.messageToken = 0, this.partialMessageTimer = void 0, this.callback = callback;
      let result = this.readable.onData((data) => {
        this.onData(data);
      });
      return this.readable.onError((error44) => this.fireError(error44)), this.readable.onClose(() => this.fireClose()), result;
    }
    onData(data) {
      try {
        this.buffer.append(data);
        while (!0) {
          if (this.nextMessageLength === -1) {
            let headers = this.buffer.tryReadHeaders(!0);
            if (!headers)
              return;
            let contentLength = headers.get("content-length");
            if (!contentLength) {
              this.fireError(Error(`Header must provide a Content-Length property.
${JSON.stringify(Object.fromEntries(headers))}`));
              return;
            }
            let length = parseInt(contentLength);
            if (isNaN(length)) {
              this.fireError(Error(`Content-Length value must be a number. Got ${contentLength}`));
              return;
            }
            this.nextMessageLength = length;
          }
          let body = this.buffer.tryReadBody(this.nextMessageLength);
          if (body === void 0) {
            this.setPartialMessageTimer();
            return;
          }
          this.clearPartialMessageTimer(), this.nextMessageLength = -1, this.readSemaphore.lock(async () => {
            let bytes = this.options.contentDecoder !== void 0 ? await this.options.contentDecoder.decode(body) : body, message = await this.options.contentTypeDecoder.decode(bytes, this.options);
            this.callback(message);
          }).catch((error44) => {
            this.fireError(error44);
          });
        }
      } catch (error44) {
        this.fireError(error44);
      }
    }
    clearPartialMessageTimer() {
      if (this.partialMessageTimer)
        this.partialMessageTimer.dispose(), this.partialMessageTimer = void 0;
    }
    setPartialMessageTimer() {
      if (this.clearPartialMessageTimer(), this._partialMessageTimeout <= 0)
        return;
      this.partialMessageTimer = (0, ral_1.default)().timer.setTimeout((token, timeout) => {
        if (this.partialMessageTimer = void 0, token === this.messageToken)
          this.firePartialMessage({ messageToken: token, waitingTime: timeout }), this.setPartialMessageTimer();
      }, this._partialMessageTimeout, this.messageToken, this._partialMessageTimeout);
    }
  }
  exports.ReadableStreamMessageReader = ReadableStreamMessageReader;
});
