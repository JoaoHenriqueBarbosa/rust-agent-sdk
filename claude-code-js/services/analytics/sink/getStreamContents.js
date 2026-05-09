// var: getStreamContents
var getStreamContents = async (stream, { init, convertChunk, getSize, truncateChunk, addChunk, getFinalChunk, finalize }, { maxBuffer = Number.POSITIVE_INFINITY } = {}) => {
  let asyncIterable = getAsyncIterable(stream), state = init();
  state.length = 0;
  try {
    for await (let chunk of asyncIterable) {
      let chunkType = getChunkType(chunk), convertedChunk = convertChunk[chunkType](chunk, state);
      appendChunk({
        convertedChunk,
        state,
        getSize,
        truncateChunk,
        addChunk,
        maxBuffer
      });
    }
    return appendFinalChunk({
      state,
      convertChunk,
      getSize,
      truncateChunk,
      addChunk,
      getFinalChunk,
      maxBuffer
    }), finalize(state);
  } catch (error41) {
    let normalizedError = typeof error41 === "object" && error41 !== null ? error41 : Error(error41);
    throw normalizedError.bufferedData = finalize(state), normalizedError;
  }
}, appendFinalChunk = ({ state, getSize, truncateChunk, addChunk, getFinalChunk, maxBuffer }) => {
  let convertedChunk = getFinalChunk(state);
  if (convertedChunk !== void 0)
    appendChunk({
      convertedChunk,
      state,
      getSize,
      truncateChunk,
      addChunk,
      maxBuffer
    });
}, appendChunk = ({ convertedChunk, state, getSize, truncateChunk, addChunk, maxBuffer }) => {
  let chunkSize = getSize(convertedChunk), newLength = state.length + chunkSize;
  if (newLength <= maxBuffer) {
    addNewChunk(convertedChunk, state, addChunk, newLength);
    return;
  }
  let truncatedChunk = truncateChunk(convertedChunk, maxBuffer - state.length);
  if (truncatedChunk !== void 0)
    addNewChunk(truncatedChunk, state, addChunk, maxBuffer);
  throw new MaxBufferError;
}, addNewChunk = (convertedChunk, state, addChunk, newLength) => {
  state.contents = addChunk(convertedChunk, state, newLength), state.length = newLength;
}, getChunkType = (chunk) => {
  let typeOfChunk = typeof chunk;
  if (typeOfChunk === "string")
    return "string";
  if (typeOfChunk !== "object" || chunk === null)
    return "others";
  if (globalThis.Buffer?.isBuffer(chunk))
    return "buffer";
  let prototypeName = objectToString3.call(chunk);
  if (prototypeName === "[object ArrayBuffer]")
    return "arrayBuffer";
  if (prototypeName === "[object DataView]")
    return "dataView";
  if (Number.isInteger(chunk.byteLength) && Number.isInteger(chunk.byteOffset) && objectToString3.call(chunk.buffer) === "[object ArrayBuffer]")
    return "typedArray";
  return "others";
}, objectToString3, MaxBufferError;
