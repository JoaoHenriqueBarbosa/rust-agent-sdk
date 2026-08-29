// var: require_pbkdf2
var require_pbkdf2 = __commonJS((exports, module) => {
  var forge = require_forge();
  require_hmac();
  require_md();
  require_util3();
  var pkcs5 = forge.pkcs5 = forge.pkcs5 || {}, crypto11;
  if (forge.util.isNodejs && !forge.options.usePureJavaScript)
    crypto11 = __require("crypto");
  module.exports = forge.pbkdf2 = pkcs5.pbkdf2 = function(p4, s2, c3, dkLen, md, callback) {
    if (typeof md === "function")
      callback = md, md = null;
    if (forge.util.isNodejs && !forge.options.usePureJavaScript && crypto11.pbkdf2 && (md === null || typeof md !== "object") && (crypto11.pbkdf2Sync.length > 4 || (!md || md === "sha1"))) {
      if (typeof md !== "string")
        md = "sha1";
      if (p4 = Buffer.from(p4, "binary"), s2 = Buffer.from(s2, "binary"), !callback) {
        if (crypto11.pbkdf2Sync.length === 4)
          return crypto11.pbkdf2Sync(p4, s2, c3, dkLen).toString("binary");
        return crypto11.pbkdf2Sync(p4, s2, c3, dkLen, md).toString("binary");
      }
      if (crypto11.pbkdf2Sync.length === 4)
        return crypto11.pbkdf2(p4, s2, c3, dkLen, function(err3, key2) {
          if (err3)
            return callback(err3);
          callback(null, key2.toString("binary"));
        });
      return crypto11.pbkdf2(p4, s2, c3, dkLen, md, function(err3, key2) {
        if (err3)
          return callback(err3);
        callback(null, key2.toString("binary"));
      });
    }
    if (typeof md > "u" || md === null)
      md = "sha1";
    if (typeof md === "string") {
      if (!(md in forge.md.algorithms))
        throw Error("Unknown hash algorithm: " + md);
      md = forge.md[md].create();
    }
    var hLen = md.digestLength;
    if (dkLen > 4294967295 * hLen) {
      var err2 = Error("Derived key is too long.");
      if (callback)
        return callback(err2);
      throw err2;
    }
    var len = Math.ceil(dkLen / hLen), r4 = dkLen - (len - 1) * hLen, prf = forge.hmac.create();
    prf.start(md, p4);
    var dk = "", xor, u_c, u_c1;
    if (!callback) {
      for (var i5 = 1;i5 <= len; ++i5) {
        prf.start(null, null), prf.update(s2), prf.update(forge.util.int32ToBytes(i5)), xor = u_c1 = prf.digest().getBytes();
        for (var j4 = 2;j4 <= c3; ++j4)
          prf.start(null, null), prf.update(u_c1), u_c = prf.digest().getBytes(), xor = forge.util.xorBytes(xor, u_c, hLen), u_c1 = u_c;
        dk += i5 < len ? xor : xor.substr(0, r4);
      }
      return dk;
    }
    var i5 = 1, j4;
    function outer() {
      if (i5 > len)
        return callback(null, dk);
      prf.start(null, null), prf.update(s2), prf.update(forge.util.int32ToBytes(i5)), xor = u_c1 = prf.digest().getBytes(), j4 = 2, inner();
    }
    function inner() {
      if (j4 <= c3)
        return prf.start(null, null), prf.update(u_c1), u_c = prf.digest().getBytes(), xor = forge.util.xorBytes(xor, u_c, hLen), u_c1 = u_c, ++j4, forge.util.setImmediate(inner);
      dk += i5 < len ? xor : xor.substr(0, r4), ++i5, outer();
    }
    outer();
  };
});
