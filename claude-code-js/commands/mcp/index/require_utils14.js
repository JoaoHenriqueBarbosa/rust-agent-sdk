// var: require_utils14
var require_utils14 = __commonJS((exports) => {
  function hex2rgba(hex) {
    if (typeof hex === "number")
      hex = hex.toString();
    if (typeof hex !== "string")
      throw Error("Color should be defined as hex string");
    let hexCode = hex.slice().replace("#", "").split("");
    if (hexCode.length < 3 || hexCode.length === 5 || hexCode.length > 8)
      throw Error("Invalid hex color: " + hex);
    if (hexCode.length === 3 || hexCode.length === 4)
      hexCode = Array.prototype.concat.apply([], hexCode.map(function(c3) {
        return [c3, c3];
      }));
    if (hexCode.length === 6)
      hexCode.push("F", "F");
    let hexValue = parseInt(hexCode.join(""), 16);
    return {
      r: hexValue >> 24 & 255,
      g: hexValue >> 16 & 255,
      b: hexValue >> 8 & 255,
      a: hexValue & 255,
      hex: "#" + hexCode.slice(0, 6).join("")
    };
  }
  exports.getOptions = function(options2) {
    if (!options2)
      options2 = {};
    if (!options2.color)
      options2.color = {};
    let margin = typeof options2.margin > "u" || options2.margin === null || options2.margin < 0 ? 4 : options2.margin, width = options2.width && options2.width >= 21 ? options2.width : void 0, scale = options2.scale || 4;
    return {
      width,
      scale: width ? 4 : scale,
      margin,
      color: {
        dark: hex2rgba(options2.color.dark || "#000000ff"),
        light: hex2rgba(options2.color.light || "#ffffffff")
      },
      type: options2.type,
      rendererOpts: options2.rendererOpts || {}
    };
  };
  exports.getScale = function(qrSize, opts) {
    return opts.width && opts.width >= qrSize + opts.margin * 2 ? opts.width / (qrSize + opts.margin * 2) : opts.scale;
  };
  exports.getImageWidth = function(qrSize, opts) {
    let scale = exports.getScale(qrSize, opts);
    return Math.floor((qrSize + opts.margin * 2) * scale);
  };
  exports.qrToImageData = function(imgData, qr, opts) {
    let size = qr.modules.size, data = qr.modules.data, scale = exports.getScale(size, opts), symbolSize = Math.floor((size + opts.margin * 2) * scale), scaledMargin = opts.margin * scale, palette = [opts.color.light, opts.color.dark];
    for (let i5 = 0;i5 < symbolSize; i5++)
      for (let j4 = 0;j4 < symbolSize; j4++) {
        let posDst = (i5 * symbolSize + j4) * 4, pxColor = opts.color.light;
        if (i5 >= scaledMargin && j4 >= scaledMargin && i5 < symbolSize - scaledMargin && j4 < symbolSize - scaledMargin) {
          let iSrc = Math.floor((i5 - scaledMargin) / scale), jSrc = Math.floor((j4 - scaledMargin) / scale);
          pxColor = palette[data[iSrc * size + jSrc] ? 1 : 0];
        }
        imgData[posDst++] = pxColor.r, imgData[posDst++] = pxColor.g, imgData[posDst++] = pxColor.b, imgData[posDst] = pxColor.a;
      }
  };
});
