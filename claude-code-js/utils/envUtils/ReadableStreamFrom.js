// function: ReadableStreamFrom
function ReadableStreamFrom(iterable) {
  let iter = Symbol.asyncIterator in iterable ? iterable[Symbol.asyncIterator]() : iterable[Symbol.iterator]();
  return makeReadableStream({
    start() {},
    async pull(controller) {
      let { done, value } = await iter.next();
      if (done)
        controller.close();
      else
        controller.enqueue(value);
    },
    async cancel() {
      await iter.return?.();
    }
  });
}
