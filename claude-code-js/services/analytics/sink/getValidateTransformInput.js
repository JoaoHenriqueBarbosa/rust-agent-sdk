// var: getValidateTransformInput
var getValidateTransformInput = (writableObjectMode, optionName) => writableObjectMode ? void 0 : validateStringTransformInput.bind(void 0, optionName), validateStringTransformInput = function* (optionName, chunk) {
  if (typeof chunk !== "string" && !isUint8Array(chunk) && !Buffer4.isBuffer(chunk))
    throw TypeError(`The \`${optionName}\` option's transform must use "objectMode: true" to receive as input: ${typeof chunk}.`);
  yield chunk;
}, getValidateTransformReturn = (readableObjectMode, optionName) => readableObjectMode ? validateObjectTransformReturn.bind(void 0, optionName) : validateStringTransformReturn.bind(void 0, optionName), validateObjectTransformReturn = function* (optionName, chunk) {
  validateEmptyReturn(optionName, chunk), yield chunk;
}, validateStringTransformReturn = function* (optionName, chunk) {
  if (validateEmptyReturn(optionName, chunk), typeof chunk !== "string" && !isUint8Array(chunk))
    throw TypeError(`The \`${optionName}\` option's function must yield a string or an Uint8Array, not ${typeof chunk}.`);
  yield chunk;
}, validateEmptyReturn = (optionName, chunk) => {
  if (chunk === null || chunk === void 0)
    throw TypeError(`The \`${optionName}\` option's function must not call \`yield ${chunk}\`.
Instead, \`yield\` should either be called with a value, or not be called at all. For example:
  if (condition) { yield value; }`);
};
