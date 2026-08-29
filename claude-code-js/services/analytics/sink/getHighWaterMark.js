// var: getHighWaterMark
var getHighWaterMark = (streams, objectMode) => {
  if (streams.length === 0)
    return getDefaultHighWaterMark2(objectMode);
  let highWaterMarks = streams.filter(({ readableObjectMode }) => readableObjectMode === objectMode).map(({ readableHighWaterMark }) => readableHighWaterMark);
  return Math.max(...highWaterMarks);
}, MergedStream, onMergedStreamFinished = async (passThroughStream, streams, unpipeEvent) => {
  updateMaxListeners(passThroughStream, PASSTHROUGH_LISTENERS_COUNT);
  let controller = new AbortController;
  try {
    await Promise.race([
      onMergedStreamEnd(passThroughStream, controller),
      onInputStreamsUnpipe(passThroughStream, streams, unpipeEvent, controller)
    ]);
  } finally {
    controller.abort(), updateMaxListeners(passThroughStream, -PASSTHROUGH_LISTENERS_COUNT);
  }
}, onMergedStreamEnd = async (passThroughStream, { signal }) => {
  try {
    await finished2(passThroughStream, { signal, cleanup: !0 });
  } catch (error41) {
    throw errorOrAbortStream(passThroughStream, error41), error41;
  }
}, onInputStreamsUnpipe = async (passThroughStream, streams, unpipeEvent, { signal }) => {
  for await (let [unpipedStream] of on4(passThroughStream, "unpipe", { signal }))
    if (streams.has(unpipedStream))
      unpipedStream.emit(unpipeEvent);
}, validateStream = (stream) => {
  if (typeof stream?.pipe !== "function")
    throw TypeError(`Expected a readable stream, got: \`${typeof stream}\`.`);
}, endWhenStreamsDone = async ({ passThroughStream, stream, streams, ended, aborted: aborted2, onFinished, unpipeEvent }) => {
  updateMaxListeners(passThroughStream, PASSTHROUGH_LISTENERS_PER_STREAM);
  let controller = new AbortController;
  try {
    await Promise.race([
      afterMergedStreamFinished(onFinished, stream, controller),
      onInputStreamEnd({
        passThroughStream,
        stream,
        streams,
        ended,
        aborted: aborted2,
        controller
      }),
      onInputStreamUnpipe({
        stream,
        streams,
        ended,
        aborted: aborted2,
        unpipeEvent,
        controller
      })
    ]);
  } finally {
    controller.abort(), updateMaxListeners(passThroughStream, -PASSTHROUGH_LISTENERS_PER_STREAM);
  }
  if (streams.size > 0 && streams.size === ended.size + aborted2.size)
    if (ended.size === 0 && aborted2.size > 0)
      abortStream(passThroughStream);
    else
      endStream(passThroughStream);
}, afterMergedStreamFinished = async (onFinished, stream, { signal }) => {
  try {
    if (await onFinished, !signal.aborted)
      abortStream(stream);
  } catch (error41) {
    if (!signal.aborted)
      errorOrAbortStream(stream, error41);
  }
}, onInputStreamEnd = async ({ passThroughStream, stream, streams, ended, aborted: aborted2, controller: { signal } }) => {
  try {
    if (await finished2(stream, {
      signal,
      cleanup: !0,
      readable: !0,
      writable: !1
    }), streams.has(stream))
      ended.add(stream);
  } catch (error41) {
    if (signal.aborted || !streams.has(stream))
      return;
    if (isAbortError3(error41))
      aborted2.add(stream);
    else
      errorStream(passThroughStream, error41);
  }
}, onInputStreamUnpipe = async ({ stream, streams, ended, aborted: aborted2, unpipeEvent, controller: { signal } }) => {
  if (await once7(stream, unpipeEvent, { signal }), !stream.readable)
    return once7(signal, "abort", { signal });
  streams.delete(stream), ended.delete(stream), aborted2.delete(stream);
}, endStream = (stream) => {
  if (stream.writable)
    stream.end();
}, errorOrAbortStream = (stream, error41) => {
  if (isAbortError3(error41))
    abortStream(stream);
  else
    errorStream(stream, error41);
}, isAbortError3 = (error41) => error41?.code === "ERR_STREAM_PREMATURE_CLOSE", abortStream = (stream) => {
  if (stream.readable || stream.writable)
    stream.destroy();
}, errorStream = (stream, error41) => {
  if (!stream.destroyed)
    stream.once("error", noop4), stream.destroy(error41);
}, noop4 = () => {}, updateMaxListeners = (passThroughStream, increment2) => {
  let maxListeners = passThroughStream.getMaxListeners();
  if (maxListeners !== 0 && maxListeners !== Number.POSITIVE_INFINITY)
    passThroughStream.setMaxListeners(maxListeners + increment2);
}, PASSTHROUGH_LISTENERS_COUNT = 2, PASSTHROUGH_LISTENERS_PER_STREAM = 1;
