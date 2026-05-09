// var: addInputOptionsSync
var addInputOptionsSync = (fileDescriptors, options) => {
  for (let fdNumber of getInputFdNumbers(fileDescriptors))
    addInputOptionSync(fileDescriptors, fdNumber, options);
}, getInputFdNumbers = (fileDescriptors) => new Set(Object.entries(fileDescriptors).filter(([, { direction }]) => direction === "input").map(([fdNumber]) => Number(fdNumber))), addInputOptionSync = (fileDescriptors, fdNumber, options) => {
  let { stdioItems } = fileDescriptors[fdNumber], allStdioItems = stdioItems.filter(({ contents }) => contents !== void 0);
  if (allStdioItems.length === 0)
    return;
  if (fdNumber !== 0) {
    let [{ type, optionName }] = allStdioItems;
    throw TypeError(`Only the \`stdin\` option, not \`${optionName}\`, can be ${TYPE_TO_MESSAGE[type]} with synchronous methods.`);
  }
  let transformedContents = allStdioItems.map(({ contents }) => contents).map((contents) => applySingleInputGeneratorsSync(contents, stdioItems));
  options.input = joinToUint8Array(transformedContents);
}, applySingleInputGeneratorsSync = (contents, stdioItems) => {
  let newContents = runGeneratorsSync(contents, stdioItems, "utf8", !0);
  return validateSerializable(newContents), joinToUint8Array(newContents);
}, validateSerializable = (newContents) => {
  let invalidItem = newContents.find((item) => typeof item !== "string" && !isUint8Array(item));
  if (invalidItem !== void 0)
    throw TypeError(`The \`stdin\` option is invalid: when passing objects as input, a transform must be used to serialize them to strings or Uint8Arrays: ${invalidItem}.`);
};
