// var: init_MessageDecoderStream
var init_MessageDecoderStream = __esm(() => {
  MessageDecoderStream = class MessageDecoderStream {
    options;
    constructor(options) {
      this.options = options;
    }
    [Symbol.asyncIterator]() {
      return this.asyncIterator();
    }
    async* asyncIterator() {
      for await (let bytes of this.options.inputStream)
        yield this.options.decoder.decode(bytes);
    }
  };
});
