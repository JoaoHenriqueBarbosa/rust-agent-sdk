// var: require_pbe
var require_pbe = __commonJS((exports, module) => {
  var forge = require_forge();
  require_aes();
  require_asn1();
  require_des();
  require_md();
  require_oids();
  require_pbkdf2();
  require_pem();
  require_random();
  require_rc2();
  require_rsa();
  require_util3();
  if (typeof BigInteger > "u")
    BigInteger = forge.jsbn.BigInteger;
  var BigInteger, asn1 = forge.asn1, pki = forge.pki = forge.pki || {};
  module.exports = pki.pbe = forge.pbe = forge.pbe || {};
  var oids = pki.oids, encryptedPrivateKeyValidator = {
    name: "EncryptedPrivateKeyInfo",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: !0,
    value: [{
      name: "EncryptedPrivateKeyInfo.encryptionAlgorithm",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: !0,
      value: [{
        name: "AlgorithmIdentifier.algorithm",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.OID,
        constructed: !1,
        capture: "encryptionOid"
      }, {
        name: "AlgorithmIdentifier.parameters",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: !0,
        captureAsn1: "encryptionParams"
      }]
    }, {
      name: "EncryptedPrivateKeyInfo.encryptedData",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.OCTETSTRING,
      constructed: !1,
      capture: "encryptedData"
    }]
  }, PBES2AlgorithmsValidator = {
    name: "PBES2Algorithms",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: !0,
    value: [{
      name: "PBES2Algorithms.keyDerivationFunc",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: !0,
      value: [{
        name: "PBES2Algorithms.keyDerivationFunc.oid",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.OID,
        constructed: !1,
        capture: "kdfOid"
      }, {
        name: "PBES2Algorithms.params",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: !0,
        value: [{
          name: "PBES2Algorithms.params.salt",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.OCTETSTRING,
          constructed: !1,
          capture: "kdfSalt"
        }, {
          name: "PBES2Algorithms.params.iterationCount",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.INTEGER,
          constructed: !1,
          capture: "kdfIterationCount"
        }, {
          name: "PBES2Algorithms.params.keyLength",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.INTEGER,
          constructed: !1,
          optional: !0,
          capture: "keyLength"
        }, {
          name: "PBES2Algorithms.params.prf",
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: !0,
          optional: !0,
          value: [{
            name: "PBES2Algorithms.params.prf.algorithm",
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.OID,
            constructed: !1,
            capture: "prfOid"
          }]
        }]
      }]
    }, {
      name: "PBES2Algorithms.encryptionScheme",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: !0,
      value: [{
        name: "PBES2Algorithms.encryptionScheme.oid",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.OID,
        constructed: !1,
        capture: "encOid"
      }, {
        name: "PBES2Algorithms.encryptionScheme.iv",
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.OCTETSTRING,
        constructed: !1,
        capture: "encIv"
      }]
    }]
  }, pkcs12PbeParamsValidator = {
    name: "pkcs-12PbeParams",
    tagClass: asn1.Class.UNIVERSAL,
    type: asn1.Type.SEQUENCE,
    constructed: !0,
    value: [{
      name: "pkcs-12PbeParams.salt",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.OCTETSTRING,
      constructed: !1,
      capture: "salt"
    }, {
      name: "pkcs-12PbeParams.iterations",
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.INTEGER,
      constructed: !1,
      capture: "iterations"
    }]
  };
  pki.encryptPrivateKeyInfo = function(obj, password, options) {
    options = options || {}, options.saltSize = options.saltSize || 8, options.count = options.count || 2048, options.algorithm = options.algorithm || "aes128", options.prfAlgorithm = options.prfAlgorithm || "sha1";
    var salt = forge.random.getBytesSync(options.saltSize), count3 = options.count, countBytes = asn1.integerToDer(count3), dkLen, encryptionAlgorithm, encryptedData;
    if (options.algorithm.indexOf("aes") === 0 || options.algorithm === "des") {
      var ivLen, encOid, cipherFn;
      switch (options.algorithm) {
        case "aes128":
          dkLen = 16, ivLen = 16, encOid = oids["aes128-CBC"], cipherFn = forge.aes.createEncryptionCipher;
          break;
        case "aes192":
          dkLen = 24, ivLen = 16, encOid = oids["aes192-CBC"], cipherFn = forge.aes.createEncryptionCipher;
          break;
        case "aes256":
          dkLen = 32, ivLen = 16, encOid = oids["aes256-CBC"], cipherFn = forge.aes.createEncryptionCipher;
          break;
        case "des":
          dkLen = 8, ivLen = 8, encOid = oids.desCBC, cipherFn = forge.des.createEncryptionCipher;
          break;
        default:
          var error44 = Error("Cannot encrypt private key. Unknown encryption algorithm.");
          throw error44.algorithm = options.algorithm, error44;
      }
      var prfAlgorithm = "hmacWith" + options.prfAlgorithm.toUpperCase(), md = prfAlgorithmToMessageDigest(prfAlgorithm), dk = forge.pkcs5.pbkdf2(password, salt, count3, dkLen, md), iv = forge.random.getBytesSync(ivLen), cipher = cipherFn(dk);
      cipher.start(iv), cipher.update(asn1.toDer(obj)), cipher.finish(), encryptedData = cipher.output.getBytes();
      var params = createPbkdf2Params(salt, countBytes, dkLen, prfAlgorithm);
      encryptionAlgorithm = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, !1, asn1.oidToDer(oids.pkcs5PBES2).getBytes()),
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, [
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, !1, asn1.oidToDer(oids.pkcs5PBKDF2).getBytes()),
            params
          ]),
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, [
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, !1, asn1.oidToDer(encOid).getBytes()),
            asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, !1, iv)
          ])
        ])
      ]);
    } else if (options.algorithm === "3des") {
      dkLen = 24;
      var saltBytes = new forge.util.ByteBuffer(salt), dk = pki.pbe.generatePkcs12Key(password, saltBytes, 1, count3, dkLen), iv = pki.pbe.generatePkcs12Key(password, saltBytes, 2, count3, dkLen), cipher = forge.des.createEncryptionCipher(dk);
      cipher.start(iv), cipher.update(asn1.toDer(obj)), cipher.finish(), encryptedData = cipher.output.getBytes(), encryptionAlgorithm = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, !1, asn1.oidToDer(oids["pbeWithSHAAnd3-KeyTripleDES-CBC"]).getBytes()),
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, [
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, !1, salt),
          asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, !1, countBytes.getBytes())
        ])
      ]);
    } else {
      var error44 = Error("Cannot encrypt private key. Unknown encryption algorithm.");
      throw error44.algorithm = options.algorithm, error44;
    }
    var rval = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, [
      encryptionAlgorithm,
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, !1, encryptedData)
    ]);
    return rval;
  };
  pki.decryptPrivateKeyInfo = function(obj, password) {
    var rval = null, capture = {}, errors8 = [];
    if (!asn1.validate(obj, encryptedPrivateKeyValidator, capture, errors8)) {
      var error44 = Error("Cannot read encrypted private key. ASN.1 object is not a supported EncryptedPrivateKeyInfo.");
      throw error44.errors = errors8, error44;
    }
    var oid = asn1.derToOid(capture.encryptionOid), cipher = pki.pbe.getCipher(oid, capture.encryptionParams, password), encrypted = forge.util.createBuffer(capture.encryptedData);
    if (cipher.update(encrypted), cipher.finish())
      rval = asn1.fromDer(cipher.output);
    return rval;
  };
  pki.encryptedPrivateKeyToPem = function(epki, maxline) {
    var msg = {
      type: "ENCRYPTED PRIVATE KEY",
      body: asn1.toDer(epki).getBytes()
    };
    return forge.pem.encode(msg, { maxline });
  };
  pki.encryptedPrivateKeyFromPem = function(pem) {
    var msg = forge.pem.decode(pem)[0];
    if (msg.type !== "ENCRYPTED PRIVATE KEY") {
      var error44 = Error('Could not convert encrypted private key from PEM; PEM header type is "ENCRYPTED PRIVATE KEY".');
      throw error44.headerType = msg.type, error44;
    }
    if (msg.procType && msg.procType.type === "ENCRYPTED")
      throw Error("Could not convert encrypted private key from PEM; PEM is encrypted.");
    return asn1.fromDer(msg.body);
  };
  pki.encryptRsaPrivateKey = function(rsaKey, password, options) {
    if (options = options || {}, !options.legacy) {
      var rval = pki.wrapRsaPrivateKey(pki.privateKeyToAsn1(rsaKey));
      return rval = pki.encryptPrivateKeyInfo(rval, password, options), pki.encryptedPrivateKeyToPem(rval);
    }
    var algorithm, iv, dkLen, cipherFn;
    switch (options.algorithm) {
      case "aes128":
        algorithm = "AES-128-CBC", dkLen = 16, iv = forge.random.getBytesSync(16), cipherFn = forge.aes.createEncryptionCipher;
        break;
      case "aes192":
        algorithm = "AES-192-CBC", dkLen = 24, iv = forge.random.getBytesSync(16), cipherFn = forge.aes.createEncryptionCipher;
        break;
      case "aes256":
        algorithm = "AES-256-CBC", dkLen = 32, iv = forge.random.getBytesSync(16), cipherFn = forge.aes.createEncryptionCipher;
        break;
      case "3des":
        algorithm = "DES-EDE3-CBC", dkLen = 24, iv = forge.random.getBytesSync(8), cipherFn = forge.des.createEncryptionCipher;
        break;
      case "des":
        algorithm = "DES-CBC", dkLen = 8, iv = forge.random.getBytesSync(8), cipherFn = forge.des.createEncryptionCipher;
        break;
      default:
        var error44 = Error('Could not encrypt RSA private key; unsupported encryption algorithm "' + options.algorithm + '".');
        throw error44.algorithm = options.algorithm, error44;
    }
    var dk = forge.pbe.opensslDeriveBytes(password, iv.substr(0, 8), dkLen), cipher = cipherFn(dk);
    cipher.start(iv), cipher.update(asn1.toDer(pki.privateKeyToAsn1(rsaKey))), cipher.finish();
    var msg = {
      type: "RSA PRIVATE KEY",
      procType: {
        version: "4",
        type: "ENCRYPTED"
      },
      dekInfo: {
        algorithm,
        parameters: forge.util.bytesToHex(iv).toUpperCase()
      },
      body: cipher.output.getBytes()
    };
    return forge.pem.encode(msg);
  };
  pki.decryptRsaPrivateKey = function(pem, password) {
    var rval = null, msg = forge.pem.decode(pem)[0];
    if (msg.type !== "ENCRYPTED PRIVATE KEY" && msg.type !== "PRIVATE KEY" && msg.type !== "RSA PRIVATE KEY") {
      var error44 = Error('Could not convert private key from PEM; PEM header type is not "ENCRYPTED PRIVATE KEY", "PRIVATE KEY", or "RSA PRIVATE KEY".');
      throw error44.headerType = error44, error44;
    }
    if (msg.procType && msg.procType.type === "ENCRYPTED") {
      var dkLen, cipherFn;
      switch (msg.dekInfo.algorithm) {
        case "DES-CBC":
          dkLen = 8, cipherFn = forge.des.createDecryptionCipher;
          break;
        case "DES-EDE3-CBC":
          dkLen = 24, cipherFn = forge.des.createDecryptionCipher;
          break;
        case "AES-128-CBC":
          dkLen = 16, cipherFn = forge.aes.createDecryptionCipher;
          break;
        case "AES-192-CBC":
          dkLen = 24, cipherFn = forge.aes.createDecryptionCipher;
          break;
        case "AES-256-CBC":
          dkLen = 32, cipherFn = forge.aes.createDecryptionCipher;
          break;
        case "RC2-40-CBC":
          dkLen = 5, cipherFn = function(key2) {
            return forge.rc2.createDecryptionCipher(key2, 40);
          };
          break;
        case "RC2-64-CBC":
          dkLen = 8, cipherFn = function(key2) {
            return forge.rc2.createDecryptionCipher(key2, 64);
          };
          break;
        case "RC2-128-CBC":
          dkLen = 16, cipherFn = function(key2) {
            return forge.rc2.createDecryptionCipher(key2, 128);
          };
          break;
        default:
          var error44 = Error('Could not decrypt private key; unsupported encryption algorithm "' + msg.dekInfo.algorithm + '".');
          throw error44.algorithm = msg.dekInfo.algorithm, error44;
      }
      var iv = forge.util.hexToBytes(msg.dekInfo.parameters), dk = forge.pbe.opensslDeriveBytes(password, iv.substr(0, 8), dkLen), cipher = cipherFn(dk);
      if (cipher.start(iv), cipher.update(forge.util.createBuffer(msg.body)), cipher.finish())
        rval = cipher.output.getBytes();
      else
        return rval;
    } else
      rval = msg.body;
    if (msg.type === "ENCRYPTED PRIVATE KEY")
      rval = pki.decryptPrivateKeyInfo(asn1.fromDer(rval), password);
    else
      rval = asn1.fromDer(rval);
    if (rval !== null)
      rval = pki.privateKeyFromAsn1(rval);
    return rval;
  };
  pki.pbe.generatePkcs12Key = function(password, salt, id, iter, n5, md) {
    var j4, l3;
    if (typeof md > "u" || md === null) {
      if (!("sha1" in forge.md))
        throw Error('"sha1" hash algorithm unavailable.');
      md = forge.md.sha1.create();
    }
    var { digestLength: u5, blockLength: v2 } = md, result = new forge.util.ByteBuffer, passBuf = new forge.util.ByteBuffer;
    if (password !== null && password !== void 0) {
      for (l3 = 0;l3 < password.length; l3++)
        passBuf.putInt16(password.charCodeAt(l3));
      passBuf.putInt16(0);
    }
    var p4 = passBuf.length(), s2 = salt.length(), D2 = new forge.util.ByteBuffer;
    D2.fillWithByte(id, v2);
    var Slen = v2 * Math.ceil(s2 / v2), S2 = new forge.util.ByteBuffer;
    for (l3 = 0;l3 < Slen; l3++)
      S2.putByte(salt.at(l3 % s2));
    var Plen = v2 * Math.ceil(p4 / v2), P2 = new forge.util.ByteBuffer;
    for (l3 = 0;l3 < Plen; l3++)
      P2.putByte(passBuf.at(l3 % p4));
    var I2 = S2;
    I2.putBuffer(P2);
    var c3 = Math.ceil(n5 / u5);
    for (var i5 = 1;i5 <= c3; i5++) {
      var buf = new forge.util.ByteBuffer;
      buf.putBytes(D2.bytes()), buf.putBytes(I2.bytes());
      for (var round = 0;round < iter; round++)
        md.start(), md.update(buf.getBytes()), buf = md.digest();
      var B2 = new forge.util.ByteBuffer;
      for (l3 = 0;l3 < v2; l3++)
        B2.putByte(buf.at(l3 % u5));
      var k3 = Math.ceil(s2 / v2) + Math.ceil(p4 / v2), Inew = new forge.util.ByteBuffer;
      for (j4 = 0;j4 < k3; j4++) {
        var chunk = new forge.util.ByteBuffer(I2.getBytes(v2)), x4 = 511;
        for (l3 = B2.length() - 1;l3 >= 0; l3--)
          x4 = x4 >> 8, x4 += B2.at(l3) + chunk.at(l3), chunk.setAt(l3, x4 & 255);
        Inew.putBuffer(chunk);
      }
      I2 = Inew, result.putBuffer(buf);
    }
    return result.truncate(result.length() - n5), result;
  };
  pki.pbe.getCipher = function(oid, params, password) {
    switch (oid) {
      case pki.oids.pkcs5PBES2:
        return pki.pbe.getCipherForPBES2(oid, params, password);
      case pki.oids["pbeWithSHAAnd3-KeyTripleDES-CBC"]:
      case pki.oids["pbewithSHAAnd40BitRC2-CBC"]:
        return pki.pbe.getCipherForPKCS12PBE(oid, params, password);
      default:
        var error44 = Error("Cannot read encrypted PBE data block. Unsupported OID.");
        throw error44.oid = oid, error44.supportedOids = [
          "pkcs5PBES2",
          "pbeWithSHAAnd3-KeyTripleDES-CBC",
          "pbewithSHAAnd40BitRC2-CBC"
        ], error44;
    }
  };
  pki.pbe.getCipherForPBES2 = function(oid, params, password) {
    var capture = {}, errors8 = [];
    if (!asn1.validate(params, PBES2AlgorithmsValidator, capture, errors8)) {
      var error44 = Error("Cannot read password-based-encryption algorithm parameters. ASN.1 object is not a supported EncryptedPrivateKeyInfo.");
      throw error44.errors = errors8, error44;
    }
    if (oid = asn1.derToOid(capture.kdfOid), oid !== pki.oids.pkcs5PBKDF2) {
      var error44 = Error("Cannot read encrypted private key. Unsupported key derivation function OID.");
      throw error44.oid = oid, error44.supportedOids = ["pkcs5PBKDF2"], error44;
    }
    if (oid = asn1.derToOid(capture.encOid), oid !== pki.oids["aes128-CBC"] && oid !== pki.oids["aes192-CBC"] && oid !== pki.oids["aes256-CBC"] && oid !== pki.oids["des-EDE3-CBC"] && oid !== pki.oids.desCBC) {
      var error44 = Error("Cannot read encrypted private key. Unsupported encryption scheme OID.");
      throw error44.oid = oid, error44.supportedOids = [
        "aes128-CBC",
        "aes192-CBC",
        "aes256-CBC",
        "des-EDE3-CBC",
        "desCBC"
      ], error44;
    }
    var salt = capture.kdfSalt, count3 = forge.util.createBuffer(capture.kdfIterationCount);
    count3 = count3.getInt(count3.length() << 3);
    var dkLen, cipherFn;
    switch (pki.oids[oid]) {
      case "aes128-CBC":
        dkLen = 16, cipherFn = forge.aes.createDecryptionCipher;
        break;
      case "aes192-CBC":
        dkLen = 24, cipherFn = forge.aes.createDecryptionCipher;
        break;
      case "aes256-CBC":
        dkLen = 32, cipherFn = forge.aes.createDecryptionCipher;
        break;
      case "des-EDE3-CBC":
        dkLen = 24, cipherFn = forge.des.createDecryptionCipher;
        break;
      case "desCBC":
        dkLen = 8, cipherFn = forge.des.createDecryptionCipher;
        break;
    }
    var md = prfOidToMessageDigest(capture.prfOid), dk = forge.pkcs5.pbkdf2(password, salt, count3, dkLen, md), iv = capture.encIv, cipher = cipherFn(dk);
    return cipher.start(iv), cipher;
  };
  pki.pbe.getCipherForPKCS12PBE = function(oid, params, password) {
    var capture = {}, errors8 = [];
    if (!asn1.validate(params, pkcs12PbeParamsValidator, capture, errors8)) {
      var error44 = Error("Cannot read password-based-encryption algorithm parameters. ASN.1 object is not a supported EncryptedPrivateKeyInfo.");
      throw error44.errors = errors8, error44;
    }
    var salt = forge.util.createBuffer(capture.salt), count3 = forge.util.createBuffer(capture.iterations);
    count3 = count3.getInt(count3.length() << 3);
    var dkLen, dIvLen, cipherFn;
    switch (oid) {
      case pki.oids["pbeWithSHAAnd3-KeyTripleDES-CBC"]:
        dkLen = 24, dIvLen = 8, cipherFn = forge.des.startDecrypting;
        break;
      case pki.oids["pbewithSHAAnd40BitRC2-CBC"]:
        dkLen = 5, dIvLen = 8, cipherFn = function(key3, iv2) {
          var cipher = forge.rc2.createDecryptionCipher(key3, 40);
          return cipher.start(iv2, null), cipher;
        };
        break;
      default:
        var error44 = Error("Cannot read PKCS #12 PBE data block. Unsupported OID.");
        throw error44.oid = oid, error44;
    }
    var md = prfOidToMessageDigest(capture.prfOid), key2 = pki.pbe.generatePkcs12Key(password, salt, 1, count3, dkLen, md);
    md.start();
    var iv = pki.pbe.generatePkcs12Key(password, salt, 2, count3, dIvLen, md);
    return cipherFn(key2, iv);
  };
  pki.pbe.opensslDeriveBytes = function(password, salt, dkLen, md) {
    if (typeof md > "u" || md === null) {
      if (!("md5" in forge.md))
        throw Error('"md5" hash algorithm unavailable.');
      md = forge.md.md5.create();
    }
    if (salt === null)
      salt = "";
    var digests = [hash(md, password + salt)];
    for (var length = 16, i5 = 1;length < dkLen; ++i5, length += 16)
      digests.push(hash(md, digests[i5 - 1] + password + salt));
    return digests.join("").substr(0, dkLen);
  };
  function hash(md, bytes) {
    return md.start().update(bytes).digest().getBytes();
  }
  function prfOidToMessageDigest(prfOid) {
    var prfAlgorithm;
    if (!prfOid)
      prfAlgorithm = "hmacWithSHA1";
    else if (prfAlgorithm = pki.oids[asn1.derToOid(prfOid)], !prfAlgorithm) {
      var error44 = Error("Unsupported PRF OID.");
      throw error44.oid = prfOid, error44.supported = [
        "hmacWithSHA1",
        "hmacWithSHA224",
        "hmacWithSHA256",
        "hmacWithSHA384",
        "hmacWithSHA512"
      ], error44;
    }
    return prfAlgorithmToMessageDigest(prfAlgorithm);
  }
  function prfAlgorithmToMessageDigest(prfAlgorithm) {
    var factory2 = forge.md;
    switch (prfAlgorithm) {
      case "hmacWithSHA224":
        factory2 = forge.md.sha512;
      case "hmacWithSHA1":
      case "hmacWithSHA256":
      case "hmacWithSHA384":
      case "hmacWithSHA512":
        prfAlgorithm = prfAlgorithm.substr(8).toLowerCase();
        break;
      default:
        var error44 = Error("Unsupported PRF algorithm.");
        throw error44.algorithm = prfAlgorithm, error44.supported = [
          "hmacWithSHA1",
          "hmacWithSHA224",
          "hmacWithSHA256",
          "hmacWithSHA384",
          "hmacWithSHA512"
        ], error44;
    }
    if (!factory2 || !(prfAlgorithm in factory2))
      throw Error("Unknown hash algorithm: " + prfAlgorithm);
    return factory2[prfAlgorithm].create();
  }
  function createPbkdf2Params(salt, countBytes, dkLen, prfAlgorithm) {
    var params = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, [
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, !1, salt),
      asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, !1, countBytes.getBytes())
    ]);
    if (prfAlgorithm !== "hmacWithSHA1")
      params.value.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, !1, forge.util.hexToBytes(dkLen.toString(16))), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, !0, [
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, !1, asn1.oidToDer(pki.oids[prfAlgorithm]).getBytes()),
        asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, !1, "")
      ]));
    return params;
  }
});
