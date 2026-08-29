// var: require_reed_solomon_encoder
var require_reed_solomon_encoder = __commonJS((exports, module) => {
  var Polynomial = require_polynomial();
  function ReedSolomonEncoder(degree) {
    if (this.genPoly = void 0, this.degree = degree, this.degree)
      this.initialize(this.degree);
  }
  ReedSolomonEncoder.prototype.initialize = function(degree) {
    this.degree = degree, this.genPoly = Polynomial.generateECPolynomial(this.degree);
  };
  ReedSolomonEncoder.prototype.encode = function(data) {
    if (!this.genPoly)
      throw Error("Encoder not initialized");
    let paddedData = new Uint8Array(data.length + this.degree);
    paddedData.set(data);
    let remainder = Polynomial.mod(paddedData, this.genPoly), start = this.degree - remainder.length;
    if (start > 0) {
      let buff = new Uint8Array(this.degree);
      return buff.set(remainder, start), buff;
    }
    return remainder;
  };
  module.exports = ReedSolomonEncoder;
});
