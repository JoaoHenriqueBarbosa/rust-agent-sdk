// var: getAsyncIterable
var getAsyncIterable = (stream) => {
  if (isReadableStream(stream, { checkOpen: !1 }) && nodeImports.on !== void 0)
    return getStreamIterable(stream);
  if (typeof stream?.[Symbol.asyncIterator] === "function")
    return stream;
  if (toString2.call(stream) === "[object ReadableStream]")
    return h.call(stream);
  throw TypeError("The first argument must be a Readable, a ReadableStream, or an async iterable.");
}, toString2, getStreamIterable = async function* (stream) {
  let controller = new AbortController, state = {};
  handleStreamEnd(stream, controller, state);
  try {
    for await (let [chunk] of nodeImports.on(stream, "data", { signal: controller.signal }))
      yield chunk;
  } catch (error41) {
    if (state.error !== void 0)
      throw state.error;
    else if (!controller.signal.aborted)
      throw error41;
  } finally {
    stream.destroy();
  }
}, handleStreamEnd = async (stream, controller, state) => {
  try {
    await nodeImports.finished(stream, {
      cleanup: !0,
      readable: !0,
      writable: !1,
      error: !1
    });
  } catch (error41) {
    state.error = error41;
  } finally {
    controller.abort();
  }
}, nodeImports;
