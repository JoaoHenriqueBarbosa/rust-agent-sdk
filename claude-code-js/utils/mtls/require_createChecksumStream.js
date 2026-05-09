// var: require_createChecksumStream
var require_createChecksumStream = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.createChecksumStream = createChecksumStream;
  var stream_type_check_1 = require_stream_type_check(), ChecksumStream_1 = require_ChecksumStream(), createChecksumStream_browser_1 = require_createChecksumStream_browser();
  function createChecksumStream(init) {
    if (typeof ReadableStream === "function" && (0, stream_type_check_1.isReadableStream)(init.source))
      return (0, createChecksumStream_browser_1.createChecksumStream)(init);
    return new ChecksumStream_1.ChecksumStream(init);
  }
});
