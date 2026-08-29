// var: require_createBufferedReadable
var require_createBufferedReadable = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.createBufferedReadable = createBufferedReadable;
  var node_stream_1 = __require("stream"), ByteArrayCollector_1 = require_ByteArrayCollector(), createBufferedReadableStream_1 = require_createBufferedReadableStream(), stream_type_check_1 = require_stream_type_check();
  function createBufferedReadable(upstream, size, logger2) {
    if ((0, stream_type_check_1.isReadableStream)(upstream))
      return (0, createBufferedReadableStream_1.createBufferedReadableStream)(upstream, size, logger2);
    let downstream = new node_stream_1.Readable({ read() {} }), streamBufferingLoggedWarning = !1, bytesSeen = 0, buffers = [
      "",
      new ByteArrayCollector_1.ByteArrayCollector((size2) => new Uint8Array(size2)),
      new ByteArrayCollector_1.ByteArrayCollector((size2) => Buffer.from(new Uint8Array(size2)))
    ], mode = -1;
    return upstream.on("data", (chunk) => {
      let chunkMode = (0, createBufferedReadableStream_1.modeOf)(chunk, !0);
      if (mode !== chunkMode) {
        if (mode >= 0)
          downstream.push((0, createBufferedReadableStream_1.flush)(buffers, mode));
        mode = chunkMode;
      }
      if (mode === -1) {
        downstream.push(chunk);
        return;
      }
      let chunkSize = (0, createBufferedReadableStream_1.sizeOf)(chunk);
      bytesSeen += chunkSize;
      let bufferSize = (0, createBufferedReadableStream_1.sizeOf)(buffers[mode]);
      if (chunkSize >= size && bufferSize === 0)
        downstream.push(chunk);
      else {
        let newSize = (0, createBufferedReadableStream_1.merge)(buffers, mode, chunk);
        if (!streamBufferingLoggedWarning && bytesSeen > size * 2)
          streamBufferingLoggedWarning = !0, logger2?.warn(`@smithy/util-stream - stream chunk size ${chunkSize} is below threshold of ${size}, automatically buffering.`);
        if (newSize >= size)
          downstream.push((0, createBufferedReadableStream_1.flush)(buffers, mode));
      }
    }), upstream.on("end", () => {
      if (mode !== -1) {
        let remainder = (0, createBufferedReadableStream_1.flush)(buffers, mode);
        if ((0, createBufferedReadableStream_1.sizeOf)(remainder) > 0)
          downstream.push(remainder);
      }
      downstream.push(null);
    }), downstream;
  }
});
