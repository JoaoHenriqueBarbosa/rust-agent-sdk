// var: require_rsa
var require_rsa = __commonJS((exports, module) => {
  var forge = require_forge();
  require_asn1();
  require_jsbn();
  require_oids();
  require_pkcs1();
  require_prime();
  require_random();
  require_util3();
  if (typeof BigInteger > "u")
    BigInteger = forge.jsbn.BigInteger;
  var BigInteger, _crypto = forge.util.isNodejs ? __require("crypto") : null, asn1 = forge.asn1, util12 = forge.util;
  forge.pki = forge.pki || {};
  module.exports = forge.pki.rsa = forge.rsa = forge.rsa || {};
  var pki = forge.pki, GCD_30_DELTA = [6, 4, 2, 4, 2, 4, 6, 2], privateKeyValidator = {
    name: "PrivateKeyInfo",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: !0,
    value: [{
      name: "PrivateKeyInfo.version",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.INTEGER,
      constructed: !1,
      capture: "privateKeyVersion"
    }, {
      name: "PrivateKeyInfo.privateKeyAlgorithm",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: !0,
      value: [{
        name: "AlgorithmIdentifier.algorithm",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.OID,
        constructed: !1,
        capture: "privateKeyOid"
      }]
    }, {
      name: "PrivateKeyInfo",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.OCTETSTRING,
      constructed: !1,
      capture: "privateKey"
    }]
  }, rsaPrivateKeyValidator = {
    name: "RSAPrivateKey",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: !0,
    value: [{
      name: "RSAPrivateKey.version",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.INTEGER,
      constructed: !1,
      capture: "privateKeyVersion"
    }, {
      name: "RSAPrivateKey.modulus",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.INTEGER,
      constructed: !1,
      capture: "privateKeyModulus"
    }, {
      name: "RSAPrivateKey.publicExponent",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.INTEGER,
      constructed: !1,
      capture: "privateKeyPublicExponent"
    }, {
      name: "RSAPrivateKey.privateExponent",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.INTEGER,
      constructed: !1,
      capture: "privateKeyPrivateExponent"
    }, {
      name: "RSAPrivateKey.prime1",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.INTEGER,
      constructed: !1,
      capture: "privateKeyPrime1"
    }, {
      name: "RSAPrivateKey.prime2",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.INTEGER,
      constructed: !1,
      capture: "privateKeyPrime2"
    }, {
      name: "RSAPrivateKey.exponent1",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.INTEGER,
      constructed: !1,
      capture: "privateKeyExponent1"
    }, {
      name: "RSAPrivateKey.exponent2",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.INTEGER,
      constructed: !1,
      capture: "privateKeyExponent2"
    }, {
      name: "RSAPrivateKey.coefficient",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.INTEGER,
      constructed: !1,
      capture: "privateKeyCoefficient"
    }]
  }, rsaPublicKeyValidator = {
    name: "RSAPublicKey",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: !0,
    value: [{
      name: "RSAPublicKey.modulus",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.INTEGER,
      constructed: !1,
      capture: "publicKeyModulus"
    }, {
      name: "RSAPublicKey.exponent",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.INTEGER,
      constructed: !1,
      capture: "publicKeyExponent"
    }]
  }, publicKeyValidator = forge.pki.rsa.publicKeyValidator = {
    name: "SubjectPublicKeyInfo",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: !0,
    captureAsn1: "subjectPublicKeyInfo",
    value: [{
      name: "SubjectPublicKeyInfo.AlgorithmIdentifier",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: !0,
      value: [{
        name: "AlgorithmIdentifier.algorithm",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.OID,
        constructed: !1,
        capture: "publicKeyOid"
      }]
    }, {
      name: "SubjectPublicKeyInfo.subjectPublicKey",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.BITSTRING,
      constructed: !1,
      value: [{
        name: "SubjectPublicKeyInfo.subjectPublicKey.RSAPublicKey",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: !0,
        optional: !0,
        captureAsn1: "rsaPublicKey"
      }]
    }]
  }, digestInfoValidator = {
    name: "DigestInfo",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: !0,
    value: [{
      name: "DigestInfo.DigestAlgorithm",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: !0,
      value: [{
        name: "DigestInfo.DigestAlgorithm.algorithmIdentifier",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.OID,
        constructed: !1,
        capture: "algorithmIdentifier"
      }, {
        name: "DigestInfo.DigestAlgorithm.parameters",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.NULL,
        capture: "parameters",
        optional: !0,
        constructed: !1
      }]
    }, {
      name: "DigestInfo.digest",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.OCTETSTRING,
      constructed: !1,
      capture: "digest"
    }]
  }, emsaPkcs1v15encode = function(md) {
    var oid;
    if (md.algorithm in pki.oids)
      oid = pki.oids[md.algorithm];
    else {
      var error44 = Error("Unknown message digest algorithm.");
      throw error44.algorithm = md.algorithm, error44;
    }
    var oidBytes = asn1.oidToDer(oid).getBytes(), digestInfo = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, []), digestAlgorithm = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, []);
    digestAlgorithm.value.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, !1, oidBytes)), digestAlgorithm.value.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, !1, ""));
    var digest = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, !1, md.digest().getBytes());
    return digestInfo.value.push(digestAlgorithm), digestInfo.value.push(digest), asn1.toDer(digestInfo).getBytes();
  }, _modPow = function(x4, key2, pub) {
    if (pub)
      return x4.modPow(key2.e, key2.n);
    if (!key2.p || !key2.q)
      return x4.modPow(key2.d, key2.n);
    if (!key2.dP)
      key2.dP = key2.d.mod(key2.p.subtract(BigInteger.ONE));
    if (!key2.dQ)
      key2.dQ = key2.d.mod(key2.q.subtract(BigInteger.ONE));
    if (!key2.qInv)
      key2.qInv = key2.q.modInverse(key2.p);
    var r4;
    do
      r4 = new BigInteger(forge.util.bytesToHex(forge.random.getBytes(key2.n.bitLength() / 8)), 16);
    while (r4.compareTo(key2.n) >= 0 || !r4.gcd(key2.n).equals(BigInteger.ONE));
    x4 = x4.multiply(r4.modPow(key2.e, key2.n)).mod(key2.n);
    var xp = x4.mod(key2.p).modPow(key2.dP, key2.p), xq = x4.mod(key2.q).modPow(key2.dQ, key2.q);
    while (xp.compareTo(xq) < 0)
      xp = xp.add(key2.p);
    var y2 = xp.subtract(xq).multiply(key2.qInv).mod(key2.p).multiply(key2.q).add(xq);
    return y2 = y2.multiply(r4.modInverse(key2.n)).mod(key2.n), y2;
  };
  pki.rsa.encrypt = function(m4, key2, bt) {
    var pub = bt, eb, k3 = Math.ceil(key2.n.bitLength() / 8);
    if (bt !== !1 && bt !== !0)
      pub = bt === 2, eb = _encodePkcs1_v1_5(m4, key2, bt);
    else
      eb = forge.util.createBuffer(), eb.putBytes(m4);
    var x4 = new BigInteger(eb.toHex(), 16), y2 = _modPow(x4, key2, pub), yhex = y2.toString(16), ed = forge.util.createBuffer(), zeros = k3 - Math.ceil(yhex.length / 2);
    while (zeros > 0)
      ed.putByte(0), --zeros;
    return ed.putBytes(forge.util.hexToBytes(yhex)), ed.getBytes();
  };
  pki.rsa.decrypt = function(ed, key2, pub, ml) {
    var k3 = Math.ceil(key2.n.bitLength() / 8);
    if (ed.length !== k3) {
      var error44 = Error("Encrypted message length is invalid.");
      throw error44.length = ed.length, error44.expected = k3, error44;
    }
    var y2 = new BigInteger(forge.util.createBuffer(ed).toHex(), 16);
    if (y2.compareTo(key2.n) >= 0)
      throw Error("Encrypted message is invalid.");
    var x4 = _modPow(y2, key2, pub), xhex = x4.toString(16), eb = forge.util.createBuffer(), zeros = k3 - Math.ceil(xhex.length / 2);
    while (zeros > 0)
      eb.putByte(0), --zeros;
    if (eb.putBytes(forge.util.hexToBytes(xhex)), ml !== !1)
      return _decodePkcs1_v1_5(eb.getBytes(), key2, pub);
    return eb.getBytes();
  };
  pki.rsa.createKeyPairGenerationState = function(bits2, e, options) {
    if (typeof bits2 === "string")
      bits2 = parseInt(bits2, 10);
    bits2 = bits2 || 2048, options = options || {};
    var prng = options.prng || forge.random, rng = {
      nextBytes: function(x4) {
        var b = prng.getBytesSync(x4.length);
        for (var i5 = 0;i5 < x4.length; ++i5)
          x4[i5] = b.charCodeAt(i5);
      }
    }, algorithm = options.algorithm || "PRIMEINC", rval;
    if (algorithm === "PRIMEINC")
      rval = {
        algorithm,
        state: 0,
        bits: bits2,
        rng,
        eInt: e || 65537,
        e: new BigInteger(null),
        p: null,
        q: null,
        qBits: bits2 >> 1,
        pBits: bits2 - (bits2 >> 1),
        pqState: 0,
        num: null,
        keys: null
      }, rval.e.fromInt(rval.eInt);
    else
      throw Error("Invalid key generation algorithm: " + algorithm);
    return rval;
  };
  pki.rsa.stepKeyPairGenerationState = function(state3, n5) {
    if (!("algorithm" in state3))
      state3.algorithm = "PRIMEINC";
    var THIRTY = new BigInteger(null);
    THIRTY.fromInt(30);
    var deltaIdx = 0, op_or = function(x4, y2) {
      return x4 | y2;
    }, t1 = +/* @__PURE__ */ new Date, t2, total = 0;
    while (state3.keys === null && (n5 <= 0 || total < n5)) {
      if (state3.state === 0) {
        var bits2 = state3.p === null ? state3.pBits : state3.qBits, bits1 = bits2 - 1;
        if (state3.pqState === 0) {
          if (state3.num = new BigInteger(bits2, state3.rng), !state3.num.testBit(bits1))
            state3.num.bitwiseTo(BigInteger.ONE.shiftLeft(bits1), op_or, state3.num);
          state3.num.dAddOffset(31 - state3.num.mod(THIRTY).byteValue(), 0), deltaIdx = 0, ++state3.pqState;
        } else if (state3.pqState === 1)
          if (state3.num.bitLength() > bits2)
            state3.pqState = 0;
          else if (state3.num.isProbablePrime(_getMillerRabinTests(state3.num.bitLength())))
            ++state3.pqState;
          else
            state3.num.dAddOffset(GCD_30_DELTA[deltaIdx++ % 8], 0);
        else if (state3.pqState === 2)
          state3.pqState = state3.num.subtract(BigInteger.ONE).gcd(state3.e).compareTo(BigInteger.ONE) === 0 ? 3 : 0;
        else if (state3.pqState === 3) {
          if (state3.pqState = 0, state3.p === null)
            state3.p = state3.num;
          else
            state3.q = state3.num;
          if (state3.p !== null && state3.q !== null)
            ++state3.state;
          state3.num = null;
        }
      } else if (state3.state === 1) {
        if (state3.p.compareTo(state3.q) < 0)
          state3.num = state3.p, state3.p = state3.q, state3.q = state3.num;
        ++state3.state;
      } else if (state3.state === 2)
        state3.p1 = state3.p.subtract(BigInteger.ONE), state3.q1 = state3.q.subtract(BigInteger.ONE), state3.phi = state3.p1.multiply(state3.q1), ++state3.state;
      else if (state3.state === 3)
        if (state3.phi.gcd(state3.e).compareTo(BigInteger.ONE) === 0)
          ++state3.state;
        else
          state3.p = null, state3.q = null, state3.state = 0;
      else if (state3.state === 4)
        if (state3.n = state3.p.multiply(state3.q), state3.n.bitLength() === state3.bits)
          ++state3.state;
        else
          state3.q = null, state3.state = 0;
      else if (state3.state === 5) {
        var d = state3.e.modInverse(state3.phi);
        state3.keys = {
          privateKey: pki.rsa.setPrivateKey(state3.n, state3.e, d, state3.p, state3.q, d.mod(state3.p1), d.mod(state3.q1), state3.q.modInverse(state3.p)),
          publicKey: pki.rsa.setPublicKey(state3.n, state3.e)
        };
      }
      t2 = +/* @__PURE__ */ new Date, total += t2 - t1, t1 = t2;
    }
    return state3.keys !== null;
  };
  pki.rsa.generateKeyPair = function(bits2, e, options, callback) {
    if (arguments.length === 1) {
      if (typeof bits2 === "object")
        options = bits2, bits2 = void 0;
      else if (typeof bits2 === "function")
        callback = bits2, bits2 = void 0;
    } else if (arguments.length === 2)
      if (typeof bits2 === "number") {
        if (typeof e === "function")
          callback = e, e = void 0;
        else if (typeof e !== "number")
          options = e, e = void 0;
      } else
        options = bits2, callback = e, bits2 = void 0, e = void 0;
    else if (arguments.length === 3)
      if (typeof e === "number") {
        if (typeof options === "function")
          callback = options, options = void 0;
      } else
        callback = options, options = e, e = void 0;
    if (options = options || {}, bits2 === void 0)
      bits2 = options.bits || 2048;
    if (e === void 0)
      e = options.e || 65537;
    if (!forge.options.usePureJavaScript && !options.prng && bits2 >= 256 && bits2 <= 16384 && (e === 65537 || e === 3)) {
      if (callback) {
        if (_detectNodeCrypto("generateKeyPair"))
          return _crypto.generateKeyPair("rsa", {
            modulusLength: bits2,
            publicExponent: e,
            publicKeyEncoding: {
              type: "spki",
              format: "pem"
            },
            privateKeyEncoding: {
              type: "pkcs8",
              format: "pem"
            }
          }, function(err2, pub, priv) {
            if (err2)
              return callback(err2);
            callback(null, {
              privateKey: pki.privateKeyFromPem(priv),
              publicKey: pki.publicKeyFromPem(pub)
            });
          });
        if (_detectSubtleCrypto("generateKey") && _detectSubtleCrypto("exportKey"))
          return util12.globalScope.crypto.subtle.generateKey({
            name: "RSASSA-PKCS1-v1_5",
            modulusLength: bits2,
            publicExponent: _intToUint8Array(e),
            hash: { name: "SHA-256" }
          }, !0, ["sign", "verify"]).then(function(pair) {
            return util12.globalScope.crypto.subtle.exportKey("pkcs8", pair.privateKey);
          }).then(void 0, function(err2) {
            callback(err2);
          }).then(function(pkcs8) {
            if (pkcs8) {
              var privateKey = pki.privateKeyFromAsn1(asn1.fromDer(forge.util.createBuffer(pkcs8)));
              callback(null, {
                privateKey,
                publicKey: pki.setRsaPublicKey(privateKey.n, privateKey.e)
              });
            }
          });
        if (_detectSubtleMsCrypto("generateKey") && _detectSubtleMsCrypto("exportKey")) {
          var genOp = util12.globalScope.msCrypto.subtle.generateKey({
            name: "RSASSA-PKCS1-v1_5",
            modulusLength: bits2,
            publicExponent: _intToUint8Array(e),
            hash: { name: "SHA-256" }
          }, !0, ["sign", "verify"]);
          genOp.oncomplete = function(e2) {
            var pair = e2.target.result, exportOp = util12.globalScope.msCrypto.subtle.exportKey("pkcs8", pair.privateKey);
            exportOp.oncomplete = function(e3) {
              var pkcs8 = e3.target.result, privateKey = pki.privateKeyFromAsn1(asn1.fromDer(forge.util.createBuffer(pkcs8)));
              callback(null, {
                privateKey,
                publicKey: pki.setRsaPublicKey(privateKey.n, privateKey.e)
              });
            }, exportOp.onerror = function(err2) {
              callback(err2);
            };
          }, genOp.onerror = function(err2) {
            callback(err2);
          };
          return;
        }
      } else if (_detectNodeCrypto("generateKeyPairSync")) {
        var keypair = _crypto.generateKeyPairSync("rsa", {
          modulusLength: bits2,
          publicExponent: e,
          publicKeyEncoding: {
            type: "spki",
            format: "pem"
          },
          privateKeyEncoding: {
            type: "pkcs8",
            format: "pem"
          }
        });
        return {
          privateKey: pki.privateKeyFromPem(keypair.privateKey),
          publicKey: pki.publicKeyFromPem(keypair.publicKey)
        };
      }
    }
    var state3 = pki.rsa.createKeyPairGenerationState(bits2, e, options);
    if (!callback)
      return pki.rsa.stepKeyPairGenerationState(state3, 0), state3.keys;
    _generateKeyPair(state3, options, callback);
  };
  pki.setRsaPublicKey = pki.rsa.setPublicKey = function(n5, e) {
    var key2 = {
      n: n5,
      e
    };
    return key2.encrypt = function(data, scheme, schemeOptions) {
      if (typeof scheme === "string")
        scheme = scheme.toUpperCase();
      else if (scheme === void 0)
        scheme = "RSAES-PKCS1-V1_5";
      if (scheme === "RSAES-PKCS1-V1_5")
        scheme = {
          encode: function(m4, key3, pub) {
            return _encodePkcs1_v1_5(m4, key3, 2).getBytes();
          }
        };
      else if (scheme === "RSA-OAEP" || scheme === "RSAES-OAEP")
        scheme = {
          encode: function(m4, key3) {
            return forge.pkcs1.encode_rsa_oaep(key3, m4, schemeOptions);
          }
        };
      else if (["RAW", "NONE", "NULL", null].indexOf(scheme) !== -1)
        scheme = { encode: function(e3) {
          return e3;
        } };
      else if (typeof scheme === "string")
        throw Error('Unsupported encryption scheme: "' + scheme + '".');
      var e2 = scheme.encode(data, key2, !0);
      return pki.rsa.encrypt(e2, key2, !0);
    }, key2.verify = function(digest, signature7, scheme, options) {
      if (typeof scheme === "string")
        scheme = scheme.toUpperCase();
      else if (scheme === void 0)
        scheme = "RSASSA-PKCS1-V1_5";
      if (options === void 0)
        options = {
          _parseAllDigestBytes: !0,
          _skipPaddingChecks: !1
        };
      if (!("_parseAllDigestBytes" in options))
        options._parseAllDigestBytes = !0;
      if (!("_skipPaddingChecks" in options))
        options._skipPaddingChecks = !1;
      if (scheme === "RSASSA-PKCS1-V1_5")
        scheme = {
          verify: function(digest2, d2) {
            d2 = _decodePkcs1_v1_5(d2, key2, !0, void 0, options);
            var obj = asn1.fromDer(d2, {
              parseAllBytes: options._parseAllDigestBytes
            }), capture = {}, errors8 = [];
            if (!asn1.validate(obj, digestInfoValidator, capture, errors8) || obj.value.length !== 2) {
              var error44 = Error("ASN.1 object does not contain a valid RSASSA-PKCS1-v1_5 DigestInfo value.");
              throw error44.errors = errors8, error44;
            }
            var oid = asn1.derToOid(capture.algorithmIdentifier);
            if (!(oid === forge.oids.md2 || oid === forge.oids.md5 || oid === forge.oids.sha1 || oid === forge.oids.sha224 || oid === forge.oids.sha256 || oid === forge.oids.sha384 || oid === forge.oids.sha512 || oid === forge.oids["sha512-224"] || oid === forge.oids["sha512-256"])) {
              var error44 = Error("Unknown RSASSA-PKCS1-v1_5 DigestAlgorithm identifier.");
              throw error44.oid = oid, error44;
            }
            if (oid === forge.oids.md2 || oid === forge.oids.md5) {
              if (!("parameters" in capture))
                throw Error("ASN.1 object does not contain a valid RSASSA-PKCS1-v1_5 DigestInfo value. Missing algorithm identifier NULL parameters.");
            }
            return digest2 === capture.digest;
          }
        };
      else if (scheme === "NONE" || scheme === "NULL" || scheme === null)
        scheme = {
          verify: function(digest2, d2) {
            return d2 = _decodePkcs1_v1_5(d2, key2, !0, void 0, options), digest2 === d2;
          }
        };
      var d = pki.rsa.decrypt(signature7, key2, !0, !1);
      return scheme.verify(digest, d, key2.n.bitLength());
    }, key2;
  };
  pki.setRsaPrivateKey = pki.rsa.setPrivateKey = function(n5, e, d, p4, q4, dP, dQ, qInv) {
    var key2 = {
      n: n5,
      e,
      d,
      p: p4,
      q: q4,
      dP,
      dQ,
      qInv
    };
    return key2.decrypt = function(data, scheme, schemeOptions) {
      if (typeof scheme === "string")
        scheme = scheme.toUpperCase();
      else if (scheme === void 0)
        scheme = "RSAES-PKCS1-V1_5";
      var d2 = pki.rsa.decrypt(data, key2, !1, !1);
      if (scheme === "RSAES-PKCS1-V1_5")
        scheme = { decode: _decodePkcs1_v1_5 };
      else if (scheme === "RSA-OAEP" || scheme === "RSAES-OAEP")
        scheme = {
          decode: function(d3, key3) {
            return forge.pkcs1.decode_rsa_oaep(key3, d3, schemeOptions);
          }
        };
      else if (["RAW", "NONE", "NULL", null].indexOf(scheme) !== -1)
        scheme = { decode: function(d3) {
          return d3;
        } };
      else
        throw Error('Unsupported encryption scheme: "' + scheme + '".');
      return scheme.decode(d2, key2, !1);
    }, key2.sign = function(md, scheme) {
      var bt = !1;
      if (typeof scheme === "string")
        scheme = scheme.toUpperCase();
      if (scheme === void 0 || scheme === "RSASSA-PKCS1-V1_5")
        scheme = { encode: emsaPkcs1v15encode }, bt = 1;
      else if (scheme === "NONE" || scheme === "NULL" || scheme === null)
        scheme = { encode: function() {
          return md;
        } }, bt = 1;
      var d2 = scheme.encode(md, key2.n.bitLength());
      return pki.rsa.encrypt(d2, key2, bt);
    }, key2;
  };
  pki.wrapRsaPrivateKey = function(rsaKey) {
    return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, [
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, !1, asn1.integerToDer(0).getBytes()),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, !1, asn1.oidToDer(pki.oids.rsaEncryption).getBytes()),
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, !1, "")
      ]),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, !1, asn1.toDer(rsaKey).getBytes())
    ]);
  };
  pki.privateKeyFromAsn1 = function(obj) {
    var capture = {}, errors8 = [];
    if (asn1.validate(obj, privateKeyValidator, capture, errors8))
      obj = asn1.fromDer(forge.util.createBuffer(capture.privateKey));
    if (capture = {}, errors8 = [], !asn1.validate(obj, rsaPrivateKeyValidator, capture, errors8)) {
      var error44 = Error("Cannot read private key. ASN.1 object does not contain an RSAPrivateKey.");
      throw error44.errors = errors8, error44;
    }
    var n5, e, d, p4, q4, dP, dQ, qInv;
    return n5 = forge.util.createBuffer(capture.privateKeyModulus).toHex(), e = forge.util.createBuffer(capture.privateKeyPublicExponent).toHex(), d = forge.util.createBuffer(capture.privateKeyPrivateExponent).toHex(), p4 = forge.util.createBuffer(capture.privateKeyPrime1).toHex(), q4 = forge.util.createBuffer(capture.privateKeyPrime2).toHex(), dP = forge.util.createBuffer(capture.privateKeyExponent1).toHex(), dQ = forge.util.createBuffer(capture.privateKeyExponent2).toHex(), qInv = forge.util.createBuffer(capture.privateKeyCoefficient).toHex(), pki.setRsaPrivateKey(new BigInteger(n5, 16), new BigInteger(e, 16), new BigInteger(d, 16), new BigInteger(p4, 16), new BigInteger(q4, 16), new BigInteger(dP, 16), new BigInteger(dQ, 16), new BigInteger(qInv, 16));
  };
  pki.privateKeyToAsn1 = pki.privateKeyToRSAPrivateKey = function(key2) {
    return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, [
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, !1, asn1.integerToDer(0).getBytes()),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, !1, _bnToBytes(key2.n)),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, !1, _bnToBytes(key2.e)),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, !1, _bnToBytes(key2.d)),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, !1, _bnToBytes(key2.p)),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, !1, _bnToBytes(key2.q)),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, !1, _bnToBytes(key2.dP)),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, !1, _bnToBytes(key2.dQ)),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, !1, _bnToBytes(key2.qInv))
    ]);
  };
  pki.publicKeyFromAsn1 = function(obj) {
    var capture = {}, errors8 = [];
    if (asn1.validate(obj, publicKeyValidator, capture, errors8)) {
      var oid = asn1.derToOid(capture.publicKeyOid);
      if (oid !== pki.oids.rsaEncryption) {
        var error44 = Error("Cannot read public key. Unknown OID.");
        throw error44.oid = oid, error44;
      }
      obj = capture.rsaPublicKey;
    }
    if (errors8 = [], !asn1.validate(obj, rsaPublicKeyValidator, capture, errors8)) {
      var error44 = Error("Cannot read public key. ASN.1 object does not contain an RSAPublicKey.");
      throw error44.errors = errors8, error44;
    }
    var n5 = forge.util.createBuffer(capture.publicKeyModulus).toHex(), e = forge.util.createBuffer(capture.publicKeyExponent).toHex();
    return pki.setRsaPublicKey(new BigInteger(n5, 16), new BigInteger(e, 16));
  };
  pki.publicKeyToAsn1 = pki.publicKeyToSubjectPublicKeyInfo = function(key2) {
    return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, [
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, !1, asn1.oidToDer(pki.oids.rsaEncryption).getBytes()),
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, !1, "")
      ]),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BITSTRING, !1, [
        pki.publicKeyToRSAPublicKey(key2)
      ])
    ]);
  };
  pki.publicKeyToRSAPublicKey = function(key2) {
    return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, [
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, !1, _bnToBytes(key2.n)),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, !1, _bnToBytes(key2.e))
    ]);
  };
  function _encodePkcs1_v1_5(m4, key2, bt) {
    var eb = forge.util.createBuffer(), k3 = Math.ceil(key2.n.bitLength() / 8);
    if (m4.length > k3 - 11) {
      var error44 = Error("Message is too long for PKCS#1 v1.5 padding.");
      throw error44.length = m4.length, error44.max = k3 - 11, error44;
    }
    eb.putByte(0), eb.putByte(bt);
    var padNum = k3 - 3 - m4.length, padByte;
    if (bt === 0 || bt === 1) {
      padByte = bt === 0 ? 0 : 255;
      for (var i5 = 0;i5 < padNum; ++i5)
        eb.putByte(padByte);
    } else
      while (padNum > 0) {
        var numZeros = 0, padBytes = forge.random.getBytes(padNum);
        for (var i5 = 0;i5 < padNum; ++i5)
          if (padByte = padBytes.charCodeAt(i5), padByte === 0)
            ++numZeros;
          else
            eb.putByte(padByte);
        padNum = numZeros;
      }
    return eb.putByte(0), eb.putBytes(m4), eb;
  }
  function _decodePkcs1_v1_5(em, key2, pub, ml, options) {
    var k3 = Math.ceil(key2.n.bitLength() / 8), eb = forge.util.createBuffer(em), first = eb.getByte(), bt = eb.getByte();
    if (first !== 0 || pub && bt !== 0 && bt !== 1 || !pub && bt !== 2 || pub && bt === 0 && typeof ml > "u")
      throw Error("Encryption block is invalid.");
    var padNum = 0;
    if (bt === 0) {
      padNum = k3 - 3 - ml;
      for (var i5 = 0;i5 < padNum; ++i5)
        if (eb.getByte() !== 0)
          throw Error("Encryption block is invalid.");
    } else if (bt === 1) {
      padNum = 0;
      while (eb.length() > 1) {
        if (eb.getByte() !== 255) {
          --eb.read;
          break;
        }
        ++padNum;
      }
      if (padNum < 8 && !(options ? options._skipPaddingChecks : !1))
        throw Error("Encryption block is invalid.");
    } else if (bt === 2) {
      padNum = 0;
      while (eb.length() > 1) {
        if (eb.getByte() === 0) {
          --eb.read;
          break;
        }
        ++padNum;
      }
      if (padNum < 8 && !(options ? options._skipPaddingChecks : !1))
        throw Error("Encryption block is invalid.");
    }
    var zero = eb.getByte();
    if (zero !== 0 || padNum !== k3 - 3 - eb.length())
      throw Error("Encryption block is invalid.");
    return eb.getBytes();
  }
  function _generateKeyPair(state3, options, callback) {
    if (typeof options === "function")
      callback = options, options = {};
    options = options || {};
    var opts = {
      algorithm: {
        name: options.algorithm || "PRIMEINC",
        options: {
          workers: options.workers || 2,
          workLoad: options.workLoad || 100,
          workerScript: options.workerScript
        }
      }
    };
    if ("prng" in options)
      opts.prng = options.prng;
    generate2();
    function generate2() {
      getPrime(state3.pBits, function(err2, num) {
        if (err2)
          return callback(err2);
        if (state3.p = num, state3.q !== null)
          return finish(err2, state3.q);
        getPrime(state3.qBits, finish);
      });
    }
    function getPrime(bits2, callback2) {
      forge.prime.generateProbablePrime(bits2, opts, callback2);
    }
    function finish(err2, num) {
      if (err2)
        return callback(err2);
      if (state3.q = num, state3.p.compareTo(state3.q) < 0) {
        var tmp = state3.p;
        state3.p = state3.q, state3.q = tmp;
      }
      if (state3.p.subtract(BigInteger.ONE).gcd(state3.e).compareTo(BigInteger.ONE) !== 0) {
        state3.p = null, generate2();
        return;
      }
      if (state3.q.subtract(BigInteger.ONE).gcd(state3.e).compareTo(BigInteger.ONE) !== 0) {
        state3.q = null, getPrime(state3.qBits, finish);
        return;
      }
      if (state3.p1 = state3.p.subtract(BigInteger.ONE), state3.q1 = state3.q.subtract(BigInteger.ONE), state3.phi = state3.p1.multiply(state3.q1), state3.phi.gcd(state3.e).compareTo(BigInteger.ONE) !== 0) {
        state3.p = state3.q = null, generate2();
        return;
      }
      if (state3.n = state3.p.multiply(state3.q), state3.n.bitLength() !== state3.bits) {
        state3.q = null, getPrime(state3.qBits, finish);
        return;
      }
      var d = state3.e.modInverse(state3.phi);
      state3.keys = {
        privateKey: pki.rsa.setPrivateKey(state3.n, state3.e, d, state3.p, state3.q, d.mod(state3.p1), d.mod(state3.q1), state3.q.modInverse(state3.p)),
        publicKey: pki.rsa.setPublicKey(state3.n, state3.e)
      }, callback(null, state3.keys);
    }
  }
  function _bnToBytes(b) {
    var hex = b.toString(16);
    if (hex[0] >= "8")
      hex = "00" + hex;
    var bytes = forge.util.hexToBytes(hex);
    if (bytes.length > 1 && (bytes.charCodeAt(0) === 0 && (bytes.charCodeAt(1) & 128) === 0 || bytes.charCodeAt(0) === 255 && (bytes.charCodeAt(1) & 128) === 128))
      return bytes.substr(1);
    return bytes;
  }
  function _getMillerRabinTests(bits2) {
    if (bits2 <= 100)
      return 27;
    if (bits2 <= 150)
      return 18;
    if (bits2 <= 200)
      return 15;
    if (bits2 <= 250)
      return 12;
    if (bits2 <= 300)
      return 9;
    if (bits2 <= 350)
      return 8;
    if (bits2 <= 400)
      return 7;
    if (bits2 <= 500)
      return 6;
    if (bits2 <= 600)
      return 5;
    if (bits2 <= 800)
      return 4;
    if (bits2 <= 1250)
      return 3;
    return 2;
  }
  function _detectNodeCrypto(fn) {
    return forge.util.isNodejs && typeof _crypto[fn] === "function";
  }
  function _detectSubtleCrypto(fn) {
    return typeof util12.globalScope < "u" && typeof util12.globalScope.crypto === "object" && typeof util12.globalScope.crypto.subtle === "object" && typeof util12.globalScope.crypto.subtle[fn] === "function";
  }
  function _detectSubtleMsCrypto(fn) {
    return typeof util12.globalScope < "u" && typeof util12.globalScope.msCrypto === "object" && typeof util12.globalScope.msCrypto.subtle === "object" && typeof util12.globalScope.msCrypto.subtle[fn] === "function";
  }
  function _intToUint8Array(x4) {
    var bytes = forge.util.hexToBytes(x4.toString(16)), buffer = new Uint8Array(bytes.length);
    for (var i5 = 0;i5 < bytes.length; ++i5)
      buffer[i5] = bytes.charCodeAt(i5);
    return buffer;
  }
});
