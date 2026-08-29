// var: require_createBufferedReadableStream
var require_createBufferedReadableStream = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.createBufferedReadable = void 0;
  exports.createBufferedReadableStream = createBufferedReadableStream;
  exports.merge = merge3;
  exports.flush = flush;
  exports.sizeOf = sizeOf;
  exports.modeOf = modeOf;
  var ByteArrayCollector_1 = require_ByteArrayCollector();
  function createBufferedReadableStream(upstream, size, logger2) {
    let reader = upstream.getReader(), streamBufferingLoggedWarning = !1, bytesSeen = 0, buffers = ["", new ByteArrayCollector_1.ByteArrayCollector((size2) => new Uint8Array(size2))], mode = -1, pull = async (controller) => {
      let { value, done } = await reader.read(), chunk = value;
      if (done) {
        if (mode !== -1) {
          let remainder = flush(buffers, mode);
          if (sizeOf(remainder) > 0)
            controller.enqueue(remainder);
        }
        controller.close();
      } else {
        let chunkMode = modeOf(chunk, !1);
        if (mode !== chunkMode) {
          if (mode >= 0)
            controller.enqueue(flush(buffers, mode));
          mode = chunkMode;
        }
        if (mode === -1) {
          controller.enqueue(chunk);
          return;
        }
        let chunkSize = sizeOf(chunk);
        bytesSeen += chunkSize;
        let bufferSize = sizeOf(buffers[mode]);
        if (chunkSize >= size && bufferSize === 0)
          controller.enqueue(chunk);
        else {
          let newSize = merge3(buffers, mode, chunk);
          if (!streamBufferingLoggedWarning && bytesSeen > size * 2)
            streamBufferingLoggedWarning = !0, logger2?.warn(`@smithy/util-stream - stream chunk size ${chunkSize} is below threshold of ${size}, automatically buffering.`);
          if (newSize >= size)
            controller.enqueue(flush(buffers, mode));
          else
            await pull(controller);
        }
      }
    };
    return new ReadableStream({
      pull
    });
  }
  exports.createBufferedReadable = createBufferedReadableStream;
  function merge3(buffers, mode, chunk) {
    switch (mode) {
      case 0:
        return buffers[0] += chunk, sizeOf(buffers[0]);
      case 1:
      case 2:
        return buffers[mode].push(chunk), sizeOf(buffers[mode]);
    }
  }
  function flush(buffers, mode) {
    switch (mode) {
      case 0:
        let s = buffers[0];
        return buffers[0] = "", s;
      case 1:
      case 2:
        return buffers[mode].flush();
    }
    throw Error(`@smithy/util-stream - invalid index ${mode} given to flush()`);
  }
  function sizeOf(chunk) {
    return chunk?.byteLength ?? chunk?.length ?? 0;
  }
  function modeOf(chunk, allowBuffer = !0) {
    if (allowBuffer && typeof Buffer < "u" && chunk instanceof Buffer)
      return 2;
    if (chunk instanceof Uint8Array)
      return 1;
    if (typeof chunk === "string")
      return 0;
    return -1;
  }
});
