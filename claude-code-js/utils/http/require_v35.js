// var: require_v35
var require_v35 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", {
    value: !0
  });
  exports.default = _default3;
  exports.URL = exports.DNS = void 0;
  var _stringify = _interopRequireDefault(require_stringify()), _parse2 = _interopRequireDefault(require_parse2());
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function stringToBytes(str) {
    str = unescape(encodeURIComponent(str));
    let bytes = [];
    for (let i4 = 0;i4 < str.length; ++i4)
      bytes.push(str.charCodeAt(i4));
    return bytes;
  }
  var DNS = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
  exports.DNS = DNS;
  var URL2 = "6ba7b811-9dad-11d1-80b4-00c04fd430c8";
  exports.URL = URL2;
  function _default3(name2, version3, hashfunc) {
    function generateUUID(value, namespace, buf, offset) {
      if (typeof value === "string")
        value = stringToBytes(value);
      if (typeof namespace === "string")
        namespace = (0, _parse2.default)(namespace);
      if (namespace.length !== 16)
        throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");
      let bytes = new Uint8Array(16 + value.length);
      if (bytes.set(namespace), bytes.set(value, namespace.length), bytes = hashfunc(bytes), bytes[6] = bytes[6] & 15 | version3, bytes[8] = bytes[8] & 63 | 128, buf) {
        offset = offset || 0;
        for (let i4 = 0;i4 < 16; ++i4)
          buf[offset + i4] = bytes[i4];
        return buf;
      }
      return (0, _stringify.default)(bytes);
    }
    try {
      generateUUID.name = name2;
    } catch (err) {}
    return generateUUID.DNS = DNS, generateUUID.URL = URL2, generateUUID;
  }
});
