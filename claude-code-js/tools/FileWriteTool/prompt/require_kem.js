// var: require_kem
var require_kem = __commonJS((exports, module) => {
  var forge = require_forge();
  require_util3();
  require_random();
  require_jsbn();
  module.exports = forge.kem = forge.kem || {};
  var BigInteger = forge.jsbn.BigInteger;
  forge.kem.rsa = {};
  forge.kem.rsa.create = function(kdf, options) {
    options = options || {};
    var prng = options.prng || forge.random, kem = {};
    return kem.encrypt = function(publicKey, keyLength) {
      var byteLength = Math.ceil(publicKey.n.bitLength() / 8), r4;
      do
        r4 = new BigInteger(forge.util.bytesToHex(prng.getBytesSync(byteLength)), 16).mod(publicKey.n);
      while (r4.compareTo(BigInteger.ONE) <= 0);
      r4 = forge.util.hexToBytes(r4.toString(16));
      var zeros = byteLength - r4.length;
      if (zeros > 0)
        r4 = forge.util.fillString(String.fromCharCode(0), zeros) + r4;
      var encapsulation = publicKey.encrypt(r4, "NONE"), key2 = kdf.generate(r4, keyLength);
      return { encapsulation, key: key2 };
    }, kem.decrypt = function(privateKey, encapsulation, keyLength) {
      var r4 = privateKey.decrypt(encapsulation, "NONE");
      return kdf.generate(r4, keyLength);
    }, kem;
  };
  forge.kem.kdf1 = function(md, digestLength) {
    _createKDF(this, md, 0, digestLength || md.digestLength);
  };
  forge.kem.kdf2 = function(md, digestLength) {
    _createKDF(this, md, 1, digestLength || md.digestLength);
  };
  function _createKDF(kdf, md, counterStart, digestLength) {
    kdf.generate = function(x4, length) {
      var key2 = new forge.util.ByteBuffer, k3 = Math.ceil(length / digestLength) + counterStart, c3 = new forge.util.ByteBuffer;
      for (var i5 = counterStart;i5 < k3; ++i5) {
        c3.putInt32(i5), md.start(), md.update(x4 + c3.getBytes());
        var hash = md.digest();
        key2.putBytes(hash.getBytes(digestLength));
      }
      return key2.truncate(key2.length() - length), key2.getBytes();
    };
  }
});
