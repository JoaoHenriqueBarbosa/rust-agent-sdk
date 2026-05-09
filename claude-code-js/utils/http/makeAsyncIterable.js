// function: makeAsyncIterable
function makeAsyncIterable(webStream) {
  if (!webStream[Symbol.asyncIterator])
    webStream[Symbol.asyncIterator] = streamAsyncIterator.bind(webStream);
  if (!webStream.values)
    webStream.values = streamAsyncIterator.bind(webStream);
}
