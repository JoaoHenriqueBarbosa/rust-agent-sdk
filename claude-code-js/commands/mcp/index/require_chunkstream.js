// var: require_chunkstream
var require_chunkstream = __commonJS((exports, module) => {
  var util12 = __require("util"), Stream5 = __require("stream"), ChunkStream = module.exports = function() {
    Stream5.call(this), this._buffers = [], this._buffered = 0, this._reads = [], this._paused = !1, this._encoding = "utf8", this.writable = !0;
  };
  util12.inherits(ChunkStream, Stream5);
  ChunkStream.prototype.read = function(length, callback) {
    this._reads.push({
      length: Math.abs(length),
      allowLess: length < 0,
      func: callback
    }), process.nextTick(function() {
      if (this._process(), this._paused && this._reads && this._reads.length > 0)
        this._paused = !1, this.emit("drain");
    }.bind(this));
  };
  ChunkStream.prototype.write = function(data, encoding) {
    if (!this.writable)
      return this.emit("error", Error("Stream not writable")), !1;
    let dataBuffer;
    if (Buffer.isBuffer(data))
      dataBuffer = data;
    else
      dataBuffer = Buffer.from(data, encoding || this._encoding);
    if (this._buffers.push(dataBuffer), this._buffered += dataBuffer.length, this._process(), this._reads && this._reads.length === 0)
      this._paused = !0;
    return this.writable && !this._paused;
  };
  ChunkStream.prototype.end = function(data, encoding) {
    if (data)
      this.write(data, encoding);
    if (this.writable = !1, !this._buffers)
      return;
    if (this._buffers.length === 0)
      this._end();
    else
      this._buffers.push(null), this._process();
  };
  ChunkStream.prototype.destroySoon = ChunkStream.prototype.end;
  ChunkStream.prototype._end = function() {
    if (this._reads.length > 0)
      this.emit("error", Error("Unexpected end of input"));
    this.destroy();
  };
  ChunkStream.prototype.destroy = function() {
    if (!this._buffers)
      return;
    this.writable = !1, this._reads = null, this._buffers = null, this.emit("close");
  };
  ChunkStream.prototype._processReadAllowingLess = function(read) {
    this._reads.shift();
    let smallerBuf = this._buffers[0];
    if (smallerBuf.length > read.length)
      this._buffered -= read.length, this._buffers[0] = smallerBuf.slice(read.length), read.func.call(this, smallerBuf.slice(0, read.length));
    else
      this._buffered -= smallerBuf.length, this._buffers.shift(), read.func.call(this, smallerBuf);
  };
  ChunkStream.prototype._processRead = function(read) {
    this._reads.shift();
    let pos = 0, count4 = 0, data = Buffer.alloc(read.length);
    while (pos < read.length) {
      let buf = this._buffers[count4++], len = Math.min(buf.length, read.length - pos);
      if (buf.copy(data, pos, 0, len), pos += len, len !== buf.length)
        this._buffers[--count4] = buf.slice(len);
    }
    if (count4 > 0)
      this._buffers.splice(0, count4);
    this._buffered -= read.length, read.func.call(this, data);
  };
  ChunkStream.prototype._process = function() {
    try {
      while (this._buffered > 0 && this._reads && this._reads.length > 0) {
        let read = this._reads[0];
        if (read.allowLess)
          this._processReadAllowingLess(read);
        else if (this._buffered >= read.length)
          this._processRead(read);
        else
          break;
      }
      if (this._buffers && !this.writable)
        this._end();
    } catch (ex) {
      this.emit("error", ex);
    }
  };
});
