// var: require_packer
var require_packer = __commonJS((exports, module) => {
  var constants12 = require_constants5(), CrcStream = require_crc(), bitPacker = require_bitpacker(), filter3 = require_filter_pack(), zlib4 = __require("zlib"), Packer = module.exports = function(options2) {
    if (this._options = options2, options2.deflateChunkSize = options2.deflateChunkSize || 32768, options2.deflateLevel = options2.deflateLevel != null ? options2.deflateLevel : 9, options2.deflateStrategy = options2.deflateStrategy != null ? options2.deflateStrategy : 3, options2.inputHasAlpha = options2.inputHasAlpha != null ? options2.inputHasAlpha : !0, options2.deflateFactory = options2.deflateFactory || zlib4.createDeflate, options2.bitDepth = options2.bitDepth || 8, options2.colorType = typeof options2.colorType === "number" ? options2.colorType : constants12.COLORTYPE_COLOR_ALPHA, options2.inputColorType = typeof options2.inputColorType === "number" ? options2.inputColorType : constants12.COLORTYPE_COLOR_ALPHA, [
      constants12.COLORTYPE_GRAYSCALE,
      constants12.COLORTYPE_COLOR,
      constants12.COLORTYPE_COLOR_ALPHA,
      constants12.COLORTYPE_ALPHA
    ].indexOf(options2.colorType) === -1)
      throw Error("option color type:" + options2.colorType + " is not supported at present");
    if ([
      constants12.COLORTYPE_GRAYSCALE,
      constants12.COLORTYPE_COLOR,
      constants12.COLORTYPE_COLOR_ALPHA,
      constants12.COLORTYPE_ALPHA
    ].indexOf(options2.inputColorType) === -1)
      throw Error("option input color type:" + options2.inputColorType + " is not supported at present");
    if (options2.bitDepth !== 8 && options2.bitDepth !== 16)
      throw Error("option bit depth:" + options2.bitDepth + " is not supported at present");
  };
  Packer.prototype.getDeflateOptions = function() {
    return {
      chunkSize: this._options.deflateChunkSize,
      level: this._options.deflateLevel,
      strategy: this._options.deflateStrategy
    };
  };
  Packer.prototype.createDeflate = function() {
    return this._options.deflateFactory(this.getDeflateOptions());
  };
  Packer.prototype.filterData = function(data, width, height2) {
    let packedData = bitPacker(data, width, height2, this._options), bpp = constants12.COLORTYPE_TO_BPP_MAP[this._options.colorType];
    return filter3(packedData, width, height2, this._options, bpp);
  };
  Packer.prototype._packChunk = function(type, data) {
    let len = data ? data.length : 0, buf = Buffer.alloc(len + 12);
    if (buf.writeUInt32BE(len, 0), buf.writeUInt32BE(type, 4), data)
      data.copy(buf, 8);
    return buf.writeInt32BE(CrcStream.crc32(buf.slice(4, buf.length - 4)), buf.length - 4), buf;
  };
  Packer.prototype.packGAMA = function(gamma) {
    let buf = Buffer.alloc(4);
    return buf.writeUInt32BE(Math.floor(gamma * constants12.GAMMA_DIVISION), 0), this._packChunk(constants12.TYPE_gAMA, buf);
  };
  Packer.prototype.packIHDR = function(width, height2) {
    let buf = Buffer.alloc(13);
    return buf.writeUInt32BE(width, 0), buf.writeUInt32BE(height2, 4), buf[8] = this._options.bitDepth, buf[9] = this._options.colorType, buf[10] = 0, buf[11] = 0, buf[12] = 0, this._packChunk(constants12.TYPE_IHDR, buf);
  };
  Packer.prototype.packIDAT = function(data) {
    return this._packChunk(constants12.TYPE_IDAT, data);
  };
  Packer.prototype.packIEND = function() {
    return this._packChunk(constants12.TYPE_IEND, null);
  };
});
