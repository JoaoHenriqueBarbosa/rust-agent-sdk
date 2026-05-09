// var: require_dist_cjs17
var require_dist_cjs17 = __commonJS((exports) => {
  var utilBufferFrom = require_dist_cjs16(), fromUtf8 = (input) => {
    let buf = utilBufferFrom.fromString(input, "utf8");
    return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength / Uint8Array.BYTES_PER_ELEMENT);
  }, toUint8Array = (data) => {
    if (typeof data === "string")
      return fromUtf8(data);
    if (ArrayBuffer.isView(data))
      return new Uint8Array(data.buffer, data.byteOffset, data.byteLength / Uint8Array.BYTES_PER_ELEMENT);
    return new Uint8Array(data);
  }, toUtf8 = (input) => {
    if (typeof input === "string")
      return input;
    if (typeof input !== "object" || typeof input.byteOffset !== "number" || typeof input.byteLength !== "number")
      throw Error("@smithy/util-utf8: toUtf8 encoder function only accepts string | Uint8Array.");
    return utilBufferFrom.fromArrayBuffer(input.buffer, input.byteOffset, input.byteLength).toString("utf8");
  };
  exports.fromUtf8 = fromUtf8;
  exports.toUint8Array = toUint8Array;
  exports.toUtf8 = toUtf8;
});
