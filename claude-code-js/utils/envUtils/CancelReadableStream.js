// function: CancelReadableStream
async function CancelReadableStream(stream) {
  if (stream === null || typeof stream !== "object")
    return;
  if (stream[Symbol.asyncIterator]) {
    await stream[Symbol.asyncIterator]().return?.();
    return;
  }
  let reader = stream.getReader(), cancelPromise = reader.cancel();
  reader.releaseLock(), await cancelPromise;
}
