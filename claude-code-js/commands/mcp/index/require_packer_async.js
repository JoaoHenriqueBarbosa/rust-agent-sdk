// var: require_packer_async
var require_packer_async = __commonJS((exports, module) => {
  var util12 = __require("util"), Stream5 = __require("stream"), constants12 = require_constants5(), Packer = require_packer(), PackerAsync = module.exports = function(opt) {
    Stream5.call(this);
    let options2 = opt || {};
    this._packer = new Packer(options2), this._deflate = this._packer.createDeflate(), this.readable = !0;
  };
  util12.inherits(PackerAsync, Stream5);
  PackerAsync.prototype.pack = function(data, width, height2, gamma) {
    if (this.emit("data", Buffer.from(constants12.PNG_SIGNATURE)), this.emit("data", this._packer.packIHDR(width, height2)), gamma)
      this.emit("data", this._packer.packGAMA(gamma));
    let filteredData = this._packer.filterData(data, width, height2);
    this._deflate.on("error", this.emit.bind(this, "error")), this._deflate.on("data", function(compressedData) {
      this.emit("data", this._packer.packIDAT(compressedData));
    }.bind(this)), this._deflate.on("end", function() {
      this.emit("data", this._packer.packIEND()), this.emit("end");
    }.bind(this)), this._deflate.end(filteredData);
  };
});
