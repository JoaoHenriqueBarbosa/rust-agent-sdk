// var: getSplitLinesGenerator
var getSplitLinesGenerator = (binary, preserveNewlines, skipped, state) => binary || skipped ? void 0 : initializeSplitLines(preserveNewlines, state), splitLinesSync = (chunk, preserveNewlines, objectMode) => objectMode ? chunk.flatMap((item) => splitLinesItemSync(item, preserveNewlines)) : splitLinesItemSync(chunk, preserveNewlines), splitLinesItemSync = (chunk, preserveNewlines) => {
  let { transform: transform2, final } = initializeSplitLines(preserveNewlines, {});
  return [...transform2(chunk), ...final()];
}, initializeSplitLines = (preserveNewlines, state) => {
  return state.previousChunks = "", {
    transform: splitGenerator.bind(void 0, state, preserveNewlines),
    final: linesFinal.bind(void 0, state)
  };
}, splitGenerator = function* (state, preserveNewlines, chunk) {
  if (typeof chunk !== "string") {
    yield chunk;
    return;
  }
  let { previousChunks } = state, start = -1;
  for (let end = 0;end < chunk.length; end += 1)
    if (chunk[end] === `
`) {
      let newlineLength = getNewlineLength(chunk, end, preserveNewlines, state), line = chunk.slice(start + 1, end + 1 - newlineLength);
      if (previousChunks.length > 0)
        line = concatString(previousChunks, line), previousChunks = "";
      yield line, start = end;
    }
  if (start !== chunk.length - 1)
    previousChunks = concatString(previousChunks, chunk.slice(start + 1));
  state.previousChunks = previousChunks;
}, getNewlineLength = (chunk, end, preserveNewlines, state) => {
  if (preserveNewlines)
    return 0;
  return state.isWindowsNewline = end !== 0 && chunk[end - 1] === "\r", state.isWindowsNewline ? 2 : 1;
}, linesFinal = function* ({ previousChunks }) {
  if (previousChunks.length > 0)
    yield previousChunks;
}, getAppendNewlineGenerator = ({ binary, preserveNewlines, readableObjectMode, state }) => binary || preserveNewlines || readableObjectMode ? void 0 : { transform: appendNewlineGenerator.bind(void 0, state) }, appendNewlineGenerator = function* ({ isWindowsNewline = !1 }, chunk) {
  let { unixNewline, windowsNewline, LF: LF2, concatBytes: concatBytes2 } = typeof chunk === "string" ? linesStringInfo : linesUint8ArrayInfo;
  if (chunk.at(-1) === LF2) {
    yield chunk;
    return;
  }
  yield concatBytes2(chunk, isWindowsNewline ? windowsNewline : unixNewline);
}, concatString = (firstChunk, secondChunk) => `${firstChunk}${secondChunk}`, linesStringInfo, concatUint8Array = (firstChunk, secondChunk) => {
  let chunk = new Uint8Array(firstChunk.length + secondChunk.length);
  return chunk.set(firstChunk, 0), chunk.set(secondChunk, firstChunk.length), chunk;
}, linesUint8ArrayInfo;
