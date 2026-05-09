// var: init_contents
var init_contents = __esm(() => {
  init_stream();
  ({ toString: objectToString3 } = Object.prototype);
  MaxBufferError = class MaxBufferError extends Error {
    name = "MaxBufferError";
    constructor() {
      super("maxBuffer exceeded");
    }
  };
});
