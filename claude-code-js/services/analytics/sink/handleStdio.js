// var: handleStdio
var handleStdio = (addProperties, options, verboseInfo, isSync) => {
  let initialFileDescriptors = normalizeStdioOption(options, verboseInfo, isSync).map((stdioOption, fdNumber) => getFileDescriptor({
    stdioOption,
    fdNumber,
    options,
    isSync
  })), fileDescriptors = getFinalFileDescriptors({
    initialFileDescriptors,
    addProperties,
    options,
    isSync
  });
  return options.stdio = fileDescriptors.map(({ stdioItems }) => forwardStdio(stdioItems)), fileDescriptors;
}, getFileDescriptor = ({ stdioOption, fdNumber, options, isSync }) => {
  let optionName = getStreamName(fdNumber), { stdioItems: initialStdioItems, isStdioArray } = initializeStdioItems({
    stdioOption,
    fdNumber,
    options,
    optionName
  }), direction = getStreamDirection(initialStdioItems, fdNumber, optionName), stdioItems = initialStdioItems.map((stdioItem) => handleNativeStream({
    stdioItem,
    isStdioArray,
    fdNumber,
    direction,
    isSync
  })), normalizedStdioItems = normalizeTransforms(stdioItems, optionName, direction, options), objectMode = getFdObjectMode(normalizedStdioItems, direction);
  return validateFileObjectMode(normalizedStdioItems, objectMode), { direction, objectMode, stdioItems: normalizedStdioItems };
}, initializeStdioItems = ({ stdioOption, fdNumber, options, optionName }) => {
  let initialStdioItems = [
    ...(Array.isArray(stdioOption) ? stdioOption : [stdioOption]).map((value) => initializeStdioItem(value, optionName)),
    ...handleInputOptions(options, fdNumber)
  ], stdioItems = filterDuplicates(initialStdioItems), isStdioArray = stdioItems.length > 1;
  return validateStdioArray(stdioItems, isStdioArray, optionName), validateStreams(stdioItems), { stdioItems, isStdioArray };
}, initializeStdioItem = (value, optionName) => ({
  type: getStdioItemType(value, optionName),
  value,
  optionName
}), validateStdioArray = (stdioItems, isStdioArray, optionName) => {
  if (stdioItems.length === 0)
    throw TypeError(`The \`${optionName}\` option must not be an empty array.`);
  if (!isStdioArray)
    return;
  for (let { value, optionName: optionName2 } of stdioItems)
    if (INVALID_STDIO_ARRAY_OPTIONS.has(value))
      throw Error(`The \`${optionName2}\` option must not include \`${value}\`.`);
}, INVALID_STDIO_ARRAY_OPTIONS, validateStreams = (stdioItems) => {
  for (let stdioItem of stdioItems)
    validateFileStdio(stdioItem);
}, validateFileStdio = ({ type, value, optionName }) => {
  if (isRegularUrl(value))
    throw TypeError(`The \`${optionName}: URL\` option must use the \`file:\` scheme.
For example, you can use the \`pathToFileURL()\` method of the \`url\` core module.`);
  if (isUnknownStdioString(type, value))
    throw TypeError(`The \`${optionName}: { file: '...' }\` option must be used instead of \`${optionName}: '...'\`.`);
}, validateFileObjectMode = (stdioItems, objectMode) => {
  if (!objectMode)
    return;
  let fileStdioItem = stdioItems.find(({ type }) => FILE_TYPES.has(type));
  if (fileStdioItem !== void 0)
    throw TypeError(`The \`${fileStdioItem.optionName}\` option cannot use both files and transforms in objectMode.`);
}, getFinalFileDescriptors = ({ initialFileDescriptors, addProperties, options, isSync }) => {
  let fileDescriptors = [];
  try {
    for (let fileDescriptor of initialFileDescriptors)
      fileDescriptors.push(getFinalFileDescriptor({
        fileDescriptor,
        fileDescriptors,
        addProperties,
        options,
        isSync
      }));
    return fileDescriptors;
  } catch (error41) {
    throw cleanupCustomStreams(fileDescriptors), error41;
  }
}, getFinalFileDescriptor = ({
  fileDescriptor: { direction, objectMode, stdioItems },
  fileDescriptors,
  addProperties,
  options,
  isSync
}) => {
  let finalStdioItems = stdioItems.map((stdioItem) => addStreamProperties({
    stdioItem,
    addProperties,
    direction,
    options,
    fileDescriptors,
    isSync
  }));
  return { direction, objectMode, stdioItems: finalStdioItems };
}, addStreamProperties = ({ stdioItem, addProperties, direction, options, fileDescriptors, isSync }) => {
  let duplicateStream = getDuplicateStream({
    stdioItem,
    direction,
    fileDescriptors,
    isSync
  });
  if (duplicateStream !== void 0)
    return { ...stdioItem, stream: duplicateStream };
  return {
    ...stdioItem,
    ...addProperties[direction][stdioItem.type](stdioItem, options)
  };
}, cleanupCustomStreams = (fileDescriptors) => {
  for (let { stdioItems } of fileDescriptors)
    for (let { stream } of stdioItems)
      if (stream !== void 0 && !isStandardStream(stream))
        stream.destroy();
}, forwardStdio = (stdioItems) => {
  if (stdioItems.length > 1)
    return stdioItems.some(({ value: value2 }) => value2 === "overlapped") ? "overlapped" : "pipe";
  let [{ type, value }] = stdioItems;
  return type === "native" ? value : "pipe";
};
