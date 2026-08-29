// var: generatorToStream
var generatorToStream = ({
  value,
  value: { transform: transform2, final, writableObjectMode, readableObjectMode },
  optionName
}, { encoding }) => {
  let state = {}, generators = addInternalGenerators(value, encoding, optionName), transformAsync = isAsyncGenerator(transform2), finalAsync = isAsyncGenerator(final), transformMethod = transformAsync ? pushChunks.bind(void 0, transformChunk, state) : pushChunksSync.bind(void 0, transformChunkSync), finalMethod = transformAsync || finalAsync ? pushChunks.bind(void 0, finalChunks, state) : pushChunksSync.bind(void 0, finalChunksSync), destroyMethod = transformAsync || finalAsync ? destroyTransform.bind(void 0, state) : void 0;
  return { stream: new Transform({
    writableObjectMode,
    writableHighWaterMark: getDefaultHighWaterMark(writableObjectMode),
    readableObjectMode,
    readableHighWaterMark: getDefaultHighWaterMark(readableObjectMode),
    transform(chunk, encoding2, done) {
      transformMethod([chunk, generators, 0], this, done);
    },
    flush(done) {
      finalMethod([generators], this, done);
    },
    destroy: destroyMethod
  }) };
}, runGeneratorsSync = (chunks, stdioItems, encoding, isInput) => {
  let generators = stdioItems.filter(({ type }) => type === "generator"), reversedGenerators = isInput ? generators.reverse() : generators;
  for (let { value, optionName } of reversedGenerators) {
    let generators2 = addInternalGenerators(value, encoding, optionName);
    chunks = runTransformSync(generators2, chunks);
  }
  return chunks;
}, addInternalGenerators = ({ transform: transform2, final, binary, writableObjectMode, readableObjectMode, preserveNewlines }, encoding, optionName) => {
  let state = {};
  return [
    { transform: getValidateTransformInput(writableObjectMode, optionName) },
    getEncodingTransformGenerator(binary, encoding, writableObjectMode),
    getSplitLinesGenerator(binary, preserveNewlines, writableObjectMode, state),
    { transform: transform2, final },
    { transform: getValidateTransformReturn(readableObjectMode, optionName) },
    getAppendNewlineGenerator({
      binary,
      preserveNewlines,
      readableObjectMode,
      state
    })
  ].filter(Boolean);
};
