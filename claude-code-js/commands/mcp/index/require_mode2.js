// var: require_mode2
var require_mode2 = __commonJS((exports) => {
  var VersionCheck = require_version_check(), Regex = require_regex3();
  exports.NUMERIC = {
    id: "Numeric",
    bit: 1,
    ccBits: [10, 12, 14]
  };
  exports.ALPHANUMERIC = {
    id: "Alphanumeric",
    bit: 2,
    ccBits: [9, 11, 13]
  };
  exports.BYTE = {
    id: "Byte",
    bit: 4,
    ccBits: [8, 16, 16]
  };
  exports.KANJI = {
    id: "Kanji",
    bit: 8,
    ccBits: [8, 10, 12]
  };
  exports.MIXED = {
    bit: -1
  };
  exports.getCharCountIndicator = function(mode, version5) {
    if (!mode.ccBits)
      throw Error("Invalid mode: " + mode);
    if (!VersionCheck.isValid(version5))
      throw Error("Invalid version: " + version5);
    if (version5 >= 1 && version5 < 10)
      return mode.ccBits[0];
    else if (version5 < 27)
      return mode.ccBits[1];
    return mode.ccBits[2];
  };
  exports.getBestModeForData = function(dataStr) {
    if (Regex.testNumeric(dataStr))
      return exports.NUMERIC;
    else if (Regex.testAlphanumeric(dataStr))
      return exports.ALPHANUMERIC;
    else if (Regex.testKanji(dataStr))
      return exports.KANJI;
    else
      return exports.BYTE;
  };
  exports.toString = function(mode) {
    if (mode && mode.id)
      return mode.id;
    throw Error("Invalid mode");
  };
  exports.isValid = function(mode) {
    return mode && mode.bit && mode.ccBits;
  };
  function fromString6(string5) {
    if (typeof string5 !== "string")
      throw Error("Param is not a string");
    switch (string5.toLowerCase()) {
      case "numeric":
        return exports.NUMERIC;
      case "alphanumeric":
        return exports.ALPHANUMERIC;
      case "kanji":
        return exports.KANJI;
      case "byte":
        return exports.BYTE;
      default:
        throw Error("Unknown mode: " + string5);
    }
  }
  exports.from = function(value, defaultValue) {
    if (exports.isValid(value))
      return value;
    try {
      return fromString6(value);
    } catch (e) {
      return defaultValue;
    }
  };
});
