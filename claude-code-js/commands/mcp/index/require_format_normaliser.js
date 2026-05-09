// var: require_format_normaliser
var require_format_normaliser = __commonJS((exports, module) => {
  function dePalette(indata, outdata, width, height2, palette) {
    let pxPos = 0;
    for (let y2 = 0;y2 < height2; y2++)
      for (let x4 = 0;x4 < width; x4++) {
        let color3 = palette[indata[pxPos]];
        if (!color3)
          throw Error("index " + indata[pxPos] + " not in palette");
        for (let i5 = 0;i5 < 4; i5++)
          outdata[pxPos + i5] = color3[i5];
        pxPos += 4;
      }
  }
  function replaceTransparentColor(indata, outdata, width, height2, transColor) {
    let pxPos = 0;
    for (let y2 = 0;y2 < height2; y2++)
      for (let x4 = 0;x4 < width; x4++) {
        let makeTrans = !1;
        if (transColor.length === 1) {
          if (transColor[0] === indata[pxPos])
            makeTrans = !0;
        } else if (transColor[0] === indata[pxPos] && transColor[1] === indata[pxPos + 1] && transColor[2] === indata[pxPos + 2])
          makeTrans = !0;
        if (makeTrans)
          for (let i5 = 0;i5 < 4; i5++)
            outdata[pxPos + i5] = 0;
        pxPos += 4;
      }
  }
  function scaleDepth(indata, outdata, width, height2, depth) {
    let maxOutSample = 255, maxInSample = Math.pow(2, depth) - 1, pxPos = 0;
    for (let y2 = 0;y2 < height2; y2++)
      for (let x4 = 0;x4 < width; x4++) {
        for (let i5 = 0;i5 < 4; i5++)
          outdata[pxPos + i5] = Math.floor(indata[pxPos + i5] * maxOutSample / maxInSample + 0.5);
        pxPos += 4;
      }
  }
  module.exports = function(indata, imageData) {
    let { depth, width, height: height2, colorType, transColor, palette } = imageData, outdata = indata;
    if (colorType === 3)
      dePalette(indata, outdata, width, height2, palette);
    else {
      if (transColor)
        replaceTransparentColor(indata, outdata, width, height2, transColor);
      if (depth !== 8) {
        if (depth === 16)
          outdata = Buffer.alloc(width * height2 * 4);
        scaleDepth(indata, outdata, width, height2, depth);
      }
    }
    return outdata;
  };
});
