// var: require_convertToBuffer2
var require_convertToBuffer2 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.convertToBuffer = void 0;
  var util_utf8_browser_1 = require_dist_cjs89(), fromUtf812 = typeof Buffer < "u" && Buffer.from ? function(input) {
    return Buffer.from(input, "utf8");
  } : util_utf8_browser_1.fromUtf8;
  function convertToBuffer2(data) {
    if (data instanceof Uint8Array)
      return data;
    if (typeof data === "string")
      return fromUtf812(data);
    if (ArrayBuffer.isView(data))
      return new Uint8Array(data.buffer, data.byteOffset, data.byteLength / Uint8Array.BYTES_PER_ELEMENT);
    return new Uint8Array(data);
  }
  exports.convertToBuffer = convertToBuffer2;
});
