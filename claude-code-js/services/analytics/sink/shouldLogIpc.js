// var: shouldLogIpc
var shouldLogIpc = (verboseInfo) => isFullVerbose(verboseInfo, "ipc"), logIpcOutput = (message, verboseInfo) => {
  let verboseMessage = serializeVerboseMessage(message);
  verboseLog({
    type: "ipc",
    verboseMessage,
    fdNumber: "ipc",
    verboseInfo
  });
};
