// var: require_stream_type_check
var require_stream_type_check = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.isBlob = exports.isReadableStream = void 0;
  var isReadableStream4 = (stream5) => typeof ReadableStream === "function" && (stream5?.constructor?.name === ReadableStream.name || stream5 instanceof ReadableStream);
  exports.isReadableStream = isReadableStream4;
  var isBlob2 = (blob) => {
    return typeof Blob === "function" && (blob?.constructor?.name === Blob.name || blob instanceof Blob);
  };
  exports.isBlob = isBlob2;
});
