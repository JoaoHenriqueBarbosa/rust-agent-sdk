// var: require_bit_buffer
var require_bit_buffer = __commonJS((exports, module) => {
  function BitBuffer() {
    this.buffer = [], this.length = 0;
  }
  BitBuffer.prototype = {
    get: function(index) {
      let bufIndex = Math.floor(index / 8);
      return (this.buffer[bufIndex] >>> 7 - index % 8 & 1) === 1;
    },
    put: function(num, length) {
      for (let i5 = 0;i5 < length; i5++)
        this.putBit((num >>> length - i5 - 1 & 1) === 1);
    },
    getLengthInBits: function() {
      return this.length;
    },
    putBit: function(bit) {
      let bufIndex = Math.floor(this.length / 8);
      if (this.buffer.length <= bufIndex)
        this.buffer.push(0);
      if (bit)
        this.buffer[bufIndex] |= 128 >>> this.length % 8;
      this.length++;
    }
  };
  module.exports = BitBuffer;
});
