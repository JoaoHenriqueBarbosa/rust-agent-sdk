// var: require_bitpacker
var require_bitpacker = __commonJS((exports, module) => {
  var constants12 = require_constants5();
  module.exports = function(dataIn, width, height2, options2) {
    let outHasAlpha = [constants12.COLORTYPE_COLOR_ALPHA, constants12.COLORTYPE_ALPHA].indexOf(options2.colorType) !== -1;
    if (options2.colorType === options2.inputColorType) {
      let bigEndian = function() {
        let buffer = new ArrayBuffer(2);
        return new DataView(buffer).setInt16(0, 256, !0), new Int16Array(buffer)[0] !== 256;
      }();
      if (options2.bitDepth === 8 || options2.bitDepth === 16 && bigEndian)
        return dataIn;
    }
    let data = options2.bitDepth !== 16 ? dataIn : new Uint16Array(dataIn.buffer), maxValue = 255, inBpp = constants12.COLORTYPE_TO_BPP_MAP[options2.inputColorType];
    if (inBpp === 4 && !options2.inputHasAlpha)
      inBpp = 3;
    let outBpp = constants12.COLORTYPE_TO_BPP_MAP[options2.colorType];
    if (options2.bitDepth === 16)
      maxValue = 65535, outBpp *= 2;
    let outData = Buffer.alloc(width * height2 * outBpp), inIndex = 0, outIndex = 0, bgColor = options2.bgColor || {};
    if (bgColor.red === void 0)
      bgColor.red = maxValue;
    if (bgColor.green === void 0)
      bgColor.green = maxValue;
    if (bgColor.blue === void 0)
      bgColor.blue = maxValue;
    function getRGBA() {
      let red2, green2, blue2, alpha = maxValue;
      switch (options2.inputColorType) {
        case constants12.COLORTYPE_COLOR_ALPHA:
          alpha = data[inIndex + 3], red2 = data[inIndex], green2 = data[inIndex + 1], blue2 = data[inIndex + 2];
          break;
        case constants12.COLORTYPE_COLOR:
          red2 = data[inIndex], green2 = data[inIndex + 1], blue2 = data[inIndex + 2];
          break;
        case constants12.COLORTYPE_ALPHA:
          alpha = data[inIndex + 1], red2 = data[inIndex], green2 = red2, blue2 = red2;
          break;
        case constants12.COLORTYPE_GRAYSCALE:
          red2 = data[inIndex], green2 = red2, blue2 = red2;
          break;
        default:
          throw Error("input color type:" + options2.inputColorType + " is not supported at present");
      }
      if (options2.inputHasAlpha) {
        if (!outHasAlpha)
          alpha /= maxValue, red2 = Math.min(Math.max(Math.round((1 - alpha) * bgColor.red + alpha * red2), 0), maxValue), green2 = Math.min(Math.max(Math.round((1 - alpha) * bgColor.green + alpha * green2), 0), maxValue), blue2 = Math.min(Math.max(Math.round((1 - alpha) * bgColor.blue + alpha * blue2), 0), maxValue);
      }
      return { red: red2, green: green2, blue: blue2, alpha };
    }
    for (let y2 = 0;y2 < height2; y2++)
      for (let x4 = 0;x4 < width; x4++) {
        let rgba = getRGBA(data, inIndex);
        switch (options2.colorType) {
          case constants12.COLORTYPE_COLOR_ALPHA:
          case constants12.COLORTYPE_COLOR:
            if (options2.bitDepth === 8) {
              if (outData[outIndex] = rgba.red, outData[outIndex + 1] = rgba.green, outData[outIndex + 2] = rgba.blue, outHasAlpha)
                outData[outIndex + 3] = rgba.alpha;
            } else if (outData.writeUInt16BE(rgba.red, outIndex), outData.writeUInt16BE(rgba.green, outIndex + 2), outData.writeUInt16BE(rgba.blue, outIndex + 4), outHasAlpha)
              outData.writeUInt16BE(rgba.alpha, outIndex + 6);
            break;
          case constants12.COLORTYPE_ALPHA:
          case constants12.COLORTYPE_GRAYSCALE: {
            let grayscale = (rgba.red + rgba.green + rgba.blue) / 3;
            if (options2.bitDepth === 8) {
              if (outData[outIndex] = grayscale, outHasAlpha)
                outData[outIndex + 1] = rgba.alpha;
            } else if (outData.writeUInt16BE(grayscale, outIndex), outHasAlpha)
              outData.writeUInt16BE(rgba.alpha, outIndex + 2);
            break;
          }
          default:
            throw Error("unrecognised color Type " + options2.colorType);
        }
        inIndex += inBpp, outIndex += outBpp;
      }
    return outData;
  };
});
