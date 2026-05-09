// function: ReadableStreamToAsyncIterable
function ReadableStreamToAsyncIterable(stream) {
  if (stream[Symbol.asyncIterator])
    return stream;
  let reader = stream.getReader();
  return {
    async next() {
      try {
        let result = await reader.read();
        if (result?.done)
          reader.releaseLock();
        return result;
      } catch (e) {
        throw reader.releaseLock(), e;
      }
    },
    async return() {
      let cancelPromise = reader.cancel();
      return reader.releaseLock(), await cancelPromise, { done: !0, value: void 0 };
    },
    [Symbol.asyncIterator]() {
      return this;
    }
  };
}
