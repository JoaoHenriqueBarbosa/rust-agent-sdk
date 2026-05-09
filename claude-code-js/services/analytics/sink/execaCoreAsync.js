// var: execaCoreAsync
var execaCoreAsync = (rawFile, rawArguments, rawOptions, createNested) => {
  let { file: file2, commandArguments, command, escapedCommand, startTime, verboseInfo, options, fileDescriptors } = handleAsyncArguments(rawFile, rawArguments, rawOptions), { subprocess, promise: promise2 } = spawnSubprocessAsync({
    file: file2,
    commandArguments,
    options,
    startTime,
    verboseInfo,
    command,
    escapedCommand,
    fileDescriptors
  });
  return subprocess.pipe = pipeToSubprocess.bind(void 0, {
    source: subprocess,
    sourcePromise: promise2,
    boundOptions: {},
    createNested
  }), mergePromise(subprocess, promise2), SUBPROCESS_OPTIONS.set(subprocess, { options, fileDescriptors }), subprocess;
}, handleAsyncArguments = (rawFile, rawArguments, rawOptions) => {
  let { command, escapedCommand, startTime, verboseInfo } = handleCommand(rawFile, rawArguments, rawOptions), { file: file2, commandArguments, options: normalizedOptions } = normalizeOptions(rawFile, rawArguments, rawOptions), options = handleAsyncOptions(normalizedOptions), fileDescriptors = handleStdioAsync(options, verboseInfo);
  return {
    file: file2,
    commandArguments,
    command,
    escapedCommand,
    startTime,
    verboseInfo,
    options,
    fileDescriptors
  };
}, handleAsyncOptions = ({ timeout, signal, ...options }) => {
  if (signal !== void 0)
    throw TypeError('The "signal" option has been renamed to "cancelSignal" instead.');
  return { ...options, timeoutDuration: timeout };
}, spawnSubprocessAsync = ({ file: file2, commandArguments, options, startTime, verboseInfo, command, escapedCommand, fileDescriptors }) => {
  let subprocess;
  try {
    subprocess = spawn(...concatenateShell(file2, commandArguments, options));
  } catch (error41) {
    return handleEarlyError({
      error: error41,
      command,
      escapedCommand,
      fileDescriptors,
      options,
      startTime,
      verboseInfo
    });
  }
  let controller = new AbortController;
  setMaxListeners(Number.POSITIVE_INFINITY, controller.signal);
  let originalStreams = [...subprocess.stdio];
  pipeOutputAsync(subprocess, fileDescriptors, controller), cleanupOnExit(subprocess, options, controller);
  let context = {}, onInternalError = createDeferred();
  subprocess.kill = subprocessKill.bind(void 0, {
    kill: subprocess.kill.bind(subprocess),
    options,
    onInternalError,
    context,
    controller
  }), subprocess.all = makeAllStream(subprocess, options), addConvertedStreams(subprocess, options), addIpcMethods(subprocess, options);
  let promise2 = handlePromise({
    subprocess,
    options,
    startTime,
    verboseInfo,
    fileDescriptors,
    originalStreams,
    command,
    escapedCommand,
    context,
    onInternalError,
    controller
  });
  return { subprocess, promise: promise2 };
}, handlePromise = async ({ subprocess, options, startTime, verboseInfo, fileDescriptors, originalStreams, command, escapedCommand, context, onInternalError, controller }) => {
  let [
    errorInfo,
    [exitCode, signal],
    stdioResults,
    allResult,
    ipcOutput
  ] = await waitForSubprocessResult({
    subprocess,
    options,
    context,
    verboseInfo,
    fileDescriptors,
    originalStreams,
    onInternalError,
    controller
  });
  controller.abort(), onInternalError.resolve();
  let stdio = stdioResults.map((stdioResult, fdNumber) => stripNewline(stdioResult, options, fdNumber)), all = stripNewline(allResult, options, "all"), result = getAsyncResult({
    errorInfo,
    exitCode,
    signal,
    stdio,
    all,
    ipcOutput,
    context,
    options,
    command,
    escapedCommand,
    startTime
  });
  return handleResult(result, verboseInfo, options);
}, getAsyncResult = ({ errorInfo, exitCode, signal, stdio, all, ipcOutput, context, options, command, escapedCommand, startTime }) => ("error" in errorInfo) ? makeError({
  error: errorInfo.error,
  command,
  escapedCommand,
  timedOut: context.terminationReason === "timeout",
  isCanceled: context.terminationReason === "cancel" || context.terminationReason === "gracefulCancel",
  isGracefullyCanceled: context.terminationReason === "gracefulCancel",
  isMaxBuffer: errorInfo.error instanceof MaxBufferError,
  isForcefullyTerminated: context.isForcefullyTerminated,
  exitCode,
  signal,
  stdio,
  all,
  ipcOutput,
  options,
  startTime,
  isSync: !1
}) : makeSuccessResult({
  command,
  escapedCommand,
  stdio,
  all,
  ipcOutput,
  options,
  startTime
});
