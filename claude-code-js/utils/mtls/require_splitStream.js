// var: require_splitStream
var require_splitStream = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.splitStream = splitStream;
  var stream_1 = __require("stream"), splitStream_browser_1 = require_splitStream_browser(), stream_type_check_1 = require_stream_type_check();
  async function splitStream(stream5) {
    if ((0, stream_type_check_1.isReadableStream)(stream5) || (0, stream_type_check_1.isBlob)(stream5))
      return (0, splitStream_browser_1.splitStream)(stream5);
    let stream1 = new stream_1.PassThrough, stream22 = new stream_1.PassThrough;
    return stream5.pipe(stream1), stream5.pipe(stream22), [stream1, stream22];
  }
});
