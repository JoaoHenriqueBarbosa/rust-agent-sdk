// var: normalizeParameters
var normalizeParameters = (rawFile, rawArguments = [], rawOptions = {}) => {
  let filePath = safeNormalizeFileUrl(rawFile, "First argument"), [commandArguments, options] = isPlainObject2(rawArguments) ? [[], rawArguments] : [rawArguments, rawOptions];
  if (!Array.isArray(commandArguments))
    throw TypeError(`Second argument must be either an array of arguments or an options object: ${commandArguments}`);
  if (commandArguments.some((commandArgument) => typeof commandArgument === "object" && commandArgument !== null))
    throw TypeError(`Second argument must be an array of strings: ${commandArguments}`);
  let normalizedArguments = commandArguments.map(String), nullByteArgument = normalizedArguments.find((normalizedArgument) => normalizedArgument.includes("\x00"));
  if (nullByteArgument !== void 0)
    throw TypeError(`Arguments cannot contain null bytes ("\\0"): ${nullByteArgument}`);
  if (!isPlainObject2(options))
    throw TypeError(`Last argument must be an options object: ${options}`);
  return [filePath, normalizedArguments, options];
};
