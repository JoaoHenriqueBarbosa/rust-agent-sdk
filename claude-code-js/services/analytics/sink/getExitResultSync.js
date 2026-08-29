// var: getExitResultSync
var getExitResultSync = ({ error: error41, status: exitCode, signal, output }, { maxBuffer }) => {
  let resultError = getResultError(error41, exitCode, signal), timedOut = resultError?.code === "ETIMEDOUT", isMaxBuffer = isMaxBufferSync(resultError, output, maxBuffer);
  return {
    resultError,
    exitCode,
    signal,
    timedOut,
    isMaxBuffer
  };
}, getResultError = (error41, exitCode, signal) => {
  if (error41 !== void 0)
    return error41;
  return isFailedExit(exitCode, signal) ? new DiscardedError : void 0;
};
