// var: execaCoreSync
var execaCoreSync = (rawFile, rawArguments, rawOptions) => {
  let { file: file2, commandArguments, command, escapedCommand, startTime, verboseInfo, options, fileDescriptors } = handleSyncArguments(rawFile, rawArguments, rawOptions), result = spawnSubprocessSync({
    file: file2,
    commandArguments,
    options,
    command,
    escapedCommand,
    verboseInfo,
    fileDescriptors,
    startTime
  });
  return handleResult(result, verboseInfo, options);
}, handleSyncArguments = (rawFile, rawArguments, rawOptions) => {
  let { command, escapedCommand, startTime, verboseInfo } = handleCommand(rawFile, rawArguments, rawOptions), syncOptions = normalizeSyncOptions(rawOptions), { file: file2, commandArguments, options } = normalizeOptions(rawFile, rawArguments, syncOptions);
  validateSyncOptions(options);
  let fileDescriptors = handleStdioSync(options, verboseInfo);
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
}, normalizeSyncOptions = (options) => options.node && !options.ipc ? { ...options, ipc: !1 } : options, validateSyncOptions = ({ ipc, ipcInput, detached, cancelSignal }) => {
  if (ipcInput)
    throwInvalidSyncOption("ipcInput");
  if (ipc)
    throwInvalidSyncOption("ipc: true");
  if (detached)
    throwInvalidSyncOption("detached: true");
  if (cancelSignal)
    throwInvalidSyncOption("cancelSignal");
}, throwInvalidSyncOption = (value) => {
  throw TypeError(`The "${value}" option cannot be used with synchronous methods.`);
}, spawnSubprocessSync = ({ file: file2, commandArguments, options, command, escapedCommand, verboseInfo, fileDescriptors, startTime }) => {
  let syncResult = runSubprocessSync({
    file: file2,
    commandArguments,
    options,
    command,
    escapedCommand,
    fileDescriptors,
    startTime
  });
  if (syncResult.failed)
    return syncResult;
  let { resultError, exitCode, signal, timedOut, isMaxBuffer } = getExitResultSync(syncResult, options), { output, error: error41 = resultError } = transformOutputSync({
    fileDescriptors,
    syncResult,
    options,
    isMaxBuffer,
    verboseInfo
  }), stdio = output.map((stdioOutput, fdNumber) => stripNewline(stdioOutput, options, fdNumber)), all = stripNewline(getAllSync(output, options), options, "all");
  return getSyncResult({
    error: error41,
    exitCode,
    signal,
    timedOut,
    isMaxBuffer,
    stdio,
    all,
    options,
    command,
    escapedCommand,
    startTime
  });
}, runSubprocessSync = ({ file: file2, commandArguments, options, command, escapedCommand, fileDescriptors, startTime }) => {
  try {
    addInputOptionsSync(fileDescriptors, options);
    let normalizedOptions = normalizeSpawnSyncOptions(options);
    return spawnSync(...concatenateShell(file2, commandArguments, normalizedOptions));
  } catch (error41) {
    return makeEarlyError({
      error: error41,
      command,
      escapedCommand,
      fileDescriptors,
      options,
      startTime,
      isSync: !0
    });
  }
}, normalizeSpawnSyncOptions = ({ encoding, maxBuffer, ...options }) => ({ ...options, encoding: "buffer", maxBuffer: getMaxBufferSync(maxBuffer) }), getSyncResult = ({ error: error41, exitCode, signal, timedOut, isMaxBuffer, stdio, all, options, command, escapedCommand, startTime }) => error41 === void 0 ? makeSuccessResult({
  command,
  escapedCommand,
  stdio,
  all,
  ipcOutput: [],
  options,
  startTime
}) : makeError({
  error: error41,
  command,
  escapedCommand,
  timedOut,
  isCanceled: !1,
  isGracefullyCanceled: !1,
  isMaxBuffer,
  isForcefullyTerminated: !1,
  exitCode,
  signal,
  stdio,
  all,
  ipcOutput: [],
  options,
  startTime,
  isSync: !0
});
