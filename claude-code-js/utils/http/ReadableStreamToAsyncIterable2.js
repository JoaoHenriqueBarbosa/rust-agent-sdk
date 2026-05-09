// function: ReadableStreamToAsyncIterable2
function ReadableStreamToAsyncIterable2(stream10) {
  if (stream10[Symbol.asyncIterator])
    return stream10;
  let reader = stream10.getReader();
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
