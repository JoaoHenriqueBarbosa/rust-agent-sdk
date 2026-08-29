// var: pipeToSubprocess
var pipeToSubprocess = (sourceInfo, ...pipeArguments) => {
  if (isPlainObject2(pipeArguments[0]))
    return pipeToSubprocess.bind(void 0, {
      ...sourceInfo,
      boundOptions: { ...sourceInfo.boundOptions, ...pipeArguments[0] }
    });
  let { destination, ...normalizedInfo } = normalizePipeArguments(sourceInfo, ...pipeArguments), promise2 = handlePipePromise({ ...normalizedInfo, destination });
  return promise2.pipe = pipeToSubprocess.bind(void 0, {
    ...sourceInfo,
    source: destination,
    sourcePromise: promise2,
    boundOptions: {}
  }), promise2;
}, handlePipePromise = async ({
  sourcePromise,
  sourceStream,
  sourceOptions,
  sourceError,
  destination,
  destinationStream,
  destinationError,
  unpipeSignal,
  fileDescriptors,
  startTime
}) => {
  let subprocessPromises = getSubprocessPromises(sourcePromise, destination);
  handlePipeArgumentsError({
    sourceStream,
    sourceError,
    destinationStream,
    destinationError,
    fileDescriptors,
    sourceOptions,
    startTime
  });
  let maxListenersController = new AbortController;
  try {
    let mergedStream = pipeSubprocessStream(sourceStream, destinationStream, maxListenersController);
    return await Promise.race([
      waitForBothSubprocesses(subprocessPromises),
      ...unpipeOnAbort(unpipeSignal, {
        sourceStream,
        mergedStream,
        sourceOptions,
        fileDescriptors,
        startTime
      })
    ]);
  } finally {
    maxListenersController.abort();
  }
}, getSubprocessPromises = (sourcePromise, destination) => Promise.allSettled([sourcePromise, destination]);
