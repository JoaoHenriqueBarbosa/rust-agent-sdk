// var: require_sha13
var require_sha13 = __commonJS((exports, module) => {
  var forge = require_forge();
  require_md();
  require_util3();
  var sha1 = module.exports = forge.sha1 = forge.sha1 || {};
  forge.md.sha1 = forge.md.algorithms.sha1 = sha1;
  sha1.create = function() {
    if (!_initialized)
      _init();
    var _state = null, _input = forge.util.createBuffer(), _w = Array(80), md = {
      algorithm: "sha1",
      blockLength: 64,
      digestLength: 20,
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
        h3: 271733878,
        h4: 3285377520
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
      var next, carry, bits2 = md.fullMessageLength[0] * 8;
      for (var i5 = 0;i5 < md.fullMessageLength.length - 1; ++i5)
        next = md.fullMessageLength[i5 + 1] * 8, carry = next / 4294967296 >>> 0, bits2 += carry, finalBlock.putInt32(bits2 >>> 0), bits2 = next >>> 0;
      finalBlock.putInt32(bits2);
      var s2 = {
        h0: _state.h0,
        h1: _state.h1,
        h2: _state.h2,
        h3: _state.h3,
        h4: _state.h4
      };
      _update(s2, _w, finalBlock);
      var rval = forge.util.createBuffer();
      return rval.putInt32(s2.h0), rval.putInt32(s2.h1), rval.putInt32(s2.h2), rval.putInt32(s2.h3), rval.putInt32(s2.h4), rval;
    }, md;
  };
  var _padding = null, _initialized = !1;
  function _init() {
    _padding = String.fromCharCode(128), _padding += forge.util.fillString(String.fromCharCode(0), 64), _initialized = !0;
  }
  function _update(s2, w2, bytes) {
    var t2, a2, b, c3, d, e, f, i5, len = bytes.length();
    while (len >= 64) {
      a2 = s2.h0, b = s2.h1, c3 = s2.h2, d = s2.h3, e = s2.h4;
      for (i5 = 0;i5 < 16; ++i5)
        t2 = bytes.getInt32(), w2[i5] = t2, f = d ^ b & (c3 ^ d), t2 = (a2 << 5 | a2 >>> 27) + f + e + 1518500249 + t2, e = d, d = c3, c3 = (b << 30 | b >>> 2) >>> 0, b = a2, a2 = t2;
      for (;i5 < 20; ++i5)
        t2 = w2[i5 - 3] ^ w2[i5 - 8] ^ w2[i5 - 14] ^ w2[i5 - 16], t2 = t2 << 1 | t2 >>> 31, w2[i5] = t2, f = d ^ b & (c3 ^ d), t2 = (a2 << 5 | a2 >>> 27) + f + e + 1518500249 + t2, e = d, d = c3, c3 = (b << 30 | b >>> 2) >>> 0, b = a2, a2 = t2;
      for (;i5 < 32; ++i5)
        t2 = w2[i5 - 3] ^ w2[i5 - 8] ^ w2[i5 - 14] ^ w2[i5 - 16], t2 = t2 << 1 | t2 >>> 31, w2[i5] = t2, f = b ^ c3 ^ d, t2 = (a2 << 5 | a2 >>> 27) + f + e + 1859775393 + t2, e = d, d = c3, c3 = (b << 30 | b >>> 2) >>> 0, b = a2, a2 = t2;
      for (;i5 < 40; ++i5)
        t2 = w2[i5 - 6] ^ w2[i5 - 16] ^ w2[i5 - 28] ^ w2[i5 - 32], t2 = t2 << 2 | t2 >>> 30, w2[i5] = t2, f = b ^ c3 ^ d, t2 = (a2 << 5 | a2 >>> 27) + f + e + 1859775393 + t2, e = d, d = c3, c3 = (b << 30 | b >>> 2) >>> 0, b = a2, a2 = t2;
      for (;i5 < 60; ++i5)
        t2 = w2[i5 - 6] ^ w2[i5 - 16] ^ w2[i5 - 28] ^ w2[i5 - 32], t2 = t2 << 2 | t2 >>> 30, w2[i5] = t2, f = b & c3 | d & (b ^ c3), t2 = (a2 << 5 | a2 >>> 27) + f + e + 2400959708 + t2, e = d, d = c3, c3 = (b << 30 | b >>> 2) >>> 0, b = a2, a2 = t2;
      for (;i5 < 80; ++i5)
        t2 = w2[i5 - 6] ^ w2[i5 - 16] ^ w2[i5 - 28] ^ w2[i5 - 32], t2 = t2 << 2 | t2 >>> 30, w2[i5] = t2, f = b ^ c3 ^ d, t2 = (a2 << 5 | a2 >>> 27) + f + e + 3395469782 + t2, e = d, d = c3, c3 = (b << 30 | b >>> 2) >>> 0, b = a2, a2 = t2;
      s2.h0 = s2.h0 + a2 | 0, s2.h1 = s2.h1 + b | 0, s2.h2 = s2.h2 + c3 | 0, s2.h3 = s2.h3 + d | 0, s2.h4 = s2.h4 + e | 0, len -= 64;
    }
  }
});
