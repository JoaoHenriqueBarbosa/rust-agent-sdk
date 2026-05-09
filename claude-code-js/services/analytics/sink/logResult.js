// var: logResult
var logResult = (result, verboseInfo) => {
  if (!isVerbose(verboseInfo))
    return;
  logError(result, verboseInfo), logDuration(result, verboseInfo);
}, logDuration = (result, verboseInfo) => {
  let verboseMessage = `(done in ${prettyMilliseconds(result.durationMs)})`;
  verboseLog({
    type: "duration",
    verboseMessage,
    verboseInfo,
    result
  });
};
