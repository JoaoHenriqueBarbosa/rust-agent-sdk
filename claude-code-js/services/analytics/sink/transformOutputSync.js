// var: transformOutputSync
var transformOutputSync = ({ fileDescriptors, syncResult: { output }, options, isMaxBuffer, verboseInfo }) => {
  if (output === null)
    return { output: Array.from({ length: 3 }) };
  let state = {}, outputFiles = /* @__PURE__ */ new Set([]);
  return { output: output.map((result, fdNumber) => transformOutputResultSync({
    result,
    fileDescriptors,
    fdNumber,
    state,
    outputFiles,
    isMaxBuffer,
    verboseInfo
  }, options)), ...state };
}, transformOutputResultSync = ({ result, fileDescriptors, fdNumber, state, outputFiles, isMaxBuffer, verboseInfo }, { buffer, encoding, lines, stripFinalNewline: stripFinalNewline2, maxBuffer }) => {
  if (result === null)
    return;
  let truncatedResult = truncateMaxBufferSync(result, isMaxBuffer, maxBuffer), uint8ArrayResult = bufferToUint8Array(truncatedResult), { stdioItems, objectMode } = fileDescriptors[fdNumber], chunks = runOutputGeneratorsSync([uint8ArrayResult], stdioItems, encoding, state), { serializedResult, finalResult = serializedResult } = serializeChunks({
    chunks,
    objectMode,
    encoding,
    lines,
    stripFinalNewline: stripFinalNewline2,
    fdNumber
  });
  logOutputSync({
    serializedResult,
    fdNumber,
    state,
    verboseInfo,
    encoding,
    stdioItems,
    objectMode
  });
  let returnedResult = buffer[fdNumber] ? finalResult : void 0;
  try {
    if (state.error === void 0)
      writeToFiles(serializedResult, stdioItems, outputFiles);
    return returnedResult;
  } catch (error41) {
    return state.error = error41, returnedResult;
  }
}, runOutputGeneratorsSync = (chunks, stdioItems, encoding, state) => {
  try {
    return runGeneratorsSync(chunks, stdioItems, encoding, !1);
  } catch (error41) {
    return state.error = error41, chunks;
  }
}, serializeChunks = ({ chunks, objectMode, encoding, lines, stripFinalNewline: stripFinalNewline2, fdNumber }) => {
  if (objectMode)
    return { serializedResult: chunks };
  if (encoding === "buffer")
    return { serializedResult: joinToUint8Array(chunks) };
  let serializedResult = joinToString(chunks, encoding);
  if (lines[fdNumber])
    return { serializedResult, finalResult: splitLinesSync(serializedResult, !stripFinalNewline2[fdNumber], objectMode) };
  return { serializedResult };
}, logOutputSync = ({ serializedResult, fdNumber, state, verboseInfo, encoding, stdioItems, objectMode }) => {
  if (!shouldLogOutput({
    stdioItems,
    encoding,
    verboseInfo,
    fdNumber
  }))
    return;
  let linesArray = splitLinesSync(serializedResult, !1, objectMode);
  try {
    logLinesSync(linesArray, fdNumber, verboseInfo);
  } catch (error41) {
    state.error ??= error41;
  }
}, writeToFiles = (serializedResult, stdioItems, outputFiles) => {
  for (let { path: path7, append } of stdioItems.filter(({ type }) => FILE_TYPES.has(type))) {
    let pathString = typeof path7 === "string" ? path7 : path7.toString();
    if (append || outputFiles.has(pathString))
      appendFileSync2(path7, serializedResult);
    else
      outputFiles.add(pathString), writeFileSync(path7, serializedResult);
  }
};
