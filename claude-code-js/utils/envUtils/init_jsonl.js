// var: init_jsonl
var init_jsonl = __esm(() => {
  init_error();
  init_line();
  JSONLDecoder = class JSONLDecoder {
    constructor(iterator, controller) {
      this.iterator = iterator, this.controller = controller;
    }
    async* decoder() {
      let lineDecoder = new LineDecoder;
      for await (let chunk of this.iterator)
        for (let line of lineDecoder.decode(chunk))
          yield JSON.parse(line);
      for (let line of lineDecoder.flush())
        yield JSON.parse(line);
    }
    [Symbol.asyncIterator]() {
      return this.decoder();
    }
    static fromResponse(response, controller) {
      if (!response.body) {
        if (controller.abort(), typeof globalThis.navigator < "u" && globalThis.navigator.product === "ReactNative")
          throw new AnthropicError("The default react-native fetch implementation does not support streaming. Please use expo/fetch: https://docs.expo.dev/versions/latest/sdk/expo/#expofetch-api");
        throw new AnthropicError("Attempted to iterate over a response with no body");
      }
      return new JSONLDecoder(ReadableStreamToAsyncIterable(response.body), controller);
    }
  };
});
