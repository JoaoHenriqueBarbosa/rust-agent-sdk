// var: require_v12
var require_v12 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", {
    value: !0
  });
  exports.default = void 0;
  var _rng = _interopRequireDefault(require_rng2()), _stringify = require_stringify2();
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var _nodeId, _clockseq, _lastMSecs = 0, _lastNSecs = 0;
  function v12(options, buf, offset) {
    let i4 = buf && offset || 0, b = buf || Array(16);
    options = options || {};
    let node = options.node || _nodeId, clockseq = options.clockseq !== void 0 ? options.clockseq : _clockseq;
    if (node == null || clockseq == null) {
      let seedBytes = options.random || (options.rng || _rng.default)();
      if (node == null)
        node = _nodeId = [seedBytes[0] | 1, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
      if (clockseq == null)
        clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 16383;
    }
    let msecs = options.msecs !== void 0 ? options.msecs : Date.now(), nsecs = options.nsecs !== void 0 ? options.nsecs : _lastNSecs + 1, dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 1e4;
    if (dt < 0 && options.clockseq === void 0)
      clockseq = clockseq + 1 & 16383;
    if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === void 0)
      nsecs = 0;
    if (nsecs >= 1e4)
      throw Error("uuid.v1(): Can't create more than 10M uuids/sec");
    _lastMSecs = msecs, _lastNSecs = nsecs, _clockseq = clockseq, msecs += 12219292800000;
    let tl = ((msecs & 268435455) * 1e4 + nsecs) % 4294967296;
    b[i4++] = tl >>> 24 & 255, b[i4++] = tl >>> 16 & 255, b[i4++] = tl >>> 8 & 255, b[i4++] = tl & 255;
    let tmh = msecs / 4294967296 * 1e4 & 268435455;
    b[i4++] = tmh >>> 8 & 255, b[i4++] = tmh & 255, b[i4++] = tmh >>> 24 & 15 | 16, b[i4++] = tmh >>> 16 & 255, b[i4++] = clockseq >>> 8 | 128, b[i4++] = clockseq & 255;
    for (let n5 = 0;n5 < 6; ++n5)
      b[i4 + n5] = node[n5];
    return buf || (0, _stringify.unsafeStringify)(b);
  }
  var _default3 = v12;
  exports.default = _default3;
});
