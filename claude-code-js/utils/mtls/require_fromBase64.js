// var: require_fromBase64
var require_fromBase64 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.fromBase64 = void 0;
  var util_buffer_from_1 = require_dist_cjs14(), BASE64_REGEX = /^[A-Za-z0-9+/]*={0,2}$/, fromBase64 = (input) => {
    if (input.length * 3 % 4 !== 0)
      throw TypeError("Incorrect padding on base64 string.");
    if (!BASE64_REGEX.exec(input))
      throw TypeError("Invalid base64 string.");
    let buffer = (0, util_buffer_from_1.fromString)(input, "base64");
    return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  };
  exports.fromBase64 = fromBase64;
});
