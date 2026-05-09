// var: logError
var logError = (result, verboseInfo) => {
  if (result.failed)
    verboseLog({
      type: "error",
      verboseMessage: result.shortMessage,
      verboseInfo,
      result
    });
};
