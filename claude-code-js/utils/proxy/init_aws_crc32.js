// var: init_aws_crc32
var init_aws_crc32 = __esm(() => {
  init_modules();
  init_module();
  init_module2();
  AwsCrc32 = function() {
    function AwsCrc322() {
      this.crc32 = new Crc32;
    }
    return AwsCrc322.prototype.update = function(toHash) {
      if (isEmptyData(toHash))
        return;
      this.crc32.update(convertToBuffer(toHash));
    }, AwsCrc322.prototype.digest = function() {
      return __awaiter(this, void 0, void 0, function() {
        return __generator(this, function(_a2) {
          return [2, numToUint8(this.crc32.digest())];
        });
      });
    }, AwsCrc322.prototype.reset = function() {
      this.crc32 = new Crc32;
    }, AwsCrc322;
  }();
});
