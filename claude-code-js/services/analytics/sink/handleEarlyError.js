// var: handleEarlyError
var handleEarlyError = ({ error: error41, command, escapedCommand, fileDescriptors, options, startTime, verboseInfo }) => {
  cleanupCustomStreams(fileDescriptors);
  let subprocess = new ChildProcess2;
  createDummyStreams(subprocess, fileDescriptors), Object.assign(subprocess, { readable, writable, duplex });
  let earlyError = makeEarlyError({
    error: error41,
    command,
    escapedCommand,
    fileDescriptors,
    options,
    startTime,
    isSync: !1
  }), promise2 = handleDummyPromise(earlyError, verboseInfo, options);
  return { subprocess, promise: promise2 };
}, createDummyStreams = (subprocess, fileDescriptors) => {
  let stdin = createDummyStream(), stdout = createDummyStream(), stderr = createDummyStream(), extraStdio = Array.from({ length: fileDescriptors.length - 3 }, createDummyStream), all = createDummyStream(), stdio = [stdin, stdout, stderr, ...extraStdio];
  Object.assign(subprocess, {
    stdin,
    stdout,
    stderr,
    all,
    stdio
  });
}, createDummyStream = () => {
  let stream = new PassThrough;
  return stream.end(), stream;
}, readable = () => new Readable({ read() {} }), writable = () => new Writable({ write() {} }), duplex = () => new Duplex({ read() {}, write() {} }), handleDummyPromise = async (error41, verboseInfo, options) => handleResult(error41, verboseInfo, options);
