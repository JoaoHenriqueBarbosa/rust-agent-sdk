// var: require_ieee754
var require_ieee754 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.getSignificand = exports.getNormalBase2 = exports.MIN_VALUE = exports.MAX_NORMAL_EXPONENT = exports.MIN_NORMAL_EXPONENT = exports.SIGNIFICAND_WIDTH = void 0;
  exports.SIGNIFICAND_WIDTH = 52;
  var EXPONENT_MASK = 2146435072, SIGNIFICAND_MASK = 1048575, EXPONENT_BIAS = 1023;
  exports.MIN_NORMAL_EXPONENT = -EXPONENT_BIAS + 1;
  exports.MAX_NORMAL_EXPONENT = EXPONENT_BIAS;
  exports.MIN_VALUE = Math.pow(2, -1022);
  function getNormalBase2(value) {
    let dv = new DataView(new ArrayBuffer(8));
    return dv.setFloat64(0, value), ((dv.getUint32(0) & EXPONENT_MASK) >> 20) - EXPONENT_BIAS;
  }
  exports.getNormalBase2 = getNormalBase2;
  function getSignificand(value) {
    let dv = new DataView(new ArrayBuffer(8));
    dv.setFloat64(0, value);
    let hiBits = dv.getUint32(0), loBits = dv.getUint32(4);
    return (hiBits & SIGNIFICAND_MASK) * Math.pow(2, 32) + loBits;
  }
  exports.getSignificand = getSignificand;
});
