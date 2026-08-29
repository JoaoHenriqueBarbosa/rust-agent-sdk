// var: require_jsSha256
var require_jsSha256 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.Sha256 = void 0;
  var tslib_1 = require_tslib2(), constants_1 = require_constants(), RawSha256_1 = require_RawSha256(), util_1 = require_build(), Sha256 = function() {
    function Sha2562(secret) {
      this.secret = secret, this.hash = new RawSha256_1.RawSha256, this.reset();
    }
    return Sha2562.prototype.update = function(toHash) {
      if ((0, util_1.isEmptyData)(toHash) || this.error)
        return;
      try {
        this.hash.update((0, util_1.convertToBuffer)(toHash));
      } catch (e) {
        this.error = e;
      }
    }, Sha2562.prototype.digestSync = function() {
      if (this.error)
        throw this.error;
      if (this.outer) {
        if (!this.outer.finished)
          this.outer.update(this.hash.digest());
        return this.outer.digest();
      }
      return this.hash.digest();
    }, Sha2562.prototype.digest = function() {
      return tslib_1.__awaiter(this, void 0, void 0, function() {
        return tslib_1.__generator(this, function(_a2) {
          return [2, this.digestSync()];
        });
      });
    }, Sha2562.prototype.reset = function() {
      if (this.hash = new RawSha256_1.RawSha256, this.secret) {
        this.outer = new RawSha256_1.RawSha256;
        var inner = bufferFromSecret(this.secret), outer = new Uint8Array(constants_1.BLOCK_SIZE);
        outer.set(inner);
        for (var i4 = 0;i4 < constants_1.BLOCK_SIZE; i4++)
          inner[i4] ^= 54, outer[i4] ^= 92;
        this.hash.update(inner), this.outer.update(outer);
        for (var i4 = 0;i4 < inner.byteLength; i4++)
          inner[i4] = 0;
      }
    }, Sha2562;
  }();
  exports.Sha256 = Sha256;
  function bufferFromSecret(secret) {
    var input = (0, util_1.convertToBuffer)(secret);
    if (input.byteLength > constants_1.BLOCK_SIZE) {
      var bufferHash = new RawSha256_1.RawSha256;
      bufferHash.update(input), input = bufferHash.digest();
    }
    var buffer = new Uint8Array(constants_1.BLOCK_SIZE);
    return buffer.set(input), buffer;
  }
});
