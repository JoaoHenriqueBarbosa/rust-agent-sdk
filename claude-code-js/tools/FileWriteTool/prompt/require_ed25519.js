// var: require_ed25519
var require_ed25519 = __commonJS((exports, module) => {
  var forge = require_forge();
  require_jsbn();
  require_random();
  require_sha512();
  require_util3();
  var asn1Validator = require_asn1_validator(), publicKeyValidator = asn1Validator.publicKeyValidator, privateKeyValidator = asn1Validator.privateKeyValidator;
  if (typeof BigInteger > "u")
    BigInteger = forge.jsbn.BigInteger;
  var BigInteger, ByteBuffer = forge.util.ByteBuffer, NativeBuffer = typeof Buffer > "u" ? Uint8Array : Buffer;
  forge.pki = forge.pki || {};
  module.exports = forge.pki.ed25519 = forge.ed25519 = forge.ed25519 || {};
  var ed25519 = forge.ed25519;
  ed25519.constants = {};
  ed25519.constants.PUBLIC_KEY_BYTE_LENGTH = 32;
  ed25519.constants.PRIVATE_KEY_BYTE_LENGTH = 64;
  ed25519.constants.SEED_BYTE_LENGTH = 32;
  ed25519.constants.SIGN_BYTE_LENGTH = 64;
  ed25519.constants.HASH_BYTE_LENGTH = 64;
  ed25519.generateKeyPair = function(options) {
    options = options || {};
    var seed = options.seed;
    if (seed === void 0)
      seed = forge.random.getBytesSync(ed25519.constants.SEED_BYTE_LENGTH);
    else if (typeof seed === "string") {
      if (seed.length !== ed25519.constants.SEED_BYTE_LENGTH)
        throw TypeError('"seed" must be ' + ed25519.constants.SEED_BYTE_LENGTH + " bytes in length.");
    } else if (!(seed instanceof Uint8Array))
      throw TypeError('"seed" must be a node.js Buffer, Uint8Array, or a binary string.');
    seed = messageToNativeBuffer({ message: seed, encoding: "binary" });
    var pk = new NativeBuffer(ed25519.constants.PUBLIC_KEY_BYTE_LENGTH), sk = new NativeBuffer(ed25519.constants.PRIVATE_KEY_BYTE_LENGTH);
    for (var i5 = 0;i5 < 32; ++i5)
      sk[i5] = seed[i5];
    return crypto_sign_keypair(pk, sk), { publicKey: pk, privateKey: sk };
  };
  ed25519.privateKeyFromAsn1 = function(obj) {
    var capture = {}, errors8 = [], valid = forge.asn1.validate(obj, privateKeyValidator, capture, errors8);
    if (!valid) {
      var error44 = Error("Invalid Key.");
      throw error44.errors = errors8, error44;
    }
    var oid = forge.asn1.derToOid(capture.privateKeyOid), ed25519Oid = forge.oids.EdDSA25519;
    if (oid !== ed25519Oid)
      throw Error('Invalid OID "' + oid + '"; OID must be "' + ed25519Oid + '".');
    var privateKey = capture.privateKey, privateKeyBytes = messageToNativeBuffer({
      message: forge.asn1.fromDer(privateKey).value,
      encoding: "binary"
    });
    return { privateKeyBytes };
  };
  ed25519.publicKeyFromAsn1 = function(obj) {
    var capture = {}, errors8 = [], valid = forge.asn1.validate(obj, publicKeyValidator, capture, errors8);
    if (!valid) {
      var error44 = Error("Invalid Key.");
      throw error44.errors = errors8, error44;
    }
    var oid = forge.asn1.derToOid(capture.publicKeyOid), ed25519Oid = forge.oids.EdDSA25519;
    if (oid !== ed25519Oid)
      throw Error('Invalid OID "' + oid + '"; OID must be "' + ed25519Oid + '".');
    var publicKeyBytes = capture.ed25519PublicKey;
    if (publicKeyBytes.length !== ed25519.constants.PUBLIC_KEY_BYTE_LENGTH)
      throw Error("Key length is invalid.");
    return messageToNativeBuffer({
      message: publicKeyBytes,
      encoding: "binary"
    });
  };
  ed25519.publicKeyFromPrivateKey = function(options) {
    options = options || {};
    var privateKey = messageToNativeBuffer({
      message: options.privateKey,
      encoding: "binary"
    });
    if (privateKey.length !== ed25519.constants.PRIVATE_KEY_BYTE_LENGTH)
      throw TypeError('"options.privateKey" must have a byte length of ' + ed25519.constants.PRIVATE_KEY_BYTE_LENGTH);
    var pk = new NativeBuffer(ed25519.constants.PUBLIC_KEY_BYTE_LENGTH);
    for (var i5 = 0;i5 < pk.length; ++i5)
      pk[i5] = privateKey[32 + i5];
    return pk;
  };
  ed25519.sign = function(options) {
    options = options || {};
    var msg = messageToNativeBuffer(options), privateKey = messageToNativeBuffer({
      message: options.privateKey,
      encoding: "binary"
    });
    if (privateKey.length === ed25519.constants.SEED_BYTE_LENGTH) {
      var keyPair = ed25519.generateKeyPair({ seed: privateKey });
      privateKey = keyPair.privateKey;
    } else if (privateKey.length !== ed25519.constants.PRIVATE_KEY_BYTE_LENGTH)
      throw TypeError('"options.privateKey" must have a byte length of ' + ed25519.constants.SEED_BYTE_LENGTH + " or " + ed25519.constants.PRIVATE_KEY_BYTE_LENGTH);
    var signedMsg = new NativeBuffer(ed25519.constants.SIGN_BYTE_LENGTH + msg.length);
    crypto_sign(signedMsg, msg, msg.length, privateKey);
    var sig = new NativeBuffer(ed25519.constants.SIGN_BYTE_LENGTH);
    for (var i5 = 0;i5 < sig.length; ++i5)
      sig[i5] = signedMsg[i5];
    return sig;
  };
  ed25519.verify = function(options) {
    options = options || {};
    var msg = messageToNativeBuffer(options);
    if (options.signature === void 0)
      throw TypeError('"options.signature" must be a node.js Buffer, a Uint8Array, a forge ByteBuffer, or a binary string.');
    var sig = messageToNativeBuffer({
      message: options.signature,
      encoding: "binary"
    });
    if (sig.length !== ed25519.constants.SIGN_BYTE_LENGTH)
      throw TypeError('"options.signature" must have a byte length of ' + ed25519.constants.SIGN_BYTE_LENGTH);
    var publicKey = messageToNativeBuffer({
      message: options.publicKey,
      encoding: "binary"
    });
    if (publicKey.length !== ed25519.constants.PUBLIC_KEY_BYTE_LENGTH)
      throw TypeError('"options.publicKey" must have a byte length of ' + ed25519.constants.PUBLIC_KEY_BYTE_LENGTH);
    var sm = new NativeBuffer(ed25519.constants.SIGN_BYTE_LENGTH + msg.length), m4 = new NativeBuffer(ed25519.constants.SIGN_BYTE_LENGTH + msg.length), i5;
    for (i5 = 0;i5 < ed25519.constants.SIGN_BYTE_LENGTH; ++i5)
      sm[i5] = sig[i5];
    for (i5 = 0;i5 < msg.length; ++i5)
      sm[i5 + ed25519.constants.SIGN_BYTE_LENGTH] = msg[i5];
    return crypto_sign_open(m4, sm, sm.length, publicKey) >= 0;
  };
  function messageToNativeBuffer(options) {
    var message = options.message;
    if (message instanceof Uint8Array || message instanceof NativeBuffer)
      return message;
    var encoding = options.encoding;
    if (message === void 0)
      if (options.md)
        message = options.md.digest().getBytes(), encoding = "binary";
      else
        throw TypeError('"options.message" or "options.md" not specified.');
    if (typeof message === "string" && !encoding)
      throw TypeError('"options.encoding" must be "binary" or "utf8".');
    if (typeof message === "string") {
      if (typeof Buffer < "u")
        return Buffer.from(message, encoding);
      message = new ByteBuffer(message, encoding);
    } else if (!(message instanceof ByteBuffer))
      throw TypeError('"options.message" must be a node.js Buffer, a Uint8Array, a forge ByteBuffer, or a string with "options.encoding" specifying its encoding.');
    var buffer = new NativeBuffer(message.length());
    for (var i5 = 0;i5 < buffer.length; ++i5)
      buffer[i5] = message.at(i5);
    return buffer;
  }
  var gf0 = gf(), gf1 = gf([1]), D2 = gf([
    30883,
    4953,
    19914,
    30187,
    55467,
    16705,
    2637,
    112,
    59544,
    30585,
    16505,
    36039,
    65139,
    11119,
    27886,
    20995
  ]), D22 = gf([
    61785,
    9906,
    39828,
    60374,
    45398,
    33411,
    5274,
    224,
    53552,
    61171,
    33010,
    6542,
    64743,
    22239,
    55772,
    9222
  ]), X = gf([
    54554,
    36645,
    11616,
    51542,
    42930,
    38181,
    51040,
    26924,
    56412,
    64982,
    57905,
    49316,
    21502,
    52590,
    14035,
    8553
  ]), Y = gf([
    26200,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214,
    26214
  ]), L2 = new Float64Array([
    237,
    211,
    245,
    92,
    26,
    99,
    18,
    88,
    214,
    156,
    247,
    162,
    222,
    249,
    222,
    20,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    16
  ]), I2 = gf([
    41136,
    18958,
    6951,
    50414,
    58488,
    44335,
    6150,
    12099,
    55207,
    15867,
    153,
    11085,
    57099,
    20417,
    9344,
    11139
  ]);
  function sha512(msg, msgLen) {
    var md = forge.md.sha512.create(), buffer = new ByteBuffer(msg);
    md.update(buffer.getBytes(msgLen), "binary");
    var hash = md.digest().getBytes();
    if (typeof Buffer < "u")
      return Buffer.from(hash, "binary");
    var out = new NativeBuffer(ed25519.constants.HASH_BYTE_LENGTH);
    for (var i5 = 0;i5 < 64; ++i5)
      out[i5] = hash.charCodeAt(i5);
    return out;
  }
  function crypto_sign_keypair(pk, sk) {
    var p4 = [gf(), gf(), gf(), gf()], i5, d = sha512(sk, 32);
    d[0] &= 248, d[31] &= 127, d[31] |= 64, scalarbase(p4, d), pack(pk, p4);
    for (i5 = 0;i5 < 32; ++i5)
      sk[i5 + 32] = pk[i5];
    return 0;
  }
  function crypto_sign(sm, m4, n5, sk) {
    var i5, j4, x4 = new Float64Array(64), p4 = [gf(), gf(), gf(), gf()], d = sha512(sk, 32);
    d[0] &= 248, d[31] &= 127, d[31] |= 64;
    var smlen = n5 + 64;
    for (i5 = 0;i5 < n5; ++i5)
      sm[64 + i5] = m4[i5];
    for (i5 = 0;i5 < 32; ++i5)
      sm[32 + i5] = d[32 + i5];
    var r4 = sha512(sm.subarray(32), n5 + 32);
    reduce(r4), scalarbase(p4, r4), pack(sm, p4);
    for (i5 = 32;i5 < 64; ++i5)
      sm[i5] = sk[i5];
    var h4 = sha512(sm, n5 + 64);
    reduce(h4);
    for (i5 = 32;i5 < 64; ++i5)
      x4[i5] = 0;
    for (i5 = 0;i5 < 32; ++i5)
      x4[i5] = r4[i5];
    for (i5 = 0;i5 < 32; ++i5)
      for (j4 = 0;j4 < 32; j4++)
        x4[i5 + j4] += h4[i5] * d[j4];
    return modL(sm.subarray(32), x4), smlen;
  }
  function crypto_sign_open(m4, sm, n5, pk) {
    var i5, mlen, t2 = new NativeBuffer(32), p4 = [gf(), gf(), gf(), gf()], q4 = [gf(), gf(), gf(), gf()];
    if (mlen = -1, n5 < 64)
      return -1;
    if (unpackneg(q4, pk))
      return -1;
    if (!_isCanonicalSignatureScalar(sm, 32))
      return -1;
    for (i5 = 0;i5 < n5; ++i5)
      m4[i5] = sm[i5];
    for (i5 = 0;i5 < 32; ++i5)
      m4[i5 + 32] = pk[i5];
    var h4 = sha512(m4, n5);
    if (reduce(h4), scalarmult(p4, q4, h4), scalarbase(q4, sm.subarray(32)), add(p4, q4), pack(t2, p4), n5 -= 64, crypto_verify_32(sm, 0, t2, 0)) {
      for (i5 = 0;i5 < n5; ++i5)
        m4[i5] = 0;
      return -1;
    }
    for (i5 = 0;i5 < n5; ++i5)
      m4[i5] = sm[i5 + 64];
    return mlen = n5, mlen;
  }
  function _isCanonicalSignatureScalar(bytes, offset) {
    var i5;
    for (i5 = 31;i5 >= 0; --i5) {
      if (bytes[offset + i5] < L2[i5])
        return !0;
      if (bytes[offset + i5] > L2[i5])
        return !1;
    }
    return !1;
  }
  function modL(r4, x4) {
    var carry, i5, j4, k3;
    for (i5 = 63;i5 >= 32; --i5) {
      carry = 0;
      for (j4 = i5 - 32, k3 = i5 - 12;j4 < k3; ++j4)
        x4[j4] += carry - 16 * x4[i5] * L2[j4 - (i5 - 32)], carry = x4[j4] + 128 >> 8, x4[j4] -= carry * 256;
      x4[j4] += carry, x4[i5] = 0;
    }
    carry = 0;
    for (j4 = 0;j4 < 32; ++j4)
      x4[j4] += carry - (x4[31] >> 4) * L2[j4], carry = x4[j4] >> 8, x4[j4] &= 255;
    for (j4 = 0;j4 < 32; ++j4)
      x4[j4] -= carry * L2[j4];
    for (i5 = 0;i5 < 32; ++i5)
      x4[i5 + 1] += x4[i5] >> 8, r4[i5] = x4[i5] & 255;
  }
  function reduce(r4) {
    var x4 = new Float64Array(64);
    for (var i5 = 0;i5 < 64; ++i5)
      x4[i5] = r4[i5], r4[i5] = 0;
    modL(r4, x4);
  }
  function add(p4, q4) {
    var a2 = gf(), b = gf(), c3 = gf(), d = gf(), e = gf(), f = gf(), g = gf(), h4 = gf(), t2 = gf();
    Z(a2, p4[1], p4[0]), Z(t2, q4[1], q4[0]), M2(a2, a2, t2), A2(b, p4[0], p4[1]), A2(t2, q4[0], q4[1]), M2(b, b, t2), M2(c3, p4[3], q4[3]), M2(c3, c3, D22), M2(d, p4[2], q4[2]), A2(d, d, d), Z(e, b, a2), Z(f, d, c3), A2(g, d, c3), A2(h4, b, a2), M2(p4[0], e, f), M2(p4[1], h4, g), M2(p4[2], g, f), M2(p4[3], e, h4);
  }
  function cswap(p4, q4, b) {
    for (var i5 = 0;i5 < 4; ++i5)
      sel25519(p4[i5], q4[i5], b);
  }
  function pack(r4, p4) {
    var tx = gf(), ty = gf(), zi = gf();
    inv25519(zi, p4[2]), M2(tx, p4[0], zi), M2(ty, p4[1], zi), pack25519(r4, ty), r4[31] ^= par25519(tx) << 7;
  }
  function pack25519(o5, n5) {
    var i5, j4, b, m4 = gf(), t2 = gf();
    for (i5 = 0;i5 < 16; ++i5)
      t2[i5] = n5[i5];
    car25519(t2), car25519(t2), car25519(t2);
    for (j4 = 0;j4 < 2; ++j4) {
      m4[0] = t2[0] - 65517;
      for (i5 = 1;i5 < 15; ++i5)
        m4[i5] = t2[i5] - 65535 - (m4[i5 - 1] >> 16 & 1), m4[i5 - 1] &= 65535;
      m4[15] = t2[15] - 32767 - (m4[14] >> 16 & 1), b = m4[15] >> 16 & 1, m4[14] &= 65535, sel25519(t2, m4, 1 - b);
    }
    for (i5 = 0;i5 < 16; i5++)
      o5[2 * i5] = t2[i5] & 255, o5[2 * i5 + 1] = t2[i5] >> 8;
  }
  function unpackneg(r4, p4) {
    var t2 = gf(), chk = gf(), num = gf(), den = gf(), den2 = gf(), den4 = gf(), den6 = gf();
    if (set25519(r4[2], gf1), unpack25519(r4[1], p4), S2(num, r4[1]), M2(den, num, D2), Z(num, num, r4[2]), A2(den, r4[2], den), S2(den2, den), S2(den4, den2), M2(den6, den4, den2), M2(t2, den6, num), M2(t2, t2, den), pow2523(t2, t2), M2(t2, t2, num), M2(t2, t2, den), M2(t2, t2, den), M2(r4[0], t2, den), S2(chk, r4[0]), M2(chk, chk, den), neq25519(chk, num))
      M2(r4[0], r4[0], I2);
    if (S2(chk, r4[0]), M2(chk, chk, den), neq25519(chk, num))
      return -1;
    if (par25519(r4[0]) === p4[31] >> 7)
      Z(r4[0], gf0, r4[0]);
    return M2(r4[3], r4[0], r4[1]), 0;
  }
  function unpack25519(o5, n5) {
    var i5;
    for (i5 = 0;i5 < 16; ++i5)
      o5[i5] = n5[2 * i5] + (n5[2 * i5 + 1] << 8);
    o5[15] &= 32767;
  }
  function pow2523(o5, i5) {
    var c3 = gf(), a2;
    for (a2 = 0;a2 < 16; ++a2)
      c3[a2] = i5[a2];
    for (a2 = 250;a2 >= 0; --a2)
      if (S2(c3, c3), a2 !== 1)
        M2(c3, c3, i5);
    for (a2 = 0;a2 < 16; ++a2)
      o5[a2] = c3[a2];
  }
  function neq25519(a2, b) {
    var c3 = new NativeBuffer(32), d = new NativeBuffer(32);
    return pack25519(c3, a2), pack25519(d, b), crypto_verify_32(c3, 0, d, 0);
  }
  function crypto_verify_32(x4, xi, y2, yi) {
    return vn(x4, xi, y2, yi, 32);
  }
  function vn(x4, xi, y2, yi, n5) {
    var i5, d = 0;
    for (i5 = 0;i5 < n5; ++i5)
      d |= x4[xi + i5] ^ y2[yi + i5];
    return (1 & d - 1 >>> 8) - 1;
  }
  function par25519(a2) {
    var d = new NativeBuffer(32);
    return pack25519(d, a2), d[0] & 1;
  }
  function scalarmult(p4, q4, s2) {
    var b, i5;
    set25519(p4[0], gf0), set25519(p4[1], gf1), set25519(p4[2], gf1), set25519(p4[3], gf0);
    for (i5 = 255;i5 >= 0; --i5)
      b = s2[i5 / 8 | 0] >> (i5 & 7) & 1, cswap(p4, q4, b), add(q4, p4), add(p4, p4), cswap(p4, q4, b);
  }
  function scalarbase(p4, s2) {
    var q4 = [gf(), gf(), gf(), gf()];
    set25519(q4[0], X), set25519(q4[1], Y), set25519(q4[2], gf1), M2(q4[3], X, Y), scalarmult(p4, q4, s2);
  }
  function set25519(r4, a2) {
    var i5;
    for (i5 = 0;i5 < 16; i5++)
      r4[i5] = a2[i5] | 0;
  }
  function inv25519(o5, i5) {
    var c3 = gf(), a2;
    for (a2 = 0;a2 < 16; ++a2)
      c3[a2] = i5[a2];
    for (a2 = 253;a2 >= 0; --a2)
      if (S2(c3, c3), a2 !== 2 && a2 !== 4)
        M2(c3, c3, i5);
    for (a2 = 0;a2 < 16; ++a2)
      o5[a2] = c3[a2];
  }
  function car25519(o5) {
    var i5, v2, c3 = 1;
    for (i5 = 0;i5 < 16; ++i5)
      v2 = o5[i5] + c3 + 65535, c3 = Math.floor(v2 / 65536), o5[i5] = v2 - c3 * 65536;
    o5[0] += c3 - 1 + 37 * (c3 - 1);
  }
  function sel25519(p4, q4, b) {
    var t2, c3 = ~(b - 1);
    for (var i5 = 0;i5 < 16; ++i5)
      t2 = c3 & (p4[i5] ^ q4[i5]), p4[i5] ^= t2, q4[i5] ^= t2;
  }
  function gf(init) {
    var i5, r4 = new Float64Array(16);
    if (init)
      for (i5 = 0;i5 < init.length; ++i5)
        r4[i5] = init[i5];
    return r4;
  }
  function A2(o5, a2, b) {
    for (var i5 = 0;i5 < 16; ++i5)
      o5[i5] = a2[i5] + b[i5];
  }
  function Z(o5, a2, b) {
    for (var i5 = 0;i5 < 16; ++i5)
      o5[i5] = a2[i5] - b[i5];
  }
  function S2(o5, a2) {
    M2(o5, a2, a2);
  }
  function M2(o5, a2, b) {
    var v2, c3, t0 = 0, t1 = 0, t2 = 0, t3 = 0, t4 = 0, t5 = 0, t6 = 0, t7 = 0, t8 = 0, t9 = 0, t10 = 0, t11 = 0, t12 = 0, t13 = 0, t14 = 0, t15 = 0, t16 = 0, t17 = 0, t18 = 0, t19 = 0, t20 = 0, t21 = 0, t22 = 0, t23 = 0, t24 = 0, t25 = 0, t26 = 0, t27 = 0, t28 = 0, t29 = 0, t30 = 0, b0 = b[0], b1 = b[1], b22 = b[2], b3 = b[3], b42 = b[4], b5 = b[5], b6 = b[6], b7 = b[7], b82 = b[8], b9 = b[9], b10 = b[10], b11 = b[11], b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];
    v2 = a2[0], t0 += v2 * b0, t1 += v2 * b1, t2 += v2 * b22, t3 += v2 * b3, t4 += v2 * b42, t5 += v2 * b5, t6 += v2 * b6, t7 += v2 * b7, t8 += v2 * b82, t9 += v2 * b9, t10 += v2 * b10, t11 += v2 * b11, t12 += v2 * b12, t13 += v2 * b13, t14 += v2 * b14, t15 += v2 * b15, v2 = a2[1], t1 += v2 * b0, t2 += v2 * b1, t3 += v2 * b22, t4 += v2 * b3, t5 += v2 * b42, t6 += v2 * b5, t7 += v2 * b6, t8 += v2 * b7, t9 += v2 * b82, t10 += v2 * b9, t11 += v2 * b10, t12 += v2 * b11, t13 += v2 * b12, t14 += v2 * b13, t15 += v2 * b14, t16 += v2 * b15, v2 = a2[2], t2 += v2 * b0, t3 += v2 * b1, t4 += v2 * b22, t5 += v2 * b3, t6 += v2 * b42, t7 += v2 * b5, t8 += v2 * b6, t9 += v2 * b7, t10 += v2 * b82, t11 += v2 * b9, t12 += v2 * b10, t13 += v2 * b11, t14 += v2 * b12, t15 += v2 * b13, t16 += v2 * b14, t17 += v2 * b15, v2 = a2[3], t3 += v2 * b0, t4 += v2 * b1, t5 += v2 * b22, t6 += v2 * b3, t7 += v2 * b42, t8 += v2 * b5, t9 += v2 * b6, t10 += v2 * b7, t11 += v2 * b82, t12 += v2 * b9, t13 += v2 * b10, t14 += v2 * b11, t15 += v2 * b12, t16 += v2 * b13, t17 += v2 * b14, t18 += v2 * b15, v2 = a2[4], t4 += v2 * b0, t5 += v2 * b1, t6 += v2 * b22, t7 += v2 * b3, t8 += v2 * b42, t9 += v2 * b5, t10 += v2 * b6, t11 += v2 * b7, t12 += v2 * b82, t13 += v2 * b9, t14 += v2 * b10, t15 += v2 * b11, t16 += v2 * b12, t17 += v2 * b13, t18 += v2 * b14, t19 += v2 * b15, v2 = a2[5], t5 += v2 * b0, t6 += v2 * b1, t7 += v2 * b22, t8 += v2 * b3, t9 += v2 * b42, t10 += v2 * b5, t11 += v2 * b6, t12 += v2 * b7, t13 += v2 * b82, t14 += v2 * b9, t15 += v2 * b10, t16 += v2 * b11, t17 += v2 * b12, t18 += v2 * b13, t19 += v2 * b14, t20 += v2 * b15, v2 = a2[6], t6 += v2 * b0, t7 += v2 * b1, t8 += v2 * b22, t9 += v2 * b3, t10 += v2 * b42, t11 += v2 * b5, t12 += v2 * b6, t13 += v2 * b7, t14 += v2 * b82, t15 += v2 * b9, t16 += v2 * b10, t17 += v2 * b11, t18 += v2 * b12, t19 += v2 * b13, t20 += v2 * b14, t21 += v2 * b15, v2 = a2[7], t7 += v2 * b0, t8 += v2 * b1, t9 += v2 * b22, t10 += v2 * b3, t11 += v2 * b42, t12 += v2 * b5, t13 += v2 * b6, t14 += v2 * b7, t15 += v2 * b82, t16 += v2 * b9, t17 += v2 * b10, t18 += v2 * b11, t19 += v2 * b12, t20 += v2 * b13, t21 += v2 * b14, t22 += v2 * b15, v2 = a2[8], t8 += v2 * b0, t9 += v2 * b1, t10 += v2 * b22, t11 += v2 * b3, t12 += v2 * b42, t13 += v2 * b5, t14 += v2 * b6, t15 += v2 * b7, t16 += v2 * b82, t17 += v2 * b9, t18 += v2 * b10, t19 += v2 * b11, t20 += v2 * b12, t21 += v2 * b13, t22 += v2 * b14, t23 += v2 * b15, v2 = a2[9], t9 += v2 * b0, t10 += v2 * b1, t11 += v2 * b22, t12 += v2 * b3, t13 += v2 * b42, t14 += v2 * b5, t15 += v2 * b6, t16 += v2 * b7, t17 += v2 * b82, t18 += v2 * b9, t19 += v2 * b10, t20 += v2 * b11, t21 += v2 * b12, t22 += v2 * b13, t23 += v2 * b14, t24 += v2 * b15, v2 = a2[10], t10 += v2 * b0, t11 += v2 * b1, t12 += v2 * b22, t13 += v2 * b3, t14 += v2 * b42, t15 += v2 * b5, t16 += v2 * b6, t17 += v2 * b7, t18 += v2 * b82, t19 += v2 * b9, t20 += v2 * b10, t21 += v2 * b11, t22 += v2 * b12, t23 += v2 * b13, t24 += v2 * b14, t25 += v2 * b15, v2 = a2[11], t11 += v2 * b0, t12 += v2 * b1, t13 += v2 * b22, t14 += v2 * b3, t15 += v2 * b42, t16 += v2 * b5, t17 += v2 * b6, t18 += v2 * b7, t19 += v2 * b82, t20 += v2 * b9, t21 += v2 * b10, t22 += v2 * b11, t23 += v2 * b12, t24 += v2 * b13, t25 += v2 * b14, t26 += v2 * b15, v2 = a2[12], t12 += v2 * b0, t13 += v2 * b1, t14 += v2 * b22, t15 += v2 * b3, t16 += v2 * b42, t17 += v2 * b5, t18 += v2 * b6, t19 += v2 * b7, t20 += v2 * b82, t21 += v2 * b9, t22 += v2 * b10, t23 += v2 * b11, t24 += v2 * b12, t25 += v2 * b13, t26 += v2 * b14, t27 += v2 * b15, v2 = a2[13], t13 += v2 * b0, t14 += v2 * b1, t15 += v2 * b22, t16 += v2 * b3, t17 += v2 * b42, t18 += v2 * b5, t19 += v2 * b6, t20 += v2 * b7, t21 += v2 * b82, t22 += v2 * b9, t23 += v2 * b10, t24 += v2 * b11, t25 += v2 * b12, t26 += v2 * b13, t27 += v2 * b14, t28 += v2 * b15, v2 = a2[14], t14 += v2 * b0, t15 += v2 * b1, t16 += v2 * b22, t17 += v2 * b3, t18 += v2 * b42, t19 += v2 * b5, t20 += v2 * b6, t21 += v2 * b7, t22 += v2 * b82, t23 += v2 * b9, t24 += v2 * b10, t25 += v2 * b11, t26 += v2 * b12, t27 += v2 * b13, t28 += v2 * b14, t29 += v2 * b15, v2 = a2[15], t15 += v2 * b0, t16 += v2 * b1, t17 += v2 * b22, t18 += v2 * b3, t19 += v2 * b42, t20 += v2 * b5, t21 += v2 * b6, t22 += v2 * b7, t23 += v2 * b82, t24 += v2 * b9, t25 += v2 * b10, t26 += v2 * b11, t27 += v2 * b12, t28 += v2 * b13, t29 += v2 * b14, t30 += v2 * b15, t0 += 38 * t16, t1 += 38 * t17, t2 += 38 * t18, t3 += 38 * t19, t4 += 38 * t20, t5 += 38 * t21, t6 += 38 * t22, t7 += 38 * t23, t8 += 38 * t24, t9 += 38 * t25, t10 += 38 * t26, t11 += 38 * t27, t12 += 38 * t28, t13 += 38 * t29, t14 += 38 * t30, c3 = 1, v2 = t0 + c3 + 65535, c3 = Math.floor(v2 / 65536), t0 = v2 - c3 * 65536, v2 = t1 + c3 + 65535, c3 = Math.floor(v2 / 65536), t1 = v2 - c3 * 65536, v2 = t2 + c3 + 65535, c3 = Math.floor(v2 / 65536), t2 = v2 - c3 * 65536, v2 = t3 + c3 + 65535, c3 = Math.floor(v2 / 65536), t3 = v2 - c3 * 65536, v2 = t4 + c3 + 65535, c3 = Math.floor(v2 / 65536), t4 = v2 - c3 * 65536, v2 = t5 + c3 + 65535, c3 = Math.floor(v2 / 65536), t5 = v2 - c3 * 65536, v2 = t6 + c3 + 65535, c3 = Math.floor(v2 / 65536), t6 = v2 - c3 * 65536, v2 = t7 + c3 + 65535, c3 = Math.floor(v2 / 65536), t7 = v2 - c3 * 65536, v2 = t8 + c3 + 65535, c3 = Math.floor(v2 / 65536), t8 = v2 - c3 * 65536, v2 = t9 + c3 + 65535, c3 = Math.floor(v2 / 65536), t9 = v2 - c3 * 65536, v2 = t10 + c3 + 65535, c3 = Math.floor(v2 / 65536), t10 = v2 - c3 * 65536, v2 = t11 + c3 + 65535, c3 = Math.floor(v2 / 65536), t11 = v2 - c3 * 65536, v2 = t12 + c3 + 65535, c3 = Math.floor(v2 / 65536), t12 = v2 - c3 * 65536, v2 = t13 + c3 + 65535, c3 = Math.floor(v2 / 65536), t13 = v2 - c3 * 65536, v2 = t14 + c3 + 65535, c3 = Math.floor(v2 / 65536), t14 = v2 - c3 * 65536, v2 = t15 + c3 + 65535, c3 = Math.floor(v2 / 65536), t15 = v2 - c3 * 65536, t0 += c3 - 1 + 37 * (c3 - 1), c3 = 1, v2 = t0 + c3 + 65535, c3 = Math.floor(v2 / 65536), t0 = v2 - c3 * 65536, v2 = t1 + c3 + 65535, c3 = Math.floor(v2 / 65536), t1 = v2 - c3 * 65536, v2 = t2 + c3 + 65535, c3 = Math.floor(v2 / 65536), t2 = v2 - c3 * 65536, v2 = t3 + c3 + 65535, c3 = Math.floor(v2 / 65536), t3 = v2 - c3 * 65536, v2 = t4 + c3 + 65535, c3 = Math.floor(v2 / 65536), t4 = v2 - c3 * 65536, v2 = t5 + c3 + 65535, c3 = Math.floor(v2 / 65536), t5 = v2 - c3 * 65536, v2 = t6 + c3 + 65535, c3 = Math.floor(v2 / 65536), t6 = v2 - c3 * 65536, v2 = t7 + c3 + 65535, c3 = Math.floor(v2 / 65536), t7 = v2 - c3 * 65536, v2 = t8 + c3 + 65535, c3 = Math.floor(v2 / 65536), t8 = v2 - c3 * 65536, v2 = t9 + c3 + 65535, c3 = Math.floor(v2 / 65536), t9 = v2 - c3 * 65536, v2 = t10 + c3 + 65535, c3 = Math.floor(v2 / 65536), t10 = v2 - c3 * 65536, v2 = t11 + c3 + 65535, c3 = Math.floor(v2 / 65536), t11 = v2 - c3 * 65536, v2 = t12 + c3 + 65535, c3 = Math.floor(v2 / 65536), t12 = v2 - c3 * 65536, v2 = t13 + c3 + 65535, c3 = Math.floor(v2 / 65536), t13 = v2 - c3 * 65536, v2 = t14 + c3 + 65535, c3 = Math.floor(v2 / 65536), t14 = v2 - c3 * 65536, v2 = t15 + c3 + 65535, c3 = Math.floor(v2 / 65536), t15 = v2 - c3 * 65536, t0 += c3 - 1 + 37 * (c3 - 1), o5[0] = t0, o5[1] = t1, o5[2] = t2, o5[3] = t3, o5[4] = t4, o5[5] = t5, o5[6] = t6, o5[7] = t7, o5[8] = t8, o5[9] = t9, o5[10] = t10, o5[11] = t11, o5[12] = t12, o5[13] = t13, o5[14] = t14, o5[15] = t15;
  }
});
