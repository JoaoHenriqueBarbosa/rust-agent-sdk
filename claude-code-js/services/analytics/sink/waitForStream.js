// var: waitForStream
var waitForStream = async (stream, fdNumber, streamInfo, { isSameDirection, stopOnExit = !1 } = {}) => {
  let state = handleStdinDestroy(stream, streamInfo), abortController = new AbortController;
  try {
    await Promise.race([
      ...stopOnExit ? [streamInfo.exitPromise] : [],
      finished5(stream, { cleanup: !0, signal: abortController.signal })
    ]);
  } catch (error41) {
    if (!state.stdinCleanedUp)
      handleStreamError(error41, fdNumber, streamInfo, isSameDirection);
  } finally {
    abortController.abort();
  }
}, handleStdinDestroy = (stream, { originalStreams: [originalStdin], subprocess }) => {
  let state = { stdinCleanedUp: !1 };
  if (stream === originalStdin)
    spyOnStdinDestroy(stream, subprocess, state);
  return state;
}, spyOnStdinDestroy = (subprocessStdin, subprocess, state) => {
  let { _destroy } = subprocessStdin;
  subprocessStdin._destroy = (...destroyArguments) => {
    setStdinCleanedUp(subprocess, state), _destroy.call(subprocessStdin, ...destroyArguments);
  };
}, setStdinCleanedUp = ({ exitCode, signalCode }, state) => {
  if (exitCode !== null || signalCode !== null)
    state.stdinCleanedUp = !0;
}, handleStreamError = (error41, fdNumber, streamInfo, isSameDirection) => {
  if (!shouldIgnoreStreamError(error41, fdNumber, streamInfo, isSameDirection))
    throw error41;
}, shouldIgnoreStreamError = (error41, fdNumber, streamInfo, isSameDirection = !0) => {
  if (streamInfo.propagating)
    return isStreamEpipe(error41) || isStreamAbort(error41);
  return streamInfo.propagating = !0, isInputFileDescriptor(streamInfo, fdNumber) === isSameDirection ? isStreamEpipe(error41) : isStreamAbort(error41);
}, isInputFileDescriptor = ({ fileDescriptors }, fdNumber) => fdNumber !== "all" && fileDescriptors[fdNumber].direction === "input", isStreamAbort = (error41) => error41?.code === "ERR_STREAM_PREMATURE_CLOSE", isStreamEpipe = (error41) => error41?.code === "EPIPE";
