// var: require_error_correction_level
var require_error_correction_level = __commonJS((exports) => {
  exports.L = { bit: 1 };
  exports.M = { bit: 0 };
  exports.Q = { bit: 3 };
  exports.H = { bit: 2 };
  function fromString6(string5) {
    if (typeof string5 !== "string")
      throw Error("Param is not a string");
    switch (string5.toLowerCase()) {
      case "l":
      case "low":
        return exports.L;
      case "m":
      case "medium":
        return exports.M;
      case "q":
      case "quartile":
        return exports.Q;
      case "h":
      case "high":
        return exports.H;
      default:
        throw Error("Unknown EC Level: " + string5);
    }
  }
  exports.isValid = function(level) {
    return level && typeof level.bit < "u" && level.bit >= 0 && level.bit < 4;
  };
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
