// var: require_toBase64
var require_toBase64 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.toBase64 = void 0;
  var util_buffer_from_1 = require_dist_cjs14(), util_utf8_1 = require_dist_cjs17(), toBase64 = (_input) => {
    let input;
    if (typeof _input === "string")
      input = (0, util_utf8_1.fromUtf8)(_input);
    else
      input = _input;
    if (typeof input !== "object" || typeof input.byteOffset !== "number" || typeof input.byteLength !== "number")
      throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
    return (0, util_buffer_from_1.fromArrayBuffer)(input.buffer, input.byteOffset, input.byteLength).toString("base64");
  };
  exports.toBase64 = toBase64;
});
