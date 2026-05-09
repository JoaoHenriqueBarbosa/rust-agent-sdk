// var: makeAllStream
var makeAllStream = ({ stdout, stderr }, { all }) => all && (stdout || stderr) ? mergeStreams([stdout, stderr].filter(Boolean)) : void 0, waitForAllStream = ({ subprocess, encoding, buffer, maxBuffer, lines, stripFinalNewline: stripFinalNewline2, verboseInfo, streamInfo }) => waitForSubprocessStream({
  ...getAllStream(subprocess, buffer),
  fdNumber: "all",
  encoding,
  maxBuffer: maxBuffer[1] + maxBuffer[2],
  lines: lines[1] || lines[2],
  allMixed: getAllMixed(subprocess),
  stripFinalNewline: stripFinalNewline2,
  verboseInfo,
  streamInfo
}), getAllStream = ({ stdout, stderr, all }, [, bufferStdout, bufferStderr]) => {
  let buffer = bufferStdout || bufferStderr;
  if (!buffer)
    return { stream: all, buffer };
  if (!bufferStdout)
    return { stream: stderr, buffer };
  if (!bufferStderr)
    return { stream: stdout, buffer };
  return { stream: all, buffer };
}, getAllMixed = ({ all, stdout, stderr }) => all && stdout && stderr && stdout.readableObjectMode !== stderr.readableObjectMode;
