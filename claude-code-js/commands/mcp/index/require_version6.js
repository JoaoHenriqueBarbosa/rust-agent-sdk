// var: require_version6
var require_version6 = __commonJS((exports) => {
  var Utils = require_utils13(), ECCode = require_error_correction_code(), ECLevel = require_error_correction_level(), Mode = require_mode2(), VersionCheck = require_version_check(), G18_BCH = Utils.getBCHDigit(7973);
  function getBestVersionForDataLength(mode, length, errorCorrectionLevel) {
    for (let currentVersion = 1;currentVersion <= 40; currentVersion++)
      if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, mode))
        return currentVersion;
    return;
  }
  function getReservedBitsCount(mode, version5) {
    return Mode.getCharCountIndicator(mode, version5) + 4;
  }
  function getTotalBitsFromDataArray(segments, version5) {
    let totalBits = 0;
    return segments.forEach(function(data) {
      let reservedBits = getReservedBitsCount(data.mode, version5);
      totalBits += reservedBits + data.getBitsLength();
    }), totalBits;
  }
  function getBestVersionForMixedData(segments, errorCorrectionLevel) {
    for (let currentVersion = 1;currentVersion <= 40; currentVersion++)
      if (getTotalBitsFromDataArray(segments, currentVersion) <= exports.getCapacity(currentVersion, errorCorrectionLevel, Mode.MIXED))
        return currentVersion;
    return;
  }
  exports.from = function(value, defaultValue) {
    if (VersionCheck.isValid(value))
      return parseInt(value, 10);
    return defaultValue;
  };
  exports.getCapacity = function(version5, errorCorrectionLevel, mode) {
    if (!VersionCheck.isValid(version5))
      throw Error("Invalid QR Code version");
    if (typeof mode > "u")
      mode = Mode.BYTE;
    let totalCodewords = Utils.getSymbolTotalCodewords(version5), ecTotalCodewords = ECCode.getTotalCodewordsCount(version5, errorCorrectionLevel), dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;
    if (mode === Mode.MIXED)
      return dataTotalCodewordsBits;
    let usableBits = dataTotalCodewordsBits - getReservedBitsCount(mode, version5);
    switch (mode) {
      case Mode.NUMERIC:
        return Math.floor(usableBits / 10 * 3);
      case Mode.ALPHANUMERIC:
        return Math.floor(usableBits / 11 * 2);
      case Mode.KANJI:
        return Math.floor(usableBits / 13);
      case Mode.BYTE:
      default:
        return Math.floor(usableBits / 8);
    }
  };
  exports.getBestVersionForData = function(data, errorCorrectionLevel) {
    let seg, ecl = ECLevel.from(errorCorrectionLevel, ECLevel.M);
    if (Array.isArray(data)) {
      if (data.length > 1)
        return getBestVersionForMixedData(data, ecl);
      if (data.length === 0)
        return 1;
      seg = data[0];
    } else
      seg = data;
    return getBestVersionForDataLength(seg.mode, seg.getLength(), ecl);
  };
  exports.getEncodedBits = function(version5) {
    if (!VersionCheck.isValid(version5) || version5 < 7)
      throw Error("Invalid QR Code version");
    let d = version5 << 12;
    while (Utils.getBCHDigit(d) - G18_BCH >= 0)
      d ^= 7973 << Utils.getBCHDigit(d) - G18_BCH;
    return version5 << 12 | d;
  };
});
