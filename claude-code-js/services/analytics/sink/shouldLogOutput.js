// var: shouldLogOutput
var shouldLogOutput = ({ stdioItems, encoding, verboseInfo, fdNumber }) => fdNumber !== "all" && isFullVerbose(verboseInfo, fdNumber) && !BINARY_ENCODINGS.has(encoding) && fdUsesVerbose(fdNumber) && (stdioItems.some(({ type, value }) => type === "native" && PIPED_STDIO_VALUES.has(value)) || stdioItems.every(({ type }) => TRANSFORM_TYPES.has(type))), fdUsesVerbose = (fdNumber) => fdNumber === 1 || fdNumber === 2, PIPED_STDIO_VALUES, logLines = async (linesIterable, stream, fdNumber, verboseInfo) => {
  for await (let line of linesIterable)
    if (!isPipingStream(stream))
      logLine(line, fdNumber, verboseInfo);
}, logLinesSync = (linesArray, fdNumber, verboseInfo) => {
  for (let line of linesArray)
    logLine(line, fdNumber, verboseInfo);
}, isPipingStream = (stream) => stream._readableState.pipes.length > 0, logLine = (line, fdNumber, verboseInfo) => {
  let verboseMessage = serializeVerboseMessage(line);
  verboseLog({
    type: "output",
    verboseMessage,
    fdNumber,
    verboseInfo
  });
};
