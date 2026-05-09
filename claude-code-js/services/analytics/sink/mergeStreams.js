// function: mergeStreams
function mergeStreams(streams) {
  if (!Array.isArray(streams))
    throw TypeError(`Expected an array, got \`${typeof streams}\`.`);
  for (let stream of streams)
    validateStream(stream);
  let objectMode = streams.some(({ readableObjectMode }) => readableObjectMode), highWaterMark = getHighWaterMark(streams, objectMode), passThroughStream = new MergedStream({
    objectMode,
    writableHighWaterMark: highWaterMark,
    readableHighWaterMark: highWaterMark
  });
  for (let stream of streams)
    passThroughStream.add(stream);
  return passThroughStream;
}
