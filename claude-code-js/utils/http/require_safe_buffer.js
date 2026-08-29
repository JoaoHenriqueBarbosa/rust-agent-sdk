// var: require_safe_buffer
var require_safe_buffer = __commonJS((exports, module) => {
  /*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
  var buffer = __require("buffer"), Buffer13 = buffer.Buffer;
  function copyProps(src, dst) {
    for (var key in src)
      dst[key] = src[key];
  }
  if (Buffer13.from && Buffer13.alloc && Buffer13.allocUnsafe && Buffer13.allocUnsafeSlow)
    module.exports = buffer;
  else
    copyProps(buffer, exports), exports.Buffer = SafeBuffer;
  function SafeBuffer(arg, encodingOrOffset, length) {
    return Buffer13(arg, encodingOrOffset, length);
  }
  SafeBuffer.prototype = Object.create(Buffer13.prototype);
  copyProps(Buffer13, SafeBuffer);
  SafeBuffer.from = function(arg, encodingOrOffset, length) {
    if (typeof arg === "number")
      throw TypeError("Argument must not be a number");
    return Buffer13(arg, encodingOrOffset, length);
  };
  SafeBuffer.alloc = function(size, fill, encoding) {
    if (typeof size !== "number")
      throw TypeError("Argument must be a number");
    var buf = Buffer13(size);
    if (fill !== void 0)
      if (typeof encoding === "string")
        buf.fill(fill, encoding);
      else
        buf.fill(fill);
    else
      buf.fill(0);
    return buf;
  };
  SafeBuffer.allocUnsafe = function(size) {
    if (typeof size !== "number")
      throw TypeError("Argument must be a number");
    return Buffer13(size);
  };
  SafeBuffer.allocUnsafeSlow = function(size) {
    if (typeof size !== "number")
      throw TypeError("Argument must be a number");
    return buffer.SlowBuffer(size);
  };
});
