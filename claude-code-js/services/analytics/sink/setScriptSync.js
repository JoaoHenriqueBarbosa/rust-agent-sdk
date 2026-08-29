// var: setScriptSync
var setScriptSync = (boundExeca, createNested, boundOptions) => {
  boundExeca.sync = createNested(mapScriptSync, boundOptions), boundExeca.s = boundExeca.sync;
}, mapScriptAsync = ({ options }) => getScriptOptions(options), mapScriptSync = ({ options }) => ({ ...getScriptOptions(options), isSync: !0 }), getScriptOptions = (options) => ({ options: { ...getScriptStdinOption(options), ...options } }), getScriptStdinOption = ({ input, inputFile, stdio }) => input === void 0 && inputFile === void 0 && stdio === void 0 ? { stdin: "inherit" } : {}, deepScriptOptions;
