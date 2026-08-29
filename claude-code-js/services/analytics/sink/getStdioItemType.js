// var: getStdioItemType
var getStdioItemType = (value, optionName) => {
  if (isAsyncGenerator(value))
    return "asyncGenerator";
  if (isSyncGenerator(value))
    return "generator";
  if (isUrl(value))
    return "fileUrl";
  if (isFilePathObject(value))
    return "filePath";
  if (isWebStream(value))
    return "webStream";
  if (isStream(value, { checkOpen: !1 }))
    return "native";
  if (isUint8Array(value))
    return "uint8Array";
  if (isAsyncIterableObject(value))
    return "asyncIterable";
  if (isIterableObject(value))
    return "iterable";
  if (isTransformStream(value))
    return getTransformStreamType({ transform: value }, optionName);
  if (isTransformOptions(value))
    return getTransformObjectType(value, optionName);
  return "native";
}, getTransformObjectType = (value, optionName) => {
  if (isDuplexStream(value.transform, { checkOpen: !1 }))
    return getDuplexType(value, optionName);
  if (isTransformStream(value.transform))
    return getTransformStreamType(value, optionName);
  return getGeneratorObjectType(value, optionName);
}, getDuplexType = (value, optionName) => {
  return validateNonGeneratorType(value, optionName, "Duplex stream"), "duplex";
}, getTransformStreamType = (value, optionName) => {
  return validateNonGeneratorType(value, optionName, "web TransformStream"), "webTransform";
}, validateNonGeneratorType = ({ final, binary, objectMode }, optionName, typeName) => {
  checkUndefinedOption(final, `${optionName}.final`, typeName), checkUndefinedOption(binary, `${optionName}.binary`, typeName), checkBooleanOption(objectMode, `${optionName}.objectMode`);
}, checkUndefinedOption = (value, optionName, typeName) => {
  if (value !== void 0)
    throw TypeError(`The \`${optionName}\` option can only be defined when using a generator, not a ${typeName}.`);
}, getGeneratorObjectType = ({ transform: transform2, final, binary, objectMode }, optionName) => {
  if (transform2 !== void 0 && !isGenerator(transform2))
    throw TypeError(`The \`${optionName}.transform\` option must be a generator, a Duplex stream or a web TransformStream.`);
  if (isDuplexStream(final, { checkOpen: !1 }))
    throw TypeError(`The \`${optionName}.final\` option must not be a Duplex stream.`);
  if (isTransformStream(final))
    throw TypeError(`The \`${optionName}.final\` option must not be a web TransformStream.`);
  if (final !== void 0 && !isGenerator(final))
    throw TypeError(`The \`${optionName}.final\` option must be a generator.`);
  return checkBooleanOption(binary, `${optionName}.binary`), checkBooleanOption(objectMode, `${optionName}.objectMode`), isAsyncGenerator(transform2) || isAsyncGenerator(final) ? "asyncGenerator" : "generator";
}, checkBooleanOption = (value, optionName) => {
  if (value !== void 0 && typeof value !== "boolean")
    throw TypeError(`The \`${optionName}\` option must use a boolean.`);
}, isGenerator = (value) => isAsyncGenerator(value) || isSyncGenerator(value), isAsyncGenerator = (value) => Object.prototype.toString.call(value) === "[object AsyncGeneratorFunction]", isSyncGenerator = (value) => Object.prototype.toString.call(value) === "[object GeneratorFunction]", isTransformOptions = (value) => isPlainObject2(value) && (value.transform !== void 0 || value.final !== void 0), isUrl = (value) => Object.prototype.toString.call(value) === "[object URL]", isRegularUrl = (value) => isUrl(value) && value.protocol !== "file:", isFilePathObject = (value) => isPlainObject2(value) && Object.keys(value).length > 0 && Object.keys(value).every((key) => FILE_PATH_KEYS.has(key)) && isFilePathString(value.file), FILE_PATH_KEYS, isFilePathString = (file2) => typeof file2 === "string", isUnknownStdioString = (type, value) => type === "native" && typeof value === "string" && !KNOWN_STDIO_STRINGS.has(value), KNOWN_STDIO_STRINGS, isReadableStream2 = (value) => Object.prototype.toString.call(value) === "[object ReadableStream]", isWritableStream2 = (value) => Object.prototype.toString.call(value) === "[object WritableStream]", isWebStream = (value) => isReadableStream2(value) || isWritableStream2(value), isTransformStream = (value) => isReadableStream2(value?.readable) && isWritableStream2(value?.writable), isAsyncIterableObject = (value) => isObject3(value) && typeof value[Symbol.asyncIterator] === "function", isIterableObject = (value) => isObject3(value) && typeof value[Symbol.iterator] === "function", isObject3 = (value) => typeof value === "object" && value !== null, TRANSFORM_TYPES, FILE_TYPES, SPECIAL_DUPLICATE_TYPES_SYNC, SPECIAL_DUPLICATE_TYPES, FORBID_DUPLICATE_TYPES, TYPE_TO_MESSAGE;
