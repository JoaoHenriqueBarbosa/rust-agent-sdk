// var: require_format_info
var require_format_info = __commonJS((exports) => {
  var Utils = require_utils13(), G15_BCH = Utils.getBCHDigit(1335);
  exports.getEncodedBits = function(errorCorrectionLevel, mask) {
    let data = errorCorrectionLevel.bit << 3 | mask, d = data << 10;
    while (Utils.getBCHDigit(d) - G15_BCH >= 0)
      d ^= 1335 << Utils.getBCHDigit(d) - G15_BCH;
    return (data << 10 | d) ^ 21522;
  };
});
