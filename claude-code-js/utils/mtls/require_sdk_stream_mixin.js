// var: require_sdk_stream_mixin
var require_sdk_stream_mixin = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.sdkStreamMixin = void 0;
  var node_http_handler_1 = require_dist_cjs5(), util_buffer_from_1 = require_dist_cjs14(), stream_1 = __require("stream"), sdk_stream_mixin_browser_1 = require_sdk_stream_mixin_browser(), ERR_MSG_STREAM_HAS_BEEN_TRANSFORMED = "The stream has already been transformed.", sdkStreamMixin = (stream5) => {
    if (!(stream5 instanceof stream_1.Readable))
      try {
        return (0, sdk_stream_mixin_browser_1.sdkStreamMixin)(stream5);
      } catch (e) {
        let name = stream5?.__proto__?.constructor?.name || stream5;
        throw Error(`Unexpected stream implementation, expect Stream.Readable instance, got ${name}`);
      }
    let transformed = !1, transformToByteArray = async () => {
      if (transformed)
        throw Error(ERR_MSG_STREAM_HAS_BEEN_TRANSFORMED);
      return transformed = !0, await (0, node_http_handler_1.streamCollector)(stream5);
    };
    return Object.assign(stream5, {
      transformToByteArray,
      transformToString: async (encoding) => {
        let buf = await transformToByteArray();
        if (encoding === void 0 || Buffer.isEncoding(encoding))
          return (0, util_buffer_from_1.fromArrayBuffer)(buf.buffer, buf.byteOffset, buf.byteLength).toString(encoding);
        else
          return new TextDecoder(encoding).decode(buf);
      },
      transformToWebStream: () => {
        if (transformed)
          throw Error(ERR_MSG_STREAM_HAS_BEEN_TRANSFORMED);
        if (stream5.readableFlowing !== null)
          throw Error("The stream has been consumed by other callbacks.");
        if (typeof stream_1.Readable.toWeb !== "function")
          throw Error("Readable.toWeb() is not supported. Please ensure a polyfill is available.");
        return transformed = !0, stream_1.Readable.toWeb(stream5);
      }
    });
  };
  exports.sdkStreamMixin = sdkStreamMixin;
});
