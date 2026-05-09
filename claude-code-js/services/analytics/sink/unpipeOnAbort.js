// var: unpipeOnAbort
var unpipeOnAbort = (unpipeSignal, unpipeContext) => unpipeSignal === void 0 ? [] : [unpipeOnSignalAbort(unpipeSignal, unpipeContext)], unpipeOnSignalAbort = async (unpipeSignal, { sourceStream, mergedStream, fileDescriptors, sourceOptions, startTime }) => {
  await aborted2(unpipeSignal, sourceStream), await mergedStream.remove(sourceStream);
  let error41 = Error("Pipe canceled by `unpipeSignal` option.");
  throw createNonCommandError({
    error: error41,
    fileDescriptors,
    sourceOptions,
    startTime
  });
};
