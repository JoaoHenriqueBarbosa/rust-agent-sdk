// var: require_filter_parse
var require_filter_parse = __commonJS((exports, module) => {
  var interlaceUtils = require_interlace(), paethPredictor = require_paeth_predictor();
  function getByteWidth(width, bpp, depth) {
    let byteWidth = width * bpp;
    if (depth !== 8)
      byteWidth = Math.ceil(byteWidth / (8 / depth));
    return byteWidth;
  }
  var Filter = module.exports = function(bitmapInfo, dependencies) {
    let { width, height: height2, interlace, bpp, depth } = bitmapInfo;
    if (this.read = dependencies.read, this.write = dependencies.write, this.complete = dependencies.complete, this._imageIndex = 0, this._images = [], interlace) {
      let passes = interlaceUtils.getImagePasses(width, height2);
      for (let i5 = 0;i5 < passes.length; i5++)
        this._images.push({
          byteWidth: getByteWidth(passes[i5].width, bpp, depth),
          height: passes[i5].height,
          lineIndex: 0
        });
    } else
      this._images.push({
        byteWidth: getByteWidth(width, bpp, depth),
        height: height2,
        lineIndex: 0
      });
    if (depth === 8)
      this._xComparison = bpp;
    else if (depth === 16)
      this._xComparison = bpp * 2;
    else
      this._xComparison = 1;
  };
  Filter.prototype.start = function() {
    this.read(this._images[this._imageIndex].byteWidth + 1, this._reverseFilterLine.bind(this));
  };
  Filter.prototype._unFilterType1 = function(rawData, unfilteredLine, byteWidth) {
    let xComparison = this._xComparison, xBiggerThan = xComparison - 1;
    for (let x4 = 0;x4 < byteWidth; x4++) {
      let rawByte = rawData[1 + x4], f1Left = x4 > xBiggerThan ? unfilteredLine[x4 - xComparison] : 0;
      unfilteredLine[x4] = rawByte + f1Left;
    }
  };
  Filter.prototype._unFilterType2 = function(rawData, unfilteredLine, byteWidth) {
    let lastLine2 = this._lastLine;
    for (let x4 = 0;x4 < byteWidth; x4++) {
      let rawByte = rawData[1 + x4], f2Up = lastLine2 ? lastLine2[x4] : 0;
      unfilteredLine[x4] = rawByte + f2Up;
    }
  };
  Filter.prototype._unFilterType3 = function(rawData, unfilteredLine, byteWidth) {
    let xComparison = this._xComparison, xBiggerThan = xComparison - 1, lastLine2 = this._lastLine;
    for (let x4 = 0;x4 < byteWidth; x4++) {
      let rawByte = rawData[1 + x4], f3Up = lastLine2 ? lastLine2[x4] : 0, f3Left = x4 > xBiggerThan ? unfilteredLine[x4 - xComparison] : 0, f3Add = Math.floor((f3Left + f3Up) / 2);
      unfilteredLine[x4] = rawByte + f3Add;
    }
  };
  Filter.prototype._unFilterType4 = function(rawData, unfilteredLine, byteWidth) {
    let xComparison = this._xComparison, xBiggerThan = xComparison - 1, lastLine2 = this._lastLine;
    for (let x4 = 0;x4 < byteWidth; x4++) {
      let rawByte = rawData[1 + x4], f4Up = lastLine2 ? lastLine2[x4] : 0, f4Left = x4 > xBiggerThan ? unfilteredLine[x4 - xComparison] : 0, f4UpLeft = x4 > xBiggerThan && lastLine2 ? lastLine2[x4 - xComparison] : 0, f4Add = paethPredictor(f4Left, f4Up, f4UpLeft);
      unfilteredLine[x4] = rawByte + f4Add;
    }
  };
  Filter.prototype._reverseFilterLine = function(rawData) {
    let filter3 = rawData[0], unfilteredLine, currentImage = this._images[this._imageIndex], byteWidth = currentImage.byteWidth;
    if (filter3 === 0)
      unfilteredLine = rawData.slice(1, byteWidth + 1);
    else
      switch (unfilteredLine = Buffer.alloc(byteWidth), filter3) {
        case 1:
          this._unFilterType1(rawData, unfilteredLine, byteWidth);
          break;
        case 2:
          this._unFilterType2(rawData, unfilteredLine, byteWidth);
          break;
        case 3:
          this._unFilterType3(rawData, unfilteredLine, byteWidth);
          break;
        case 4:
          this._unFilterType4(rawData, unfilteredLine, byteWidth);
          break;
        default:
          throw Error("Unrecognised filter type - " + filter3);
      }
    if (this.write(unfilteredLine), currentImage.lineIndex++, currentImage.lineIndex >= currentImage.height)
      this._lastLine = null, this._imageIndex++, currentImage = this._images[this._imageIndex];
    else
      this._lastLine = unfilteredLine;
    if (currentImage)
      this.read(currentImage.byteWidth + 1, this._reverseFilterLine.bind(this));
    else
      this._lastLine = null, this.complete();
  };
});
