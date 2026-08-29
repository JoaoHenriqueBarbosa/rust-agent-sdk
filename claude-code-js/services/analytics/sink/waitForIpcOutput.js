// var: waitForIpcOutput
var waitForIpcOutput = async ({
  subprocess,
  buffer: bufferArray,
  maxBuffer: maxBufferArray,
  ipc,
  ipcOutput,
  verboseInfo
}) => {
  if (!ipc)
    return ipcOutput;
  let isVerbose2 = shouldLogIpc(verboseInfo), buffer = getFdSpecificValue(bufferArray, "ipc"), maxBuffer = getFdSpecificValue(maxBufferArray, "ipc");
  for await (let message of loopOnMessages({
    anyProcess: subprocess,
    channel: subprocess.channel,
    isSubprocess: !1,
    ipc,
    shouldAwait: !1,
    reference: !0
  })) {
    if (buffer)
      checkIpcMaxBuffer(subprocess, ipcOutput, maxBuffer), ipcOutput.push(message);
    if (isVerbose2)
      logIpcOutput(message, verboseInfo);
  }
  return ipcOutput;
}, getBufferedIpcOutput = async (ipcOutputPromise, ipcOutput) => {
  return await Promise.allSettled([ipcOutputPromise]), ipcOutput;
};
