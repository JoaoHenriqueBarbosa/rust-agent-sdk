// var: require_pkcs1
var require_pkcs1 = __commonJS((exports, module) => {
  var forge = require_forge();
  require_util3();
  require_random();
  require_sha13();
  var pkcs1 = module.exports = forge.pkcs1 = forge.pkcs1 || {};
  pkcs1.encode_rsa_oaep = function(key2, message, options) {
    var label, seed, md, mgf1Md;
    if (typeof options === "string")
      label = options, seed = arguments[3] || void 0, md = arguments[4] || void 0;
    else if (options) {
      if (label = options.label || void 0, seed = options.seed || void 0, md = options.md || void 0, options.mgf1 && options.mgf1.md)
        mgf1Md = options.mgf1.md;
    }
    if (!md)
      md = forge.md.sha1.create();
    else
      md.start();
    if (!mgf1Md)
      mgf1Md = md;
    var keyLength = Math.ceil(key2.n.bitLength() / 8), maxLength = keyLength - 2 * md.digestLength - 2;
    if (message.length > maxLength) {
      var error44 = Error("RSAES-OAEP input message length is too long.");
      throw error44.length = message.length, error44.maxLength = maxLength, error44;
    }
    if (!label)
      label = "";
    md.update(label, "raw");
    var lHash = md.digest(), PS = "", PS_length = maxLength - message.length;
    for (var i5 = 0;i5 < PS_length; i5++)
      PS += "\x00";
    var DB = lHash.getBytes() + PS + "\x01" + message;
    if (!seed)
      seed = forge.random.getBytes(md.digestLength);
    else if (seed.length !== md.digestLength) {
      var error44 = Error("Invalid RSAES-OAEP seed. The seed length must match the digest length.");
      throw error44.seedLength = seed.length, error44.digestLength = md.digestLength, error44;
    }
    var dbMask = rsa_mgf1(seed, keyLength - md.digestLength - 1, mgf1Md), maskedDB = forge.util.xorBytes(DB, dbMask, DB.length), seedMask = rsa_mgf1(maskedDB, md.digestLength, mgf1Md), maskedSeed = forge.util.xorBytes(seed, seedMask, seed.length);
    return "\x00" + maskedSeed + maskedDB;
  };
  pkcs1.decode_rsa_oaep = function(key2, em, options) {
    var label, md, mgf1Md;
    if (typeof options === "string")
      label = options, md = arguments[3] || void 0;
    else if (options) {
      if (label = options.label || void 0, md = options.md || void 0, options.mgf1 && options.mgf1.md)
        mgf1Md = options.mgf1.md;
    }
    var keyLength = Math.ceil(key2.n.bitLength() / 8);
    if (em.length !== keyLength) {
      var error44 = Error("RSAES-OAEP encoded message length is invalid.");
      throw error44.length = em.length, error44.expectedLength = keyLength, error44;
    }
    if (md === void 0)
      md = forge.md.sha1.create();
    else
      md.start();
    if (!mgf1Md)
      mgf1Md = md;
    if (keyLength < 2 * md.digestLength + 2)
      throw Error("RSAES-OAEP key is too short for the hash function.");
    if (!label)
      label = "";
    md.update(label, "raw");
    var lHash = md.digest().getBytes(), y2 = em.charAt(0), maskedSeed = em.substring(1, md.digestLength + 1), maskedDB = em.substring(1 + md.digestLength), seedMask = rsa_mgf1(maskedDB, md.digestLength, mgf1Md), seed = forge.util.xorBytes(maskedSeed, seedMask, maskedSeed.length), dbMask = rsa_mgf1(seed, keyLength - md.digestLength - 1, mgf1Md), db = forge.util.xorBytes(maskedDB, dbMask, maskedDB.length), lHashPrime = db.substring(0, md.digestLength), error44 = y2 !== "\x00";
    for (var i5 = 0;i5 < md.digestLength; ++i5)
      error44 |= lHash.charAt(i5) !== lHashPrime.charAt(i5);
    var in_ps = 1, index = md.digestLength;
    for (var j4 = md.digestLength;j4 < db.length; j4++) {
      var code = db.charCodeAt(j4), is_0 = code & 1 ^ 1, error_mask = in_ps ? 65534 : 0;
      error44 |= code & error_mask, in_ps = in_ps & is_0, index += in_ps;
    }
    if (error44 || db.charCodeAt(index) !== 1)
      throw Error("Invalid RSAES-OAEP padding.");
    return db.substring(index + 1);
  };
  function rsa_mgf1(seed, maskLength, hash) {
    if (!hash)
      hash = forge.md.sha1.create();
    var t2 = "", count3 = Math.ceil(maskLength / hash.digestLength);
    for (var i5 = 0;i5 < count3; ++i5) {
      var c3 = String.fromCharCode(i5 >> 24 & 255, i5 >> 16 & 255, i5 >> 8 & 255, i5 & 255);
      hash.start(), hash.update(seed + c3), t2 += hash.digest().getBytes();
    }
    return t2.substring(0, maskLength);
  }
});
