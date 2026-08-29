// var: require_dist_cjs75
var require_dist_cjs75 = __commonJS((exports) => {
  var utilBufferFrom = require_dist_cjs74(), utilUtf8 = require_dist_cjs17(), buffer = __require("buffer"), crypto4 = __require("crypto");

  class Hash2 {
    algorithmIdentifier;
    secret;
    hash;
    constructor(algorithmIdentifier, secret) {
      this.algorithmIdentifier = algorithmIdentifier, this.secret = secret, this.reset();
    }
    update(toHash, encoding) {
      this.hash.update(utilUtf8.toUint8Array(castSourceData(toHash, encoding)));
    }
    digest() {
      return Promise.resolve(this.hash.digest());
    }
    reset() {
      this.hash = this.secret ? crypto4.createHmac(this.algorithmIdentifier, castSourceData(this.secret)) : crypto4.createHash(this.algorithmIdentifier);
    }
  }
  function castSourceData(toCast, encoding) {
    if (buffer.Buffer.isBuffer(toCast))
      return toCast;
    if (typeof toCast === "string")
      return utilBufferFrom.fromString(toCast, encoding);
    if (ArrayBuffer.isView(toCast))
      return utilBufferFrom.fromArrayBuffer(toCast.buffer, toCast.byteOffset, toCast.byteLength);
    return utilBufferFrom.fromArrayBuffer(toCast);
  }
  exports.Hash = Hash2;
});
