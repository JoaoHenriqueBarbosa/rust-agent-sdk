// var: logCommand
var logCommand = (escapedCommand, verboseInfo) => {
  if (!isVerbose(verboseInfo))
    return;
  verboseLog({
    type: "command",
    verboseMessage: escapedCommand,
    verboseInfo
  });
};
