// var: require_buffer_equal_constant_time
var require_buffer_equal_constant_time = __commonJS((exports, module) => {
  var Buffer13 = __require("buffer").Buffer, SlowBuffer = __require("buffer").SlowBuffer;
  module.exports = bufferEq;
  function bufferEq(a2, b) {
    if (!Buffer13.isBuffer(a2) || !Buffer13.isBuffer(b))
      return !1;
    if (a2.length !== b.length)
      return !1;
    var c3 = 0;
    for (var i4 = 0;i4 < a2.length; i4++)
      c3 |= a2[i4] ^ b[i4];
    return c3 === 0;
  }
  bufferEq.install = function() {
    Buffer13.prototype.equal = SlowBuffer.prototype.equal = function(that) {
      return bufferEq(this, that);
    };
  };
  var origBufEqual = Buffer13.prototype.equal, origSlowBufEqual = SlowBuffer.prototype.equal;
  bufferEq.restore = function() {
    Buffer13.prototype.equal = origBufEqual, SlowBuffer.prototype.equal = origSlowBufEqual;
  };
});
