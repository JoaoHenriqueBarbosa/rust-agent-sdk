// var: init_MessageDecoderStream2
var init_MessageDecoderStream2 = __esm(() => {
  MessageDecoderStream3 = class MessageDecoderStream3 {
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
