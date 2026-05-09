// var: require_byte_data
var require_byte_data = __commonJS((exports, module) => {
  var Mode = require_mode2();
  function ByteData(data) {
    if (this.mode = Mode.BYTE, typeof data === "string")
      this.data = (/* @__PURE__ */ new TextEncoder()).encode(data);
    else
      this.data = new Uint8Array(data);
  }
  ByteData.getBitsLength = function(length) {
    return length * 8;
  };
  ByteData.prototype.getLength = function() {
    return this.data.length;
  };
  ByteData.prototype.getBitsLength = function() {
    return ByteData.getBitsLength(this.data.length);
  };
  ByteData.prototype.write = function(bitBuffer) {
    for (let i5 = 0, l3 = this.data.length;i5 < l3; i5++)
      bitBuffer.put(this.data[i5], 8);
  };
  module.exports = ByteData;
});
