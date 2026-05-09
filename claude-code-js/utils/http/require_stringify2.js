// var: require_stringify2
var require_stringify2 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", {
    value: !0
  });
  exports.default = void 0;
  exports.unsafeStringify = unsafeStringify;
  var _validate = _interopRequireDefault(require_validate2());
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var byteToHex = [];
  for (let i4 = 0;i4 < 256; ++i4)
    byteToHex.push((i4 + 256).toString(16).slice(1));
  function unsafeStringify(arr, offset = 0) {
    return byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]];
  }
  function stringify2(arr, offset = 0) {
    let uuid8 = unsafeStringify(arr, offset);
    if (!(0, _validate.default)(uuid8))
      throw TypeError("Stringified UUID is invalid");
    return uuid8;
  }
  var _default3 = stringify2;
  exports.default = _default3;
});
