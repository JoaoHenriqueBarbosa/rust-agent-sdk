// var: require_sha256
var require_sha256 = __commonJS((exports, module) => {
  var forge = require_forge();
  require_md();
  require_util3();
  var sha256 = module.exports = forge.sha256 = forge.sha256 || {};
  forge.md.sha256 = forge.md.algorithms.sha256 = sha256;
  sha256.create = function() {
    if (!_initialized)
      _init();
    var _state = null, _input = forge.util.createBuffer(), _w = Array(64), md = {
      algorithm: "sha256",
      blockLength: 64,
      digestLength: 32,
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
        h0: 1779033703,
        h1: 3144134277,
        h2: 1013904242,
        h3: 2773480762,
        h4: 1359893119,
        h5: 2600822924,
        h6: 528734635,
        h7: 1541459225
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
        h4: _state.h4,
        h5: _state.h5,
        h6: _state.h6,
        h7: _state.h7
      };
      _update(s2, _w, finalBlock);
      var rval = forge.util.createBuffer();
      return rval.putInt32(s2.h0), rval.putInt32(s2.h1), rval.putInt32(s2.h2), rval.putInt32(s2.h3), rval.putInt32(s2.h4), rval.putInt32(s2.h5), rval.putInt32(s2.h6), rval.putInt32(s2.h7), rval;
    }, md;
  };
  var _padding = null, _initialized = !1, _k = null;
  function _init() {
    _padding = String.fromCharCode(128), _padding += forge.util.fillString(String.fromCharCode(0), 64), _k = [
      1116352408,
      1899447441,
      3049323471,
      3921009573,
      961987163,
      1508970993,
      2453635748,
      2870763221,
      3624381080,
      310598401,
      607225278,
      1426881987,
      1925078388,
      2162078206,
      2614888103,
      3248222580,
      3835390401,
      4022224774,
      264347078,
      604807628,
      770255983,
      1249150122,
      1555081692,
      1996064986,
      2554220882,
      2821834349,
      2952996808,
      3210313671,
      3336571891,
      3584528711,
      113926993,
      338241895,
      666307205,
      773529912,
      1294757372,
      1396182291,
      1695183700,
      1986661051,
      2177026350,
      2456956037,
      2730485921,
      2820302411,
      3259730800,
      3345764771,
      3516065817,
      3600352804,
      4094571909,
      275423344,
      430227734,
      506948616,
      659060556,
      883997877,
      958139571,
      1322822218,
      1537002063,
      1747873779,
      1955562222,
      2024104815,
      2227730452,
      2361852424,
      2428436474,
      2756734187,
      3204031479,
      3329325298
    ], _initialized = !0;
  }
  function _update(s2, w2, bytes) {
    var t1, t2, s0, s1, ch2, maj, i5, a2, b, c3, d, e, f, g, h4, len = bytes.length();
    while (len >= 64) {
      for (i5 = 0;i5 < 16; ++i5)
        w2[i5] = bytes.getInt32();
      for (;i5 < 64; ++i5)
        t1 = w2[i5 - 2], t1 = (t1 >>> 17 | t1 << 15) ^ (t1 >>> 19 | t1 << 13) ^ t1 >>> 10, t2 = w2[i5 - 15], t2 = (t2 >>> 7 | t2 << 25) ^ (t2 >>> 18 | t2 << 14) ^ t2 >>> 3, w2[i5] = t1 + w2[i5 - 7] + t2 + w2[i5 - 16] | 0;
      a2 = s2.h0, b = s2.h1, c3 = s2.h2, d = s2.h3, e = s2.h4, f = s2.h5, g = s2.h6, h4 = s2.h7;
      for (i5 = 0;i5 < 64; ++i5)
        s1 = (e >>> 6 | e << 26) ^ (e >>> 11 | e << 21) ^ (e >>> 25 | e << 7), ch2 = g ^ e & (f ^ g), s0 = (a2 >>> 2 | a2 << 30) ^ (a2 >>> 13 | a2 << 19) ^ (a2 >>> 22 | a2 << 10), maj = a2 & b | c3 & (a2 ^ b), t1 = h4 + s1 + ch2 + _k[i5] + w2[i5], t2 = s0 + maj, h4 = g, g = f, f = e, e = d + t1 >>> 0, d = c3, c3 = b, b = a2, a2 = t1 + t2 >>> 0;
      s2.h0 = s2.h0 + a2 | 0, s2.h1 = s2.h1 + b | 0, s2.h2 = s2.h2 + c3 | 0, s2.h3 = s2.h3 + d | 0, s2.h4 = s2.h4 + e | 0, s2.h5 = s2.h5 + f | 0, s2.h6 = s2.h6 + g | 0, s2.h7 = s2.h7 + h4 | 0, len -= 64;
    }
  }
});
