// var: require_sdk_stream_mixin_browser
var require_sdk_stream_mixin_browser = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.sdkStreamMixin = void 0;
  var fetch_http_handler_1 = require_dist_cjs24(), util_base64_1 = require_dist_cjs18(), util_hex_encoding_1 = require_dist_cjs25(), util_utf8_1 = require_dist_cjs17(), stream_type_check_1 = require_stream_type_check(), ERR_MSG_STREAM_HAS_BEEN_TRANSFORMED = "The stream has already been transformed.", sdkStreamMixin = (stream5) => {
    if (!isBlobInstance(stream5) && !(0, stream_type_check_1.isReadableStream)(stream5)) {
      let name = stream5?.__proto__?.constructor?.name || stream5;
      throw Error(`Unexpected stream implementation, expect Blob or ReadableStream, got ${name}`);
    }
    let transformed = !1, transformToByteArray = async () => {
      if (transformed)
        throw Error(ERR_MSG_STREAM_HAS_BEEN_TRANSFORMED);
      return transformed = !0, await (0, fetch_http_handler_1.streamCollector)(stream5);
    }, blobToWebStream = (blob) => {
      if (typeof blob.stream !== "function")
        throw Error(`Cannot transform payload Blob to web stream. Please make sure the Blob.stream() is polyfilled.
If you are using React Native, this API is not yet supported, see: https://react-native.canny.io/feature-requests/p/fetch-streaming-body`);
      return blob.stream();
    };
    return Object.assign(stream5, {
      transformToByteArray,
      transformToString: async (encoding) => {
        let buf = await transformToByteArray();
        if (encoding === "base64")
          return (0, util_base64_1.toBase64)(buf);
        else if (encoding === "hex")
          return (0, util_hex_encoding_1.toHex)(buf);
        else if (encoding === void 0 || encoding === "utf8" || encoding === "utf-8")
          return (0, util_utf8_1.toUtf8)(buf);
        else if (typeof TextDecoder === "function")
          return new TextDecoder(encoding).decode(buf);
        else
          throw Error("TextDecoder is not available, please make sure polyfill is provided.");
      },
      transformToWebStream: () => {
        if (transformed)
          throw Error(ERR_MSG_STREAM_HAS_BEEN_TRANSFORMED);
        if (transformed = !0, isBlobInstance(stream5))
          return blobToWebStream(stream5);
        else if ((0, stream_type_check_1.isReadableStream)(stream5))
          return stream5;
        else
          throw Error(`Cannot transform payload to web stream, got ${stream5}`);
      }
    });
  };
  exports.sdkStreamMixin = sdkStreamMixin;
  var isBlobInstance = (stream5) => typeof Blob === "function" && stream5 instanceof Blob;
});
