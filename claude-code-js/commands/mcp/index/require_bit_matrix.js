// var: require_bit_matrix
var require_bit_matrix = __commonJS((exports, module) => {
  function BitMatrix(size) {
    if (!size || size < 1)
      throw Error("BitMatrix size must be defined and greater than 0");
    this.size = size, this.data = new Uint8Array(size * size), this.reservedBit = new Uint8Array(size * size);
  }
  BitMatrix.prototype.set = function(row, col, value, reserved) {
    let index = row * this.size + col;
    if (this.data[index] = value, reserved)
      this.reservedBit[index] = !0;
  };
  BitMatrix.prototype.get = function(row, col) {
    return this.data[row * this.size + col];
  };
  BitMatrix.prototype.xor = function(row, col, value) {
    this.data[row * this.size + col] ^= value;
  };
  BitMatrix.prototype.isReserved = function(row, col) {
    return this.reservedBit[row * this.size + col];
  };
  module.exports = BitMatrix;
});
