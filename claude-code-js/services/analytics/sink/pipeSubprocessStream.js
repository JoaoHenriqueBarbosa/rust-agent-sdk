// var: pipeSubprocessStream
var pipeSubprocessStream = (sourceStream, destinationStream, maxListenersController) => {
  let mergedStream = MERGED_STREAMS.has(destinationStream) ? pipeMoreSubprocessStream(sourceStream, destinationStream) : pipeFirstSubprocessStream(sourceStream, destinationStream);
  return incrementMaxListeners(sourceStream, SOURCE_LISTENERS_PER_PIPE, maxListenersController.signal), incrementMaxListeners(destinationStream, DESTINATION_LISTENERS_PER_PIPE, maxListenersController.signal), cleanupMergedStreamsMap(destinationStream), mergedStream;
}, pipeFirstSubprocessStream = (sourceStream, destinationStream) => {
  let mergedStream = mergeStreams([sourceStream]);
  return pipeStreams(mergedStream, destinationStream), MERGED_STREAMS.set(destinationStream, mergedStream), mergedStream;
}, pipeMoreSubprocessStream = (sourceStream, destinationStream) => {
  let mergedStream = MERGED_STREAMS.get(destinationStream);
  return mergedStream.add(sourceStream), mergedStream;
}, cleanupMergedStreamsMap = async (destinationStream) => {
  try {
    await finished4(destinationStream, { cleanup: !0, readable: !1, writable: !0 });
  } catch {}
  MERGED_STREAMS.delete(destinationStream);
}, MERGED_STREAMS, SOURCE_LISTENERS_PER_PIPE = 2, DESTINATION_LISTENERS_PER_PIPE = 1;
