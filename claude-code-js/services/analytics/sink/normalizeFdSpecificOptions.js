// var: normalizeFdSpecificOptions
var normalizeFdSpecificOptions = (options) => {
  let optionsCopy = { ...options };
  for (let optionName of FD_SPECIFIC_OPTIONS)
    optionsCopy[optionName] = normalizeFdSpecificOption(options, optionName);
  return optionsCopy;
}, normalizeFdSpecificOption = (options, optionName) => {
  let optionBaseArray = Array.from({ length: getStdioLength(options) + 1 }), optionArray = normalizeFdSpecificValue(options[optionName], optionBaseArray, optionName);
  return addDefaultValue(optionArray, optionName);
}, getStdioLength = ({ stdio }) => Array.isArray(stdio) ? Math.max(stdio.length, STANDARD_STREAMS_ALIASES.length) : STANDARD_STREAMS_ALIASES.length, normalizeFdSpecificValue = (optionValue, optionArray, optionName) => isPlainObject2(optionValue) ? normalizeOptionObject(optionValue, optionArray, optionName) : optionArray.fill(optionValue), normalizeOptionObject = (optionValue, optionArray, optionName) => {
  for (let fdName of Object.keys(optionValue).sort(compareFdName))
    for (let fdNumber of parseFdName(fdName, optionName, optionArray))
      optionArray[fdNumber] = optionValue[fdName];
  return optionArray;
}, compareFdName = (fdNameA, fdNameB) => getFdNameOrder(fdNameA) < getFdNameOrder(fdNameB) ? 1 : -1, getFdNameOrder = (fdName) => {
  if (fdName === "stdout" || fdName === "stderr")
    return 0;
  return fdName === "all" ? 2 : 1;
}, parseFdName = (fdName, optionName, optionArray) => {
  if (fdName === "ipc")
    return [optionArray.length - 1];
  let fdNumber = parseFd(fdName);
  if (fdNumber === void 0 || fdNumber === 0)
    throw TypeError(`"${optionName}.${fdName}" is invalid.
It must be "${optionName}.stdout", "${optionName}.stderr", "${optionName}.all", "${optionName}.ipc", or "${optionName}.fd3", "${optionName}.fd4" (and so on).`);
  if (fdNumber >= optionArray.length)
    throw TypeError(`"${optionName}.${fdName}" is invalid: that file descriptor does not exist.
Please set the "stdio" option to ensure that file descriptor exists.`);
  return fdNumber === "all" ? [1, 2] : [fdNumber];
}, parseFd = (fdName) => {
  if (fdName === "all")
    return fdName;
  if (STANDARD_STREAMS_ALIASES.includes(fdName))
    return STANDARD_STREAMS_ALIASES.indexOf(fdName);
  let regexpResult = FD_REGEXP.exec(fdName);
  if (regexpResult !== null)
    return Number(regexpResult[1]);
}, FD_REGEXP, addDefaultValue = (optionArray, optionName) => optionArray.map((optionValue) => optionValue === void 0 ? DEFAULT_OPTIONS[optionName] : optionValue), verboseDefault, DEFAULT_OPTIONS, FD_SPECIFIC_OPTIONS, getFdSpecificValue = (optionArray, fdNumber) => fdNumber === "ipc" ? optionArray.at(-1) : optionArray[fdNumber];
