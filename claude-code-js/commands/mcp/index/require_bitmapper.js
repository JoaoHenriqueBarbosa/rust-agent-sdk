// var: require_bitmapper
var require_bitmapper = __commonJS((exports) => {
  var interlaceUtils = require_interlace(), pixelBppMapper = [
    function() {},
    function(pxData, data, pxPos, rawPos) {
      if (rawPos === data.length)
        throw Error("Ran out of data");
      let pixel = data[rawPos];
      pxData[pxPos] = pixel, pxData[pxPos + 1] = pixel, pxData[pxPos + 2] = pixel, pxData[pxPos + 3] = 255;
    },
    function(pxData, data, pxPos, rawPos) {
      if (rawPos + 1 >= data.length)
        throw Error("Ran out of data");
      let pixel = data[rawPos];
      pxData[pxPos] = pixel, pxData[pxPos + 1] = pixel, pxData[pxPos + 2] = pixel, pxData[pxPos + 3] = data[rawPos + 1];
    },
    function(pxData, data, pxPos, rawPos) {
      if (rawPos + 2 >= data.length)
        throw Error("Ran out of data");
      pxData[pxPos] = data[rawPos], pxData[pxPos + 1] = data[rawPos + 1], pxData[pxPos + 2] = data[rawPos + 2], pxData[pxPos + 3] = 255;
    },
    function(pxData, data, pxPos, rawPos) {
      if (rawPos + 3 >= data.length)
        throw Error("Ran out of data");
      pxData[pxPos] = data[rawPos], pxData[pxPos + 1] = data[rawPos + 1], pxData[pxPos + 2] = data[rawPos + 2], pxData[pxPos + 3] = data[rawPos + 3];
    }
  ], pixelBppCustomMapper = [
    function() {},
    function(pxData, pixelData, pxPos, maxBit) {
      let pixel = pixelData[0];
      pxData[pxPos] = pixel, pxData[pxPos + 1] = pixel, pxData[pxPos + 2] = pixel, pxData[pxPos + 3] = maxBit;
    },
    function(pxData, pixelData, pxPos) {
      let pixel = pixelData[0];
      pxData[pxPos] = pixel, pxData[pxPos + 1] = pixel, pxData[pxPos + 2] = pixel, pxData[pxPos + 3] = pixelData[1];
    },
    function(pxData, pixelData, pxPos, maxBit) {
      pxData[pxPos] = pixelData[0], pxData[pxPos + 1] = pixelData[1], pxData[pxPos + 2] = pixelData[2], pxData[pxPos + 3] = maxBit;
    },
    function(pxData, pixelData, pxPos) {
      pxData[pxPos] = pixelData[0], pxData[pxPos + 1] = pixelData[1], pxData[pxPos + 2] = pixelData[2], pxData[pxPos + 3] = pixelData[3];
    }
  ];
  function bitRetriever(data, depth) {
    let leftOver = [], i5 = 0;
    function split2() {
      if (i5 === data.length)
        throw Error("Ran out of data");
      let byte = data[i5];
      i5++;
      let byte8, byte7, byte6, byte5, byte4, byte3, byte2, byte1;
      switch (depth) {
        default:
          throw Error("unrecognised depth");
        case 16:
          byte2 = data[i5], i5++, leftOver.push((byte << 8) + byte2);
          break;
        case 4:
          byte2 = byte & 15, byte1 = byte >> 4, leftOver.push(byte1, byte2);
          break;
        case 2:
          byte4 = byte & 3, byte3 = byte >> 2 & 3, byte2 = byte >> 4 & 3, byte1 = byte >> 6 & 3, leftOver.push(byte1, byte2, byte3, byte4);
          break;
        case 1:
          byte8 = byte & 1, byte7 = byte >> 1 & 1, byte6 = byte >> 2 & 1, byte5 = byte >> 3 & 1, byte4 = byte >> 4 & 1, byte3 = byte >> 5 & 1, byte2 = byte >> 6 & 1, byte1 = byte >> 7 & 1, leftOver.push(byte1, byte2, byte3, byte4, byte5, byte6, byte7, byte8);
          break;
      }
    }
    return {
      get: function(count4) {
        while (leftOver.length < count4)
          split2();
        let returner = leftOver.slice(0, count4);
        return leftOver = leftOver.slice(count4), returner;
      },
      resetAfterLine: function() {
        leftOver.length = 0;
      },
      end: function() {
        if (i5 !== data.length)
          throw Error("extra data found");
      }
    };
  }
  function mapImage8Bit(image, pxData, getPxPos, bpp, data, rawPos) {
    let { width: imageWidth, height: imageHeight, index: imagePass } = image;
    for (let y2 = 0;y2 < imageHeight; y2++)
      for (let x4 = 0;x4 < imageWidth; x4++) {
        let pxPos = getPxPos(x4, y2, imagePass);
        pixelBppMapper[bpp](pxData, data, pxPos, rawPos), rawPos += bpp;
      }
    return rawPos;
  }
  function mapImageCustomBit(image, pxData, getPxPos, bpp, bits2, maxBit) {
    let { width: imageWidth, height: imageHeight, index: imagePass } = image;
    for (let y2 = 0;y2 < imageHeight; y2++) {
      for (let x4 = 0;x4 < imageWidth; x4++) {
        let pixelData = bits2.get(bpp), pxPos = getPxPos(x4, y2, imagePass);
        pixelBppCustomMapper[bpp](pxData, pixelData, pxPos, maxBit);
      }
      bits2.resetAfterLine();
    }
  }
  exports.dataToBitMap = function(data, bitmapInfo) {
    let { width, height: height2, depth, bpp, interlace } = bitmapInfo, bits2;
    if (depth !== 8)
      bits2 = bitRetriever(data, depth);
    let pxData;
    if (depth <= 8)
      pxData = Buffer.alloc(width * height2 * 4);
    else
      pxData = new Uint16Array(width * height2 * 4);
    let maxBit = Math.pow(2, depth) - 1, rawPos = 0, images, getPxPos;
    if (interlace)
      images = interlaceUtils.getImagePasses(width, height2), getPxPos = interlaceUtils.getInterlaceIterator(width, height2);
    else {
      let nonInterlacedPxPos = 0;
      getPxPos = function() {
        let returner = nonInterlacedPxPos;
        return nonInterlacedPxPos += 4, returner;
      }, images = [{ width, height: height2 }];
    }
    for (let imageIndex = 0;imageIndex < images.length; imageIndex++)
      if (depth === 8)
        rawPos = mapImage8Bit(images[imageIndex], pxData, getPxPos, bpp, data, rawPos);
      else
        mapImageCustomBit(images[imageIndex], pxData, getPxPos, bpp, bits2, maxBit);
    if (depth === 8) {
      if (rawPos !== data.length)
        throw Error("extra data found");
    } else
      bits2.end();
    return pxData;
  };
});
