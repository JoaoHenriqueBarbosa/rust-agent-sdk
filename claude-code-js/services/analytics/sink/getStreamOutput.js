// var: getStreamOutput
var getStreamOutput = async ({ stream, onStreamEnd, fdNumber, encoding, buffer, maxBuffer, lines, allMixed, stripFinalNewline: stripFinalNewline2, verboseInfo, streamInfo }) => {
  let logPromise = logOutputAsync({
    stream,
    onStreamEnd,
    fdNumber,
    encoding,
    allMixed,
    verboseInfo,
    streamInfo
  });
  if (!buffer) {
    await Promise.all([resumeStream(stream), logPromise]);
    return;
  }
  let stripFinalNewlineValue = getStripFinalNewline(stripFinalNewline2, fdNumber), iterable = iterateForResult({
    stream,
    onStreamEnd,
    lines,
    encoding,
    stripFinalNewline: stripFinalNewlineValue,
    allMixed
  }), [output] = await Promise.all([
    getStreamContents2({
      stream,
      iterable,
      fdNumber,
      encoding,
      maxBuffer,
      lines
    }),
    logPromise
  ]);
  return output;
}, logOutputAsync = async ({ stream, onStreamEnd, fdNumber, encoding, allMixed, verboseInfo, streamInfo: { fileDescriptors } }) => {
  if (!shouldLogOutput({
    stdioItems: fileDescriptors[fdNumber]?.stdioItems,
    encoding,
    verboseInfo,
    fdNumber
  }))
    return;
  let linesIterable = iterateForResult({
    stream,
    onStreamEnd,
    lines: !0,
    encoding,
    stripFinalNewline: !0,
    allMixed
  });
  await logLines(linesIterable, stream, fdNumber, verboseInfo);
}, resumeStream = async (stream) => {
  if (await setImmediate2(), stream.readableFlowing === null)
    stream.resume();
}, getStreamContents2 = async ({ stream, stream: { readableObjectMode }, iterable, fdNumber, encoding, maxBuffer, lines }) => {
  try {
    if (readableObjectMode || lines)
      return await getStreamAsArray(iterable, { maxBuffer });
    if (encoding === "buffer")
      return new Uint8Array(await getStreamAsArrayBuffer(iterable, { maxBuffer }));
    return await getStreamAsString(iterable, { maxBuffer });
  } catch (error41) {
    return handleBufferedData(handleMaxBuffer({
      error: error41,
      stream,
      readableObjectMode,
      lines,
      encoding,
      fdNumber
    }));
  }
}, getBufferedData = async (streamPromise) => {
  try {
    return await streamPromise;
  } catch (error41) {
    return handleBufferedData(error41);
  }
}, handleBufferedData = ({ bufferedData }) => isArrayBuffer(bufferedData) ? new Uint8Array(bufferedData) : bufferedData;
