// var: require_pureJs
var require_pureJs = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.toUtf8 = exports.fromUtf8 = void 0;
  var fromUtf810 = (input) => {
    let bytes = [];
    for (let i4 = 0, len = input.length;i4 < len; i4++) {
      let value = input.charCodeAt(i4);
      if (value < 128)
        bytes.push(value);
      else if (value < 2048)
        bytes.push(value >> 6 | 192, value & 63 | 128);
      else if (i4 + 1 < input.length && (value & 64512) === 55296 && (input.charCodeAt(i4 + 1) & 64512) === 56320) {
        let surrogatePair = 65536 + ((value & 1023) << 10) + (input.charCodeAt(++i4) & 1023);
        bytes.push(surrogatePair >> 18 | 240, surrogatePair >> 12 & 63 | 128, surrogatePair >> 6 & 63 | 128, surrogatePair & 63 | 128);
      } else
        bytes.push(value >> 12 | 224, value >> 6 & 63 | 128, value & 63 | 128);
    }
    return Uint8Array.from(bytes);
  };
  exports.fromUtf8 = fromUtf810;
  var toUtf85 = (input) => {
    let decoded = "";
    for (let i4 = 0, len = input.length;i4 < len; i4++) {
      let byte = input[i4];
      if (byte < 128)
        decoded += String.fromCharCode(byte);
      else if (192 <= byte && byte < 224) {
        let nextByte = input[++i4];
        decoded += String.fromCharCode((byte & 31) << 6 | nextByte & 63);
      } else if (240 <= byte && byte < 365) {
        let encoded = "%" + [byte, input[++i4], input[++i4], input[++i4]].map((byteValue) => byteValue.toString(16)).join("%");
        decoded += decodeURIComponent(encoded);
      } else
        decoded += String.fromCharCode((byte & 15) << 12 | (input[++i4] & 63) << 6 | input[++i4] & 63);
    }
    return decoded;
  };
  exports.toUtf8 = toUtf85;
});
