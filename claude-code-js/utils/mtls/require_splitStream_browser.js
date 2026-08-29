// var: require_splitStream_browser
var require_splitStream_browser = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.splitStream = splitStream;
  async function splitStream(stream5) {
    if (typeof stream5.stream === "function")
      stream5 = stream5.stream();
    return stream5.tee();
  }
});
