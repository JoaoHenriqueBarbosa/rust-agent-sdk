// var: require_v4
var require_v4 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", {
    value: !0
  });
  exports.default = void 0;
  var _rng = _interopRequireDefault(require_rng()), _stringify = _interopRequireDefault(require_stringify());
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function v4(options, buf, offset) {
    options = options || {};
    let rnds = options.random || (options.rng || _rng.default)();
    if (rnds[6] = rnds[6] & 15 | 64, rnds[8] = rnds[8] & 63 | 128, buf) {
      offset = offset || 0;
      for (let i4 = 0;i4 < 16; ++i4)
        buf[offset + i4] = rnds[i4];
      return buf;
    }
    return (0, _stringify.default)(rnds);
  }
  var _default3 = v4;
  exports.default = _default3;
});
