// var: require_filter_pack
var require_filter_pack = __commonJS((exports, module) => {
  var paethPredictor = require_paeth_predictor();
  function filterNone(pxData, pxPos, byteWidth, rawData, rawPos) {
    for (let x4 = 0;x4 < byteWidth; x4++)
      rawData[rawPos + x4] = pxData[pxPos + x4];
  }
  function filterSumNone(pxData, pxPos, byteWidth) {
    let sum = 0, length = pxPos + byteWidth;
    for (let i5 = pxPos;i5 < length; i5++)
      sum += Math.abs(pxData[i5]);
    return sum;
  }
  function filterSub(pxData, pxPos, byteWidth, rawData, rawPos, bpp) {
    for (let x4 = 0;x4 < byteWidth; x4++) {
      let left = x4 >= bpp ? pxData[pxPos + x4 - bpp] : 0, val = pxData[pxPos + x4] - left;
      rawData[rawPos + x4] = val;
    }
  }
  function filterSumSub(pxData, pxPos, byteWidth, bpp) {
    let sum = 0;
    for (let x4 = 0;x4 < byteWidth; x4++) {
      let left = x4 >= bpp ? pxData[pxPos + x4 - bpp] : 0, val = pxData[pxPos + x4] - left;
      sum += Math.abs(val);
    }
    return sum;
  }
  function filterUp(pxData, pxPos, byteWidth, rawData, rawPos) {
    for (let x4 = 0;x4 < byteWidth; x4++) {
      let up = pxPos > 0 ? pxData[pxPos + x4 - byteWidth] : 0, val = pxData[pxPos + x4] - up;
      rawData[rawPos + x4] = val;
    }
  }
  function filterSumUp(pxData, pxPos, byteWidth) {
    let sum = 0, length = pxPos + byteWidth;
    for (let x4 = pxPos;x4 < length; x4++) {
      let up = pxPos > 0 ? pxData[x4 - byteWidth] : 0, val = pxData[x4] - up;
      sum += Math.abs(val);
    }
    return sum;
  }
  function filterAvg(pxData, pxPos, byteWidth, rawData, rawPos, bpp) {
    for (let x4 = 0;x4 < byteWidth; x4++) {
      let left = x4 >= bpp ? pxData[pxPos + x4 - bpp] : 0, up = pxPos > 0 ? pxData[pxPos + x4 - byteWidth] : 0, val = pxData[pxPos + x4] - (left + up >> 1);
      rawData[rawPos + x4] = val;
    }
  }
  function filterSumAvg(pxData, pxPos, byteWidth, bpp) {
    let sum = 0;
    for (let x4 = 0;x4 < byteWidth; x4++) {
      let left = x4 >= bpp ? pxData[pxPos + x4 - bpp] : 0, up = pxPos > 0 ? pxData[pxPos + x4 - byteWidth] : 0, val = pxData[pxPos + x4] - (left + up >> 1);
      sum += Math.abs(val);
    }
    return sum;
  }
  function filterPaeth(pxData, pxPos, byteWidth, rawData, rawPos, bpp) {
    for (let x4 = 0;x4 < byteWidth; x4++) {
      let left = x4 >= bpp ? pxData[pxPos + x4 - bpp] : 0, up = pxPos > 0 ? pxData[pxPos + x4 - byteWidth] : 0, upleft = pxPos > 0 && x4 >= bpp ? pxData[pxPos + x4 - (byteWidth + bpp)] : 0, val = pxData[pxPos + x4] - paethPredictor(left, up, upleft);
      rawData[rawPos + x4] = val;
    }
  }
  function filterSumPaeth(pxData, pxPos, byteWidth, bpp) {
    let sum = 0;
    for (let x4 = 0;x4 < byteWidth; x4++) {
      let left = x4 >= bpp ? pxData[pxPos + x4 - bpp] : 0, up = pxPos > 0 ? pxData[pxPos + x4 - byteWidth] : 0, upleft = pxPos > 0 && x4 >= bpp ? pxData[pxPos + x4 - (byteWidth + bpp)] : 0, val = pxData[pxPos + x4] - paethPredictor(left, up, upleft);
      sum += Math.abs(val);
    }
    return sum;
  }
  var filters2 = {
    0: filterNone,
    1: filterSub,
    2: filterUp,
    3: filterAvg,
    4: filterPaeth
  }, filterSums = {
    0: filterSumNone,
    1: filterSumSub,
    2: filterSumUp,
    3: filterSumAvg,
    4: filterSumPaeth
  };
  module.exports = function(pxData, width, height2, options2, bpp) {
    let filterTypes;
    if (!("filterType" in options2) || options2.filterType === -1)
      filterTypes = [0, 1, 2, 3, 4];
    else if (typeof options2.filterType === "number")
      filterTypes = [options2.filterType];
    else
      throw Error("unrecognised filter types");
    if (options2.bitDepth === 16)
      bpp *= 2;
    let byteWidth = width * bpp, rawPos = 0, pxPos = 0, rawData = Buffer.alloc((byteWidth + 1) * height2), sel = filterTypes[0];
    for (let y2 = 0;y2 < height2; y2++) {
      if (filterTypes.length > 1) {
        let min = 1 / 0;
        for (let i5 = 0;i5 < filterTypes.length; i5++) {
          let sum = filterSums[filterTypes[i5]](pxData, pxPos, byteWidth, bpp);
          if (sum < min)
            sel = filterTypes[i5], min = sum;
        }
      }
      rawData[rawPos] = sel, rawPos++, filters2[sel](pxData, pxPos, byteWidth, rawData, rawPos, bpp), rawPos += byteWidth, pxPos += byteWidth;
    }
    return rawData;
  };
});
