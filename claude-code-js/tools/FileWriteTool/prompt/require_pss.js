// var: require_pss
var require_pss = __commonJS((exports, module) => {
  var forge = require_forge();
  require_random();
  require_util3();
  var pss = module.exports = forge.pss = forge.pss || {};
  pss.create = function(options) {
    if (arguments.length === 3)
      options = {
        md: arguments[0],
        mgf: arguments[1],
        saltLength: arguments[2]
      };
    var { md: hash, mgf } = options, hLen = hash.digestLength, salt_ = options.salt || null;
    if (typeof salt_ === "string")
      salt_ = forge.util.createBuffer(salt_);
    var sLen;
    if ("saltLength" in options)
      sLen = options.saltLength;
    else if (salt_ !== null)
      sLen = salt_.length();
    else
      throw Error("Salt length not specified or specific salt not given.");
    if (salt_ !== null && salt_.length() !== sLen)
      throw Error("Given salt length does not match length of given salt.");
    var prng = options.prng || forge.random, pssobj = {};
    return pssobj.encode = function(md, modBits) {
      var i5, emBits = modBits - 1, emLen = Math.ceil(emBits / 8), mHash = md.digest().getBytes();
      if (emLen < hLen + sLen + 2)
        throw Error("Message is too long to encrypt.");
      var salt;
      if (salt_ === null)
        salt = prng.getBytesSync(sLen);
      else
        salt = salt_.bytes();
      var m_ = new forge.util.ByteBuffer;
      m_.fillWithByte(0, 8), m_.putBytes(mHash), m_.putBytes(salt), hash.start(), hash.update(m_.getBytes());
      var h4 = hash.digest().getBytes(), ps = new forge.util.ByteBuffer;
      ps.fillWithByte(0, emLen - sLen - hLen - 2), ps.putByte(1), ps.putBytes(salt);
      var db = ps.getBytes(), maskLen = emLen - hLen - 1, dbMask = mgf.generate(h4, maskLen), maskedDB = "";
      for (i5 = 0;i5 < maskLen; i5++)
        maskedDB += String.fromCharCode(db.charCodeAt(i5) ^ dbMask.charCodeAt(i5));
      var mask = 65280 >> 8 * emLen - emBits & 255;
      return maskedDB = String.fromCharCode(maskedDB.charCodeAt(0) & ~mask) + maskedDB.substr(1), maskedDB + h4 + String.fromCharCode(188);
    }, pssobj.verify = function(mHash, em, modBits) {
      var i5, emBits = modBits - 1, emLen = Math.ceil(emBits / 8);
      if (em = em.substr(-emLen), emLen < hLen + sLen + 2)
        throw Error("Inconsistent parameters to PSS signature verification.");
      if (em.charCodeAt(emLen - 1) !== 188)
        throw Error("Encoded message does not end in 0xBC.");
      var maskLen = emLen - hLen - 1, maskedDB = em.substr(0, maskLen), h4 = em.substr(maskLen, hLen), mask = 65280 >> 8 * emLen - emBits & 255;
      if ((maskedDB.charCodeAt(0) & mask) !== 0)
        throw Error("Bits beyond keysize not zero as expected.");
      var dbMask = mgf.generate(h4, maskLen), db = "";
      for (i5 = 0;i5 < maskLen; i5++)
        db += String.fromCharCode(maskedDB.charCodeAt(i5) ^ dbMask.charCodeAt(i5));
      db = String.fromCharCode(db.charCodeAt(0) & ~mask) + db.substr(1);
      var checkLen = emLen - hLen - sLen - 2;
      for (i5 = 0;i5 < checkLen; i5++)
        if (db.charCodeAt(i5) !== 0)
          throw Error("Leftmost octets not zero as expected");
      if (db.charCodeAt(checkLen) !== 1)
        throw Error("Inconsistent PSS signature, 0x01 marker not found");
      var salt = db.substr(-sLen), m_ = new forge.util.ByteBuffer;
      m_.fillWithByte(0, 8), m_.putBytes(mHash), m_.putBytes(salt), hash.start(), hash.update(m_.getBytes());
      var h_ = hash.digest().getBytes();
      return h4 === h_;
    }, pssobj;
  };
});
