// var: require_aws_crc32
var require_aws_crc32 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.AwsCrc32 = void 0;
  var tslib_1 = require_tslib3(), util_1 = require_build3(), index_1 = require_build4(), AwsCrc322 = function() {
    function AwsCrc323() {
      this.crc32 = new index_1.Crc32;
    }
    return AwsCrc323.prototype.update = function(toHash) {
      if ((0, util_1.isEmptyData)(toHash))
        return;
      this.crc32.update((0, util_1.convertToBuffer)(toHash));
    }, AwsCrc323.prototype.digest = function() {
      return tslib_1.__awaiter(this, void 0, void 0, function() {
        return tslib_1.__generator(this, function(_a2) {
          return [2, (0, util_1.numToUint8)(this.crc32.digest())];
        });
      });
    }, AwsCrc323.prototype.reset = function() {
      this.crc32 = new index_1.Crc32;
    }, AwsCrc323;
  }();
  exports.AwsCrc32 = AwsCrc322;
});
