// var: handleStdioAsync
var handleStdioAsync = (options, verboseInfo) => handleStdio(addPropertiesAsync, options, verboseInfo, !1), forbiddenIfAsync = ({ type, optionName }) => {
  throw TypeError(`The \`${optionName}\` option cannot be ${TYPE_TO_MESSAGE[type]}.`);
}, addProperties2, addPropertiesAsync;
