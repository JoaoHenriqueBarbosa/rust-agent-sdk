// var: init_SmithyMessageEncoderStream2
var init_SmithyMessageEncoderStream2 = __esm(() => {
  SmithyMessageEncoderStream3 = class SmithyMessageEncoderStream3 {
    constructor(options) {
      this.options = options;
    }
    [Symbol.asyncIterator]() {
      return this.asyncIterator();
    }
    async* asyncIterator() {
      for await (let chunk of this.options.inputStream)
        yield this.options.serializer(chunk);
    }
  };
});
