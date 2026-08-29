// var: require_parser_async
var require_parser_async = __commonJS((exports, module) => {
  var util12 = __require("util"), zlib4 = __require("zlib"), ChunkStream = require_chunkstream(), FilterAsync = require_filter_parse_async(), Parser4 = require_parser6(), bitmapper = require_bitmapper(), formatNormaliser = require_format_normaliser(), ParserAsync = module.exports = function(options2) {
    ChunkStream.call(this), this._parser = new Parser4(options2, {
      read: this.read.bind(this),
      error: this._handleError.bind(this),
      metadata: this._handleMetaData.bind(this),
      gamma: this.emit.bind(this, "gamma"),
      palette: this._handlePalette.bind(this),
      transColor: this._handleTransColor.bind(this),
      finished: this._finished.bind(this),
      inflateData: this._inflateData.bind(this),
      simpleTransparency: this._simpleTransparency.bind(this),
      headersFinished: this._headersFinished.bind(this)
    }), this._options = options2, this.writable = !0, this._parser.start();
  };
  util12.inherits(ParserAsync, ChunkStream);
  ParserAsync.prototype._handleError = function(err2) {
    if (this.emit("error", err2), this.writable = !1, this.destroy(), this._inflate && this._inflate.destroy)
      this._inflate.destroy();
    if (this._filter)
      this._filter.destroy(), this._filter.on("error", function() {});
    this.errord = !0;
  };
  ParserAsync.prototype._inflateData = function(data) {
    if (!this._inflate)
      if (this._bitmapInfo.interlace)
        this._inflate = zlib4.createInflate(), this._inflate.on("error", this.emit.bind(this, "error")), this._filter.on("complete", this._complete.bind(this)), this._inflate.pipe(this._filter);
      else {
        let imageSize = ((this._bitmapInfo.width * this._bitmapInfo.bpp * this._bitmapInfo.depth + 7 >> 3) + 1) * this._bitmapInfo.height, chunkSize = Math.max(imageSize, zlib4.Z_MIN_CHUNK);
        this._inflate = zlib4.createInflate({ chunkSize });
        let leftToInflate = imageSize, emitError = this.emit.bind(this, "error");
        this._inflate.on("error", function(err2) {
          if (!leftToInflate)
            return;
          emitError(err2);
        }), this._filter.on("complete", this._complete.bind(this));
        let filterWrite = this._filter.write.bind(this._filter);
        this._inflate.on("data", function(chunk) {
          if (!leftToInflate)
            return;
          if (chunk.length > leftToInflate)
            chunk = chunk.slice(0, leftToInflate);
          leftToInflate -= chunk.length, filterWrite(chunk);
        }), this._inflate.on("end", this._filter.end.bind(this._filter));
      }
    this._inflate.write(data);
  };
  ParserAsync.prototype._handleMetaData = function(metaData) {
    this._metaData = metaData, this._bitmapInfo = Object.create(metaData), this._filter = new FilterAsync(this._bitmapInfo);
  };
  ParserAsync.prototype._handleTransColor = function(transColor) {
    this._bitmapInfo.transColor = transColor;
  };
  ParserAsync.prototype._handlePalette = function(palette) {
    this._bitmapInfo.palette = palette;
  };
  ParserAsync.prototype._simpleTransparency = function() {
    this._metaData.alpha = !0;
  };
  ParserAsync.prototype._headersFinished = function() {
    this.emit("metadata", this._metaData);
  };
  ParserAsync.prototype._finished = function() {
    if (this.errord)
      return;
    if (!this._inflate)
      this.emit("error", "No Inflate block");
    else
      this._inflate.end();
  };
  ParserAsync.prototype._complete = function(filteredData) {
    if (this.errord)
      return;
    let normalisedBitmapData;
    try {
      let bitmapData = bitmapper.dataToBitMap(filteredData, this._bitmapInfo);
      normalisedBitmapData = formatNormaliser(bitmapData, this._bitmapInfo), bitmapData = null;
    } catch (ex) {
      this._handleError(ex);
      return;
    }
    this.emit("parsed", normalisedBitmapData);
  };
});
