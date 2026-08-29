// var: require_parser6
var require_parser6 = __commonJS((exports, module) => {
  var constants12 = require_constants5(), CrcCalculator = require_crc(), Parser4 = module.exports = function(options2, dependencies) {
    this._options = options2, options2.checkCRC = options2.checkCRC !== !1, this._hasIHDR = !1, this._hasIEND = !1, this._emittedHeadersFinished = !1, this._palette = [], this._colorType = 0, this._chunks = {}, this._chunks[constants12.TYPE_IHDR] = this._handleIHDR.bind(this), this._chunks[constants12.TYPE_IEND] = this._handleIEND.bind(this), this._chunks[constants12.TYPE_IDAT] = this._handleIDAT.bind(this), this._chunks[constants12.TYPE_PLTE] = this._handlePLTE.bind(this), this._chunks[constants12.TYPE_tRNS] = this._handleTRNS.bind(this), this._chunks[constants12.TYPE_gAMA] = this._handleGAMA.bind(this), this.read = dependencies.read, this.error = dependencies.error, this.metadata = dependencies.metadata, this.gamma = dependencies.gamma, this.transColor = dependencies.transColor, this.palette = dependencies.palette, this.parsed = dependencies.parsed, this.inflateData = dependencies.inflateData, this.finished = dependencies.finished, this.simpleTransparency = dependencies.simpleTransparency, this.headersFinished = dependencies.headersFinished || function() {};
  };
  Parser4.prototype.start = function() {
    this.read(constants12.PNG_SIGNATURE.length, this._parseSignature.bind(this));
  };
  Parser4.prototype._parseSignature = function(data) {
    let signature7 = constants12.PNG_SIGNATURE;
    for (let i5 = 0;i5 < signature7.length; i5++)
      if (data[i5] !== signature7[i5]) {
        this.error(Error("Invalid file signature"));
        return;
      }
    this.read(8, this._parseChunkBegin.bind(this));
  };
  Parser4.prototype._parseChunkBegin = function(data) {
    let length = data.readUInt32BE(0), type = data.readUInt32BE(4), name3 = "";
    for (let i5 = 4;i5 < 8; i5++)
      name3 += String.fromCharCode(data[i5]);
    let ancillary = Boolean(data[4] & 32);
    if (!this._hasIHDR && type !== constants12.TYPE_IHDR) {
      this.error(Error("Expected IHDR on beggining"));
      return;
    }
    if (this._crc = new CrcCalculator, this._crc.write(Buffer.from(name3)), this._chunks[type])
      return this._chunks[type](length);
    if (!ancillary) {
      this.error(Error("Unsupported critical chunk type " + name3));
      return;
    }
    this.read(length + 4, this._skipChunk.bind(this));
  };
  Parser4.prototype._skipChunk = function() {
    this.read(8, this._parseChunkBegin.bind(this));
  };
  Parser4.prototype._handleChunkEnd = function() {
    this.read(4, this._parseChunkEnd.bind(this));
  };
  Parser4.prototype._parseChunkEnd = function(data) {
    let fileCrc = data.readInt32BE(0), calcCrc = this._crc.crc32();
    if (this._options.checkCRC && calcCrc !== fileCrc) {
      this.error(Error("Crc error - " + fileCrc + " - " + calcCrc));
      return;
    }
    if (!this._hasIEND)
      this.read(8, this._parseChunkBegin.bind(this));
  };
  Parser4.prototype._handleIHDR = function(length) {
    this.read(length, this._parseIHDR.bind(this));
  };
  Parser4.prototype._parseIHDR = function(data) {
    this._crc.write(data);
    let width = data.readUInt32BE(0), height2 = data.readUInt32BE(4), depth = data[8], colorType = data[9], compr = data[10], filter3 = data[11], interlace = data[12];
    if (depth !== 8 && depth !== 4 && depth !== 2 && depth !== 1 && depth !== 16) {
      this.error(Error("Unsupported bit depth " + depth));
      return;
    }
    if (!(colorType in constants12.COLORTYPE_TO_BPP_MAP)) {
      this.error(Error("Unsupported color type"));
      return;
    }
    if (compr !== 0) {
      this.error(Error("Unsupported compression method"));
      return;
    }
    if (filter3 !== 0) {
      this.error(Error("Unsupported filter method"));
      return;
    }
    if (interlace !== 0 && interlace !== 1) {
      this.error(Error("Unsupported interlace method"));
      return;
    }
    this._colorType = colorType;
    let bpp = constants12.COLORTYPE_TO_BPP_MAP[this._colorType];
    this._hasIHDR = !0, this.metadata({
      width,
      height: height2,
      depth,
      interlace: Boolean(interlace),
      palette: Boolean(colorType & constants12.COLORTYPE_PALETTE),
      color: Boolean(colorType & constants12.COLORTYPE_COLOR),
      alpha: Boolean(colorType & constants12.COLORTYPE_ALPHA),
      bpp,
      colorType
    }), this._handleChunkEnd();
  };
  Parser4.prototype._handlePLTE = function(length) {
    this.read(length, this._parsePLTE.bind(this));
  };
  Parser4.prototype._parsePLTE = function(data) {
    this._crc.write(data);
    let entries2 = Math.floor(data.length / 3);
    for (let i5 = 0;i5 < entries2; i5++)
      this._palette.push([data[i5 * 3], data[i5 * 3 + 1], data[i5 * 3 + 2], 255]);
    this.palette(this._palette), this._handleChunkEnd();
  };
  Parser4.prototype._handleTRNS = function(length) {
    this.simpleTransparency(), this.read(length, this._parseTRNS.bind(this));
  };
  Parser4.prototype._parseTRNS = function(data) {
    if (this._crc.write(data), this._colorType === constants12.COLORTYPE_PALETTE_COLOR) {
      if (this._palette.length === 0) {
        this.error(Error("Transparency chunk must be after palette"));
        return;
      }
      if (data.length > this._palette.length) {
        this.error(Error("More transparent colors than palette size"));
        return;
      }
      for (let i5 = 0;i5 < data.length; i5++)
        this._palette[i5][3] = data[i5];
      this.palette(this._palette);
    }
    if (this._colorType === constants12.COLORTYPE_GRAYSCALE)
      this.transColor([data.readUInt16BE(0)]);
    if (this._colorType === constants12.COLORTYPE_COLOR)
      this.transColor([
        data.readUInt16BE(0),
        data.readUInt16BE(2),
        data.readUInt16BE(4)
      ]);
    this._handleChunkEnd();
  };
  Parser4.prototype._handleGAMA = function(length) {
    this.read(length, this._parseGAMA.bind(this));
  };
  Parser4.prototype._parseGAMA = function(data) {
    this._crc.write(data), this.gamma(data.readUInt32BE(0) / constants12.GAMMA_DIVISION), this._handleChunkEnd();
  };
  Parser4.prototype._handleIDAT = function(length) {
    if (!this._emittedHeadersFinished)
      this._emittedHeadersFinished = !0, this.headersFinished();
    this.read(-length, this._parseIDAT.bind(this, length));
  };
  Parser4.prototype._parseIDAT = function(length, data) {
    if (this._crc.write(data), this._colorType === constants12.COLORTYPE_PALETTE_COLOR && this._palette.length === 0)
      throw Error("Expected palette not found");
    this.inflateData(data);
    let leftOverLength = length - data.length;
    if (leftOverLength > 0)
      this._handleIDAT(leftOverLength);
    else
      this._handleChunkEnd();
  };
  Parser4.prototype._handleIEND = function(length) {
    this.read(length, this._parseIEND.bind(this));
  };
  Parser4.prototype._parseIEND = function(data) {
    if (this._crc.write(data), this._hasIEND = !0, this._handleChunkEnd(), this.finished)
      this.finished();
  };
});
