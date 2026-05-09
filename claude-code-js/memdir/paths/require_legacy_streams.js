// var: require_legacy_streams
var require_legacy_streams = __commonJS((exports, module) => {
  var Stream2 = __require("stream").Stream;
  module.exports = legacy;
  function legacy(fs4) {
    return {
      ReadStream,
      WriteStream
    };
    function ReadStream(path9, options) {
      if (!(this instanceof ReadStream))
        return new ReadStream(path9, options);
      Stream2.call(this);
      var self2 = this;
      this.path = path9, this.fd = null, this.readable = !0, this.paused = !1, this.flags = "r", this.mode = 438, this.bufferSize = 65536, options = options || {};
      var keys2 = Object.keys(options);
      for (var index = 0, length = keys2.length;index < length; index++) {
        var key = keys2[index];
        this[key] = options[key];
      }
      if (this.encoding)
        this.setEncoding(this.encoding);
      if (this.start !== void 0) {
        if (typeof this.start !== "number")
          throw TypeError("start must be a Number");
        if (this.end === void 0)
          this.end = 1 / 0;
        else if (typeof this.end !== "number")
          throw TypeError("end must be a Number");
        if (this.start > this.end)
          throw Error("start must be <= end");
        this.pos = this.start;
      }
      if (this.fd !== null) {
        process.nextTick(function() {
          self2._read();
        });
        return;
      }
      fs4.open(this.path, this.flags, this.mode, function(err, fd) {
        if (err) {
          self2.emit("error", err), self2.readable = !1;
          return;
        }
        self2.fd = fd, self2.emit("open", fd), self2._read();
      });
    }
    function WriteStream(path9, options) {
      if (!(this instanceof WriteStream))
        return new WriteStream(path9, options);
      Stream2.call(this), this.path = path9, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, options = options || {};
      var keys2 = Object.keys(options);
      for (var index = 0, length = keys2.length;index < length; index++) {
        var key = keys2[index];
        this[key] = options[key];
      }
      if (this.start !== void 0) {
        if (typeof this.start !== "number")
          throw TypeError("start must be a Number");
        if (this.start < 0)
          throw Error("start must be >= zero");
        this.pos = this.start;
      }
      if (this.busy = !1, this._queue = [], this.fd === null)
        this._open = fs4.open, this._queue.push([this._open, this.path, this.flags, this.mode, void 0]), this.flush();
    }
  }
});
