// var: require_util7
var require_util7 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.nextGreaterSquare = exports.ldexp = void 0;
  function ldexp(frac, exp) {
    if (frac === 0 || frac === Number.POSITIVE_INFINITY || frac === Number.NEGATIVE_INFINITY || Number.isNaN(frac))
      return frac;
    return frac * Math.pow(2, exp);
  }
  exports.ldexp = ldexp;
  function nextGreaterSquare(v2) {
    return v2--, v2 |= v2 >> 1, v2 |= v2 >> 2, v2 |= v2 >> 4, v2 |= v2 >> 8, v2 |= v2 >> 16, v2++, v2;
  }
  exports.nextGreaterSquare = nextGreaterSquare;
});
