// var: require_qrcode
var require_qrcode = __commonJS((exports) => {
  var Utils = require_utils13(), ECLevel = require_error_correction_level(), BitBuffer = require_bit_buffer(), BitMatrix = require_bit_matrix(), AlignmentPattern = require_alignment_pattern(), FinderPattern = require_finder_pattern(), MaskPattern = require_mask_pattern(), ECCode = require_error_correction_code(), ReedSolomonEncoder = require_reed_solomon_encoder(), Version = require_version6(), FormatInfo = require_format_info(), Mode = require_mode2(), Segments = require_segments();
  function setupFinderPattern(matrix, version5) {
    let size = matrix.size, pos = FinderPattern.getPositions(version5);
    for (let i5 = 0;i5 < pos.length; i5++) {
      let row = pos[i5][0], col = pos[i5][1];
      for (let r4 = -1;r4 <= 7; r4++) {
        if (row + r4 <= -1 || size <= row + r4)
          continue;
        for (let c3 = -1;c3 <= 7; c3++) {
          if (col + c3 <= -1 || size <= col + c3)
            continue;
          if (r4 >= 0 && r4 <= 6 && (c3 === 0 || c3 === 6) || c3 >= 0 && c3 <= 6 && (r4 === 0 || r4 === 6) || r4 >= 2 && r4 <= 4 && c3 >= 2 && c3 <= 4)
            matrix.set(row + r4, col + c3, !0, !0);
          else
            matrix.set(row + r4, col + c3, !1, !0);
        }
      }
    }
  }
  function setupTimingPattern(matrix) {
    let size = matrix.size;
    for (let r4 = 8;r4 < size - 8; r4++) {
      let value = r4 % 2 === 0;
      matrix.set(r4, 6, value, !0), matrix.set(6, r4, value, !0);
    }
  }
  function setupAlignmentPattern(matrix, version5) {
    let pos = AlignmentPattern.getPositions(version5);
    for (let i5 = 0;i5 < pos.length; i5++) {
      let row = pos[i5][0], col = pos[i5][1];
      for (let r4 = -2;r4 <= 2; r4++)
        for (let c3 = -2;c3 <= 2; c3++)
          if (r4 === -2 || r4 === 2 || c3 === -2 || c3 === 2 || r4 === 0 && c3 === 0)
            matrix.set(row + r4, col + c3, !0, !0);
          else
            matrix.set(row + r4, col + c3, !1, !0);
    }
  }
  function setupVersionInfo(matrix, version5) {
    let size = matrix.size, bits2 = Version.getEncodedBits(version5), row, col, mod;
    for (let i5 = 0;i5 < 18; i5++)
      row = Math.floor(i5 / 3), col = i5 % 3 + size - 8 - 3, mod = (bits2 >> i5 & 1) === 1, matrix.set(row, col, mod, !0), matrix.set(col, row, mod, !0);
  }
  function setupFormatInfo(matrix, errorCorrectionLevel, maskPattern) {
    let size = matrix.size, bits2 = FormatInfo.getEncodedBits(errorCorrectionLevel, maskPattern), i5, mod;
    for (i5 = 0;i5 < 15; i5++) {
      if (mod = (bits2 >> i5 & 1) === 1, i5 < 6)
        matrix.set(i5, 8, mod, !0);
      else if (i5 < 8)
        matrix.set(i5 + 1, 8, mod, !0);
      else
        matrix.set(size - 15 + i5, 8, mod, !0);
      if (i5 < 8)
        matrix.set(8, size - i5 - 1, mod, !0);
      else if (i5 < 9)
        matrix.set(8, 15 - i5 - 1 + 1, mod, !0);
      else
        matrix.set(8, 15 - i5 - 1, mod, !0);
    }
    matrix.set(size - 8, 8, 1, !0);
  }
  function setupData(matrix, data) {
    let size = matrix.size, inc = -1, row = size - 1, bitIndex = 7, byteIndex = 0;
    for (let col = size - 1;col > 0; col -= 2) {
      if (col === 6)
        col--;
      while (!0) {
        for (let c3 = 0;c3 < 2; c3++)
          if (!matrix.isReserved(row, col - c3)) {
            let dark = !1;
            if (byteIndex < data.length)
              dark = (data[byteIndex] >>> bitIndex & 1) === 1;
            if (matrix.set(row, col - c3, dark), bitIndex--, bitIndex === -1)
              byteIndex++, bitIndex = 7;
          }
        if (row += inc, row < 0 || size <= row) {
          row -= inc, inc = -inc;
          break;
        }
      }
    }
  }
  function createData(version5, errorCorrectionLevel, segments) {
    let buffer = new BitBuffer;
    segments.forEach(function(data) {
      buffer.put(data.mode.bit, 4), buffer.put(data.getLength(), Mode.getCharCountIndicator(data.mode, version5)), data.write(buffer);
    });
    let totalCodewords = Utils.getSymbolTotalCodewords(version5), ecTotalCodewords = ECCode.getTotalCodewordsCount(version5, errorCorrectionLevel), dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;
    if (buffer.getLengthInBits() + 4 <= dataTotalCodewordsBits)
      buffer.put(0, 4);
    while (buffer.getLengthInBits() % 8 !== 0)
      buffer.putBit(0);
    let remainingByte = (dataTotalCodewordsBits - buffer.getLengthInBits()) / 8;
    for (let i5 = 0;i5 < remainingByte; i5++)
      buffer.put(i5 % 2 ? 17 : 236, 8);
    return createCodewords(buffer, version5, errorCorrectionLevel);
  }
  function createCodewords(bitBuffer, version5, errorCorrectionLevel) {
    let totalCodewords = Utils.getSymbolTotalCodewords(version5), ecTotalCodewords = ECCode.getTotalCodewordsCount(version5, errorCorrectionLevel), dataTotalCodewords = totalCodewords - ecTotalCodewords, ecTotalBlocks = ECCode.getBlocksCount(version5, errorCorrectionLevel), blocksInGroup2 = totalCodewords % ecTotalBlocks, blocksInGroup1 = ecTotalBlocks - blocksInGroup2, totalCodewordsInGroup1 = Math.floor(totalCodewords / ecTotalBlocks), dataCodewordsInGroup1 = Math.floor(dataTotalCodewords / ecTotalBlocks), dataCodewordsInGroup2 = dataCodewordsInGroup1 + 1, ecCount = totalCodewordsInGroup1 - dataCodewordsInGroup1, rs = new ReedSolomonEncoder(ecCount), offset = 0, dcData = Array(ecTotalBlocks), ecData = Array(ecTotalBlocks), maxDataSize = 0, buffer = new Uint8Array(bitBuffer.buffer);
    for (let b = 0;b < ecTotalBlocks; b++) {
      let dataSize = b < blocksInGroup1 ? dataCodewordsInGroup1 : dataCodewordsInGroup2;
      dcData[b] = buffer.slice(offset, offset + dataSize), ecData[b] = rs.encode(dcData[b]), offset += dataSize, maxDataSize = Math.max(maxDataSize, dataSize);
    }
    let data = new Uint8Array(totalCodewords), index = 0, i5, r4;
    for (i5 = 0;i5 < maxDataSize; i5++)
      for (r4 = 0;r4 < ecTotalBlocks; r4++)
        if (i5 < dcData[r4].length)
          data[index++] = dcData[r4][i5];
    for (i5 = 0;i5 < ecCount; i5++)
      for (r4 = 0;r4 < ecTotalBlocks; r4++)
        data[index++] = ecData[r4][i5];
    return data;
  }
  function createSymbol(data, version5, errorCorrectionLevel, maskPattern) {
    let segments;
    if (Array.isArray(data))
      segments = Segments.fromArray(data);
    else if (typeof data === "string") {
      let estimatedVersion = version5;
      if (!estimatedVersion) {
        let rawSegments = Segments.rawSplit(data);
        estimatedVersion = Version.getBestVersionForData(rawSegments, errorCorrectionLevel);
      }
      segments = Segments.fromString(data, estimatedVersion || 40);
    } else
      throw Error("Invalid data");
    let bestVersion = Version.getBestVersionForData(segments, errorCorrectionLevel);
    if (!bestVersion)
      throw Error("The amount of data is too big to be stored in a QR Code");
    if (!version5)
      version5 = bestVersion;
    else if (version5 < bestVersion)
      throw Error(`
The chosen QR Code version cannot contain this amount of data.
Minimum version required to store current data is: ` + bestVersion + `.
`);
    let dataBits = createData(version5, errorCorrectionLevel, segments), moduleCount = Utils.getSymbolSize(version5), modules = new BitMatrix(moduleCount);
    if (setupFinderPattern(modules, version5), setupTimingPattern(modules), setupAlignmentPattern(modules, version5), setupFormatInfo(modules, errorCorrectionLevel, 0), version5 >= 7)
      setupVersionInfo(modules, version5);
    if (setupData(modules, dataBits), isNaN(maskPattern))
      maskPattern = MaskPattern.getBestMask(modules, setupFormatInfo.bind(null, modules, errorCorrectionLevel));
    return MaskPattern.applyMask(maskPattern, modules), setupFormatInfo(modules, errorCorrectionLevel, maskPattern), {
      modules,
      version: version5,
      errorCorrectionLevel,
      maskPattern,
      segments
    };
  }
  exports.create = function(data, options2) {
    if (typeof data > "u" || data === "")
      throw Error("No input text");
    let errorCorrectionLevel = ECLevel.M, version5, mask;
    if (typeof options2 < "u") {
      if (errorCorrectionLevel = ECLevel.from(options2.errorCorrectionLevel, ECLevel.M), version5 = Version.from(options2.version), mask = MaskPattern.from(options2.maskPattern), options2.toSJISFunc)
        Utils.setToSJISFunction(options2.toSJISFunc);
    }
    return createSymbol(data, version5, errorCorrectionLevel, mask);
  };
});
