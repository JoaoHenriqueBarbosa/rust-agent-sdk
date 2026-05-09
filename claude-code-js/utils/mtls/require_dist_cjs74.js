// var: require_dist_cjs74
var require_dist_cjs74 = __commonJS((exports) => {
  var isArrayBuffer3 = require_dist_cjs73(), buffer = __require("buffer"), fromArrayBuffer = (input, offset = 0, length = input.byteLength - offset) => {
    if (!isArrayBuffer3.isArrayBuffer(input))
      throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof input} (${input})`);
    return buffer.Buffer.from(input, offset, length);
  }, fromString = (input, encoding) => {
    if (typeof input !== "string")
      throw TypeError(`The "input" argument must be of type string. Received type ${typeof input} (${input})`);
    return encoding ? buffer.Buffer.from(input, encoding) : buffer.Buffer.from(input);
  };
  exports.fromArrayBuffer = fromArrayBuffer;
  exports.fromString = fromString;
});
