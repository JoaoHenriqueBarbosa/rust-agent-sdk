// function: ensureNodeStream
function ensureNodeStream(stream10) {
  if (stream10 instanceof ReadableStream)
    return makeAsyncIterable(stream10), Readable8.fromWeb(stream10);
  else
    return stream10;
}
