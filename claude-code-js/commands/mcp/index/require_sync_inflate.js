// var: require_sync_inflate
var require_sync_inflate = __commonJS((exports, module) => {
  var assert3 = __require("assert").ok, zlib4 = __require("zlib"), util12 = __require("util"), kMaxLength = __require("buffer").kMaxLength;
  function Inflate2(opts) {
    if (!(this instanceof Inflate2))
      return new Inflate2(opts);
    if (opts && opts.chunkSize < zlib4.Z_MIN_CHUNK)
      opts.chunkSize = zlib4.Z_MIN_CHUNK;
    if (zlib4.Inflate.call(this, opts), this._offset = this._offset === void 0 ? this._outOffset : this._offset, this._buffer = this._buffer || this._outBuffer, opts && opts.maxLength != null)
      this._maxLength = opts.maxLength;
  }
  function createInflate(opts) {
    return new Inflate2(opts);
  }
  function _close(engine, callback) {
    if (callback)
      process.nextTick(callback);
    if (!engine._handle)
      return;
    engine._handle.close(), engine._handle = null;
  }
  Inflate2.prototype._processChunk = function(chunk, flushFlag, asyncCb) {
    if (typeof asyncCb === "function")
      return zlib4.Inflate._processChunk.call(this, chunk, flushFlag, asyncCb);
    let self2 = this, availInBefore = chunk && chunk.length, availOutBefore = this._chunkSize - this._offset, leftToInflate = this._maxLength, inOff = 0, buffers = [], nread = 0, error44;
    this.on("error", function(err2) {
      error44 = err2;
    });
    function handleChunk(availInAfter, availOutAfter) {
      if (self2._hadError)
        return;
      let have = availOutBefore - availOutAfter;
      if (assert3(have >= 0, "have should not go down"), have > 0) {
        let out = self2._buffer.slice(self2._offset, self2._offset + have);
        if (self2._offset += have, out.length > leftToInflate)
          out = out.slice(0, leftToInflate);
        if (buffers.push(out), nread += out.length, leftToInflate -= out.length, leftToInflate === 0)
          return !1;
      }
      if (availOutAfter === 0 || self2._offset >= self2._chunkSize)
        availOutBefore = self2._chunkSize, self2._offset = 0, self2._buffer = Buffer.allocUnsafe(self2._chunkSize);
      if (availOutAfter === 0)
        return inOff += availInBefore - availInAfter, availInBefore = availInAfter, !0;
      return !1;
    }
    assert3(this._handle, "zlib binding closed");
    let res;
    do
      res = this._handle.writeSync(flushFlag, chunk, inOff, availInBefore, this._buffer, this._offset, availOutBefore), res = res || this._writeState;
    while (!this._hadError && handleChunk(res[0], res[1]));
    if (this._hadError)
      throw error44;
    if (nread >= kMaxLength)
      throw _close(this), RangeError("Cannot create final Buffer. It would be larger than 0x" + kMaxLength.toString(16) + " bytes");
    let buf = Buffer.concat(buffers, nread);
    return _close(this), buf;
  };
  util12.inherits(Inflate2, zlib4.Inflate);
  function zlibBufferSync(engine, buffer) {
    if (typeof buffer === "string")
      buffer = Buffer.from(buffer);
    if (!(buffer instanceof Buffer))
      throw TypeError("Not a string or buffer");
    let flushFlag = engine._finishFlushFlag;
    if (flushFlag == null)
      flushFlag = zlib4.Z_FINISH;
    return engine._processChunk(buffer, flushFlag);
  }
  function inflateSync2(buffer, opts) {
    return zlibBufferSync(new Inflate2(opts), buffer);
  }
  module.exports = exports = inflateSync2;
  exports.Inflate = Inflate2;
  exports.createInflate = createInflate;
  exports.inflateSync = inflateSync2;
});
