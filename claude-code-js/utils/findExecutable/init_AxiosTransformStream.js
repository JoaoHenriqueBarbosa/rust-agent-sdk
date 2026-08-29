// var: init_AxiosTransformStream
var init_AxiosTransformStream = __esm(() => {
  init_utils();
  kInternals = Symbol("internals");
  AxiosTransformStream = class AxiosTransformStream extends stream.Transform {
    constructor(options) {
      options = utils_default.toFlatObject(options, {
        maxRate: 0,
        chunkSize: 65536,
        minChunkSize: 100,
        timeWindow: 500,
        ticksRate: 2,
        samplesCount: 15
      }, null, (prop, source) => {
        return !utils_default.isUndefined(source[prop]);
      });
      super({
        readableHighWaterMark: options.chunkSize
      });
      let internals = this[kInternals] = {
        timeWindow: options.timeWindow,
        chunkSize: options.chunkSize,
        maxRate: options.maxRate,
        minChunkSize: options.minChunkSize,
        bytesSeen: 0,
        isCaptured: !1,
        notifiedBytesLoaded: 0,
        ts: Date.now(),
        bytes: 0,
        onReadCallback: null
      };
      this.on("newListener", (event) => {
        if (event === "progress") {
          if (!internals.isCaptured)
            internals.isCaptured = !0;
        }
      });
    }
    _read(size) {
      let internals = this[kInternals];
      if (internals.onReadCallback)
        internals.onReadCallback();
      return super._read(size);
    }
    _transform(chunk, encoding, callback) {
      let internals = this[kInternals], maxRate = internals.maxRate, readableHighWaterMark = this.readableHighWaterMark, timeWindow = internals.timeWindow, divider = 1000 / timeWindow, bytesThreshold = maxRate / divider, minChunkSize = internals.minChunkSize !== !1 ? Math.max(internals.minChunkSize, bytesThreshold * 0.01) : 0, pushChunk = (_chunk, _callback) => {
        let bytes = Buffer.byteLength(_chunk);
        if (internals.bytesSeen += bytes, internals.bytes += bytes, internals.isCaptured && this.emit("progress", internals.bytesSeen), this.push(_chunk))
          process.nextTick(_callback);
        else
          internals.onReadCallback = () => {
            internals.onReadCallback = null, process.nextTick(_callback);
          };
      }, transformChunk2 = (_chunk, _callback) => {
        let chunkSize = Buffer.byteLength(_chunk), chunkRemainder = null, maxChunkSize = readableHighWaterMark, bytesLeft, passed = 0;
        if (maxRate) {
          let now = Date.now();
          if (!internals.ts || (passed = now - internals.ts) >= timeWindow)
            internals.ts = now, bytesLeft = bytesThreshold - internals.bytes, internals.bytes = bytesLeft < 0 ? -bytesLeft : 0, passed = 0;
          bytesLeft = bytesThreshold - internals.bytes;
        }
        if (maxRate) {
          if (bytesLeft <= 0)
            return setTimeout(() => {
              _callback(null, _chunk);
            }, timeWindow - passed);
          if (bytesLeft < maxChunkSize)
            maxChunkSize = bytesLeft;
        }
        if (maxChunkSize && chunkSize > maxChunkSize && chunkSize - maxChunkSize > minChunkSize)
          chunkRemainder = _chunk.subarray(maxChunkSize), _chunk = _chunk.subarray(0, maxChunkSize);
        pushChunk(_chunk, chunkRemainder ? () => {
          process.nextTick(_callback, null, chunkRemainder);
        } : _callback);
      };
      transformChunk2(chunk, function transformNextChunk(err, _chunk) {
        if (err)
          return callback(err);
        if (_chunk)
          transformChunk2(_chunk, transformNextChunk);
        else
          callback(null);
      });
    }
  };
  AxiosTransformStream_default = AxiosTransformStream;
});
