// var: require_isStreamingPayload
var require_isStreamingPayload = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.isStreamingPayload = void 0;
  var stream_1 = __require("stream"), isStreamingPayload = (request2) => request2?.body instanceof stream_1.Readable || typeof ReadableStream < "u" && request2?.body instanceof ReadableStream;
  exports.isStreamingPayload = isStreamingPayload;
});
