// var: createReadable
var createReadable = ({ subprocess, concurrentStreams, encoding }, { from, binary: binaryOption = !0, preserveNewlines = !0 } = {}) => {
  let binary = binaryOption || BINARY_ENCODINGS.has(encoding), { subprocessStdout, waitReadableDestroy } = getSubprocessStdout(subprocess, from, concurrentStreams), { readableEncoding, readableObjectMode, readableHighWaterMark } = getReadableOptions(subprocessStdout, binary), { read, onStdoutDataDone } = getReadableMethods({
    subprocessStdout,
    subprocess,
    binary,
    encoding,
    preserveNewlines
  }), readable2 = new Readable3({
    read,
    destroy: callbackify2(onReadableDestroy.bind(void 0, { subprocessStdout, subprocess, waitReadableDestroy })),
    highWaterMark: readableHighWaterMark,
    objectMode: readableObjectMode,
    encoding: readableEncoding
  });
  return onStdoutFinished({
    subprocessStdout,
    onStdoutDataDone,
    readable: readable2,
    subprocess
  }), readable2;
}, getSubprocessStdout = (subprocess, from, concurrentStreams) => {
  let subprocessStdout = getFromStream(subprocess, from), waitReadableDestroy = addConcurrentStream(concurrentStreams, subprocessStdout, "readableDestroy");
  return { subprocessStdout, waitReadableDestroy };
}, getReadableOptions = ({ readableEncoding, readableObjectMode, readableHighWaterMark }, binary) => binary ? { readableEncoding, readableObjectMode, readableHighWaterMark } : { readableEncoding, readableObjectMode: !0, readableHighWaterMark: DEFAULT_OBJECT_HIGH_WATER_MARK }, getReadableMethods = ({ subprocessStdout, subprocess, binary, encoding, preserveNewlines }) => {
  let onStdoutDataDone = createDeferred(), onStdoutData = iterateOnSubprocessStream({
    subprocessStdout,
    subprocess,
    binary,
    shouldEncode: !binary,
    encoding,
    preserveNewlines
  });
  return {
    read() {
      onRead(this, onStdoutData, onStdoutDataDone);
    },
    onStdoutDataDone
  };
}, onRead = async (readable2, onStdoutData, onStdoutDataDone) => {
  try {
    let { value, done } = await onStdoutData.next();
    if (done)
      onStdoutDataDone.resolve();
    else
      readable2.push(value);
  } catch {}
}, onStdoutFinished = async ({ subprocessStdout, onStdoutDataDone, readable: readable2, subprocess, subprocessStdin }) => {
  try {
    if (await waitForSubprocessStdout(subprocessStdout), await subprocess, await safeWaitForSubprocessStdin(subprocessStdin), await onStdoutDataDone, readable2.readable)
      readable2.push(null);
  } catch (error41) {
    await safeWaitForSubprocessStdin(subprocessStdin), destroyOtherReadable(readable2, error41);
  }
}, onReadableDestroy = async ({ subprocessStdout, subprocess, waitReadableDestroy }, error41) => {
  if (await waitForConcurrentStreams(waitReadableDestroy, subprocess))
    destroyOtherReadable(subprocessStdout, error41), await waitForSubprocess(subprocess, error41);
}, destroyOtherReadable = (stream, error41) => {
  destroyOtherStream(stream, stream.readable, error41);
};
