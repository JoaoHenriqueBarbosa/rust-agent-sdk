// var: require_combined_stream
var require_combined_stream = __commonJS((exports, module) => {
  var util = __require("util"), Stream2 = __require("stream").Stream, DelayedStream = require_delayed_stream();
  module.exports = CombinedStream;
  function CombinedStream() {
    this.writable = !1, this.readable = !0, this.dataSize = 0, this.maxDataSize = 2097152, this.pauseStreams = !0, this._released = !1, this._streams = [], this._currentStream = null, this._insideLoop = !1, this._pendingNext = !1;
  }
  util.inherits(CombinedStream, Stream2);
  CombinedStream.create = function(options) {
    var combinedStream = new this;
    options = options || {};
    for (var option in options)
      combinedStream[option] = options[option];
    return combinedStream;
  };
  CombinedStream.isStreamLike = function(stream) {
    return typeof stream !== "function" && typeof stream !== "string" && typeof stream !== "boolean" && typeof stream !== "number" && !Buffer.isBuffer(stream);
  };
  CombinedStream.prototype.append = function(stream) {
    var isStreamLike = CombinedStream.isStreamLike(stream);
    if (isStreamLike) {
      if (!(stream instanceof DelayedStream)) {
        var newStream = DelayedStream.create(stream, {
          maxDataSize: 1 / 0,
          pauseStream: this.pauseStreams
        });
        stream.on("data", this._checkDataSize.bind(this)), stream = newStream;
      }
      if (this._handleErrors(stream), this.pauseStreams)
        stream.pause();
    }
    return this._streams.push(stream), this;
  };
  CombinedStream.prototype.pipe = function(dest, options) {
    return Stream2.prototype.pipe.call(this, dest, options), this.resume(), dest;
  };
  CombinedStream.prototype._getNext = function() {
    if (this._currentStream = null, this._insideLoop) {
      this._pendingNext = !0;
      return;
    }
    this._insideLoop = !0;
    try {
      do
        this._pendingNext = !1, this._realGetNext();
      while (this._pendingNext);
    } finally {
      this._insideLoop = !1;
    }
  };
  CombinedStream.prototype._realGetNext = function() {
    var stream = this._streams.shift();
    if (typeof stream > "u") {
      this.end();
      return;
    }
    if (typeof stream !== "function") {
      this._pipeNext(stream);
      return;
    }
    var getStream = stream;
    getStream(function(stream2) {
      var isStreamLike = CombinedStream.isStreamLike(stream2);
      if (isStreamLike)
        stream2.on("data", this._checkDataSize.bind(this)), this._handleErrors(stream2);
      this._pipeNext(stream2);
    }.bind(this));
  };
  CombinedStream.prototype._pipeNext = function(stream) {
    this._currentStream = stream;
    var isStreamLike = CombinedStream.isStreamLike(stream);
    if (isStreamLike) {
      stream.on("end", this._getNext.bind(this)), stream.pipe(this, { end: !1 });
      return;
    }
    var value = stream;
    this.write(value), this._getNext();
  };
  CombinedStream.prototype._handleErrors = function(stream) {
    var self2 = this;
    stream.on("error", function(err) {
      self2._emitError(err);
    });
  };
  CombinedStream.prototype.write = function(data) {
    this.emit("data", data);
  };
  CombinedStream.prototype.pause = function() {
    if (!this.pauseStreams)
      return;
    if (this.pauseStreams && this._currentStream && typeof this._currentStream.pause == "function")
      this._currentStream.pause();
    this.emit("pause");
  };
  CombinedStream.prototype.resume = function() {
    if (!this._released)
      this._released = !0, this.writable = !0, this._getNext();
    if (this.pauseStreams && this._currentStream && typeof this._currentStream.resume == "function")
      this._currentStream.resume();
    this.emit("resume");
  };
  CombinedStream.prototype.end = function() {
    this._reset(), this.emit("end");
  };
  CombinedStream.prototype.destroy = function() {
    this._reset(), this.emit("close");
  };
  CombinedStream.prototype._reset = function() {
    this.writable = !1, this._streams = [], this._currentStream = null;
  };
  CombinedStream.prototype._checkDataSize = function() {
    if (this._updateDataSize(), this.dataSize <= this.maxDataSize)
      return;
    var message = "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.";
    this._emitError(Error(message));
  };
  CombinedStream.prototype._updateDataSize = function() {
    this.dataSize = 0;
    var self2 = this;
    if (this._streams.forEach(function(stream) {
      if (!stream.dataSize)
        return;
      self2.dataSize += stream.dataSize;
    }), this._currentStream && this._currentStream.dataSize)
      this.dataSize += this._currentStream.dataSize;
  };
  CombinedStream.prototype._emitError = function(err) {
    this._reset(), this.emit("error", err);
  };
});
