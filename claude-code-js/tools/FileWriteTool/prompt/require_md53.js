// var: require_md53
var require_md53 = __commonJS((exports, module) => {
  var forge = require_forge();
  require_md();
  require_util3();
  var md5 = module.exports = forge.md5 = forge.md5 || {};
  forge.md.md5 = forge.md.algorithms.md5 = md5;
  md5.create = function() {
    if (!_initialized)
      _init();
    var _state = null, _input = forge.util.createBuffer(), _w = Array(16), md = {
      algorithm: "md5",
      blockLength: 64,
      digestLength: 16,
      messageLength: 0,
      fullMessageLength: null,
      messageLengthSize: 8
    };
    return md.start = function() {
      md.messageLength = 0, md.fullMessageLength = md.messageLength64 = [];
      var int32s = md.messageLengthSize / 4;
      for (var i5 = 0;i5 < int32s; ++i5)
        md.fullMessageLength.push(0);
      return _input = forge.util.createBuffer(), _state = {
        h0: 1732584193,
        h1: 4023233417,
        h2: 2562383102,
        h3: 271733878
      }, md;
    }, md.start(), md.update = function(msg, encoding) {
      if (encoding === "utf8")
        msg = forge.util.encodeUtf8(msg);
      var len = msg.length;
      md.messageLength += len, len = [len / 4294967296 >>> 0, len >>> 0];
      for (var i5 = md.fullMessageLength.length - 1;i5 >= 0; --i5)
        md.fullMessageLength[i5] += len[1], len[1] = len[0] + (md.fullMessageLength[i5] / 4294967296 >>> 0), md.fullMessageLength[i5] = md.fullMessageLength[i5] >>> 0, len[0] = len[1] / 4294967296 >>> 0;
      if (_input.putBytes(msg), _update(_state, _w, _input), _input.read > 2048 || _input.length() === 0)
        _input.compact();
      return md;
    }, md.digest = function() {
      var finalBlock = forge.util.createBuffer();
      finalBlock.putBytes(_input.bytes());
      var remaining = md.fullMessageLength[md.fullMessageLength.length - 1] + md.messageLengthSize, overflow = remaining & md.blockLength - 1;
      finalBlock.putBytes(_padding.substr(0, md.blockLength - overflow));
      var bits2, carry = 0;
      for (var i5 = md.fullMessageLength.length - 1;i5 >= 0; --i5)
        bits2 = md.fullMessageLength[i5] * 8 + carry, carry = bits2 / 4294967296 >>> 0, finalBlock.putInt32Le(bits2 >>> 0);
      var s2 = {
        h0: _state.h0,
        h1: _state.h1,
        h2: _state.h2,
        h3: _state.h3
      };
      _update(s2, _w, finalBlock);
      var rval = forge.util.createBuffer();
      return rval.putInt32Le(s2.h0), rval.putInt32Le(s2.h1), rval.putInt32Le(s2.h2), rval.putInt32Le(s2.h3), rval;
    }, md;
  };
  var _padding = null, _g = null, _r = null, _k = null, _initialized = !1;
  function _init() {
    _padding = String.fromCharCode(128), _padding += forge.util.fillString(String.fromCharCode(0), 64), _g = [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      1,
      6,
      11,
      0,
      5,
      10,
      15,
      4,
      9,
      14,
      3,
      8,
      13,
      2,
      7,
      12,
      5,
      8,
      11,
      14,
      1,
      4,
      7,
      10,
      13,
      0,
      3,
      6,
      9,
      12,
      15,
      2,
      0,
      7,
      14,
      5,
      12,
      3,
      10,
      1,
      8,
      15,
      6,
      13,
      4,
      11,
      2,
      9
    ], _r = [
      7,
      12,
      17,
      22,
      7,
      12,
      17,
      22,
      7,
      12,
      17,
      22,
      7,
      12,
      17,
      22,
      5,
      9,
      14,
      20,
      5,
      9,
      14,
      20,
      5,
      9,
      14,
      20,
      5,
      9,
      14,
      20,
      4,
      11,
      16,
      23,
      4,
      11,
      16,
      23,
      4,
      11,
      16,
      23,
      4,
      11,
      16,
      23,
      6,
      10,
      15,
      21,
      6,
      10,
      15,
      21,
      6,
      10,
      15,
      21,
      6,
      10,
      15,
      21
    ], _k = Array(64);
    for (var i5 = 0;i5 < 64; ++i5)
      _k[i5] = Math.floor(Math.abs(Math.sin(i5 + 1)) * 4294967296);
    _initialized = !0;
  }
  function _update(s2, w2, bytes) {
    var t2, a2, b, c3, d, f, r4, i5, len = bytes.length();
    while (len >= 64) {
      a2 = s2.h0, b = s2.h1, c3 = s2.h2, d = s2.h3;
      for (i5 = 0;i5 < 16; ++i5)
        w2[i5] = bytes.getInt32Le(), f = d ^ b & (c3 ^ d), t2 = a2 + f + _k[i5] + w2[i5], r4 = _r[i5], a2 = d, d = c3, c3 = b, b += t2 << r4 | t2 >>> 32 - r4;
      for (;i5 < 32; ++i5)
        f = c3 ^ d & (b ^ c3), t2 = a2 + f + _k[i5] + w2[_g[i5]], r4 = _r[i5], a2 = d, d = c3, c3 = b, b += t2 << r4 | t2 >>> 32 - r4;
      for (;i5 < 48; ++i5)
        f = b ^ c3 ^ d, t2 = a2 + f + _k[i5] + w2[_g[i5]], r4 = _r[i5], a2 = d, d = c3, c3 = b, b += t2 << r4 | t2 >>> 32 - r4;
      for (;i5 < 64; ++i5)
        f = c3 ^ (b | ~d), t2 = a2 + f + _k[i5] + w2[_g[i5]], r4 = _r[i5], a2 = d, d = c3, c3 = b, b += t2 << r4 | t2 >>> 32 - r4;
      s2.h0 = s2.h0 + a2 | 0, s2.h1 = s2.h1 + b | 0, s2.h2 = s2.h2 + c3 | 0, s2.h3 = s2.h3 + d | 0, len -= 64;
    }
  }
});
