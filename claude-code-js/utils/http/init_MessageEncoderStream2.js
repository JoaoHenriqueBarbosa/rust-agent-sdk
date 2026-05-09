// var: init_MessageEncoderStream2
var init_MessageEncoderStream2 = __esm(() => {
  MessageEncoderStream3 = class MessageEncoderStream3 {
    constructor(options) {
      this.options = options;
    }
    [Symbol.asyncIterator]() {
      return this.asyncIterator();
    }
    async* asyncIterator() {
      for await (let msg of this.options.messageStream)
        yield this.options.encoder.encode(msg);
      if (this.options.includeEndFrame)
        yield new Uint8Array(0);
    }
  };
});
