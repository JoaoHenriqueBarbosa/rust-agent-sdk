// var: require_aes
var require_aes = __commonJS((exports, module) => {
  var forge = require_forge();
  require_cipher();
  require_cipherModes();
  require_util3();
  module.exports = forge.aes = forge.aes || {};
  forge.aes.startEncrypting = function(key2, iv, output, mode) {
    var cipher = _createCipher({
      key: key2,
      output,
      decrypt: !1,
      mode
    });
    return cipher.start(iv), cipher;
  };
  forge.aes.createEncryptionCipher = function(key2, mode) {
    return _createCipher({
      key: key2,
      output: null,
      decrypt: !1,
      mode
    });
  };
  forge.aes.startDecrypting = function(key2, iv, output, mode) {
    var cipher = _createCipher({
      key: key2,
      output,
      decrypt: !0,
      mode
    });
    return cipher.start(iv), cipher;
  };
  forge.aes.createDecryptionCipher = function(key2, mode) {
    return _createCipher({
      key: key2,
      output: null,
      decrypt: !0,
      mode
    });
  };
  forge.aes.Algorithm = function(name3, mode) {
    if (!init)
      initialize4();
    var self2 = this;
    self2.name = name3, self2.mode = new mode({
      blockSize: 16,
      cipher: {
        encrypt: function(inBlock, outBlock) {
          return _updateBlock(self2._w, inBlock, outBlock, !1);
        },
        decrypt: function(inBlock, outBlock) {
          return _updateBlock(self2._w, inBlock, outBlock, !0);
        }
      }
    }), self2._init = !1;
  };
  forge.aes.Algorithm.prototype.initialize = function(options) {
    if (this._init)
      return;
    var key2 = options.key, tmp;
    if (typeof key2 === "string" && (key2.length === 16 || key2.length === 24 || key2.length === 32))
      key2 = forge.util.createBuffer(key2);
    else if (forge.util.isArray(key2) && (key2.length === 16 || key2.length === 24 || key2.length === 32)) {
      tmp = key2, key2 = forge.util.createBuffer();
      for (var i5 = 0;i5 < tmp.length; ++i5)
        key2.putByte(tmp[i5]);
    }
    if (!forge.util.isArray(key2)) {
      tmp = key2, key2 = [];
      var len = tmp.length();
      if (len === 16 || len === 24 || len === 32) {
        len = len >>> 2;
        for (var i5 = 0;i5 < len; ++i5)
          key2.push(tmp.getInt32());
      }
    }
    if (!forge.util.isArray(key2) || !(key2.length === 4 || key2.length === 6 || key2.length === 8))
      throw Error("Invalid key parameter.");
    var mode = this.mode.name, encryptOp = ["CFB", "OFB", "CTR", "GCM"].indexOf(mode) !== -1;
    this._w = _expandKey(key2, options.decrypt && !encryptOp), this._init = !0;
  };
  forge.aes._expandKey = function(key2, decrypt) {
    if (!init)
      initialize4();
    return _expandKey(key2, decrypt);
  };
  forge.aes._updateBlock = _updateBlock;
  registerAlgorithm("AES-ECB", forge.cipher.modes.ecb);
  registerAlgorithm("AES-CBC", forge.cipher.modes.cbc);
  registerAlgorithm("AES-CFB", forge.cipher.modes.cfb);
  registerAlgorithm("AES-OFB", forge.cipher.modes.ofb);
  registerAlgorithm("AES-CTR", forge.cipher.modes.ctr);
  registerAlgorithm("AES-GCM", forge.cipher.modes.gcm);
  function registerAlgorithm(name3, mode) {
    var factory2 = function() {
      return new forge.aes.Algorithm(name3, mode);
    };
    forge.cipher.registerAlgorithm(name3, factory2);
  }
  var init = !1, Nb = 4, sbox, isbox, rcon, mix, imix;
  function initialize4() {
    init = !0, rcon = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54];
    var xtime = Array(256);
    for (var i5 = 0;i5 < 128; ++i5)
      xtime[i5] = i5 << 1, xtime[i5 + 128] = i5 + 128 << 1 ^ 283;
    sbox = Array(256), isbox = Array(256), mix = Array(4), imix = Array(4);
    for (var i5 = 0;i5 < 4; ++i5)
      mix[i5] = Array(256), imix[i5] = Array(256);
    var e = 0, ei = 0, e2, e4, e8, sx, sx2, me, ime;
    for (var i5 = 0;i5 < 256; ++i5) {
      sx = ei ^ ei << 1 ^ ei << 2 ^ ei << 3 ^ ei << 4, sx = sx >> 8 ^ sx & 255 ^ 99, sbox[e] = sx, isbox[sx] = e, sx2 = xtime[sx], e2 = xtime[e], e4 = xtime[e2], e8 = xtime[e4], me = sx2 << 24 ^ sx << 16 ^ sx << 8 ^ (sx ^ sx2), ime = (e2 ^ e4 ^ e8) << 24 ^ (e ^ e8) << 16 ^ (e ^ e4 ^ e8) << 8 ^ (e ^ e2 ^ e8);
      for (var n5 = 0;n5 < 4; ++n5)
        mix[n5][e] = me, imix[n5][sx] = ime, me = me << 24 | me >>> 8, ime = ime << 24 | ime >>> 8;
      if (e === 0)
        e = ei = 1;
      else
        e = e2 ^ xtime[xtime[xtime[e2 ^ e8]]], ei ^= xtime[xtime[ei]];
    }
  }
  function _expandKey(key2, decrypt) {
    var w2 = key2.slice(0), temp, iNk = 1, Nk = w2.length, Nr1 = Nk + 6 + 1, end = Nb * Nr1;
    for (var i5 = Nk;i5 < end; ++i5) {
      if (temp = w2[i5 - 1], i5 % Nk === 0)
        temp = sbox[temp >>> 16 & 255] << 24 ^ sbox[temp >>> 8 & 255] << 16 ^ sbox[temp & 255] << 8 ^ sbox[temp >>> 24] ^ rcon[iNk] << 24, iNk++;
      else if (Nk > 6 && i5 % Nk === 4)
        temp = sbox[temp >>> 24] << 24 ^ sbox[temp >>> 16 & 255] << 16 ^ sbox[temp >>> 8 & 255] << 8 ^ sbox[temp & 255];
      w2[i5] = w2[i5 - Nk] ^ temp;
    }
    if (decrypt) {
      var tmp, m0 = imix[0], m1 = imix[1], m22 = imix[2], m32 = imix[3], wnew = w2.slice(0);
      end = w2.length;
      for (var i5 = 0, wi = end - Nb;i5 < end; i5 += Nb, wi -= Nb)
        if (i5 === 0 || i5 === end - Nb)
          wnew[i5] = w2[wi], wnew[i5 + 1] = w2[wi + 3], wnew[i5 + 2] = w2[wi + 2], wnew[i5 + 3] = w2[wi + 1];
        else
          for (var n5 = 0;n5 < Nb; ++n5)
            tmp = w2[wi + n5], wnew[i5 + (3 & -n5)] = m0[sbox[tmp >>> 24]] ^ m1[sbox[tmp >>> 16 & 255]] ^ m22[sbox[tmp >>> 8 & 255]] ^ m32[sbox[tmp & 255]];
      w2 = wnew;
    }
    return w2;
  }
  function _updateBlock(w2, input, output, decrypt) {
    var Nr = w2.length / 4 - 1, m0, m1, m22, m32, sub;
    if (decrypt)
      m0 = imix[0], m1 = imix[1], m22 = imix[2], m32 = imix[3], sub = isbox;
    else
      m0 = mix[0], m1 = mix[1], m22 = mix[2], m32 = mix[3], sub = sbox;
    var a2, b, c3, d, a22, b22, c22;
    a2 = input[0] ^ w2[0], b = input[decrypt ? 3 : 1] ^ w2[1], c3 = input[2] ^ w2[2], d = input[decrypt ? 1 : 3] ^ w2[3];
    var i5 = 3;
    for (var round = 1;round < Nr; ++round)
      a22 = m0[a2 >>> 24] ^ m1[b >>> 16 & 255] ^ m22[c3 >>> 8 & 255] ^ m32[d & 255] ^ w2[++i5], b22 = m0[b >>> 24] ^ m1[c3 >>> 16 & 255] ^ m22[d >>> 8 & 255] ^ m32[a2 & 255] ^ w2[++i5], c22 = m0[c3 >>> 24] ^ m1[d >>> 16 & 255] ^ m22[a2 >>> 8 & 255] ^ m32[b & 255] ^ w2[++i5], d = m0[d >>> 24] ^ m1[a2 >>> 16 & 255] ^ m22[b >>> 8 & 255] ^ m32[c3 & 255] ^ w2[++i5], a2 = a22, b = b22, c3 = c22;
    output[0] = sub[a2 >>> 24] << 24 ^ sub[b >>> 16 & 255] << 16 ^ sub[c3 >>> 8 & 255] << 8 ^ sub[d & 255] ^ w2[++i5], output[decrypt ? 3 : 1] = sub[b >>> 24] << 24 ^ sub[c3 >>> 16 & 255] << 16 ^ sub[d >>> 8 & 255] << 8 ^ sub[a2 & 255] ^ w2[++i5], output[2] = sub[c3 >>> 24] << 24 ^ sub[d >>> 16 & 255] << 16 ^ sub[a2 >>> 8 & 255] << 8 ^ sub[b & 255] ^ w2[++i5], output[decrypt ? 1 : 3] = sub[d >>> 24] << 24 ^ sub[a2 >>> 16 & 255] << 16 ^ sub[b >>> 8 & 255] << 8 ^ sub[c3 & 255] ^ w2[++i5];
  }
  function _createCipher(options) {
    options = options || {};
    var mode = (options.mode || "CBC").toUpperCase(), algorithm = "AES-" + mode, cipher;
    if (options.decrypt)
      cipher = forge.cipher.createDecipher(algorithm, options.key);
    else
      cipher = forge.cipher.createCipher(algorithm, options.key);
    var start = cipher.start;
    return cipher.start = function(iv, options2) {
      var output = null;
      if (options2 instanceof forge.util.ByteBuffer)
        output = options2, options2 = {};
      options2 = options2 || {}, options2.output = output, options2.iv = iv, start.call(cipher, options2);
    }, cipher;
  }
});
