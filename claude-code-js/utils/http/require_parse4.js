// var: require_parse4
var require_parse4 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", {
    value: !0
  });
  exports.default = void 0;
  var _validate = _interopRequireDefault(require_validate2());
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function parse10(uuid8) {
    if (!(0, _validate.default)(uuid8))
      throw TypeError("Invalid UUID");
    let v2, arr = new Uint8Array(16);
    return arr[0] = (v2 = parseInt(uuid8.slice(0, 8), 16)) >>> 24, arr[1] = v2 >>> 16 & 255, arr[2] = v2 >>> 8 & 255, arr[3] = v2 & 255, arr[4] = (v2 = parseInt(uuid8.slice(9, 13), 16)) >>> 8, arr[5] = v2 & 255, arr[6] = (v2 = parseInt(uuid8.slice(14, 18), 16)) >>> 8, arr[7] = v2 & 255, arr[8] = (v2 = parseInt(uuid8.slice(19, 23), 16)) >>> 8, arr[9] = v2 & 255, arr[10] = (v2 = parseInt(uuid8.slice(24, 36), 16)) / 1099511627776 & 255, arr[11] = v2 / 4294967296 & 255, arr[12] = v2 >>> 24 & 255, arr[13] = v2 >>> 16 & 255, arr[14] = v2 >>> 8 & 255, arr[15] = v2 & 255, arr;
  }
  var _default3 = parse10;
  exports.default = _default3;
});
