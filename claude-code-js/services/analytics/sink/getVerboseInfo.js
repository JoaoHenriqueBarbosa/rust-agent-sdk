// var: getVerboseInfo
var getVerboseInfo = (verbose, escapedCommand, rawOptions) => {
  validateVerbose(verbose);
  let commandId = getCommandId(verbose);
  return {
    verbose,
    escapedCommand,
    commandId,
    rawOptions
  };
}, getCommandId = (verbose) => isVerbose({ verbose }) ? COMMAND_ID++ : void 0, COMMAND_ID = 0n, validateVerbose = (verbose) => {
  for (let fdVerbose of verbose) {
    if (fdVerbose === !1)
      throw TypeError(`The "verbose: false" option was renamed to "verbose: 'none'".`);
    if (fdVerbose === !0)
      throw TypeError(`The "verbose: true" option was renamed to "verbose: 'short'".`);
    if (!VERBOSE_VALUES.includes(fdVerbose) && !isVerboseFunction(fdVerbose)) {
      let allowedValues = VERBOSE_VALUES.map((allowedValue) => `'${allowedValue}'`).join(", ");
      throw TypeError(`The "verbose" option must not be ${fdVerbose}. Allowed values are: ${allowedValues} or a function.`);
    }
  }
};
