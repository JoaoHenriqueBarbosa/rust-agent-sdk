// var: init_SmithyMessageDecoderStream
var init_SmithyMessageDecoderStream = __esm(() => {
  SmithyMessageDecoderStream = class SmithyMessageDecoderStream {
    options;
    constructor(options) {
      this.options = options;
    }
    [Symbol.asyncIterator]() {
      return this.asyncIterator();
    }
    async* asyncIterator() {
      for await (let message of this.options.messageStream) {
        let deserialized = await this.options.deserializer(message);
        if (deserialized === void 0)
          continue;
        yield deserialized;
      }
    }
  };
});
