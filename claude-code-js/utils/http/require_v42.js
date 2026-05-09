// var: require_v42
var require_v42 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", {
    value: !0
  });
  exports.default = void 0;
  var _native = _interopRequireDefault(require_native()), _rng = _interopRequireDefault(require_rng2()), _stringify = require_stringify2();
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function v42(options, buf, offset) {
    if (_native.default.randomUUID && !buf && !options)
      return _native.default.randomUUID();
    options = options || {};
    let rnds = options.random || (options.rng || _rng.default)();
    if (rnds[6] = rnds[6] & 15 | 64, rnds[8] = rnds[8] & 63 | 128, buf) {
      offset = offset || 0;
      for (let i4 = 0;i4 < 16; ++i4)
        buf[offset + i4] = rnds[i4];
      return buf;
    }
    return (0, _stringify.unsafeStringify)(rnds);
  }
  var _default3 = v42;
  exports.default = _default3;
});
