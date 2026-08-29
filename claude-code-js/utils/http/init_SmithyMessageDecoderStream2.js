// var: init_SmithyMessageDecoderStream2
var init_SmithyMessageDecoderStream2 = __esm(() => {
  SmithyMessageDecoderStream3 = class SmithyMessageDecoderStream3 {
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
