// var: require_polynomial
var require_polynomial = __commonJS((exports) => {
  var GF = require_galois_field();
  exports.mul = function(p1, p22) {
    let coeff = new Uint8Array(p1.length + p22.length - 1);
    for (let i5 = 0;i5 < p1.length; i5++)
      for (let j4 = 0;j4 < p22.length; j4++)
        coeff[i5 + j4] ^= GF.mul(p1[i5], p22[j4]);
    return coeff;
  };
  exports.mod = function(divident, divisor) {
    let result = new Uint8Array(divident);
    while (result.length - divisor.length >= 0) {
      let coeff = result[0];
      for (let i5 = 0;i5 < divisor.length; i5++)
        result[i5] ^= GF.mul(divisor[i5], coeff);
      let offset = 0;
      while (offset < result.length && result[offset] === 0)
        offset++;
      result = result.slice(offset);
    }
    return result;
  };
  exports.generateECPolynomial = function(degree) {
    let poly = new Uint8Array([1]);
    for (let i5 = 0;i5 < degree; i5++)
      poly = exports.mul(poly, new Uint8Array([1, GF.exp(i5)]));
    return poly;
  };
});
