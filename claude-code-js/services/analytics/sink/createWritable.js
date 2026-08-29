// var: createWritable
var createWritable = ({ subprocess, concurrentStreams }, { to } = {}) => {
  let { subprocessStdin, waitWritableFinal, waitWritableDestroy } = getSubprocessStdin(subprocess, to, concurrentStreams), writable2 = new Writable3({
    ...getWritableMethods(subprocessStdin, subprocess, waitWritableFinal),
    destroy: callbackify3(onWritableDestroy.bind(void 0, {
      subprocessStdin,
      subprocess,
      waitWritableFinal,
      waitWritableDestroy
    })),
    highWaterMark: subprocessStdin.writableHighWaterMark,
    objectMode: subprocessStdin.writableObjectMode
  });
  return onStdinFinished(subprocessStdin, writable2), writable2;
}, getSubprocessStdin = (subprocess, to, concurrentStreams) => {
  let subprocessStdin = getToStream(subprocess, to), waitWritableFinal = addConcurrentStream(concurrentStreams, subprocessStdin, "writableFinal"), waitWritableDestroy = addConcurrentStream(concurrentStreams, subprocessStdin, "writableDestroy");
  return { subprocessStdin, waitWritableFinal, waitWritableDestroy };
}, getWritableMethods = (subprocessStdin, subprocess, waitWritableFinal) => ({
  write: onWrite.bind(void 0, subprocessStdin),
  final: callbackify3(onWritableFinal.bind(void 0, subprocessStdin, subprocess, waitWritableFinal))
}), onWrite = (subprocessStdin, chunk, encoding, done) => {
  if (subprocessStdin.write(chunk, encoding))
    done();
  else
    subprocessStdin.once("drain", done);
}, onWritableFinal = async (subprocessStdin, subprocess, waitWritableFinal) => {
  if (await waitForConcurrentStreams(waitWritableFinal, subprocess)) {
    if (subprocessStdin.writable)
      subprocessStdin.end();
    await subprocess;
  }
}, onStdinFinished = async (subprocessStdin, writable2, subprocessStdout) => {
  try {
    if (await waitForSubprocessStdin(subprocessStdin), writable2.writable)
      writable2.end();
  } catch (error41) {
    await safeWaitForSubprocessStdout(subprocessStdout), destroyOtherWritable(writable2, error41);
  }
}, onWritableDestroy = async ({ subprocessStdin, subprocess, waitWritableFinal, waitWritableDestroy }, error41) => {
  if (await waitForConcurrentStreams(waitWritableFinal, subprocess), await waitForConcurrentStreams(waitWritableDestroy, subprocess))
    destroyOtherWritable(subprocessStdin, error41), await waitForSubprocess(subprocess, error41);
}, destroyOtherWritable = (stream, error41) => {
  destroyOtherStream(stream, stream.writable, error41);
};
