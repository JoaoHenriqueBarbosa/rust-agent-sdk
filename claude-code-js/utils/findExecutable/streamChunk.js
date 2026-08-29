// var: streamChunk
var streamChunk = function* (chunk, chunkSize) {
  let len = chunk.byteLength;
  if (!chunkSize || len < chunkSize) {
    yield chunk;
    return;
  }
  let pos = 0, end;
  while (pos < len)
    end = pos + chunkSize, yield chunk.slice(pos, end), pos = end;
}, readBytes = async function* (iterable, chunkSize) {
  for await (let chunk of readStream(iterable))
    yield* streamChunk(chunk, chunkSize);
}, readStream = async function* (stream4) {
  if (stream4[Symbol.asyncIterator]) {
    yield* stream4;
    return;
  }
  let reader = stream4.getReader();
  try {
    for (;; ) {
      let { done, value } = await reader.read();
      if (done)
        break;
      yield value;
    }
  } finally {
    await reader.cancel();
  }
}, trackStream = (stream4, chunkSize, onProgress, onFinish) => {
  let iterator2 = readBytes(stream4, chunkSize), bytes = 0, done, _onFinish = (e) => {
    if (!done)
      done = !0, onFinish && onFinish(e);
  };
  return new ReadableStream({
    async pull(controller) {
      try {
        let { done: done2, value } = await iterator2.next();
        if (done2) {
          _onFinish(), controller.close();
          return;
        }
        let len = value.byteLength;
        if (onProgress) {
          let loadedBytes = bytes += len;
          onProgress(loadedBytes);
        }
        controller.enqueue(new Uint8Array(value));
      } catch (err) {
        throw _onFinish(err), err;
      }
    },
    cancel(reason) {
      return _onFinish(reason), iterator2.return();
    }
  }, {
    highWaterMark: 2
  });
};
