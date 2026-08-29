// var: require_png
var require_png = __commonJS((exports) => {
  var util12 = __require("util"), Stream5 = __require("stream"), Parser4 = require_parser_async(), Packer = require_packer_async(), PNGSync = require_png_sync(), PNG = exports.PNG = function(options2) {
    if (Stream5.call(this), options2 = options2 || {}, this.width = options2.width | 0, this.height = options2.height | 0, this.data = this.width > 0 && this.height > 0 ? Buffer.alloc(4 * this.width * this.height) : null, options2.fill && this.data)
      this.data.fill(0);
    this.gamma = 0, this.readable = this.writable = !0, this._parser = new Parser4(options2), this._parser.on("error", this.emit.bind(this, "error")), this._parser.on("close", this._handleClose.bind(this)), this._parser.on("metadata", this._metadata.bind(this)), this._parser.on("gamma", this._gamma.bind(this)), this._parser.on("parsed", function(data) {
      this.data = data, this.emit("parsed", data);
    }.bind(this)), this._packer = new Packer(options2), this._packer.on("data", this.emit.bind(this, "data")), this._packer.on("end", this.emit.bind(this, "end")), this._parser.on("close", this._handleClose.bind(this)), this._packer.on("error", this.emit.bind(this, "error"));
  };
  util12.inherits(PNG, Stream5);
  PNG.sync = PNGSync;
  PNG.prototype.pack = function() {
    if (!this.data || !this.data.length)
      return this.emit("error", "No data provided"), this;
    return process.nextTick(function() {
      this._packer.pack(this.data, this.width, this.height, this.gamma);
    }.bind(this)), this;
  };
  PNG.prototype.parse = function(data, callback) {
    if (callback) {
      let onParsed, onError;
      onParsed = function(parsedData) {
        this.removeListener("error", onError), this.data = parsedData, callback(null, this);
      }.bind(this), onError = function(err2) {
        this.removeListener("parsed", onParsed), callback(err2, null);
      }.bind(this), this.once("parsed", onParsed), this.once("error", onError);
    }
    return this.end(data), this;
  };
  PNG.prototype.write = function(data) {
    return this._parser.write(data), !0;
  };
  PNG.prototype.end = function(data) {
    this._parser.end(data);
  };
  PNG.prototype._metadata = function(metadata) {
    this.width = metadata.width, this.height = metadata.height, this.emit("metadata", metadata);
  };
  PNG.prototype._gamma = function(gamma) {
    this.gamma = gamma;
  };
  PNG.prototype._handleClose = function() {
    if (!this._parser.writable && !this._packer.readable)
      this.emit("close");
  };
  PNG.bitblt = function(src, dst, srcX, srcY, width, height2, deltaX, deltaY) {
    if (srcX |= 0, srcY |= 0, width |= 0, height2 |= 0, deltaX |= 0, deltaY |= 0, srcX > src.width || srcY > src.height || srcX + width > src.width || srcY + height2 > src.height)
      throw Error("bitblt reading outside image");
    if (deltaX > dst.width || deltaY > dst.height || deltaX + width > dst.width || deltaY + height2 > dst.height)
      throw Error("bitblt writing outside image");
    for (let y2 = 0;y2 < height2; y2++)
      src.data.copy(dst.data, (deltaY + y2) * dst.width + deltaX << 2, (srcY + y2) * src.width + srcX << 2, (srcY + y2) * src.width + srcX + width << 2);
  };
  PNG.prototype.bitblt = function(dst, srcX, srcY, width, height2, deltaX, deltaY) {
    return PNG.bitblt(this, dst, srcX, srcY, width, height2, deltaX, deltaY), this;
  };
  PNG.adjustGamma = function(src) {
    if (src.gamma) {
      for (let y2 = 0;y2 < src.height; y2++)
        for (let x4 = 0;x4 < src.width; x4++) {
          let idx = src.width * y2 + x4 << 2;
          for (let i5 = 0;i5 < 3; i5++) {
            let sample2 = src.data[idx + i5] / 255;
            sample2 = Math.pow(sample2, 0.45454545454545453 / src.gamma), src.data[idx + i5] = Math.round(sample2 * 255);
          }
        }
      src.gamma = 0;
    }
  };
  PNG.prototype.adjustGamma = function() {
    PNG.adjustGamma(this);
  };
});
