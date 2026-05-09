// var: getToStream
var getToStream = (destination, to = "stdin") => {
  let { options, fileDescriptors } = SUBPROCESS_OPTIONS.get(destination), fdNumber = getFdNumber(fileDescriptors, to, !0), destinationStream = destination.stdio[fdNumber];
  if (destinationStream === null)
    throw TypeError(getInvalidStdioOptionMessage(fdNumber, to, options, !0));
  return destinationStream;
}, getFromStream = (source, from = "stdout") => {
  let { options, fileDescriptors } = SUBPROCESS_OPTIONS.get(source), fdNumber = getFdNumber(fileDescriptors, from, !1), sourceStream = fdNumber === "all" ? source.all : source.stdio[fdNumber];
  if (sourceStream === null || sourceStream === void 0)
    throw TypeError(getInvalidStdioOptionMessage(fdNumber, from, options, !1));
  return sourceStream;
}, SUBPROCESS_OPTIONS, getFdNumber = (fileDescriptors, fdName, isWritable) => {
  let fdNumber = parseFdNumber(fdName, isWritable);
  return validateFdNumber(fdNumber, fdName, isWritable, fileDescriptors), fdNumber;
}, parseFdNumber = (fdName, isWritable) => {
  let fdNumber = parseFd(fdName);
  if (fdNumber !== void 0)
    return fdNumber;
  let { validOptions, defaultValue } = isWritable ? { validOptions: '"stdin"', defaultValue: "stdin" } : { validOptions: '"stdout", "stderr", "all"', defaultValue: "stdout" };
  throw TypeError(`"${getOptionName(isWritable)}" must not be "${fdName}".
It must be ${validOptions} or "fd3", "fd4" (and so on).
It is optional and defaults to "${defaultValue}".`);
}, validateFdNumber = (fdNumber, fdName, isWritable, fileDescriptors) => {
  let fileDescriptor = fileDescriptors[getUsedDescriptor(fdNumber)];
  if (fileDescriptor === void 0)
    throw TypeError(`"${getOptionName(isWritable)}" must not be ${fdName}. That file descriptor does not exist.
Please set the "stdio" option to ensure that file descriptor exists.`);
  if (fileDescriptor.direction === "input" && !isWritable)
    throw TypeError(`"${getOptionName(isWritable)}" must not be ${fdName}. It must be a readable stream, not writable.`);
  if (fileDescriptor.direction !== "input" && isWritable)
    throw TypeError(`"${getOptionName(isWritable)}" must not be ${fdName}. It must be a writable stream, not readable.`);
}, getInvalidStdioOptionMessage = (fdNumber, fdName, options, isWritable) => {
  if (fdNumber === "all" && !options.all)
    return `The "all" option must be true to use "from: 'all'".`;
  let { optionName, optionValue } = getInvalidStdioOption(fdNumber, options);
  return `The "${optionName}: ${serializeOptionValue(optionValue)}" option is incompatible with using "${getOptionName(isWritable)}: ${serializeOptionValue(fdName)}".
Please set this option with "pipe" instead.`;
}, getInvalidStdioOption = (fdNumber, { stdin, stdout, stderr, stdio }) => {
  let usedDescriptor = getUsedDescriptor(fdNumber);
  if (usedDescriptor === 0 && stdin !== void 0)
    return { optionName: "stdin", optionValue: stdin };
  if (usedDescriptor === 1 && stdout !== void 0)
    return { optionName: "stdout", optionValue: stdout };
  if (usedDescriptor === 2 && stderr !== void 0)
    return { optionName: "stderr", optionValue: stderr };
  return { optionName: `stdio[${usedDescriptor}]`, optionValue: stdio[usedDescriptor] };
}, getUsedDescriptor = (fdNumber) => fdNumber === "all" ? 1 : fdNumber, getOptionName = (isWritable) => isWritable ? "to" : "from", serializeOptionValue = (value) => {
  if (typeof value === "string")
    return `'${value}'`;
  return typeof value === "number" ? `${value}` : "Stream";
};
