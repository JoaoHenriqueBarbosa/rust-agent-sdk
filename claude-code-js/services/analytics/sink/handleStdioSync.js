// var: handleStdioSync
var handleStdioSync = (options, verboseInfo) => handleStdio(addPropertiesSync, options, verboseInfo, !0), forbiddenIfSync = ({ type, optionName }) => {
  throwInvalidSyncValue(optionName, TYPE_TO_MESSAGE[type]);
}, forbiddenNativeIfSync = ({ optionName, value }) => {
  if (value === "ipc" || value === "overlapped")
    throwInvalidSyncValue(optionName, `"${value}"`);
  return {};
}, throwInvalidSyncValue = (optionName, value) => {
  throw TypeError(`The \`${optionName}\` option cannot be ${value} with synchronous methods.`);
}, addProperties, addPropertiesSync;
