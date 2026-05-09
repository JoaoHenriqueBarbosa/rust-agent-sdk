// var: require_data_stream
var require_data_stream = __commonJS((exports, module) => {
  var Buffer13 = require_safe_buffer().Buffer, Stream3 = __require("stream"), util10 = __require("util");
  function DataStream(data) {
    if (this.buffer = null, this.writable = !0, this.readable = !0, !data)
      return this.buffer = Buffer13.alloc(0), this;
    if (typeof data.pipe === "function")
      return this.buffer = Buffer13.alloc(0), data.pipe(this), this;
    if (data.length || typeof data === "object")
      return this.buffer = data, this.writable = !1, process.nextTick(function() {
        this.emit("end", data), this.readable = !1, this.emit("close");
      }.bind(this)), this;
    throw TypeError("Unexpected data type (" + typeof data + ")");
  }
  util10.inherits(DataStream, Stream3);
  DataStream.prototype.write = function(data) {
    this.buffer = Buffer13.concat([this.buffer, Buffer13.from(data)]), this.emit("data", data);
  };
  DataStream.prototype.end = function(data) {
    if (data)
      this.write(data);
    this.emit("end", data), this.emit("close"), this.writable = !1, this.readable = !1;
  };
  module.exports = DataStream;
});
