// var: init_SmithyMessageEncoderStream
var init_SmithyMessageEncoderStream = __esm(() => {
  SmithyMessageEncoderStream = class SmithyMessageEncoderStream {
    options;
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
