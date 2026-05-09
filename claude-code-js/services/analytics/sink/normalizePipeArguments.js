// var: normalizePipeArguments
var normalizePipeArguments = ({ source, sourcePromise, boundOptions, createNested }, ...pipeArguments) => {
  let startTime = getStartTime(), {
    destination,
    destinationStream,
    destinationError,
    from,
    unpipeSignal
  } = getDestinationStream(boundOptions, createNested, pipeArguments), { sourceStream, sourceError } = getSourceStream(source, from), { options: sourceOptions, fileDescriptors } = SUBPROCESS_OPTIONS.get(source);
  return {
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
  };
}, getDestinationStream = (boundOptions, createNested, pipeArguments) => {
  try {
    let {
      destination,
      pipeOptions: { from, to, unpipeSignal } = {}
    } = getDestination(boundOptions, createNested, ...pipeArguments), destinationStream = getToStream(destination, to);
    return {
      destination,
      destinationStream,
      from,
      unpipeSignal
    };
  } catch (error41) {
    return { destinationError: error41 };
  }
}, getDestination = (boundOptions, createNested, firstArgument, ...pipeArguments) => {
  if (Array.isArray(firstArgument))
    return { destination: createNested(mapDestinationArguments, boundOptions)(firstArgument, ...pipeArguments), pipeOptions: boundOptions };
  if (typeof firstArgument === "string" || firstArgument instanceof URL || isDenoExecPath(firstArgument)) {
    if (Object.keys(boundOptions).length > 0)
      throw TypeError('Please use .pipe("file", ..., options) or .pipe(execa("file", ..., options)) instead of .pipe(options)("file", ...).');
    let [rawFile, rawArguments, rawOptions] = normalizeParameters(firstArgument, ...pipeArguments);
    return { destination: createNested(mapDestinationArguments)(rawFile, rawArguments, rawOptions), pipeOptions: rawOptions };
  }
  if (SUBPROCESS_OPTIONS.has(firstArgument)) {
    if (Object.keys(boundOptions).length > 0)
      throw TypeError("Please use .pipe(options)`command` or .pipe($(options)`command`) instead of .pipe(options)($`command`).");
    return { destination: firstArgument, pipeOptions: pipeArguments[0] };
  }
  throw TypeError(`The first argument must be a template string, an options object, or an Execa subprocess: ${firstArgument}`);
}, mapDestinationArguments = ({ options }) => ({ options: { ...options, stdin: "pipe", piped: !0 } }), getSourceStream = (source, from) => {
  try {
    return { sourceStream: getFromStream(source, from) };
  } catch (error41) {
    return { sourceError: error41 };
  }
};
