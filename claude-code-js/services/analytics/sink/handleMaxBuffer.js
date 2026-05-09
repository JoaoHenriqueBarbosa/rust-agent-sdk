// var: handleMaxBuffer
var handleMaxBuffer = ({ error: error41, stream, readableObjectMode, lines, encoding, fdNumber }) => {
  if (!(error41 instanceof MaxBufferError))
    throw error41;
  if (fdNumber === "all")
    return error41;
  let unit = getMaxBufferUnit(readableObjectMode, lines, encoding);
  throw error41.maxBufferInfo = { fdNumber, unit }, stream.destroy(), error41;
}, getMaxBufferUnit = (readableObjectMode, lines, encoding) => {
  if (readableObjectMode)
    return "objects";
  if (lines)
    return "lines";
  if (encoding === "buffer")
    return "bytes";
  return "characters";
}, checkIpcMaxBuffer = (subprocess, ipcOutput, maxBuffer) => {
  if (ipcOutput.length !== maxBuffer)
    return;
  let error41 = new MaxBufferError;
  throw error41.maxBufferInfo = { fdNumber: "ipc" }, error41;
}, getMaxBufferMessage = (error41, maxBuffer) => {
  let { streamName, threshold, unit } = getMaxBufferInfo(error41, maxBuffer);
  return `Command's ${streamName} was larger than ${threshold} ${unit}`;
}, getMaxBufferInfo = (error41, maxBuffer) => {
  if (error41?.maxBufferInfo === void 0)
    return { streamName: "output", threshold: maxBuffer[1], unit: "bytes" };
  let { maxBufferInfo: { fdNumber, unit } } = error41;
  delete error41.maxBufferInfo;
  let threshold = getFdSpecificValue(maxBuffer, fdNumber);
  if (fdNumber === "ipc")
    return { streamName: "IPC output", threshold, unit: "messages" };
  return { streamName: getStreamName(fdNumber), threshold, unit };
}, isMaxBufferSync = (resultError, output, maxBuffer) => resultError?.code === "ENOBUFS" && output !== null && output.some((result) => result !== null && result.length > getMaxBufferSync(maxBuffer)), truncateMaxBufferSync = (result, isMaxBuffer, maxBuffer) => {
  if (!isMaxBuffer)
    return result;
  let maxBufferValue = getMaxBufferSync(maxBuffer);
  return result.length > maxBufferValue ? result.slice(0, maxBufferValue) : result;
}, getMaxBufferSync = ([, stdoutMaxBuffer]) => stdoutMaxBuffer;
