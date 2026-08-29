// var: handlePipeArgumentsError
var handlePipeArgumentsError = ({
  sourceStream,
  sourceError,
  destinationStream,
  destinationError,
  fileDescriptors,
  sourceOptions,
  startTime
}) => {
  let error41 = getPipeArgumentsError({
    sourceStream,
    sourceError,
    destinationStream,
    destinationError
  });
  if (error41 !== void 0)
    throw createNonCommandError({
      error: error41,
      fileDescriptors,
      sourceOptions,
      startTime
    });
}, getPipeArgumentsError = ({ sourceStream, sourceError, destinationStream, destinationError }) => {
  if (sourceError !== void 0 && destinationError !== void 0)
    return destinationError;
  if (destinationError !== void 0)
    return abortSourceStream(sourceStream), destinationError;
  if (sourceError !== void 0)
    return endDestinationStream(destinationStream), sourceError;
}, createNonCommandError = ({ error: error41, fileDescriptors, sourceOptions, startTime }) => makeEarlyError({
  error: error41,
  command: PIPE_COMMAND_MESSAGE,
  escapedCommand: PIPE_COMMAND_MESSAGE,
  fileDescriptors,
  options: sourceOptions,
  startTime,
  isSync: !1
}), PIPE_COMMAND_MESSAGE = "source.pipe(destination)";
