// var: require_headStream
var require_headStream = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.headStream = void 0;
  var stream_1 = __require("stream"), headStream_browser_1 = require_headStream_browser(), stream_type_check_1 = require_stream_type_check(), headStream = (stream5, bytes) => {
    if ((0, stream_type_check_1.isReadableStream)(stream5))
      return (0, headStream_browser_1.headStream)(stream5, bytes);
    return new Promise((resolve8, reject) => {
      let collector = new Collector;
      collector.limit = bytes, stream5.pipe(collector), stream5.on("error", (err) => {
        collector.end(), reject(err);
      }), collector.on("error", reject), collector.on("finish", function() {
        let bytes2 = new Uint8Array(Buffer.concat(this.buffers));
        resolve8(bytes2);
      });
    });
  };
  exports.headStream = headStream;

  class Collector extends stream_1.Writable {
    buffers = [];
    limit = 1 / 0;
    bytesBuffered = 0;
    _write(chunk, encoding, callback) {
      if (this.buffers.push(chunk), this.bytesBuffered += chunk.byteLength ?? 0, this.bytesBuffered >= this.limit) {
        let excess = this.bytesBuffered - this.limit, tailBuffer = this.buffers[this.buffers.length - 1];
        this.buffers[this.buffers.length - 1] = tailBuffer.subarray(0, tailBuffer.byteLength - excess), this.emit("finish");
      }
      callback();
    }
  }
});
