// var: handleCommand
var handleCommand = (filePath, rawArguments, rawOptions) => {
  let startTime = getStartTime(), { command, escapedCommand } = joinCommand(filePath, rawArguments), verbose = normalizeFdSpecificOption(rawOptions, "verbose"), verboseInfo = getVerboseInfo(verbose, escapedCommand, { ...rawOptions });
  return logCommand(escapedCommand, verboseInfo), {
    command,
    escapedCommand,
    startTime,
    verboseInfo
  };
};
