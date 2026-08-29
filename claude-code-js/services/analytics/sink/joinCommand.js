// var: joinCommand
var joinCommand = (filePath, rawArguments) => {
  let fileAndArguments = [filePath, ...rawArguments], command = fileAndArguments.join(" "), escapedCommand = fileAndArguments.map((fileAndArgument) => quoteString(escapeControlCharacters(fileAndArgument))).join(" ");
  return { command, escapedCommand };
}, escapeLines = (lines) => stripVTControlCharacters(lines).split(`
